/**
 * A pessoa posicionada.
 *
 * `identidadesAEvitar` é tão determinante quanto `identidadeDesejada`: boa
 * parte do trabalho de posicionamento é impedir uma leitura errada que o
 * material produziria sozinho.
 */
import type { Redacao } from "@prisma-intent/core";

export type Identidade =
	| "lider_tecnico"
	| "arquiteto_de_solucoes"
	| "desenvolvedor_hands_on"
	| "criador_de_produtos"
	| "resolvedor_de_problemas_complexos"
	| "gestor_afastado_do_codigo"
	| "executivo_puramente_administrativo"
	| "especialista_sap"
	| "consultor_funcional_sap"
	| "generalista_sem_profundidade"
	| "empreendedor_em_transicao_temporaria";

export interface Posicionamento {
	tipo: "lideranca_tecnica_hands_on" | "arquitetura" | "consultoria";
	/** O que afirmamos que a pessoa é, em uma frase. */
	tese: Redacao;
	/** A mesma tese comprimida ao ponto de caber num cabeçalho. */
	fraseSintese: Redacao;
	/**
	 * Título profissional, na nomenclatura que o mercado-alvo usa.
	 *
	 * Vem logo abaixo do nome e estabelece a categoria profissional antes de
	 * qualquer leitura: é o que separa "programador experiente" de "quem define
	 * como o sistema deve ser construído". Usa os termos das vagas reais, não
	 * por palavra-chave, mas porque é assim que a função se chama lá.
	 */
	titulo: Redacao;
	/**
	 * Resumo em um parágrafo — o trecho mais lido de um currículo.
	 *
	 * Escrito em terceira pessoa implícita, sem "busco novos desafios": diz o
	 * que a pessoa faz, em que escala e com quem, para que os dez primeiros
	 * segundos já classifiquem o candidato.
	 */
	resumo: Redacao;
}

export type Modalidade = "remoto" | "hibrido" | "presencial";

/**
 * Formulações em primeira pessoa.
 *
 * A instância descreve a pessoa em terceira pessoa, porque é assim que
 * currículo, LinkedIn e agentes a leem. Mas o site é assinado por ela — e "É
 * alguém que pode receber um problema complexo" soa como recomendação de
 * terceiro em uma página onde ela mesma fala.
 *
 * A voz é parte da adaptação ao canal, então é dado da instância, não uma
 * reescrita que cada renderização inventa por conta.
 */
export interface VozPropria {
	/** O que faz, em uma linha. */
	sintese: Redacao;
	/** O arco do trabalho — de onde começa e onde termina. */
	arco: Redacao;
	/** O que o leitor ganha ao trabalhar com ela. */
	promessa: Redacao;
}

export interface Pessoa {
	nome: Redacao;
	posicionamento: Posicionamento;
	/** A mesma tese na voz de quem assina o canal. */
	vozPropria: VozPropria;
	identidadeDesejada: readonly Identidade[];
	/** Leituras que o material precisa ativamente impedir. */
	identidadesAEvitar: readonly Identidade[];
	preferencias: {
		modalidade: Modalidade;
		combinacaoDesejada: readonly Redacao[];
	};
}

/** Por que a pessoa quer esta mudança — e como isso deve ser lido. */
export interface Motivacao {
	tipo: "construcao_de_carreira_em_grande_organizacao" | "novo_desafio_tecnico";
	motivadores: readonly Redacao[];
	/** Formulação segura: diz a verdade sem abrir flanco para objeção. */
	descricaoCanonica: Redacao;
	interpretacaoDesejada: Redacao;
}
