/**
 * Instância PRISMA Intent Work.
 *
 * Uma instância é a base única da qual saem currículo, site, LinkedIn e
 * entrevista — três documentos independentes viram três renderizações do mesmo
 * conjunto de fatos, argumentos e evidências.
 *
 * Os parâmetros de tipo existem para uma coisa só: fazer o compilador validar
 * as referências cruzadas. Os ids dos cases e dos argumentos são inferidos do
 * próprio dado, e qualquer referência a um id inexistente — em um argumento,
 * numa objeção, na ordem editorial ou numa renderização — vira erro de
 * compilação.
 *
 * O `NoInfer` nas posições de referência é o que faz isso funcionar: sem ele,
 * um `case: "painel-de-frota"` escrito por engano seria absorvido pela
 * inferência, ampliando a união em vez de ser recusado. Só `cases[].id` e
 * `argumentos[].id` definem os literais válidos; todo o resto é conferido
 * contra eles.
 */
import type {
	Argumento,
	Consumidor,
	CriterioDeDecisao,
	Evidencia,
	Lacuna,
	NossaIntencao,
	Objecao,
	Prioridade,
	Redacao,
	RegraDeIntegridade,
	Renderizacao,
} from "@prisma-intent/core";
import type { BaseTecnica } from "./base-tecnica.ts";
import type { CaseExcluido, CaseProfissional } from "./case-profissional.ts";
import type {
	ConclusaoEstrategica,
	EstrategiaEditorial,
} from "./estrategia.ts";
import type { ExperienciaProfissional, Quantidade } from "./experiencia.ts";
import type { Certificacao, FormacaoAcademica, Idioma } from "./formacao.ts";
import type { Oportunidade } from "./oportunidade.ts";
import type { Motivacao, Pessoa } from "./pessoa.ts";
import type { ReferenciaDeEvidencia } from "./referencias.ts";
import type {
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

export type ConsumidorWork<TArgumento extends string> = Consumidor<
	PerfilHumano,
	PerfilAgente,
	IntencaoDoConsumidor,
	TArgumento
>;

export type NossaIntencaoWork = NossaIntencao<
	"construcao_de_percepcao_profissional",
	EfeitoCognitivo,
	Sentimento,
	EfeitoComportamental
>;

/** Evidência de liderança que não pertence a um único case. */
export interface EvidenciaDeLideranca<TCase extends string> {
	descricao: Redacao;
	case?: TCase;
	quantidade?: Quantidade;
}

export interface InstanciaWork<
	TCase extends string = string,
	TArgumento extends string = string,
	TCriterio extends string = string,
	TObjecao extends string = string,
	TRegra extends string = string,
> {
	schemaVersion: `${number}.${number}.${number}`;
	produto: {
		nome: "PRISMA Intent";
		descricao: "Narrativa Semântica Adaptativa orientada por intenção";
		especializacao: "work";
	};
	instancia: {
		id: Redacao;
		tipo: "posicionamento_para_oportunidade_profissional";
		estado: "em_construcao" | "ativa" | "arquivada";
		idiomaBase: "pt-BR";
	};
	objetivo: {
		descricao: Redacao;
		resultadoEsperado: Redacao;
	};

	pessoa: Pessoa;
	oportunidade: Oportunidade;
	motivacao: Motivacao;
	experiencias: readonly ExperienciaProfissional[];
	formacao: readonly FormacaoAcademica[];
	certificacoes: readonly Certificacao[];
	idiomas: readonly Idioma[];
	lideranca: readonly EvidenciaDeLideranca<NoInfer<TCase>>[];
	baseTecnica: BaseTecnica;
	qualidades: readonly Qualidade[];

	cases: readonly CaseProfissional<TCase>[];
	casesExcluidos: readonly CaseExcluido[];

	argumentos: readonly Argumento<
		TArgumento,
		ReferenciaDeEvidencia<NoInfer<TCase>>
	>[];
	consumidores: readonly ConsumidorWork<NoInfer<TArgumento>>[];
	nossaIntencao: NossaIntencaoWork;
	criterios: readonly CriterioDeDecisao<TCriterio>[];
	objecoes: readonly Objecao<TObjecao, ReferenciaDeEvidencia<NoInfer<TCase>>>[];

	estrategiaEditorial: EstrategiaEditorial<NoInfer<TCase>, NoInfer<TArgumento>>;
	renderizacoes: readonly Renderizacao<
		Canal,
		NoInfer<TCase>,
		IdiomaDePublicacao
	>[];

	/** O limite que nenhuma renderização atravessa. */
	regrasDeIntegridade: readonly RegraDeIntegridade<TRegra>[];
	evidencias: readonly Evidencia<Unidade>[];
	lacunas: readonly Lacuna<NoInfer<TCase>>[];
	conclusao: ConclusaoEstrategica;
}

/**
 * Declara uma instância inferindo os ids literais do próprio dado.
 *
 * Os parâmetros `const` capturam `cases[].id` e `argumentos[].id` como uniões
 * de literais, e é isso que permite ao compilador recusar uma referência a um
 * case que não existe.
 *
 * @example
 * export const instancia = definirInstancia({
 *   cases: [{ id: "painel-de-frotas", ... }],
 *   argumentos: [{ id: "arquitetura", evidencias: [{ tipo: "case", case: "painel-de-frota" }] }],
 *   //                                              erro: "painel-de-frota" não existe ^
 * });
 */
export function definirInstancia<
	const TCase extends string,
	const TArgumento extends string,
	const TCriterio extends string,
	const TObjecao extends string,
	const TRegra extends string,
>(
	instancia: InstanciaWork<TCase, TArgumento, TCriterio, TObjecao, TRegra>,
): InstanciaWork<TCase, TArgumento, TCriterio, TObjecao, TRegra> {
	return instancia;
}

/** Prioridades ordenadas da mais alta para a mais baixa. */
export const ordemDePrioridade: readonly Prioridade[] = [
	"critica",
	"muito_alta",
	"alta",
	"media",
	"baixa",
];
