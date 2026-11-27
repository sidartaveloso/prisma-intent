/**
 * Testes de tipo do preço: taxa, arredondamento e resultado.
 *
 * Os estados ilegais das linhas (implementação sem horas, contingência sem
 * percentual, valor digitado na implementação) estão em
 * `estados-ilegais.tipos.ts`. Como lá, um erro que some faz o `tsc` acusar a
 * diretiva sem uso.
 */
import type {
	Arredondamento,
	ConteudoRenderizavel,
	Dinheiro,
	LinhaDePreco,
	PrecoCalculado,
	PrecoDaProposta,
	PrecoEmMoeda,
	RegrasDeArredondamento,
	TaxaPorHora,
} from "../src/index.ts";
import { calcularPreco } from "../src/index.ts";
import { propostaDeExemplo } from "./exemplo.ts";

declare const precoEmDolar: PrecoEmMoeda<"USD", "aceite">;

// ── Taxa: por hora ou razão, e nada entre os dois ─────────────────────────

const _taxaRedonda: TaxaPorHora<"USD"> = {
	forma: "por_hora",
	valor: { centavos: 8_007, moeda: "USD" },
};

const _taxaImplicita: TaxaPorHora<"USD"> = {
	forma: "razao",
	valor: { centavos: 18_600_000, moeda: "USD" },
	porHoras: 2_323,
};

// @ts-expect-error — razão sem as horas a que o valor corresponde
const _razaoSemHoras: TaxaPorHora<"USD"> = {
	forma: "razao",
	valor: { centavos: 18_600_000, moeda: "USD" },
};

const _porHoraComHoras: TaxaPorHora<"USD"> = {
	forma: "por_hora",
	valor: { centavos: 8_000, moeda: "USD" },
	// @ts-expect-error — taxa por hora não tem divisor
	porHoras: 2,
};

const _taxaEmOutraMoeda: TaxaPorHora<"USD"> = {
	forma: "por_hora",
	// @ts-expect-error — taxa em real numa proposta em dólar
	valor: { centavos: 8_000, moeda: "BRL" },
};

// @ts-expect-error — a taxa não é mais um `Dinheiro` solto: declara a forma
const _taxaSemForma: TaxaPorHora<"USD"> = { centavos: 8_000, moeda: "USD" };

// ── Arredondamento: explícito, nunca campo opcional solto ─────────────────

// @ts-expect-error — múltiplo sem o valor do múltiplo
const _multiploSemValor: Arredondamento<"USD"> = {
	tipo: "multiplo",
	sentido: "mais_proximo",
};

// @ts-expect-error — múltiplo sem o sentido
const _multiploSemSentido: Arredondamento<"USD"> = {
	tipo: "multiplo",
	de: { centavos: 100_000, moeda: "USD" },
};

const _nenhumComMultiplo: Arredondamento<"USD"> = {
	tipo: "nenhum",
	// @ts-expect-error — `nenhum` não tem múltiplo
	de: { centavos: 100_000, moeda: "USD" },
};

const _sentidoInventado: Arredondamento<"USD"> = {
	tipo: "multiplo",
	de: { centavos: 100_000, moeda: "USD" },
	// @ts-expect-error — sentido fora do vocabulário
	sentido: "bancario",
};

// @ts-expect-error — custo único e recorrente são declarados, os dois
const _soOCustoUnico: RegrasDeArredondamento<"USD"> = {
	custoUnico: { tipo: "nenhum" },
};

// ── O preço da proposta ───────────────────────────────────────────────────

// @ts-expect-error — preço sem regra de arredondamento
const _precoSemArredondamento: PrecoDaProposta = {
	moeda: "USD",
	taxaPorHora: {
		estado: "a_confirmar",
		valorDeTrabalho: {
			forma: "por_hora",
			valor: { centavos: 8_000, moeda: "USD" },
		},
	},
	linhas: [
		{
			natureza: "implementacao",
			descricao: "Plataforma",
			categoria: "Implementação",
			horas: 100,
		},
	],
	horizontesDoTcoEmAnos: [3, 5],
	marcosDePagamento: [{ marco: "aceite", percentual: 100 }],
	premissas: [],
};

// @ts-expect-error — múltiplo de arredondamento em real numa proposta em dólar
const _arredondamentoEmOutraMoeda: PrecoDaProposta = {
	...precoEmDolar,
	arredondamento: {
		custoUnico: {
			tipo: "multiplo",
			de: { centavos: 100_000, moeda: "BRL" },
			sentido: "mais_proximo",
		},
		recorrente: { tipo: "nenhum" },
	},
};

const _implementacaoComTaxaPropria: LinhaDePreco = {
	natureza: "implementacao",
	descricao: "Plataforma",
	categoria: "Implementação",
	horas: 100,
	// @ts-expect-error — a taxa é a da proposta, não da linha (D3)
	taxa: { centavos: 9_000, moeda: "USD" },
};

// ── O resultado guarda a moeda e os marcos da proposta ───────────────────

const resultadoEmDolar = calcularPreco(precoEmDolar);
const _totalEmDolar: Dinheiro<"USD"> = resultadoEmDolar.custoUnico.total;
// @ts-expect-error — o total de uma proposta em dólar não é real
const _totalEmReal: Dinheiro<"BRL"> = resultadoEmDolar.custoUnico.total;

const resultadoDaInstancia = calcularPreco(propostaDeExemplo.preco);
const _marcoDeclarado: "aceite_da_plataforma" | "aceite_final" =
	resultadoDaInstancia.pagamentos[0].marco;
// @ts-expect-error — a parcela só cita marcos do cronograma
const _marcoInventado: "assinatura" = resultadoDaInstancia.pagamentos[0].marco;

// ── O resultado vai à planilha: é conteúdo renderizável ───────────────────

type Verdadeiro<T extends true> = T;
type _PrecoCalculado = Verdadeiro<
	PrecoCalculado extends ConteudoRenderizavel ? true : false
>;
