/**
 * A garantia do pacote: `lerMarcacao(escreverMarcacao(x))` devolve `x`, e o
 * texto corrido do que se lê reproduz o original. Além dos casos escritos à
 * mão, trechos aleatórios (com semente fixa, para o teste repetir) cobrem os
 * caracteres que o CommonMark trata como marcação.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import type { Tag, Trecho } from "@prisma-intent/core";
import { escreverMarcacao, lerMarcacao } from "../src/index.ts";
import { tipos } from "./catalogo.ts";

type TipoDoCatalogo = keyof typeof tipos;

function lerAceito(texto: string) {
	const lido = lerMarcacao(texto, tipos);
	assert.equal(lido.resultado, "lido", JSON.stringify(lido));
	if (lido.resultado !== "lido") throw new Error("inalcançável");
	return lido;
}

/** O texto como uma pessoa o lê: cada tag pelo rótulo. */
const textoCorrido = (trechos: readonly Trecho[]) =>
	trechos
		.map((trecho) => (typeof trecho === "string" ? trecho : trecho.rotulo))
		.join("");

test("texto sem tag volta como um trecho só, igual ao original", () => {
	for (const texto of [
		"Uma frase.",
		"  recuo\n    de quatro espaços\n\n\n  e linhas vazias  \n",
		"# não é título\n- nem lista\n> nem citação\n*nem ênfase* `nem código` <b> [nem](link)",
		"às 10:30, na proporção 3:1, com e-mail:fulano e https://exemplo.test/a:b",
		"dois espaços no fim  \ne barra no fim\\\nficam como estão",
	])
		assert.deepEqual(lerAceito(texto).trechos, [texto]);
	assert.deepEqual(lerAceito("").trechos, []);
});

test("o texto corrido reproduz o original, com cada tag pelo rótulo", () => {
	const texto =
		"Assina :parte[a locadora]{#locadora atributo=nome}, às 10:30,\n   conforme :clausula[a cláusula 3]{#c3 mostrar=numero}.\n\n  Fim.  \n";
	assert.equal(
		textoCorrido(lerAceito(texto).trechos),
		"Assina a locadora, às 10:30,\n   conforme a cláusula 3.\n\n  Fim.  \n",
	);
});

test("cada pedaço diz o intervalo do texto de onde veio", () => {
	const texto = "Prazo de\n:termo_do_acordo[30 dias]{#prazo} corridos.";
	const { pedacos } = lerAceito(texto);
	assert.deepEqual(
		pedacos.map(({ intervalo }) =>
			texto.slice(intervalo.inicio.deslocamento, intervalo.fim.deslocamento),
		),
		["Prazo de\n", ":termo_do_acordo[30 dias]{#prazo}", " corridos."],
	);
	assert.deepEqual(pedacos[1]?.intervalo.inicio, {
		linha: 2,
		coluna: 1,
		deslocamento: 9,
	});
});

test("escreverMarcacao gera a forma canônica: #id, atributos em ordem alfabética e entre aspas", () => {
	assert.equal(
		escreverMarcacao([
			"Conforme ",
			{
				tipo: "definicao",
				id: "locacao",
				atributos: { preposicao: "de", art: "3", artigo: "definido" },
				rotulo: "locação",
			},
			" e :isto, às 10:30.",
		]),
		'Conforme :definicao[locação]{#locacao art="3" artigo="definido" preposicao="de"} e \\:isto, às 10\\:30.',
	);
	assert.equal(
		escreverMarcacao(lerAceito(":clausula[c]{mostrar='numero' #c1}").trechos),
		':clausula[c]{#c1 mostrar="numero"}',
	);
});

test("a escrita separa parágrafos na linha vazia, e a leitura os junta de volta", () => {
	const trechos = ["Primeiro.\n\nSegundo.\n\n\nTerceiro."];
	const escrito = escreverMarcacao(trechos);
	assert.equal(escrito, "Primeiro.\n\nSegundo.\n\n&#xA;Terceiro.");
	assert.deepEqual(lerAceito(escrito).trechos, trechos);
});

test("escreverMarcacao recusa a tag que não tem escrita como diretiva", () => {
	const tag = (parcial: Partial<Tag & { rotulo: string }>) => [
		{ tipo: "parte", id: "a", atributos: {}, rotulo: "a", ...parcial },
	];
	assert.throws(() => escreverMarcacao(tag({ id: "" })), RangeError);
	assert.throws(
		() => escreverMarcacao(tag({ tipo: "com espaço" })),
		RangeError,
	);
	assert.throws(() => escreverMarcacao(tag({ tipo: "termina_" })), RangeError);
	assert.throws(
		() => escreverMarcacao(tag({ atributos: { id: "b" } })),
		RangeError,
	);
	assert.throws(
		() => escreverMarcacao(tag({ atributos: { class: "b" } })),
		RangeError,
	);
	assert.throws(
		() => escreverMarcacao(tag({ atributos: { "a b": "c" } })),
		RangeError,
	);
});

