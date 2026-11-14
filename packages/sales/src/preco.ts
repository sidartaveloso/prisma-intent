/**
 * Função de preço da Sales.
 *
 * Recebe o preço que a instância declara — linhas, taxa, arredondamento,
 * horizontes de TCO e marcos de pagamento — e devolve o que as saídas
 * mostram: cada linha com valor, contingência, custo único, recorrentes,
 * opcionais em separado, subtotais por categoria, TCO e parcelas por marco.
 * Não sabe nada de comprador, edital ou formato de planilha: categoria é
 * rótulo livre da instância.
 *
 * **Aritmética.** Toda conta é feita em inteiros (`bigint`) sobre valores
 * exatos: horas e percentuais com até duas casas decimais viram centésimos, e
 * a taxa é uma razão (`valor` por `porHoras`). Cada linha é levada ao
 * centavo **uma vez**, a partir do valor exato (meio centavo arredonda para
 * cima). Os totais são somas de centavos, e o arredondamento comercial,
 * quando declarado, é o último passo e aparece como `ajuste`, para que as
 * linhas mais o ajuste deem o total apresentado.
 *
 * Entrada que não cabe nessas regras — centavo fracionário, moeda diferente
 * da proposta, horas com três casas, marcos que não somam 100% — é recusada
 * com `ErroDePreco`, em vez de arredondada em silêncio.
 */
import {
	type PeloMenosUm,
	type Redacao,
	valorDaPremissa,
} from "@prisma-intent/core";
import type {
	Arredondamento,
	Dinheiro,
	LinhaSimples,
	MarcoDePagamento,
	Moeda,
	PrecoEmMoeda,
	Recorrencia,
	RegrasDeArredondamento,
	TaxaPorHora,
} from "./linha-de-preco.ts";

/** Entrada de preço recusada. A mensagem diz o que e por quê. */
export class ErroDePreco extends Error {
	override name = "ErroDePreco";
}

/** Um total antes e depois do arredondamento comercial. */
export type ValorArredondado<TMoeda extends Moeda = Moeda> = {
	/** Soma das linhas, no centavo. */
	calculado: Dinheiro<TMoeda>;
	/** `total − calculado`: negativo quando o arredondamento reduz; zero com `nenhum`. */
	ajuste: Dinheiro<TMoeda>;
	/** O valor apresentado ao comprador. */
	total: Dinheiro<TMoeda>;
};

/** Uma linha com o valor calculado, pronta para a planilha. */
export type LinhaCalculada<TMoeda extends Moeda = Moeda> = {
	natureza: LinhaSimples["natureza"];
	descricao: Redacao;
	categoria: string;
	/** Por cobrança: uma vez, por mês ou por ano. */
	periodicidade: Recorrencia;
	valor: Dinheiro<TMoeda>;
};

/** Soma das linhas de uma categoria, por periodicidade, antes do arredondamento. */
export type SubtotalDaCategoria<TMoeda extends Moeda = Moeda> = {
	categoria: string;
	unico: Dinheiro<TMoeda>;
	mensal: Dinheiro<TMoeda>;
	anual: Dinheiro<TMoeda>;
};

export type TcoNoHorizonte<TMoeda extends Moeda = Moeda> = {
	anos: number;
	/** Custo único + anos × recorrente em um ano. */
	total: Dinheiro<TMoeda>;
};

/** Os totais de um grupo de linhas: o preço base ou um opcional. */
export type TotaisDePreco<TMoeda extends Moeda = Moeda> = {
	linhas: readonly LinhaCalculada<TMoeda>[];
	/** Soma das linhas de implementação: a base da contingência. */
	implementacao: Dinheiro<TMoeda>;
	/** Soma das linhas de contingência. Cada uma também está em `linhas`. */
	contingencia: Dinheiro<TMoeda>;
	custoUnico: ValorArredondado<TMoeda>;
	recorrenteMensal: ValorArredondado<TMoeda>;
	recorrenteAnual: ValorArredondado<TMoeda>;
	/** 12 × mensal + anual, já arredondados: a base do TCO. */
	recorrenteEmUmAno: Dinheiro<TMoeda>;
	/** Na ordem em que as categorias aparecem; somam os valores `calculado`. */
	subtotaisPorCategoria: readonly SubtotalDaCategoria<TMoeda>[];
	tco: PeloMenosUm<TcoNoHorizonte<TMoeda>>;
};

