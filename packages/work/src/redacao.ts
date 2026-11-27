/**
 * Redação derivada da instância.
 *
 * Transformar autoria em verbo e métrica em frase é decisão de domínio, não de
 * cada renderizador: se o currículo e o site fizessem isso por conta própria,
 * diriam a mesma coisa de dois jeitos — e um dos dois acabaria contrariando uma
 * restrição editorial.
 */
import type { CaseProfissional } from "./case-profissional.ts";
import type {
	Autoria,
	Dedicacao,
	Frente,
	Quantidade,
	Vinculo,
} from "./experiencia.ts";
import type { Unidade } from "./vocabulario.ts";

/** Rótulo legível de cada unidade, para uso em texto corrido. */
export const rotuloDeUnidade: Record<
	Unidade,
	{ singular: string; plural: string }
> = {
	minutos: { singular: "minuto", plural: "minutos" },
	horas: { singular: "hora", plural: "horas" },
	dias: { singular: "dia", plural: "dias" },
	anos: { singular: "ano", plural: "anos" },
	projetos: { singular: "projeto", plural: "projetos" },
	estados: { singular: "estado", plural: "estados" },
	percentual: { singular: "%", plural: "%" },
	pessoas: { singular: "pessoa", plural: "pessoas" },
	veiculos: { singular: "veículo", plural: "veículos" },
	dispositivos: { singular: "dispositivo", plural: "dispositivos" },
	usuarios: { singular: "usuário", plural: "usuários" },
	documentos: { singular: "documento", plural: "documentos" },
	registros: { singular: "registro", plural: "registros" },
	unidades_da_federacao: {
		singular: "unidade da federação",
		plural: "unidades da federação",
	},
	organizacoes: { singular: "organização", plural: "organizações" },
};

const formatarQuantidade = (valor: number, unidade: Unidade): string => {
	const rotulo = rotuloDeUnidade[unidade];
	const texto = valor === 1 ? rotulo.singular : rotulo.plural;
	return unidade === "percentual"
		? `${valor.toLocaleString("pt-BR")}%`
		: `${valor.toLocaleString("pt-BR")} ${texto}`;
};

const nomeDoVinculo: Record<Vinculo["tipo"], string> = {
	clt: "CLT",
	pj: "PJ",
	socio: "sócio",
	estagio: "estágio",
	temporario: "temporário",
};

/** Vínculo e carga, quando há o que declarar além do padrão. */
export function descreverVinculo(
	vinculo?: Vinculo,
	dedicacao?: Dedicacao,
): string | null {
	const partes: string[] = [];
	if (vinculo) {
		// A empresa de faturamento só entra quando há equipe por trás dela; se a
		// execução é pessoal, citá-la sugeriria uma estrutura que não existe.
		partes.push(
			vinculo.tipo === "pj" && vinculo.por && vinculo.execucao !== "pessoal"
				? `PJ pela ${vinculo.por}`
				: nomeDoVinculo[vinculo.tipo],
		);
	}
	if (dedicacao?.tipo === "parcial") {
		const advérbio = dedicacao.precisao === "aproximada" ? "cerca de " : "";
		partes.push(`${advérbio}${dedicacao.horasSemanais}h semanais`);
	}
	return partes.length > 0 ? partes.join(" · ") : null;
}

/** Quantidade com o advérbio que a precisão declarada exige. */
export function descreverQuantidade(
	quantidade: Quantidade,
	substantivo: string,
): string {
	const valor = quantidade.valor.toLocaleString("pt-BR");
	switch (quantidade.tipo) {
		case "exata":
			return `${valor} ${substantivo}`;
		case "aproximada":
			return `cerca de ${valor} ${substantivo}`;
		case "minima":
			return `mais de ${valor} ${substantivo}`;
		case "maxima":
			return `até ${valor} ${substantivo}`;
	}
}

/**
 * Verbo de cada frente, conforme o grau de autoria.
 *
 * `null` significa que a pessoa não pode ser sujeito da frase — projeto
 * eletrônico de terceiro e biblioteca incorporada saem do texto em vez de
 * ganharem um verbo vago.
 */
export function verboDaFrente(
	frente: Frente["frente"],
	autoria: Autoria,
): string | null {
	switch (autoria.grau) {
		case "direta":
			return {
				produto: "concebi",
				arquitetura: "arquitetei",
				software: "desenvolvi",
				firmware: "desenvolvi",
				hardware: "concebi",
				eletronica: "projetei",
				infraestrutura: "montei",
				visao_computacional: "integrei",
			}[frente];
		case "compartilhada":
			return "idealizei em conjunto";
		case "lideranca":
			return "liderei";
		case "de_terceiro":
		case "tecnologia_incorporada":
			return null;
	}
}

const nomeDaFrente: Record<Frente["frente"], string> = {
	produto: "o produto",
	arquitetura: "o sistema",
	software: "o software",
	firmware: "o firmware",
	hardware: "o hardware",
	eletronica: "a eletrônica",
	infraestrutura: "a infraestrutura",
	visao_computacional: "a visão computacional",
};

/** Une as frentes de um mesmo verbo em português ("a e b", "a, b e c"). */
function unirFrentes(frentes: string[]): string {
	if (frentes.length <= 1) return frentes.join("");
	if (frentes.length === 2) return `${frentes[0]} e ${frentes[1]}`;
	return `${frentes.slice(0, -1).join(", ")} e ${frentes[frentes.length - 1]}`;
}

/** Participação da pessoa no case, com a autoria preservada. */
export function descreverParticipacao(
	caseProfissional: CaseProfissional<string>,
): string {
	const porVerbo = new Map<string, string[]>();
	for (const { frente, autoria } of caseProfissional.frentes) {
		const verbo = verboDaFrente(frente, autoria);
		if (!verbo) continue;
		porVerbo.set(verbo, [...(porVerbo.get(verbo) ?? []), nomeDaFrente[frente]]);
	}
	return [...porVerbo]
		.map(([verbo, frentes]) => `${verbo} ${unirFrentes(frentes)}`)
		.join("; ");
}

/**
 * Resultados na formulação já conferida contra as restrições do case.
 *
 * As frases da instância são escritas sem sujeito explícito, para servirem
 * tanto ao currículo (terceira pessoa) quanto ao site (primeira pessoa).
 */
export function descreverResultados(
	caseProfissional: CaseProfissional<string>,
): string[] {
	return (caseProfissional.resultados ?? []).flatMap((resultado) => {
		switch (resultado.tipo) {
			case "metrica":
				return [
					resultado.redacaoSegura ??
						`${resultado.nome}: ${formatarQuantidade(resultado.valor, resultado.unidade)}`,
				];
			case "metrica_minima":
				return [
					resultado.redacaoSegura ??
						`${resultado.nome}: mais de ${formatarQuantidade(resultado.valorMinimo, resultado.unidade)}`,
				];
			case "resultado_operacional":
				return [resultado.descricao];
			default:
				return [];
		}
	});
}

/** Escala do case como frases quantificadas. */
export function descreverEscala(
	caseProfissional: CaseProfissional<string>,
): string[] {
	return (caseProfissional.escala ?? []).flatMap((evidencia) => {
		if (evidencia.tipo === "metrica") {
			return [
				evidencia.redacaoSegura ??
					`${formatarQuantidade(evidencia.valor, evidencia.unidade)} — ${evidencia.nome}`,
			];
		}
		if (evidencia.tipo === "metrica_minima") {
			return [
				evidencia.redacaoSegura ??
					`mais de ${formatarQuantidade(evidencia.valorMinimo, evidencia.unidade)} — ${evidencia.nome}`,
			];
		}
		return [];
	});
}
