/**
 * Medição de tempo da marcação, por tamanho de texto, para acompanhar a
 * regressão (task-016).
 *
 * Cada amostra lê o texto com `lerMarcacao` e o escreve de volta com
 * `escreverMarcacao`. O texto tem uma tag a cada 70 caracteres, em média, com
 * parágrafos e atributos. A referência é uma expressão regular própria, que lê
 * e escreve só a forma simples, sem escape nem conferência: ela dá a ordem de
 * grandeza do que se paga pelo padrão.
 *
 *   pnpm --filter @prisma-intent/tags medir            imprime a tabela
 *   pnpm --filter @prisma-intent/tags medir --gravar   grava em medicao/resultados.md
 */
import { writeFileSync } from "node:fs";
import { cpus } from "node:os";
import { join } from "node:path";
import { performance } from "node:perf_hooks";
import { escreverMarcacao, lerMarcacao } from "../src/index.ts";
import { tipos } from "../test/catalogo.ts";

const TAMANHOS = [
	{ nome: "1 KB", bytes: 1_024, amostras: 301 },
	{ nome: "10 KB", bytes: 10_240, amostras: 101 },
	{ nome: "100 KB", bytes: 102_400, amostras: 31 },
	{ nome: "1 MB", bytes: 1_048_576, amostras: 9 },
];

const TAGS = [
	':parte[a locadora]{#locadora artigo="definido" atributo="nome"}',
	":termo_do_acordo[30 dias]{#prazo}",
	':concordancia[obrigado]{#obrigado voce="obrigada"}',
	':definicao[locação]{#locacao art="3" inc="II" par="1"}',
	':clausula[a cláusula 4]{#c4 mostrar="numero"}',
];
const PROSA =
	"O texto corre entre as tags com vírgulas, acentos e números como 10:30 ";

/** Texto do tamanho pedido, com uma tag a cada 70 caracteres em média. */
function gerarTexto(bytes: number): string {
	let texto = "";
	let i = 0;
	while (Buffer.byteLength(texto) < bytes) {
		const tag = TAGS[i % TAGS.length] ?? "";
		texto += `${PROSA.slice(0, Math.max(8, 69 - tag.length))}${tag} `;
		if (++i % 8 === 0) texto += "\n\n";
	}
	return texto;
}

/** Referência: expressão regular própria, sem escape nem conferência. */
const TAG_SIMPLES = /:([\p{L}\p{N}_-]+)\[([^\]]*)\]\{([^}]*)\}/gu;
function idaEVoltaPorExpressao(texto: string): string {
	const trechos: (string | { t: string; r: string; a: string[][] })[] = [];
	let cursor = 0;
	for (const achado of texto.matchAll(TAG_SIMPLES)) {
		trechos.push(texto.slice(cursor, achado.index));
		const atributos = (achado[3] ?? "")
			.split(/\s+/)
			.filter(Boolean)
			.map((par) => par.replace(/"/g, "").split("="));
		trechos.push({ t: achado[1] ?? "", r: achado[2] ?? "", a: atributos });
		cursor = achado.index + achado[0].length;
	}
	trechos.push(texto.slice(cursor));
	return trechos
		.map((trecho) =>
			typeof trecho === "string"
				? trecho
				: `:${trecho.t}[${trecho.r}]{${trecho.a.map(([k, v]) => `${k}="${v}"`).join(" ")}}`,
		)
		.join("");
}

function idaEVoltaPelaMarcacao(texto: string): string {
	const lido = lerMarcacao(texto, tipos);
	if (lido.resultado !== "lido")
		throw new Error(`texto da medição recusado: ${lido.falhas[0].falha}`);
	return escreverMarcacao(lido.trechos);
}

function mediana(medir: () => void, amostras: number): number {
	medir(); // aquece
	const tempos: number[] = [];
	for (let i = 0; i < amostras; i++) {
		const inicio = performance.now();
		medir();
		tempos.push(performance.now() - inicio);
	}
	tempos.sort((a, b) => a - b);
	return tempos[Math.floor(tempos.length / 2)] ?? 0;
}

const formatar = (ms: number) =>
	ms >= 100
		? `${(ms / 1000).toFixed(2).replace(".", ",")} s`
		: `${ms.toFixed(ms < 1 ? 2 : 1).replace(".", ",")} ms`;

const linhas = TAMANHOS.map(({ nome, bytes, amostras }) => {
	const texto = gerarTexto(bytes);
	const tags = texto.match(TAG_SIMPLES)?.length ?? 0;
	const marcacao = mediana(() => idaEVoltaPelaMarcacao(texto), amostras);
	const expressao = mediana(() => idaEVoltaPorExpressao(texto), amostras);
	return `| ${nome} | ${tags} | ${amostras} | ${formatar(marcacao)} | ${formatar(expressao)} | ${Math.round(marcacao / expressao)}× |`;
});

const tabela = [
	"| Tamanho | Tags | Amostras | Ler e escrever (mediana) | Expressão regular (mediana) | Razão |",
	"| --- | ---: | ---: | ---: | ---: | ---: |",
	...linhas,
].join("\n");
const ambiente = `${cpus()[0]?.model ?? "processador desconhecido"}, Node ${process.version}, ${process.platform}`;

console.log(`${ambiente}\n\n${tabela}`);

if (process.argv.includes("--gravar")) {
	const data = new Date().toISOString().slice(0, 10);
	writeFileSync(
		join(import.meta.dirname, "resultados.md"),
		`# Medição da marcação

Gerado por \`pnpm --filter @prisma-intent/tags medir --gravar\` (\`medicao/medir.ts\`).
Cada amostra lê o texto com \`lerMarcacao\` e o escreve de volta com \`escreverMarcacao\`; o
texto tem uma tag a cada 70 caracteres, em média. A expressão regular é a referência: lê e
escreve só a forma simples, sem escape nem conferência contra o catálogo.

Para acompanhar a regressão, rode de novo na mesma máquina e compare a coluna da mediana.
Crescimento mais que linear com o tamanho, ou razão bem acima da registrada, pede investigação.

- Data: ${data}
- Ambiente: ${ambiente}

${tabela}
`,
	);
	console.log("\ngravado em medicao/resultados.md");
}
