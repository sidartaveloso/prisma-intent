/**
 * Vocabulário do domínio Work.
 *
 * Estes termos não existem no core — e não devem existir. Currículo, vaga,
 * recrutador e senioridade são conceitos desta especialização; o core só sabe
 * que existem consumidores, intenções, argumentos e evidências.
 */
import { definirVocabulario } from "@prisma-intent/core";

/** Perfis humanos que consomem material de posicionamento profissional. */
export const perfisHumanos = definirVocabulario({
	recrutamento: {
		nome: "Recrutamento",
		descricao:
			"Avalia aderência, senioridade e risco de contratação antes de encaminhar o candidato adiante.",
	},
	lideranca_tecnica: {
		nome: "Liderança técnica",
		descricao:
			"Avalia profundidade técnica, capacidade de arquitetura e proximidade real com o código.",
	},
	lideranca_executiva: {
		nome: "Liderança executiva",
		descricao:
			"Avalia maturidade, capacidade de execução, visão de negócio e permanência de longo prazo.",
	},
	cliente: {
		nome: "Cliente",
		descricao:
			"Avalia se o profissional consegue resolver um problema concreto que ele já tem.",
	},
	parceiro: {
		nome: "Parceiro",
		descricao:
			"Avalia complementaridade técnica e confiabilidade para construir algo em conjunto.",
	},
	pesquisador_de_seguranca: {
		nome: "Pesquisador de segurança",
		descricao:
			"Encontrou uma possível falha e avalia se existe canal seguro para reportá-la — se será levado a sério e se não corre risco jurídico ao relatar.",
	},
	desenvolvedor: {
		nome: "Desenvolvedor",
		descricao:
			"Avalia se trabalharia bem sob a liderança técnica do profissional.",
	},
});

export type PerfilHumano = keyof typeof perfisHumanos;

/** Agentes que leem o material sem intermediação humana. */
export const perfisAgente = definirVocabulario({
	ia_de_recrutamento: {
		nome: "IA de recrutamento",
		descricao:
			"Extrai competências, senioridade e aderência a requisitos para triagem automatizada.",
	},
	ia_de_pesquisa: {
		nome: "IA de pesquisa",
		descricao:
			"Compõe um retrato do profissional a partir de fontes dispersas.",
	},
	mecanismo_de_busca: {
		nome: "Mecanismo de busca",
		descricao:
			"Indexa entidades e relações para responder consultas sobre o profissional.",
	},
	agente_de_avaliacao_tecnica: {
		nome: "Agente de avaliação técnica",
		descricao:
			"Verifica consistência entre competências declaradas e evidências apresentadas.",
	},
	leitor_de_security_txt: {
		nome: "Leitor de security.txt",
		descricao:
			"Descobre o canal de contato de segurança de um domínio lendo `/.well-known/security.txt` (RFC 9116), sem passar pela página legível por humanos.",
	},
});

export type PerfilAgente = keyof typeof perfisAgente;

/**
 * Intenção do consumidor, agrupada por família semântica.
 *
 * Uma lista solta de strings esconderia que "avaliar senioridade" e "avaliar
 * confiabilidade para um projeto" pertencem a situações diferentes — a primeira
 * é triagem, a segunda é contratação consultiva. A união discriminada torna a
 * família parte do tipo.
 */
export type IntencaoDoConsumidor =
	| {
			familia: "avaliacao_profissional";
			objetivo:
				| "avaliar_senioridade"
				| "avaliar_profundidade_tecnica"
				| "avaliar_capacidade_de_arquitetura"
				| "avaliar_capacidade_de_lideranca"
				| "avaliar_proximidade_com_codigo"
				| "avaliar_aderencia"
				| "avaliar_historico_profissional"
				| "avaliar_experiencia_em_sistemas_complexos"
				| "avaliar_capacidade_de_tomar_decisoes"
				| "avaliar_capacidade_de_execucao"
				| "avaliar_visao_de_negocio"
				| "avaliar_maturidade"
				| "avaliar_potencial_de_crescimento";
	  }
	| {
			familia: "analise_de_risco";
			objetivo:
				| "avaliar_estabilidade"
				| "identificar_riscos_de_contratacao"
				| "avaliar_compromisso_de_longo_prazo";
	  }
	| {
			familia: "contratacao_consultiva";
			objetivo:
				| "avaliar_capacidade_de_resolver_problema"
				| "avaliar_confiabilidade"
				| "avaliar_experiencia_no_dominio";
	  }
	| {
			familia: "exploracao";
			objetivo:
				| "conhecer_trajetoria"
				| "entender_competencias"
				| "explorar_cases"
				| "identificar_diferenciais";
	  }
	| {
			familia: "interpretacao_automatizada";
			objetivo:
				| "identificar_senioridade"
				| "extrair_competencias"
				| "relacionar_experiencias_com_requisitos"
				| "identificar_tecnologias"
				| "identificar_lideranca"
				| "identificar_resultados_quantificaveis";
	  };

