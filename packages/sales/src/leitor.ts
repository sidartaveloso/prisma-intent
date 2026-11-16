/**
 * Leitor da proposta e organizações envolvidas.
 *
 * O core descreve o consumidor por perfil e intenção. Uma proposta acrescenta
 * duas coisas que mudam a leitura:
 *
 * - **a organização** do leitor. A proposta pode chegar a mais de uma — a que
 *   contrata o proponente e a que recebe a solução — e o mesmo perfil lê por
 *   critérios diferentes em cada uma. A organização é declarada uma vez, com o
 *   papel, e o leitor a cita; o compilador recusa uma organização inexistente;
 * - **o que ele vê**: a profundidade e as seções ocultas. É onde se declara,
 *   por exemplo, que só quem decide comercialmente vê o preço.
 *
 * Nada disso mudou o core: o leitor é o `Consumidor` do core com esses campos.
 */
import type {
	Certeza,
	Consumidor,
	PeloMenosUm,
	Profundidade,
	Redacao,
} from "@prisma-intent/core";
import type {
	IntencaoDoConsumidor,
	PapelDaOrganizacao,
	PerfilAgente,
	PerfilHumano,
	SecaoDaProposta,
} from "./vocabulario.ts";

/** O consumidor do core com os vocabulários desta especialização. */
export type ConsumidorSales<TArgumento extends string = string> = Consumidor<
	PerfilHumano,
	PerfilAgente,
	IntencaoDoConsumidor,
	TArgumento
>;

/** Organização que lê a proposta ou participa da entrega. */
export type OrganizacaoEnvolvida<TOrganizacao extends string = string> = {
	id: TOrganizacao;
	nome: Redacao;
	papel: PapelDaOrganizacao;
};

/** Um leitor endereçado: perfil, organização e o que vê. */
export type LeitorDaProposta<
	TLeitor extends string = string,
	TOrganizacao extends string = string,
	TArgumento extends string = string,
> = ConsumidorSales<TArgumento> & {
	id: TLeitor;
	organizacao: TOrganizacao;
	/** Quanto detalhe técnico a saída abre para este leitor. */
	profundidade: Profundidade;
	/** Seções que este leitor não vê. Vazio: vê todas. */
	secoesOcultas: readonly SecaoDaProposta[];
};

/** Pergunta aberta a uma organização envolvida, que a mensagem de envio leva. */
export type PerguntaAOrganizacao<TOrganizacao extends string = string> = {
	id: string;
	dirigidaA: TOrganizacao;
	pergunta: Redacao;
	/** O que a pergunta decide na proposta: premissa, pacote, requisito. */
	afeta: PeloMenosUm<Redacao>;
	resposta: Certeza<Redacao>;
};
