/**
 * Objetivo observável: o que transforma um efeito em algo que se pode relatar
 * sem inventar.
 *
 * Fórmula de Mager (ENAP, 2015): verbo observável + objeto + condição +
 * critério. Só existe para o que dá para ver: o efeito emocional nunca vira
 * objetivo, porque se infere pelo comportamento em vez de se observar.
 *
 * Este módulo depende só do core, de propósito. O conceito não tem nada de
 * educação em particular — qualquer domínio que deseje um efeito
 * comportamental pode querer dizer como ele é observado —, e mantê-lo solto é
 * o que o deixa pronto para subir para o core quando uma segunda
 * especialização precisar dele.
 */
import type { Redacao } from "@prisma-intent/core";

/** `efeito` amarra o objetivo ao efeito comportamental que ele torna verificável. */
export interface ObjetivoObservavel<TEfeito extends string> {
	efeito: TEfeito;
	/** "Dizer 'boa!' para quem ganhou" — verbo observável, nunca "compreender" ou "sentir". */
	comportamento: Redacao;
	/** "Quando perder um jogo". */
	condicao?: Redacao;
	/** "Pelo menos uma vez na semana", "sem ser lembrado". */
	criterio?: Redacao;
}

/**
 * Verbos que não descrevem nada que se veja. Um efeito comportamental ou um
 * objetivo escrito com eles está declarando o que se passa dentro da pessoa,
 * e isso é efeito cognitivo ou emocional.
 */
export const verbosNaoObservaveis = [
	"compreender",
	"sentir",
	"pensar",
	"refletir",
	"valorizar",
] as const;

/**
 * O verbo não observável que o texto usa, se usa algum.
 *
 * Serve à base de efeitos deste pacote e aos efeitos que cada instância soma:
 * a exigência de Mager vale para os dois.
 */
export function verboNaoObservavel(texto: string): string | undefined {
	return verbosNaoObservaveis.find((verbo) =>
		new RegExp(`\\b${verbo}\\b`, "i").test(texto),
	);
}
