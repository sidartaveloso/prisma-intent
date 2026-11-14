/**
 * Conferência estrutural: o que `verificarRegras` não alcança por texto.
 *
 * - `erros`: o modelo é incoerente (referência quebrada, conceito usado como
 *   prova, campanha marcada pronta com bloqueio). O gate do repositório exige
 *   lista vazia em qualquer estado.
 * - `bloqueios`: o modelo é coerente, mas ainda não pode ir a público. São o
 *   checklist de publicação; só impedem os estados `pronta_para_publicar` e
 *   `publicada`.
 * - `avisos`: o que a curadoria decide.
 */
import { type Violacao, verificarRegras } from "@prisma-intent/core";
import type { Campanha } from "./campanha.ts";
import type { Dossie } from "./dossie.ts";
import type { EvidenciaFunding } from "./evidencia.ts";
import type { Recurso } from "./recurso.ts";
import { regrasDoDominio } from "./regras.ts";
import { canaisInternos } from "./vocabulario.ts";

export interface Conferencia {
	erros: string[];
	bloqueios: string[];
	avisos: string[];
}

const PRIORIDADES_ALTAS = new Set(["critica", "muito_alta"]);

function conferirEvidencias(
	evidencias: readonly EvidenciaFunding[],
	recursos: readonly Recurso[],
	erros: string[],
): void {
	const porId = new Map(recursos.map((r) => [r.id, r]));
	for (const e of evidencias) {
		if (e.tipo !== "demonstracao" && e.tipo !== "medicao") continue;
		if (e.recurso === undefined) continue;
		const recurso = porId.get(e.recurso);
		if (!recurso) {
			erros.push(`evidência "${e.id}": recurso "${e.recurso}" não existe`);
			continue;
		}
		if (recurso.natureza === "conceito")
			erros.push(
				`evidência "${e.id}": recurso "${e.recurso}" é conceito e não prova o produto (render_nao_e_prova)`,
			);
	}
}

function idsSemEvidencia(
	referencias: readonly string[],
	evidencias: readonly EvidenciaFunding[],
): string[] {
	const ids = new Set(evidencias.map((e) => e.id));
	return referencias.filter((r) => !ids.has(r));
}

export function verificarCampanha(campanha: Campanha): Conferencia {
	const erros: string[] = [];
	const bloqueios: string[] = [];
	const avisos: string[] = [];

	conferirEvidencias(campanha.evidencias, campanha.recursos, erros);

	for (const a of campanha.argumentos)
		for (const id of idsSemEvidencia(a.evidencias, campanha.evidencias))
			erros.push(`argumento "${a.id}": evidência "${id}" não existe`);

	const recursos = new Map(campanha.recursos.map((r) => [r.id, r]));
	for (const intencao of campanha.intencoes) {
		for (const v of intencao.recursos) {
			const r = recursos.get(v.recurso);
			if (!r) {
				erros.push(
					`intenção "${intencao.tipo}": recurso "${v.recurso}" não existe`,
				);
				continue;
			}
			if (
				intencao.tipo !== "decidir_etapa" &&
				r.natureza === "conceito" &&
				v.papel === "carrega"
			)
				bloqueios.push(
					`intenção "${intencao.tipo}" é carregada pelo recurso de conceito "${r.id}" (render_nao_e_prova)`,
				);
		}
	}

	const argumentos = new Map(campanha.argumentos.map((a) => [a.id, a]));
	const objecoes = new Map(campanha.objecoes.map((o) => [o.id, o]));
	const publicas = campanha.renderizacoes.filter(
		(r) => !canaisInternos.includes(r.tipo),
	);
	const emPublico = new Set(publicas.flatMap((r) => r.conteudoPrioritario));

	for (const r of campanha.renderizacoes)
		for (const id of r.conteudoPrioritario)
			if (!argumentos.has(id) && !objecoes.has(id))
				erros.push(`renderização "${r.tipo}": conteúdo "${id}" não existe`);

	for (const id of emPublico) {
		const a = argumentos.get(id);
		if (a && a.evidencias.length === 0)
			bloqueios.push(
				`argumento "${id}" está em canal público sem evidência (promessa_so_com_prova)`,
			);
	}

	for (const o of campanha.objecoes) {
		if (
			o.resposta.tipo === "resolver_por_evidencia" &&
			o.resposta.evidenciasPrioritarias.length === 0 &&
			emPublico.has(o.id)
		)
			bloqueios.push(
				`objeção "${o.id}" se resolve por evidência e ainda não tem nenhuma`,
			);
		if (PRIORIDADES_ALTAS.has(o.prioridade) && !emPublico.has(o.id))
			bloqueios.push(
				`objeção "${o.id}" (${o.prioridade}) não é respondida em nenhum canal público`,
			);
	}

	if (campanha.plataforma.estado === "a_confirmar")
		bloqueios.push("plataforma de financiamento a confirmar");
	if (!campanha.recursos.some((r) => r.natureza === "prototipo"))
		bloqueios.push(
			"nenhum registro de protótipo: o estágio real não pode ser mostrado",
		);
	for (const [efeito, observacao] of Object.entries(
		campanha.observacaoDosEfeitos,
	))
		if (observacao?.meta?.estado === "a_confirmar")
			bloqueios.push(`efeito "${efeito}": meta a confirmar`);

	const respondidas = new Set(
		campanha.respostasAoLeitor
			.filter((r) => r.texto.estado === "confirmado")
			.map((r) => r.objecao),
	);
	for (const o of campanha.objecoes)
		if (emPublico.has(o.id) && !respondidas.has(o.id))
			bloqueios.push(`objeção "${o.id}" sem resposta redigida ao leitor`);
	for (const l of campanha.lacunas)
		if (
			l.tipo === "informacao_a_confirmar" &&
			PRIORIDADES_ALTAS.has(l.prioridade)
		)
			bloqueios.push(`lacuna "${l.id}" (${l.prioridade}) em aberto`);

	// No tipo concreto, faltar observação não compila; aqui cobre o que chegou
	// por fora dele (um `as`, o tipo genérico).
	const observados = new Set(Object.keys(campanha.observacaoDosEfeitos));
	for (const efeito of new Set(
		campanha.intencoes.flatMap((i) => i.efeitosDesejados.comportamentais),
	))
		if (!observados.has(efeito))
			erros.push(`efeito "${efeito}" sem observação declarada`);
	if (campanha.idiomas.includes("en"))
		avisos.push(
			"publicação em inglês: as regras do domínio só têm padrões em português",
		);

	if (
		(campanha.estado === "pronta_para_publicar" ||
			campanha.estado === "publicada") &&
		bloqueios.length > 0
	)
		erros.push(
			`campanha "${campanha.estado}" com ${bloqueios.length} bloqueio(s) de publicação`,
		);

	return { erros, bloqueios, avisos };
}

