/**
 * Conferência — a instância lida de volta para quem a preencheu.
 *
 * A instância se defende de dois lados: `verificarRegras` confere o texto
 * gerado contra o que **não pode** ser dito, e `lacunas` registra o que **não
 * se sabe**. Faltava o terceiro: ninguém lia de volta o que **está sendo
 * afirmado**.
 *
 * Três erros de 2026-09-19 nasceram nesse vão, e nenhum é violação de regra
 * nem lacuna — um reconhecimento perdeu o sujeito ao mudar de título, uma
 * liderança morava na organização errada e um piso publicava mais do que a
 * fonte sustenta. Os dois primeiros só são visíveis quando o fato é lido
 * **junto do cabeçalho sob o qual ele sai**, porque o dado isolado está certo
 * nos dois casos. É por isso que este módulo produz `marcas` em vez de
 * frases prontas: quem confere precisa localizar o fato no texto publicado de
 * verdade, não numa segunda derivação que pode divergir da primeira.
 *
 * Aqui mora só o que depende da instância. Encontrar as marcas no que cada
 * canal publicou é trabalho de quem enxerga os canais — o work não os conhece,
 * e a dependência nunca aponta para `apps/`.
 */
import type {
	Evidencia,
	NivelDeEvidencia,
	Procedencia,
	Redacao,
} from "@prisma-intent/core";
import type { Quantidade } from "./experiencia.ts";
import type { InstanciaWork } from "./instancia.ts";
import { descreverQuantidade } from "./redacao.ts";
import type { Unidade } from "./vocabulario.ts";

/** Um fato publicável da instância, pronto para ser conferido. */
export interface Afirmacao {
	/** Caminho na instância — é o que a pessoa vai abrir para corrigir. */
	onde: string;
	/** De que fato se trata, em uma linha. */
	assunto: string;
	/** O dado como está declarado, em português. */
	declarado: string;
	/**
	 * Trechos pelos quais este fato é reconhecível no texto publicado.
	 *
	 * Não é a frase final — é o pedaço estável dela. O substantivo muda com o
	 * canal ("programadores" no site, "veículos" num case), o advérbio não.
	 */
	marcas: readonly string[];
	nivel?: NivelDeEvidencia;
	/** De onde o fato veio, quando declarado. */
	procedencia?: Procedencia;
	/**
	 * Se a falta de procedência é cobrável.
	 *
	 * Número publicado precisa apontar para a fonte; `nivel` diz como se sabe,
	 * não de onde. Já um resultado operacional descrito em prosa não tem número
	 * para conferir, e exigir citação dele encheria a instância de campos
	 * preenchidos por obrigação — que é como um campo de auditoria vira teatro.
	 */
	exigeProcedencia: boolean;
	/** Sugestões de formulação. Conselho, nunca transformação — ver `aconselhar`. */
	conselhos: readonly string[];
}

/** Identificador estável de uma afirmação, para casar com `lacunas`. */
export function idDaLacunaDeFonte(afirmacao: Afirmacao): string {
	const legivel = afirmacao.assunto
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "_")
		.replace(/^_|_$/g, "");
	return `fonte_de_${legivel}`;
}

/**
 * O pedaço estável da frase que uma quantidade produz.
 *
 * `descreverQuantidade` devolve "mais de 15 programadores"; o substantivo é
 * escolha de cada canal, então buscar por ele erraria sempre que dois canais
 * discordassem. O advérbio e o número são o que sobrevive à travessia.
 */
function marcaDaQuantidade(quantidade: Quantidade): string {
	return descreverQuantidade(quantidade, "").trim();
}

function descreverDeclaracao(quantidade: Quantidade): string {
	const valor = quantidade.valor.toLocaleString("pt-BR");
	switch (quantidade.tipo) {
		case "exata":
			return `exatamente ${valor}`;
		case "aproximada":
			return `por volta de ${valor}`;
		case "minima":
			return `piso de ${valor}`;
		case "maxima":
			return `teto de ${valor}`;
	}
}

