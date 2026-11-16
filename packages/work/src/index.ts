/**
 * # PRISMA Intent Work
 *
 * Especialização do PRISMA Intent para comunicação e posicionamento
 * profissional: currículo, portfólio, site pessoal, LinkedIn, candidatura,
 * entrevista e contratação para consultoria.
 *
 * Depende de `@prisma-intent/core` e nunca o contrário. O core não sabe o que é
 * currículo, vaga ou recrutador — esses conceitos existem apenas aqui.
 */

export type { EstadoDaAtuacao } from "./atuacao.ts";
export { casesEmAndamento, estadoDaAtuacao } from "./atuacao.ts";
export type {
	AreaTecnica,
	BaseTecnica,
	EixoDeCompetencia,
	GrupoDeCompetencias,
} from "./base-tecnica.ts";
export type {
	CaseExcluido,
	CaseProfissional,
	FonteDeComplexidade,
	PapelNarrativo,
} from "./case-profissional.ts";
export { gerarCodigoPublico } from "./codigo-publico.ts";
export type { Afirmacao } from "./conferencia.ts";
export {
	aconselhar,
	afirmacoesSemProcedencia,
	coletarAfirmacoes,
	coletarProcedencias,
	idDaLacunaDeFonte,
} from "./conferencia.ts";
export type {
	CaseNaOrdem,
	ConclusaoEstrategica,
	EstrategiaEditorial,
	LinhaNarrativa,
} from "./estrategia.ts";
export type {
	Autoria,
	Cargo,
	Dedicacao,
	ExperienciaProfissional,
	Frente,
	Periodo,
	Quantidade,
	Vinculo,
} from "./experiencia.ts";
export type {
	Certificacao,
	FormacaoAcademica,
	GrauAcademico,
	Idioma,
	NivelDeIdioma,
} from "./formacao.ts";
export type {
	ConsumidorWork,
	EvidenciaDeLideranca,
	InstanciaWork,
	NossaIntencaoWork,
} from "./instancia.ts";
export {
	definirInstancia,
	ordemDePrioridade,
} from "./instancia.ts";
export type { ContextoDaPagina } from "./json-ld.ts";
export { montarJsonLd, montarProfilePage } from "./json-ld.ts";
export type {
	Indicacao,
	Oportunidade,
	OrigemDaOportunidade,
} from "./oportunidade.ts";
export type {
	Identidade,
	Modalidade,
	Motivacao,
	Pessoa,
	Posicionamento,
} from "./pessoa.ts";
export type { TermoReservado } from "./publicacao.ts";
export { termosNaoPublicaveis } from "./publicacao.ts";
export {
	descreverEscala,
	descreverParticipacao,
	descreverQuantidade,
	descreverResultados,
	descreverVinculo,
	rotuloDeUnidade,
	verboDaFrente,
} from "./redacao.ts";
export type {
	AtributoProbatorio,
	ReferenciaDeEvidencia,
} from "./referencias.ts";
export type {
	Canal,
	EfeitoCognitivo,
	EfeitoComportamental,
	IdiomaDePublicacao,
	IntencaoDoConsumidor,
	PerfilAgente,
	PerfilHumano,
	Qualidade,
	Sentimento,
	Unidade,
} from "./vocabulario.ts";
export {
	perfisAgente,
	perfisHumanos,
	qualidades,
} from "./vocabulario.ts";