/** Gerador pseudoaleatório com semente (mulberry32): o teste repete. */
function sorteador(semente: number) {
	let estado = semente;
	const proximo = () => {
		estado = (estado + 0x6d2b79f5) | 0;
		let t = Math.imul(estado ^ (estado >>> 15), 1 | estado);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
	const inteiro = (limite: number) => Math.floor(proximo() * limite);
	const um = <T>(lista: readonly T[]): T => lista[inteiro(lista.length)] as T;
	return { proximo, inteiro, um };
}

/** Os caracteres que o CommonMark, as diretivas ou o escape tratam de modo especial. */
const ALFABETO = [
	..."aZ9çã ",
	" ",
	"\n",
	"\t",
	...":[]{}#.=\"'\\*_`<>&;|!-+~()$%@/",
	"&amp;",
	"&#x20;",
	":isto",
	"10:30",
	"[[a:b|c]]",
	"\n\n",
	"    ",
];

function textoAleatorio(
	s: ReturnType<typeof sorteador>,
	maximo: number,
): string {
	let texto = "";
	const tamanho = 1 + s.inteiro(maximo);
	for (let i = 0; i < tamanho; i++) texto += s.um(ALFABETO);
	return texto;
}

/** Uma tag válida no catálogo, com rótulo e valores aleatórios. */
function tagAleatoria(
	s: ReturnType<typeof sorteador>,
): Tag<TipoDoCatalogo> & { rotulo: string } {
	const rotulo = s.proximo() < 0.15 ? "" : textoAleatorio(s, 12);
	const id = s.um(["a", "locadora", "c-1", "x_y", "a b", 'aspas"', "#.{}"]);
	// valor com linha vazia não tem escrita como diretiva (a escrita recusa)
	const livre = () => textoAleatorio(s, 8).replace(/\n(?:[ \t]*\n)+/g, "\n");
	switch (s.inteiro(5)) {
		case 0:
			return {
				tipo: "parte",
				id,
				atributos:
					s.proximo() < 0.5
						? {}
						: { atributo: "nome", preposicao: "de", com_rotulo: "sim" },
				rotulo,
			};
		case 1:
			return { tipo: "termo_do_acordo", id, atributos: {}, rotulo };
		case 2:
			return { tipo: "concordancia", id, atributos: { voce: livre() }, rotulo };
		case 3:
			return {
				tipo: "definicao",
				id,
				atributos: {
					art: livre(),
					par: livre(),
					inc: livre(),
					al: livre(),
					numero: "plural",
				},
				rotulo,
			};
		default:
			return {
				tipo: "clausula",
				id,
				atributos: { mostrar: "numero_e_titulo" },
				rotulo,
			};
	}
}

/** Trechos na forma que a leitura produz: sem texto vazio nem dois textos seguidos. */
function trechosAleatorios(
	s: ReturnType<typeof sorteador>,
): Trecho<Tag<TipoDoCatalogo>>[] {
	const trechos: Trecho<Tag<TipoDoCatalogo>>[] = [];
	const quantos = s.inteiro(7);
	for (let i = 0; i < quantos; i++) {
		const anterior = trechos.at(-1);
		if (typeof anterior !== "string" && s.proximo() < 0.6)
			trechos.push(textoAleatorio(s, 20));
		else trechos.push(tagAleatoria(s));
	}
	return trechos;
}

test("lerMarcacao(escreverMarcacao(x)) devolve x, em 3000 trechos aleatórios", () => {
	for (let semente = 1; semente <= 3000; semente++) {
		const trechos = trechosAleatorios(sorteador(semente));
		const escrito = escreverMarcacao(trechos);
		const lido = lerMarcacao(escrito, tipos);
		assert.deepEqual(
			lido.resultado === "lido" ? lido.trechos : lido,
			trechos,
			`semente ${semente}: ${JSON.stringify(escrito)}`,
		);
	}
});

test("o texto corrido de um texto aleatório sem tag é o próprio texto", () => {
	for (let semente = 1; semente <= 2000; semente++) {
		const s = sorteador(semente);
		// sem o escape e a referência, que a leitura decodifica por definição
		const texto = textoAleatorio(s, 40)
			.replace(/[\\&]/g, "")
			.replace(/:(?=[\p{L}\p{N}])/gu, ": ");
		const lido = lerMarcacao(texto, tipos);
		assert.equal(
			lido.resultado === "lido"
				? textoCorrido(lido.trechos)
				: JSON.stringify(lido),
			texto,
			`semente ${semente}`,
		);
	}
});
