/**
 * Estados que não podem existir, conferidos pelo compilador.
 *
 * Cada bloco parte de um brief válido e quebra uma coisa só. O
 * `@ts-expect-error` afirma que aquilo não compila: se passar a compilar, a
 * diretiva fica sem uso e o `tsc` reprova.
 */
import { definirBrief } from "../src/brief.ts";
import {
	briefDeAdulto,
	briefDeCrianca,
	type VocabularioDaInfancia,
	type VocabularioDoCurso,
} from "./exemplo.ts";

const crianca = definirBrief<VocabularioDaInfancia>();
const adulto = definirBrief<VocabularioDoCurso>();

// A missão de quem acompanha só libera missão do aprendiz que existe.
crianca({
	...briefDeCrianca,
	missoesDeQuemAcompanha: [
		{
			id: "esconder-a-medalha",
			// @ts-expect-error — "achar-a-medala" não é missão do aprendiz
			libera: "achar-a-medala",
			passos: [],
			objetos: [],
			segredo: "nao_conte_nada",
			confirmacao: "FEITO",
		},
	],
});

// A renderização só prioriza missão que existe.
crianca({
	...briefDeCrianca,
	renderizacoes: [
		{
			tipo: "tela_da_sala",
			prioridade: "critica",
			objetivo: "Contar a história.",
			profundidade: "media",
			// @ts-expect-error — "achar-o-trofeu" não é missão do aprendiz
			conteudoPrioritario: ["achar-o-trofeu"],
		},
	],
});

// Canal é do vocabulário da instância: o de outra instância não serve.
crianca({
	...briefDeCrianca,
	// @ts-expect-error — "celular_no_intervalo" é canal de outra instância
	canais: [{ canal: "celular_no_intervalo", profundidade: "minima" }],
});

crianca({
	...briefDeCrianca,
	renderizacoes: [
		{
			// @ts-expect-error — canal fora do vocabulário
			tipo: "outdoor",
			prioridade: "baixa",
			objetivo: "Não existe.",
			profundidade: "minima",
			conteudoPrioritario: [],
		},
	],
});

// Idioma também: esta instância só publica em português.
crianca({
	...briefDeCrianca,
	renderizacoes: [
		{
			tipo: "tela_da_sala",
			prioridade: "critica",
			objetivo: "Contar a história.",
			profundidade: "media",
			conteudoPrioritario: [],
			// @ts-expect-error — "en" não é idioma desta instância
			idiomas: ["en"],
		},
	],
});

// Linha e faixa são do vocabulário da instância.
crianca({
	...briefDeCrianca,
	// @ts-expect-error — linha de outra instância
	linha: "primeiros_socorros",
});

crianca({
	...briefDeCrianca,
	publico: {
		...briefDeCrianca.publico,
		// @ts-expect-error — faixa que a instância não declarou
		faixa: "nove_a_doze",
	},
});

// Quem não tem faixas no vocabulário não situa ninguém numa faixa.
adulto({
	...briefDeAdulto,
	publico: {
		...briefDeAdulto.publico,
		// @ts-expect-error — esta instância não trabalha com faixas
		faixa: "adulto",
	},
});

// Se outra pessoa decide, ela precisa existir.
crianca({
	...briefDeCrianca,
	publico: {
		...briefDeCrianca.publico,
		// @ts-expect-error — outra pessoa decide, e não há ninguém
		quemDecide: { tipo: "outra_pessoa", decisores: [] },
	},
});

// Objetivo observável só sobre efeito comportamental que a instância tem.
adulto({
	...briefDeAdulto,
	objetivosObservaveis: [
		{
			// @ts-expect-error — efeito de outra instância
			efeito: "convidar_para_jogar_de_novo",
			comportamento: "Chamar para mais uma partida",
		},
	],
});

// Efeito emocional não entra como comportamental: não é observável.
adulto({
	...briefDeAdulto,
	intencoes: [
		{
			tipo: "habito",
			percepcaoCentral: "O socorro é quem está perto.",
			efeitosDesejados: {
				cognitivos: ["aplicar"],
				emocionais: ["sentir_seguranca"],
				// @ts-expect-error — "sentir_seguranca" é efeito emocional
				comportamentais: ["sentir_seguranca"],
			},
		},
	],
});

// O literal da especialização mudou de nome junto com o pacote.
adulto({
	...briefDeAdulto,
	// @ts-expect-error — a especialização se chama "educate"
	produto: { nome: "PRISMA Intent", especializacao: "educar" },
});