/** Um opcional: os próprios totais, fora do preço base e do fluxo de pagamento. */
export type OpcionalCalculado<TMoeda extends Moeda = Moeda> =
	TotaisDePreco<TMoeda> & {
		item: Redacao;
		descricao: Redacao;
		categoria: string;
	};

export type ParcelaDePagamento<
	TMarco extends string = string,
	TMoeda extends Moeda = Moeda,
> = {
	marco: TMarco;
	percentual: number;
	valor: Dinheiro<TMoeda>;
};

/**
 * Se o preço depende de premissa ainda não confirmada. Rascunho não sai como
 * preço final: a renderização precisa marcá-lo.
 */
export type SituacaoDoPreco =
	| { estado: "confirmado" }
	| {
			estado: "rascunho";
			taxaAConfirmar: boolean;
			premissasAConfirmar: readonly Redacao[];
	  };

export type PrecoCalculado<
	TMoeda extends Moeda = Moeda,
	TMarco extends string = string,
> = TotaisDePreco<TMoeda> & {
	moeda: TMoeda;
	opcionais: readonly OpcionalCalculado<TMoeda>[];
	/** O custo único do preço base dividido pelos marcos; soma exatamente o total. */
	pagamentos: PeloMenosUm<ParcelaDePagamento<TMarco, TMoeda>>;
	situacao: SituacaoDoPreco;
};

/**
 * Calcula o preço declarado na instância.
 *
 * @throws {ErroDePreco} quando a entrada não pode ser calculada sem
 * arredondamento escondido ou quando os marcos não somam 100%.
 */
export function calcularPreco<TMoeda extends Moeda, TMarco extends string>(
	preco: PrecoEmMoeda<TMoeda, TMarco>,
): PrecoCalculado<TMoeda, TMarco> {
	const { moeda } = preco;
	const taxa = normalizarTaxa(valorDaPremissa(preco.taxaPorHora), moeda);
	const horizontes = mapear(preco.horizontesDoTcoEmAnos, (anos) => {
		if (!Number.isSafeInteger(anos) || anos <= 0) {
			throw new ErroDePreco(
				`Horizonte de TCO inválido: ${anos}. Use anos inteiros e positivos.`,
			);
		}
		return anos;
	});
	const contexto: Contexto<TMoeda> = {
		moeda,
		taxa,
		arredondamento: preco.arredondamento,
		horizontes,
	};

	const simples: LinhaSimples<string, TMoeda>[] = [];
	const opcionais: OpcionalCalculado<TMoeda>[] = [];
	for (const linha of preco.linhas) {
		if (linha.natureza === "opcional") {
			opcionais.push({
				item: linha.item,
				descricao: linha.descricao,
				categoria: linha.categoria,
				...calcularTotais(linha.linhas, contexto),
			});
		} else {
			simples.push(linha);
		}
	}

	const base = calcularTotais(simples, contexto);
	return {
		moeda,
		...base,
		opcionais,
		pagamentos: dividirEmParcelas(
			BigInt(base.custoUnico.total.centavos),
			preco.marcosDePagamento,
			moeda,
		),
		situacao: situacaoDo(preco),
	};
}

// ── Internos ──────────────────────────────────────────────────────────────

const DEZ_MIL = 10_000n;

/** A taxa como razão inteira: `centavos` por `centesimosDeHora`. */
type TaxaNormalizada = { centavos: bigint; centesimosDeHora: bigint };

type Contexto<TMoeda extends Moeda> = {
	moeda: TMoeda;
	taxa: TaxaNormalizada;
	arredondamento: RegrasDeArredondamento<TMoeda>;
	horizontes: PeloMenosUm<number>;
};

