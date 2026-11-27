import assert from "node:assert/strict";
import { test } from "node:test";
import { descreverQuantidade } from "../src/redacao.ts";

test("cada precisão da quantidade escolhe o próprio advérbio", () => {
	assert.equal(
		descreverQuantidade({ tipo: "exata", valor: 2 }, "dias úteis"),
		"2 dias úteis",
	);
	assert.equal(
		descreverQuantidade({ tipo: "aproximada", valor: 2 }, "dias úteis"),
		"cerca de 2 dias úteis",
	);
	assert.equal(
		descreverQuantidade({ tipo: "minima", valor: 2 }, "dias úteis"),
		"mais de 2 dias úteis",
	);
	assert.equal(
		descreverQuantidade({ tipo: "maxima", valor: 2 }, "dias úteis"),
		"até 2 dias úteis",
	);
});
