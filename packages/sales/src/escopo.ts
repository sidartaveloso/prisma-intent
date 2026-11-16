/**
 * Escopo: pacotes de trabalho, requisitos do cliente, estimativa e
 * conformidade.
 *
 * É a parte que não existe no core nem na Work. Cada requisito do cliente
 * recebe exatamente uma `Conformidade`, que diz como é atendido; cada pacote
 * diz quem o executa e, se for o proponente, quanto esforço foi estimado.
 *
 * Duas coisas aqui são internas e nunca chegam ao leitor: o `entendimento` de
 * cada requisito e a `Estimativa` de cada pacote. As projeções
 * `requisitoParaLeitor` e `pacoteParaLeitor` as retiram, e os tipos
 * `RequisitoParaLeitor` e `PacoteParaLeitor` recusam quem tentar devolvê-las.
 */
import type {
	Certeza,
	Interno,
	PeloMenosUm,
	Premissa,
	Redacao,
	TextoInterno,
} from "@prisma-intent/core";
import type { PrioridadeDoRequisito } from "./vocabulario.ts";

/** Unidade em que um esforço é estimado. */
export type UnidadeDeEsforco = "horas" | "pessoas_mes";

/**
 * Estimativa de esforço, sempre feita por pessoas. Interna: os números por
 * estimador e a faixa nunca são renderizados; o que vai ao leitor é o preço
 * calculado e, quando for o caso, o esforço consolidado por pacote.
 */
export type Estimativa = Interno<
	| { estado: "a_estimar" }
	| {
			/** Estimativas independentes e a consolidada. */
			estado: "por_estimadores";
			unidade: UnidadeDeEsforco;
			porEstimador: PeloMenosUm<{ pessoa: Redacao; valor: number }>;
			consolidada: {
				valor: number;
				criterio: "mediana" | "revisao_conjunta";
			};
	  }
	| {
			/** Faixa de um estudo de viabilidade, com o valor adotado para o preço. */
			estado: "por_faixa";
			unidade: UnidadeDeEsforco;
			minimo: number;
			maximo: number;
			/** Decisão comercial: enquanto não confirmada, é valor de trabalho. */
			adotado: Premissa<number>;
			/** De onde vem a faixa. */
			fonte: Redacao;
	  }
>;

/** Se e como o esforço de um pacote do proponente entra no preço. */
export type InclusaoNoPreco =
	/** Entra no preço da proposta. */
	| "no_preco"
	/** O comprador pode acrescentar; aparece em separado. */
	| "opcional"
	/** Trabalho do proponente que não é cobrado, como a própria resposta à licitação. */
	| "fora_do_preco";

/**
 * Pacote de trabalho. Quem o executa decide a forma: só o pacote do
 * proponente tem estimativa e entra no preço. Pacote de outra organização no
 * preço do proponente não é representável.
 */
export type PacoteDeTrabalho<
	TPacote extends string = string,
	TOrganizacao extends string = string,
> = {
	id: TPacote;
	nome: Redacao;
	descricao: Redacao;
} & (
	| {
			responsavel: "proponente";
			inclusao: InclusaoNoPreco;
			estimativa: Estimativa;
	  }
	| { responsavel: "organizacao"; organizacao: TOrganizacao }
	| {
			/** Ainda não se sabe quem executa; a pergunta vai a quem decide. */
			responsavel: "a_definir";
			pergunta: Redacao;
	  }
);

/**
 * Como um requisito é atendido — a linha da matriz de conformidade.
 *
 * `resposta` é o texto que o leitor vê; `a_confirmar` significa ainda não
 * redigida, e não se renderiza.
 */
export type Conformidade<
	TPacote extends string = string,
	TOrganizacao extends string = string,
> =
	/** A plataforma já faz, sem configuração específica. */
	| { atende: "padrao"; pacote: TPacote; resposta: Certeza<Redacao> }
	/** A plataforma faz com configuração, sem desenvolvimento. */
	| { atende: "configuracao"; pacote: TPacote; resposta: Certeza<Redacao> }
	/** Exige desenvolvimento, dentro do pacote indicado. */
	| { atende: "desenvolvimento"; pacote: TPacote; resposta: Certeza<Redacao> }
	/** Atendido por outra organização envolvida. */
	| {
			atende: "terceiro";
			responsavel: TOrganizacao;
			resposta: Certeza<Redacao>;
	  }
	| { atende: "nao_atende"; justificativa: Redacao }
	/** Depende de uma resposta que ainda não se tem. */
	| { atende: "a_confirmar"; pergunta: Redacao };

/** Requisito do cliente, com o identificador do documento de origem. */
export type Requisito<
	TRequisito extends string = string,
	TPacote extends string = string,
	TOrganizacao extends string = string,
> = {
	/**
	 * Identificador no documento do cliente (por exemplo, `RF-012`). É a
	 * chave da matriz de conformidade: um requisito, uma linha.
	 */
	id: TRequisito;
	/** Agrupamento do documento do cliente: seção, módulo, capítulo. */
	modulo: Redacao;
	titulo: Redacao;
	descricao: Redacao;
	prioridade: PrioridadeDoRequisito;
	/** Como o proponente entendeu o requisito. Interno: nunca renderizado. */
	entendimento: TextoInterno;
	conformidade: Conformidade<TPacote, TOrganizacao>;
};

/**
 * Retira as chaves de cada membro da união e as proíbe, para que o objeto
 * completo não seja aceito no lugar da projeção. Sem o `?: never`, um
 * `Requisito` seria atribuível a `Omit<Requisito, "entendimento">` — o
 * TypeScript aceita propriedade a mais — e levaria o entendimento junto.
 */
type SemChaves<T, K extends PropertyKey> = T extends unknown
	? Omit<T, K> & { readonly [P in K]?: never }
	: never;

/** O requisito como o leitor o vê: sem `entendimento`. */
export type RequisitoParaLeitor<
	TRequisito extends string = string,
	TPacote extends string = string,
	TOrganizacao extends string = string,
> = SemChaves<Requisito<TRequisito, TPacote, TOrganizacao>, "entendimento">;

/** O pacote como o leitor o vê: sem `estimativa`. */
export type PacoteParaLeitor<
	TPacote extends string = string,
	TOrganizacao extends string = string,
> = SemChaves<PacoteDeTrabalho<TPacote, TOrganizacao>, "estimativa">;

/** Projeta o requisito para o leitor, retirando o entendimento. */
export function requisitoParaLeitor<
	TRequisito extends string,
	TPacote extends string,
	TOrganizacao extends string,
>(
	requisito: Requisito<TRequisito, TPacote, TOrganizacao>,
): RequisitoParaLeitor<TRequisito, TPacote, TOrganizacao> {
	const { entendimento: _entendimento, ...paraLeitor } = requisito;
	return paraLeitor;
}

/** Projeta o pacote para o leitor, retirando a estimativa. */
export function pacoteParaLeitor<
	TPacote extends string,
	TOrganizacao extends string,
>(
	pacote: PacoteDeTrabalho<TPacote, TOrganizacao>,
): PacoteParaLeitor<TPacote, TOrganizacao> {
	if (pacote.responsavel !== "proponente") return pacote;
	const { estimativa: _estimativa, ...paraLeitor } = pacote;
	return paraLeitor;
}
