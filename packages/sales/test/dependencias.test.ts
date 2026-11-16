/**
 * A dependência é sempre `sales → core`, e o pacote não guarda dado de
 * proposta concreta.
 *
 * Conferido sobre os arquivos, não sobre a intenção: um import de `work` ou de
 * `educate` compilaria normalmente no monorepo, e um nome de empresa num
 * comentário passaria por qualquer revisão apressada.
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const esteArquivo = fileURLToPath(import.meta.url);

function arquivos(pasta: string): string[] {
	return readdirSync(join(raiz, pasta), {
		recursive: true,
		withFileTypes: true,
	})
		.filter((entrada) => entrada.isFile())
		.map((entrada) => join(entrada.parentPath, entrada.name));
}

const pacote = JSON.parse(readFileSync(join(raiz, "package.json"), "utf8"));

test("package.json: a única dependência é @prisma-intent/core", () => {
	assert.deepEqual(pacote.dependencies, {
		"@prisma-intent/core": "workspace:*",
	});
	assert.equal(pacote.peerDependencies, undefined);
	assert.equal(pacote.optionalDependencies, undefined);
	for (const nome of Object.keys(pacote.devDependencies ?? {})) {
		assert.ok(!nome.startsWith("@prisma-intent/"), `devDependency: ${nome}`);
	}
});

test("src/: todo import é relativo ou de @prisma-intent/core", () => {
	const especificador = /(?:import|export)[^"']*?from\s*["']([^"']+)["']/g;
	for (const arquivo of arquivos("src")) {
		const fonte = readFileSync(arquivo, "utf8");
		for (const [, alvo] of fonte.matchAll(especificador)) {
			assert.ok(
				alvo?.startsWith("./") || alvo === "@prisma-intent/core",
				`${relative(raiz, arquivo)} importa ${alvo}`,
			);
		}
	}
});

test("nenhum arquivo do pacote cita outra especialização como dependência", () => {
	for (const arquivo of [...arquivos("src"), ...arquivos("test")]) {
		if (arquivo === esteArquivo) continue;
		const fonte = readFileSync(arquivo, "utf8");
		assert.doesNotMatch(
			fonte,
			/@prisma-intent\/(work|educate|funding)/,
			relative(raiz, arquivo),
		);
	}
});

test("nenhum nome vedado no pacote", (t) => {
	// A lista de organizações reais não mora aqui: num repositório aberto, ela
	// seria o vazamento. Quem tem nomes a vedar passa uma expressão regular em
	// PRISMA_NOMES_VEDADOS; sem ela, o teste é pulado e diz por quê.
	const expressao = process.env.PRISMA_NOMES_VEDADOS;
	if (!expressao) {
		t.skip("PRISMA_NOMES_VEDADOS não definida");
		return;
	}
	const vedados = new RegExp(expressao, "i");
	const documentos = ["package.json", "README.md", "AGENTS.md"].map((nome) =>
		join(raiz, nome),
	);
	for (const arquivo of [
		...arquivos("src"),
		...arquivos("test"),
		...documentos,
	]) {
		if (arquivo === esteArquivo) continue;
		assert.doesNotMatch(
			readFileSync(arquivo, "utf8"),
			vedados,
			relative(raiz, arquivo),
		);
	}
});
