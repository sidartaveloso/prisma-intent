/**
 * Se a atuação da pessoa em um case está em curso.
 *
 * A pergunta parece trivial e não é: um produto pode seguir em produção depois
 * que ela saiu, e ela pode continuar num produto cuja empresa não a emprega
 * mais. "Lidero" e "liderei" dependem da atuação dela, não do estado do
 * produto — e escrever no presente algo que terminou é o tipo de imprecisão que
 * um entrevistador cobra.
 *
 * Duas fontes respondem, nesta ordem:
 *
 * 1. o próprio case, quando declara `atuacao` — é o caso de um produto ao qual
 *    ela voltou como prestadora depois de o vínculo com a organização encerrar;
 * 2. a experiência correspondente à organização do case — os produtos de uma
 *    empresa seguem sob a liderança dela enquanto ela segue na empresa.
 *
 * Sem nenhuma das duas, a resposta é `indeterminada`: não afirmar é melhor do
 * que afirmar no tempo errado.
 */
import type { CaseProfissional } from "./case-profissional.ts";
import type { InstanciaWork } from "./instancia.ts";

export type EstadoDaAtuacao = "atual" | "encerrada" | "indeterminada";

export function estadoDaAtuacao(
	instancia: InstanciaWork,
	caseProfissional: CaseProfissional<string>,
): EstadoDaAtuacao {
	/**
	 * O produto parar de operar encerra a liderança nele, mesmo que o vínculo
	 * com a organização continue — é o caso de um projeto desativado: a atuação
	 * na organização segue (por ela, outro produto está em curso), mas o projeto
	 * em si não está mais ativo. `contexto.estado` é o único lugar que registra isso,
	 * e até aqui nada o lia — o campo existia sem efeito.
	 */
	if (caseProfissional.contexto.estado === "encerrado") return "encerrada";

	if (caseProfissional.atuacao) {
		return caseProfissional.atuacao.periodo.fim === null
			? "atual"
			: "encerrada";
	}

	const organizacao =
		caseProfissional.contexto.organizacao ?? caseProfissional.contexto.cliente;
	if (!organizacao) return "indeterminada";

	const experiencia = instancia.experiencias.find(
		(candidata) => candidata.organizacao === organizacao,
	);
	if (!experiencia) return "indeterminada";

	return experiencia.estado === "atual" ? "atual" : "encerrada";
}

/** Cases em que a pessoa atua hoje, na ordem em que a instância os declara. */
export function casesEmAndamento(
	instancia: InstanciaWork,
): CaseProfissional<string>[] {
	return instancia.cases.filter(
		(caseProfissional) =>
			estadoDaAtuacao(instancia, caseProfissional) === "atual",
	);
}
