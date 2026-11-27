/**
 * A procedência só vale se for conferível.
 *
 * Um campo `trecho` preenchido com paráfrase do próprio número faria a
 * verificação conferir a instância contra ela mesma — sensação de material
 * auditado, sem auditoria. É pior do que não ter o campo, pelo mesmo motivo
 * que `verificarRegras` rodando sobre texto em inglês é pior do que não rodar:
 * devolve "nenhuma violação" sobre algo que não foi examinado.
 *
 * Por isso o teste abre o arquivo apontado e procura a citação. Aqui a
 * instância e a fonte são fictícias; quem tem uma instância de verdade roda o
 * mesmo teste sobre ela e sobre a fonte que arquivou.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
	afirmacoesSemProcedencia,
	coletarProcedencias,
} from "../src/conferencia.ts";
import { exemplo } from "./exemplo.ts";

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const procedencias = coletarProcedencias(exemplo);

test("há procedência declarada para conferir", () => {
	assert.ok(
		procedencias.length > 0,
		"nenhuma procedência na instância — o campo existe mas ninguém o usa",
	);
});

test("todo trecho citado existe literalmente no arquivo apontado", () => {
	for (const { onde, procedencia } of procedencias) {
		const caminho = join(raiz, procedencia.arquivo);
		const fonte = readFileSync(caminho, "utf8");
		assert.ok(
			fonte.includes(procedencia.trecho),
			`${onde}: o trecho citado não está em ${procedencia.arquivo}.\n  procurado: "${procedencia.trecho}"`,
		);
	}
});

test("a linha declarada aponta para onde o trecho está", () => {
	for (const { onde, procedencia } of procedencias) {
		if (procedencia.linha === undefined) continue;

		const linhas = readFileSync(join(raiz, procedencia.arquivo), "utf8").split(
			"\n",
		);
		const declarada = linhas[procedencia.linha - 1] ?? "";
		assert.ok(
			declarada.includes(procedencia.trecho),
			`${onde}: a linha ${procedencia.linha} de ${procedencia.arquivo} não contém o trecho citado`,
		);
	}
});

/**
 * O que ainda não tem fonte precisa estar declarado como lacuna.
 *
 * Tornar o campo opcional e esquecer é como a atribuição errada da liderança
 * sobreviveu meses: nada no modelo registrava que ninguém havia conferido.
 * `lacunas` é o mecanismo que a instância já tem para representar o que não se
 * sabe sem preencher por inferência — e é ele que segura este teste.
 */
test("número publicado sem procedência está declarado como lacuna", () => {
	const semFonte = afirmacoesSemProcedencia(exemplo);
	const declaradas = new Set(
		exemplo.lacunas.flatMap((lacuna) =>
			lacuna.tipo === "informacao_a_confirmar" ? [lacuna.id] : [],
		),
	);

	const orfas = semFonte.filter((id) => !declaradas.has(id));
	assert.deepEqual(
		orfas,
		[],
		`números publicados sem procedência e sem lacuna declarada:\n  ${orfas.join("\n  ")}`,
	);
});
