/**
 * Renderização — cada saída é uma projeção da mesma base.
 *
 * Currículo, site, LinkedIn e entrevista deixam de ser documentos
 * independentes: passam a ser recortes diferentes da mesma identidade e das
 * mesmas evidências, com profundidade e prioridade próprias.
 */
import type { Profundidade } from "./contexto.ts";
import type { Prioridade } from "./prioridade.ts";
import type { PeloMenosUm, Redacao } from "./utilitarios.ts";

export interface Renderizacao<
	TTipo extends string,
	TReferencia extends string,
	TIdioma extends string = string,
> {
	tipo: TTipo;
	prioridade: Prioridade;
	objetivo: Redacao;
	profundidade: Profundidade;
	/** O que entra nesta renderização, na ordem em que deve entrar. */
	conteudoPrioritario: readonly TReferencia[];
	/** Restrições editoriais próprias deste formato. */
	regras?: readonly Redacao[];
	/**
	 * Limite de páginas do canal, quando o formato tem um.
	 *
	 * Não é preferência de diagramação: em currículo, passar do limite muda como
	 * o documento é lido. Declarado aqui, o limite pode ser conferido na geração
	 * em vez de descoberto quando alguém imprime.
	 */
	limitePaginas?: number;
	/**
	 * Idiomas em que este canal publica, quando publica em mais de um.
	 *
	 * Não é o idioma da instância. `idiomaBase` diz em que língua os **fatos**
	 * foram escritos, e isso não muda: a mesma base sai em português no site e
	 * em dois idiomas numa política de divulgação de vulnerabilidades, cujo
	 * leitor é internacional por natureza. Idioma de publicação é propriedade do
	 * canal, não da base.
	 *
	 * Declarado aqui, o conjunto de páginas a emitir é conferido na geração em
	 * vez de combinado por convenção — e um idioma a mais passa a ser mudança de
	 * instância, não de código.
	 *
	 * Atenção ao publicar em idioma novo: `padroesVedados` das regras de
	 * integridade são expressões regulares escritas numa língua. Uma saída em
	 * outro idioma não é coberta por elas até que a regra ganhe o padrão
	 * correspondente — e passar sem verificação é pior do que falhar.
	 */
	idiomas?: PeloMenosUm<TIdioma>;
}
