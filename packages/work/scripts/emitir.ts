#!/usr/bin/env tsx
/**
 * Emite as representações derivadas de uma instância.
 *
 * O TypeScript é a fonte; JSON e JSON-LD são projeções. Gerá-los em vez de
 * mantê-los à mão é o que impede as três representações de divergirem na
 * primeira edição.
 *
 *   <saída>/<instancia>.json     a instância inteira, para consumo por ferramentas
 *   <saída>/<instancia>.jsonld   recorte semântico para agentes e buscadores
 *
 * Uso: tsx scripts/emitir.ts <módulo-da-instância> [--saida <diretório>]
 *
 * A saída é `dist`, a partir de onde o comando roda, quando não informada. O
 * JSON traz a instância inteira — estratégia, objeções e reservas inclusive:
 * é material de trabalho, não de publicação.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { parseArgs } from "node:util";
import { verificarRegras } from "@prisma-intent/core";
import { montarJsonLd } from "../src/json-ld.ts";
import { carregarInstancia } from "./carregar-instancia.ts";

const { values, positionals } = parseArgs({
	allowPositionals: true,
	options: { saida: { type: "string", default: "dist" } },
});
const [modulo] = positionals;
if (!modulo) {
	console.error(
		"✗ informe o módulo que exporta a instância.\n  uso: emitir <módulo-da-instância> [--saida <diretório>]",
	);
	process.exit(1);
}

const instancia = await carregarInstancia(modulo);
const dist = resolve(values.saida);
mkdirSync(dist, { recursive: true });

const base = instancia.instancia.id;

const caminhoJson = join(dist, `${base}.json`);
writeFileSync(caminhoJson, `${JSON.stringify(instancia, null, 2)}\n`);

const jsonLd = montarJsonLd(instancia);

/**
 * O nó da pessoa é conferido contra as restrições de competência.
 *
 * É nele que a competência é afirmada — `knowsAbout`, cargos, formação — e é
 * ele que a IA de recrutamento lê. Sem esta conferência, uma competência
 * restringida entraria no JSON-LD sem que nada acusasse: o currículo é
 * verificado, o dado publicado para agentes não era.
 *
 * Os nós de case ficam de fora de propósito. `applicationSuite` descreve a
 * stack do projeto, não o que a pessoa oferece — uma linguagem pode estar num
 * case porque o app foi escrito nela, e essa é justamente a distinção que as
 * regras preservam.
 */
const pessoa = jsonLd["@graph"].find((no) => no["@type"] === "Person");
const violacoes = verificarRegras(
	JSON.stringify(pessoa ?? {}),
	instancia.regrasDeIntegridade,
);
if (violacoes.length > 0) {
	console.error("✗ o JSON-LD afirma algo que a instância restringe:\n");
	for (const violacao of violacoes) {
		console.error(`  · "${violacao.trecho}" (padrão ${violacao.padrao})`);
		console.error(`    ${violacao.regra}\n`);
	}
	process.exit(1);
}

const caminhoJsonLd = join(dist, `${base}.jsonld`);
writeFileSync(caminhoJsonLd, `${JSON.stringify(jsonLd, null, 2)}\n`);

console.log(
	[
		`✔ ${instancia.instancia.id}`,
		`  cases ......... ${instancia.cases.length}`,
		`  argumentos .... ${instancia.argumentos.length}`,
		`  regras ........ ${instancia.regrasDeIntegridade.length}`,
		`  json .......... ${relative(process.cwd(), caminhoJson)}`,
		`  json-ld ....... ${relative(process.cwd(), caminhoJsonLd)}`,
	].join("\n"),
);
