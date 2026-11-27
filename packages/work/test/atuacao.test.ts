import assert from "node:assert/strict";
import { test } from "node:test";
import { casesEmAndamento, estadoDaAtuacao } from "../src/atuacao.ts";
import { exemplo } from "./exemplo.ts";

const caseDe = (id: string) => {
	const achado = exemplo.cases.find((candidato) => candidato.id === id);
	assert.ok(achado, `case ${id}`);
	return achado;
};

test("produto encerrado encerra a atuação, mesmo com outro produto em curso na organização", () => {
	assert.equal(
		estadoDaAtuacao(exemplo, caseDe("central-de-chamados")),
		"encerrada",
	);
});

test("a atuação declarada no case vale mais do que o vínculo com a organização", () => {
	// A experiência na organização está encerrada; ela voltou como prestadora.
	assert.equal(estadoDaAtuacao(exemplo, caseDe("painel-de-frotas")), "atual");
});

test("sem atuação própria, vale a experiência na organização do case", () => {
	assert.equal(
		estadoDaAtuacao(exemplo, caseDe("migracao-de-pagamentos")),
		"atual",
	);
});

test("cases em andamento saem na ordem em que a instância os declara", () => {
	assert.deepEqual(
		casesEmAndamento(exemplo).map(({ id }) => id),
		["migracao-de-pagamentos", "painel-de-frotas"],
	);
});
