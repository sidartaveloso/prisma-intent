/**
 * Regras de integridade — o limite que a narrativa não atravessa.
 *
 * O PRISMA Intent adapta a forma, nunca o fato. Estas regras existem para
 * serem verificadas: cada uma nomeia o que não pode ser afirmado, para que
 * uma renderização possa ser conferida contra elas antes de publicar.
 */
import type { Redacao } from "./utilitarios.ts";

/**
 * Natureza da regra — o tipo de afirmação que ela impede.
 *
 * Separadas porque cada uma se verifica de um jeito: uma restrição de
 * competência se confere procurando um termo no texto; uma restrição de case
 * exige saber de qual case se está falando, e por isso o nomeia.
 */
export type NaturezaDaRegra =
	/** Fatos não se alteram para caber na narrativa. */
	| { natureza: "fato_invariavel" }
	/** Idealização, arquitetura, autoria, liderança e contribuição são coisas distintas. */
	| { natureza: "separacao_de_autoria" }
	/**
	 * Competência que não pode ser sugerida.
	 *
	 * Cobre dois casos que se verificam do mesmo jeito: o que a pessoa não
	 * possui, e o que ela possui mas não quer que seja avaliado ou cobrado.
	 */
	| {
			natureza: "restricao_de_competencia";
			/** Padrões que não podem aparecer na saída. Ver `padroesVedados` abaixo. */
			padroesVedados?: readonly string[];
	  }
	/** Projeto que não pertence à trajetória. */
	| { natureza: "restricao_de_projeto" }
	/** Contribuição para um resultado não vira causalidade exclusiva. */
	| { natureza: "restricao_de_resultado" }
	/** Afirmação vedada sobre um case específico. */
	| { natureza: "restricao_de_case"; case: Redacao }
	/**
	 * Assunto que não entra em nenhuma renderização.
	 *
	 * Diferente das outras: não protege contra afirmação falsa, e sim contra
	 * divulgação indevida de algo verdadeiro. A regra diz o que não abordar sem
	 * registrar o fato em si — a base é versionada e emitida, então guardar aqui
	 * o que não pode circular seria contraditório.
	 */
	| {
			natureza: "restricao_de_divulgacao";
			/**
			 * Padrões (fonte de expressão regular) que não podem aparecer na saída.
			 *
			 * É o que transforma a regra de prosa em verificação: sem isso, uma
			 * restrição de divulgação só é cumprida se quem escreveu o renderizador
			 * lembrou dela.
			 */
			padroesVedados?: readonly string[];
	  };

export type RegraDeIntegridade<TId extends string> = NaturezaDaRegra & {
	id: TId;
	regra: Redacao;
};

export interface Violacao {
	regra: Redacao;
	padrao: string;
	/** Trecho da saída que casou com o padrão. */
	trecho: Redacao;
}

/**
 * Confere um texto renderizado contra as regras que declaram padrões vedados.
 *
 * Roda sobre a saída final, não sobre o modelo: o risco não é a base guardar um
 * dado reservado ou uma competência alheia — é isso escapar para uma página.
 *
 * Cobre as duas naturezas que se verificam procurando um termo no texto:
 * restrição de divulgação (verdadeiro, mas não se divulga) e restrição de
 * competência (não se afirma). As demais naturezas dependem de julgamento
 * editorial e não têm como ser conferidas assim.
 */
export function verificarRegras<TId extends string>(
	texto: string,
	regras: readonly RegraDeIntegridade<TId>[],
): Violacao[] {
	const violacoes: Violacao[] = [];
	for (const regra of regras) {
		if (
			regra.natureza !== "restricao_de_divulgacao" &&
			regra.natureza !== "restricao_de_competencia"
		) {
			continue;
		}
		for (const padrao of regra.padroesVedados ?? []) {
			const encontrado = new RegExp(padrao, "i").exec(texto);
			if (encontrado) {
				violacoes.push({
					regra: regra.regra,
					padrao,
					trecho: encontrado[0],
				});
			}
		}
	}
	return violacoes;
}

/**
 * Lacuna reconhecida.
 *
 * Registrar o que não se sabe é parte do modelo: evita que a ausência seja
 * preenchida por inferência na hora de redigir.
 */
export type Lacuna<TReferencia extends string> =
	| {
			tipo: "informacao_a_confirmar";
			id: string;
			prioridade: "critica" | "muito_alta" | "alta" | "media" | "baixa";
	  }
	| {
			tipo: "metrica_a_levantar";
			referencia: TReferencia;
			categorias: readonly Redacao[];
	  };
