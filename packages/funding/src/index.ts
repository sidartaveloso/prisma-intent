/**
 * # PRISMA Intent Funding
 *
 * Especialização do PRISMA Intent para financiar um produto antes de ele
 * existir em série: validar demanda, convencer a apoiar só com o que já foi
 * provado, prestar contas depois, e decidir cada etapa interna por evidência.
 *
 * Depende de `@prisma-intent/core` e nunca o contrário. O core não sabe o que
 * é campanha, apoiador, protótipo ou etapa — esses conceitos existem apenas
 * aqui. Nenhum dado de produto ou campanha concreta vive neste pacote: a
 * instância fica com quem a usa.
 */
export type {
	ArgumentoDe,
	Campanha,
	EstadoDaCampanha,
	RecursoDe,
	RenderizacaoFunding,
} from "./campanha.ts";
export { definirCampanha } from "./campanha.ts";
export type { DecisaoDaEtapa, Dossie } from "./dossie.ts";
export { definirDossie } from "./dossie.ts";
export type { EvidenciaFunding } from "./evidencia.ts";
export type {
	EstrategiaNarrativaFunding,
	MetaDoEfeito,
	NossaIntencaoFunding,
	ObservacaoDoEfeito,
	ObservacaoDosEfeitos,
	TipoDeIntencao,
} from "./intencao.ts";
export type { ConsumidorFunding } from "./publico.ts";
export type {
	Linguagem,
	NaturezaDoRecurso,
	Recurso,
	Vinculo,
} from "./recurso.ts";
export type { IdDaRegraDoDominio } from "./regras.ts";
export { regrasDoDominio } from "./regras.ts";
export type { Conferencia } from "./verificar.ts";
export {
	coberturaDeEvidencia,
	verificarCampanha,
	verificarDossie,
	verificarTexto,
} from "./verificar.ts";
export type {
	Canal,
	CriterioDeDecisaoId,
	EfeitoCognitivo,
	EfeitoComportamental,
	EfeitoEmocional,
	IdiomaDePublicacao,
	IntencaoDoConsumidor,
	PerfilAgente,
	PerfilHumano,
	Plataforma,
	Sentimento,
	Unidade,
} from "./vocabulario.ts";
export {
	canaisInternos,
	criteriosDeDecisao,
	efeitosCognitivos,
	efeitosComportamentais,
	efeitosEmocionais,
	intencoesDoConsumidor,
	perfisAgente,
	perfisHumanos,
} from "./vocabulario.ts";
