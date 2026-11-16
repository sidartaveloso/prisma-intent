import assert from "node:assert/strict";
import { test } from "node:test";
import { verificarRegras } from "@prisma-intent/core";
import { verboNaoObservavel } from "../src/objetivo.ts";
import { regrasDoDominio } from "../src/regras.ts";
import { efeitosComportamentais } from "../src/vocabulario.ts";
import {
	briefDeCrianca,
	efeitosDaInfancia,
	efeitosDoCurso,
} from "./exemplo.ts";

test("acompanhamento com minutos e cliques é barrado", () => {
	const violacoes = verificarRegras(
		"Hoje a Lia ficou 47 minutos assistindo e deu 32 cliques.",
		regrasDoDominio,
	);
	assert.ok(violacoes.length >= 2);
	assert.ok(violacoes.every((v) => v.regra.includes("minutos assistidos")));
});

test("acompanhamento por vivência passa (o que viveu, o que fez depois)", () => {
	const violacoes = verificarRegras(
		"Hoje a Lia assistiu à aventura sobre vulcões e depois foi construir um vulcão de papelão com o Téo.",
		regrasDoDominio,
	);
	assert.deepEqual(violacoes, []);
});

test("moral declarada é barrada; conclusão formada pelo aprendiz passa", () => {
	assert.ok(
		verificarRegras(
			"E a moral da história é: nem sempre ganhar é o objetivo.",
			regrasDoDominio,
		).length > 0,
	);
	assert.deepEqual(
		verificarRegras(
			"A goleira olhou para quem tinha ganhado, respirou fundo e disse: boa!",
			regrasDoDominio,
		),
		[],
	);
});

test("as regras da casa se somam às do domínio", () => {
	const regras = [...regrasDoDominio, ...briefDeCrianca.regrasDaCasa];
	assert.equal(verificarRegras("O jogo terminou 3 a 1.", regras).length, 1);
	assert.deepEqual(verificarRegras("O jogo terminou.", regrasDoDominio), []);
});

test("todo efeito comportamental da base é algo que dá para ver (Mager)", () => {
	for (const termo of Object.values(efeitosComportamentais)) {
		assert.equal(
			verboNaoObservavel(termo.nome),
			undefined,
			`${termo.id}: verbo não observável no nome`,
		);
	}
});

test("a mesma exigência serve aos efeitos que cada instância soma", () => {
	for (const termo of [
		...Object.values(efeitosDaInfancia),
		...Object.values(efeitosDoCurso),
	]) {
		assert.equal(verboNaoObservavel(termo.nome), undefined, termo.id);
	}
	assert.equal(verboNaoObservavel("Compreender o outro"), "compreender");
	assert.equal(verboNaoObservavel("Sentir orgulho"), "sentir");
});
