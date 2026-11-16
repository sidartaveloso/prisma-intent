/**
 * Formação, certificação e idioma.
 *
 * Entram na especialização Work porque são credenciais — não fazem sentido no
 * core. Idioma tem peso próprio nesta instância: projetos internacionais são um
 * motivador declarado, e o nível de inglês é o que torna isso viável em vez de
 * apenas desejado.
 */
import type { Redacao } from "@prisma-intent/core";

export type GrauAcademico =
	| "tecnico"
	| "graduacao"
	| "especializacao"
	| "mba"
	| "mestrado"
	| "doutorado";

export interface FormacaoAcademica {
	instituicao: Redacao;
	grau: GrauAcademico;
	curso: Redacao;
	inicio?: Redacao;
	conclusao: Redacao;
}

export interface Certificacao {
	nome: Redacao;
	organizacao: Redacao;
	obtidaEm: Redacao;
	expiraEm?: Redacao;
}

/**
 * Níveis de idioma, na escala que o LinkedIn usa — mantida porque é dela que o
 * dado vem, e traduzir para outra escala inventaria precisão que não existe.
 */
export type NivelDeIdioma =
	| "basico"
	| "limitado"
	| "profissional"
	| "profissional_completo"
	| "nativo_ou_bilingue";

export interface Idioma {
	idioma: Redacao;
	nivel: NivelDeIdioma;
}