/**
 * Conselhos de formulação para uma quantidade.
 *
 * Conselho, nunca transformação. `Quantidade` existe para que a pessoa declare
 * a precisão da afirmação, e o JSDoc do tipo avisa que um número solto faz
 * "quem renderiza escolher o advérbio por conta" — um arredondador automático
 * é exatamente isso de volta, com a assinatura da ferramenta em cima, o que é
 * pior porque parece conferido.
 *
 * E "melhor" não é computável fora de uma faixa estreita: 19 → "mais de 15"
 * funciona, 200 → "mais de 150" é ridículo, 3 → "mais de 0" é absurdo. Uma
 * heurística que sugere erra de graça — a pessoa ignora a linha. Uma que
 * transforma, um dia rebaixa um número que importava e ninguém percebe, porque
 * a saída continua plausível.
 */
export function aconselhar(
	quantidade: Quantidade,
	substantivo: string,
): string[] {
	const { tipo, valor } = quantidade;

	/**
	 * Um conselho por quantidade, no máximo.
	 *
	 * A primeira versão disparava dois em quase toda `minima` — "o piso é
	 * redondo" e "declare um número firme se souber" — e a saída virou uma
	 * coluna de avisos idênticos que ninguém lê. Conselho que aparece sempre
	 * não é conselho, é decoração; e o custo de errar aqui é a pessoa parar de
	 * ler as linhas ↑, inclusive as que importam.
	 *
	 * O que falta para aconselhar `minima` com precisão é a procedência: sem o
	 * trecho da fonte, esta função não tem como saber se "mais de 2.000
	 * veículos" está fiel ou tímido. Enquanto ela não ler a procedência,
	 * `minima` passa em silêncio.
	 */
	if (tipo === "aproximada") {
		return [
			`"cerca de ${valor.toLocaleString("pt-BR")} ${substantivo}" pede desculpa pelo próprio número. Um piso ("minima") abaixo do valor afirma menos e soa mais forte, porque deixa o teto em aberto.`,
		];
	}

	if (tipo === "exata" && valor > 10) {
		return [
			`publicado como número exato. Se a lembrança não for firme, "aproximada" evita precisão que a fonte não tem — e um piso ("minima") soa mais forte que ambos.`,
		];
	}

	return [];
}

/**
 * Por onde uma métrica é reconhecível no texto publicado.
 *
 * A `redacaoSegura` vem primeiro porque é a frase literal que o canal imprime —
 * casar por ela não erra. O número sozinho erra: "4 organizacoes" de um case
 * casou com "4 mil usuários" de outro e a conferência anunciou a métrica de
 * uma empresa sob o título de outra. Número de um dígito não distingue nada,
 * então só entra como marca quando não há redação segura para usar no lugar —
 * e aí o trecho impresso ao redor deixa o engano visível para quem lê.
 */
function marcasDaMetrica(valor: number, redacaoSegura?: Redacao): string[] {
	if (redacaoSegura) return [redacaoSegura];
	const numero = valor.toLocaleString("pt-BR");
	return numero.length > 1 ? [numero] : [];
}

function afirmacaoDaEvidencia(
	evidencia: Evidencia<Unidade>,
	onde: string,
): Afirmacao | null {
	switch (evidencia.tipo) {
		case "metrica":
			return {
				onde,
				assunto: evidencia.nome,
				declarado: `exatamente ${evidencia.valor.toLocaleString("pt-BR")} ${evidencia.unidade}`,
				marcas: marcasDaMetrica(evidencia.valor, evidencia.redacaoSegura),
				nivel: evidencia.nivel,
				procedencia: evidencia.procedencia,
				exigeProcedencia: true,
				conselhos: evidencia.redacaoSegura
					? []
					: [
							"não tem `redacaoSegura`: a frase publicada é montada pelo renderizador, e é aí que contribuição vira causalidade sem ninguém decidir.",
						],
			};
		case "metrica_minima":
			return {
				onde,
				assunto: evidencia.nome,
				declarado: `piso de ${evidencia.valorMinimo.toLocaleString("pt-BR")} ${evidencia.unidade}`,
				marcas: marcasDaMetrica(evidencia.valorMinimo, evidencia.redacaoSegura),
				nivel: evidencia.nivel,
				procedencia: evidencia.procedencia,
				exigeProcedencia: true,
				conselhos: aconselhar(
					{ tipo: "minima", valor: evidencia.valorMinimo },
					evidencia.unidade,
				),
			};
		case "reconhecimento":
			return {
				onde,
				assunto: "reconhecimento",
				declarado: evidencia.organizacao
					? `${evidencia.descricao} (de: ${evidencia.organizacao})`
					: evidencia.descricao,
				marcas: [evidencia.descricao],
				nivel: evidencia.nivel,
				procedencia: evidencia.procedencia,
				exigeProcedencia: false,
				conselhos: evidencia.organizacao
					? [
							`quem recebeu foi "${evidencia.organizacao}". Confira se a frase publicada nomeia esse sujeito — sem ele, quem lê atribui o reconhecimento ao título que estiver por perto.`,
						]
					: [],
			};
		case "resultado_operacional":
			return {
				onde,
				assunto: "resultado operacional",
				declarado: evidencia.descricao,
				marcas: [evidencia.descricao],
				nivel: evidencia.nivel,
				procedencia: evidencia.procedencia,
				exigeProcedencia: false,
				conselhos: [],
			};
		default:
			return null;
	}
}

