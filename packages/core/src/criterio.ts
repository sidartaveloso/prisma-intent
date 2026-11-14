/**
 * Critério de decisão — as dimensões pelas quais o consumidor decide.
 *
 * Não é o que queremos mostrar; é o que ele vai usar para decidir. A estratégia
 * consiste em cobrir os critérios de maior prioridade com os argumentos mais
 * bem sustentados.
 */
import type { Prioridade } from "./prioridade.ts";

export interface CriterioDeDecisao<TId extends string> {
	id: TId;
	prioridade: Prioridade;
}
