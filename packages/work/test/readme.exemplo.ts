/**
 * O exemplo do README da raiz, inteiro.
 *
 * O README mostra um recorte, com `/* … *\/` no lugar do que não cabe numa
 * página de entrada. Este arquivo é o exemplo completo: a menor instância que
 * compila, com a referência errada do README e o `@ts-expect-error` que a
 * confere. `readme.test.ts` garante que o recorte do README continua sendo um
 * recorte deste arquivo — se a API mudar, é aqui que o compilador reclama.
 *
 * Dados fictícios.
 */
import { definirInstancia } from "@prisma-intent/work";

export const instancia = definirInstancia({
	schemaVersion: "0.1.0",
	produto: {
		nome: "PRISMA Intent",
		descricao: "Narrativa Semântica Adaptativa orientada por intenção",
		especializacao: "work",
	},
	instancia: {
		id: "exemplo-do-readme",
		tipo: "posicionamento_para_oportunidade_profissional",
		estado: "em_construcao",
		idiomaBase: "pt-BR",
	},
	objetivo: {
		descricao: "Mostrar a menor instância que compila.",
		resultadoEsperado: "Um exemplo que não fica para trás.",
	},
	pessoa: {
		nome: "Ana Exemplo",
		posicionamento: {
			tipo: "arquitetura",
			tese: "Arquiteta que leva o sistema até a produção.",
			fraseSintese: "Arquitetura que chega à produção.",
			titulo: "Arquiteta de software",
			resumo: "Decide a arquitetura e acompanha a implantação.",
		},
		vozPropria: {
			sintese: "Decido a arquitetura e levo até a produção.",
			arco: "Do desenho à operação.",
			promessa: "Um sistema que fica de pé.",
		},
		identidadeDesejada: ["arquiteto_de_solucoes"],
		identidadesAEvitar: [],
		preferencias: { modalidade: "remoto", combinacaoDesejada: [] },
	},
	oportunidade: {
		tipo: "vaga_formal",
		organizacao: { nome: "Delta Global", tipo: "empresa" },
		origem: { tipo: "candidatura_direta" },
		direcionamentoConhecido: { area: "pagamentos", escopo: "arquitetura" },
		cargoFormal: { estado: "a_confirmar" },
		descricaoFormal: { estado: "a_confirmar" },
		nivelCorporativo: { estado: "a_confirmar" },
		areaOrganizacional: { estado: "a_confirmar" },
		modalidadeDesejada: "remoto",
	},
	motivacao: {
		tipo: "novo_desafio_tecnico",
		motivadores: [],
		descricaoCanonica: "Quer um sistema de maior escala.",
		interpretacaoDesejada: "Movimento de crescimento.",
	},
	experiencias: [],
	formacao: [],
	certificacoes: [],
	idiomas: [],
	lideranca: [],
	baseTecnica: {
		stackPrincipal: [],
		complementares: [],
		areas: [],
		competencias: [],
	},
	qualidades: [],
	cases: [
		{
			id: "migracao-de-pagamentos",
			nome: "Migração de pagamentos",
			relevancia: "critica",
			papeisNarrativos: ["prova_de_arquitetura"],
			contexto: { dominio: "pagamentos" },
			problema: "Trocar o motor de pagamentos sem parar a operação.",
			frentes: [],
			fontesDeComplexidade: ["alta_disponibilidade"],
			estrategiaNarrativa: {
				sentimentosDesejados: ["solidez"],
				conclusaoDesejada: "Ela troca o motor com o avião voando.",
			},
		},
	],
	casesExcluidos: [],
	argumentos: [
		{
			id: "arquitetura-e-execucao",
			prioridade: "critica",
			tese: "Decide a arquitetura e leva o sistema até a produção.",
			// @ts-expect-error — o case "migracao-de-pagamento" não existe
			evidencias: [{ tipo: "case", case: "migracao-de-pagamento" }],
		},
	],
	consumidores: [],
	nossaIntencao: {
		tipo: "construcao_de_percepcao_profissional",
		percepcaoCentral: "Quem decide a arquitetura é quem a implanta.",
		efeitosDesejados: { cognitivos: [], emocionais: [], comportamentais: [] },
	},
	criterios: [],
	objecoes: [],
	estrategiaEditorial: {
		principioCentral: "Demonstrar antes de afirmar.",
		ordemArgumentativa: ["arquitetura-e-execucao"],
		ordemDeCases: [],
		casesComplementares: [],
		linhasNarrativas: [],
	},
	renderizacoes: [],
	regrasDeIntegridade: [],
	evidencias: [],
	lacunas: [],
	conclusao: {
		tese: "Ela decide e implanta.",
		conclusaoDoConsumidor: "Vale uma conversa.",
		encaixeNaOportunidade: "A vaga pede arquitetura.",
	},
});
