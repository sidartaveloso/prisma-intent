/**
 * Testes de tipo: estados ilegais não compilam.
 *
 * Cada `@ts-expect-error` afirma que a linha seguinte é erro de compilação. Se
 * o tipo afrouxar e o erro sumir, o `tsc` acusa a diretiva sem uso
 * (TS2578) — é assim que este arquivo falha. Ele não roda: é conferido pelo
 * `pnpm typecheck` e por `tipos.test.ts`.
 */
import type {
	Conformidade,
	Estimativa,
	EvidenciaSales,
	InstanciaSales,
	IntencaoDoConsumidor,
	LinhaDePreco,
	MarcoDeAceite,
	PacoteDeTrabalho,
	PrecoDaProposta,
	Premissa,
	SinalDeLeitura,
} from "../src/index.ts";
import { definirInstancia } from "../src/index.ts";
import { propostaDeExemplo } from "./exemplo.ts";

// ── Vocabulário: o objetivo só vale dentro da sua família ──────────────────

const _intencaoValida: IntencaoDoConsumidor = {
	familia: "preco",
	objetivo: "comparar_preco",
};

// @ts-expect-error — avaliar_lock_in é de risco_e_conformidade, não de preço
const _intencaoDeOutraFamilia: IntencaoDoConsumidor = {
	familia: "preco",
	objetivo: "avaliar_lock_in",
};

const _intencaoForaDoVocabulario: IntencaoDoConsumidor = {
	familia: "escopo_e_entrega",
	// @ts-expect-error — objetivo que o vocabulário não define
	objetivo: "avaliar_senioridade",
};

// ── Conformidade: cada forma de atender declara o que a torna conferível ──

// @ts-expect-error — desenvolvimento sem o pacote que o entrega
const _desenvolvimentoSemPacote: Conformidade = {
	atende: "desenvolvimento",
	resposta: { estado: "a_confirmar" },
};

// @ts-expect-error — não atender exige justificativa
const _naoAtendeSemJustificativa: Conformidade = { atende: "nao_atende" };

const _aConfirmarComPacote: Conformidade = {
	atende: "a_confirmar",
	pergunta: "Qual é o volume esperado?",
	// @ts-expect-error — o que ainda depende de resposta não aponta pacote
	pacote: "plataforma",
};

// ── Estimativa: sempre interna, sempre de pessoas ─────────────────────────

const _estimativaSemEstimador: Estimativa = {
	visibilidade: "interna",
	estado: "por_estimadores",
	unidade: "horas",
	// @ts-expect-error — pelo menos uma estimativa de pessoa
	porEstimador: [],
	consolidada: { valor: 100, criterio: "mediana" },
};

// @ts-expect-error — estimativa sem a marca de dado interno
const _estimativaSemMarca: Estimativa = { estado: "a_estimar" };

// @ts-expect-error — faixa sem o valor adotado
const _faixaSemAdotado: Estimativa = {
	visibilidade: "interna",
	estado: "por_faixa",
	unidade: "pessoas_mes",
	minimo: 8,
	maximo: 12,
	fonte: "Estudo de viabilidade.",
};

// ── Pacote: só o do proponente tem estimativa e entra no preço ────────────

const _pacoteDeTerceiroNoPreco: PacoteDeTrabalho = {
	id: "terminais",
	nome: "Terminais",
	descricao: "Fornecimento dos terminais.",
	responsavel: "organizacao",
	organizacao: "integradora",
	// @ts-expect-error — pacote de outra organização não entra no preço do proponente
	inclusao: "no_preco",
};

// ── Linhas de preço: o preço é calculado, nunca escrito ───────────────────

// @ts-expect-error — implementação sem horas
const _implementacaoSemHoras: LinhaDePreco = {
	natureza: "implementacao",
	descricao: "Plataforma",
	categoria: "Implementação",
};

const _implementacaoComValorDigitado: LinhaDePreco = {
	natureza: "implementacao",
	descricao: "Plataforma",
	categoria: "Implementação",
	horas: 100,
	// @ts-expect-error — o valor da implementação vem de horas × taxa, não é digitado
	valor: { centavos: 1_000_000, moeda: "USD" },
};

