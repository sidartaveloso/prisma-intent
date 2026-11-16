/**
 * Intenção: o efeito que a história deve provocar no aprendiz.
 *
 * Três naturezas, verificadas de formas diferentes (core, `EfeitosDesejados`):
 * o cognitivo aparece no que o aprendiz entende, o emocional no que sente, o
 * comportamental no que faz — e só o último é observável. Por isso o objetivo
 * observável (`objetivo.ts`) só existe para efeitos comportamentais.
 */
import type { EstrategiaNarrativa, NossaIntencao } from "@prisma-intent/core";
import type {
	EfeitoCognitivo,
	EfeitoComportamental,
	EfeitoEmocional,
	Sentimento,
} from "./vocabulario.ts";

/**
 * Tipos de intenção que uma história pode ter: a natureza do efeito central.
 * O nome que cada produto dá às suas séries é vocabulário da instância.
 */
export type TipoDeIntencao =
	/** O aprendiz passa a entender algo do mundo: ciclo da água, sistema solar. */
	| "descoberta"
	/** O aprendiz passa a lidar melhor com algo da vida: perder, dividir, esperar. */
	| "licao_de_vida"
	/** O aprendiz constrói ou mantém um hábito. */
	| "habito"
	/** O aprendiz e quem o acompanha vivem algo juntos; o efeito é o vínculo. */
	| "vinculo"
	/** Transição do dia: começar, desacelerar, encerrar. */
	| "transicao";

/**
 * A intenção no formato do core, com os vocabulários desta especialização.
 * `TComportamental` é a união dos efeitos da base com os que a instância soma.
 */
export type NossaIntencaoEducate<
	TComportamental extends string = EfeitoComportamental,
> = NossaIntencao<
	TipoDeIntencao,
	EfeitoCognitivo,
	EfeitoEmocional,
	TComportamental
>;

/** A estratégia narrativa do core com os sentimentos deste domínio. */
export type EstrategiaNarrativaEducate = EstrategiaNarrativa<Sentimento>;
