/**
 * Vocabulário semântico.
 *
 * O PRISMA Intent mantém três representações sincronizadas — TypeScript, JSON
 * Schema e vocabulário. Um termo do vocabulário não é só um valor válido: ele
 * carrega nome e definição, para que pessoas e agentes leiam o modelo com o
 * mesmo significado.
 */
import type { Redacao } from "./utilitarios.ts";

export interface Termo<TId extends string> {
	id: TId;
	nome: Redacao;
	descricao: Redacao;
}

/** Vocabulário indexado por id, preservando os literais de cada termo. */
export type Vocabulario<TId extends string> = {
	readonly [K in TId]: Termo<K>;
};

/**
 * Declara um vocabulário preservando os ids literais.
 *
 * @example
 * const qualidades = definirVocabulario({
 *   visao_sistemica: { nome: "Visão sistêmica", descricao: "..." },
 * });
 * type Qualidade = keyof typeof qualidades; // "visao_sistemica"
 */
export function definirVocabulario<const TId extends string>(
	termos: {
		readonly [K in TId]: Omit<Termo<K>, "id">;
	},
): Vocabulario<TId> {
	const entradas = Object.entries(termos) as Array<
		[TId, Omit<Termo<TId>, "id">]
	>;
	return Object.fromEntries(
		entradas.map(([id, termo]) => [id, { id, ...termo }]),
	) as Vocabulario<TId>;
}
