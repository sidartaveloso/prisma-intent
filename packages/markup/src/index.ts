/**
 * # @prisma-intent/markup
 *
 * Marcação semântica no texto: lê e escreve as tags do core
 * (`@prisma-intent/core`) como diretivas de texto do CommonMark,
 *
 * ```text
 * :tipo[rótulo]{#id atributo="valor"}
 * ```
 *
 * conferidas contra o registro de tipos. Mora fora do core porque depende das
 * bibliotecas do micromark, e o core não tem dependências (pacote 2026-000003,
 * task-016).
 */
export { escreverMarcacao } from "./escrever.ts";
export { lerMarcacao } from "./ler.ts";
export type {
	FalhaDeMarcacao,
	Intervalo,
	Pedaco,
	PontoNoTexto,
	ResultadoDaLeitura,
} from "./tipos.ts";
