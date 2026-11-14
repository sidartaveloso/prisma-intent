/**
 * Campanha: o contrato de uma campanha de financiamento, no molde do `Brief` do
 * `educar` e do `definirInstancia` do `work`.
 *
 * Consumidores + intenções + argumentos com evidência + objeções + critérios +
 * canais + renderizações + regras. Nada é publicado sem campanha, e a campanha
 * é a fonte das páginas: a renderização é projeção dela, nunca o contrário.
 *
 * Os parâmetros de tipo existem para o compilador validar referências
 * cruzadas: argumento que cita evidência inexistente, intenção que aponta
 * recurso inexistente ou renderização com conteúdo desconhecido viram erro de
 * compilação (`NoInfer` nas posições de referência).
 */
import type {
	Argumento,
	Certeza,
	Contexto,
	CriterioDeDecisao,
	Lacuna,
	Objecao,
	PeloMenosUm,
	Redacao,
	RegraDeIntegridade,
	Renderizacao,
} from "@prisma-intent/core";
import type { EvidenciaFunding } from "./evidencia.ts";
import type {
	EstrategiaNarrativaFunding,
	NossaIntencaoFunding,
	ObservacaoDosEfeitos,
} from "./intencao.ts";
import type { ConsumidorFunding } from "./publico.ts";
import type { Recurso } from "./recurso.ts";
import type { IdDaRegraDoDominio } from "./regras.ts";
import type {
	Canal,
	CriterioDeDecisaoId,
	EfeitoComportamental,
	IdiomaDePublicacao,
	Plataforma,
} from "./vocabulario.ts";

export type EstadoDaCampanha =
	/** Só existe a ideia; nada aqui pode ir a público. */
	| "conceito"
	/** Com protótipo, em redação. */
	| "rascunho"
	| "em_revisao"
	/** Sem bloqueio: pode ser submetida à plataforma. */
	| "pronta_para_publicar"
	| "publicada"
	| "encerrada";

export type RenderizacaoFunding<TReferencia extends string> = Renderizacao<
	Canal,
	TReferencia,
	IdiomaDePublicacao
>;

export interface Campanha<
	TArgumento extends string = string,
	TObjecao extends string = string,
	TEvidencia extends string = string,
	TRecurso extends string = string,
	TRegraDaCasa extends string = string,
	TComportamental extends EfeitoComportamental = EfeitoComportamental,
> {
	schemaVersion: `${number}.${number}.${number}`;
	produto: { nome: "PRISMA Intent"; especializacao: "funding" };
	id: Redacao;
	estado: EstadoDaCampanha;
	plataforma: Certeza<Plataforma>;
	idiomas: PeloMenosUm<IdiomaDePublicacao>;

	recursos: readonly Recurso<TRecurso>[];
	evidencias: readonly EvidenciaFunding<TEvidencia, NoInfer<TRecurso>>[];

	consumidores: readonly ConsumidorFunding<NoInfer<TArgumento>>[];
	intencoes: readonly NossaIntencaoFunding<
		NoInfer<TRecurso>,
		TComportamental
	>[];
	/** Como cada efeito comportamental desejado é observado; faltar um não compila. */
	observacaoDosEfeitos: ObservacaoDosEfeitos<NoInfer<TComportamental>>;
	estrategia: EstrategiaNarrativaFunding;

	/** Argumento sem evidência é promessa a provar: não sai em canal público. */
	argumentos: readonly Argumento<TArgumento, NoInfer<TEvidencia>>[];
	objecoes: readonly Objecao<TObjecao, NoInfer<TEvidencia>>[];
	/**
	 * O texto que o leitor lê em resposta a cada objeção. A `diretriz` da
	 * objeção é instrução de estratégia e nunca chega a ele (`AGENTS.md` da
	 * Work, §1). `a_confirmar` = resposta ainda não redigida: não se renderiza.
	 */
	respostasAoLeitor: readonly {
		objecao: NoInfer<TObjecao>;
		texto: Certeza<Redacao>;
	}[];
	criterios: readonly CriterioDeDecisao<CriterioDeDecisaoId>[];

	canais: readonly Contexto<Canal>[];
	renderizacoes: readonly RenderizacaoFunding<NoInfer<TArgumento | TObjecao>>[];

	regrasDaCasa: readonly RegraDeIntegridade<TRegraDaCasa>[];
	regrasEmFoco: readonly IdDaRegraDoDominio[];
	/** O que não se sabe, registrado para não ser preenchido por inferência. */
	lacunas: readonly Lacuna<NoInfer<TArgumento | TObjecao>>[];
}

/** Declara a campanha inferindo os ids literais para as referências cruzadas. */
export function definirCampanha<
	const TArgumento extends string,
	const TObjecao extends string,
	const TEvidencia extends string,
	const TRecurso extends string,
	const TRegraDaCasa extends string = never,
	const TComportamental extends EfeitoComportamental = never,
>(
	campanha: Campanha<
		TArgumento,
		TObjecao,
		TEvidencia,
		TRecurso,
		TRegraDaCasa,
		TComportamental
	>,
): Campanha<
	TArgumento,
	TObjecao,
	TEvidencia,
	TRecurso,
	TRegraDaCasa,
	TComportamental
> {
	return campanha;
}

/** Ids dos argumentos de uma campanha, para quem a referencia (partes, rinha). */
export type ArgumentoDe<C> =
	C extends Campanha<
		infer A,
		string,
		string,
		string,
		string,
		EfeitoComportamental
	>
		? A
		: never;

/** Ids dos recursos de uma campanha. */
export type RecursoDe<C> =
	C extends Campanha<
		string,
		string,
		string,
		infer R,
		string,
		EfeitoComportamental
	>
		? R
		: never;
