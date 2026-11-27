/**
 * Dado interno e conteúdo renderizável.
 *
 * Toda instância carrega o que o leitor não pode ver — numa proposta, como o
 * proponente entendeu cada requisito e quanto esforço estimou; numa campanha,
 * as diretrizes de resposta às objeções e como cada efeito é medido. Isso vive
 * na mesma instância que gera as saídas, e por isso a separação não pode
 * depender de quem escreve o renderizador se lembrar dela.
 *
 * `Redacao` é `string`, e qualquer `string` marcada continuaria atribuível a
 * ela. Por isso o dado interno é um **objeto** marcado com
 * `visibilidade: "interna"`: não cabe num campo de texto e é recusado, em
 * qualquer profundidade, por `ConteudoRenderizavel`.
 *
 * Promovido da Sales (task-042), junto com `premissa.ts`.
 */
import type { Redacao } from "./utilitarios.ts";

/** Marca um dado como interno: nunca chega a uma renderização. */
export type Interno<T> = T & { readonly visibilidade: "interna" };

/** Texto que só o proponente lê: entendimento, nota, rascunho de estratégia. */
export type TextoInterno = Interno<{ readonly texto: string }>;

/** Declara um texto interno. */
export function interno(texto: string): TextoInterno {
	return { visibilidade: "interna", texto };
}

/**
 * Conteúdo que pode chegar a uma renderização: texto, número, booleano,
 * listas e objetos disso — nunca um objeto marcado como interno.
 *
 * É a forma do que atravessa do Node para a saída: o PDF, o JSON pré-computado
 * de um site, uma planilha. Declare os tipos de conteúdo com `type`, não com
 * `interface`: o TypeScript só dá a assinatura de índice implícita a tipos
 * literais de objeto, e uma `interface` seria recusada mesmo sem dado interno.
 */
export type ConteudoRenderizavel =
	| Redacao
	| number
	| boolean
	| null
	| readonly ConteudoRenderizavel[]
	| {
			readonly [campo: string]: ConteudoRenderizavel | undefined;
			readonly visibilidade?: never;
	  };

/**
 * Confere, por tipo e em tempo de execução, que um conteúdo não leva dado
 * interno, e o devolve sem alteração.
 *
 * O tipo recusa o que o compilador vê; a conferência em execução recusa o que
 * chegou por fora dele — um `as`, um JSON lido do disco. O erro diz o caminho
 * do dado interno, para que se saiba qual projeção esqueceu de retirá-lo.
 */
export function garantirRenderizavel<const T extends ConteudoRenderizavel>(
	conteudo: T,
): T {
	const caminho = acharDadoInterno(conteudo, "conteudo");
	if (caminho) {
		throw new Error(
			`Dado interno em conteúdo renderizável: ${caminho}. Projete o conteúdo para o leitor antes de renderizar.`,
		);
	}
	return conteudo;
}

function acharDadoInterno(valor: unknown, caminho: string): string | null {
	if (Array.isArray(valor)) {
		for (const [indice, item] of valor.entries()) {
			const achado = acharDadoInterno(item, `${caminho}[${indice}]`);
			if (achado) return achado;
		}
		return null;
	}
	if (typeof valor !== "object" || valor === null) return null;
	if ((valor as { visibilidade?: unknown }).visibilidade === "interna") {
		return caminho;
	}
	for (const [chave, item] of Object.entries(valor)) {
		const achado = acharDadoInterno(item, `${caminho}.${chave}`);
		if (achado) return achado;
	}
	return null;
}
