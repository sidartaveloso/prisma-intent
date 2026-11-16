/**
 * Tipos de preço: dinheiro, taxa, arredondamento, linhas de preço e o preço
 * da proposta.
 *
 * **O preço é calculado, nunca escrito.** A instância declara as linhas, a
 * taxa, o arredondamento e as premissas; `calcularPreco` (`preco.ts`) devolve
 * totais, TCO e fluxo por marco. Por isso nenhuma linha carrega um total
 * digitado: a de implementação tem horas, e a taxa é parâmetro da proposta.
 *
 * Valores monetários de entrada que não são esforço — licenças, viagens —
 * existem como `Dinheiro`, porque são custo de terceiro ou estimativa de
 * despesa, não preço do proponente.
 */
import type { PeloMenosUm, Premissa, Redacao } from "@prisma-intent/core";

/** Moedas aceitas, pelo código ISO 4217. Todas têm duas casas decimais. */
export type Moeda = "USD" | "BRL" | "EUR" | "AED";

/**
 * Valor monetário em centavos inteiros (a menor unidade da moeda), para que a
 * soma não acumule erro de ponto flutuante.
 */
export type Dinheiro<TMoeda extends Moeda = Moeda> = {
	readonly centavos: number;
	readonly moeda: TMoeda;
};

/** Periodicidade de um custo. */
export type Recorrencia = "unica" | "mensal" | "anual";

/**
 * Taxa de esforço da proposta.
 *
 * Uma taxa redonda é `por_hora`. Uma taxa implícita — um total conhecido
 * dividido por um número de horas — em geral não cabe em centavos inteiros
 * (18.600.000 centavos ÷ 2.323 horas ≈ 8.006,887 centavos por hora), e
 * arredondá-la antes de multiplicar acumularia o erro em cada hora. Por isso
 * ela é declarada como **razão**: `valor` por `porHoras` horas. A função de
 * preço multiplica em inteiros e leva ao centavo uma vez só, no valor da
 * linha.
 */
export type TaxaPorHora<TMoeda extends Moeda = Moeda> =
	| { forma: "por_hora"; valor: Dinheiro<TMoeda> }
	| {
			forma: "razao";
			/** Valor correspondente a `porHoras` horas. */
			valor: Dinheiro<TMoeda>;
			/** Horas a que o valor corresponde (até duas casas decimais). */
			porHoras: number;
	  };

/** Para que lado o arredondamento a múltiplo vai. Empate vai para cima. */
export type SentidoDoArredondamento =
	| "mais_proximo"
	| "para_cima"
	| "para_baixo";

/**
 * Arredondamento comercial de um total. `nenhum` deixa o total no centavo; o
 * múltiplo é declarado em dinheiro, na moeda da proposta.
 */
export type Arredondamento<TMoeda extends Moeda = Moeda> =
	| { tipo: "nenhum" }
	| {
			tipo: "multiplo";
			de: Dinheiro<TMoeda>;
			sentido: SentidoDoArredondamento;
	  };

/**
 * O arredondamento de cada tipo de total. Separados porque o múltiplo que
 * serve a um custo único (mil dólares) muda demais uma mensalidade.
 */
export type RegrasDeArredondamento<TMoeda extends Moeda = Moeda> = {
	custoUnico: Arredondamento<TMoeda>;
	recorrente: Arredondamento<TMoeda>;
};

/** O que toda linha declara, seja qual for a natureza. */
type CabecalhoDaLinha<TCategoria extends string> = {
	/** Como a linha aparece para o leitor. */
	descricao: Redacao;
	/**
	 * Rótulo livre que agrupa linhas num subtotal. É assim que uma instância
	 * segue o formato de planilha pedido pelo comprador sem que a Sales o
	 * conheça.
	 */
	categoria: TCategoria;
};

/** Linhas que não agrupam outras linhas. */
export type LinhaSimples<
	TCategoria extends string = string,
	TMoeda extends Moeda = Moeda,
> = CabecalhoDaLinha<TCategoria> &
	(
		| {
				natureza: "implementacao";
				/** Esforço da linha (até duas casas decimais). A taxa é a da proposta. */
				horas: number;
		  }
		| {
				natureza: "licenca";
				item: Redacao;
				recorrencia: Recorrencia;
				valor: Dinheiro<TMoeda>;
		  }
		| {
				natureza: "sustentacao";
				/** Esforço recorrente por mês (até duas casas decimais), à taxa da proposta. */
				horasPorMes: number;
				/** Duração contratada da sustentação. */
				meses: number;
		  }
		| { natureza: "viagem"; valor: Dinheiro<TMoeda> }
		| {
				natureza: "contingencia";
				/**
				 * Percentual (até duas casas decimais) sobre as linhas de
				 * implementação do mesmo grupo: as do preço base, ou as do opcional.
				 */
				percentual: number;
		  }
	);

/**
 * Linha de preço: cada natureza tem a sua forma, e nenhuma é campo opcional.
 *
 * O opcional não é uma natureza de custo, é um item que o comprador pode
 * acrescentar: agrupa as próprias linhas (horas, licenças), calculadas como
 * as demais e apresentadas em separado.
 */
export type LinhaDePreco<
	TCategoria extends string = string,
	TMoeda extends Moeda = Moeda,
> =
	| LinhaSimples<TCategoria, TMoeda>
	| (CabecalhoDaLinha<TCategoria> & {
			natureza: "opcional";
			item: Redacao;
			linhas: PeloMenosUm<LinhaSimples<TCategoria, TMoeda>>;
	  });

/** Parcela do pagamento vinculada a um marco de aceite do cronograma. */
export type MarcoDePagamento<TMarco extends string = string> = {
	marco: TMarco;
	/**
	 * Percentual do custo único (até duas casas decimais). A função de preço
	 * recusa marcos que não somam 100.
	 */
	percentual: number;
};

/** Premissa de preço declarada para o leitor e para a revisão. */
export type PremissaDePreco<TMoeda extends Moeda = Moeda> = {
	descricao: Redacao;
	premissa: Premissa<number> | Premissa<Dinheiro<TMoeda>>;
};

/** O preço numa moeda: todo `Dinheiro` dele está nessa moeda. */
export type PrecoEmMoeda<TMoeda extends Moeda, TMarco extends string> = {
	moeda: TMoeda;
	/** Taxa de esforço: parâmetro da proposta, não da Sales. */
	taxaPorHora: Premissa<TaxaPorHora<TMoeda>>;
	arredondamento: RegrasDeArredondamento<TMoeda>;
	linhas: PeloMenosUm<LinhaDePreco<string, TMoeda>>;
	/** Horizontes de TCO pedidos pelo comprador, em anos. */
	horizontesDoTcoEmAnos: PeloMenosUm<number>;
	marcosDePagamento: PeloMenosUm<MarcoDePagamento<TMarco>>;
	/** Premissas além da taxa: horas por pessoa-mês, câmbio, viagens. */
	premissas: readonly PremissaDePreco<TMoeda>[];
};

/**
 * O preço da proposta, numa moeda só. A união por moeda faz uma linha em
 * outra moeda ser erro de compilação, sem um parâmetro a mais na instância.
 */
export type PrecoDaProposta<TMarco extends string = string> = {
	[M in Moeda]: PrecoEmMoeda<M, TMarco>;
}[Moeda];
