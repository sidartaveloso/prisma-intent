/**
 * Nome de tipo que se escreve como diretiva: começa e termina por letra ou
 * dígito; no meio, também `-` e `_`. É a regra do micromark, menos a
 * tabulação, que ele aceita no nome por engano.
 */
export const NOME_DO_TIPO = /^[\p{L}\p{N}](?:[\p{L}\p{N}_-]*[\p{L}\p{N}])?$/u;
