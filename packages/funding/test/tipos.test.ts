/**
 * Estados que o compilador recusa. Cada `@ts-expect-error` é uma asserção
 * invertida: se o erro deixar de existir, o `tsc` do `typecheck` falha.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { definirCampanha } from "../src/index.ts";
import { exemplo } from "./exemplo.ts";

test("o compilador exige a observação de cada efeito comportamental", () => {
	const campanha = definirCampanha({
		...exemplo,
		// @ts-expect-error: falta a observação de apoia_a_campanha
		observacaoDosEfeitos: {},
	});
	assert.ok(campanha);
});

test("o compilador recusa renderização com conteúdo inexistente", () => {
	const campanha = definirCampanha({
		...exemplo,
		renderizacoes: [
			{
				tipo: "pagina_da_campanha",
				prioridade: "critica",
				objetivo: "levar a apoiar",
				profundidade: "alta",
				// @ts-expect-error: "inventado" não é argumento nem objeção
				conteudoPrioritario: ["funciona", "inventado"],
			},
		],
	});
	assert.ok(campanha);
});
