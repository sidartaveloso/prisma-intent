/**
 * Missão: o que a história pede fora da tela.
 *
 * Dois lados que nunca se misturam: a missão do aprendiz é narrativa e
 * visível; a missão de quem acompanha é logística, secreta para o aprendiz e
 * anterior. A confirmação de quem acompanha não é um campo booleano: é a
 * transição `enviada_a_quem_acompanha → preparada`, que libera a etapa. Uma só
 * entidade `missao` faria o aprendiz ver a instrução de quem prepara, ou a
 * história avançar sem preparação.
 *
 * Missão não é gamificação: não há pontos, níveis nem recompensa — há uma
 * história que continua.
 */
import type { Redacao } from "@prisma-intent/core";

/** Objeto do ambiente que a história pode incorporar: "a caixa azul". */
export interface ObjetoDoAmbiente {
	nome: Redacao;
	/** Onde costuma ficar; a missão de quem acompanha pode movê-lo. */
	lugar?: Redacao;
}

/** O que o aprendiz vê e faz. */
export interface MissaoDoAprendiz {
	id: Redacao;
	/** A pista, como aparece na tela: "Ela está em algum lugar do seu quarto!". */
	pista: Redacao;
	/** O que o aprendiz precisa fazer fora da tela. */
	acao: Redacao;
	/** Como o aprendiz confirma o achado. */
	retorno:
		| { tipo: "qr_no_objeto" }
		| { tipo: "nfc_no_objeto" }
		| { tipo: "declaracao"; pergunta: Redacao };
	/** O que a história diz quando o achado é confirmado. */
	continuacao: Redacao;
}

/** O que quem acompanha prepara antes. Nunca renderizada para o aprendiz. */
export interface MissaoDeQuemAcompanha {
	id: Redacao;
	/** A missão do aprendiz que esta preparação libera. */
	libera: MissaoDoAprendiz["id"];
	/** Passos concretos: "esconda o adesivo debaixo da cama", "imprima o mapa". */
	passos: readonly Redacao[];
	/** Objetos do ambiente envolvidos, pelo nome. */
	objetos: readonly ObjetoDoAmbiente["nome"][];
	/** Sempre presente: o aprendiz não pode saber. */
	segredo: "nao_conte_nada";
	/**
	 * A palavra com que quem acompanha confirma que preparou — o portão da
	 * etapa. Qual palavra é escolha de cada produto.
	 */
	confirmacao: Redacao;
}