/**
 * Todo fato publicável da instância, na ordem em que vale conferir.
 *
 * Liderança primeiro porque é o eixo do posicionamento, e foi onde os dois
 * erros de atribuição de 2026-09-19 aconteceram.
 */
export function coletarAfirmacoes(instancia: InstanciaWork): Afirmacao[] {
	const afirmacoes: Afirmacao[] = [];

	for (const experiencia of instancia.experiencias) {
		if (experiencia.lideranca) {
			const { quantidade, composicao } = experiencia.lideranca;
			afirmacoes.push({
				onde: `experiencias.${experiencia.id}.lideranca`,
				assunto: `${experiencia.organizacao} · liderança de time`,
				declarado: `${descreverDeclaracao(quantidade)} pessoas — ${composicao}`,
				marcas: [marcaDaQuantidade(quantidade)],
				procedencia: experiencia.lideranca.procedencia,
				exigeProcedencia: true,
				conselhos: [
					...aconselhar(quantidade, "pessoas"),
					`o fato é da ${experiencia.organizacao}. Confira o título sob o qual ele sai em cada canal: se for de outra organização, o leitor reatribui a liderança sem perceber.`,
				],
			});
		}

		for (const evidencia of experiencia.evidencias ?? []) {
			const afirmacao = afirmacaoDaEvidencia(
				evidencia,
				`experiencias.${experiencia.id}.evidencias`,
			);
			if (afirmacao) {
				afirmacoes.push({
					...afirmacao,
					assunto: `${experiencia.organizacao} · ${afirmacao.assunto}`,
				});
			}
		}
	}

	for (const caseProfissional of instancia.cases) {
		for (const [rotulo, lista] of [
			["escala", caseProfissional.escala],
			["resultados", caseProfissional.resultados],
			["evidencias", caseProfissional.evidencias],
		] as const) {
			for (const evidencia of lista ?? []) {
				const afirmacao = afirmacaoDaEvidencia(
					evidencia,
					`cases.${caseProfissional.id}.${rotulo}`,
				);
				if (afirmacao) {
					afirmacoes.push({
						...afirmacao,
						assunto: `${caseProfissional.nome} · ${afirmacao.assunto}`,
					});
				}
			}
		}
	}

	for (const evidencia of instancia.evidencias) {
		const afirmacao = afirmacaoDaEvidencia(evidencia, "evidencias");
		if (afirmacao) {
			afirmacoes.push(afirmacao);
		}
	}

	return afirmacoes;
}

/** Procedências declaradas, com o caminho de quem as declara. */
export function coletarProcedencias(
	instancia: InstanciaWork,
): { onde: string; assunto: string; procedencia: Procedencia }[] {
	return coletarAfirmacoes(instancia).flatMap((afirmacao) =>
		afirmacao.procedencia
			? [
					{
						onde: afirmacao.onde,
						assunto: afirmacao.assunto,
						procedencia: afirmacao.procedencia,
					},
				]
			: [],
	);
}

/**
 * Números publicados que ainda não apontam para uma fonte.
 *
 * Devolve ids de lacuna, não afirmações: o destino desta lista é ser conferida
 * contra `lacunas[]`, para que "ninguém verificou ainda" seja um estado
 * declarado do modelo em vez de um silêncio. Foi num silêncio desses que a
 * liderança de time sobreviveu meses pendurada na organização errada.
 */
export function afirmacoesSemProcedencia(instancia: InstanciaWork): string[] {
	return coletarAfirmacoes(instancia)
		.filter((afirmacao) => afirmacao.exigeProcedencia && !afirmacao.procedencia)
		.map(idDaLacunaDeFonte);
}
