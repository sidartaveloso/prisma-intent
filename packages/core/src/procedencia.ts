/**
 * De onde uma afirmação veio.
 *
 * `NivelDeEvidencia` diz **como** algo é sabido — documentado, declarado pelo
 * profissional, inferido. Não diz **de onde**, e sem isso dois números com o
 * mesmo nível são indistinguíveis por qualquer verificação: `minima: 20` e
 * `aproximada: 20` tinham o mesmo `nivel`, e só a leitura da conversa original
 * revelou que o primeiro afirmava mais do que a fonte sustenta.
 *
 * A regra `fatos_nao_se_ajustam` existe desde o começo. Este tipo é o que a
 * torna verificável para números.
 */
import type { Redacao } from "./utilitarios.ts";

export interface Procedencia {
	/** Caminho a partir da raiz do repositório. */
	arquivo: Redacao;
	/** Linha onde o trecho começa, quando a fonte tem numeração estável. */
	linha?: number;
	/**
	 * Citação literal do material — não paráfrase.
	 *
	 * Precisa ser encontrável no arquivo apontado, e há teste que procura. Um
	 * `trecho` reescrito com as palavras da própria instância faria a
	 * verificação conferir a instância contra ela mesma: daria a sensação de
	 * material auditado sem auditar nada, que é pior do que não ter o campo —
	 * pelo mesmo motivo que `verificarRegras` rodando sobre texto em inglês é
	 * pior do que não rodar.
	 */
	trecho: Redacao;
	/** O que a fonte **não** diz, quando o número vai além dela. */
	ressalva?: Redacao;
}
