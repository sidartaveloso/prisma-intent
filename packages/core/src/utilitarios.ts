/**
 * Utilitários de tipo do PRISMA Intent.
 *
 * Regra da casa: se dois valores têm significados de domínio diferentes, eles
 * não devem compartilhar um tipo apenas por terem a mesma representação
 * primitiva. `Marca` existe para isso — e só deve ser usada onde não há um
 * vocabulário literal melhor.
 */

/** Tipo "marcado" (branded): distingue ids que são `string` em runtime. */
export type Marca<T, S extends string> = T & { readonly __marca: S };

/** Lista com pelo menos um elemento. */
export type PeloMenosUm<T> = readonly [T, ...T[]];

/** Auxiliar de exaustividade em `switch` sobre uniões discriminadas. */
export type GarantirExaustividade<T extends never> = T;

/**
 * Texto em português destinado a leitura humana.
 *
 * Não é um alias decorativo: marca os pontos em que o modelo carrega
 * *redação* — o único lugar onde `string` livre é legítima. Todo o resto do
 * PRISMA Intent deve usar vocabulário literal.
 */
export type Redacao = string;
