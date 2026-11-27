/**
 * O core não tem dependências (pacote 2026-000003, decisão 5; task-016). A
 * leitura e a escrita da marcação, que dependem do micromark, moram em
 * `@prisma-intent/markup`.
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { test } from "node:test";

const raiz = resolve(import.meta.dirname, "..");

test("package.json: o core não tem dependências", () => {
	const pacote = JSON.parse(readFileSync(join(raiz, "package.json"), "utf8"));
	assert.equal(pacote.dependencies, undefined);
	assert.equal(pacote.peerDependencies, undefined);
	assert.equal(pacote.optionalDependencies, undefined);
});

test("src/: todo import é relativo", () => {
	const especificador = /(?:import|export)[^"']*?from\s*["']([^"']+)["']/g;
	for (const entrada of readdirSync(join(raiz, "src"), {
		recursive: true,
		withFileTypes: true,
	}).filter((entrada) => entrada.isFile())) {
		const arquivo = join(entrada.parentPath, entrada.name);
		for (const [, alvo] of readFileSync(arquivo, "utf8").matchAll(
			especificador,
		))
			assert.ok(
				alvo?.startsWith("./"),
				`${relative(raiz, arquivo)} importa ${alvo}`,
			);
	}
});
