/**
 * Regras de integridade do domínio, no formato do core.
 *
 * O core só verifica por texto as naturezas que carregam `padroesVedados`
 * (`restricao_de_divulgacao` e `restricao_de_competencia`); as demais são
 * orientação editorial. Aqui, as regras que têm forma textual ganham padrão;
 * as que dependem de julgamento ficam declaradas para quem escreve a saída.
 *
 * As regras da casa — o que esta família, esta turma ou este aprendiz não quer
 * que apareça — são de instância e se somam a estas. Regra que só vale para um
 * canal ou para uma faixa também é de instância: o pacote não conhece nenhum
 * dos dois.
 */
import type { RegraDeIntegridade } from "@prisma-intent/core";

export type IdDaRegraDoDominio =
	| "sem_telemetria_na_saida"
	| "moral_nao_declarada"
	| "narracao_fiel_ao_texto"
	| "fatos_nao_se_adaptam"
	| "acao_observavel_em_cena"
	| "sem_autoplay_nem_recompensa_por_tempo"
	| "sem_perfilamento_nem_publicidade";

export const regrasDoDominio: readonly RegraDeIntegridade<IdDaRegraDoDominio>[] =
	[
		{
			id: "sem_telemetria_na_saida",
			natureza: "restricao_de_divulgacao",
			regra:
				"Nenhuma renderização a quem decide, a quem acompanha ou à instituição traz minutos assistidos, contagem de cliques ou sequência de telas; o acompanhamento diz o que o aprendiz viveu e o que fez depois.",
			padroesVedados: [
				"\\d+\\s*minutos?\\s+(assist|de\\s+tela|de\\s+uso|na\\s+tela)",
				"\\d+\\s*cliques?",
				"tempo\\s+de\\s+tela\\s*:\\s*\\d",
			],
		},
		{
			id: "moral_nao_declarada",
			natureza: "restricao_de_divulgacao",
			regra:
				"A história não declara a moral; a conclusão é formada pelo aprendiz (Ghiggi et al. 2018 sobre o pedagogismo). Fórmulas de moral explícita não aparecem na narração.",
			padroesVedados: [
				"a\\s+moral\\s+(da|dessa|desta)\\s+hist[óo]ria",
				"a\\s+li[çc][ãa]o\\s+(que\\s+fica|[ée])\\b",
				"aprendemos\\s+que",
				"e\\s+assim\\s+voc[êe]\\s+aprende",
			],
		},
		{
			id: "narracao_fiel_ao_texto",
			natureza: "fato_invariavel",
			regra:
				"A legenda é o texto aprovado da história; não se inventa diálogo nem se 'melhora' a narração. Mudança de texto exige nova aprovação e nova narração.",
		},
		{
			id: "fatos_nao_se_adaptam",
			natureza: "fato_invariavel",
			regra:
				"O nome do aprendiz, o que ele estuda e o que aconteceu não se alteram para caber na história; a narrativa se adapta ao contexto, os fatos não.",
		},
		{
			id: "acao_observavel_em_cena",
			natureza: "fato_invariavel",
			regra:
				"Toda ação que o texto conta e dá para ver acontece na tela; cena sem ação observável é erro de produção.",
		},
		{
			id: "sem_autoplay_nem_recompensa_por_tempo",
			natureza: "fato_invariavel",
			regra:
				"Nada avança sozinho nem insiste por mais uso sem que o aprendiz, ou quem decide por ele, tenha escolhido; não há recompensa por tempo de uso. Para crianças e adolescentes é também exigência legal (Lei 15.211/2025, art. 17 §4º).",
		},
		{
			id: "sem_perfilamento_nem_publicidade",
			natureza: "restricao_de_divulgacao",
			regra:
				"Nenhum dado do aprendiz serve a segmentação mercadológica; nenhuma publicidade dirigida a ele dentro da experiência. Para crianças e adolescentes é também exigência legal (Lei 15.211/2025, arts. 22 e 26).",
			padroesVedados: [
				"patrocinad[oa]\\s+por",
				"oferta\\s+especial",
				"compre\\s+agora",
			],
		},
	];
