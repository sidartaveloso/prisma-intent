/**
 * O mesmo `Brief` serve a quem tem outra pessoa decidindo e a quem decide por
 * si. Aqui se confere o que só aparece em execução; o que o compilador recusa
 * está em `estados-ilegais.tipos.ts`.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { efeitosCobertos, efeitosSemObjetivo } from "../src/brief.ts";
import { briefDeAdulto, briefDeCrianca } from "./exemplo.ts";

test("os dois briefs são da mesma especialização", () => {
	for (const brief of [briefDeCrianca, briefDeAdulto]) {
		assert.deepEqual(brief.produto, {
			nome: "PRISMA Intent",
			especializacao: "educate",
		});
	}
});

test("quem decide: outra pessoa pela criança, o próprio aprendiz adulto", () => {
	assert.equal(briefDeCrianca.publico.quemDecide.tipo, "outra_pessoa");
	assert.equal(briefDeAdulto.publico.quemDecide.tipo, "o_proprio_aprendiz");
	assert.equal(briefDeAdulto.publico.faixa, undefined);
});

test("efeito sem objetivo observável é lista para a curadoria, não erro", () => {
	assert.deepEqual(efeitosCobertos(briefDeCrianca), [
		"cumprimentar_quem_ganhou",
	]);
	assert.deepEqual(efeitosSemObjetivo(briefDeCrianca), [
		"convidar_para_jogar_de_novo",
	]);
	assert.deepEqual(efeitosSemObjetivo(briefDeAdulto), []);
});

test("toda missão de quem acompanha libera uma missão do aprendiz", () => {
	for (const brief of [briefDeCrianca, briefDeAdulto]) {
		const doAprendiz = new Set<string>(
			brief.missoesDoAprendiz.map(({ id }) => id),
		);
		for (const missao of brief.missoesDeQuemAcompanha) {
			assert.ok(doAprendiz.has(missao.libera), missao.id);
		}
	}
});
