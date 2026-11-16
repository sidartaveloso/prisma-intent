/**
 * Intenção na Funding e observação dos efeitos.
 *
 * Quatro tipos, pela natureza do efeito central: validar que há demanda,
 * financiar a produção, prestar contas depois do financiamento e decidir
 * internamente uma etapa. A intenção aponta os poucos recursos que a realizam
 * (vínculo com papel); o resto da peça é estrutural.
 *
 * Cada efeito comportamental desejado declara como é observado, no molde de
 * `ObservacaoDosEfeitos` do core: esquecer um é erro de
 * compilação. Nem todo efeito se vê na plataforma; o que acontece fora dela é
 * registrado por uma pessoa, em vez de fingir uma métrica.
 */
import type {
	EstrategiaNarrativa,
	NossaIntencao,
	ObservacaoDosEfeitos as ObservacaoDosEfeitosDoCore,
	Premissa,
	Redacao,
} from "@prisma-intent/core";
import type { Vinculo } from "./recurso.ts";
import type {
	EfeitoCognitivo,
	EfeitoComportamental,
	EfeitoEmocional,
	Sentimento,
	Unidade,
} from "./vocabulario.ts";

export type TipoDeIntencao =
	/** Antes da campanha: medir se há gente querendo (lista de interesse, verificador). */
	| "validar_demanda"
	/** A campanha: levar quem entendeu e confia a apoiar. */
	| "financiar_producao"
	/** Depois do financiamento: manter a confiança com a verdade do andamento. */
	| "prestar_contas"
	/** Interna: levar o decisor a decidir uma etapa por evidência. */
	| "decidir_etapa";

export type NossaIntencaoFunding<
	TRecurso extends string = string,
	TComportamental extends EfeitoComportamental = EfeitoComportamental,
> = NossaIntencao<
	TipoDeIntencao,
	EfeitoCognitivo,
	EfeitoEmocional,
	TComportamental
> & {
	/** Os poucos recursos que realizam esta intenção. Não apontado = estrutural. */
	recursos: readonly Vinculo<TRecurso>[];
};

/** Meta de um efeito: valor e unidade. */
export type MetaDoEfeito = { valor: number; unidade: Unidade };

/** De onde vem a observação de um efeito comportamental. */
export type ObservacaoDoEfeito = (
	| {
			/** O que a plataforma de financiamento informa. */
			por: "plataforma";
			metrica:
				| "apoios_confirmados"
				| "valor_arrecadado"
				| "compartilhamentos"
				| "perguntas_recebidas";
	  }
	| {
			/** O que o site do proponente registra. */
			por: "site";
			sinal: "inscricao_na_lista" | "consulta_ao_verificador";
	  }
	| {
			/** Fora de qualquer sistema: uma pessoa registra. */
			por: "registro_de_pessoa";
			como: Redacao;
	  }
) & {
	/** A meta, quando o efeito tem uma; `a_confirmar` bloqueia a publicação. */
	meta?: Premissa<MetaDoEfeito>;
};

/** Uma observação para cada efeito comportamental das intenções (regra do core). */
export type ObservacaoDosEfeitos<TComportamental extends EfeitoComportamental> =
	ObservacaoDosEfeitosDoCore<
		TComportamental,
		EfeitoComportamental,
		ObservacaoDoEfeito
	>;

export type EstrategiaNarrativaFunding = EstrategiaNarrativa<Sentimento>;
