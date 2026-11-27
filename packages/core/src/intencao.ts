/**
 * As duas intenções do PRISMA Intent.
 *
 * `IntencaoDoConsumidor` — o que ele está tentando descobrir.
 * `NossaIntencao` — o que queremos que ele conclua.
 *
 * A estratégia nasce do encontro das duas dentro de um contexto. Manter as
 * duas separadas é o que impede o material de virar monólogo.
 */
import type { Redacao } from "./utilitarios.ts";

/**
 * Efeitos que queremos provocar em um consumidor humano.
 *
 * Separados por natureza porque se verificam de formas diferentes: o cognitivo
 * aparece no que a pessoa entende, o emocional no que ela sente, o
 * comportamental no que ela faz — e só o último é observável.
 */
export interface EfeitosDesejados<
	TCognitivo extends string,
	TEmocional extends string,
	TComportamental extends string,
> {
	cognitivos: readonly TCognitivo[];
	emocionais: readonly TEmocional[];
	comportamentais: readonly TComportamental[];
}

/** O que queremos que o consumidor conclua, e por quais efeitos. */
export interface NossaIntencao<
	TTipo extends string,
	TCognitivo extends string,
	TEmocional extends string,
	TComportamental extends string,
> {
	tipo: TTipo;
	/** A percepção única que todo o material deve construir. */
	percepcaoCentral: Redacao;
	efeitosDesejados: EfeitosDesejados<TCognitivo, TEmocional, TComportamental>;
}
