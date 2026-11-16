/**
 * Case profissional — a evidência de maior densidade do domínio Work.
 *
 * Um case não entra no material por ser interessante, e sim por sustentar
 * argumentos: `papeisNarrativos` declara o que ele prova, e
 * `estrategiaNarrativa` declara a conclusão que o leitor deve formar sozinho.
 *
 * `restricoesEditoriais` fica junto do case de propósito. Quem for redigir
 * sobre um case precisa ver, no mesmo objeto, o que não pode ser atribuído a
 * ele — uma redução de tempo de resposta anterior ao sistema, por exemplo.
 */
import type {
	EstrategiaNarrativa,
	Evidencia,
	Prioridade,
	Redacao,
} from "@prisma-intent/core";
import type {
	Autoria,
	Dedicacao,
	Frente,
	Periodo,
	Vinculo,
} from "./experiencia.ts";
import type { Sentimento, Unidade } from "./vocabulario.ts";

/** O que este case prova na argumentação. */
export type PapelNarrativo =
	| "prova_de_lideranca_tecnica"
	| "prova_de_lideranca_tecnica_atual"
	| "prova_de_lideranca_de_implantacao"
	| "prova_de_lideranca_multidisciplinar"
	| "prova_de_arquitetura"
	| "prova_de_arquitetura_moderna"
	| "prova_de_escala"
	| "prova_de_sistema_de_missao_critica"
	| "prova_de_sistema_critico"
	| "prova_de_experiencia_historica"
	| "prova_de_integracao"
	| "prova_de_integracao_hardware_software"
	| "prova_de_integracao_fisico_digital"
	| "prova_de_execucao_hands_on"
	| "prova_de_software_corporativo"
	| "prova_de_integracoes_complexas"
	| "prova_de_regras_de_negocio"
	| "prova_de_operacao_em_producao"
	| "prova_de_inteligencia_artificial_aplicada"
	| "prova_de_produto_contemporaneo"
	| "prova_de_produto_industrial"
	| "prova_de_produto_completo"
	| "prova_de_amplitude_tecnica"
	| "prova_de_profundidade_tecnica"
	| "prova_de_inovacao"
	| "prova_de_iot"
	| "prova_de_modelagem_de_processo"
	| "prova_de_visao_de_negocio"
	| "prova_de_execucao";

/** De onde vem a dificuldade real do projeto. */
export type FonteDeComplexidade =
	| "missao_critica"
	| "tempo_real"
	| "alta_disponibilidade"
	| "baixa_latencia"
	| "sistemas_distribuidos"
	| "computacao_embarcada"
	| "multiplas_integracoes"
	| "grande_volume_de_ocorrencias"
	| "alto_volume_de_dados"
	| "visao_computacional"
	| "mensageria"
	| "hardware_e_software"
	| "restricoes_de_conectividade"
	| "regras_de_negocio_complexas"
	| "sistemas_corporativos"
	| "processos_formais_de_homologacao"
	| "documentos"
	| "evolucao_continua"
	| "operacao_critica"
	| "risco_operacional_elevado";

export interface CaseProfissional<TId extends string> {
	id: TId;
	nome: Redacao;
	relevancia: Prioridade;
	papeisNarrativos: readonly PapelNarrativo[];
	contexto: {
		dominio: Redacao;
		organizacao?: Redacao;
		cliente?: Redacao;
		estado?: "producao" | "piloto" | "encerrado";
	};
	problema: Redacao;
	/**
	 * Como a pessoa atua no case hoje.
	 *
	 * Separado da experiência profissional de propósito: prestar serviço a uma
	 * organização não é ter vínculo com ela, e um case atual pode ser executado
	 * através de outra empresa. Registrar isso no case evita que a trajetória
	 * sugira um emprego que não existe.
	 */
	atuacao?: {
		periodo: Periodo;
		vinculo?: Vinculo;
		dedicacao?: Dedicacao;
	};
	frentes: readonly Frente[];
	/** Participação da pessoa no case, quando não decomposta por frente. */
	autoria?: Autoria;
	fontesDeComplexidade: readonly FonteDeComplexidade[];
	tecnologias?: readonly Redacao[];
	capacidades?: readonly Redacao[];
	escala?: readonly Evidencia<Unidade>[];
	resultados?: readonly Evidencia<Unidade>[];
	evidencias?: readonly Evidencia<Unidade>[];
	/** Instituições que financiaram, apoiaram ou chancelaram o projeto. */
	apoioInstitucional?: readonly Redacao[];
	estrategiaNarrativa: EstrategiaNarrativa<Sentimento>;
	/** Afirmações vedadas neste case. Verificáveis antes de publicar. */
	restricoesEditoriais?: readonly Redacao[];
}

/** Case deliberadamente fora desta instância — e por quê. */
export interface CaseExcluido {
	id: Redacao;
	motivo:
		| { tipo: "relevancia"; descricao: Redacao }
		| { tipo: "autoria"; descricao: Redacao };
}
