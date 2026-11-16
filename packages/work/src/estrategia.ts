/**
 * Estratégia editorial — a ordem em que a argumentação acontece.
 *
 * Princípio central do PRISMA Intent: **demonstrar antes de afirmar**. A ordem
 * não é estética; ela decide qual conclusão o leitor já formou quando chega ao
 * argumento seguinte.
 */
import type { Redacao } from "@prisma-intent/core";

export interface CaseNaOrdem<TCase extends string> {
	posicao: number;
	case: TCase;
	/** Por que ele ocupa esta posição, e não outra. */
	motivo: Redacao;
}

/** Fio que liga dois cases e produz um significado que nenhum tem sozinho. */
export interface LinhaNarrativa<TCase extends string> {
	id: Redacao;
	tipo: "continuidade_historica" | "evolucao_de_carreira" | "contraste";
	cases: readonly TCase[];
	mensagem: Redacao;
}

export interface EstrategiaEditorial<
	TCase extends string,
	TArgumento extends string,
> {
	principioCentral: Redacao;
	ordemArgumentativa: readonly TArgumento[];
	ordemDeCases: readonly CaseNaOrdem<TCase>[];
	casesComplementares: readonly TCase[];
	linhasNarrativas: readonly LinhaNarrativa<TCase>[];
}

/** A tese final: o que tudo isso, somado, deve significar. */
export interface ConclusaoEstrategica {
	tese: Redacao;
	/** A conclusão que o consumidor deve formar — não a que afirmamos. */
	conclusaoDoConsumidor: Redacao;
	encaixeNaOportunidade: Redacao;
}
