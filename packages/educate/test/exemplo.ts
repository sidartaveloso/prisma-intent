/**
 * Dois briefs fictícios sobre os mesmos tipos, cada um com o vocabulário da
 * própria instância: uma criança, por quem outra pessoa decide, e um adulto,
 * que decide por si. Pessoas, produtos e textos são inventados.
 *
 * Os dois existem para a mesma afirmação: o pacote não fixa idade. O que muda
 * de um para o outro — canais, faixas, linhas, efeitos próprios — é declarado
 * por cada instância e entregue a `definirBrief`.
 */
import { definirVocabulario } from "@prisma-intent/core";
import { definirBrief } from "../src/brief.ts";
import type { EfeitoComportamental } from "../src/vocabulario.ts";

/* ── Instância 1: histórias para crianças ─────────────────────────────── */

export const canaisDaInfancia = definirVocabulario({
	tela_da_sala: {
		nome: "Tela da sala",
		descricao: "A criança diante da tela da sala, com a família por perto.",
	},
	mensagem_a_quem_decide: {
		nome: "Mensagem a quem decide",
		descricao: "Quem responde pela criança, lendo o acompanhamento.",
	},
	mensagem_a_quem_acompanha: {
		nome: "Mensagem a quem acompanha",
		descricao: "Quem vai preparar a missão, recebendo os passos.",
	},
});

export const faixasDaInfancia = definirVocabulario({
	quatro_a_cinco: {
		nome: "4 a 5 anos",
		descricao: "Histórias curtas, sempre para ver juntos.",
	},
	seis_a_oito: {
		nome: "6 a 8 anos",
		descricao: "Histórias com missão fora da tela.",
	},
});

export const efeitosDaInfancia = definirVocabulario({
	convidar_para_jogar_de_novo: {
		nome: "Convidar para jogar de novo",
		descricao: "Chamar o outro para mais uma partida depois de perder.",
	},
});

export type VocabularioDaInfancia = {
	canal: keyof typeof canaisDaInfancia;
	linha: "licoes_de_vida" | "descobertas";
	faixa: keyof typeof faixasDaInfancia;
	necessidade: "fala" | "leitura";
	estagio: "alfabetizacao_em_curso" | "leitora_autonoma";
	efeitoComportamental: EfeitoComportamental | keyof typeof efeitosDaInfancia;
	idioma: "pt-BR";
};

export const briefDeCrianca = definirBrief<VocabularioDaInfancia>()({
	schemaVersion: "0.1.0",
	produto: { nome: "PRISMA Intent", especializacao: "educate" },
	id: "aprender-a-perder",
	estado: "rascunho",

	publico: {
		nome: "Lia",
		faixa: "seis_a_oito",
		estagio: { base: "descricao_propria", estagio: "leitora_autonoma" },
		interesses: ["espaço", "futebol"],
		necessidades: [],
		quemDecide: {
			tipo: "outra_pessoa",
			decisores: [{ comoEChamada: "mamãe", noMesmoLugar: true }],
		},
		quemAcompanha: [{ comoEChamada: "vovô", noMesmoLugar: false }],
		pares: ["Téo"],
	},
	modoDeConsumo: "com_supervisao",
	consumidores: [
		{
			tipo: "humano",
			perfil: "acompanhante",
			intencoesProvaveis: [
				{ familia: "confiar_e_acompanhar", objetivo: "participar_a_distancia" },
			],
			argumentosPrioritarios: [],
		},
		{
			tipo: "humano",
			perfil: "decisor",
			intencoesProvaveis: [
				{ familia: "confiar_e_acompanhar", objetivo: "acompanhar_sem_vigiar" },
			],
			argumentosPrioritarios: [],
		},
		{
			tipo: "agente",
			perfil: "agente_de_producao",
			intencoesProvaveis: [
				{ familia: "producao", objetivo: "obter_brief_completo" },
			],
			necessidadesSemanticas: ["papeis_explicitados"],
		},
	],

	intencoes: [
		{
			tipo: "licao_de_vida",
			percepcaoCentral: "Perder faz parte de jogar.",
			efeitosDesejados: {
				cognitivos: ["entender"],
				emocionais: ["tolerar_a_frustracao"],
				comportamentais: [
					"cumprimentar_quem_ganhou",
					"convidar_para_jogar_de_novo",
				],
			},
		},
	],
	objetivosObservaveis: [
		{
			efeito: "cumprimentar_quem_ganhou",
			comportamento: "Dizer 'boa!' para quem ganhou",
			condicao: "Quando perder um jogo em casa",
			criterio: "Pelo menos uma vez na semana",
		},
	],
	estrategia: {
		sentimentosDesejados: ["coragem", "ternura"],
		conclusaoDesejada: "Dá para perder e continuar gostando de jogar.",
	},

	tema: {
		titulo: "aprender a perder",
		origem: {
			origem: "acontecimento",
			relato: "perdeu o jogo e ficou brava",
			data: "2026-10-03",
		},
	},
	mundo: {
		id: "campinho-das-estrelas",
		nome: "O campinho das estrelas",
		descricao: "Um campo de futebol numa lua pequena.",
		personagens: ["a goleira Nix"],
	},
	linha: "licoes_de_vida",

	missoesDoAprendiz: [
		{
			id: "achar-a-medalha",
			pista: "A medalha de quem joga de novo está perto da sua bola!",
			acao: "Procurar a medalha de papel",
			retorno: { tipo: "declaracao", pergunta: "Achou a medalha?" },
			continuacao: "Nix sorri: essa medalha é de quem volta para o jogo.",
		},
	],
	missoesDeQuemAcompanha: [
		{
			id: "esconder-a-medalha",
			libera: "achar-a-medalha",
			passos: ["recorte a medalha de papel", "esconda perto da bola"],
			objetos: ["a bola"],
			segredo: "nao_conte_nada",
			confirmacao: "FEITO",
		},
	],

	canais: [
		{ canal: "tela_da_sala", profundidade: "media" },
		{ canal: "mensagem_a_quem_acompanha", profundidade: "minima" },
	],
	renderizacoes: [
		{
			tipo: "tela_da_sala",
			prioridade: "critica",
			objetivo: "Contar a história até a missão.",
			profundidade: "media",
			conteudoPrioritario: ["achar-a-medalha"],
		},
		{
			tipo: "mensagem_a_quem_decide",
			prioridade: "alta",
			objetivo: "Dizer o que ela viveu e o que fez depois.",
			profundidade: "minima",
			conteudoPrioritario: [],
		},
	],

	regrasDaCasa: [
		{
			id: "sem_placar",
			natureza: "restricao_de_divulgacao",
			regra: "Esta família não quer placar na história.",
			padroesVedados: ["\\d+\\s*a\\s*\\d+"],
		},
	],
	regrasEmFoco: ["moral_nao_declarada", "sem_telemetria_na_saida"],
});

