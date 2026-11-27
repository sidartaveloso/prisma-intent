/**
 * Recurso e vínculo: cada parte de uma peça a serviço de uma intenção.
 *
 * Antecipa a task-046 (recurso semiótico): o
 * `AtivoVisual` do core é só imagem e tem intenção redigida 1:1. Aqui o recurso
 * é a coisa em si, de qualquer linguagem, e o vínculo é declarado do lado da
 * intenção, com papel. Recurso não apontado é estrutural. Quando o core ganhar
 * o conceito, esta especialização passa a usá-lo.
 *
 * O que só esta especialização precisa: a **natureza** do recurso. Uma
 * renderização de conceito pode alinhar a equipe e nunca pode provar que o
 * produto existe.
 */
import type { Redacao } from "@prisma-intent/core";

export type Linguagem =
	| "imagem"
	| "video"
	| "audio"
	| "texto"
	| "documento"
	| "modelo_3d"
	| "interface"
	| "objeto_fisico";

export type NaturezaDoRecurso =
	/** Renderização, ilustração, apresentação de ideia. Nunca prova. */
	| "conceito"
	/** Registro do protótipo funcional como ele é. */
	| "prototipo"
	/** Registro do produto ou do insumo real (produção, lote, montagem). */
	| "registro_real";

export interface Recurso<TId extends string = string> {
	id: TId;
	linguagem: Linguagem;
	natureza: NaturezaDoRecurso;
	/** Caminho relativo à pasta da instância (por exemplo, `conceito/…`). */
	arquivo?: string;
	/** Data ISO (AAAA-MM-DD) em que o recurso foi produzido ou registrado. */
	data: string;
	/** Descrição textual: acessibilidade e leitura por agentes. */
	descricaoAlternativa: Redacao;
}

/** O uso de um recurso a serviço de uma intenção. */
export interface Vinculo<TRecurso extends string = string> {
	recurso: TRecurso;
	/** `carrega`: a intenção depende dele. `apoia`: ajuda, mas não sustenta. */
	papel: "carrega" | "apoia";
}
