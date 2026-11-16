#!/usr/bin/env tsx
/**
 * Confere um diretório publicável contra o que a instância reserva.
 *
 * Roda **sobre o artefato construído**, e não sobre o código-fonte: o vazamento
 * que motivou esta verificação nasceu do bundler, que incluiu a instância
 * inteira no JavaScript servido. Nenhuma revisão de código o teria pego —
 * o fonte importava um módulo, o que é normal; o que estava errado era o que
 * saía do outro lado.
 *
 * Falha fechado: sem diretório, sem arquivos ou sem instância, é erro. Uma
 * verificação que se desliga sozinha quando não encontra o que verificar dá
 * exatamente a impressão de segurança que ela deveria substituir por garantia.
 *
 * Uso: prisma-verificar-publicacao --instancia <módulo> <diretório> [...]
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { termosNaoPublicaveis } from "../src/publicacao.ts";
import { carregarInstancia } from "./carregar-instancia.ts";

const EXTENSOES = /\.(js|mjs|cjs|html|json|css|txt|xml|svg)$/;

const { values, positionals: diretorios } = parseArgs({
	allowPositionals: true,
	options: { instancia: { type: "string" } },
});
if (!values.instancia) {
	console.error(
		"✗ informe o módulo que exporta a instância.\n  uso: prisma-verificar-publicacao --instancia <módulo> <diretório> [...]",
	);
	process.exit(1);
}
if (diretorios.length === 0) {
	console.error("✗ informe ao menos um diretório para verificar.");
	process.exit(1);
}

function listar(pasta: string): string[] {
	return readdirSync(pasta, { withFileTypes: true }).flatMap((item) => {
		const caminho = path.join(pasta, item.name);
		return item.isDirectory() ? listar(caminho) : [caminho];
	});
}

const arquivos: string[] = [];
for (const diretorio of diretorios) {
	const caminho = path.resolve(diretorio);
	try {
		if (!statSync(caminho).isDirectory()) throw new Error("não é diretório");
	} catch {
		console.error(`✗ diretório não encontrado: ${diretorio}`);
		console.error(
			"  construa antes de verificar — a checagem é sobre o que sai.",
		);
		process.exit(1);
	}
	arquivos.push(...listar(caminho).filter((f) => EXTENSOES.test(f)));
}

if (arquivos.length === 0) {
	console.error(`✗ nada para verificar em ${diretorios.join(", ")}.`);
	process.exit(1);
}

const termos = termosNaoPublicaveis(await carregarInstancia(values.instancia));
const achados: { arquivo: string; termo: string; origem: string }[] = [];

for (const arquivo of arquivos) {
	const conteudo = readFileSync(arquivo, "utf-8");
	for (const { termo, origem } of termos) {
		if (conteudo.includes(termo)) {
			achados.push({
				arquivo: path.relative(process.cwd(), arquivo),
				termo,
				origem,
			});
		}
	}
}

if (achados.length > 0) {
	console.error(
		`\n✗ ${achados.length} vazamento(s): o artefato publicado expõe a estratégia da instância.\n`,
	);
	for (const achado of achados.slice(0, 10)) {
		const trecho =
			achado.termo.length > 70 ? `${achado.termo.slice(0, 70)}…` : achado.termo;
		console.error(`  ${achado.arquivo}`);
		console.error(`    "${trecho}"`);
		console.error(`    ${achado.origem}\n`);
	}
	if (achados.length > 10) {
		console.error(`  … e mais ${achados.length - 10}.\n`);
	}
	console.error(
		"  Provável causa: algum módulo do app importa a instância e o bundler a\n" +
			"  incluiu inteira. O conteúdo precisa ser pré-computado antes do build.\n",
	);
	process.exit(1);
}

console.log(
	`✓ publicação limpa — ${arquivos.length} arquivos conferidos contra ${termos.length} termos reservados`,
);
