/**
 * Carrega a instância de um módulo de quem usa o pacote.
 *
 * Este pacote não guarda instância nenhuma: ela é de quem a declara, e mora no
 * repositório dessa pessoa. Os scripts daqui recebem o caminho do módulo e
 * procuram nele a exportação que é uma instância Work — por nome nenhum em
 * particular, para não impor convenção a quem já tem a sua.
 */
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { InstanciaWork } from "../src/instancia.ts";

function pareceInstancia(valor: unknown): valor is InstanciaWork {
	if (typeof valor !== "object" || valor === null) return false;
	const { produto } = valor as { produto?: { especializacao?: unknown } };
	return produto?.especializacao === "work";
}

export async function carregarInstancia(
	caminho: string,
): Promise<InstanciaWork> {
	const modulo: Record<string, unknown> = await import(
		pathToFileURL(resolve(caminho)).href
	);
	const candidatas = [
		...new Set(Object.values(modulo).filter(pareceInstancia)),
	];
	const [instancia] = candidatas;
	if (!instancia) {
		throw new Error(`nenhuma instância Work exportada por ${caminho}.`);
	}
	if (candidatas.length > 1) {
		throw new Error(
			`${caminho} exporta ${candidatas.length} instâncias; aponte para um módulo que exporte uma só.`,
		);
	}
	return instancia;
}