function calcularTotais<TMoeda extends Moeda>(
	linhas: readonly LinhaSimples<string, TMoeda>[],
	contexto: Contexto<TMoeda>,
): TotaisDePreco<TMoeda> {
	const { moeda, taxa } = contexto;

	// Primeiro as linhas que não dependem de outras; a contingência depende da
	// soma das de implementação e é calculada depois, na mesma posição.
	const valores: (bigint | null)[] = linhas.map((linha) =>
		valorSemContingencia(linha, taxa, moeda),
	);
	const implementacao = somar(
		linhas.flatMap((linha, i) =>
			linha.natureza === "implementacao" ? [valores[i] ?? 0n] : [],
		),
	);
	const calculadas = linhas.map((linha, i): LinhaCalculada<TMoeda> => {
		const centavos =
			linha.natureza === "contingencia"
				? dividirArredondando(
						implementacao * centesimos(linha.percentual, "contingência"),
						DEZ_MIL,
					)
				: (valores[i] ?? 0n);
		return {
			natureza: linha.natureza,
			descricao: linha.descricao,
			categoria: linha.categoria,
			periodicidade: periodicidadeDe(linha),
			valor: dinheiro(centavos, moeda),
		};
	});

	const soma = (periodicidade: Recorrencia) =>
		somar(
			calculadas
				.filter((linha) => linha.periodicidade === periodicidade)
				.map((linha) => BigInt(linha.valor.centavos)),
		);
	const custoUnico = arredondar(
		soma("unica"),
		contexto.arredondamento.custoUnico,
		moeda,
	);
	const recorrenteMensal = arredondar(
		soma("mensal"),
		contexto.arredondamento.recorrente,
		moeda,
	);
	const recorrenteAnual = arredondar(
		soma("anual"),
		contexto.arredondamento.recorrente,
		moeda,
	);
	const emUmAno =
		12n * BigInt(recorrenteMensal.total.centavos) +
		BigInt(recorrenteAnual.total.centavos);

	return {
		linhas: calculadas,
		implementacao: dinheiro(implementacao, moeda),
		contingencia: dinheiro(
			somar(
				calculadas
					.filter((linha) => linha.natureza === "contingencia")
					.map((linha) => BigInt(linha.valor.centavos)),
			),
			moeda,
		),
		custoUnico,
		recorrenteMensal,
		recorrenteAnual,
		recorrenteEmUmAno: dinheiro(emUmAno, moeda),
		subtotaisPorCategoria: subtotais(calculadas, moeda),
		tco: mapear(contexto.horizontes, (anos) => ({
			anos,
			total: dinheiro(
				BigInt(custoUnico.total.centavos) + BigInt(anos) * emUmAno,
				moeda,
			),
		})),
	};
}

/** Valor exato de uma linha, levado ao centavo uma vez; `null` para contingência. */
function valorSemContingencia<TMoeda extends Moeda>(
	linha: LinhaSimples<string, TMoeda>,
	taxa: TaxaNormalizada,
	moeda: TMoeda,
): bigint | null {
	switch (linha.natureza) {
		case "implementacao":
			return aplicarTaxa(centesimos(linha.horas, "horas"), taxa);
		case "sustentacao":
			if (!Number.isSafeInteger(linha.meses) || linha.meses <= 0) {
				throw new ErroDePreco(
					`Sustentação "${linha.descricao}": meses deve ser inteiro e positivo, não ${linha.meses}.`,
				);
			}
			return aplicarTaxa(centesimos(linha.horasPorMes, "horas por mês"), taxa);
		case "licenca":
		case "viagem":
			return centavosDe(linha.valor, moeda, linha.descricao);
		case "contingencia":
			return null;
		default: {
			const naoTratada: never = linha;
			throw new ErroDePreco(`Natureza de linha não tratada: ${naoTratada}`);
		}
	}
}

