/**
 * Os exemplos `ts` do README da raiz não ficam para trás.
 *
 * O README mostra recortes: `/* … *\/` marca o que foi deixado de fora, e um
 * recorte assim não compila sozinho. Por isso cada bloco tem um arquivo
 * `readme.exemplo*.ts` ao lado deste teste, com o exemplo inteiro, que o
 * compilador confere junto do pacote. Este teste fecha o elo que falta: o
 * bloco do README precisa ser, linha a linha e na ordem, um recorte do arquivo
 * compilado.
 *
 * O erro que o exemplo anuncia é conferido pelo `@ts-expect-error`: se a
 * referência errada passasse a compilar, a diretiva ficaria sem uso e o `tsc`
 * reprovaria.
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { test } from "node:test";

const raiz = resolve(import.meta.dirname, "..");
const readme = readFileSync(resolve(raiz, "../../README.md"), "utf8");
const tsc = createRequire(import.meta.url).resolve("typescript/lib/tsc.js");

const blocos = [...readme.matchAll(/^```ts\n([\s\S]*?)^```/gm)].map(
	([, codigo]) => codigo ?? "",
);
const exemplos = readdirSync(join(raiz, "test"))
	.filter((nome) => /^readme\.exemplo.*\.ts$/.test(nome))
	.sort()
	.map((nome) => join(raiz, "test", nome));

/** Sem espaços e sem a vírgula final que o formatador põe antes de fechar. */
const compactar = (codigo: string) =>
	codigo.replace(/\s+/g, "").replace(/,(?=[\]})])/g, "");

/**
 * A linha do README como expressão: `/* … *\/` vale por qualquer trecho.
 *
 * A vírgula do fim da linha sai: no arquivo compilado ela pode ser justamente
 * a que antecede um fechamento, e aí `compactar` já a tirou de lá.
 */
function expressaoDaLinha(linha: string): RegExp {
	const partes = compactar(linha)
		.replace(/,$/, "")
		.split("/*…*/")
		.map((parte) => parte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
	return new RegExp(partes.join("[\\s\\S]*?"), "g");
}

test("cada bloco ts do README tem o seu exemplo compilado", () => {
	assert.ok(blocos.length > 0, "o README não tem bloco ts");
	assert.equal(
		exemplos.length,
		blocos.length,
		"um arquivo test/readme.exemplo*.ts por bloco ts do README, na ordem",
	);
});

test("o bloco do README é um recorte, na ordem, do exemplo compilado", () => {
	for (const [indice, bloco] of blocos.entries()) {
		const arquivo = exemplos[indice];
		assert.ok(arquivo);
		const exemplo = compactar(readFileSync(arquivo, "utf8"));

		let posicao = 0;
		for (const linha of bloco.split("\n")) {
			// Linha só de pontuação não diz nada sobre o exemplo.
			if (!/[\p{L}\p{N}]/u.test(linha)) continue;
			const expressao = expressaoDaLinha(linha);
			expressao.lastIndex = posicao;
			const achado = expressao.exec(exemplo);
			assert.ok(
				achado,
				`o README mostra uma linha que não está, nesta ordem, em ${arquivo}:\n  ${linha.trim()}`,
			);
			posicao = achado.index + achado[0].length;
		}
	}
});

test("o erro que o README anuncia é conferido pelo compilador", () => {
	for (const [indice, bloco] of blocos.entries()) {
		const arquivo = exemplos[indice];
		assert.ok(arquivo);
		const diretivas = (codigo: string) =>
			codigo.match(/\/\/ @ts-expect-error/g)?.length ?? 0;
		assert.equal(diretivas(readFileSync(arquivo, "utf8")), diretivas(bloco));
	}

	const listados = spawnSync(
		process.execPath,
		[tsc, "--noEmit", "-p", "tsconfig.json", "--listFilesOnly"],
		{ cwd: raiz, encoding: "utf8" },
	)
		.stdout.split("\n")
		.map((linha) => resolve(linha));
	for (const arquivo of exemplos) {
		assert.ok(listados.includes(arquivo), `fora do projeto: ${arquivo}`);
	}

	const verificacao = spawnSync(
		process.execPath,
		[tsc, "--noEmit", "-p", "tsconfig.json", "--pretty", "false"],
		{ cwd: raiz, encoding: "utf8" },
	);
	assert.equal(verificacao.status, 0, verificacao.stdout + verificacao.stderr);
});
