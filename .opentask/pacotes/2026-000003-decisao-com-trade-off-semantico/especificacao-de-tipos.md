# Especificação de tipos: tag, elemento e decisão com trade-off

Pacote 2026-000003, task-011. **Desenho aprovado por Sidarta Veloso em 2026-11-16.** Nada daqui está em `packages/` ainda: a implementação é da task-012 (core) e da task-013 (especialização `tradeoff`).

Os tipos e o exemplo abaixo foram compilados fora do repositório, com o TypeScript e o `tsconfig.base.json` daqui, contra o core do commit `64fb703`. As funções estão só declaradas: o que elas devolvem, nos comentários do exemplo, é o comportamento esperado, ainda sem teste.

## No core

Arquivos tocados: `utilitarios.ts` (a redação), `procedencia.ts` (o ponto de leitura) e um arquivo novo para o elemento e o registro de tipos.

```ts
/** Citação com tipo: aponta para o elemento de mesmo tipo e id. */
export interface Tag<
	TTipo extends string = string,
	TId extends string = string,
> {
	tipo: TTipo;
	/** Identificador do elemento dentro do tipo. */
	id: TId;
}

/** A tag dentro de uma frase: a citação e o rótulo com que é lida. */
export type TagNoTexto<TTag extends Tag = Tag> = TTag & { rotulo: string };

/** Pedaço de uma redação: texto corrido ou tag. */
export type Trecho<TTag extends Tag = Tag> = string | TagNoTexto<TTag>;

/**
 * Texto em português destinado a leitura humana.
 *
 * Três escritas, o mesmo conteúdo: texto corrido; texto com a marcação
 * `[[tipo:id|rótulo]]`; sequência de trechos. O modelo guarda trechos, e a
 * marcação é a escrita deles em Markdown e em JSON. Sem parâmetro, aceita
 * qualquer tag; com `TTag`, só as tags dos elementos declarados.
 */
export type Redacao<TTag extends Tag = Tag> = string | readonly Trecho<TTag>[];

/** Tipo de elemento. Quem o conhece registra; o core não registra nenhum. */
export type TipoDeElemento<TTipo extends string> = Termo<TTipo> & {
	/** Forma do id (fonte de expressão regular). Confere a escrita, não a existência. */
	formaDoId: string;
	/**
	 * Se a tag deste tipo precisa de um elemento declarado.
	 *
	 * `exigida`: tarefa, pessoa, documento. `dispensada`: o id é o próprio
	 * valor, como numa data ou numa quantia, e a tag vale sozinha.
	 */
	declaracao: "exigida" | "dispensada";
};

/** Registro de tipos, indexado pelo id, preservando os literais. */
export type RegistroDeTipos<TTipo extends string> = {
	readonly [K in TTipo]: TipoDeElemento<K>;
};

/**
 * Em que versão a fonte estava quando foi lida.
 *
 * O core conhece duas ideias, sem nome de sistema: o nome que se move e o
 * identificador que não muda.
 */
export type VersaoLida =
	/** Só o nome que se move: a leitura acompanha o que estiver valendo. */
	| { fixacao: "movel"; nome: string }
	/** Presa ao identificador que não muda. */
	| {
			fixacao: "fixa";
			identificador: string;
			/** O nome que apontava para o identificador na hora da leitura. */
			nome?: string;
	  };

/** Onde, e em que versão, algo foi lido. */
export interface PontoDeLeitura {
	/** Repositório em que o arquivo está. Ausente: o da própria instância. */
	repositorio?: string;
	/** Caminho a partir da raiz do repositório. */
	arquivo: string;
	/** Linha onde a leitura começa, quando a fonte tem numeração estável. */
	linha?: number;
	/** Ausente: a leitura não declarou versão. */
	versao?: VersaoLida;
}

/** De onde uma afirmação veio: o ponto de leitura mais a citação literal. */
export interface Procedencia extends PontoDeLeitura {
	/** Citação literal do material, encontrável no arquivo apontado. */
	trecho: string;
	/** O que a fonte **não** diz, quando o número vai além dela. */
	ressalva?: Redacao;
}

/** Se o elemento já existe, e onde foi lido. */
export type EstadoDoElemento =
	/** Existe e foi lido: diz onde e em que versão. */
	| { estado: "lido"; lidoEm: PontoDeLeitura }
	/** Ainda não existe: nasce se um caminho for seguido. */
	| { estado: "a_criar" };

/**
 * Elemento: aquilo que uma redação cita.
 *
 * Declarado uma vez, citado por tag quantas vezes for preciso. Quem registra
 * o tipo acrescenta os próprios campos por interseção.
 */
export type Elemento<
	TTipo extends string = string,
	TId extends string = string,
> = Tag<TTipo, TId> & {
	/** Como o elemento se chama fora de uma frase. */
	nome: string;
} & EstadoDoElemento;

/** A tag que cita um elemento declarado. */
export type TagDe<TElemento extends Tag> =
	TElemento extends Tag<infer TTipo, infer TId> ? Tag<TTipo, TId> : never;

/** Os tipos de um registro cuja tag vale sem elemento declarado. */
export type TipoSolto<TRegistro> = {
	[K in keyof TRegistro & string]: TRegistro[K] extends {
		declaracao: "dispensada";
	}
		? K
		: never;
}[keyof TRegistro & string];

/** As tags que uma redação pode levar: as dos elementos declarados e as dos tipos soltos. */
export type TagsValidas<TElemento extends Tag, TSolto extends string = never> =
	| TagDe<TElemento>
	| ([TSolto] extends [never] ? never : Tag<TSolto>);

/** O que a conferência de tags recusa. */
export type ViolacaoDeTag =
	| { violacao: "tipo_nao_registrado"; tag: Tag }
	| { violacao: "id_fora_da_forma"; tag: Tag }
	/** Só nos tipos que exigem declaração. */
	| { violacao: "elemento_nao_declarado"; tag: Tag }
	| { violacao: "elemento_declarado_duas_vezes"; tag: Tag };
```

