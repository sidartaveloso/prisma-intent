import assert from "node:assert/strict";
import { test } from "node:test";
import type { Vocabulario } from "@prisma-intent/core";
import {
	efeitosCognitivos,
	efeitosComportamentais,
	efeitosEmocionais,
	intencoesDoConsumidor,
	objecoesTipicas,
	papeisDeOrganizacao,
	perfisAgente,
	perfisHumanos,
	respostaTipicaDaObjecao,
	secoesDaProposta,
	sinaisDeLeitura,
	tiposDeEvidencia,
	tiposDeIntencao,
	tiposDeRenderizacao,
} from "../src/index.ts";

const vocabularios: Record<string, Vocabulario<string>> = {
	perfisHumanos,
	perfisAgente,
	...Object.fromEntries(
		Object.entries(intencoesDoConsumidor).map(([familia, termos]) => [
			`intencoesDoConsumidor.${familia}`,
			termos,
		]),
	),
	tiposDeIntencao,
	efeitosCognitivos,
	efeitosEmocionais,
	efeitosComportamentais,
	tiposDeEvidencia,
	objecoesTipicas,
	secoesDaProposta,
	tiposDeRenderizacao,
	sinaisDeLeitura,
	papeisDeOrganizacao,
};

for (const [nome, vocabulario] of Object.entries(vocabularios)) {
	test(`${nome}: todo termo tem id, nome e definição`, () => {
		const termos = Object.entries(vocabulario);
		assert.ok(termos.length > 0, `${nome} está vazio`);
		for (const [chave, termo] of termos) {
			assert.equal(termo.id, chave);
			assert.ok(termo.nome.trim().length > 0, `${nome}.${chave}: sem nome`);
			assert.ok(
				termo.descricao.trim().length > 0,
				`${nome}.${chave}: sem definição`,
			);
		}
	});
}

test("um objetivo do consumidor pertence a uma família só", () => {
	const vistos = new Map<string, string>();
	for (const [familia, termos] of Object.entries(intencoesDoConsumidor)) {
		for (const objetivo of Object.keys(termos)) {
			assert.ok(
				!vistos.has(objetivo),
				`${objetivo} está em ${vistos.get(objetivo)} e em ${familia}`,
			);
			vistos.set(objetivo, familia);
		}
	}
});

test("toda objeção típica tem a resposta que costuma funcionar, e só elas", () => {
	assert.deepEqual(
		Object.keys(respostaTipicaDaObjecao).sort(),
		Object.keys(objecoesTipicas).sort(),
	);
});

test("o esboço do pacote está coberto: leitores, efeitos e saídas", () => {
	assert.deepEqual(Object.keys(perfisHumanos).sort(), [
		"avaliador_do_cliente_final",
		"avaliador_tecnico",
		"compras",
		"decisor_comercial",
		"parceiro_de_canal",
	]);
	assert.deepEqual(Object.keys(perfisAgente), ["agente_de_triagem"]);
	assert.deepEqual(Object.keys(tiposDeRenderizacao).sort(), [
		"matriz_de_conformidade",
		"mensagem_de_envio",
		"pdf_da_proposta",
		"planilha_de_precos",
		"resumo_executivo",
		"site_da_proposta",
	]);
});

test("a estimativa é interna até no vocabulário: nenhuma seção a renderiza", () => {
	assert.ok(!("estimativa" in secoesDaProposta));
	assert.ok(!("entendimento" in secoesDaProposta));
	assert.match(
		tiposDeEvidencia.estimativa_rastreavel.descricao,
		/nunca é renderizada/,
	);
});

test("certificação só se renderiza com fonte confirmada", () => {
	assert.match(tiposDeEvidencia.certificacao.descricao, /fonte confirmada/);
});
