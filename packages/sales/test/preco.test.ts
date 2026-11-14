/**
 * Testes de valor da função de preço.
 *
 * Os casos de 2.323 horas e US$ 186.000 são números de uma proposta real,
 * usados aqui só como números: são o critério de aceite do modelo de preço.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import type {
	Arredondamento,
	Dinheiro,
	LinhaSimples,
	PrecoEmMoeda,
	TaxaPorHora,
} from "../src/index.ts";
import { calcularPreco, ErroDePreco } from "../src/index.ts";
import { propostaDeExemplo } from "./exemplo.ts";

const usd = (centavos: number): Dinheiro<"USD"> => ({ centavos, moeda: "USD" });
const nenhum: Arredondamento<"USD"> = { tipo: "nenhum" };
const porHora = (centavos: number): TaxaPorHora<"USD"> => ({
	forma: "por_hora",
	valor: usd(centavos),
});
const implementacao = (horas: number): LinhaSimples<string, "USD"> => ({
	natureza: "implementacao",
	descricao: "Implementação",
	categoria: "Implementação",
	horas,
});

type Ajustes = Partial<
	Omit<PrecoEmMoeda<"USD", string>, "moeda" | "taxaPorHora">
> & { taxa?: TaxaPorHora<"USD"> };

/** Um preço válido em dólar, com o que o teste quiser trocar. */
function preco({
	taxa = porHora(10_000),
	...ajustes
}: Ajustes = {}): PrecoEmMoeda<"USD", string> {
	return {
		moeda: "USD",
		taxaPorHora: {
			estado: "confirmada",
			valor: taxa,
			decisao: { pessoa: "Pessoa", data: "2026-01-01", registro: "Teste." },
		},
		arredondamento: { custoUnico: nenhum, recorrente: nenhum },
		linhas: [implementacao(1)],
		horizontesDoTcoEmAnos: [3, 5],
		marcosDePagamento: [{ marco: "aceite", percentual: 100 }],
		premissas: [],
		...ajustes,
	};
}

// ── O caso conhecido ──────────────────────────────────────────────────────

test("2.323 horas à taxa implícita de 186.000 ÷ 2.323 dão exatamente US$ 186.000,00", () => {
	const resultado = calcularPreco(
		preco({
			taxa: { forma: "razao", valor: usd(18_600_000), porHoras: 2_323 },
			linhas: [implementacao(2_323)],
		}),
	);
	assert.deepEqual(resultado.custoUnico, {
		calculado: usd(18_600_000),
		ajuste: usd(0),
		total: usd(18_600_000),
	});
	assert.deepEqual(resultado.linhas[0]?.valor, usd(18_600_000));
});

test("a mesma taxa arredondada antes (80,07) dá US$ 186.002,61 sem arredondamento", () => {
	const resultado = calcularPreco(
		preco({ taxa: porHora(8_007), linhas: [implementacao(2_323)] }),
	);
	assert.deepEqual(resultado.custoUnico.total, usd(18_600_261));
	assert.deepEqual(resultado.custoUnico.ajuste, usd(0));
});

test("…e US$ 186.000 com arredondamento a múltiplo de 1.000, com o ajuste explícito", () => {
	const multiploDeMil = (
		sentido: "mais_proximo" | "para_cima" | "para_baixo",
	): Arredondamento<"USD"> => ({ tipo: "multiplo", de: usd(100_000), sentido });
	const comArredondamento = (regra: Arredondamento<"USD">) =>
		calcularPreco(
			preco({
				taxa: porHora(8_007),
				linhas: [implementacao(2_323)],
				arredondamento: { custoUnico: regra, recorrente: nenhum },
			}),
		).custoUnico;

	assert.deepEqual(comArredondamento(multiploDeMil("mais_proximo")), {
		calculado: usd(18_600_261),
		ajuste: usd(-261),
		total: usd(18_600_000),
	});
	assert.deepEqual(
		comArredondamento(multiploDeMil("para_cima")).total,
		usd(18_700_000),
	);
	assert.deepEqual(
		comArredondamento(multiploDeMil("para_baixo")).total,
		usd(18_600_000),
	);
});

