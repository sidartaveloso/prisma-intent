/**
 * Leitura da marcação: texto com diretivas de texto do CommonMark
 * (`:tipo[rótulo]{#id atributo="valor"}`) para trechos do core.
 *
 * A árvore do `mdast-util-from-markdown` diz onde estão as tags, com o nome e
 * os atributos já decodificados. O texto livre entre elas sai da fonte, com os
 * escapes (`\:`) e as referências (`&#x20;`) decodificados pelo próprio
 * micromark: o CommonMark corta o recuo das linhas de continuação e transforma
 * dois espaços no fim da linha em quebra, e o texto corrido tem de voltar igual
 * ao original.
 */
import type {
	PeloMenosUm,
	RegistroDeTipos,
	Tag,
	TipoDeElemento,
	Trecho,
} from "@prisma-intent/core";
import type { Paragraph, PhrasingContent } from "mdast";
import {
	directiveFromMarkdown,
	type TextDirective,
} from "mdast-util-directive";
import { fromMarkdown } from "mdast-util-from-markdown";
import { directive } from "micromark-extension-directive";
import { decodeString } from "micromark-util-decode-string";
import { NOME_DO_TIPO } from "./nomes.ts";
import type {
	FalhaDeMarcacao,
	Intervalo,
	Pedaco,
	PontoNoTexto,
	ResultadoDaLeitura,
} from "./tipos.ts";

/**
 * As construções do CommonMark que a marcação não usa. Desligadas, um `*`, um
 * `#` no começo da linha ou quatro espaços de recuo são texto. Ficam ligados o
 * parágrafo, o escape com `\` e a referência (`&#x20;`), que a escrita usa.
 */
const DESLIGADAS = [
	"attention",
	"autolink",
	"blockQuote",
	"codeFenced",
	"codeIndented",
	"codeText",
	"definition",
	"hardBreakEscape",
	"headingAtx",
	"htmlFlow",
	"htmlText",
	"labelEnd",
	"labelStartImage",
	"labelStartLink",
	"list",
	"setextUnderline",
	"thematicBreak",
];

/**
 * Da extensão de diretivas, só a de texto. As de folha (`::nome`) e de bloco
 * (`:::nome`) não têm nome de construção, e o `disable` não as alcança: ficam
 * de fora por não serem registradas.
 */
const { text: SO_DIRETIVA_DE_TEXTO } = directive();

const OPCOES = {
	extensions: [
		{ text: SO_DIRETIVA_DE_TEXTO },
		{ disable: { null: DESLIGADAS } },
	],
	mdastExtensions: [directiveFromMarkdown()],
};

/** Converte deslocamento em linha e coluna. */
function localizador(texto: string): (deslocamento: number) => PontoNoTexto {
	const inicios = [0];
	for (let i = 0; i < texto.length; i++)
		if (texto[i] === "\n") inicios.push(i + 1);
	return (deslocamento) => {
		let baixo = 0;
		let alto = inicios.length - 1;
		while (baixo < alto) {
			const meio = (baixo + alto + 1) >> 1;
			if ((inicios[meio] ?? 0) <= deslocamento) baixo = meio;
			else alto = meio - 1;
		}
		return {
			linha: baixo + 1,
			coluna: deslocamento - (inicios[baixo] ?? 0) + 1,
			deslocamento,
		};
	};
}

/** O índice do `]` que fecha o `[` em `abre`, com colchetes equilibrados e escapes. */
function fechamentoDoRotulo(texto: string, abre: number): number {
	let profundidade = 0;
	for (let i = abre; i < texto.length; i++) {
		const caractere = texto[i];
		if (caractere === "\\") i++;
		else if (caractere === "[") profundidade++;
		else if (caractere === "]" && --profundidade === 0) return i;
	}
	return -1;
}

/** Uma diretiva de texto, com o que a fonte diz dela. */
interface Diretiva {
	no: TextDirective;
	inicio: number;
	fim: number;
	/** Interior do rótulo, na fonte; ausente quando não há `[…]`. */
	rotulo: { inicio: number; fim: number } | undefined;
	temAtributos: boolean;
}

function diretiva(texto: string, no: TextDirective): Diretiva {
	const inicio = no.position?.start.offset ?? 0;
	const fim = no.position?.end.offset ?? inicio;
	const abre = inicio + 1 + no.name.length;
	const fecha = texto[abre] === "[" ? fechamentoDoRotulo(texto, abre) : -1;
	return {
		no,
		inicio,
		fim,
		rotulo:
			fecha === -1 || fecha >= fim
				? undefined
				: { inicio: abre + 1, fim: fecha },
		temAtributos: texto[fim - 1] === "}",
	};
}

/**
 * Diretiva que fica como texto: a sem rótulo e sem atributos, como o `:30` de
 * `10:30` ou o `:1` de `3:1`, que não pode ser tag porque toda tag tem `#id`; e
 * a de nome que não se escreve como diretiva (o micromark aceita `:` seguido
 * de tabulação).
 */
function nua(texto: string, d: Diretiva): boolean {
	if (!NOME_DO_TIPO.test(d.no.name)) return true;
	return (
		d.rotulo === undefined &&
		!d.temAtributos &&
		texto[d.fim] !== "[" &&
		texto[d.fim] !== "{"
	);
}

function diretivasDoParagrafo(paragrafo: Paragraph): TextDirective[] {
	return paragrafo.children.filter(
		(filho: PhrasingContent): filho is TextDirective =>
			filho.type === "textDirective",
	);
}

