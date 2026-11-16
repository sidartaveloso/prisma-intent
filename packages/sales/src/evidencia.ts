/**
 * Evidência e referência numa proposta.
 *
 * O que afirma um fato sobre o proponente — um caso, uma métrica, uma
 * demonstração, uma certificação — só se sustenta com fonte. Aqui a fonte é
 * `Certeza<FonteDaEvidencia>`: enquanto `a_confirmar`, a evidência existe no
 * modelo (e pode ser trabalhada) mas não é renderizada. Uma certificação
 * confirmada sem fonte não compila.
 *
 * O que é do próprio proponente na proposta — a arquitetura, a resposta a um
 * requisito, o método de estimativa — não precisa de fonte externa: é a
 * proposta.
 */
import type { Certeza, Data, Procedencia, Redacao } from "@prisma-intent/core";
import type { Unidade } from "./vocabulario.ts";

/** De onde vem o fato. Sem uma destas, não há fonte. */
export type FonteDaEvidencia =
	/** Documento arquivado, com a citação literal (`Procedencia` do core). */
	| { tipo: "documento"; procedencia: Procedencia }
	| { tipo: "publica"; url: `https://${string}`; consultadaEm: Data }
	/**
	 * Uma pessoa confirmou que o fato é do proponente — a atribuição de um caso,
	 * por exemplo. Registro de pessoa, com data.
	 */
	| { tipo: "confirmacao_de_pessoa"; pessoa: Redacao; data: Data };

export type EvidenciaSales<
	TId extends string = string,
	TRequisito extends string = string,
> = { id: TId } & (
	| {
			tipo: "caso_entregue";
			nome: Redacao;
			descricao: Redacao;
			fonte: Certeza<FonteDaEvidencia>;
	  }
	| {
			tipo: "metrica_de_escala";
			nome: Redacao;
			valor: number;
			unidade: Unidade;
			/** Como o número foi definido — sem isso, é irreproduzível. */
			definicao: Redacao;
			fonte: Certeza<FonteDaEvidencia>;
	  }
	| { tipo: "arquitetura"; descricao: Redacao }
	| { tipo: "item_de_conformidade"; requisito: TRequisito }
	| {
			tipo: "estimativa_rastreavel";
			/** O método, para o leitor. Os números por estimador ficam na `Estimativa`, interna. */
			metodo: Redacao;
	  }
	| {
			tipo: "demonstracao";
			formato: "ambiente" | "video";
			descricao: Redacao;
			fonte: Certeza<FonteDaEvidencia>;
	  }
	| {
			tipo: "certificacao";
			nome: Redacao;
			emissor: Redacao;
			fonte: Certeza<FonteDaEvidencia>;
	  }
);

/**
 * Referência usada por argumentos e objeções. Discriminada, e com os ids
 * conferidos contra o que a instância declara.
 */
export type ReferenciaSales<
	TEvidencia extends string = string,
	TPacote extends string = string,
	TRequisito extends string = string,
> =
	| { tipo: "evidencia"; evidencia: TEvidencia }
	| { tipo: "pacote"; pacote: TPacote }
	| { tipo: "requisito"; requisito: TRequisito };
