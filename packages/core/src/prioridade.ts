/** Escalas compartilhadas por argumentos, objeções, critérios e cases. */

/** Peso de um elemento na estratégia. */
export type Prioridade = "critica" | "muito_alta" | "alta" | "media" | "baixa";

/** Quanto uma afirmação está sustentada — separa fato de narrativa. */
export type NivelDeEvidencia =
	| "documentada"
	| "declaracao_do_profissional"
	| "inferencia_estrategica";

/**
 * Estado epistêmico de um dado.
 *
 * Existe para que uma lacuna seja representável sem ser preenchida por
 * inferência: `a_confirmar` é um valor legítimo do modelo, não um `undefined`.
 */
export type Certeza<T> =
	| { estado: "confirmado"; valor: T }
	| { estado: "a_confirmar" };