/** Sentimento que uma peça deve provocar em um consumidor humano. */
export type Sentimento =
	| "confianca"
	| "seguranca"
	| "solidez"
	| "admiracao_tecnica"
	| "curiosidade_tecnica"
	| "respeito_profissional"
	| "impacto"
	| "amplitude"
	| "atualidade_tecnologica"
	| "pragmatismo"
	| "dominio_de_complexidade_enterprise";

/** O que o consumidor deve passar a entender. */
export type EfeitoCognitivo =
	| "perceber_senioridade"
	| "perceber_profundidade_tecnica"
	| "perceber_capacidade_de_arquitetura"
	| "perceber_capacidade_de_lideranca"
	| "perceber_capacidade_de_execucao"
	| "perceber_experiencia_com_sistemas_complexos"
	| "perceber_experiencia_com_escala"
	| "perceber_intencao_de_longo_prazo";

/** O que o consumidor deve fazer — a única camada observável. */
export type EfeitoComportamental =
	| "continuar_leitura"
	| "aprofundar_avaliacao"
	| "explorar_cases"
	| "iniciar_conversa_tecnica"
	| "considerar_para_lideranca_tecnica"
	| "avancar_no_processo";

/** Onde o material é consumido. */
export type Canal =
	| "curriculo"
	/**
	 * Página que recebe quem escaneou o código do currículo impresso.
	 *
	 * Canal próprio, e não parte do site: o visitante já tem o documento na mão
	 * e leu a versão curta. A pergunta dele não é "quem é essa pessoa?", e sim
	 * "o que mais existe além do que coube nas folhas?" — o que muda o que a
	 * página deve mostrar primeiro.
	 */
	| "curriculo_online"
	| "site_pessoal"
	| "linkedin"
	| "entrevista"
	| "proposta"
	| "dados_estruturados"
	/**
	 * Política de divulgação responsável de vulnerabilidades.
	 *
	 * Canal próprio, e não seção do site: quem chega aqui não pergunta "quem é
	 * essa pessoa?" — já encontrou um problema e pergunta "como reporto isso sem
	 * causar dano e sem me expor?". A leitura é operacional, e o leitor é
	 * frequentemente internacional, o que muda o idioma, o tom e o que precisa
	 * vir primeiro.
	 */
	| "politica_de_seguranca";

/**
 * Idiomas em que uma renderização pode ser publicada.
 *
 * Distinto de `idiomaBase`, que é a língua em que os fatos da instância foram
 * escritos. Um canal pode publicar em idioma que a base não usa — a tradução é
 * responsabilidade do canal, e o que ela traduz continua sendo a mesma base.
 */
export type IdiomaDePublicacao = "pt-BR" | "en";

/** Qualidades profissionais, com a definição que as torna verificáveis. */
export const qualidades = definirVocabulario({
	capacidade_de_abstracao: {
		nome: "Capacidade de abstração",
		descricao:
			"Reduz um problema confuso a um modelo que outras pessoas conseguem implementar.",
	},
	visao_sistemica: {
		nome: "Visão sistêmica",
		descricao:
			"Enxerga o sistema inteiro — software, hardware, operação e negócio — e as consequências entre as partes.",
	},
	capacidade_de_execucao: {
		nome: "Capacidade de execução",
		descricao: "Leva a solução da concepção até a operação real.",
	},
	lideranca_tecnica: {
		nome: "Liderança técnica",
		descricao:
			"Conduz decisões técnicas e pessoas sem se afastar da engenharia.",
	},
	proximidade_com_codigo: {
		nome: "Proximidade com o código",
		descricao:
			"Continua implementando, revisando e decidindo no nível da implementação.",
	},
	autonomia: {
		nome: "Autonomia",
		descricao:
			"Assume um problema sem solução óbvia e o conduz sem precisar de direção externa.",
	},
	orientacao_a_produto: {
		nome: "Orientação a produto",
		descricao:
			"Trata software como produto: decide o que construir, não apenas como construir.",
	},
	capacidade_de_aprender_dominios: {
		nome: "Capacidade de aprender domínios",
		descricao:
			"Entra em domínios novos — segurança pública, saúde, indústria, energia — e modela suas regras.",
	},
	capacidade_de_integracao: {
		nome: "Capacidade de integração",
		descricao:
			"Conecta sistemas, dispositivos e organizações que não foram feitos para conversar.",
	},
	responsabilidade_sobre_o_resultado: {
		nome: "Responsabilidade sobre o resultado",
		descricao:
			"Responde pelo funcionamento em produção, não apenas pela entrega.",
	},
});

export type Qualidade = keyof typeof qualidades;

/** Unidades admitidas em métricas do domínio profissional. */
export type Unidade =
	| "minutos"
	| "horas"
	| "dias"
	| "anos"
	| "projetos"
	| "estados"
	| "percentual"
	| "pessoas"
	| "veiculos"
	| "dispositivos"
	| "usuarios"
	| "documentos"
	| "registros"
	| "unidades_da_federacao"
	| "organizacoes";
