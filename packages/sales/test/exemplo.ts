/**
 * Instância fictícia, só para os testes. Nomes, números e textos são
 * inventados: este pacote não guarda dado de proponente, comprador ou proposta
 * real.
 *
 * Ela é válida de ponta a ponta. Os testes de tipo partem dela e quebram uma
 * coisa de cada vez.
 */

import { interno } from "../src/index.ts";
import { definirInstancia } from "../src/instancia.ts";

export const propostaDeExemplo = definirInstancia({
	schemaVersion: "0.1.0",
	produto: {
		nome: "PRISMA Intent",
		descricao: "Narrativa Semântica Adaptativa orientada por intenção",
		especializacao: "sales",
	},
	instancia: {
		id: "exemplo-agendamento-2026",
		tipo: "proposta_comercial",
		estado: "rascunho",
		idiomaBase: "pt-BR",
	},
	proponente: { nome: "Fornecedora Alfa" },
	organizacoes: [
		{ id: "integradora", nome: "Integradora Beta", papel: "destinataria" },
		{ id: "operadora", nome: "Operadora Gama", papel: "cliente_final" },
	],
	leitores: [
		{
			tipo: "humano",
			id: "diretoria_comercial",
			perfil: "decisor_comercial",
			organizacao: "integradora",
			intencoesProvaveis: [
				{ familia: "preco", objetivo: "entender_composicao_do_preco" },
			],
			argumentosPrioritarios: ["preco_decorre_do_escopo"],
			profundidade: "media",
			secoesOcultas: [],
		},
		{
			tipo: "humano",
			id: "avaliacao_tecnica",
			perfil: "avaliador_tecnico",
			organizacao: "integradora",
			intencoesProvaveis: [
				{
					familia: "escopo_e_entrega",
					objetivo: "avaliar_capacidade_de_entrega",
				},
			],
			argumentosPrioritarios: ["arquitetura_aberta"],
			profundidade: "alta",
			secoesOcultas: ["preco"],
		},
		{
			tipo: "agente",
			id: "triagem",
			perfil: "agente_de_triagem",
			organizacao: "operadora",
			intencoesProvaveis: [
				{ familia: "triagem_automatizada", objetivo: "resumir_a_proposta" },
			],
			necessidadesSemanticas: [
				"entidades_identificadas",
				"relacoes_explicitas",
			],
			profundidade: "alta",
			secoesOcultas: ["preco"],
		},
	],
	intencoes: [
		{
			tipo: "justificar_o_preco",
			percepcaoCentral: "O preço decorre do escopo, linha por linha.",
			efeitosDesejados: {
				cognitivos: ["compreende_a_composicao_do_preco"],
				emocionais: ["previsibilidade"],
				comportamentais: ["aprova_o_preco"],
			},
			para: ["diretoria_comercial"],
		},
		{
			tipo: "gerar_confianca_tecnica",
			percepcaoCentral: "A solução é aberta e a equipe sabe entregá-la.",
			efeitosDesejados: {
				cognitivos: ["entende_o_escopo"],
				emocionais: ["confianca"],
				comportamentais: ["agenda_reuniao", "encaminha_internamente"],
			},
			para: ["avaliacao_tecnica"],
		},
	],
	observacaoDosEfeitos: {
		aprova_o_preco: {
			por: "resposta_do_leitor",
			como: "Aprovação registrada pela vendedora a partir da resposta escrita.",
		},
		agenda_reuniao: {
			por: "sinal_de_leitura",
			sinais: [{ sinal: "contato", canal: "agendamento" }],
		},
		encaminha_internamente: {
			por: "sinal_de_leitura",
			sinais: [
				{ sinal: "encaminhamento_provavel" },
				{ sinal: "material_levado", material: "pdf_da_proposta" },
			],
		},
	},
	argumentos: [
		{
			id: "preco_decorre_do_escopo",
			prioridade: "alta",
			tese: "Cada parcela do preço corresponde a um pacote de trabalho.",
			evidencias: [{ tipo: "evidencia", evidencia: "metodo_de_estimativa" }],
		},
		{
			id: "arquitetura_aberta",
			prioridade: "alta",
			tese: "A arquitetura usa protocolos documentados e não prende a operadora.",
			evidencias: [
				{ tipo: "evidencia", evidencia: "diagrama" },
				{ tipo: "pacote", pacote: "plataforma" },
			],
		},
	],
	evidencias: [
		{
			id: "metodo_de_estimativa",
			tipo: "estimativa_rastreavel",
			metodo:
				"Duas estimativas independentes por pacote, consolidadas pela mediana.",
		},
		{
			id: "diagrama",
			tipo: "arquitetura",
			descricao: "Diagrama de componentes e integrações.",
		},
		{
			id: "caso_de_agendamento",
			tipo: "caso_entregue",
			nome: "Agendamento regional",
			descricao: "Agendamento de atendimentos em rede regional.",
			fonte: { estado: "a_confirmar" },
		},
		{
			id: "disponibilidade_atendida",
			tipo: "item_de_conformidade",
			requisito: "REQ-01",
		},
	],
	objecoes: [
		{
			id: "preco_acima_da_referencia",
			prioridade: "alta",
			hipotese: "O preço está acima do contrato anterior.",
			natureza: "risco_de_interpretacao",
			resposta: {
				tipo: "reposicionamento",
				diretriz: "Mostrar que o escopo é outro, linha por linha.",
				evidenciasPrioritarias: [{ tipo: "pacote", pacote: "plataforma" }],
			},
		},
	],
	escopo: {
		pacotes: [
			{
				id: "plataforma",
				nome: "Plataforma de agendamento",
				descricao: "Agenda, filas e notificações.",
				responsavel: "proponente",
				inclusao: "no_preco",
				estimativa: {
					visibilidade: "interna",
					estado: "por_estimadores",
					unidade: "horas",
					porEstimador: [
						{ pessoa: "Estimadora A", valor: 400 },
						{ pessoa: "Estimador B", valor: 480 },
					],
					consolidada: { valor: 440, criterio: "mediana" },
				},
			},
			{
				id: "aplicativo",
				nome: "Aplicativo móvel",
				descricao: "Aplicativo para o público agendar sozinho.",
				responsavel: "proponente",
				inclusao: "opcional",
				estimativa: {
					visibilidade: "interna",
					estado: "por_faixa",
					unidade: "pessoas_mes",
					minimo: 2,
					maximo: 4,
					adotado: { estado: "a_confirmar", valorDeTrabalho: 3 },
					fonte: "Estudo de viabilidade fictício, tabela de esforço.",
				},
			},
			{
				id: "terminais",
				nome: "Terminais de autoatendimento",
				descricao: "Fornecimento e instalação dos terminais.",
				responsavel: "organizacao",
				organizacao: "integradora",
			},
		],
		requisitos: [
			{
				id: "REQ-01",
				modulo: "Disponibilidade",
				titulo: "Disponibilidade mensal",
				descricao: "A plataforma fica disponível 99,5% do mês.",
				prioridade: "alta",
				entendimento: interno(
					"Exige dois ambientes; o custo está na linha de implementação.",
				),
				conformidade: {
					atende: "desenvolvimento",
					pacote: "plataforma",
					resposta: {
						estado: "confirmado",
						valor: "Atendido com dois ambientes e failover.",
					},
				},
			},
			{
				id: "REQ-02",
				modulo: "Atendimento presencial",
				titulo: "Terminais nas unidades",
				descricao: "Cada unidade tem um terminal de autoatendimento.",
				prioridade: "media",
				entendimento: interno(
					"Fora do nosso escopo: terminais da integradora.",
				),
				conformidade: {
					atende: "terceiro",
					responsavel: "integradora",
					resposta: { estado: "a_confirmar" },
				},
			},
			{
				id: "REQ-03",
				modulo: "Integrações",
				titulo: "Integração com o cadastro",
				descricao: "Os agendamentos consultam o cadastro da operadora.",
				prioridade: "baixa",
				entendimento: interno("Depende de saber se o cadastro tem API."),
				conformidade: {
					atende: "a_confirmar",
					pergunta: "O cadastro expõe uma API documentada?",
				},
			},
		],
	},
	cronograma: {
		inicio: { estado: "a_confirmar" },
		fases: [
			{
				nome: "Mobilização",
				meses: { de: 0, ate: 1 },
				marcos: [],
			},
			{
				nome: "Implantação",
				meses: { de: 1, ate: 6 },
				marcos: [
					{
						id: "aceite_da_plataforma",
						nome: "Aceite da plataforma",
						mes: 6,
						criterioDeAceite: "Agendamento ponta a ponta em produção.",
						pacotes: ["plataforma"],
					},
				],
			},
			{
				nome: "Operação assistida",
				meses: { de: 6, ate: 9 },
				marcos: [
					{
						id: "aceite_final",
						nome: "Aceite final",
						mes: 9,
						criterioDeAceite:
							"Três meses de operação dentro do nível de serviço.",
						pacotes: ["plataforma", "aplicativo"],
					},
				],
			},
		],
	},
	preco: {
		moeda: "USD",
		taxaPorHora: {
			estado: "confirmada",
			valor: { forma: "por_hora", valor: { centavos: 10_000, moeda: "USD" } },
			decisao: {
				pessoa: "Pessoa Responsável",
				data: "2026-01-15",
				registro: "Ata fictícia de precificação.",
			},
		},
		linhas: [
			{
				natureza: "implementacao",
				descricao: "Plataforma de agendamento",
				categoria: "Implementação",
				horas: 440,
			},
			{
				natureza: "contingencia",
				descricao: "Contingência",
				categoria: "Implementação",
				percentual: 10,
			},
			{
				natureza: "licenca",
				descricao: "Banco de dados gerenciado",
				categoria: "Licenças",
				item: "Banco de dados gerenciado",
				recorrencia: "mensal",
				valor: { centavos: 50_000, moeda: "USD" },
			},
			{
				natureza: "sustentacao",
				descricao: "Sustentação",
				categoria: "Sustentação",
				horasPorMes: 80,
				meses: 12,
			},
			{
				natureza: "viagem",
				descricao: "Viagens de implantação",
				categoria: "Implementação",
				valor: { centavos: 500_000, moeda: "USD" },
			},
			{
				natureza: "opcional",
				descricao: "Aplicativo móvel",
				categoria: "Opcionais",
				item: "Aplicativo móvel",
				linhas: [
					{
						natureza: "implementacao",
						descricao: "Aplicativo móvel",
						categoria: "Opcionais",
						horas: 504,
					},
				],
			},
		],
		arredondamento: {
			custoUnico: {
				tipo: "multiplo",
				de: { centavos: 100_000, moeda: "USD" },
				sentido: "mais_proximo",
			},
			recorrente: { tipo: "nenhum" },
		},
		horizontesDoTcoEmAnos: [3, 5],
		marcosDePagamento: [
			{ marco: "aceite_da_plataforma", percentual: 60 },
			{ marco: "aceite_final", percentual: 40 },
		],
		premissas: [
			{
				descricao: "168 horas por pessoa-mês.",
				premissa: { estado: "a_confirmar", valorDeTrabalho: 168 },
			},
		],
	},
	perguntas: [
		{
			id: "api_do_cadastro",
			dirigidaA: "operadora",
			pergunta: "O cadastro expõe uma API documentada?",
			afeta: ["REQ-03"],
			resposta: { estado: "a_confirmar" },
		},
	],
	renderizacoes: [
		{
			tipo: "pdf_da_proposta",
			prioridade: "critica",
			objetivo: "Levar a proposta completa a quem decide.",
			profundidade: "alta",
			conteudoPrioritario: ["resumo", "escopo", "cronograma", "preco"],
			idiomas: ["pt-BR"],
			leitores: ["diretoria_comercial"],
		},
		{
			tipo: "site_da_proposta",
			prioridade: "alta",
			objetivo: "Uma página por leitor, com a leitura medida.",
			profundidade: "adaptativa",
			conteudoPrioritario: ["resumo", "solucao", "escopo", "conformidade"],
			leitores: ["diretoria_comercial", "avaliacao_tecnica", "triagem"],
		},
	],
	regrasDeIntegridade: [
		{
			id: "sem_custo_interno",
			natureza: "restricao_de_divulgacao",
			regra: "O custo interno da proposta não aparece em nenhuma saída.",
			padroesVedados: ["custo\\s+interno"],
		},
	],
});

/** Um requisito completo, com o entendimento interno. */
export const requisitoDeExemplo = propostaDeExemplo.escopo.requisitos[0];

/** Um pacote do proponente, com a estimativa interna. */
export const pacoteDeExemplo = propostaDeExemplo.escopo.pacotes[0];