function periodicidadeDe(linha: LinhaSimples): Recorrencia {
	switch (linha.natureza) {
		case "licenca":
			return linha.recorrencia;
		case "sustentacao":
			return "mensal";
		case "implementacao":
		case "viagem":
		case "contingencia":
			return "unica";
		default: {
			const naoTratada: never = linha;
			throw new ErroDePreco(`Natureza de linha não tratada: ${naoTratada}`);
		}
	}
}

function normalizarTaxa(taxa: TaxaPorHora, moeda: Moeda): TaxaNormalizada {
	const centavos = centavosDe(taxa.valor, moeda, "taxa por hora");
	const centesimosDeHora =
		taxa.forma === "por_hora"
			? 100n
			: centesimos(taxa.porHoras, "horas da taxa");
	if (centesimosDeHora === 0n) {
		throw new ErroDePreco("A taxa não pode corresponder a zero horas.");
	}
	return { centavos, centesimosDeHora };
}

/** horas × taxa, exato, levado ao centavo uma vez. */
function aplicarTaxa(centesimosDeHora: bigint, taxa: TaxaNormalizada): bigint {
	return dividirArredondando(
		centesimosDeHora * taxa.centavos,
		taxa.centesimosDeHora,
	);
}

function arredondar<TMoeda extends Moeda>(
	calculado: bigint,
	regra: Arredondamento<TMoeda>,
	moeda: TMoeda,
): ValorArredondado<TMoeda> {
	let total = calculado;
	if (regra.tipo === "multiplo") {
		const multiplo = centavosDe(regra.de, moeda, "múltiplo do arredondamento");
		if (multiplo === 0n) {
			throw new ErroDePreco("O múltiplo do arredondamento não pode ser zero.");
		}
		const abaixo = (calculado / multiplo) * multiplo;
		const resto = calculado - abaixo;
		const acima = resto === 0n ? abaixo : abaixo + multiplo;
		total =
			regra.sentido === "para_baixo"
				? abaixo
				: regra.sentido === "para_cima"
					? acima
					: 2n * resto >= multiplo
						? acima
						: abaixo;
	}
	return {
		calculado: dinheiro(calculado, moeda),
		ajuste: dinheiro(total - calculado, moeda),
		total: dinheiro(total, moeda),
	};
}

/**
 * Divide o total pelos marcos. Cada parcela é o piso da parte exata; os
 * centavos que sobram vão, um a um, às parcelas de maior resto (empate: a
 * primeira declarada). A soma das parcelas é exatamente o total.
 */
function dividirEmParcelas<TMarco extends string, TMoeda extends Moeda>(
	total: bigint,
	marcos: PeloMenosUm<MarcoDePagamento<TMarco>>,
	moeda: TMoeda,
): PeloMenosUm<ParcelaDePagamento<TMarco, TMoeda>> {
	const vistos = new Set<string>();
	const pontos = marcos.map((marco) => {
		if (vistos.has(marco.marco)) {
			throw new ErroDePreco(`Marco de pagamento repetido: ${marco.marco}.`);
		}
		vistos.add(marco.marco);
		const pontosBase = centesimos(marco.percentual, `marco ${marco.marco}`);
		if (pontosBase === 0n) {
			throw new ErroDePreco(`Marco de pagamento com 0%: ${marco.marco}.`);
		}
		return pontosBase;
	});
	const soma = somar(pontos);
	if (soma !== DEZ_MIL) {
		throw new ErroDePreco(
			`Os marcos de pagamento somam ${Number(soma) / 100}%, não 100%.`,
		);
	}

	const exatos = pontos.map((p) => total * p);
	const parcelas = exatos.map((exato) => exato / DEZ_MIL);
	let sobra = total - somar(parcelas);
	const porResto = exatos
		.map((exato, indice) => ({ resto: exato % DEZ_MIL, indice }))
		.sort((a, b) =>
			a.resto === b.resto ? a.indice - b.indice : a.resto > b.resto ? -1 : 1,
		);
	for (const { indice } of porResto) {
		if (sobra === 0n) break;
		parcelas[indice] = (parcelas[indice] ?? 0n) + 1n;
		sobra -= 1n;
	}

	return mapear(marcos, (marco, indice) => ({
		marco: marco.marco,
		percentual: marco.percentual,
		valor: dinheiro(parcelas[indice] ?? 0n, moeda),
	}));
}

