/**
 * Argumento — a unidade real da narrativa.
 *
 * Um currículo não é feito de projetos; é feito de argumentos sobre alguém,
 * sustentados por projetos. Por isso a seleção começa pelo argumento que
 * precisamos provar, e só então busca a melhor evidência disponível.
 */
import type { Prioridade } from "./prioridade.ts";
import type { Redacao } from "./utilitarios.ts";

export interface Argumento<TId extends string, TReferencia> {
	id: TId;
	prioridade: Prioridade;
	/** A afirmação que este argumento sustenta, em uma frase. */
	tese: Redacao;
	/** O que sustenta a tese. Vazio aqui significa tese sem prova. */
	evidencias: readonly TReferencia[];
	/** Percepção que este argumento existe para criar ou desfazer. */
	efeitoDesejado?: Redacao;
}
