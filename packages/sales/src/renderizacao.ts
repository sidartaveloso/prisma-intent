/**
 * Renderização da proposta.
 *
 * A `Renderizacao` do core com os vocabulários da Sales: o tipo é uma das
 * saídas da proposta, o conteúdo prioritário são as seções, na ordem em que
 * entram. A Sales acrescenta para quem a saída vai — uma planilha de preços
 * não vai a quem não vê o preço.
 *
 * `objetivo` e `regras` são instrução para quem escreve a saída, como na Work,
 * e nunca chegam ao leitor.
 */
import type { PeloMenosUm, Renderizacao } from "@prisma-intent/core";
import type {
	IdiomaDePublicacao,
	SecaoDaProposta,
	TipoDeRenderizacao,
} from "./vocabulario.ts";

export type RenderizacaoSales<TLeitor extends string = string> = Renderizacao<
	TipoDeRenderizacao,
	SecaoDaProposta,
	IdiomaDePublicacao
> & {
	/** Leitores que recebem esta saída. */
	leitores: PeloMenosUm<TLeitor>;
};
