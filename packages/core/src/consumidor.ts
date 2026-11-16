/**
 * Consumidor — quem recebe e interpreta a comunicação.
 *
 * `consumidor` responde "quem é?"; a intenção dele responde "o que está
 * buscando nesta interação?". São eixos independentes: o mesmo perfil pode
 * chegar com intenções diferentes, e a mesma intenção pode vir de perfis
 * diferentes.
 *
 * Humano e agente não são o mesmo conceito e por isso não compartilham forma:
 * de uma pessoa queremos um efeito percebido; de um agente queremos
 * interpretação correta, sem ambiguidade. O discriminante `tipo` separa os dois.
 */
import type { Redacao } from "./utilitarios.ts";

/** O que um agente precisa encontrar no material para não inferir errado. */
export type NecessidadeSemantica =
	| "datas_explicitadas"
	| "papeis_explicitados"
	| "tecnologias_normalizadas"
	| "resultados_separados_de_responsabilidades"
	| "autoria_separada_de_participacao"
	| "evidencias_rastreaveis"
	| "entidades_identificadas"
	| "relacoes_explicitas";

export type Consumidor<
	TPerfilHumano extends string,
	TPerfilAgente extends string,
	TIntencao,
	TArgumentoId extends string,
> =
	| {
			tipo: "humano";
			perfil: TPerfilHumano;
			intencoesProvaveis: readonly TIntencao[];
			/** Argumentos que este perfil precisa ver primeiro. */
			argumentosPrioritarios: readonly TArgumentoId[];
			observacao?: Redacao;
	  }
	| {
			tipo: "agente";
			perfil: TPerfilAgente;
			intencoesProvaveis: readonly TIntencao[];
			necessidadesSemanticas: readonly NecessidadeSemantica[];
			observacao?: Redacao;
	  };

/** Tipo de consumidor sem amarrar aos vocabulários de uma especialização. */
export type TipoDeConsumidor = "humano" | "agente";
