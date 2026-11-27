/**
 * # PRISMA Intent
 * **Narrativa Semântica Adaptativa orientada por intenção**
 *
 * Este pacote é o núcleo: modela **como uma mensagem ganha intenção**. As
 * especializações (`@prisma-intent/work`, futuramente `sales`) modelam **o que
 * aquela mensagem significa em cada domínio**.
 *
 * Regra arquitetural: o core nunca conhece conceitos de uma especialização.
 * Ele não sabe o que é currículo, vaga, recrutador, produto ou preço. Os tipos
 * daqui são genéricos justamente para que cada domínio forneça o próprio
 * vocabulário sem devolver dependência para cá.
 *
 * ```text
 * Work ──────┐
 *            ├──► Core
 * Sales ─────┘
 * ```
 */
export type { Argumento } from "./argumento.ts";
export type {
	Consumidor,
	NecessidadeSemantica,
	TipoDeConsumidor,
} from "./consumidor.ts";
export type { Contexto, Profundidade } from "./contexto.ts";
export type { CriterioDeDecisao } from "./criterio.ts";
export type { Evidencia } from "./evidencia.ts";
export type {
	Lacuna,
	NaturezaDaRegra,
	RegraDeIntegridade,
	Violacao,
} from "./integridade.ts";
export { verificarRegras } from "./integridade.ts";
export type { EfeitosDesejados, NossaIntencao } from "./intencao.ts";
export type {
	ConteudoRenderizavel,
	Interno,
	TextoInterno,
} from "./interno.ts";
export { garantirRenderizavel, interno } from "./interno.ts";
export type {
	AtivoVisual,
	EstrategiaNarrativa,
	Variante,
} from "./narrativa.ts";
export type { Objecao, RespostaEstrategica } from "./objecao.ts";
export type { ObservacaoDosEfeitos } from "./observacao.ts";
export type {
	Data,
	DecisaoRegistrada,
	Premissa,
	ValorDaPremissa,
} from "./premissa.ts";
export { valorDaPremissa } from "./premissa.ts";
export type { Certeza, NivelDeEvidencia, Prioridade } from "./prioridade.ts";
export type { Procedencia } from "./procedencia.ts";
export type { Renderizacao } from "./renderizacao.ts";
export type {
	AtributoDeclarado,
	AtributosDaTag,
	PresencaDoAtributo,
	RegistroDeTipos,
	Tag,
	TagNoTexto,
	TipoDeElemento,
	Trecho,
	ValoresDoAtributo,
} from "./tag.ts";
export { registrarTipos } from "./tag.ts";
export type {
	GarantirExaustividade,
	Marca,
	PeloMenosUm,
	Redacao,
} from "./utilitarios.ts";
export type { Termo, Vocabulario } from "./vocabulario.ts";
export { definirVocabulario } from "./vocabulario.ts";
