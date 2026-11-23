/**
 * Reserva no npm o nome de cada pacote publicável e configura o trusted
 * publishing dele para o workflow de release deste repositório.
 *
 * Por que existe: o npm só aceita configurar trusted publishing para pacote que
 * já existe ("Package must exist", na documentação do `npm trust`). A primeira
 * versão de verdade — a 0.1.0 — sai pelo CI, com proveniência; antes dela, cada
 * nome recebe uma versão `0.0.0-stage`, com a dist-tag `stage`, que só reserva o
 * nome. Depois de configurada, a confiança precisa ver a primeira publicação
 * pelo CI em até dois dias, ou expira.
 *
 * Roda num terminal de verdade, com a conta do npm logada: cada publicação e
 * cada `npm trust` pedem o segundo fator, pelo navegador ou por código. A saída
 * do npm vai direto para o terminal — passá-la por pipe faz o 2FA falhar com
 * EOTP, como aconteceu no taskin.
 *
 *   pnpm reservar:npm             reserva o que falta e configura a confiança
 *   pnpm reservar:npm --dry-run   só diz o que faria, sem escrever nada no npm
 *
 * Pacote que já existe no npm não é publicado de novo; a confiança já
 * configurada faz o npm responder 409, e o script segue.
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

const raiz = resolve(import.meta.dirname, "..");
const REPOSITORIO = "sidartaveloso/prisma-intent";
const WORKFLOW = "release.yml";
const ensaio = process.argv.includes("--dry-run");

/** O npm das devDependencies: o `npm trust` exige 11.15 ou mais novo. */
const npm = join(raiz, "node_modules", ".bin", "npm");

function rodar(argumentos: string[], cwd = raiz): number {
	console.log(`\n$ npm ${argumentos.join(" ")}`);
	if (ensaio) return 0;
	return spawnSync(npm, argumentos, { cwd, stdio: "inherit" }).status ?? 1;
}

function existeNoNpm(nome: string): boolean {
	return (
		spawnSync(npm, ["view", nome, "name"], { cwd: raiz, stdio: "ignore" })
			.status === 0
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
	encoding: "utf8",
}).stdout.trim();
console.log(
	`npm ${versaoDoNpm} · ${pacotes.length} pacotes: ${pacotes.join(", ")}`,
);

if (!ensaio && spawnSync(npm, ["whoami"], { stdio: "ignore" }).status !== 0) {
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
						version: "0.0.0-stage",
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
				rodar(
					[
						"publish",
						"--access",
						"public",
						"--tag",
						"stage",
						"--provenance=false",
					],
					pasta,
				) !== 0
			) {
				pendencias.push(`${nome}: a reserva falhou`);
				continue;
			}
		} finally {
			rmSync(pasta, { recursive: true, force: true });
		}
	}

	const confianca = rodar([
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

if (pendencias.length > 0) {
	console.error(`\n⚠️  Confira:\n  ${pendencias.join("\n  ")}`);
	process.exitCode = 1;
} else {
	console.log(
		`\n✅ ${ensaio ? "Ensaio: nada foi escrito no npm." : "Nomes reservados e confiança configurada. A 0.1.0 sai pelo CI no próximo push na main — em até dois dias."}`,
	);
}
