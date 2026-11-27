/**
 * Reserva no npm o nome de cada pacote publicável e configura o trusted
 * publishing dele para o workflow de release deste repositório.
 *
 * Por que existe: o npm só aceita configurar trusted publishing para pacote que
 * já existe ("Package must exist", na documentação do `npm trust`). A primeira
 * versão de verdade sai pelo CI, com proveniência; antes dela, cada nome recebe
 * uma versão `0.1.0-stage`, com a dist-tag `stage`, que só reserva o nome. Não
 * pode ser `0.0.0-stage`: o npm recusa a 0.0.0 e as pré-versões dela, com 403
 * ("You cannot publish using the version"), como se viu em 27/11/2026. Por ser
 * pré-versão da 0.1.0, ela fica abaixo de qualquer versão de verdade. Depois de configurada, a confiança precisa ver a primeira publicação
 * pelo CI em até dois dias, ou expira.
 *
 * Roda num terminal de verdade, com a conta do npm logada: cada publicação e
 * cada `npm trust` exigem o código do 2FA. Quem pede o código é o script, não o
 * npm, para reaproveitá-lo: um código vale uns 30 segundos e o npm o aceita em
 * várias operações seguidas. O npm roda sem terminal na entrada, então código
 * ausente ou vencido o faz sair com EOTP em vez de perguntar; o script pede um
 * código novo, repete a operação e segue com ele nas próximas.
 *
 *   pnpm reservar:npm                  reserva o que falta e configura a confiança
 *   pnpm reservar:npm --otp=123456     já começa com este código
 *   pnpm reservar:npm --dry-run        só diz o que faria, sem escrever nada no npm
 *
 * Pacote que já existe no npm não é publicado de novo; a confiança já
 * configurada faz o npm responder 409, e o script segue. `--npm=<caminho>` troca
 * o npm usado, para ensaiar contra um npm de mentira.
 */
import { spawnSync } from "node:child_process";
import {
	mkdtempSync,
	readdirSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createInterface } from "node:readline/promises";

const raiz = resolve(import.meta.dirname, "..");

/**
 * O ambiente em que o npm roda. O pnpm passa as configurações dele ao script como
 * variáveis `npm_config_*` (`minimum-release-age`, `verify-deps-before-run`,
 * `overrides`…) e aponta o `globalconfig` do npm para o arquivo de configuração do
 * pnpm. O npm não conhece essas chaves e avisa de cada uma, a cada comando. Sem
 * elas, o npm lê só os arquivos dele: o `.npmrc` do projeto e o da pessoa, onde
 * está o login.
 */
const AMBIENTE_DO_NPM = Object.fromEntries(
	Object.entries(process.env).filter(([nome]) => !/^npm_config_/i.test(nome)),
);
const REPOSITORIO = "sidartaveloso/prisma-intent";
const WORKFLOW = "release.yml";
const ensaio = process.argv.includes("--dry-run");

function opcao(nome: string): string | undefined {
	return process.argv
		.find((argumento) => argumento.startsWith(`--${nome}=`))
		?.slice(`--${nome}=`.length);
}

/** O npm das devDependencies: o `npm trust` exige 11.15 ou mais novo. */
const npm = opcao("npm") ?? join(raiz, "node_modules", ".bin", "npm");

/** O código do 2FA em uso; troca quando o npm o recusa. */
let codigo = opcao("otp");

/** O npm sem terminal na entrada sai com EOTP (ou E401 citando o código). */
const PEDE_SEGUNDO_FATOR = /EOTP|one-time pass/i;

/**
 * Aberto na primeira pergunta e fechado no fim, para não prender o processo.
 * As linhas saem do iterador, que guarda as que chegam antes da pergunta.
 */
let leitor: ReturnType<typeof createInterface> | undefined;
let linhas: AsyncIterator<string> | undefined;

/** O código digitado, ou nada se a entrada acabou. */
async function pedirCodigo(): Promise<string | undefined> {
	leitor ??= createInterface({ input: process.stdin });
	linhas ??= leitor[Symbol.asyncIterator]();
	process.stdout.write(
		`\n🔐 Código do 2FA${codigo ? " (o anterior venceu)" : ""}: `,
	);
	const linha = await linhas.next();
	return linha.done ? undefined : linha.value.trim();
}

/**
 * Roda uma escrita no npm com o código em uso; se o npm pedir o segundo
 * fator, pede um código novo e tenta de novo, até três vezes.
 */
