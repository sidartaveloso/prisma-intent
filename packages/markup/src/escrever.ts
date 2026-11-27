/**
 * Escrita da marcação: trechos do core para texto com diretivas de texto do
 * CommonMark, na forma canônica.
 *
 * A forma canônica é a do `mdast-util-to-markdown` com o `mdast-util-directive`:
 * o id em `#id`, os outros atributos em ordem alfabética, cada valor entre
 * aspas, e o escape do CommonMark (`\:`, `\[`, `&#x20;`) onde o texto livre
 * seria lido como marcação ou perderia espaço.
 */
import type { Tag, Trecho } from "@prisma-intent/core";
import type { Paragraph, PhrasingContent, Root } from "mdast";
import { directiveToMarkdown, type TextDirective } from "mdast-util-directive";
import { toMarkdown } from "mdast-util-to-markdown";
import { NOME_DO_TIPO } from "./nomes.ts";

/** Nome de atributo de diretiva, como em HTML. */
const NOME_DO_ATRIBUTO = /^[A-Za-z_:][A-Za-z0-9_.:-]*$/;

/**
 * `:` seguido de letra ou dígito é escapado sempre. O `mdast-util-directive`
 * condiciona o escape a não haver `:` antes, e o `mdast-util-to-markdown`, ao
 * ver o caractere anterior escapado, pula o escape: `_:isto` saía `\_:isto`,
 * que se lê como tag. Um padrão sem condição anterior desliga esse atalho.
 */
const DOIS_PONTOS_ANTES_DE_NOME = {
	character: ":",
	after: "[^\\s\\p{P}\\p{S}]",
	inConstruct: "phrasing",
	unicode: true,
} as const;

/** Linha vazia: encerra o parágrafo, e com ele a diretiva. */
const LINHA_VAZIA = /\n[ \t]*\n/;

/**
 * O que não tem escrita como diretiva: tipo que não é nome de diretiva, id
 * vazio, atributo `id` ou `class` (têm forma própria), nome que não é de
 * atributo e valor com linha vazia.
 */
function conferirEscrevivel(tag: Tag): void {
	const recusar = (motivo: string) => {
		throw new RangeError(
			`tag de ${tag.tipo} sem escrita como diretiva: ${motivo}`,
		);
	};
	if (!NOME_DO_TIPO.test(tag.tipo)) recusar("o tipo não é nome de diretiva");
	if (tag.id === "") recusar("id vazio");
	if (LINHA_VAZIA.test(tag.id)) recusar("id com linha vazia");
	for (const [nome, valor] of Object.entries(tag.atributos)) {
		if (nome === "id" || nome === "class" || !NOME_DO_ATRIBUTO.test(nome))
			recusar(`atributo ${nome}`);
		if (LINHA_VAZIA.test(valor)) recusar(`atributo ${nome} com linha vazia`);
	}
}

function emDiretiva(tag: Trecho & object): TextDirective {
	conferirEscrevivel(tag);
	const nomes = Object.keys(tag.atributos).sort();
	return {
		type: "textDirective",
		name: tag.tipo,
		attributes: {
			id: tag.id,
			...Object.fromEntries(nomes.map((nome) => [nome, tag.atributos[nome]])),
		},
		children: tag.rotulo === "" ? [] : [{ type: "text", value: tag.rotulo }],
	};
}

/**
 * Escreve trechos como texto com tags, na forma canônica.
 *
 * Inversa de `lerMarcacao`: `lerMarcacao(escreverMarcacao(trechos), catalogo)`
 * devolve os mesmos trechos quando eles não têm texto vazio nem dois textos
 * seguidos (a forma que a leitura produz) e as tags passam no catálogo.
 *
 * Recusa, com `RangeError`, a tag que não tem escrita como diretiva: tipo que
 * não é nome de diretiva, id vazio e atributo `id`, `class` ou com nome que
 * não é de atributo.
 *
 * @example
 * escreverMarcacao(["Assina ", { tipo: "parte", id: "locadora",
 *   atributos: { atributo: "nome" }, rotulo: "a locadora" }, "."])
 * // 'Assina :parte[a locadora]{#locadora atributo="nome"}.'
 */
export function escreverMarcacao<TTag extends Tag>(
	trechos: readonly Trecho<TTag>[],
): string {
	const arvore: Root = { type: "root", children: emParagrafos(trechos) };
	const saida = toMarkdown(arvore, {
		extensions: [directiveToMarkdown()],
		unsafe: [DOIS_PONTOS_ANTES_DE_NOME],
	});
	return saida.endsWith("\n") ? saida.slice(0, -1) : saida;
}

/**
 * Separa os trechos em parágrafos onde o texto tem uma linha vazia (`\n\n`),
 * para que um documento longo continue legível na forma canônica. A leitura
 * devolve a linha vazia entre parágrafos como texto. Onde a separação deixaria
 * um parágrafo vazio, a linha vazia fica no texto, escrita com `&#xA;`.
 */
function emParagrafos(trechos: readonly Trecho[]): Paragraph[] {
	const paragrafos: Paragraph[] = [];
	let atual: PhrasingContent[] = [];
	const acrescentar = (texto: string) => {
		if (texto === "") return;
		const ultimo = atual.at(-1);
		if (ultimo?.type === "text") ultimo.value += texto;
		else atual.push({ type: "text", value: texto });
	};
	trechos.forEach((trecho, posicao) => {
		if (typeof trecho !== "string") {
			atual.push(emDiretiva(trecho));
			return;
		}
		const partes = trecho.split("\n\n");
		const haMaisDepois = posicao < trechos.length - 1;
		partes.forEach((parte, indice) => {
			if (indice > 0) {
				const resta = partes.slice(indice).join("") !== "" || haMaisDepois;
				if (atual.length > 0 && resta) {
					paragrafos.push({ type: "paragraph", children: atual });
					atual = [];
				} else acrescentar("\n\n");
			}
			acrescentar(parte);
		});
	});
	if (atual.length > 0 || paragrafos.length === 0)
		paragrafos.push({ type: "paragraph", children: atual });
	return paragrafos;
}
