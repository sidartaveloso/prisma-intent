/**
 * Premissa: um valor com que se trabalha antes de ser confirmado.
 *
 * `Certeza<T>` torna o desconhecido representável, mas `a_confirmar` não
 * carrega valor — e há domínios que precisam calcular antes de decidir: uma
 * proposta calcula o preço com uma taxa ainda em discussão; uma campanha
 * trabalha com uma meta de apoios ainda não fechada. A premissa guarda o valor
 * de trabalho e o estado, para que o cálculo aconteça e a saída saiba que
 * ainda é rascunho.
 *
 * Confirmar é decisão de pessoa, registrada com nome, data e onde.
 *
 * Promovido da Sales (task-042): a Funding precisou do mesmo conceito, e dois
 * domínios precisando dele é o sinal de que é gramática, não vocabulário.
 */
import type { Redacao } from "./utilitarios.ts";

/** Data no formato ISO 8601 (`AAAA-MM-DD`). */
export type Data = `${number}-${number}-${number}`;

/** Quem decidiu, quando e onde está registrado. */
export type DecisaoRegistrada = {
	pessoa: Redacao;
	data: Data;
	/** Onde a decisão está registrada: documento, ata, mensagem. */
	registro: Redacao;
};

export type Premissa<TValor> =
	| { estado: "confirmada"; valor: TValor; decisao: DecisaoRegistrada }
	| { estado: "a_confirmar"; valorDeTrabalho: TValor };

/** O tipo do valor de uma premissa, distribuído sobre uniões. */
export type ValorDaPremissa<P> = P extends { valor: infer V }
	? V
	: P extends { valorDeTrabalho: infer V }
		? V
		: never;

/**
 * O valor com que se calcula, confirmado ou não.
 *
 * Genérico na premissa inteira, e não no valor, para aceitar uniões: a taxa de
 * `PrecoDaProposta` é uma premissa por moeda, e a inferência por `TValor`
 * escolheria uma moeda e recusaria as outras.
 */
export function valorDaPremissa<P extends Premissa<unknown>>(
	premissa: P,
): ValorDaPremissa<P> {
	return (
		premissa.estado === "confirmada" ? premissa.valor : premissa.valorDeTrabalho
	) as ValorDaPremissa<P>;
}