As funções que acompanham os tipos:

```ts
/** Declara o registro de tipos preservando os literais de cada tipo. */
export declare function registrarTipos<
	const TTipos extends {
		readonly [tipo: string]: Omit<TipoDeElemento<string>, "id">;
	},
>(
	tipos: TTipos,
): { readonly [K in keyof TTipos & string]: TTipos[K] & { id: K } };

/** Lê a marcação de um texto. Texto sem marcação volta como um trecho só. */
export declare function lerMarcacao(texto: string): readonly Trecho[];

/** Escreve uma redação como texto com marcação. Inverso de `lerMarcacao`. */
export declare function escreverMarcacao(redacao: Redacao): string;

/** O texto como uma pessoa o lê: cada tag aparece pelo rótulo. */
export declare function textoCorrido(redacao: Redacao): string;

/** Confere as tags de um conjunto de redações contra o registro e os elementos. */
export declare function verificarTags<TTipo extends string>(
	redacoes: readonly Redacao[],
	declarado: {
		tipos: RegistroDeTipos<TTipo>;
		elementos: readonly Elemento[];
	},
): ViolacaoDeTag[];
```

O que muda no que existe:

- `Redacao` deixa de ser só `string`. Quem escreve não muda: todo texto de hoje continua válido. Quem lê passa a pedir `textoCorrido` ou os trechos.
- `Procedencia` passa a estender `PontoDeLeitura`. `arquivo`, `linha`, `trecho` e `ressalva` ficam onde estão; entram `repositorio` e `versao`, opcionais. Toda `Procedencia` de hoje continua compilando.
- `Procedencia.arquivo` e `Procedencia.trecho` passam de `Redacao` a `string`: caminho e citação literal não levam tag.

## Na especialização `tradeoff`

Pacote `@prisma-intent/tradeoff`, em `packages/tradeoff`. Depende só do core.

