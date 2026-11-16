/**
 * A oportunidade concreta.
 *
 * Vários campos são legitimamente desconhecidos no início. `Certeza` mantém
 * essa ausência explícita no dado, em vez de deixá-la virar um campo opcional
 * que alguém preenche por inferência mais tarde.
 */
import type { Certeza, Redacao } from "@prisma-intent/core";
import type { Modalidade } from "./pessoa.ts";

export interface Indicacao {
	tipo: "indicacao_interna";
	nome: Redacao;
	relacao: Redacao;
	contexto: Redacao;
	/** A indicação carrega um viés que o material precisa neutralizar. */
	riscoDeAssociacao?: Redacao;
}

export type OrigemDaOportunidade =
	| Indicacao
	| { tipo: "candidatura_direta" }
	| { tipo: "abordagem_recebida"; origem: Redacao };

export interface Oportunidade {
	tipo:
		| "indicacao_para_lideranca_tecnica_sem_vaga_formal_identificada"
		| "vaga_formal"
		| "contratacao_consultiva";
	organizacao: { nome: Redacao; tipo: "empresa_global" | "empresa" | "orgao" };
	origem: OrigemDaOportunidade;
	direcionamentoConhecido: {
		area: Redacao;
		escopo: Redacao;
	};
	cargoFormal: Certeza<Redacao>;
	descricaoFormal: Certeza<Redacao>;
	nivelCorporativo: Certeza<Redacao>;
	areaOrganizacional: Certeza<Redacao>;
	modalidadeDesejada: Modalidade;
}