function subtotais<TMoeda extends Moeda>(
	linhas: readonly LinhaCalculada<TMoeda>[],
	moeda: TMoeda,
): SubtotalDaCategoria<TMoeda>[] {
	const porCategoria = new Map<string, Record<Recorrencia, bigint>>();
	for (const linha of linhas) {
		const atual = porCategoria.get(linha.categoria) ?? {
			unica: 0n,
			mensal: 0n,
			anual: 0n,
		};
		atual[linha.periodicidade] += BigInt(linha.valor.centavos);
		porCategoria.set(linha.categoria, atual);
	}
	return [...porCategoria].map(([categoria, valores]) => ({
		categoria,
		unico: dinheiro(valores.unica, moeda),
		mensal: dinheiro(valores.mensal, moeda),
		anual: dinheiro(valores.anual, moeda),
	}));
}

function situacaoDo(preco: PrecoEmMoeda<Moeda, string>): SituacaoDoPreco {
	const taxaAConfirmar = preco.taxaPorHora.estado === "a_confirmar";
	const premissasAConfirmar = preco.premissas
		.filter(({ premissa }) => premissa.estado === "a_confirmar")
		.map(({ descricao }) => descricao);
	return taxaAConfirmar || premissasAConfirmar.length > 0
		? { estado: "rascunho", taxaAConfirmar, premissasAConfirmar }
		: { estado: "confirmado" };
}

/** `map` que preserva a lista não vazia (o de `Array` devolve `U[]`). */
function mapear<T, U>(
	lista: PeloMenosUm<T>,
	transformar: (item: T, indice: number) => U,
): PeloMenosUm<U> {
	const [primeiro, ...resto] = lista;
	return [
		transformar(primeiro, 0),
		...resto.map((item, i) => transformar(item, i + 1)),
	];
}

// ── Aritmética ────────────────────────────────────────────────────────────

/**
 * Número não negativo com até duas casas decimais, em centésimos inteiros.
 * Horas e percentuais entram por aqui: 7,5% vira 750; 12,25 h vira 1.225.
 */
function centesimos(valor: number, oQue: string): bigint {
	if (!Number.isFinite(valor) || valor < 0) {
		throw new ErroDePreco(`${oQue}: ${valor} não é um número não negativo.`);
	}
	const escalado = Math.round(valor * 100);
	if (Math.abs(valor * 100 - escalado) > 1e-6) {
		throw new ErroDePreco(`${oQue}: ${valor} tem mais de duas casas decimais.`);
	}
	return BigInt(escalado);
}

function centavosDe(dinheiro: Dinheiro, moeda: Moeda, oQue: string): bigint {
	if (dinheiro.moeda !== moeda) {
		throw new ErroDePreco(
			`${oQue}: valor em ${dinheiro.moeda} numa proposta em ${moeda}.`,
		);
	}
	if (!Number.isSafeInteger(dinheiro.centavos) || dinheiro.centavos < 0) {
		throw new ErroDePreco(
			`${oQue}: ${dinheiro.centavos} não é um número inteiro e não negativo de centavos.`,
		);
	}
	return BigInt(dinheiro.centavos);
}

/** `numerador ÷ denominador`, ao inteiro mais próximo; meio vai para cima. */
function dividirArredondando(numerador: bigint, denominador: bigint): bigint {
	return (2n * numerador + denominador) / (2n * denominador);
}

function somar(valores: readonly bigint[]): bigint {
	return valores.reduce((total, valor) => total + valor, 0n);
}

function dinheiro<TMoeda extends Moeda>(
	centavos: bigint,
	moeda: TMoeda,
): Dinheiro<TMoeda> {
	const numero = Number(centavos);
	if (!Number.isSafeInteger(numero)) {
		throw new ErroDePreco(
			`Valor fora do intervalo exato de número: ${centavos} centavos.`,
		);
	}
	return { centavos: numero, moeda };
}
