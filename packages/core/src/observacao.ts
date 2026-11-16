/**
 * Observação dos efeitos: como se sabe que um efeito comportamental aconteceu.
 *
 * O core diz que só o efeito comportamental é observável (`EfeitosDesejados`).
 * Duas especializações quiseram a mesma garantia: cada efeito comportamental
 * que uma instância deseja declara como é observado, e esquecer um é erro de
 * compilação. A forma da observação é da especialização (sinal de leitura,
 * métrica de plataforma, registro de pessoa); o core só fixa a regra.
 *
 * Promovido da Sales (task-042), onde nasceu como `ObservacaoDosEfeitos`.
 */

/**
 * Um registro por efeito desejado.
 *
 * - `TDesejado`: os efeitos que as intenções da instância declaram.
 * - `TUniverso`: todos os efeitos do vocabulário da especialização.
 * - `TObservacao`: a forma da observação naquela especialização.
 *
 * Com os efeitos conhecidos (instância concreta), todos são obrigatórios. No
 * caso genérico — `TDesejado` igual ao universo, como numa função que aceita
 * qualquer instância — as chaves ficam opcionais; sem isso, nenhuma instância
 * concreta caberia no tipo genérico. Os colchetes impedem a distribuição sobre
 * a união: a pergunta é "o desejado cobre o universo inteiro?", não "cada
 * efeito do universo".
 */
export type ObservacaoDosEfeitos<
	TDesejado extends TUniverso,
	TUniverso extends string,
	TObservacao,
> = [TUniverso] extends [TDesejado]
	? { readonly [E in TUniverso]?: TObservacao }
	: { readonly [E in TDesejado]: TObservacao };
