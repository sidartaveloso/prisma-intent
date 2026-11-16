/**
 * Máquinas de estado do domínio.
 *
 * Cinco ciclos de vida independentes. Um único campo `status` que misture dois
 * deles produz estados que avançam em ritmos diferentes disputando o mesmo
 * lugar.
 *
 * Cada máquina é uma união de literais mais uma tabela de transições. A tabela
 * é dado: `transicaoValida` a consulta, e o teste do pacote confere que todo
 * estado é alcançável e que os terminais não têm saída.
 *
 * O ciclo de vida da relação de alguém com um produto — chegada, configuração,
 * pausa — não está aqui: é de cada produto.
 */

/** (a) História: do brief à memória. */
export type EstadoDaHistoria =
	| "brief_definido"
	| "roteirizada"
	| "produzida"
	| "conferida"
	| "curada"
	| "devolvida"
	| "publicada"
	| "vivida"
	| "lembrada"
	| "retirada";

/** (b) Missão física: a confirmação de quem acompanha é o portão de `liberada`. */
export type EstadoDaMissao =
	| "proposta"
	| "enviada_a_quem_acompanha"
	| "preparada"
	| "liberada"
	| "em_andamento"
	| "cumprida"
	| "incorporada"
	| "recusada"
	| "expirada";

/** (c) Item da rotina. `ignorado` é efeito, não julgamento. */
export type EstadoDoItemDaRotina =
	| "previsto"
	| "acionado"
	| "atendido"
	| "adiado"
	| "ignorado";

/** (d) Contexto do que um grupo está estudando. Só `ativo` alimenta histórias. */
export type EstadoDoContexto =
	| "informado_pela_instituicao"
	| "estruturado"
	| "ativo"
	| "consumido"
	| "retornado"
	| "arquivado";

/** (e) Conteúdo no catálogo: três decisores, três estados encadeados. */
export type EstadoDoConteudo =
	| "proposto"
	| "avaliado"
	| "curado"
	| "recusado"
	| "permitido_por_quem_decide"
	| "recomendado_agora"
	| "bloqueado_por_quem_decide";

export type Transicoes<TEstado extends string> = {
	readonly [K in TEstado]: readonly TEstado[];
};

export const transicoesDaHistoria: Transicoes<EstadoDaHistoria> = {
	brief_definido: ["roteirizada"],
	roteirizada: ["produzida"],
	produzida: ["conferida"],
	conferida: ["curada", "devolvida"],
	devolvida: ["roteirizada"],
	curada: ["publicada"],
	publicada: ["vivida", "retirada"],
	vivida: ["lembrada", "retirada"],
	lembrada: ["retirada"],
	retirada: [],
};

export const transicoesDaMissao: Transicoes<EstadoDaMissao> = {
	proposta: ["enviada_a_quem_acompanha"],
	enviada_a_quem_acompanha: ["preparada", "recusada", "expirada"],
	preparada: ["liberada"],
	liberada: ["em_andamento"],
	em_andamento: ["cumprida"],
	cumprida: ["incorporada"],
	incorporada: [],
	recusada: [],
	expirada: [],
};

export const transicoesDoItemDaRotina: Transicoes<EstadoDoItemDaRotina> = {
	previsto: ["acionado"],
	acionado: ["atendido", "adiado", "ignorado"],
	adiado: ["acionado"],
	atendido: [],
	ignorado: [],
};

export const transicoesDoContexto: Transicoes<EstadoDoContexto> = {
	informado_pela_instituicao: ["estruturado"],
	estruturado: ["ativo"],
	ativo: ["consumido", "arquivado"],
	consumido: ["retornado"],
	retornado: ["arquivado"],
	arquivado: [],
};

export const transicoesDoConteudo: Transicoes<EstadoDoConteudo> = {
	proposto: ["avaliado"],
	avaliado: ["curado", "recusado"],
	curado: ["permitido_por_quem_decide"],
	permitido_por_quem_decide: ["recomendado_agora", "bloqueado_por_quem_decide"],
	recomendado_agora: ["bloqueado_por_quem_decide"],
	bloqueado_por_quem_decide: ["permitido_por_quem_decide"],
	recusado: [],
};

/** Consulta uma tabela de transições. */
export function transicaoValida<TEstado extends string>(
	transicoes: Transicoes<TEstado>,
	de: TEstado,
	para: TEstado,
): boolean {
	return transicoes[de].includes(para);
}
