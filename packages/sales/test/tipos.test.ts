/**
 * Os testes de tipo (`*.tipos.ts`) não rodam: são conferidos pelo compilador.
 * Este teste roda o `tsc` do pacote para que `pnpm test` também os cubra, e
 * confere que eles continuam dentro do projeto — um `include` que os
 * deixasse de fora faria todos passarem sem conferir nada.
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tsc = createRequire(import.meta.url).resolve("typescript/lib/tsc.js");

const testesDeTipo = readdirSync(join(raiz, "test"))
	.filter((nome) => nome.endsWith(".tipos.ts"))
	.map((nome) => join(raiz, "test", nome));

test("há testes de tipo, e cada um afirma estados que não compilam", () => {
	assert.ok(testesDeTipo.length >= 2);
	for (const arquivo of testesDeTipo) {
		const diretivas = readFileSync(arquivo, "utf8").match(
			/^\s*\/\/ @ts-expect-error/gm,
		);
		assert.ok(diretivas && diretivas.length >= 10, arquivo);
	}
});

test("tsc: o pacote e os testes de tipo compilam sem erro", () => {
	const resultado = spawnSync(
		process.execPath,
		[tsc, "--noEmit", "-p", "tsconfig.json", "--listFilesOnly"],
		{ cwd: raiz, encoding: "utf8" },
	);
	const listados = resultado.stdout.split("\n").map((linha) => resolve(linha));
	for (const arquivo of testesDeTipo) {
		assert.ok(listados.includes(arquivo), `fora do projeto: ${arquivo}`);
	}

	const verificacao = spawnSync(
		process.execPath,
		[tsc, "--noEmit", "-p", "tsconfig.json", "--pretty", "false"],
		{ cwd: raiz, encoding: "utf8" },
	);
	assert.equal(verificacao.status, 0, verificacao.stdout + verificacao.stderr);
});
