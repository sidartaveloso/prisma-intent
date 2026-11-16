/**
 * # PRISMA Intent Educate
 *
 * Especialização do PRISMA Intent para educação e aprendizagem, em qualquer
 * idade: histórias com intenção, missões que saem da tela, rotina, o contexto
 * de quem ensina e quem acompanha como participante.
 *
 * Depende de `@prisma-intent/core` e nunca o contrário. O core não sabe o que
 * é aprendiz, quem decide, missão ou objetivo observável — esses conceitos
 * existem apenas aqui.
 *
 * O que ela pediu ao core e o core não tinha: um consumidor que pode não ser
 * quem decide (a criança vive, outra pessoa decide), conteúdo que não
 * argumenta (uma história não persuade ninguém de uma tese) e efeito
 * comportamental com forma verificável. Tudo resolvido aqui, sem tocar o
 * core.
 *
 * O que é de um produto — faixas etárias, canais, linhas de conteúdo — não
 * mora aqui: é vocabulário da instância (`VocabularioDaInstancia`).
 */

export type { Brief, ModoDeConsumo, VocabularioDaInstancia } from "./brief.ts";
export { definirBrief, efeitosCobertos, efeitosSemObjetivo } from "./brief.ts";
export type {
	EstadoDaHistoria,
	EstadoDaMissao,
	EstadoDoConteudo,
	EstadoDoContexto,
	EstadoDoItemDaRotina,
	Transicoes,
} from "./estados.ts";
export {
	transicaoValida,
	transicoesDaHistoria,
	transicoesDaMissao,
	transicoesDoConteudo,
	transicoesDoContexto,
	transicoesDoItemDaRotina,
} from "./estados.ts";
export type {
	EstrategiaNarrativaEducate,
	NossaIntencaoEducate,
	TipoDeIntencao,
} from "./intencao.ts";
export type {
	MissaoDeQuemAcompanha,
	MissaoDoAprendiz,
	ObjetoDoAmbiente,
} from "./missao.ts";
export type { ObjetivoObservavel } from "./objetivo.ts";
export { verboNaoObservavel, verbosNaoObservaveis } from "./objetivo.ts";
export type {
	ConsumidorEducate,
	EstagioDeDesenvolvimento,
	PerfilDeAprendiz,
	PessoaNaVidaDoAprendiz,
	QuemDecide,
} from "./publico.ts";
export type { IdDaRegraDoDominio } from "./regras.ts";
export { regrasDoDominio } from "./regras.ts";
export type {
	Alinhamento,
	MundoFiccional,
	OrigemDoTema,
	Tema,
} from "./tema.ts";
export type {
	EfeitoCognitivo,
	EfeitoComportamental,
	EfeitoEmocional,
	IntencaoDoConsumidor,
	PerfilAgente,
	PerfilHumano,
	Sentimento,
	Unidade,
} from "./vocabulario.ts";
export {
	efeitosCognitivos,
	efeitosComportamentais,
	efeitosEmocionais,
	perfisAgente,
	perfisHumanos,
} from "./vocabulario.ts";
