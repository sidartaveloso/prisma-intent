/**
 * Perfil de público: quem vai viver a história.
 *
 * Descreve o aprendiz pelo que ele é e precisa, separado do que busca agora
 * (`IntencaoDoConsumidor`) e do que queremos provocar (`NossaIntencao`) — a
 * separação central do core.
 *
 * O que esta especialização acrescenta ao core: **quem aprende nem sempre é
 * quem decide**. A criança vive e outra pessoa decide por ela; o adulto que
 * estuda por conta própria vive e decide. Por isso o perfil declara quem
 * decide, em vez de supor.
 */
import type { Consumidor, PeloMenosUm, Redacao } from "@prisma-intent/core";
import type {
	IntencaoDoConsumidor,
	PerfilAgente,
	PerfilHumano,
} from "./vocabulario.ts";

/**
 * Estágio de desenvolvimento, como dado.
 *
 * Para algumas idades existem marcos publicados por um referencial; para
 * outras, a descrição é de quem educa. A união deixa isso explícito em vez de
 * fingir que os dois casos têm a mesma base. Os estágios que uma instância
 * usa são vocabulário dela (`TEstagio`).
 */
export type EstagioDeDesenvolvimento<TEstagio extends string = string> =
	| {
			base: "marco_publicado";
			/** O referencial citado, com o que identifica a publicação. */
			referencial: Redacao;
			descricao: Redacao;
	  }
	| {
			base: "descricao_propria";
			estagio: TEstagio;
	  };

/** Alguém na vida do aprendiz, em relação a onde a história será vivida. */
export interface PessoaNaVidaDoAprendiz {
	/** Nome ou vínculo, como o aprendiz a chama. */
	comoEChamada: Redacao;
	/** Se está no mesmo lugar em que a história será vivida. */
	noMesmoLugar: boolean;
}

/**
 * Quem decide o que o aprendiz recebe.
 *
 * É união para que o estado "outra pessoa decide, e não há ninguém" não seja
 * representável: sem quem decida, nada se configura nem se aprova.
 */
export type QuemDecide =
	/** O aprendiz decide por si: o adulto que estuda por conta própria. */
	| { tipo: "o_proprio_aprendiz" }
	/** Outra pessoa decide: na infância, quem responde pela criança. */
	| { tipo: "outra_pessoa"; decisores: PeloMenosUm<PessoaNaVidaDoAprendiz> };

/**
 * O aprendiz que vai viver a história.
 *
 * `TFaixa`, `TNecessidade` e `TEstagio` são vocabulário da instância: o pacote
 * não fixa faixa etária, necessidade nem estágio nenhum.
 */
export interface PerfilDeAprendiz<
	TFaixa extends string = string,
	TNecessidade extends string = string,
	TEstagio extends string = string,
> {
	/** Primeiro nome, como aparece na história. */
	nome: Redacao;
	/** A faixa em que a instância o situa, quando ela trabalha com faixas. */
	faixa?: TFaixa;
	estagio?: EstagioDeDesenvolvimento<TEstagio>;
	/** Universos de interesse: espaço, dinossauros, música, cozinha. */
	interesses: readonly Redacao[];
	/** Necessidades específicas que o conteúdo atende. */
	necessidades: readonly TNecessidade[];
	quemDecide: QuemDecide;
	/** Quem acompanha sem decidir. Pode ser ninguém. */
	quemAcompanha: readonly PessoaNaVidaDoAprendiz[];
	/** Outros aprendizes que convivem com este, por nome. */
	pares: readonly Redacao[];
}

/**
 * Consumidor deste domínio: os perfis humanos e de agente vêm do vocabulário;
 * a intenção do consumidor é a união discriminada de `vocabulario.ts`.
 */
export type ConsumidorEducate<TArgumento extends string> = Consumidor<
	PerfilHumano,
	PerfilAgente,
	IntencaoDoConsumidor,
	TArgumento
>;