async function rodar(argumentos: string[], cwd = raiz): Promise<number> {
	console.log(`\n$ npm ${argumentos.join(" ")}`);
	if (ensaio) return 0;
	for (let tentativa = 1; ; tentativa++) {
		const resultado = spawnSync(
			npm,
			[...argumentos, ...(codigo ? [`--otp=${codigo}`] : [])],
			{
				cwd,
				env: AMBIENTE_DO_NPM,
				stdio: ["ignore", "inherit", "pipe"],
				encoding: "utf8",
			},
		);
		const erros = resultado.stderr ?? "";
		const pediuCodigo =
			resultado.status !== 0 && PEDE_SEGUNDO_FATOR.test(erros);
		const novo = pediuCodigo && tentativa < 3 ? await pedirCodigo() : undefined;
		if (!novo) {
			process.stderr.write(erros);
			return resultado.status ?? 1;
		}
		codigo = novo;
	}
}

function existeNoNpm(nome: string): boolean {
	return (
		spawnSync(npm, ["view", nome, "name"], {
			cwd: raiz,
			env: AMBIENTE_DO_NPM,
			stdio: "ignore",
		}).status === 0
	);
}

const pacotes = readdirSync(join(raiz, "packages"), { withFileTypes: true })
	.filter((entrada) => entrada.isDirectory())
	.map((entrada) =>
		JSON.parse(
			readFileSync(
				join(raiz, "packages", entrada.name, "package.json"),
				"utf8",
			),
		),
	)
	.filter((manifesto) => manifesto.private !== true)
	.map((manifesto): string => manifesto.name)
	.sort();

const versaoDoNpm = spawnSync(npm, ["--version"], {
	env: AMBIENTE_DO_NPM,
	encoding: "utf8",
}).stdout.trim();
console.log(
	`npm ${versaoDoNpm} · ${pacotes.length} pacotes: ${pacotes.join(", ")}`,
);

if (
	!ensaio &&
	spawnSync(npm, ["whoami"], { env: AMBIENTE_DO_NPM, stdio: "ignore" })
		.status !== 0
) {
	console.error(
		"\n❌ Sem conta logada no npm. Rode antes: pnpm exec npm login",
	);
	process.exit(1);
}

const licenca = readFileSync(join(raiz, "LICENSE"), "utf8");
const pendencias: string[] = [];

for (const nome of pacotes) {
	console.log(`\n── ${nome}`);
	if (existeNoNpm(nome)) {
		console.log("já existe no npm: nada a reservar");
	} else {
		const pasta = mkdtempSync(join(tmpdir(), "prisma-intent-reserva-"));
		try {
			writeFileSync(
				join(pasta, "package.json"),
				`${JSON.stringify(
					{
						name: nome,
						version: "0.1.0-stage",
						description: `Reserva do nome. A primeira versão sai pelo CI de https://github.com/${REPOSITORIO}.`,
						license: "MIT",
						repository: {
							type: "git",
							url: `git+https://github.com/${REPOSITORIO}.git`,
						},
					},
					null,
					2,
				)}\n`,
			);
			writeFileSync(
				join(pasta, "README.md"),
				`# ${nome}\n\nVeja https://github.com/${REPOSITORIO}.\n`,
			);
			writeFileSync(join(pasta, "LICENSE"), licenca);
			if (
				(await rodar(
					[
						"publish",
						"--access",
						"public",
						"--tag",
						"stage",
						"--provenance=false",
					],
					pasta,
				)) !== 0
			) {
				pendencias.push(`${nome}: a reserva falhou`);
				continue;
			}
		} finally {
			rmSync(pasta, { recursive: true, force: true });
		}
	}

	const confianca = await rodar([
		"trust",
		"github",
		nome,
		"--repo",
		REPOSITORIO,
		"--file",
		WORKFLOW,
		"--allow-publish",
		"--yes",
	]);
	if (confianca !== 0)
		pendencias.push(
			`${nome}: o npm trust saiu com ${confianca} (409 quer dizer que já estava configurada)`,
		);
}

leitor?.close();

if (pendencias.length > 0) {
	console.error(`\n⚠️  Confira:\n  ${pendencias.join("\n  ")}`);
	process.exitCode = 1;
} else {
	console.log(
		`\n✅ ${ensaio ? "Ensaio: nada foi escrito no npm." : "Nomes reservados e confiança configurada. A 0.1.0 sai pelo CI no próximo push na main — em até dois dias."}`,
	);
}