/* ── Instância 2: um curso para adultos ───────────────────────────────── */

export const canaisDoCurso = definirVocabulario({
	celular_no_intervalo: {
		nome: "Celular no intervalo",
		descricao: "Poucos minutos entre uma tarefa e outra, no celular.",
	},
});

export const efeitosDoCurso = definirVocabulario({
	ligar_para_o_socorro: {
		nome: "Ligar para o socorro",
		descricao: "Discar o número de emergência e dizer o que aconteceu e onde.",
	},
});

export type VocabularioDoCurso = {
	canal: keyof typeof canaisDoCurso;
	linha: "primeiros_socorros";
	faixa: never;
	necessidade: never;
	estagio: never;
	efeitoComportamental: EfeitoComportamental | keyof typeof efeitosDoCurso;
	idioma: "pt-BR" | "en";
};

export const briefDeAdulto = definirBrief<VocabularioDoCurso>()({
	schemaVersion: "0.1.0",
	produto: { nome: "PRISMA Intent", especializacao: "educate" },
	id: "os-primeiros-minutos",
	estado: "rascunho",

	publico: {
		nome: "Rui",
		interesses: ["trilhas"],
		necessidades: [],
		quemDecide: { tipo: "o_proprio_aprendiz" },
		quemAcompanha: [],
		pares: [],
	},
	modoDeConsumo: "autonomo",
	consumidores: [],

	intencoes: [
		{
			tipo: "habito",
			percepcaoCentral: "Nos primeiros minutos, o socorro é quem está perto.",
			efeitosDesejados: {
				cognitivos: ["lembrar", "aplicar"],
				emocionais: ["sentir_seguranca"],
				comportamentais: ["fazer_o_desafio", "ligar_para_o_socorro"],
			},
		},
	],
	objetivosObservaveis: [
		{
			efeito: "ligar_para_o_socorro",
			comportamento: "Dizer o número de emergência e o que informar",
			condicao: "Diante de uma cena simulada",
			criterio: "Sem consultar anotações",
		},
		{
			efeito: "fazer_o_desafio",
			comportamento: "Apontar onde fica o kit de primeiros socorros",
			condicao: "No lugar onde estiver",
		},
	],
	estrategia: {
		sentimentosDesejados: ["seguranca", "calma"],
		conclusaoDesejada: "Eu sei o que fazer primeiro.",
	},

	tema: {
		titulo: "os primeiros minutos",
		origem: {
			origem: "assunto_em_estudo",
			assunto: "atendimento inicial a quem desmaiou",
			alinhamentos: [
				{ referencial: "ementa do curso (fictícia)", codigo: "M2.1" },
			],
			contexto: "turma-de-marco",
		},
	},
	mundo: {
		id: "trilha-da-serra",
		nome: "A trilha da serra",
		descricao: "Um grupo de caminhada longe de qualquer hospital.",
		personagens: ["a guia Dora"],
	},
	linha: "primeiros_socorros",

	missoesDoAprendiz: [
		{
			id: "achar-o-kit",
			pista: "Antes de continuar: onde está o kit do lugar em que você está?",
			acao: "Localizar o kit de primeiros socorros",
			retorno: { tipo: "declaracao", pergunta: "Onde fica o kit?" },
			continuacao: "Dora anota: agora o grupo sabe para onde correr.",
		},
	],
	missoesDeQuemAcompanha: [],

	canais: [{ canal: "celular_no_intervalo", profundidade: "minima" }],
	renderizacoes: [
		{
			tipo: "celular_no_intervalo",
			prioridade: "critica",
			objetivo: "Uma cena curta, com a missão no fim.",
			profundidade: "minima",
			conteudoPrioritario: ["achar-o-kit"],
			idiomas: ["pt-BR", "en"],
		},
	],

	regrasDaCasa: [],
	regrasEmFoco: ["fatos_nao_se_adaptam"],
});
