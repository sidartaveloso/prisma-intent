/**
 * Cronograma: fases e marcos de aceite do cliente.
 *
 * Os prazos contam em meses a partir de `inicio` — em geral, a adjudicação.
 * Enquanto a data não é conhecida, `inicio` fica `a_confirmar` e nenhuma
 * renderização calcula data absoluta: o cronograma continua verdadeiro sem
 * afirmar o que não se sabe.
 *
 * Cada marco de aceite cita os pacotes que o compõem, e o pagamento por marco
 * (`MarcoDePagamento`) cita o marco — referências que o compilador confere.
 */
import type { Certeza, Data, PeloMenosUm, Redacao } from "@prisma-intent/core";

/** O que o cliente confere e aceita, num mês do cronograma. */
export type MarcoDeAceite<
	TMarco extends string = string,
	TPacote extends string = string,
> = {
	id: TMarco;
	nome: Redacao;
	/** Mês do marco, contado a partir do início (mês 0). */
	mes: number;
	/** O que o cliente confere para aceitar. */
	criterioDeAceite: Redacao;
	/** Pacotes de trabalho entregues neste marco. */
	pacotes: PeloMenosUm<TPacote>;
};

export type FaseDoCronograma<
	TMarco extends string = string,
	TPacote extends string = string,
> = {
	nome: Redacao;
	/** Meses de início e de fim, contados a partir do início do cronograma. */
	meses: { de: number; ate: number };
	/** Uma fase pode não ter marco de aceite próprio, como a mobilização. */
	marcos: readonly MarcoDeAceite<TMarco, TPacote>[];
};

export type Cronograma<
	TMarco extends string = string,
	TPacote extends string = string,
> = {
	/** Data do mês 0. Desconhecida até a adjudicação. */
	inicio: Certeza<Data>;
	fases: PeloMenosUm<FaseDoCronograma<TMarco, TPacote>>;
};
