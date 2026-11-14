/**
 * Objeção — o que pode impedir o consumidor de acreditar, confiar ou avançar.
 *
 * A intenção trabalha o que queremos construir; a objeção trabalha o que
 * bloqueia essa construção. Por isso ela é parte central da estratégia, não
 * apêndice: material que ignora a objeção provável perde antes de argumentar.
 *
 * A resposta é uma união porque a forma de responder muda o que precisa ser
 * declarado — resolver por evidência exige provas; resolver por motivação
 * positiva exige, sobretudo, saber o que evitar.
 */
import type { Prioridade } from "./prioridade.ts";
import type { Redacao } from "./utilitarios.ts";

export type RespostaEstrategica<TReferencia> =
	| {
			tipo: "resolver_por_evidencia";
			diretriz: Redacao;
			evidenciasPrioritarias: readonly TReferencia[];
	  }
	| {
			tipo: "resolver_por_motivacao_positiva";
			diretriz: Redacao;
			evidenciasPrioritarias: readonly TReferencia[];
			/** Movimentos que reforçariam a objeção se usados. */
			evitar: readonly Redacao[];
	  }
	| {
			tipo: "reposicionamento";
			diretriz: Redacao;
			evidenciasPrioritarias: readonly TReferencia[];
	  }
	| {
			tipo: "resolver_por_contexto";
			diretriz: Redacao;
			evidenciasPrioritarias: readonly TReferencia[];
	  }
	| {
			tipo: "diversificacao_de_evidencias";
			diretriz: Redacao;
			evidenciasPrioritarias: readonly TReferencia[];
	  }
	| {
			tipo: "delimitacao";
			diretriz: Redacao;
	  };

export type Objecao<TId extends string, TReferencia> = {
	id: TId;
	prioridade: Prioridade;
	/** O que o consumidor pode concluir por conta própria, sem que digamos. */
	hipotese: Redacao;
	resposta: RespostaEstrategica<TReferencia>;
} & (
	| { natureza: "risco_de_interpretacao" }
	/** Conclusão factualmente errada — aqui não se argumenta, se delimita. */
	| { natureza: "interpretacao_incorreta" }
);
