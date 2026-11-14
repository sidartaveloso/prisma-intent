/**
 * # PRISMA Intent Sales
 *
 * Especialização do PRISMA Intent para a proposta comercial: uma mensagem
 * para vários leitores dentro da organização compradora, cada um decidindo
 * por critérios diferentes.
 *
 * Depende de `@prisma-intent/core` e nunca o contrário. O core não sabe o que
 * é preço, requisito, conformidade ou leitura medida — esses conceitos existem
 * apenas aqui. Nenhum dado de proponente, comprador ou proposta concreta vive
 * neste pacote: a instância fica com quem a usa.
 *
 * O que a Sales acrescenta ao core:
 *
 * - escopo: pacotes de trabalho, requisitos do cliente e a conformidade de
 *   cada um;
 * - preço: dinheiro em centavos, taxa como razão, linhas de preço e
 *   premissas, e `calcularPreco` — o preço é calculado, nunca escrito;
 * - cronograma com marcos de aceite;
 * - leitor com organização e o que ele vê;
 * - sinal de leitura, que liga cada efeito desejado a um comportamento
 *   observável;
 * - dado interno (`entendimento`, `Estimativa`) que nenhum conteúdo
 *   renderizável aceita.
 */

// Promovidos ao core na task-042; reexportados com os mesmos nomes para que
// quem consome a Sales por `link:` não mude.
export type {
	ConteudoRenderizavel,
	Data,
	DecisaoRegistrada,
	Interno,
	Premissa,
	TextoInterno,
	ValorDaPremissa,
} from "@prisma-intent/core";
export {
	garantirRenderizavel,
	interno,
	valorDaPremissa,
} from "@prisma-intent/core";
export type {
	Cronograma,
	FaseDoCronograma,
	MarcoDeAceite,
} from "./cronograma.ts";
export type {
	Conformidade,
	Estimativa,
	InclusaoNoPreco,
	PacoteDeTrabalho,
	PacoteParaLeitor,
	Requisito,
	RequisitoParaLeitor,
	UnidadeDeEsforco,
} from "./escopo.ts";
export { pacoteParaLeitor, requisitoParaLeitor } from "./escopo.ts";
export type {
	EvidenciaSales,
	FonteDaEvidencia,
	ReferenciaSales,
} from "./evidencia.ts";
export type { InstanciaSales } from "./instancia.ts";
export { definirInstancia } from "./instancia.ts";
export type {
	IntencaoDaProposta,
	MaterialLevavel,
	NossaIntencaoSales,
	ObservacaoDoEfeito,
	ObservacaoDosEfeitos,
	SinalDeLeitura,
} from "./intencao.ts";
export type {
	ConsumidorSales,
	LeitorDaProposta,
	OrganizacaoEnvolvida,
	PerguntaAOrganizacao,
} from "./leitor.ts";
export type {
	Arredondamento,
	Dinheiro,
	LinhaDePreco,
	LinhaSimples,
	MarcoDePagamento,
	Moeda,
	PrecoDaProposta,
	PrecoEmMoeda,
	PremissaDePreco,
	Recorrencia,
	RegrasDeArredondamento,
	SentidoDoArredondamento,
	TaxaPorHora,
} from "./linha-de-preco.ts";
export type {
	LinhaCalculada,
	OpcionalCalculado,
	ParcelaDePagamento,
	PrecoCalculado,
	SituacaoDoPreco,
	SubtotalDaCategoria,
	TcoNoHorizonte,
	TotaisDePreco,
	ValorArredondado,
} from "./preco.ts";
export { calcularPreco, ErroDePreco } from "./preco.ts";
export type { RenderizacaoSales } from "./renderizacao.ts";
export type {
	CanalDeContato,
	EfeitoCognitivo,
	EfeitoComportamental,
	EfeitoEmocional,
	FamiliaDeIntencao,
	IdiomaDePublicacao,
	IntencaoDoConsumidor,
	NomeDoSinal,
	ObjecaoTipica,
	PapelDaOrganizacao,
	PerfilAgente,
	PerfilHumano,
	PrioridadeDoRequisito,
	SecaoDaProposta,
	TipoDeEvidencia,
	TipoDeIntencao,
	TipoDeRenderizacao,
	Unidade,
} from "./vocabulario.ts";
export {
	efeitosCognitivos,
	efeitosComportamentais,
	efeitosEmocionais,
	intencoesDoConsumidor,
	objecoesTipicas,
	papeisDeOrganizacao,
	perfisAgente,
	perfisHumanos,
	respostaTipicaDaObjecao,
	secoesDaProposta,
	sinaisDeLeitura,
	tiposDeEvidencia,
	tiposDeIntencao,
	tiposDeRenderizacao,
} from "./vocabulario.ts";
