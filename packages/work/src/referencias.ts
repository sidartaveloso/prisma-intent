/**
 * Referência de evidência.
 *
 * No material bruto, a lista de evidências de um argumento misturava coisas de
 * naturezas diferentes: `"painel-de-frotas"` (um case),
 * `"stack_principal_atual"` (um atributo) e `"Cooperativa Gama"` (uma
 * organização). Como texto solto, nada
 * impedia referenciar um projeto inexistente.
 *
 * Aqui a referência é discriminada e o id do case é validado contra os cases
 * declarados na instância — referência quebrada vira erro de compilação.
 */
import type { Redacao } from "@prisma-intent/core";

/** Fato sobre a pessoa que sustenta um argumento sem ser um case. */
export type AtributoProbatorio =
	| "stack_principal_atual"
	| "motivacao_profissional_declarada"
	| "lideranca_de_time"
	| "criacao_do_escritorio_de_projetos"
	| "interesse_em_projetos_internacionais"
	| "interesse_em_grandes_projetos"
	| "interesse_em_complexidade_e_escala"
	| "trajetoria_de_quinze_anos"
	/**
	 * Práticas de engenharia exercidas no dia a dia.
	 *
	 * Sustenta o argumento de proximidade com o código de um jeito que nenhum
	 * case sustenta: quem revisa pull request, escreve teste e configura
	 * pipeline está dentro da engenharia, não acima dela.
	 */
	| "praticas_de_engenharia";

export type ReferenciaDeEvidencia<TCase extends string> =
	| { tipo: "case"; case: TCase }
	| { tipo: "atributo"; atributo: AtributoProbatorio }
	/** O porte de quem confiou no trabalho é evidência por si só. */
	| { tipo: "organizacao"; organizacao: Redacao }
	| { tipo: "documento"; documento: Redacao };
