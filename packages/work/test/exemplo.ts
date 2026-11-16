/**
 * Instância fictícia, só para os testes. Pessoa, organizações, produtos,
 * números e textos são inventados: este pacote não guarda a instância de
 * ninguém.
 *
 * Ela é válida de ponta a ponta e carrega, de propósito, um exemplar de cada
 * situação que a conferência precisa enxergar: um reconhecimento com sujeito,
 * uma liderança numa organização e não na outra, um piso com procedência, uma
 * métrica com redação segura e um número ainda sem fonte, declarado como
 * lacuna.
 */
import { definirInstancia } from "../src/instancia.ts";

const fonte = "packages/work/test/fonte-ficticia.md";

export const exemplo = definirInstancia({
	schemaVersion: "0.1.0",
	produto: {
		nome: "PRISMA Intent",
		descricao: "Narrativa Semântica Adaptativa orientada por intenção",
		especializacao: "work",
	},
	instancia: {
		id: "ana-exemplo-delta-global-lideranca-tecnica-2026",
		tipo: "posicionamento_para_oportunidade_profissional",
		estado: "em_construcao",
		idiomaBase: "pt-BR",
	},
	objetivo: {
		descricao: "Posicionar a pessoa para uma vaga de liderança técnica.",
		resultadoEsperado: "Convite para uma conversa técnica.",
	},

	pessoa: {
		nome: "Ana Exemplo",
		posicionamento: {
			tipo: "lideranca_tecnica_hands_on",
			tese: "Líder técnica que decide a arquitetura e continua no código.",
			fraseSintese: "Arquitetura decidida por quem implementa.",
			titulo: "Líder técnica",
			resumo:
				"Conduz times de engenharia e a arquitetura de sistemas em produção.",
		},
		vozPropria: {
			sintese: "Decido a arquitetura e levo até a produção.",
			arco: "Do problema mal definido ao sistema operando.",
			promessa: "Um sistema que o time consegue manter.",
		},
		identidadeDesejada: ["lider_tecnico", "desenvolvedor_hands_on"],
		identidadesAEvitar: ["gestor_afastado_do_codigo"],
		preferencias: {
			modalidade: "hibrido",
			combinacaoDesejada: ["liderança de pessoas", "decisão de arquitetura"],
		},
	},
	oportunidade: {
		tipo: "vaga_formal",
		organizacao: { nome: "Delta Global", tipo: "empresa_global" },
		origem: { tipo: "candidatura_direta" },
		direcionamentoConhecido: {
			area: "engenharia de plataforma",
			escopo: "liderança técnica de um time de produto",
		},
		cargoFormal: { estado: "confirmado", valor: "Líder técnica" },
		descricaoFormal: { estado: "a_confirmar" },
		nivelCorporativo: { estado: "a_confirmar" },
		areaOrganizacional: { estado: "a_confirmar" },
		modalidadeDesejada: "hibrido",
	},
	motivacao: {
		tipo: "novo_desafio_tecnico",
		motivadores: ["sistemas de maior escala"],
		descricaoCanonica: "Quer aplicar o que construiu em sistemas maiores.",
		interpretacaoDesejada: "Movimento de crescimento, não de saída.",
	},
	experiencias: [
		{
			id: "alfa",
			organizacao: "Alfa Sistemas",
			estado: "atual",
			cargos: [
				{
					titulo: "Sócia e líder técnica",
					periodo: { inicio: "2019", fim: null },
					vinculo: { tipo: "socio" },
					realizacoes: ["Defini a arquitetura da plataforma de pagamentos."],
				},
			],
			evidencias: [
				{
					tipo: "reconhecimento",
					descricao: "Vencedora de duas edições de um programa de inovação",
					organizacao: "Alfa Sistemas",
					nivel: "documentada",
				},
			],
			relevancia: "principal",
		},
		{
			id: "beta",
			organizacao: "Beta Mobilidade",
			estado: "encerrada",
			cargos: [
				{
					titulo: "Gerente de projetos",
					periodo: { inicio: "2012", fim: "2019" },
					vinculo: { tipo: "clt" },
				},
				{
					titulo: "Programadora",
					periodo: { inicio: "2008", fim: "2012" },
					vinculo: { tipo: "clt" },
				},
			],
			lideranca: {
				quantidade: { tipo: "minima", valor: 15 },
				composicao: "programadores de diferentes níveis",
				procedencia: {
					arquivo: fonte,
					linha: 7,
					trecho: "passava de quinze programadores",
				},
			},
			relevancia: "principal",
		},
	],
	formacao: [
		{
			instituicao: "Universidade Exemplo",
			grau: "graduacao",
			curso: "Ciência da Computação",
			conclusao: "2007",
		},
	],
	certificacoes: [],
	idiomas: [
		{ idioma: "Português", nivel: "nativo_ou_bilingue" },
		{ idioma: "Inglês", nivel: "profissional" },
	],
	lideranca: [
		{
			descricao: "Formação de líderes técnicos dentro do time",
			case: "painel-de-frotas",
		},
	],
	baseTecnica: {
		stackPrincipal: ["TypeScript", "PostgreSQL"],
		complementares: ["Docker"],
		areas: ["arquitetura_de_software", "backend"],
		competencias: [
			{
				eixo: "lideranca_e_arquitetura",
				rotulo: "Liderança e arquitetura",
				itens: ["Arquitetura de sistemas distribuídos"],
			},
		],
	},
	qualidades: ["visao_sistemica", "proximidade_com_codigo"],

	cases: [
		{
			id: "migracao-de-pagamentos",
			nome: "Migração de pagamentos",
			relevancia: "critica",
			papeisNarrativos: ["prova_de_arquitetura", "prova_de_execucao"],
			contexto: {
				dominio: "pagamentos",
				organizacao: "Alfa Sistemas",
				estado: "producao",
			},
			problema: "Trocar o motor de pagamentos sem parar a operação.",
			frentes: [
				{
					frente: "arquitetura",
					autoria: { grau: "direta", responsavel: "Ana Exemplo" },
				},
				{
					frente: "software",
					autoria: {
						grau: "lideranca",
						executor: "time da Alfa Sistemas",
						participacao: ["revisão de código", "decisões de desenho"],
					},
				},
				{
					frente: "infraestrutura",
					autoria: {
						grau: "tecnologia_incorporada",
						descricao: "fila de mensagens de terceiro",
					},
				},
			],
			fontesDeComplexidade: ["alta_disponibilidade", "multiplas_integracoes"],
			tecnologias: ["TypeScript", "PostgreSQL"],
			resultados: [
				{
					tipo: "metrica",
					nome: "Unidades com operação migrada",
					valor: 4,
					unidade: "organizacoes",
					redacaoSegura: "Quatro organizações operam na plataforma nova",
					nivel: "declaracao_do_profissional",
				},
			],
			estrategiaNarrativa: {
				sentimentosDesejados: ["solidez"],
				conclusaoDesejada: "Ela troca o motor com o avião voando.",
			},
			restricoesEditoriais: [
				"Não atribuir à migração a queda de chamados do ano anterior.",
			],
		},
		{
			id: "painel-de-frotas",
			nome: "Painel de frotas",
			relevancia: "alta",
			papeisNarrativos: ["prova_de_escala", "prova_de_execucao_hands_on"],
			contexto: {
				dominio: "mobilidade",
				organizacao: "Beta Mobilidade",
				estado: "producao",
			},
			problema: "Acompanhar em tempo real uma frota espalhada pelo estado.",
			atuacao: {
				periodo: { inicio: "2023", fim: null },
				vinculo: { tipo: "pj", por: "Alfa Sistemas", execucao: "pessoal" },
				dedicacao: { tipo: "parcial", horasSemanais: 10 },
			},
			frentes: [
				{
					frente: "software",
					autoria: { grau: "direta", responsavel: "Ana Exemplo" },
				},
			],
			fontesDeComplexidade: ["tempo_real", "alto_volume_de_dados"],
			escala: [
				{
					tipo: "metrica_minima",
					nome: "Veículos monitorados",
					valorMinimo: 2000,
					unidade: "veiculos",
					nivel: "declaracao_do_profissional",
					procedencia: {
						arquivo: fonte,
						linha: 8,
						trecho: "mais de dois mil veículos",
					},
				},
			],
			estrategiaNarrativa: {
				sentimentosDesejados: ["confianca"],
				conclusaoDesejada: "Ela continua escrevendo o sistema que lidera.",
			},
		},
		{
			id: "central-de-chamados",
			nome: "Central de chamados",
			relevancia: "media",
			papeisNarrativos: ["prova_de_experiencia_historica"],
			contexto: {
				dominio: "atendimento",
				organizacao: "Beta Mobilidade",
				estado: "encerrado",
			},
			problema: "Registrar e distribuir chamados de campo.",
			frentes: [
				{
					frente: "software",
					autoria: {
						grau: "compartilhada",
						participantes: ["Ana Exemplo", "time da Beta Mobilidade"],
					},
				},
			],
			fontesDeComplexidade: ["grande_volume_de_ocorrencias"],
			estrategiaNarrativa: {
				sentimentosDesejados: ["respeito_profissional"],
				conclusaoDesejada: "A trajetória começou em operação de verdade.",
			},
		},
	],
	casesExcluidos: [
		{
			id: "site-institucional",
			motivo: {
				tipo: "relevancia",
				descricao: "Não sustenta nenhum argumento desta instância.",
			},
		},
	],

	argumentos: [
		{
			id: "arquitetura-e-execucao",
			prioridade: "critica",
			tese: "Decide a arquitetura e leva o sistema até a produção.",
			evidencias: [
				{ tipo: "case", case: "migracao-de-pagamentos" },
				{ tipo: "case", case: "painel-de-frotas" },
				{ tipo: "atributo", atributo: "praticas_de_engenharia" },
			],
		},
		{
			id: "lideranca-de-pessoas",
			prioridade: "alta",
			tese: "Lidera times de engenharia sem se afastar do código.",
			evidencias: [
				{ tipo: "atributo", atributo: "lideranca_de_time" },
				{ tipo: "organizacao", organizacao: "Cooperativa Gama" },
			],
		},
	],
	consumidores: [
		{
			tipo: "humano",
			perfil: "recrutamento",
			intencoesProvaveis: [
				{ familia: "avaliacao_profissional", objetivo: "avaliar_senioridade" },
			],
			argumentosPrioritarios: ["arquitetura-e-execucao"],
		},
		{
			tipo: "agente",
			perfil: "ia_de_recrutamento",
			intencoesProvaveis: [
				{
					familia: "interpretacao_automatizada",
					objetivo: "extrair_competencias",
				},
			],
			necessidadesSemanticas: [
				"datas_explicitadas",
				"autoria_separada_de_participacao",
			],
		},
	],
	nossaIntencao: {
		tipo: "construcao_de_percepcao_profissional",
		percepcaoCentral: "Quem decide a arquitetura é quem a implementa.",
		efeitosDesejados: {
			cognitivos: ["perceber_capacidade_de_arquitetura"],
			emocionais: ["confianca"],
			comportamentais: ["iniciar_conversa_tecnica"],
		},
	},
	criterios: [{ id: "profundidade-tecnica", prioridade: "critica" }],
	objecoes: [
		{
			id: "gestora-afastada-do-codigo",
			prioridade: "alta",
			natureza: "risco_de_interpretacao",
			hipotese: "Quem lidera pessoas há anos já não escreve código.",
			resposta: {
				tipo: "resolver_por_evidencia",
				diretriz: "Mostrar o que ela implementa hoje, antes dos cargos.",
				evidenciasPrioritarias: [{ tipo: "case", case: "painel-de-frotas" }],
			},
		},
	],

	estrategiaEditorial: {
		principioCentral: "Demonstrar antes de afirmar.",
		ordemArgumentativa: ["arquitetura-e-execucao", "lideranca-de-pessoas"],
		ordemDeCases: [
			{
				posicao: 1,
				case: "migracao-de-pagamentos",
				motivo: "É a decisão de arquitetura mais recente.",
			},
			{
				posicao: 2,
				case: "painel-de-frotas",
				motivo: "Prova que ela segue no código.",
			},
		],
		casesComplementares: ["central-de-chamados"],
		linhasNarrativas: [
			{
				id: "do-campo-a-arquitetura",
				tipo: "evolucao_de_carreira",
				cases: ["central-de-chamados", "migracao-de-pagamentos"],
				mensagem: "Da operação de campo à decisão de arquitetura.",
			},
		],
	},
	renderizacoes: [
		{
			tipo: "curriculo",
			prioridade: "critica",
			objetivo: "Levar a pessoa à conversa técnica.",
			profundidade: "media",
			conteudoPrioritario: ["migracao-de-pagamentos", "painel-de-frotas"],
			limitePaginas: 2,
		},
		{
			tipo: "politica_de_seguranca",
			prioridade: "media",
			objetivo: "Dizer a quem achou uma falha como relatar.",
			profundidade: "minima",
			// Canal sem case: quem chega aqui não veio avaliar a trajetória.
			conteudoPrioritario: [],
			idiomas: ["pt-BR", "en"],
		},
	],

	regrasDeIntegridade: [
		{
			id: "fatos_nao_se_ajustam",
			natureza: "fato_invariavel",
			regra: "Nenhuma renderização altera um fato para caber na narrativa.",
		},
		{
			id: "cobol_nao_e_competencia_apresentada",
			natureza: "restricao_de_competencia",
			regra: "Não apresentar COBOL como competência da pessoa.",
			padroesVedados: ["\\bCOBOL\\b"],
		},
	],
	evidencias: [
		{
			tipo: "documento",
			id: "carta-de-recomendacao",
			arquivo: "carta-de-recomendacao.pdf",
			sustenta: ["liderança de time na Beta Mobilidade"],
		},
	],
	lacunas: [
		{
			tipo: "informacao_a_confirmar",
			id: "fonte_de_migracao_de_pagamentos_unidades_com_operacao_migrada",
			prioridade: "media",
		},
		{
			tipo: "metrica_a_levantar",
			referencia: "central-de-chamados",
			categorias: ["volume de chamados"],
		},
	],
	conclusao: {
		tese: "Ela decide e implementa sistemas que ficam de pé em produção.",
		conclusaoDoConsumidor: "Vale uma conversa técnica com ela.",
		encaixeNaOportunidade: "A vaga pede quem lidere sem sair do código.",
	},
});