test("arredondar a taxa em vez de declarar a razão acumularia erro em cada hora", () => {
	// 100,00 ÷ 3 por hora: a razão leva cada linha ao centavo uma vez, a partir
	// do valor exato; a taxa arredondada (33,33) erraria 1 centavo a cada 3 horas.
	const terco: TaxaPorHora<"USD"> = {
		forma: "razao",
		valor: usd(10_000),
		porHoras: 3,
	};
	const valorDe = (horas: number) =>
		calcularPreco(preco({ taxa: terco, linhas: [implementacao(horas)] }))
			.custoUnico.total.centavos;
	assert.equal(valorDe(1), 3_333);
	assert.equal(valorDe(2), 6_667);
	assert.equal(valorDe(3), 10_000);
	assert.equal(valorDe(3_000), 10_000_000);
	assert.equal(
		calcularPreco(
			preco({ taxa: porHora(3_333), linhas: [implementacao(3_000)] }),
		).custoUnico.total.centavos,
		9_999_000,
	);
});

// ── Contingência ──────────────────────────────────────────────────────────

test("a contingência é linha própria, calculada só sobre as linhas de implementação", () => {
	const resultado = calcularPreco(
		preco({
			linhas: [
				implementacao(1_000),
				{ ...implementacao(500), categoria: "Integrações" },
				{
					natureza: "contingencia",
					descricao: "Contingência",
					categoria: "Implementação",
					percentual: 20,
				},
				{
					natureza: "viagem",
					descricao: "Viagens",
					categoria: "Viagens",
					valor: usd(1_000_000),
				},
			],
		}),
	);
	assert.deepEqual(resultado.implementacao, usd(15_000_000));
	assert.deepEqual(resultado.contingencia, usd(3_000_000));
	assert.deepEqual(resultado.linhas[2], {
		natureza: "contingencia",
		descricao: "Contingência",
		categoria: "Implementação",
		periodicidade: "unica",
		valor: usd(3_000_000),
	});
	// 150.000 + 30.000 de contingência + 10.000 de viagens (fora da base).
	assert.deepEqual(resultado.custoUnico.total, usd(19_000_000));
});

test("contingência fracionária vai ao centavo uma vez, meio centavo para cima", () => {
	const contingencia = (percentual: number, centavosPorHora: number) =>
		calcularPreco(
			preco({
				taxa: porHora(centavosPorHora),
				linhas: [
					implementacao(1),
					{
						natureza: "contingencia",
						descricao: "Contingência",
						categoria: "Implementação",
						percentual,
					},
				],
			}),
		).contingencia.centavos;
	assert.equal(contingencia(10, 25), 3); // 2,5 centavos
	assert.equal(contingencia(7.5, 3_333), 250); // 249,975 centavos
	assert.equal(contingencia(10, 3_333), 333); // 333,3 centavos
});

// ── Recorrentes e TCO ─────────────────────────────────────────────────────

test("TCO de N anos = custo único + N × 12 meses de cada recorrente (3 e 5 anos)", () => {
	const resultado = calcularPreco(
		preco({
			linhas: [
				implementacao(1_000), // 100.000,00 de custo único
				{
					natureza: "sustentacao",
					descricao: "Sustentação",
					categoria: "Sustentação",
					horasPorMes: 80, // 8.000,00 por mês
					meses: 36,
				},
				{
					natureza: "licenca",
					descricao: "Banco de dados",
					categoria: "Licenças",
					item: "Banco de dados",
					recorrencia: "mensal",
					valor: usd(50_000), // 500,00 por mês
				},
				{
					natureza: "licenca",
					descricao: "Monitoramento",
					categoria: "Licenças",
					item: "Monitoramento",
					recorrencia: "anual",
					valor: usd(120_000), // 1.200,00 por ano
				},
				{
					natureza: "licenca",
					descricao: "Implantação da licença",
					categoria: "Licenças",
					item: "Implantação",
					recorrencia: "unica",
					valor: usd(200_000), // 2.000,00 uma vez
				},
			],
		}),
	);
	assert.deepEqual(resultado.custoUnico.total, usd(10_200_000));
	assert.deepEqual(resultado.recorrenteMensal.total, usd(850_000));
	assert.deepEqual(resultado.recorrenteAnual.total, usd(120_000));
	// 12 × 8.500,00 + 1.200,00
	assert.deepEqual(resultado.recorrenteEmUmAno, usd(10_320_000));
	assert.deepEqual(resultado.tco, [
		{ anos: 3, total: usd(10_200_000 + 3 * 10_320_000) },
		{ anos: 5, total: usd(10_200_000 + 5 * 10_320_000) },
	]);
	assert.equal(resultado.tco[0].total.centavos, 41_160_000);
	assert.equal(resultado.tco[1]?.total.centavos, 61_800_000);
});

