/**
 * A dependência é sempre `educate → core`; o pacote não guarda instância de
 * ninguém, não fixa idade e não leva o nome antigo.
 *
 * Conferido sobre os arquivos, não sobre a intenção.
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { test } from "node:test";

const raiz = resolve(import.meta.dirname, "..");
const esteArquivo = import.meta.filename;
const arquivos = (pasta: string): string[] =>
	readdirSync(join(raiz, pasta), { recursive: true, withFileTypes: true })
		.filter((entrada) => entrada.isFile())
		.map((entrada) => join(entrada.parentPath, entrada.name));

const pacote = JSON.parse(readFileSync(join(raiz, "package.json"), "utf8"));
const documentos = ["package.json", "README.md", "AGENTS.md"].map((nome) =>
	join(raiz, nome),
);
const doPacote = () => [
	...arquivos("src"),
	...arquivos("scripts"),
	...arquivos("test"),
	...documentos,
];

test("package.json: a única dependência é @prisma-intent/core", () => {
	assert.equal(pacote.name, "@prisma-intent/educate");
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

test("objetivo.ts só depende do core: está pronto para subir", () => {
	const fonte = readFileSync(join(raiz, "src", "objetivo.ts"), "utf8");
	const alvos = [...fonte.matchAll(/from\s*["']([^"']+)["']/g)].map(
		([, alvo]) => alvo,
	);
	assert.deepEqual(alvos, ["@prisma-intent/core"]);
});

test("src/ não fixa idade: nenhuma faixa etária no código do pacote", () => {
	for (const arquivo of arquivos("src"))
		assert.doesNotMatch(
			readFileSync(arquivo, "utf8"),
			/\b\d{1,2}\s*(a|–|-)\s*\d{1,2}\s*anos\b|\banos\s+de\s+idade\b/i,
			relative(raiz, arquivo),
		);
});

test("o nome antigo não sobra como pacote nem como especialização", () => {
	// A linha que um `@ts-expect-error` cobre afirma justamente que o nome
	// antigo não compila: ela fica fora da busca.
	const semLinhasRecusadas = (fonte: string) =>
		fonte.replace(/\/\/ @ts-expect-error[^\n]*\n[^\n]*\n/g, "");
	for (const arquivo of doPacote()) {
		if (arquivo === esteArquivo) continue;
		assert.doesNotMatch(
			semLinhasRecusadas(readFileSync(arquivo, "utf8")),
			/@prisma-intent\/educar\b|especializacao: "educar"/,
			relative(raiz, arquivo),
		);
	}
});

test("nenhum nome vedado no pacote", (t) => {
	// A lista de pessoas, produtos e organizações reais não mora aqui: num
	// repositório aberto, ela seria o vazamento. Quem tem nomes a vedar passa
	// uma expressão regular em PRISMA_NOMES_VEDADOS; sem ela, o teste é pulado e
	// diz por quê.
	const expressao = process.env.PRISMA_NOMES_VEDADOS;
	if (!expressao) {
		t.skip("PRISMA_NOMES_VEDADOS não definida");
		return;
	}
	const vedados = new RegExp(expressao, "i");
	for (const arquivo of doPacote())
		assert.doesNotMatch(
			readFileSync(arquivo, "utf8"),
			vedados,
			relative(raiz, arquivo),
		);
});
