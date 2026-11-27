/**
 * Regras de integridade do domínio, no formato do core.
 *
 * As que têm forma textual ganham `padroesVedados` e são conferidas por
 * `verificarRegras` sobre cada renderização pública. As estruturais
 * (`render_nao_e_prova`, `promessa_so_com_prova`) não se conferem por texto: é
 * `verificarCampanha` quem as confere sobre o modelo. As demais são editoriais.
 *
 * Os padrões estão em português; saída em inglês não é coberta.
 */
import type { RegraDeIntegridade } from "@prisma-intent/core";

export type IdDaRegraDoDominio =
	| "financiamento_nao_e_compra"
	| "escassez_verdadeira"
	| "impacto_sem_exagero"
	| "render_nao_e_prova"
	| "promessa_so_com_prova"
	| "numeros_com_procedencia"
	| "estagio_e_limitacoes_declarados";

export const regrasDoDominio: readonly RegraDeIntegridade<IdDaRegraDoDominio>[] =
	[
		{
			id: "financiamento_nao_e_compra",
			natureza: "restricao_de_divulgacao",
			regra:
				"Apoiar é financiar uma execução que pode falhar, não comprar um item em estoque; a saída não promete entrega garantida nem usa linguagem de loja.",
			padroesVedados: [
				"entrega\\s+garantida",
				"garantimos\\s+a\\s+entrega",
				"pronta\\s+entrega",
				"em\\s+estoque",
				"compre\\s+(j[áa]|agora)",
			],
		},
		{
			id: "escassez_verdadeira",
			natureza: "restricao_de_divulgacao",
			regra:
				"Limite de unidades só quando reflete estoque ou capacidade reais, e dito com o motivo; sem frase de pressão.",
			padroesVedados: [
				"[úu]ltimas\\s+unidades",
				"s[óo]\\s+hoje",
				"antes\\s+que\\s+acabe",
				"corra\\b",
				"n[ãa]o\\s+perca\\s+tempo",
			],
		},
		{
			id: "impacto_sem_exagero",
			natureza: "restricao_de_divulgacao",
			regra:
				"O impacto ambiental é dito em números de reaproveitamento, nunca em absolutos que ninguém mede.",
			padroesVedados: [
				"100\\s*%\\s*sustent[áa]vel",
				"lixo\\s+zero",
				"salv(a|ar|e)\\s+o\\s+planeta",
				"impacto\\s+zero",
				"carbono\\s+neutro",
			],
		},
		{
			id: "render_nao_e_prova",
			natureza: "fato_invariavel",
			regra:
				"Recurso de natureza `conceito` não sustenta afirmação sobre o produto e não carrega intenção em canal público; as plataformas de financiamento proíbem renderização apresentada como produto.",
		},
		{
			id: "promessa_so_com_prova",
			natureza: "fato_invariavel",
			regra:
				"Argumento sem evidência não entra em renderização pública: promessa a provar fica no dossiê, não na página.",
		},
		{
			id: "numeros_com_procedencia",
			natureza: "fato_invariavel",
			regra:
				"Custo, prazo, meta e medição publicados têm procedência; valor ilustrativo nunca sai como previsão.",
		},
		{
			id: "estagio_e_limitacoes_declarados",
			natureza: "fato_invariavel",
			regra:
				"A página diz em que estágio o produto está e o que o protótipo ainda não faz: funcionalidades reais demonstradas e limitações comunicadas.",
		},
	];