test("o arredondamento do recorrente é declarado à parte do custo único", () => {
	const resultado = calcularPreco(
		preco({
			linhas: [
				implementacao(2_323),
				{
					natureza: "sustentacao",
					descricao: "Sustentação",
					categoria: "Sustentação",
					horasPorMes: 85.5, // 8.550,00 por mês
					meses: 12,
				},
			],
			arredondamento: {
				custoUnico: {
					tipo: "multiplo",
					de: usd(100_000),
					sentido: "para_cima",
				},
				recorrente: {
					tipo: "multiplo",
					de: usd(10_000),
					sentido: "para_baixo",
				},
			},
		}),
	);
	assert.deepEqual(resultado.custoUnico.total, usd(23_300_000));
	assert.deepEqual(resultado.recorrenteMensal, {
		calculado: usd(855_000),
		ajuste: usd(-5_000),
		total: usd(850_000),
	});
	assert.deepEqual(resultado.tco[0].total, usd(23_300_000 + 36 * 850_000));
});

// ── Opcionais e categorias ────────────────────────────────────────────────

test("opcionais ficam fora do preço base, com os próprios totais e contingência", () => {
	const resultado = calcularPreco(
		preco({
			linhas: [
				implementacao(100),
				{
					natureza: "opcional",
					descricao: "Aplicativo móvel",
					categoria: "Opcionais",
					item: "Aplicativo móvel",
					linhas: [
						{ ...implementacao(200), categoria: "Opcionais" },
						{
							natureza: "contingencia",
							descricao: "Contingência do aplicativo",
							categoria: "Opcionais",
							percentual: 10,
						},
					],
				},
			],
		}),
	);
	assert.deepEqual(resultado.custoUnico.total, usd(1_000_000));
	assert.equal(resultado.linhas.length, 1);
	const [aplicativo] = resultado.opcionais;
	assert.ok(aplicativo);
	assert.equal(aplicativo.item, "Aplicativo móvel");
	assert.deepEqual(aplicativo.implementacao, usd(2_000_000));
	assert.deepEqual(aplicativo.contingencia, usd(200_000));
	assert.deepEqual(aplicativo.custoUnico.total, usd(2_200_000));
	assert.deepEqual(aplicativo.tco[1]?.total, usd(2_200_000));
	// O fluxo de pagamento é do preço base.
	assert.deepEqual(resultado.pagamentos[0].valor, usd(1_000_000));
});

test("os subtotais por categoria somam o custo calculado", () => {
	const resultado = calcularPreco(propostaDeExemplo.preco);
	const somaDosSubtotais = resultado.subtotaisPorCategoria.reduce(
		(total, subtotal) => total + subtotal.unico.centavos,
		0,
	);
	assert.equal(somaDosSubtotais, resultado.custoUnico.calculado.centavos);
	assert.deepEqual(
		resultado.subtotaisPorCategoria.map((subtotal) => subtotal.categoria),
		["Implementação", "Licenças", "Sustentação"],
	);
});

// ── Marcos de pagamento ───────────────────────────────────────────────────

test("as parcelas por marco somam exatamente o custo único", () => {
	const parcelas = calcularPreco(
		preco({
			linhas: [implementacao(1)], // 100,00
			marcosDePagamento: [
				{ marco: "inicio", percentual: 33.33 },
				{ marco: "meio", percentual: 33.33 },
				{ marco: "fim", percentual: 33.34 },
			],
		}),
	).pagamentos;
	assert.deepEqual(
		parcelas.map((parcela) => parcela.valor.centavos),
		[3_333, 3_333, 3_334],
	);

	const umCentavo = calcularPreco(
		preco({
			taxa: porHora(100),
			linhas: [implementacao(0.01)], // 0,01 h × 1,00 = 1 centavo
			marcosDePagamento: [
				{ marco: "a", percentual: 50 },
				{ marco: "b", percentual: 50 },
			],
		}),
	).pagamentos;
	// O centavo que sobra vai à primeira parcela de maior resto.
	assert.deepEqual(
		umCentavo.map((parcela) => parcela.valor.centavos),
		[1, 0],
	);
});

