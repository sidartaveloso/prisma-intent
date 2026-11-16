import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { test } from "node:test";

const raiz = resolve(import.meta.dirname, "..");
const tsx = createRequire(import.meta.url).resolve("tsx/cli");

test("emitir: o vocabulário sai em dist/, sem nada de instância", () => {
	const resultado = spawnSync(
		process.execPath,
		[tsx, join(raiz, "scripts", "emitir.ts")],
		{ cwd: raiz, encoding: "utf8" },
	);
	assert.equal(resultado.status, 0, resultado.stdout + resultado.stderr);

	const emitido = JSON.parse(
		readFileSync(join(raiz, "dist", "educate.vocabulario.json"), "utf8"),
	);
	assert.equal(emitido.produto.especializacao, "educate");
	assert.deepEqual(Object.keys(emitido.maquinasDeEstado), [
		"historia",
		"missao",
		"itemDaRotina",
		"contexto",
		"conteudo",
	]);
	assert.ok(emitido.perfisHumanos.aprendiz);
	assert.ok(emitido.efeitos.comportamentais.tentar_de_novo);
	// Canais, faixas e linhas são de cada instância: o pacote não tem o que emitir.
	for (const chave of ["canais", "faixasEtarias", "linhasDeConteudo"]) {
		assert.equal(emitido[chave], undefined, chave);
	}
});
