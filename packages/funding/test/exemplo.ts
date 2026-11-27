/**
 * Campanha fictícia dos testes: um produto com um protótipo em vídeo, um
 * argumento provado e outro a provar, e uma objeção respondida.
 */
import { definirCampanha } from "../src/index.ts";

export const exemplo = definirCampanha({
	schemaVersion: "0.1.0",
	produto: { nome: "PRISMA Intent", especializacao: "funding" },
	id: "exemplo",
	estado: "conceito",
	plataforma: { estado: "a_confirmar" },
	idiomas: ["pt-BR"],
	recursos: [
		{
			id: "render",
			linguagem: "imagem",
			natureza: "conceito",
			data: "2026-10-18",
			descricaoAlternativa: "renderização do produto",
		},
		{
			id: "video-prototipo",
			linguagem: "video",
			natureza: "prototipo",
			data: "2026-11-20",
			descricaoAlternativa: "protótipo andando",
		},
	],
	evidencias: [
		{
			id: "anda",
			nivel: "documentada",
			tipo: "demonstracao",
			recurso: "video-prototipo",
			mostra: "o carrinho anda controlado pelo celular",
		},
	],
	consumidores: [
		{
			tipo: "humano",
			perfil: "apoiador_entusiasta",
			intencoesProvaveis: ["ver_funcionando"],
			argumentosPrioritarios: ["funciona"],
		},
	],
	intencoes: [
		{
			tipo: "financiar_producao",
			percepcaoCentral: "funciona de verdade",
			efeitosDesejados: {
				cognitivos: ["conhece_o_estagio_real"],
				emocionais: ["confianca"],
				comportamentais: ["apoia_a_campanha"],
			},
			recursos: [{ recurso: "video-prototipo", papel: "carrega" }],
		},
	],
	observacaoDosEfeitos: {
		apoia_a_campanha: {
			por: "plataforma",
			metrica: "apoios_confirmados",
			meta: {
				estado: "confirmada",
				valor: { valor: 100, unidade: "apoiadores" },
				decisao: { pessoa: "autor", data: "2026-10-18", registro: "teste" },
			},
		},
	},
	estrategia: {
		sentimentosDesejados: ["confianca"],
		conclusaoDesejada: "existe",
	},
	argumentos: [
		{
			id: "funciona",
			prioridade: "critica",
			tese: "anda",
			evidencias: ["anda"],
		},
		{
			id: "voz",
			prioridade: "muito_alta",
			tese: "obedece à voz",
			evidencias: [],
		},
	],
	objecoes: [
		{
			id: "e-render",
			prioridade: "critica",
			natureza: "risco_de_interpretacao",
			hipotese: "é só uma imagem",
			resposta: {
				tipo: "resolver_por_evidencia",
				diretriz: "mostrar o vídeo do protótipo",
				evidenciasPrioritarias: ["anda"],
			},
		},
	],
	respostasAoLeitor: [
		{
			objecao: "e-render",
			texto: {
				estado: "confirmado",
				valor: "O vídeo mostra o protótipo andando, sem cortes.",
			},
		},
	],
	criterios: [{ id: "funciona_de_verdade", prioridade: "critica" }],
	canais: [{ canal: "pagina_da_campanha", profundidade: "alta" }],
	renderizacoes: [
		{
			tipo: "pagina_da_campanha",
			prioridade: "critica",
			objetivo: "levar a apoiar",
			profundidade: "alta",
			conteudoPrioritario: ["funciona", "e-render"],
		},
	],
	regrasDaCasa: [],
	regrasEmFoco: ["render_nao_e_prova"],
	lacunas: [],
});
