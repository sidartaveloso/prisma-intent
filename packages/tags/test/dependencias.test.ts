/**
 * O pacote depende do core e das bibliotecas do micromark que leem e escrevem
 * as diretivas; nada além disso. O core segue sem dependências.
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { test } from "node:test";

const raiz = resolve(import.meta.dirname, "..");
const BIBLIOTECAS = [
	"mdast-util-directive",
	"mdast-util-from-markdown",
	"mdast-util-to-markdown",
	"micromark-extension-directive",
	"micromark-util-decode-string",
];

test("package.json: o core e as bibliotecas das diretivas", () => {
	const pacote = JSON.parse(readFileSync(join(raiz, "package.json"), "utf8"));
	assert.deepEqual(Object.keys(pacote.dependencies).sort(), [
		"@prisma-intent/core",
		...BIBLIOTECAS,
	]);
});

test("src/: todo import é relativo, do core, das bibliotecas ou de tipos", () => {
	const especificador = /(?:import|export)[^"']*?from\s*["']([^"']+)["']/g;
	for (const entrada of readdirSync(join(raiz, "src"), {
		withFileTypes: true,
	}).filter((entrada) => entrada.isFile())) {
		const arquivo = join(entrada.parentPath, entrada.name);
		for (const [, alvo] of readFileSync(arquivo, "utf8").matchAll(
			especificador,
		))
			assert.ok(
				alvo?.startsWith("./") ||
					alvo === "@prisma-intent/core" ||
					alvo === "mdast" ||
					BIBLIOTECAS.includes(alvo ?? ""),
				`${relative(raiz, arquivo)} importa ${alvo}`,
			);
	}
});

test("src/ não cita especialização", () => {
	for (const entrada of readdirSync(join(raiz, "src"), { withFileTypes: true }))
		assert.doesNotMatch(
			readFileSync(join(entrada.parentPath, entrada.name), "utf8"),
			/@prisma-intent\/(work|educate|sales|funding|tradeoff)\b/,
			entrada.name,
		);
});
