/**
 * A dependência é sempre `funding → core`, como na Sales e na Educate, e o
 * pacote não guarda dado de campanha ou produto concreto.
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { test } from "node:test";

const raiz = resolve(import.meta.dirname, "..");
const arquivos = (pasta: string): string[] =>
	readdirSync(join(raiz, pasta), { recursive: true, withFileTypes: true })
		.filter((entrada) => entrada.isFile())
		.map((entrada) => join(entrada.parentPath, entrada.name));

test("package.json: a única dependência é @prisma-intent/core", () => {
	const pacote = JSON.parse(readFileSync(join(raiz, "package.json"), "utf8"));
	assert.deepEqual(pacote.dependencies, {
		"@prisma-intent/core": "workspace:*",
	});
});

test("src/: todo import é relativo ou de @prisma-intent/core", () => {
	const especificador = /(?:import|export)[^"']*?from\s*["']([^"']+)["']/g;
	for (const arquivo of arquivos("src"))
		for (const [, alvo] of readFileSync(arquivo, "utf8").matchAll(
			especificador,
		))
			assert.ok(
				alvo?.startsWith("./") || alvo === "@prisma-intent/core",
				`${relative(raiz, arquivo)} importa ${alvo}`,
			);
});

test("src/ não cita outra especialização", () => {
	for (const arquivo of arquivos("src"))
		assert.doesNotMatch(
			readFileSync(arquivo, "utf8"),
			/@prisma-intent\/(work|educate|sales)\b/,
			relative(raiz, arquivo),
		);
});

test("nenhum nome vedado no pacote", (t) => {
	// A lista de produtos e organizações reais não mora aqui: num repositório
	// aberto, ela seria o vazamento. Quem tem nomes a vedar passa uma expressão
	// regular em PRISMA_NOMES_VEDADOS; sem ela, o teste é pulado e diz por quê.
	const expressao = process.env.PRISMA_NOMES_VEDADOS;
	if (!expressao) {
		t.skip("PRISMA_NOMES_VEDADOS não definida");
		return;
	}
	// A falha diz só o arquivo e a linha. Imprimir a expressão ou o trecho que
	// casou poria num log justamente o que a variável existe para esconder — e
	// o erro de uma expressão inválida traz a expressão inteira.
	let vedados: RegExp;
	try {
		vedados = new RegExp(expressao, "i");
	} catch {
		throw new Error("PRISMA_NOMES_VEDADOS não é uma expressão regular válida");
	}
	const documentos = ["package.json", "README.md", "AGENTS.md"].map((nome) =>
		join(raiz, nome),
	);
	for (const arquivo of [
		...arquivos("src"),
		...arquivos("test"),
		...documentos,
	]) {
		const fonte = readFileSync(arquivo, "utf8");
		const achado = vedados.exec(fonte);
		if (achado) {
			const linha = fonte.slice(0, achado.index).split("\n").length;
			assert.fail(`${relative(raiz, arquivo)}:${linha} cita um nome vedado`);
		}
	}
});
