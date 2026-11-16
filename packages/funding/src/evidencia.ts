/**
 * Evidência — o que sustenta um argumento de campanha ou uma pergunta de etapa.
 *
 * Cada natureza se verifica de um jeito, como no core (`Evidencia`). A que esta
 * especialização acrescenta é a `demonstracao`: a prova de que o produto faz o
 * que se promete, que só vale sobre recurso de protótipo ou registro real.
 */
import type {
	NivelDeEvidencia,
	Procedencia,
	Redacao,
} from "@prisma-intent/core";
import type { Unidade } from "./vocabulario.ts";

export type EvidenciaFunding<
	TId extends string = string,
	TRecurso extends string = string,
> = {
	id: TId;
	nivel: NivelDeEvidencia;
	/** De onde veio — ver `Procedencia` no core. */
	procedencia?: Procedencia;
} & (
	| {
			tipo: "demonstracao";
			/** Recurso de natureza `prototipo` ou `registro_real`; conceito é recusado. */
			recurso: TRecurso;
			/** O que o registro mostra acontecendo. */
			mostra: Redacao;
	  }
	| {
			tipo: "medicao";
			nome: Redacao;
			valor: number;
			unidade: Unidade;
			/** Como foi medido — sem isso o número é irreproduzível. */
			definicao: Redacao;
			recurso?: TRecurso;
	  }
	| {
			tipo: "documento";
			arquivo: Redacao;
			/** Afirmações que este documento sustenta. */
			sustenta: readonly Redacao[];
			/** O que a fonte não cobre. */
			observacao?: Redacao;
	  }
	| {
			tipo: "fonte_publica";
			url: Redacao;
			/** Data ISO da consulta: regra de plataforma muda. */
			consultadaEm: string;
			sustenta: readonly Redacao[];
	  }
);
