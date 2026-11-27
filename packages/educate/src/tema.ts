/**
 * Tema: a matéria-prima da história.
 *
 * Sem contraparte no core: é conteúdo de domínio, como o `case` do `work`. A
 * origem é uma união discriminada porque cada origem tem forma e
 * rastreabilidade próprias: o assunto em estudo vem do contexto que a
 * instituição informou, o acontecimento vem de quem o relatou, o universo de
 * interesse vem do perfil. Um campo `tema: string` misturaria os três e
 * perderia a origem — que é justamente o que a instituição recebe de volta.
 *
 * O tema não é o mundo ficcional nem a linha de conteúdo: o mesmo tema serve a
 * muitos mundos e a muitas intenções.
 */
import type { Redacao } from "@prisma-intent/core";

/**
 * Alinhamento a um referencial formal (LRMI `educationalAlignment`): uma base
 * curricular, uma matriz de competências, a ementa de um curso. O pacote não
 * conhece nenhum referencial em particular; a validação do código é de
 * instância.
 */
export interface Alinhamento {
	/** O referencial, com o que identifica a publicação. */
	referencial: Redacao;
	/** O código da habilidade, do objetivo ou do item naquele referencial. */
	codigo: Redacao;
}

export type OrigemDoTema =
	| {
			origem: "assunto_em_estudo";
			/** O que o grupo está estudando, como a instituição informou. */
			assunto: Redacao;
			alinhamentos?: readonly Alinhamento[];
			/** Identificador do contexto ativo de onde veio. */
			contexto: Redacao;
	  }
	| {
			origem: "acontecimento";
			/** O que aconteceu, nas palavras de quem relatou: "perdeu o jogo e ficou brava". */
			relato: Redacao;
			/** Data do acontecimento, ISO 8601. */
			data: `${number}-${number}-${number}`;
	  }
	| {
			origem: "universo_de_interesse";
			/** Espaço, dinossauros, música, invenções. */
			universo: Redacao;
	  };

export interface Tema {
	/** Frase curta que nomeia o tema: "ciclo da água", "aprender a perder". */
	titulo: Redacao;
	origem: OrigemDoTema;
}

/**
 * Mundo ficcional: o cenário em que o tema é contado. Reutilizável entre temas
 * e histórias — por isso é entidade, não campo do tema.
 */
export interface MundoFiccional {
	id: Redacao;
	/** "O laboratório secreto", "a nave dos exploradores". */
	nome: Redacao;
	descricao: Redacao;
	/** Personagens recorrentes deste mundo. */
	personagens: readonly Redacao[];
}