// @ts-expect-error — contingência sem percentual
const _contingenciaSemPercentual: LinhaDePreco = {
	natureza: "contingencia",
	descricao: "Contingência",
	categoria: "Implementação",
};

// @ts-expect-error — licença sem recorrência
const _licencaSemRecorrencia: LinhaDePreco = {
	natureza: "licenca",
	descricao: "Banco de dados",
	categoria: "Licenças",
	item: "Banco de dados",
	valor: { centavos: 10_000, moeda: "USD" },
};

const _opcionalVazio: LinhaDePreco = {
	natureza: "opcional",
	descricao: "Aplicativo",
	categoria: "Opcionais",
	item: "Aplicativo",
	// @ts-expect-error — opcional sem linhas não tem como ser calculado
	linhas: [],
};

const _opcionalDentroDeOpcional: LinhaDePreco = {
	natureza: "opcional",
	descricao: "Aplicativo",
	categoria: "Opcionais",
	item: "Aplicativo",
	linhas: [
		{
			// @ts-expect-error — opcional não agrupa outro opcional
			natureza: "opcional",
			descricao: "Módulo",
			categoria: "Opcionais",
			item: "Módulo",
			linhas: [
				{
					natureza: "implementacao",
					descricao: "Módulo",
					categoria: "Opcionais",
					horas: 10,
				},
			],
		},
	],
};

// ── Preço: uma moeda só ───────────────────────────────────────────────────

// @ts-expect-error — linha em real numa proposta em dólar
const _precoComDuasMoedas: PrecoDaProposta = {
	moeda: "USD",
	taxaPorHora: {
		estado: "a_confirmar",
		valorDeTrabalho: {
			forma: "por_hora",
			valor: { centavos: 10_000, moeda: "USD" },
		},
	},
	arredondamento: {
		custoUnico: { tipo: "nenhum" },
		recorrente: { tipo: "nenhum" },
	},
	linhas: [
		{
			natureza: "viagem",
			descricao: "Viagens",
			categoria: "Implementação",
			valor: { centavos: 500_000, moeda: "BRL" },
		},
	],
	horizontesDoTcoEmAnos: [3],
	marcosDePagamento: [{ marco: "aceite", percentual: 100 }],
	premissas: [],
};

// ── Premissa: confirmar é decisão registrada de pessoa ───────────────────

// @ts-expect-error — premissa confirmada sem a decisão registrada
const _confirmadaSemDecisao: Premissa<number> = {
	estado: "confirmada",
	valor: 80,
};

// @ts-expect-error — a confirmar sem o valor de trabalho
const _aConfirmarSemValor: Premissa<number> = { estado: "a_confirmar" };

// ── Evidência: o que afirma fato sobre o proponente exige fonte ───────────

// @ts-expect-error — certificação sem fonte
const _certificacaoSemFonte: EvidenciaSales = {
	id: "iso",
	tipo: "certificacao",
	nome: "Certificação de qualidade",
	emissor: "Organismo certificador",
};

const _certificacaoConfirmadaSemValor: EvidenciaSales = {
	id: "iso",
	tipo: "certificacao",
	nome: "Certificação de qualidade",
	emissor: "Organismo certificador",
	// @ts-expect-error — confirmada exige a fonte que confirma
	fonte: { estado: "confirmado" },
};

const _casoComFonteEmTextoLivre: EvidenciaSales = {
	id: "caso",
	tipo: "caso_entregue",
	nome: "Caso",
	descricao: "Descrição.",
	// @ts-expect-error — fonte é documento, endereço público ou confirmação de pessoa
	fonte: "relatório anual",
};

// ── Sinal de leitura ──────────────────────────────────────────────────────

const _mensagemNaoSeBaixa: SinalDeLeitura = {
	sinal: "material_levado",
	// @ts-expect-error — a mensagem de envio não é material que se baixa
	material: "mensagem_de_envio",
};

const _secaoInexistente: SinalDeLeitura = {
	sinal: "secao_lida",
	// @ts-expect-error — estimativa não é seção da proposta
	secao: "estimativa",
	permanenciaMinimaEmSegundos: 20,
};

