/**
 * O tipo recusa o dado interno no compilador (`conteudo-interno.tipos.ts`).
 * Estes testes conferem a outra metade: em execução, a projeção de fato
 * retira o dado — o TypeScript aceita propriedade a mais, e um objeto pode
 * levar o entendimento num campo que o tipo não declara.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import {
	garantirRenderizavel,
	interno,
	pacoteParaLeitor,
	requisitoParaLeitor,
	valorDaPremissa,
} from "../src/index.ts";
import { propostaDeExemplo } from "./exemplo.ts";

const textosInternos = propostaDeExemplo.escopo.requisitos.map(
	(requisito) => requisito.entendimento.texto,
);

test("interno() marca o texto como dado interno", () => {
	assert.deepEqual(interno("nota"), { visibilidade: "interna", texto: "nota" });
});

test("requisitoParaLeitor retira o entendimento, e só ele", () => {
	for (const requisito of propostaDeExemplo.escopo.requisitos) {
		const projetado = requisitoParaLeitor(requisito);
		assert.ok(!("entendimento" in projetado));
		const { entendimento: _entendimento, ...esperado } = requisito;
		assert.deepEqual(projetado, esperado);
	}
});

test("o JSON da matriz projetada não contém nenhum entendimento", () => {
	const json = JSON.stringify(
		garantirRenderizavel(
			propostaDeExemplo.escopo.requisitos.map(requisitoParaLeitor),
		),
	);
	for (const texto of textosInternos) assert.ok(!json.includes(texto));
	assert.ok(!json.includes("interna"));
});

test("pacoteParaLeitor retira a estimativa do pacote do proponente", () => {
	for (const pacote of propostaDeExemplo.escopo.pacotes) {
		const projetado = pacoteParaLeitor(pacote);
		assert.ok(!("estimativa" in projetado));
		assert.equal(projetado.id, pacote.id);
		assert.equal(projetado.responsavel, pacote.responsavel);
	}
	const json = JSON.stringify(
		garantirRenderizavel(
			propostaDeExemplo.escopo.pacotes.map(pacoteParaLeitor),
		),
	);
	assert.ok(!json.includes("porEstimador"));
	assert.ok(!json.includes("Estimadora A"));
});

test("garantirRenderizavel recusa dado interno que chegou por fora do tipo", () => {
	const [requisito] = propostaDeExemplo.escopo.requisitos;
	assert.ok(requisito);
	// Um `as` é o caminho por fora do compilador: a conferência em execução pega.
	const contrabando = {
		secao: "escopo",
		itens: [{ titulo: requisito.titulo, nota: requisito.entendimento }],
	} as unknown as { secao: string };
	assert.throws(
		() => garantirRenderizavel(contrabando),
		/conteudo\.itens\[0\]\.nota/,
	);
});

test("garantirRenderizavel devolve o conteúdo limpo sem alterá-lo", () => {
	const conteudo = { secao: "escopo", itens: [{ titulo: "Agenda" }] };
	assert.equal(garantirRenderizavel(conteudo), conteudo);
});

test("valorDaPremissa calcula com o valor confirmado ou com o de trabalho", () => {
	assert.equal(
		valorDaPremissa({ estado: "a_confirmar", valorDeTrabalho: 168 }),
		168,
	);
	assert.deepEqual(valorDaPremissa(propostaDeExemplo.preco.taxaPorHora), {
		forma: "por_hora",
		valor: { centavos: 10_000, moeda: "USD" },
	});
});