```ts
/** Critério de quem decide: a qualidade, dita uma vez, com o peso que tem. */
export type CriterioDoDecisor<TId extends string> = CriterioDeDecisao<TId> &
	Termo<TId>;

/**
 * Posição de uma alternativa num eixo.
 *
 * −5 atende por inteiro ao critério do polo A; +5, ao do polo B.
 */
export type Posicao = -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5;

/** Eixo: a tensão entre dois critérios de quem decide. Cada polo é um critério. */
export interface Eixo<
	TCriterio extends string,
	TAlternativa extends string,
	TTag extends Tag = Tag,
> {
	poloA: TCriterio;
	poloB: TCriterio;
	/** Onde cada alternativa fica, e por quê. Faltar uma não compila. */
	posicoes: {
		readonly [A in TAlternativa]: { posicao: Posicao; porque: Redacao<TTag> };
	};
}

export interface Alternativa<TTag extends Tag = Tag> {
	nome: Redacao<TTag>;
	/** O que acontece se este caminho for seguido. */
	descricao: Redacao<TTag>;
	escolhe: Redacao<TTag>;
	abdica: Redacao<TTag>;
	/** As consequências, em ordem. */
	trilha: PeloMenosUm<Redacao<TTag>>;
	volta:
		| { estado: "tem_volta"; como: Redacao<TTag> }
		| { estado: "dificil_de_desfazer"; porque: Redacao<TTag> };
	/** Elementos que passam a existir se este caminho for seguido. */
	cria: readonly TTag[];
}

export interface Proposta<
	TAlternativa extends string,
	TCriterio extends string,
	TTag extends Tag = Tag,
> {
	alternativa: TAlternativa;
	/** O critério de quem decide que sustenta a proposta. */
	sustentadaPor: TCriterio;
	porque: Redacao<TTag>;
	/** Quão firme é a base da proposta. */
	base: { firmeza: "firme" | "media" | "fragil"; porque: Redacao<TTag> };
}

/** A decisão dita para quem não é do assunto. */
export interface EmPalavrasSimples<TTag extends Tag = Tag> {
	pergunta: Redacao<TTag>;
	explicacao: Redacao<TTag>;
	porQueEstaAqui: Redacao<TTag>;
	cenas: readonly Cena[];
}

export interface Cena {
	/** O que a cena mostra, não como é desenhada. */
	mostra: Redacao;
	legenda: Redacao;
}

export type AjusteOuCondicao<TTag extends Tag = Tag> =
	/** O caminho vale com esta mudança. */
	| { natureza: "ajuste"; texto: Redacao<TTag> }
	/** O caminho vale se isto se cumprir. */
	| { natureza: "condicao"; texto: Redacao<TTag> };

/** Aprovar, ajustar ou rejeitar: a resposta da metodologia. */
export type Resposta<TAlternativa extends string, TTag extends Tag = Tag> =
	/** Segue a proposta como veio. */
	| { resposta: "aprovada" }
	/** Segue a proposta, com ajuste ou condição. */
	| { resposta: "ajustada"; em: "proposta"; com: AjusteOuCondicao<TTag> }
	/** Segue outro caminho apresentado. */
	| {
			resposta: "ajustada";
			em: "outro_caminho";
			alternativa: TAlternativa;
			com?: AjusteOuCondicao<TTag>;
	  }
	/** Traz um caminho que não estava entre os apresentados. */
	| { resposta: "ajustada"; em: "caminho_proprio"; caminho: Redacao<TTag> }
	/** Nenhum caminho serve: pede outra proposta. */
	| { resposta: "rejeitada"; motivo?: Redacao<TTag> };

/** De cada decisão, os ids das alternativas dela. */
export type MapaDeAlternativas = Record<string, string>;

/** Quando a decisão precisa ser respondida. */
export type Necessidade<
	TMapa extends MapaDeAlternativas,
	TDecisao extends keyof TMapa,
	TTag extends Tag = Tag,
> =
	| { necessidade: "sempre" }
	| {
			[D in Exclude<keyof TMapa, TDecisao>]: {
				necessidade: "conforme_resposta";
				/** A decisão de que esta depende. */
				de: D;
				/** As respostas que tornam esta necessária. */
				quando: PeloMenosUm<TMapa[D]>;
				porque: Redacao<TTag>;
			};
	  }[Exclude<keyof TMapa, TDecisao>];

export interface Decisao<
	TMapa extends MapaDeAlternativas,
	TDecisao extends keyof TMapa,
	TCriterio extends string,
	TTag extends Tag = Tag,
> {
	pergunta: Redacao<TTag>;
	emPalavrasSimples: EmPalavrasSimples<TTag>;
	/** O que saber antes. A tag de cada fato leva a onde ele foi lido. */
	fatos: PeloMenosUm<Redacao<TTag>>;
	/** Faltar uma alternativa do mapa não compila. */
	alternativas: { readonly [A in TMapa[TDecisao]]: Alternativa<TTag> };
	eixos: PeloMenosUm<Eixo<TCriterio, TMapa[TDecisao], TTag>>;
	proposta: Proposta<TMapa[TDecisao], TCriterio, TTag>;
	necessidade: Necessidade<TMapa, TDecisao, TTag>;
	/** O que fica travado enquanto a decisão não é respondida. */
	trava: Redacao<TTag>;
	/** O que a resposta desta muda em outras, sem torná-las desnecessárias. */
	influencia: readonly {
		decisao: Exclude<keyof TMapa, TDecisao>;
		como: Redacao<TTag>;
	}[];
	/** Só por acréscimo: vale a última resposta. Vazio: aguardando. */
	respostas: readonly {
		resposta: Resposta<TMapa[TDecisao], TTag>;
		registro: DecisaoRegistrada;
	}[];
}

/** O que se leva a uma pessoa para decidir. */
export interface Deliberacao<
	TMapa extends MapaDeAlternativas,
	TCriterio extends string,
	TRegistro extends RegistroDeTipos<string>,
	TElemento extends Elemento<keyof TRegistro & string>,
> {
	schemaVersion: `${number}.${number}.${number}`;
	produto: { nome: "PRISMA Intent"; especializacao: "tradeoff" };
	id: string;
	decisor: Redacao<TagsValidas<TElemento, TipoSolto<TRegistro>>>;
	/** O que pesa para quem decide. Os polos de todo eixo saem daqui. */
	criterios: PeloMenosUm<CriterioDoDecisor<TCriterio>>;
	tipos: TRegistro;
	elementos: readonly TElemento[];
	/** Faltar uma decisão do mapa não compila. */
	decisoes: {
		readonly [D in keyof TMapa]: Decisao<
			TMapa,
			D,
			TCriterio,
			TagsValidas<TElemento, TipoSolto<TRegistro>>
		>;
	};
}

/** O que a conferência da deliberação recusa. */
export type ViolacaoDaDeliberacao<TDecisao extends string = string> =
	| { violacao: "tag"; decisao: TDecisao; detalhe: ViolacaoDeTag }
	| { violacao: "eixo_com_polos_iguais"; decisao: TDecisao }
	| { violacao: "proposta_sem_eixo_que_a_sustente"; decisao: TDecisao }
	| { violacao: "dependencia_circular"; ciclo: PeloMenosUm<TDecisao> }
	| { violacao: "resposta_repete_a_proposta"; decisao: TDecisao }
	| { violacao: "respondida_sem_versao_fixa"; decisao: TDecisao; tag: Tag }
	| { violacao: "elemento_a_criar_sem_caminho"; tag: Tag }
	| {
			violacao: "caminho_cria_elemento_que_existe";
			decisao: TDecisao;
			tag: Tag;
	  };
```

