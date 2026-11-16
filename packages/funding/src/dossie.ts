/**
 * Dossiê de etapa: cada etapa do método é uma peça com intenção.
 *
 * O consumidor é o decisor interno; a intenção dele é decidir se a etapa
 * avança; a nossa é que ele decida por evidência, não por entusiasmo. As
 * perguntas da etapa são argumentos do core: uma tese a provar com evidências.
 * Pergunta sem evidência é lacuna, e lacuna crítica não deixa a etapa avançar.
 *
 * O vocabulário das etapas é da instância (`TEtapa`): a especialização só sabe
 * que há etapas e que cada uma se decide assim.
 */
import type {
	Argumento,
	DecisaoRegistrada,
	Lacuna,
	Redacao,
} from "@prisma-intent/core";
import type { EvidenciaFunding } from "./evidencia.ts";
import type { NossaIntencaoFunding } from "./intencao.ts";

export type DecisaoDaEtapa =
	| { estado: "pendente" }
	| {
			estado: "avanca" | "revisa" | "interrompe";
			/** Quem decidiu, quando e onde está registrado. */
			decisao: DecisaoRegistrada;
			motivo: Redacao;
	  };

export interface Dossie<
	TEtapa extends string = string,
	TPergunta extends string = string,
	TEvidencia extends string = string,
	TRecurso extends string = string,
> {
	etapa: TEtapa;
	/** Para onde vai se avançar. */
	proxima: TEtapa;
	intencao: NossaIntencaoFunding<TRecurso> & { tipo: "decidir_etapa" };
	perguntas: readonly Argumento<TPergunta, NoInfer<TEvidencia>>[];
	evidencias: readonly EvidenciaFunding<TEvidencia, TRecurso>[];
	lacunas: readonly Lacuna<NoInfer<TPergunta>>[];
	decisao: DecisaoDaEtapa;
}

export function definirDossie<
	const TEtapa extends string,
	const TPergunta extends string,
	const TEvidencia extends string,
	const TRecurso extends string = never,
>(
	dossie: Dossie<TEtapa, TPergunta, TEvidencia, TRecurso>,
): Dossie<TEtapa, TPergunta, TEvidencia, TRecurso> {
	return dossie;
}
