/**
 * Tag no texto e registro de tipos (pacote 2026-000003).
 *
 * Aqui fica só a forma: a tag com atributos, o trecho e o tipo de elemento com
 * os atributos que declara. A leitura e a escrita da marcação moram fora do
 * core, num pacote que depende de bibliotecas de Markdown
 * (`@prisma-intent/markup`), porque o core não tem dependências. O registro de
 * elementos, o ponto de leitura e `verificarTags` são da task-012.
 */
import type { PeloMenosUm, Redacao } from "./utilitarios.ts";
import type { Termo } from "./vocabulario.ts";

/**
 * Atributos de uma citação: chave e valor, ambos texto.
 *
 * São da citação, não do elemento citado: a mesma parte pode ser citada pelo
 * nome num trecho e pelo documento noutro. Sem atributos, o objeto é vazio.
 */
export type AtributosDaTag = Readonly<Record<string, string>>;

/** Citação com tipo: aponta para o elemento de mesmo tipo e id. */
export interface Tag<
	TTipo extends string = string,
	TId extends string = string,
> {
	tipo: TTipo;
	/** Identificador do elemento dentro do tipo. */
	id: TId;
	/** Conferidos contra os atributos que o tipo declara. */
	atributos: AtributosDaTag;
}

/** A tag dentro de uma frase: a citação e o rótulo com que é lida. */
export type TagNoTexto<TTag extends Tag = Tag> = TTag & { rotulo: string };

/** Pedaço de um texto com tags: texto corrido ou tag. */
export type Trecho<TTag extends Tag = Tag> = string | TagNoTexto<TTag>;

/** Que valores um atributo aceita. */
export type ValoresDoAtributo =
	/** Qualquer texto, como a forma de uma concordância. */
	| { valores: "livres" }
	/** Só os valores da lista. */
	| { valores: "enumerados"; aceitos: PeloMenosUm<string> };

/** Quando o atributo precisa estar na tag. */
export type PresencaDoAtributo<TNome extends string = string> =
	| { presenca: "opcional" }
	| { presenca: "obrigatoria" }
	/** Obrigatório quando qualquer um destes atributos está na tag. */
	| { presenca: "obrigatoria_quando"; presente: PeloMenosUm<TNome> };

/** Atributo que um tipo de elemento declara para as tags dele. */
export type AtributoDeclarado<TNome extends string = string> = {
	descricao: Redacao;
} & ValoresDoAtributo &
	PresencaDoAtributo<TNome>;

/** Tipo de elemento. Quem o conhece registra; o core não registra nenhum. */
export type TipoDeElemento<
	TTipo extends string = string,
	TAtributo extends string = string,
> = Termo<TTipo> & {
	/** Forma do id (fonte de expressão regular). Confere a escrita, não a existência. */
	formaDoId: string;
	/**
	 * Se a tag deste tipo precisa de um elemento declarado.
	 *
	 * `exigida`: tarefa, pessoa, documento. `dispensada`: o id é o próprio
	 * valor, como numa data ou numa quantia, e a tag vale sozinha.
	 */
	declaracao: "exigida" | "dispensada";
	/**
	 * Os atributos que a tag deste tipo aceita. Atributo fora daqui é recusado
	 * na leitura. Sem atributos, o objeto é vazio.
	 */
	atributos: { readonly [K in TAtributo]: AtributoDeclarado<TAtributo> };
};

/** Registro de tipos, indexado pelo id, preservando os literais. */
export type RegistroDeTipos<TTipo extends string = string> = {
	readonly [K in TTipo]: TipoDeElemento<K>;
};

/**
 * Declara o registro de tipos preservando os literais de cada tipo.
 *
 * @example
 * const tipos = registrarTipos({
 *   pessoa: {
 *     nome: "Pessoa",
 *     descricao: "Quem participa.",
 *     formaDoId: "^[a-z_]+$",
 *     declaracao: "exigida",
 *     atributos: {},
 *   },
 * });
 * type TipoRegistrado = keyof typeof tipos; // "pessoa"
 */
export function registrarTipos<
	const TTipos extends {
		readonly [tipo: string]: Omit<TipoDeElemento, "id">;
	},
>(
	tipos: TTipos,
): { readonly [K in keyof TTipos & string]: TTipos[K] & { id: K } } {
	return Object.fromEntries(
		Object.entries(tipos).map(([id, tipo]) => [id, { id, ...tipo }]),
	) as { readonly [K in keyof TTipos & string]: TTipos[K] & { id: K } };
}
