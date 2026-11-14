/**
 * Instância PRISMA Intent Sales: a proposta comercial.
 *
 * Uma instância é a base única da qual saem o site, o PDF, a planilha de
 * preços, a matriz de conformidade, o resumo executivo e a mensagem de envio.
 * Ela carrega também o que nenhuma saída pode mostrar — entendimento,
 * estimativas, objeções, premissas em aberto —, e por isso **nada empacotado
 * importa a instância**: a derivação acontece em Node, e o que chega ao
 * navegador é conteúdo já renderizado (ver o `AGENTS.md` da raiz).
 *
 * Os parâmetros de tipo existem para o compilador conferir as referências
 * cruzadas, como em `definirInstancia` da Work. Os ids são inferidos do
 * próprio dado — leitores, organizações, argumentos, evidências, pacotes,
 * requisitos, marcos e efeitos comportamentais —, e o `NoInfer` nas posições
 * de referência faz um id errado ser recusado em vez de absorvido pela
 * inferência.
 */
import type {
	Argumento,
	Objecao,
	PeloMenosUm,
	Redacao,
	RegraDeIntegridade,
} from "@prisma-intent/core";
import type { Cronograma } from "./cronograma.ts";
import type { PacoteDeTrabalho, Requisito } from "./escopo.ts";
import type { EvidenciaSales, ReferenciaSales } from "./evidencia.ts";
import type { IntencaoDaProposta, ObservacaoDosEfeitos } from "./intencao.ts";
import type {
	LeitorDaProposta,
	OrganizacaoEnvolvida,
	PerguntaAOrganizacao,
} from "./leitor.ts";
import type { PrecoDaProposta } from "./linha-de-preco.ts";
import type { RenderizacaoSales } from "./renderizacao.ts";
import type {
	EfeitoComportamental,
	IdiomaDePublicacao,
} from "./vocabulario.ts";

export interface InstanciaSales<
	TLeitor extends string = string,
	TOrganizacao extends string = string,
	TArgumento extends string = string,
	TEvidencia extends string = string,
	TPacote extends string = string,
	TRequisito extends string = string,
	TMarco extends string = string,
	TComportamental extends EfeitoComportamental = EfeitoComportamental,
> {
	schemaVersion: `${number}.${number}.${number}`;
	produto: {
		nome: "PRISMA Intent";
		descricao: "Narrativa Semântica Adaptativa orientada por intenção";
		especializacao: "sales";
	};
	instancia: {
		id: Redacao;
		tipo: "proposta_comercial";
		estado: "rascunho" | "enviada" | "arquivada";
		/**
		 * Idioma em que os textos da instância estão escritos. Uma proposta
		 * pode ser escrita direto no idioma do leitor; as regras de integridade
		 * precisam de padrões nesse idioma.
		 */
		idiomaBase: IdiomaDePublicacao;
	};
	/** Quem apresenta a proposta. */
	proponente: { nome: Redacao };
	organizacoes: PeloMenosUm<OrganizacaoEnvolvida<TOrganizacao>>;

	leitores: PeloMenosUm<
		LeitorDaProposta<TLeitor, NoInfer<TOrganizacao>, NoInfer<TArgumento>>
	>;
	intencoes: PeloMenosUm<IntencaoDaProposta<TComportamental, NoInfer<TLeitor>>>;
	/** Como cada efeito comportamental desejado é observado. */
	observacaoDosEfeitos: ObservacaoDosEfeitos<NoInfer<TComportamental>>;

	argumentos: readonly Argumento<
		TArgumento,
		ReferenciaSales<NoInfer<TEvidencia>, NoInfer<TPacote>, NoInfer<TRequisito>>
	>[];
	evidencias: readonly EvidenciaSales<TEvidencia, NoInfer<TRequisito>>[];
	objecoes: readonly Objecao<
		string,
		ReferenciaSales<NoInfer<TEvidencia>, NoInfer<TPacote>, NoInfer<TRequisito>>
	>[];

	escopo: {
		pacotes: PeloMenosUm<PacoteDeTrabalho<TPacote, NoInfer<TOrganizacao>>>;
		/** Um requisito por identificador do documento do cliente. */
		requisitos: readonly Requisito<
			TRequisito,
			NoInfer<TPacote>,
			NoInfer<TOrganizacao>
		>[];
	};
	cronograma: Cronograma<TMarco, NoInfer<TPacote>>;
	preco: PrecoDaProposta<NoInfer<TMarco>>;
	/** O que ainda depende de resposta de uma organização envolvida. */
	perguntas: readonly PerguntaAOrganizacao<NoInfer<TOrganizacao>>[];

	renderizacoes: PeloMenosUm<RenderizacaoSales<NoInfer<TLeitor>>>;
	/** O limite que nenhuma renderização atravessa. */
	regrasDeIntegridade: readonly RegraDeIntegridade<string>[];
}

/**
 * Declara uma instância inferindo os ids literais do próprio dado, para que
 * toda referência a leitor, organização, argumento, evidência, pacote,
 * requisito ou marco inexistente seja erro de compilação — e para que cada
 * efeito comportamental desejado tenha a sua observação.
 */
export function definirInstancia<
	const TLeitor extends string,
	const TOrganizacao extends string,
	const TArgumento extends string,
	const TEvidencia extends string,
	const TPacote extends string,
	const TRequisito extends string,
	const TMarco extends string,
	const TComportamental extends EfeitoComportamental,
>(
	instancia: InstanciaSales<
		TLeitor,
		TOrganizacao,
		TArgumento,
		TEvidencia,
		TPacote,
		TRequisito,
		TMarco,
		TComportamental
	>,
): InstanciaSales<
	TLeitor,
	TOrganizacao,
	TArgumento,
	TEvidencia,
	TPacote,
	TRequisito,
	TMarco,
	TComportamental
> {
	return instancia;
}