/** Confere uma tag contra o catálogo; devolve as falhas dela. */
function conferir(
	texto: string,
	d: Diretiva,
	catalogo: RegistroDeTipos,
	intervalo: Intervalo,
): FalhaDeMarcacao[] {
	const tipo = d.no.name;
	if (!d.temAtributos && (texto[d.fim] === "{" || texto[d.fim] === "["))
		return [
			{
				falha: "tag_sem_fechamento",
				tipo,
				aberto: texto[d.fim] === "{" ? "atributos" : "rotulo",
				intervalo,
			},
		];
	const falhas: FalhaDeMarcacao[] = [];
	const aninhada = d.no.children.find(
		(filho) =>
			filho.type === "textDirective" &&
			!nua(texto, diretiva(texto, filho as TextDirective)),
	);
	if (aninhada) falhas.push({ falha: "tag_no_rotulo", tipo, intervalo });
	if (!Object.hasOwn(catalogo, tipo))
		return [...falhas, { falha: "tipo_nao_registrado", tipo, intervalo }];
	const declarado = catalogo[tipo] as TipoDeElemento;
	const { id, ...atributos } = d.no.attributes ?? {};
	if (!id) falhas.push({ falha: "id_ausente", tipo, intervalo });
	const presentes = Object.keys(atributos);
	for (const atributo of presentes) {
		if (!Object.hasOwn(declarado.atributos, atributo)) {
			falhas.push({
				falha: "atributo_nao_declarado",
				tipo,
				atributo,
				intervalo,
			});
			continue;
		}
		const regra = declarado.atributos[atributo];
		const valor = atributos[atributo] ?? "";
		if (regra?.valores === "enumerados" && !regra.aceitos.includes(valor))
			falhas.push({
				falha: "valor_fora_dos_aceitos",
				tipo,
				atributo,
				valor,
				aceitos: regra.aceitos,
				intervalo,
			});
	}
	for (const [atributo, regra] of Object.entries(declarado.atributos)) {
		if (presentes.includes(atributo) || regra.presenca === "opcional") continue;
		if (regra.presenca === "obrigatoria") {
			falhas.push({
				falha: "atributo_obrigatorio_ausente",
				tipo,
				atributo,
				exigido: { por: "sempre" },
				intervalo,
			});
			continue;
		}
		const [primeiro, ...outros] = regra.presente.filter((nome) =>
			presentes.includes(nome),
		);
		if (primeiro !== undefined)
			falhas.push({
				falha: "atributo_obrigatorio_ausente",
				tipo,
				atributo,
				exigido: {
					por: "atributos_presentes",
					presentes: [primeiro, ...outros],
				},
				intervalo,
			});
	}
	return falhas;
}

/**
 * Lê um texto com tags, conferindo cada uma contra o catálogo.
 *
 * Texto sem tag volta como um trecho só (ou nenhum, se for vazio). Os trechos
 * nunca têm texto vazio nem dois textos seguidos. Uma falha em qualquer tag
 * recusa a leitura inteira, com todas as falhas encontradas.
 *
 * @example
 * lerMarcacao("Assina :parte[a locadora]{#locadora atributo=\"nome\"}.", tipos)
 * // { resultado: "lido", trechos: ["Assina ", { tipo: "parte", id: "locadora",
 * //   atributos: { atributo: "nome" }, rotulo: "a locadora" }, "."], pedacos: [...] }
 */
export function lerMarcacao<TTipo extends string>(
	texto: string,
	catalogo: RegistroDeTipos<TTipo>,
): ResultadoDaLeitura<Tag<TTipo>> {
	const arvore = fromMarkdown(texto, OPCOES);
	const ponto = localizador(texto);
	const pedacos: Pedaco<Tag<TTipo>>[] = [];
	const falhas: FalhaDeMarcacao[] = [];
	let cursor = 0;

	const textoAte = (fim: number) => {
		if (fim > cursor)
			pedacos.push({
				trecho: decodeString(texto.slice(cursor, fim)),
				intervalo: { inicio: ponto(cursor), fim: ponto(fim) },
			});
	};

	for (const paragrafo of arvore.children) {
		if (paragrafo.type !== "paragraph") continue;
		for (const no of diretivasDoParagrafo(paragrafo)) {
			const d = diretiva(texto, no);
			if (nua(texto, d)) continue;
			const intervalo = { inicio: ponto(d.inicio), fim: ponto(d.fim) };
			const daTag = conferir(texto, d, catalogo as RegistroDeTipos, intervalo);
			falhas.push(...daTag);
			textoAte(d.inicio);
			cursor = d.fim;
			if (daTag.length > 0) continue;
			const { id, ...atributos } = no.attributes ?? {};
			pedacos.push({
				trecho: {
					tipo: no.name as TTipo,
					id: id ?? "",
					atributos: Object.fromEntries(
						Object.entries(atributos).map(([nome, valor]) => [
							nome,
							valor ?? "",
						]),
					),
					rotulo: d.rotulo
						? decodeString(texto.slice(d.rotulo.inicio, d.rotulo.fim))
						: "",
				},
				intervalo,
			});
		}
	}
	textoAte(texto.length);

	const [primeira, ...outras] = falhas;
	if (primeira !== undefined)
		return {
			resultado: "recusado",
			falhas: [primeira, ...outras] as PeloMenosUm<FalhaDeMarcacao>,
		};
	return {
		resultado: "lido",
		trechos: pedacos.map((pedaco) => pedaco.trecho as Trecho<Tag<TTipo>>),
		pedacos,
	};
}
