/**
 * Os scripts recebem a instância por argumento, porque o pacote não tem
 * nenhuma. Aqui eles rodam de verdade, como processo, sobre a instância
 * fictícia.
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test } from "node:test";
import { exemplo } from "./exemplo.ts";

const raiz = resolve(import.meta.dirname, "..");
const tsx = createRequire(import.meta.url).resolve("tsx/cli");
const moduloDoExemplo = join(raiz, "test", "exemplo.ts");

const rodar = (script: string, ...argumentos: string[]) =>
	spawnSync(
		process.execPath,
		[tsx, join(raiz, "scripts", script), ...argumentos],
		{ cwd: raiz, encoding: "utf8" },
	);

const pastaTemporaria = () => mkdtempSync(join(tmpdir(), "prisma-work-"));

test("emitir: gera o JSON e o JSON-LD da instância informada", () => {
	const saida = pastaTemporaria();
	const resultado = rodar("emitir.ts", moduloDoExemplo, "--saida", saida);
	assert.equal(resultado.status, 0, resultado.stdout + resultado.stderr);

	const id = exemplo.instancia.id;
	const json = JSON.parse(readFileSync(join(saida, `${id}.json`), "utf8"));
	assert.equal(json.pessoa.nome, exemplo.pessoa.nome);

	const jsonLd = JSON.parse(readFileSync(join(saida, `${id}.jsonld`), "utf8"));
	const tipos = jsonLd["@graph"].map((no: { "@type": string }) => no["@type"]);
	assert.deepEqual(tipos, [
		"Person",
		"SoftwareApplication",
		"SoftwareApplication",
		"SoftwareApplication",
		"Dataset",
	]);
});

test("emitir: sem o módulo da instância, é erro", () => {
	const resultado = rodar("emitir.ts");
	assert.equal(resultado.status, 1);
	assert.match(resultado.stderr, /informe o módulo/);
});

test("verificar-publicacao: artefato limpo passa", () => {
	const publicado = pastaTemporaria();
	writeFileSync(join(publicado, "index.html"), "<h1>Ana Exemplo</h1>");
	const resultado = rodar(
		"verificar-publicacao.ts",
		"--instancia",
		moduloDoExemplo,
		publicado,
	);
	assert.equal(resultado.status, 0, resultado.stdout + resultado.stderr);
	assert.match(resultado.stdout, /publicação limpa/);
});

test("verificar-publicacao: a estratégia no artefato é vazamento", () => {
	const publicado = pastaTemporaria();
	const [objecao] = exemplo.objecoes;
	assert.ok(objecao);
	writeFileSync(
		join(publicado, "app.js"),
		`const o = ${JSON.stringify(objecao.hipotese)};`,
	);
	const resultado = rodar(
		"verificar-publicacao.ts",
		"--instancia",
		moduloDoExemplo,
		publicado,
	);
	assert.equal(resultado.status, 1);
	assert.match(resultado.stderr, /vazamento/);
	assert.match(resultado.stderr, new RegExp(objecao.id));
});

test("verificar-publicacao: falha fechado sem instância, sem diretório e com diretório vazio", () => {
	const vazio = pastaTemporaria();
	assert.equal(rodar("verificar-publicacao.ts", vazio).status, 1);
	assert.equal(
		rodar("verificar-publicacao.ts", "--instancia", moduloDoExemplo).status,
		1,
	);
	assert.equal(
		rodar("verificar-publicacao.ts", "--instancia", moduloDoExemplo, vazio)
			.status,
		1,
	);
	assert.equal(
		rodar(
			"verificar-publicacao.ts",
			"--instancia",
			moduloDoExemplo,
			join(vazio, "nao-existe"),
		).status,
		1,
	);
});
