/**
 * O alias nao tem codigo proprio: cada subcaminho e o pacote com escopo
 * correspondente. Conferido por identidade, nao por nome — um reexport que
 * apontasse para outro pacote passaria num teste que so olhasse os nomes.
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { test } from "node:test";

const raiz = resolve(import.meta.dirname, "..");
const pacote = JSON.parse(readFileSync(join(raiz, "package.json"), "utf8"));

/**
 * Pacotes que nao sao especializacao: o core, o proprio alias e as ferramentas,
 * que ficam fora do alias para nao levar as dependencias delas a quem instala
 * `prisma-intent` (o `tags` depende do micromark).
 */
const FORA_DO_ALIAS = ["core", "prisma-intent", "tags"];

/** As especializacoes que existem no repositorio, pela pasta. */
const especializacoes = readdirSync(resolve(raiz, ".."), {
	withFileTypes: true,
})
	.filter(
		(entrada) => entrada.isDirectory() && !FORA_DO_ALIAS.includes(entrada.name),
	)
	.map((entrada) => entrada.name)
	.sort();

test("prisma-intent e o core, e cada subcaminho e a especializacao", async () => {
	assert.deepEqual(
		await import("prisma-intent"),
		await import("@prisma-intent/core"),
	);
	for (const nome of especializacoes) {
		assert.deepEqual(
			await import(`prisma-intent/${nome}`),
			await import(`@prisma-intent/${nome}`),
			nome,
		);
	}
});

test("toda especializacao do repositorio tem subcaminho e dependencia no alias", () => {
	assert.deepEqual(
		Object.keys(pacote.exports).sort(),
		[".", ...especializacoes.map((nome) => `./${nome}`)].sort(),
	);
	assert.deepEqual(
		Object.keys(pacote.dependencies).sort(),
		["core", ...especializacoes].map((nome) => `@prisma-intent/${nome}`).sort(),
	);
});

test("o alias sai na mesma versao dos pacotes que reexporta", () => {
	for (const nome of ["core", ...especializacoes]) {
		const dependencia = JSON.parse(
			readFileSync(resolve(raiz, "..", nome, "package.json"), "utf8"),
		);
		assert.equal(dependencia.version, pacote.version, nome);
	}
});
