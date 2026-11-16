/**
 * Evidência — o que sustenta um argumento.
 *
 * Cada natureza de evidência é verificável de um jeito distinto, então cada
 * uma tem sua própria forma. Um saco de campos opcionais (`valor?`,
 * `unidade?`, `fonte?`) aceitaria combinações sem sentido, como uma métrica
 * sem unidade ou uma fonte documental sem referência.
 */
import type { NivelDeEvidencia } from "./prioridade.ts";
import type { Procedencia } from "./procedencia.ts";
import type { Redacao } from "./utilitarios.ts";

export type Evidencia<TUnidade extends string> =
	| {
			tipo: "metrica";
			nome: Redacao;
			valor: number;
			unidade: TUnidade;
			/** Como o número foi definido — sem isso a métrica é irreproduzível. */
			definicao?: Redacao;
			/**
			 * Formulação já conferida contra as restrições editoriais do case.
			 *
			 * Existe para que o renderizador não precise inventar a frase: onde há
			 * risco de transformar contribuição em causalidade, a redação segura é
			 * dado, não decisão de quem escreve a saída.
			 */
			redacaoSegura?: Redacao;
			nivel: NivelDeEvidencia;
			/** De onde veio o número ou a frase — ver `Procedencia`. */
			procedencia?: Procedencia;
	  }
	| {
			tipo: "metrica_minima";
			nome: Redacao;
			valorMinimo: number;
			unidade: TUnidade;
			/** Como o número foi definido — sem isso a métrica é irreproduzível. */
			definicao?: Redacao;
			redacaoSegura?: Redacao;
			nivel: NivelDeEvidencia;
			/** De onde veio o número ou a frase — ver `Procedencia`. */
			procedencia?: Procedencia;
	  }
	| {
			tipo: "resultado_operacional";
			descricao: Redacao;
			nivel: NivelDeEvidencia;
			/** De onde veio o número ou a frase — ver `Procedencia`. */
			procedencia?: Procedencia;
	  }
	| {
			tipo: "reconhecimento";
			descricao: Redacao;
			organizacao?: Redacao;
			nivel: NivelDeEvidencia;
			/** De onde veio o número ou a frase — ver `Procedencia`. */
			procedencia?: Procedencia;
	  }
	| {
			tipo: "implantacao";
			organizacao: Redacao;
			status: "producao" | "piloto" | "homologacao" | "encerrada";
	  }
	| {
			tipo: "documento";
			id: Redacao;
			arquivo: Redacao;
			/** Afirmações que este documento sustenta. */
			sustenta: readonly Redacao[];
			/** O que a fonte NÃO cobre — evita tomá-la como completa. */
			observacao?: Redacao;
	  }
	| {
			tipo: "midia";
			id: Redacao;
			formato: "video" | "imagem" | "audio";
			url: Redacao;
	  }
	| {
			tipo: "fonte_publica";
			id: Redacao;
			url: Redacao;
			publicadaEm?: Redacao;
			/** Fonte pública que existe, mas que NÃO pode ser usada como resultado. */
			usoVedado?: { motivo: Redacao };
	  };
