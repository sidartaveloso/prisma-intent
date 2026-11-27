import assert from "node:assert/strict";
import { test } from "node:test";
import type { Transicoes } from "../src/estados.ts";
import {
	transicaoValida,
	transicoesDaHistoria,
	transicoesDaMissao,
	transicoesDoConteudo,
	transicoesDoContexto,
	transicoesDoItemDaRotina,
} from "../src/estados.ts";

const maquinas: Record<
	string,
	{ transicoes: Transicoes<string>; inicial: string }
> = {
	historia: { transicoes: transicoesDaHistoria, inicial: "brief_definido" },
	missao: { transicoes: transicoesDaMissao, inicial: "proposta" },
	itemDaRotina: { transicoes: transicoesDoItemDaRotina, inicial: "previsto" },
	contexto: {
		transicoes: transicoesDoContexto,
		inicial: "informado_pela_instituicao",
	},
	conteudo: { transicoes: transicoesDoConteudo, inicial: "proposto" },
};

for (const [nome, { transicoes, inicial }] of Object.entries(maquinas)) {
	test(`${nome}: todo destino é um estado declarado`, () => {
		const estados = new Set(Object.keys(transicoes));
		for (const destinos of Object.values(transicoes)) {
			for (const destino of destinos)
				assert.ok(estados.has(destino), `${nome}: ${destino} não é estado`);
		}
	});

	test(`${nome}: todo estado é alcançável a partir de ${inicial}`, () => {
		const alcancados = new Set<string>([inicial]);
		const fila = [inicial];
		while (fila.length) {
			const atual = fila.shift() as string;
			for (const destino of transicoes[atual] ?? []) {
				if (!alcancados.has(destino)) {
					alcancados.add(destino);
					fila.push(destino);
				}
			}
		}
		for (const estado of Object.keys(transicoes)) {
			assert.ok(alcancados.has(estado), `${nome}: ${estado} não é alcançável`);
		}
	});
}

test("a confirmação de quem acompanha é o único caminho para liberar a missão", () => {
	const chegamEmLiberada = Object.entries(transicoesDaMissao)
		.filter(([, destinos]) => destinos.includes("liberada"))
		.map(([origem]) => origem);
	assert.deepEqual(chegamEmLiberada, ["preparada"]);
	assert.equal(
		transicaoValida(transicoesDaMissao, "enviada_a_quem_acompanha", "liberada"),
		false,
	);
});

test("recomendado só nasce do permitido, e permitido só do curado", () => {
	assert.deepEqual(
		Object.entries(transicoesDoConteudo)
			.filter(([, d]) => d.includes("recomendado_agora"))
			.map(([o]) => o),
		["permitido_por_quem_decide"],
	);
	assert.deepEqual(
		Object.entries(transicoesDoConteudo)
			.filter(([, d]) => d.includes("permitido_por_quem_decide"))
			.map(([o]) => o)
			.sort(),
		["bloqueado_por_quem_decide", "curado"],
	);
});

test("retirada e incorporada são terminais: nada é apagado", () => {
	assert.deepEqual(transicoesDaHistoria.retirada, []);
	assert.deepEqual(transicoesDaMissao.incorporada, []);
});