test("marcos que não somam 100% são recusados com erro explícito", () => {
	assert.throws(
		() =>
			calcularPreco(
				preco({
					marcosDePagamento: [
						{ marco: "aceite", percentual: 60 },
						{ marco: "final", percentual: 30 },
					],
				}),
			),
		(erro) =>
			erro instanceof ErroDePreco && /somam 90%, não 100%/.test(erro.message),
	);
	assert.throws(
		() =>
			calcularPreco(
				preco({
					marcosDePagamento: [
						{ marco: "aceite", percentual: 60 },
						{ marco: "final", percentual: 50 },
					],
				}),
			),
		/somam 110%/,
	);
	assert.throws(
		() =>
			calcularPreco(
				preco({
					marcosDePagamento: [
						{ marco: "aceite", percentual: 50 },
						{ marco: "aceite", percentual: 50 },
					],
				}),
			),
		/repetido/,
	);
	assert.throws(
		() =>
			calcularPreco(
				preco({
					marcosDePagamento: [
						{ marco: "aceite", percentual: 100 },
						{ marco: "garantia", percentual: 0 },
					],
				}),
			),
		/0%/,
	);
});

// ── Entrada recusada em vez de arredondada em silêncio ────────────────────

test("entrada que esconderia arredondamento é recusada", () => {
	const recusa = (ajustes: Ajustes, mensagem: RegExp) =>
		assert.throws(
			() => calcularPreco(preco(ajustes)),
			(erro) => {
				assert.ok(erro instanceof ErroDePreco);
				assert.match(erro.message, mensagem);
				return true;
			},
		);
	recusa({ taxa: porHora(80.07) }, /inteiro e não negativo de centavos/);
	recusa({ linhas: [implementacao(1.005)] }, /mais de duas casas decimais/);
	recusa({ linhas: [implementacao(-1)] }, /não negativo/);
	recusa(
		{ taxa: { forma: "razao", valor: usd(100), porHoras: 0 } },
		/zero horas/,
	);
	recusa({ horizontesDoTcoEmAnos: [2.5] }, /Horizonte de TCO inválido/);
	recusa(
		{
			linhas: [
				{
					natureza: "viagem",
					descricao: "Viagens",
					categoria: "Viagens",
					valor: { centavos: 100, moeda: "BRL" } as unknown as Dinheiro<"USD">,
				},
			],
		},
		/em BRL numa proposta em USD/,
	);
	recusa(
		{
			arredondamento: {
				custoUnico: { tipo: "multiplo", de: usd(0), sentido: "mais_proximo" },
				recorrente: nenhum,
			},
		},
		/não pode ser zero/,
	);
	recusa(
		{ taxa: porHora(Number.MAX_SAFE_INTEGER), linhas: [implementacao(10)] },
		/fora do intervalo exato/,
	);
});

// ── Situação e a instância de exemplo ─────────────────────────────────────

test("premissa a confirmar faz do preço um rascunho", () => {
	assert.deepEqual(calcularPreco(preco()).situacao, { estado: "confirmado" });
	assert.deepEqual(
		calcularPreco({
			...preco(),
			taxaPorHora: { estado: "a_confirmar", valorDeTrabalho: porHora(8_000) },
			premissas: [
				{
					descricao: "Câmbio",
					premissa: {
						estado: "confirmada",
						valor: 5,
						decisao: {
							pessoa: "Pessoa",
							data: "2026-01-01",
							registro: "Teste.",
						},
					},
				},
				{
					descricao: "160 horas por pessoa-mês",
					premissa: { estado: "a_confirmar", valorDeTrabalho: 160 },
				},
			],
		}).situacao,
		{
			estado: "rascunho",
			taxaAConfirmar: true,
			premissasAConfirmar: ["160 horas por pessoa-mês"],
		},
	);
});

test("a instância de exemplo calcula de ponta a ponta", () => {
	const resultado = calcularPreco(propostaDeExemplo.preco);
	// 440 h × 100,00 = 44.000,00; contingência de 10% = 4.400,00; viagens 5.000,00.
	assert.deepEqual(resultado.custoUnico.calculado, usd(5_340_000));
	// Arredondado ao múltiplo de 1.000 mais próximo.
	assert.deepEqual(resultado.custoUnico.total, usd(5_300_000));
	// Sustentação 80 h × 100,00 + licença de 500,00 por mês.
	assert.deepEqual(resultado.recorrenteMensal.total, usd(850_000));
	assert.deepEqual(
		resultado.pagamentos.map((parcela) => [
			parcela.marco,
			parcela.valor.centavos,
		]),
		[
			["aceite_da_plataforma", 3_180_000],
			["aceite_final", 2_120_000],
		],
	);
	// O opcional segue a mesma regra de custo único: 50.400,00 → 50.000,00.
	assert.deepEqual(resultado.opcionais[0]?.custoUnico, {
		calculado: usd(5_040_000),
		ajuste: usd(-40_000),
		total: usd(5_000_000),
	});
	assert.equal(resultado.situacao.estado, "rascunho");
});