/** `verificarRegras` do core com as regras do domínio e as da casa. */
export function verificarTexto(texto: string, campanha: Campanha): Violacao[] {
	return verificarRegras(texto, [...regrasDoDominio, ...campanha.regrasDaCasa]);
}

export function verificarDossie(
	dossie: Dossie,
	recursos: readonly Recurso[],
): Conferencia {
	const erros: string[] = [];
	const avisos: string[] = [];
	conferirEvidencias(dossie.evidencias, recursos, erros);

	const semProva: string[] = [];
	for (const p of dossie.perguntas) {
		for (const id of idsSemEvidencia(p.evidencias, dossie.evidencias))
			erros.push(`pergunta "${p.id}": evidência "${id}" não existe`);
		if (p.evidencias.length === 0 && PRIORIDADES_ALTAS.has(p.prioridade))
			semProva.push(p.id);
	}
	const lacunasCriticas = dossie.lacunas.filter(
		(l) => l.tipo === "informacao_a_confirmar" && l.prioridade === "critica",
	);

	if (dossie.decisao.estado === "avanca") {
		for (const id of semProva)
			erros.push(
				`etapa "${dossie.etapa}" avançou com a pergunta "${id}" sem evidência`,
			);
		if (lacunasCriticas.length > 0)
			erros.push(
				`etapa "${dossie.etapa}" avançou com lacuna crítica em aberto`,
			);
	}
	if (
		dossie.decisao.estado !== "pendente" &&
		dossie.decisao.motivo.trim() === ""
	)
		erros.push(`etapa "${dossie.etapa}": decisão sem motivo`);

	const bloqueios = [
		...semProva.map((id) => `pergunta "${id}" sem evidência`),
		...lacunasCriticas.map((l) =>
			l.tipo === "informacao_a_confirmar" ? `lacuna "${l.id}" crítica` : "",
		),
	];
	return { erros, bloqueios, avisos };
}

/** Proporção dos argumentos de prioridade alta que têm evidência (0–1). */
export function coberturaDeEvidencia(
	argumentos: readonly { prioridade: string; evidencias: readonly string[] }[],
): number {
	const altos = argumentos.filter((a) => PRIORIDADES_ALTAS.has(a.prioridade));
	if (altos.length === 0) return 0;
	return altos.filter((a) => a.evidencias.length > 0).length / altos.length;
}