As funções:

```ts
/** As decisões que esperam resposta agora, pelas respostas já dadas. */
export declare function decisoesExigidas<TMapa extends MapaDeAlternativas>(
	deliberacao: Deliberacao<TMapa, string, RegistroDeTipos<string>, Elemento>,
): readonly (keyof TMapa)[];

/** Confere o que o compilador não pega. */
export declare function verificarDeliberacao<TMapa extends MapaDeAlternativas>(
	deliberacao: Deliberacao<TMapa, string, RegistroDeTipos<string>, Elemento>,
): ViolacaoDaDeliberacao<keyof TMapa & string>[];
```

## Exemplo fictício

Uma feira de ciências com duas decisões. A segunda só é necessária conforme a resposta da primeira. O regulamento é declarado uma vez e citado duas; o mapa das bancas ainda não existe e nasce de um dos caminhos. A data da feira é uma tag solta: o tipo dispensa a declaração.

Os imports ficaram de fora: `registrarTipos`, `verificarTags` e os tipos de tag, elemento e redação vêm de `@prisma-intent/core`; `Deliberacao` e `decisoesExigidas`, de `@prisma-intent/tradeoff`.

```ts
// Quem conhece o tipo registra. Aqui, a comissão da feira.
const tipos = registrarTipos({
	documento: {
		nome: "Documento",
		descricao: "Texto que a comissão mantém.",
		formaDoId: "^[a-z0-9-]+$",
		declaracao: "exigida",
	},
	lugar: {
		nome: "Lugar",
		descricao: "Espaço da escola, como aparece na planta.",
		formaDoId: "^[a-z0-9-]+$",
		declaracao: "exigida",
	},
	// A data vale sozinha: o id é o próprio dia.
	data: {
		nome: "Data",
		descricao: "Dia do calendário.",
		formaDoId: "^\\d{4}-\\d{2}-\\d{2}$",
		declaracao: "dispensada",
	},
});
type Tipo = keyof typeof tipos;

// Cada elemento é declarado uma vez, com onde e em que versão foi lido.
const elementos = [
	{
		tipo: "documento",
		id: "regulamento",
		nome: "Regulamento da feira",
		estado: "lido",
		lidoEm: {
			arquivo: "docs/regulamento-da-feira.md",
			linha: 12,
			versao: { fixacao: "fixa", identificador: "3f9c2e1", nome: "principal" },
		},
	},
	{
		tipo: "lugar",
		id: "patio",
		nome: "Pátio",
		estado: "lido",
		lidoEm: {
			arquivo: "docs/planta-da-escola.md",
			linha: 8,
			versao: { fixacao: "fixa", identificador: "3f9c2e1" },
		},
	},
	{
		tipo: "lugar",
		id: "ginasio",
		nome: "Ginásio",
		estado: "lido",
		lidoEm: {
			arquivo: "docs/planta-da-escola.md",
			linha: 15,
			versao: { fixacao: "fixa", identificador: "3f9c2e1" },
		},
	},
	// Ainda não existe: nasce se a feira for para o pátio.
	{
		tipo: "documento",
		id: "mapa-das-bancas",
		nome: "Mapa das bancas",
		estado: "a_criar",
	},
] as const satisfies readonly Elemento<Tipo>[];

type ElementoDaFeira = (typeof elementos)[number];
type TagDaFeira = TagsValidas<ElementoDaFeira, TipoSolto<typeof tipos>>;

type Criterio = "abrigo" | "espaco" | "custo";
type Alternativas = {
	local: "patio" | "ginasio";
	cobertura: "lona" | "tendas";
};

export const deliberacao: Deliberacao<
	Alternativas,
	Criterio,
	typeof tipos,
	ElementoDaFeira
> = {
	schemaVersion: "0.1.0",
	produto: { nome: "PRISMA Intent", especializacao: "tradeoff" },
	id: "feira-de-ciencias",
	decisor: "Coordenação da feira",
	criterios: [
		{
			id: "abrigo",
			prioridade: "muito_alta",
			nome: "Abrigo",
			descricao: "Trabalhos e visitantes protegidos do tempo.",
		},
		{
			id: "espaco",
			prioridade: "alta",
			nome: "Espaço",
			descricao: "Caber todas as bancas e o público.",
		},
		{
			id: "custo",
			prioridade: "media",
			nome: "Custo",
			descricao: "Gastar pouco do caixa da feira.",
		},
	],
	tipos,
	elementos,
	decisoes: {
		local: {
			// Tag na pergunta.
			pergunta: [
				"Onde montar as 40 bancas que o ",
				{ tipo: "documento", id: "regulamento", rotulo: "regulamento" },
				" prevê?",
			],
			emPalavrasSimples: {
				pergunta: "A feira fica do lado de fora ou do lado de dentro?",
				explicacao:
					"Do lado de fora cabe mais gente. Do lado de dentro, a chuva não atrapalha.",
				porQueEstaAqui:
					"As turmas só começam a montar as bancas depois de saber o lugar.",
				cenas: [
					{
						mostra: "Bancas espalhadas num pátio aberto, em dia de sol.",
						legenda: "No pátio cabe todo mundo.",
					},
					{
						mostra: "As mesmas bancas debaixo de chuva.",
						legenda: "Se chover, o trabalho molha.",
					},
				],
			},
			fatos: [
				[
					"Pela planta, o ",
					{ tipo: "lugar", id: "ginasio", rotulo: "ginásio" },
					" comporta 28 bancas.",
				],
				// Tag solta: o tipo "data" dispensa a declaração.
				[
					"A feira está marcada para ",
					{ tipo: "data", id: "2026-05-16", rotulo: "16 de maio" },
					". Ainda não há previsão do tempo para o dia.",
				],
			],
			alternativas: {
				patio: {
					nome: "No pátio",
					// Tag numa alternativa.
					descricao: [
						"As bancas ficam no ",
						{ tipo: "lugar", id: "patio", rotulo: "pátio" },
						", ao ar livre.",
					],
					escolhe: "Lugar para as 40 bancas e para o público.",
					abdica: "A feira garantida em dia de chuva.",
					trilha: [
						[
							"A comissão desenha o ",
							{
								tipo: "documento",
								id: "mapa-das-bancas",
								rotulo: "mapa das bancas",
							},
							".",
						],
						"A cobertura das bancas vira uma decisão.",
					],
					volta: {
						estado: "tem_volta",
						como: "Até a véspera, dá para levar as bancas para dentro.",
					},
					cria: [{ tipo: "documento", id: "mapa-das-bancas" }],
				},
				ginasio: {
					nome: "No ginásio",
					descricao: [
						"As bancas ficam no ",
						{ tipo: "lugar", id: "ginasio", rotulo: "ginásio" },
						", cobertas.",
					],
					escolhe: "A feira acontece com qualquer tempo.",
					abdica: "Doze bancas: só cabem 28.",
					trilha: ["A comissão escolhe as 28 turmas que expõem."],
					volta: {
						estado: "dificil_de_desfazer",
						porque:
							"Depois de avisar as turmas que ficam de fora, voltar atrás desgasta a comissão.",
					},
					cria: [],
				},
			},
			eixos: [
				{
					poloA: "espaco",
					poloB: "abrigo",
					posicoes: {
						patio: {
							posicao: -4,
							// Tag num eixo: o regulamento é citado pela segunda vez.
							porque: [
								"Comporta as 40 bancas do ",
								{ tipo: "documento", id: "regulamento", rotulo: "regulamento" },
								".",
							],
						},
						ginasio: { posicao: 4, porque: "Coberto, mas com 28 bancas." },
					},
				},
			],
			proposta: {
				alternativa: "ginasio",
				sustentadaPor: "abrigo",
				porque: "Abrigo é o critério de maior peso para a coordenação.",
				base: {
					firmeza: "media",
					porque: "Sem previsão do tempo, o risco de chuva é suposição.",
				},
			},
			necessidade: { necessidade: "sempre" },
			trava: "A montagem das bancas pelas turmas.",
			influencia: [],
			respostas: [
				{
					resposta: {
						resposta: "ajustada",
						em: "outro_caminho",
						alternativa: "patio",
						com: {
							natureza: "condicao",
							texto: "Vale se a cobertura couber no caixa da feira.",
						},
					},
					registro: {
						pessoa: "Coordenação da feira",
						data: "2026-03-02",
						registro: "ata da reunião de 2 de março",
					},
				},
			],
		},
		cobertura: {
			pergunta: [
				"Como cobrir as bancas no ",
				{ tipo: "lugar", id: "patio", rotulo: "pátio" },
				"?",
			],
			emPalavrasSimples: {
				pergunta: "Uma cobertura grande ou uma pequena para cada turma?",
				explicacao:
					"A grande protege tudo de uma vez e custa mais. As pequenas saem mais baratas e deixam vãos.",
				porQueEstaAqui: "A feira foi para o pátio, e lá não há telhado.",
				cenas: [],
			},
			fatos: ["O caixa da feira paga uma lona grande ou seis tendas."],
			alternativas: {
				lona: {
					nome: "Uma lona única",
					descricao: "A comissão aluga uma lona que cobre todas as bancas.",
					escolhe: "Nenhuma banca fica descoberta.",
					abdica: "Quase todo o caixa da feira.",
					trilha: ["A comissão contrata o aluguel com um mês de antecedência."],
					volta: {
						estado: "dificil_de_desfazer",
						porque: "O aluguel é pago na contratação.",
					},
					cria: [],
				},
				tendas: {
					nome: "Uma tenda por turma",
					descricao: "Cada turma monta a própria tenda.",
					escolhe: "Sobra caixa para os materiais.",
					abdica: "A cobertura dos corredores entre as bancas.",
					trilha: ["Cada turma indica quem monta a tenda."],
					volta: {
						estado: "tem_volta",
						como: "Dá para alugar a lona depois, se o caixa permitir.",
					},
					cria: [],
				},
			},
			eixos: [
				{
					poloA: "custo",
					poloB: "abrigo",
					posicoes: {
						tendas: {
							posicao: -3,
							porque: "Seis tendas custam um terço da lona.",
						},
						lona: { posicao: 4, porque: "Cobre as bancas e os corredores." },
					},
				},
			],
			proposta: {
				alternativa: "lona",
				sustentadaPor: "abrigo",
				porque: "Abrigo pesa mais que custo para a coordenação.",
				base: { firmeza: "firme", porque: "Os dois orçamentos estão em mãos." },
			},
			// Só é necessária conforme a resposta de outra decisão.
			necessidade: {
				necessidade: "conforme_resposta",
				de: "local",
				quando: ["patio"],
				porque: "No ginásio não há o que cobrir.",
			},
			trava: "A contratação da cobertura.",
			influencia: [],
			respostas: [],
		},
	},
};

// A resposta "pátio" tornou a cobertura necessária.
decisoesExigidas(deliberacao); // → ["cobertura"]

// O compilador recusa o tipo que ninguém registrou…
const tipoNaoRegistrado: Elemento<Tipo> = {
	// @ts-expect-error: "veiculo" não está no registro de tipos.
	tipo: "veiculo",
	id: "kombi",
	nome: "Kombi da escola",
	estado: "a_criar",
};

// …e a tag que cita elemento não declarado.
const elementoNaoDeclarado: Redacao<TagDaFeira> = [
	"Montar na ",
	// @ts-expect-error: nenhum elemento declarado é o lugar "quadra".
	{ tipo: "lugar", id: "quadra", rotulo: "quadra" },
	".",
];

// Na marcação, quem recusa é a conferência.
verificarTags(["Montar na [[lugar:quadra|quadra]]."], { tipos, elementos });
// → [{ violacao: "elemento_nao_declarado", tag: { tipo: "lugar", id: "quadra" } }]

// Toda redação de hoje continua valendo.
const redacaoDeHoje: Redacao = "Texto corrido, sem tag.";
```

