/**
 * Base técnica.
 *
 * As tecnologias são separadas por grau de uso porque essa distinção é o que
 * impede a lista de virar um amontoado onde tudo parece equivalente.
 *
 * O que a pessoa **não** quer que lhe seja atribuído não mora aqui: vive em
 * `regrasDeIntegridade`, como restrição de competência com padrão vedado. A
 * diferença é que lá a declaração é conferida contra a saída antes de publicar
 * — havia um campo `restricoes` nesta interface que ninguém lia, e declarar sem
 * efeito é pior do que não declarar.
 */
import type { Redacao } from "@prisma-intent/core";

export type AreaTecnica =
	| "arquitetura_de_software"
	| "sistemas_distribuidos"
	| "integracao_de_sistemas"
	| "sistemas_em_tempo_real"
	| "computacao_na_borda"
	| "iot"
	| "mensageria"
	| "geoprocessamento"
	| "bancos_de_dados"
	| "backend"
	| "frontend"
	| "aplicacoes_moveis"
	| "infraestrutura"
	| "containers"
	| "observabilidade"
	| "inteligencia_artificial_aplicada"
	| "integracao_hardware_software";

/**
 * Eixos de competência, na ordem em que sustentam uma candidatura sênior.
 *
 * A ordem é parte do argumento: para liderança técnica, arquitetura e condução
 * de pessoas vêm antes da lista de tecnologias. Um currículo que abre por
 * "Vue · TypeScript · Docker" se apresenta como especialista de stack, não como
 * quem decide o que construir — as tecnologias sustentam a candidatura, não a
 * definem.
 */
export type EixoDeCompetencia =
	| "lideranca_e_arquitetura"
	/**
	 * Como o software é construído — testes, revisão, integração, entrega.
	 *
	 * Separado das tecnologias de propósito: prática de engenharia é o que
	 * distingue quem conduz a construção de quem apenas conhece as ferramentas,
	 * e é a evidência mais direta contra a leitura de "gestor que não programa".
	 */
	| "praticas_de_engenharia"
	| "engenharia_e_plataforma"
	| "gestao_e_negocio";

export interface GrupoDeCompetencias {
	eixo: EixoDeCompetencia;
	rotulo: Redacao;
	itens: readonly Redacao[];
}

export interface BaseTecnica {
	/** O que a pessoa usa todo dia — a evidência mais forte de mão na massa. */
	stackPrincipal: readonly Redacao[];
	complementares: readonly Redacao[];
	areas: readonly AreaTecnica[];
	/**
	 * Recorte de apresentação: as mesmas competências agrupadas por eixo.
	 *
	 * Existe porque a lista crua de tecnologias não comunica senioridade. Nada
	 * aqui pode ser novo — tudo precisa estar sustentado pelo restante da
	 * instância.
	 */
	competencias: readonly GrupoDeCompetencias[];
}
