/**
 * Brief: o contrato de uma história.
 *
 * Perfil de público + intenções + tema + mundo + linha + canais + regras. É o
 * que parametriza quem produz e o que a curadoria confere depois. Nada é
 * produzido sem brief.
 *
 * Dois tipos de parâmetro, com papéis diferentes:
 *
 * - `TVocabulario` é o que a instância **declara**: canais, linhas, faixas,
 *   necessidades, estágios, efeitos comportamentais e idiomas do produto. O
 *   pacote não conhece nenhum deles; o brief só aceita o que a instância disse
 *   que existe.
 * - `TMissao` e `TRegraDaCasa` são **inferidos** do próprio brief, para o
 *   compilador validar as referências cruzadas, como em `definirInstancia` do
 *   `work`: uma missão de quem acompanha que libera uma missão do aprendiz
 *   inexistente vira erro de compilação. O `NoInfer` nas posições de
 *   referência é o que faz um id errado ser recusado em vez de absorvido pela
 *   inferência.
 */
import type {
	Contexto,
	Redacao,
	RegraDeIntegridade,
	Renderizacao,
} from "@prisma-intent/core";
import type {
	EstrategiaNarrativaEducate,
	NossaIntencaoEducate,
} from "./intencao.ts";
import type { MissaoDeQuemAcompanha, MissaoDoAprendiz } from "./missao.ts";
import type { ObjetivoObservavel } from "./objetivo.ts";
import type { ConsumidorEducate, PerfilDeAprendiz } from "./publico.ts";
import type { IdDaRegraDoDominio } from "./regras.ts";
import type { MundoFiccional, Tema } from "./tema.ts";

/**
 * O vocabulário que cada instância fornece.
 *
 * É a fronteira entre o domínio e o produto. "Só histórias para ver juntos
 * abaixo de certa idade" é decisão de um produto; "existe quem aprende e quem
 * decide" é do domínio. O que é do produto entra por aqui, declarado com
 * `definirVocabulario` para que cada termo tenha nome e definição, e é
 * entregue como tipo a `definirBrief`.
 */
export interface VocabularioDaInstancia {
	/** Situações de consumo. Canal é a situação, não o aparelho. */
	canal: string;
	/** Linhas ou séries de conteúdo. */
	linha: string;
	/** Faixas em que o produto situa quem aprende. */
	faixa: string;
	/** Necessidades específicas que o conteúdo atende. */
	necessidade: string;
	/** Estágios de desenvolvimento que o próprio produto descreve. */
	estagio: string;
	/** Efeitos comportamentais: os da base deste pacote e os que o produto soma. */
	efeitoComportamental: string;
	/** Idiomas em que algum canal publica. */
	idioma: string;
}

/**
 * Como a história é consumida. Qual modo cabe a qual aprendiz é regra de cada
 * produto; o brief declara para que a produção e a curadoria confiram, em vez
 * de descobrir na tela.
 */
export type ModoDeConsumo =
	/** Junto de quem acompanha, do começo ao fim. */
	| "para_ver_juntos"
	/** Sozinho, com alguém por perto. */
	| "com_supervisao"
	/** Sozinho, dentro de uma janela de tempo combinada. */
	| "autonomo_com_janela"
	/** Sozinho, quando e quanto quiser: quem decide é o próprio aprendiz. */
	| "autonomo";

export interface Brief<
	TVocabulario extends VocabularioDaInstancia = VocabularioDaInstancia,
	TMissao extends string = string,
	TRegraDaCasa extends string = string,
> {
	schemaVersion: `${number}.${number}.${number}`;
	produto: {
		nome: "PRISMA Intent";
		especializacao: "educate";
	};
	id: Redacao;
	estado: "rascunho" | "aprovado" | "arquivado";

	publico: PerfilDeAprendiz<
		TVocabulario["faixa"],
		TVocabulario["necessidade"],
		TVocabulario["estagio"]
	>;
	modoDeConsumo: ModoDeConsumo;
	/** Quem mais recebe algo desta história: quem prepara a missão, quem recebe o acompanhamento. */
	consumidores: readonly ConsumidorEducate<never>[];

	intencoes: readonly NossaIntencaoEducate<
		TVocabulario["efeitoComportamental"]
	>[];
	/** Só para efeitos comportamentais declarados nas intenções. */
	objetivosObservaveis: readonly ObjetivoObservavel<
		TVocabulario["efeitoComportamental"]
	>[];
	estrategia: EstrategiaNarrativaEducate;

	tema: Tema;
	mundo: MundoFiccional;
	linha?: TVocabulario["linha"];

	missoesDoAprendiz: readonly (MissaoDoAprendiz & { id: TMissao })[];
	missoesDeQuemAcompanha: readonly (Omit<MissaoDeQuemAcompanha, "libera"> & {
		libera: NoInfer<TMissao>;
	})[];

	canais: readonly Contexto<TVocabulario["canal"]>[];
	/** O que cada canal recebe da mesma base. */
	renderizacoes: readonly Renderizacao<
		TVocabulario["canal"],
		NoInfer<TMissao>,
		TVocabulario["idioma"]
	>[];

	/** Regras da casa, somadas às do domínio (`regrasDoDominio`). */
	regrasDaCasa: readonly RegraDeIntegridade<TRegraDaCasa>[];
	/** Regras do domínio que esta história precisa observar com atenção especial. */
	regrasEmFoco: readonly IdDaRegraDoDominio[];
}

/**
 * Declara um brief sobre o vocabulário de uma instância.
 *
 * Em dois passos, porque o TypeScript não infere parte dos parâmetros de tipo:
 * o primeiro recebe o vocabulário, que a instância declara; o segundo infere
 * os ids literais das missões do aprendiz, para que
 * `missoesDeQuemAcompanha[].libera` só aceite missões que existem.
 *
 * @example
 * type Vocabulario = {
 *   canal: keyof typeof canais;
 *   efeitoComportamental: EfeitoComportamental | keyof typeof meusEfeitos;
 *   // …
 * };
 * export const brief = definirBrief<Vocabulario>()({ … });
 */
export function definirBrief<TVocabulario extends VocabularioDaInstancia>() {
	return <const TMissao extends string, const TRegraDaCasa extends string>(
		brief: Brief<TVocabulario, TMissao, TRegraDaCasa>,
	): Brief<TVocabulario, TMissao, TRegraDaCasa> => brief;
}

/** Efeitos comportamentais que os objetivos observáveis de um brief cobrem. */
export function efeitosCobertos<TVocabulario extends VocabularioDaInstancia>(
	brief: Brief<TVocabulario>,
): readonly TVocabulario["efeitoComportamental"][] {
	return brief.objetivosObservaveis.map((objetivo) => objetivo.efeito);
}

/**
 * Efeitos comportamentais declarados nas intenções e sem objetivo observável.
 * Não é erro: é o que a curadoria decide verificar ou deixar como intenção.
 */
export function efeitosSemObjetivo<TVocabulario extends VocabularioDaInstancia>(
	brief: Brief<TVocabulario>,
): readonly TVocabulario["efeitoComportamental"][] {
	const cobertos = new Set(efeitosCobertos(brief));
	return brief.intencoes
		.flatMap((intencao) => intencao.efeitosDesejados.comportamentais)
		.filter((efeito) => !cobertos.has(efeito));
}
