/**
 * Canal e contexto — onde e em que situação a comunicação é consumida.
 *
 * O mesmo consumidor, com a mesma intenção, merece discursos diferentes em
 * canais diferentes: um CTO no LinkedIn não está na mesma situação que o mesmo
 * CTO lendo um case técnico no site.
 */
import type { Redacao } from "./utilitarios.ts";

/** Quanto o consumidor está disposto a ler naquele canal. */
export type Profundidade = "minima" | "media" | "alta" | "adaptativa";

/** Situação de consumo: canal + momento + profundidade tolerada. */
export interface Contexto<TCanal extends string> {
	canal: TCanal;
	profundidade: Profundidade;
	/** O que já é conhecido pelo consumidor quando ele chega por este canal. */
	pressupostos?: readonly Redacao[];
}
