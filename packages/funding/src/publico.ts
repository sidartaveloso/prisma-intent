import type { Consumidor } from "@prisma-intent/core";
import type {
	IntencaoDoConsumidor,
	PerfilAgente,
	PerfilHumano,
} from "./vocabulario.ts";

/** Consumidor do core com os vocabulários da Funding. */
export type ConsumidorFunding<TArgumento extends string = string> = Consumidor<
	PerfilHumano,
	PerfilAgente,
	IntencaoDoConsumidor,
	TArgumento
>;
