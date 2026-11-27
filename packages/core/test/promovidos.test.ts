/**
 * O que o core ganhou na task-042 (promovido da Sales, usado também pela
 * Funding): a premissa, o dado interno e a observação dos efeitos.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import {
	type ConteudoRenderizavel,
	garantirRenderizavel,
	interno,
	type ObservacaoDosEfeitos,
	type Premissa,
	valorDaPremissa,
} from "../src/index.ts";

test("valorDaPremissa devolve o valor confirmado ou o de trabalho", () => {
	const confirmada: Premissa<number> = {
		estado: "confirmada",
		valor: 100,
		decisao: { pessoa: "autor", data: "2026-10-18", registro: "ata" },
	};
	const aConfirmar: Premissa<number> = {
		estado: "a_confirmar",
		valorDeTrabalho: 80,
	};
	assert.equal(valorDaPremissa(confirmada), 100);
	assert.equal(valorDaPremissa(aConfirmar), 80);
});

test("garantirRenderizavel devolve o conteúdo sem dado interno", () => {
	const conteudo = { titulo: "ok", itens: ["a", 1, true, null] };
	assert.equal(garantirRenderizavel(conteudo), conteudo);
});

test("garantirRenderizavel recusa dado interno em qualquer profundidade e diz o caminho", () => {
	const vazado = {
		secoes: [{ nota: interno("estratégia") }],
	} as unknown as ConteudoRenderizavel;
	assert.throws(
		() => garantirRenderizavel(vazado),
		/conteudo\.secoes\[0\]\.nota/,
	);
});

test("o tipo recusa dado interno em conteúdo renderizável", () => {
	// @ts-expect-error: TextoInterno não é ConteudoRenderizavel
	const _recusado: ConteudoRenderizavel = { nota: interno("estratégia") };
	assert.ok(_recusado);
});

type Universo = "agenda" | "encaminha" | "apoia";

test("ObservacaoDosEfeitos exige cada efeito desejado, e só no caso concreto", () => {
	const concreta: ObservacaoDosEfeitos<"agenda", Universo, string> = {
		agenda: "por resposta",
	};
	// @ts-expect-error: falta a observação de "agenda"
	const faltando: ObservacaoDosEfeitos<"agenda" | "apoia", Universo, string> = {
		apoia: "pela plataforma",
	};
	const generica: ObservacaoDosEfeitos<Universo, Universo, string> = {};
	assert.ok(concreta && faltando && generica);
});
