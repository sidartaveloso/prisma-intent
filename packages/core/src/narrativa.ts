/**
 * Estratégia narrativa e ativos visuais.
 *
 * Cada peça declara o que deve provocar e a que conclusão deve levar. Isso vale
 * para texto e para imagem: um ativo visual sem intenção declarada é decoração,
 * e decoração não é modelável — nem verificável.
 */
import type { Redacao } from "./utilitarios.ts";

/** O que uma peça deve provocar e onde deve deixar o consumidor. */
export interface EstrategiaNarrativa<TSentimento extends string> {
	sentimentosDesejados: readonly TSentimento[];
	/** Conclusão que o consumidor deve formar sozinho, sem que a afirmemos. */
	conclusaoDesejada: Redacao;
	/** A frase que deve ficar na cabeça dele depois de fechar a página. */
	mensagemMental?: Redacao;
}

/**
 * Imagem de apoio orientada por intenção.
 *
 * A pergunta não é "que imagem ficaria bonita aqui?", e sim "que imagem ajuda
 * o leitor a sentir o que queremos que ele sinta?".
 */
export interface AtivoVisual<TSentimento extends string> {
	id: string;
	/** O que a imagem deve transmitir — não o que ela mostra. */
	intencao: Redacao;
	sentimentosDesejados: readonly TSentimento[];
	/** Descrição textual: acessibilidade e leitura por agentes. */
	descricaoAlternativa: Redacao;
	arquivo?: string;
	estado: "proposto" | "produzido";
}

/** Tratamento alternativo de uma mesma peça, para competir em teste. */
export interface Variante<TId extends string> {
	id: TId;
	descritivo: Redacao;
	/** Comportamento esperado — o que torna a variante uma hipótese. */
	hipotese: Redacao;
}
