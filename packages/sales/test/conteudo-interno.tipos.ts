/**
 * Testes de tipo: `entendimento` e `Estimativa` não são aceitos por nenhum
 * tipo de conteúdo renderizável.
 *
 * "Conteúdo renderizável", aqui, é tudo o que pode chegar ao leitor: um campo
 * `Redacao`, o tipo `ConteudoRenderizavel` (a forma do que atravessa para o
 * PDF, o site e a planilha), as projeções `RequisitoParaLeitor` e
 * `PacoteParaLeitor` e as seções que uma renderização ordena. Cada recusa tem
 * um controle positivo ao lado, para mostrar que o tipo recusa o dado interno
 * e não qualquer coisa.
 *
 * Como em `estados-ilegais.tipos.ts`, um erro que some faz o `tsc` acusar a
 * diretiva sem uso.
 */
import type { Redacao } from "@prisma-intent/core";
import type {
	Conformidade,
	ConteudoRenderizavel,
	Dinheiro,
	Estimativa,
	LinhaDePreco,
	MarcoDeAceite,
	PacoteDeTrabalho,
	PacoteParaLeitor,
	RenderizacaoSales,
	Requisito,
	RequisitoParaLeitor,
	TextoInterno,
} from "../src/index.ts";
import {
	garantirRenderizavel,
	pacoteParaLeitor,
	requisitoParaLeitor,
} from "../src/index.ts";
import { propostaDeExemplo } from "./exemplo.ts";

declare const requisito: Requisito;
declare const pacote: PacoteDeTrabalho;
declare const estimativa: Estimativa;
declare const entendimento: TextoInterno;

// ── `Redacao`: texto que vai ao leitor ────────────────────────────────────

// @ts-expect-error — o entendimento é objeto interno, não texto
const _entendimentoComoTexto: Redacao = requisito.entendimento;

// @ts-expect-error — a estimativa não é texto
const _estimativaComoTexto: Redacao = estimativa;

const _tituloComoTexto: Redacao = requisito.titulo;

// ── `ConteudoRenderizavel`: o que atravessa para a saída ──────────────────

// @ts-expect-error — entendimento
const _entendimentoRenderizavel: ConteudoRenderizavel = entendimento;

// @ts-expect-error — estimativa
const _estimativaRenderizavel: ConteudoRenderizavel = estimativa;

// @ts-expect-error — o requisito inteiro leva o entendimento
const _requisitoRenderizavel: ConteudoRenderizavel = requisito;

// @ts-expect-error — o pacote do proponente leva a estimativa
garantirRenderizavel(pacote);

// @ts-expect-error — a instância inteira nunca é conteúdo
garantirRenderizavel(propostaDeExemplo);

// @ts-expect-error — dado interno em qualquer profundidade: itens[0].nota
garantirRenderizavel({
	secao: "escopo",
	itens: [
		{
			titulo: requisito.titulo,
			nota: requisito.entendimento,
		},
	],
});

// @ts-expect-error — a estimativa aninhada também: esforco.origem
garantirRenderizavel({
	pacote: pacote.nome,
	esforco: { horas: 440, origem: estimativa },
});

// Controles positivos: o mesmo conteúdo, projetado, é aceito.
const _requisitoProjetado: ConteudoRenderizavel =
	requisitoParaLeitor(requisito);
const _pacoteProjetado = garantirRenderizavel(pacoteParaLeitor(pacote));
const _conteudoComposto = garantirRenderizavel({
	secao: "escopo",
	itens: [{ titulo: requisito.titulo, conformidade: requisito.conformidade }],
});

// ── Projeções: o objeto completo não passa por elas ───────────────────────

// @ts-expect-error — o requisito completo não é a projeção
const _requisitoComoProjecao: RequisitoParaLeitor = requisito;

// @ts-expect-error — o pacote completo não é a projeção
const _pacoteComoProjecao: PacoteParaLeitor = pacote;

const _projecaoComEntendimento: RequisitoParaLeitor = {
	...requisitoParaLeitor(requisito),
	// @ts-expect-error — devolver o entendimento à projeção
	entendimento: requisito.entendimento,
};

// ── Renderização: ordena seções, e estimativa não é seção ─────────────────

const _secoesComEstimativa: RenderizacaoSales["conteudoPrioritario"] = [
	"escopo",
	// @ts-expect-error — estimativa não é seção da proposta
	"estimativa",
];

// ── Os tipos que vão ao leitor são conteúdo renderizável ──────────────────

type Verdadeiro<T extends true> = T;
type EhRenderizavel<T> = T extends ConteudoRenderizavel ? true : false;

type _RequisitoParaLeitor = Verdadeiro<EhRenderizavel<RequisitoParaLeitor>>;
type _PacoteParaLeitor = Verdadeiro<EhRenderizavel<PacoteParaLeitor>>;
type _Conformidade = Verdadeiro<EhRenderizavel<Conformidade>>;
type _LinhaDePreco = Verdadeiro<EhRenderizavel<LinhaDePreco>>;
type _Dinheiro = Verdadeiro<EhRenderizavel<Dinheiro>>;
type _MarcoDeAceite = Verdadeiro<EhRenderizavel<MarcoDeAceite>>;

// E os internos não são.
type Falso<T extends false> = T;
type _Requisito = Falso<EhRenderizavel<Requisito>>;
type _Estimativa = Falso<EhRenderizavel<Estimativa>>;
type _TextoInterno = Falso<EhRenderizavel<TextoInterno>>;