// @ts-expect-error — seção lida sem o limiar que a torna conferível
const _secaoSemLimiar: SinalDeLeitura = { sinal: "secao_lida", secao: "preco" };

// ── Cronograma ────────────────────────────────────────────────────────────

const _marcoSemPacote: MarcoDeAceite = {
	id: "aceite",
	nome: "Aceite",
	mes: 6,
	criterioDeAceite: "Em produção.",
	// @ts-expect-error — marco de aceite sem pacote entregue
	pacotes: [],
};

// ── Instância: referências conferidas contra o que ela declara ────────────

const [leitor, ...outrosLeitores] = propostaDeExemplo.leitores;
const [requisito] = propostaDeExemplo.escopo.requisitos;
const [intencao, ...outrasIntencoes] = propostaDeExemplo.intencoes;
const [renderizacao] = propostaDeExemplo.renderizacoes;

/** A instância de exemplo cabe no tipo genérico: funções aceitam qualquer instância. */
function aceitaQualquerInstancia(_instancia: InstanciaSales): void {}
aceitaQualquerInstancia(propostaDeExemplo);

definirInstancia({
	...propostaDeExemplo,
	leitores: [
		{
			...leitor,
			// @ts-expect-error — organização não declarada
			organizacao: "organizacao_inexistente",
		},
		...outrosLeitores,
	],
});

definirInstancia({
	...propostaDeExemplo,
	intencoes: [
		{
			...intencao,
			// @ts-expect-error — intenção dirigida a leitor inexistente
			para: ["leitor_inexistente"],
		},
		...outrasIntencoes,
	],
});

definirInstancia({
	...propostaDeExemplo,
	// @ts-expect-error — efeito desejado (aprova_o_preco) sem observação
	observacaoDosEfeitos: {
		agenda_reuniao: { por: "resposta_do_leitor", como: "Convite aceito." },
		encaminha_internamente: {
			por: "sinal_de_leitura",
			sinais: [{ sinal: "encaminhamento_provavel" }],
		},
	},
});

definirInstancia({
	...propostaDeExemplo,
	observacaoDosEfeitos: {
		...propostaDeExemplo.observacaoDosEfeitos,
		// @ts-expect-error — observação de efeito que nenhuma intenção deseja
		solicita_contrato: { por: "resposta_do_leitor", como: "Pedido de minuta." },
	},
});

if (requisito) {
	definirInstancia({
		...propostaDeExemplo,
		escopo: {
			...propostaDeExemplo.escopo,
			requisitos: [
				{
					...requisito,
					conformidade: {
						atende: "desenvolvimento",
						// @ts-expect-error — pacote não declarado no escopo
						pacote: "pacote_inexistente",
						resposta: { estado: "a_confirmar" },
					},
				},
			],
		},
	});
}

definirInstancia({
	...propostaDeExemplo,
	argumentos: [
		{
			id: "preco_decorre_do_escopo",
			prioridade: "alta",
			tese: "Cada parcela do preço corresponde a um pacote.",
			evidencias: [
				// @ts-expect-error — evidência não declarada
				{ tipo: "evidencia", evidencia: "evidencia_inexistente" },
			],
		},
	],
});

definirInstancia({
	...propostaDeExemplo,
	preco: {
		...propostaDeExemplo.preco,
		marcosDePagamento: [
			// @ts-expect-error — pagamento em marco que o cronograma não tem
			{ marco: "marco_inexistente", percentual: 100 },
		],
	},
});

definirInstancia({
	...propostaDeExemplo,
	renderizacoes: [
		{
			...renderizacao,
			// @ts-expect-error — saída para leitor inexistente
			leitores: ["leitor_inexistente"],
		},
	],
});

definirInstancia({
	...propostaDeExemplo,
	perguntas: [
		{
			id: "pergunta",
			// @ts-expect-error — pergunta a organização não declarada
			dirigidaA: "organizacao_inexistente",
			pergunta: "Qual é o volume?",
			afeta: ["premissa de volume"],
			resposta: { estado: "a_confirmar" },
		},
	],
});
