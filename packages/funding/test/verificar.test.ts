import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	type Campanha,
	coberturaDeEvidencia,
	definirDossie,
	verificarCampanha,
	verificarDossie,
	verificarTexto,
} from "../src/index.ts";
import { exemplo } from "./exemplo.ts";

const com = (mudanca: Partial<Campanha>): Campanha => ({
	...exemplo,
	...mudanca,
});

function primeira<T>(itens: readonly T[]): T {
	const [item] = itens;
	if (item === undefined) throw new Error("lista vazia");
	return item;
}

describe("verificarCampanha", () => {
	it("campanha coerente só bloqueia pela plataforma a confirmar", () => {
		const c = verificarCampanha(exemplo);
		assert.deepEqual(c.erros, []);
		assert.deepEqual(c.bloqueios, ["plataforma de financiamento a confirmar"]);
	});

	it("renderização de conceito não serve de demonstração", () => {
		const c = verificarCampanha(
			com({
				evidencias: [
					{
						id: "anda",
						nivel: "documentada",
						tipo: "demonstracao",
						recurso: "render",
						mostra: "o carrinho",
					},
				],
			}),
		);
		assert.match(c.erros[0] ?? "", /render_nao_e_prova/);
	});

	it("promessa sem prova não vai a canal público", () => {
		const c = verificarCampanha(
			com({
				renderizacoes: [
					{
						...primeira(exemplo.renderizacoes),
						conteudoPrioritario: ["funciona", "voz", "e-render"],
					},
				],
			}),
		);
		assert.ok(
			c.bloqueios.includes(
				'argumento "voz" está em canal público sem evidência (promessa_so_com_prova)',
			),
		);
	});

	it("conceito não carrega intenção pública", () => {
		const c = verificarCampanha(
			com({
				intencoes: [
					{
						...primeira(exemplo.intencoes),
						recursos: [{ recurso: "render", papel: "carrega" }],
					},
				],
			}),
		);
		assert.ok(c.bloqueios.some((b) => b.includes("render_nao_e_prova")));
	});

	it("marcar pronta com bloqueio é erro", () => {
		const c = verificarCampanha(com({ estado: "pronta_para_publicar" }));
		assert.equal(c.erros.length, 1);
	});

	it("objeção em canal público sem resposta redigida bloqueia", () => {
		const c = verificarCampanha(
			com({
				respostasAoLeitor: [
					{ objecao: "e-render", texto: { estado: "a_confirmar" } },
				],
			}),
		);
		assert.ok(
			c.bloqueios.includes(
				'objeção "e-render" sem resposta redigida ao leitor',
			),
		);
	});

	it("meta a confirmar bloqueia a publicação", () => {
		const c = verificarCampanha(
			com({
				observacaoDosEfeitos: {
					apoia_a_campanha: {
						por: "plataforma",
						metrica: "apoios_confirmados",
						meta: {
							estado: "a_confirmar",
							valorDeTrabalho: { valor: 100, unidade: "apoiadores" },
						},
					},
				},
			}),
		);
		assert.ok(
			c.bloqueios.includes('efeito "apoia_a_campanha": meta a confirmar'),
		);
	});

	it("efeito sem observação é erro em execução (o tipo concreto já o recusa)", () => {
		const c = verificarCampanha(com({ observacaoDosEfeitos: {} }));
		assert.ok(
			c.erros.includes('efeito "apoia_a_campanha" sem observação declarada'),
		);
	});

	it("objeção crítica precisa aparecer em canal público", () => {
		const c = verificarCampanha(
			com({
				renderizacoes: [
					{
						...primeira(exemplo.renderizacoes),
						conteudoPrioritario: ["funciona"],
					},
				],
			}),
		);
		assert.ok(c.bloqueios.some((b) => b.includes('"e-render"')));
	});
});

describe("verificarTexto", () => {
	it("barra linguagem de compra, pressão e exagero ambiental", () => {
		const texto = "Entrega garantida! Últimas unidades, 100% sustentável.";
		assert.equal(verificarTexto(texto, exemplo).length, 3);
	});

	it("deixa passar texto honesto", () => {
		assert.deepEqual(
			verificarTexto(
				"Apoiar financia a produção do primeiro lote; se a meta não for atingida, ninguém é cobrado.",
				exemplo,
			),
			[],
		);
	});
});

describe("verificarDossie", () => {
	const dossie = definirDossie({
		etapa: "descoberta",
		proxima: "triagem",
		intencao: {
			tipo: "decidir_etapa",
			percepcaoCentral: "decidir por evidência",
			efeitosDesejados: {
				cognitivos: ["avalia_a_evidencia"],
				emocionais: [],
				comportamentais: ["registra_a_decisao"],
			},
			recursos: [],
		},
		perguntas: [
			{
				id: "oferta",
				prioridade: "critica",
				tese: "há oferta",
				evidencias: [],
			},
		],
		evidencias: [],
		lacunas: [],
		decisao: { estado: "pendente" },
	});

	it("pendente com pergunta sem prova é bloqueio, não erro", () => {
		const c = verificarDossie(dossie, []);
		assert.deepEqual(c.erros, []);
		assert.deepEqual(c.bloqueios, ['pergunta "oferta" sem evidência']);
	});

	it("avançar sem prova é erro", () => {
		const c = verificarDossie(
			{
				...dossie,
				decisao: {
					estado: "avanca",
					decisao: { pessoa: "autor", data: "2026-11-01", registro: "ata" },
					motivo: "gostei",
				},
			},
			[],
		);
		assert.match(c.erros[0] ?? "", /sem evidência/);
	});
});

describe("coberturaDeEvidencia", () => {
	it("conta só argumentos de prioridade alta", () => {
		assert.equal(coberturaDeEvidencia(exemplo.argumentos), 0.5);
	});
});