A mesma pergunta, escrita com a marcação, para Markdown e JSON:

```text
Onde montar as 40 bancas que o [[documento:regulamento|regulamento]] prevê?
```

## O que o compilador recusa

Conferido com `@ts-expect-error`, no exemplo e num arquivo de casos negativos fora do repositório:

- elemento de tipo que ninguém registrou;
- tag, numa sequência de trechos, que cita elemento não declarado, quando o tipo exige declaração;
- posição fora dos inteiros de −5 a +5;
- eixo que não posiciona todas as alternativas da decisão;
- polo que não é critério declarado por quem decide;
- decisão que depende de si mesma, ou de uma resposta que a outra decisão não tem;
- resposta por outro caminho que não está entre os apresentados;
- ajuste na proposta sem dizer qual.

A tag de um tipo que dispensa declaração é aceita com qualquer id. A forma do id, nesse caso, só é conferida por `verificarTags`.

## O que fica para a conferência

O compilador não vê o que está dentro de uma `string` nem o que depende de comparar valores. Isso é das regras.

| Regra | Onde | Violação |
| --- | --- | --- |
| A marcação cita tipo registrado | core | `tipo_nao_registrado` |
| O id da tag tem a forma que o tipo declara, em trechos e na marcação | core | `id_fora_da_forma` |
| A marcação cita elemento declarado, quando o tipo exige declaração | core | `elemento_nao_declarado` |
| Cada elemento é declarado uma vez só | core | `elemento_declarado_duas_vezes` |
| Os dois polos de um eixo são critérios diferentes | `tradeoff` | `eixo_com_polos_iguais` |
| O critério que sustenta a proposta é polo de um eixo da decisão, e a alternativa proposta fica do lado dele | `tradeoff` | `proposta_sem_eixo_que_a_sustente` |
| Nenhuma decisão depende, direta ou indiretamente, de si mesma | `tradeoff` | `dependencia_circular` |
| Resposta por outro caminho não repete a alternativa proposta | `tradeoff` | `resposta_repete_a_proposta` |
| Decisão respondida só cita elemento lido com versão fixa; a tag solta não tem ponto de leitura e fica de fora | `tradeoff` | `respondida_sem_versao_fixa` |
| Todo elemento a criar nasce de pelo menos um caminho | `tradeoff` | `elemento_a_criar_sem_caminho` |
| Um caminho só cria elemento que ainda não existe | `tradeoff` | `caminho_cria_elemento_que_existe` |
