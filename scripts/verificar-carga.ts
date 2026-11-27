/**
 * Portão de publicação: cada pacote publicável sai como o npm vai recebê-lo e
 * carrega no Node ESM, fora do workspace.
 *
 * O `pnpm pack` é o que o `changeset publish` manda para o registry: aplica o
 * `publishConfig` (o `exports` que aponta para o `dist`), respeita o `files` e
 * troca `workspace:*` pela versão exata. Os tarballs são instalados lado a lado
 * num consumidor vazio e cada pacote é carregado pelo nome, com `node` — sem
 * tsx, sem o fonte, sem o workspace. Foi assim que o taskin 5.2.0 saiu
 * publicado sem carregar: todo teste rodava sobre o fonte.
 *
 * Dependência de terceiros (o `markup` usa o micromark) não está no registry
 * local: é ligada ao consumidor a partir do `node_modules` do pacote no
 * workspace, que o pnpm instalou com as versões do lockfile.
 *
 * Exige o `dist` construído (`pnpm build`).
 *
 *   pnpm verificar:carga
 */
import { execFileSync, spawnSync } from "node:child_process";
import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	readdirSync,
	readFileSync,
	realpathSync,
	rmSync,
	symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

const raiz = resolve(import.meta.dirname, "..");

interface Pacote {
	nome: string;
	versao: string;
	pasta: string;
}

function publicaveis(): Pacote[] {
	return readdirSync(join(raiz, "packages"), { withFileTypes: true })
		.filter((entrada) => entrada.isDirectory())
		.map((entrada) => join(raiz, "packages", entrada.name))
		.map((pasta) => ({
			pasta,
			manifesto: JSON.parse(readFileSync(join(pasta, "package.json"), "utf8")),
		}))
		.filter(({ manifesto }) => manifesto.private !== true)
		.map(({ pasta, manifesto }) => ({
			nome: manifesto.name,
			versao: manifesto.version,
			pasta,
		}))
		.sort((a, b) => a.nome.localeCompare(b.nome));
}

const falhas: string[] = [];
const falhar = (mensagem: string) => {
	falhas.push(mensagem);
	console.error(`❌ ${mensagem}`);
};

/** O que pode ir no tarball: o manifesto, o README, a licença e o que foi construído. */
const PERMITIDO =
	/^package\/(package\.json|README\.md|LICENSE|dist\/.+|[^/]+\.(js|d\.ts))$/;

const temporaria = mkdtempSync(join(tmpdir(), "prisma-intent-carga-"));
try {
	const consumidor = join(temporaria, "consumidor");
	mkdirSync(join(consumidor, "node_modules"), { recursive: true });
	const pacotes = publicaveis();

	for (const pacote of pacotes) {
		const saida = execFileSync(
			"pnpm",
			["pack", "--pack-destination", temporaria, "--json"],
			{
				cwd: pacote.pasta,
				encoding: "utf8",
			},
		);
		const { filename } = JSON.parse(saida.slice(saida.indexOf("{"))) as {
			filename: string;
		};
		const tarball = resolve(temporaria, filename);

		const conteudo = execFileSync("tar", ["-tzf", tarball], {
			encoding: "utf8",
		})
			.trim()
			.split("\n");
		for (const arquivo of conteudo.filter(
			(caminho) => !PERMITIDO.test(caminho),
		)) {
			falhar(
				`${pacote.nome}: o tarball leva ${arquivo.replace(/^package\//, "")}, que não é para publicar`,
			);
		}
		if (!conteudo.includes("package/LICENSE"))
			falhar(`${pacote.nome}: o tarball não leva a LICENSE`);

		const destino = join(consumidor, "node_modules", pacote.nome);
		mkdirSync(destino, { recursive: true });
		execFileSync("tar", [
			"-xzf",
			tarball,
			"-C",
			destino,
			"--strip-components=1",
		]);

		const manifesto = JSON.parse(
			readFileSync(join(destino, "package.json"), "utf8"),
		);
		const alvos = JSON.stringify(manifesto.exports ?? {});
		if (/\.ts"/.test(alvos.replace(/\.d\.ts"/g, "")))
			falhar(`${pacote.nome}: o exports publicado aponta para fonte .ts`);
		if (/workspace:/.test(JSON.stringify(manifesto.dependencies ?? {})))
			falhar(`${pacote.nome}: dependência publicada com workspace:`);
		if (manifesto.version !== pacote.versao)
			falhar(
				`${pacote.nome}: versão ${manifesto.version}, esperada ${pacote.versao}`,
			);
	}

	const doMonorepo = new Set(pacotes.map((pacote) => pacote.nome));
	for (const pacote of pacotes) {
		const manifesto = JSON.parse(
			readFileSync(join(pacote.pasta, "package.json"), "utf8"),
		);
		for (const dependencia of Object.keys(manifesto.dependencies ?? {})) {
			const destino = join(consumidor, "node_modules", dependencia);
			if (doMonorepo.has(dependencia) || existsSync(destino)) continue;
			mkdirSync(dirname(destino), { recursive: true });
			symlinkSync(
				realpathSync(join(pacote.pasta, "node_modules", dependencia)),
				destino,
			);
		}
	}

	for (const pacote of pacotes) {
		const manifesto = JSON.parse(
			readFileSync(
				join(consumidor, "node_modules", pacote.nome, "package.json"),
				"utf8",
			),
		);
		const subcaminhos = Object.keys(manifesto.exports ?? { ".": null }).map(
			(chave) =>
				chave === "." ? pacote.nome : `${pacote.nome}/${chave.slice(2)}`,
		);
		for (const especificador of subcaminhos) {
			const resultado = spawnSync(
				process.execPath,
				[
					"--input-type=module",
					"-e",
					`await import(${JSON.stringify(especificador)})`,
				],
				{ cwd: consumidor, encoding: "utf8" },
			);
			if (resultado.status === 0) console.log(`✅ ${especificador}`);
			else
				falhar(
					`${especificador} não carrega: ${resultado.stderr.split("\n").find((linha) => /Error/.test(linha)) ?? resultado.stderr.trim()}`,
				);
		}

		for (const [nomeDoBin, caminho] of Object.entries<string>(
			manifesto.bin ?? {},
		)) {
			// Sem argumento, o bin recusa e explica o uso: se chegou a explicar, carregou.
			const resultado = spawnSync(
				process.execPath,
				[join(consumidor, "node_modules", pacote.nome, caminho)],
				{
					cwd: consumidor,
					encoding: "utf8",
				},
			);
			if (/uso:/.test(resultado.stderr))
				console.log(`✅ ${pacote.nome} (bin ${nomeDoBin})`);
			else
				falhar(
					`bin ${nomeDoBin} não inicia: ${resultado.stderr.trim().split("\n")[0]}`,
				);
		}
	}

	if (falhas.length > 0) {
		console.error(
			`\n❌ ${falhas.length} problema(s). Publicado assim, o pacote quebra em quem o instala.`,
		);
		process.exitCode = 1;
	} else {
		console.log(
			`\n✅ ${pacotes.length} pacote(s) empacotados e carregados no Node ESM, fora do workspace.`,
		);
	}
} finally {
	rmSync(temporaria, { recursive: true, force: true });
}
