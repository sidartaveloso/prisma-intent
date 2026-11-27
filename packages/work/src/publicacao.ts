/**
 * O que uma instância nunca pode publicar.
 *
 * A instância guarda duas camadas: o que se quer comunicar e o **raciocínio
 * para comunicar** — objeções a neutralizar, regras do que não afirmar,
 * estratégia editorial, experiências reservadas. A segunda camada é
 * instrumento de trabalho, e chegar ao público a transforma em informação
 * sobre quem a escreveu.
 *
 * A lista é derivada da instância, e não escrita à mão: uma objeção nova ou
 * uma reserva nova passa a ser verificada sem que ninguém lembre de atualizar
 * nada.
 */
import type { InstanciaWork } from "./instancia.ts";

export interface TermoReservado {
	termo: string;
	/** De onde ele vem — o que aparece no relatório de falha. */
	origem: string;
}

export function termosNaoPublicaveis(
	instancia: InstanciaWork,
): TermoReservado[] {
	const termos: TermoReservado[] = [
		{
			termo: instancia.instancia.id,
			origem: "id da instância (nomeia a oportunidade)",
		},
	];

	for (const objecao of instancia.objecoes) {
		termos.push({ termo: objecao.id, origem: "id de objeção" });
		termos.push({
			termo: objecao.hipotese,
			origem: `hipótese de "${objecao.id}"`,
		});
	}

	for (const regra of instancia.regrasDeIntegridade) {
		termos.push({ termo: regra.regra, origem: `regra "${regra.id}"` });
	}

	for (const experiencia of instancia.experiencias) {
		if (!experiencia.reserva) continue;
		termos.push({
			termo: experiencia.organizacao,
			origem: `experiência reservada — ${experiencia.reserva.motivo}`,
		});
	}

	for (const caseProfissional of instancia.cases) {
		for (const restricao of caseProfissional.restricoesEditoriais ?? []) {
			termos.push({
				termo: restricao,
				origem: `restrição editorial de "${caseProfissional.id}"`,
			});
		}
	}

	for (const excluido of instancia.casesExcluidos) {
		termos.push({
			termo: excluido.motivo.descricao,
			origem: `motivo de exclusão de "${excluido.id}"`,
		});
	}

	// Termos curtos demais casariam por acaso em qualquer bundle minificado.
	return termos.filter(({ termo }) => termo.length >= 8);
}
