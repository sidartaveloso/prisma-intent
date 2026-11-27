/**
 * O que a leitura devolve: os trechos, cada um com o lugar de onde veio, ou as
 * falhas que a impediram.
 */
import type { PeloMenosUm, Tag, Trecho } from "@prisma-intent/core";

/** Um ponto do texto lido. */
export interface PontoNoTexto {
	/** A partir de 1. */
	linha: number;
	/** A partir de 1, em unidades de `string` do JavaScript. */
	coluna: number;
	/** A partir de 0: `texto.slice(inicio.deslocamento, fim.deslocamento)`. */
	deslocamento: number;
}

/** Onde, no texto lido, algo começa e termina (o fim fica de fora). */
export interface Intervalo {
	inicio: PontoNoTexto;
	fim: PontoNoTexto;
}

/** Um trecho e o intervalo do texto de onde ele veio. */
export interface Pedaco<TTag extends Tag = Tag> {
	trecho: Trecho<TTag>;
	intervalo: Intervalo;
}

/** O que a leitura recusa. Cada falha diz onde está. */
export type FalhaDeMarcacao =
	/** O catálogo não tem o tipo. Inclui `palavra:palavra` sem espaço, que é tag: escreva `\:`. */
	| { falha: "tipo_nao_registrado"; tipo: string; intervalo: Intervalo }
	/** A tag não tem `#id` (ou `id=`), ou ele é vazio. */
	| { falha: "id_ausente"; tipo: string; intervalo: Intervalo }
	/** O tipo não declara o atributo. */
	| {
			falha: "atributo_nao_declarado";
			tipo: string;
			atributo: string;
			intervalo: Intervalo;
	  }
	/** O atributo só aceita os valores da lista, e o valor não está nela. */
	| {
			falha: "valor_fora_dos_aceitos";
			tipo: string;
			atributo: string;
			valor: string;
			aceitos: PeloMenosUm<string>;
			intervalo: Intervalo;
	  }
	/** Falta um atributo obrigatório. */
	| {
			falha: "atributo_obrigatorio_ausente";
			tipo: string;
			atributo: string;
			/** `sempre`, ou os atributos presentes que o tornaram obrigatório. */
			exigido:
				| { por: "sempre" }
				| { por: "atributos_presentes"; presentes: PeloMenosUm<string> };
			intervalo: Intervalo;
	  }
	/** O rótulo (`[`) ou os atributos (`{`) da tag abriram e não fecharam. */
	| {
			falha: "tag_sem_fechamento";
			tipo: string;
			aberto: "rotulo" | "atributos";
			intervalo: Intervalo;
	  }
	/** Há uma tag dentro do rótulo de outra; o rótulo é texto. */
	| { falha: "tag_no_rotulo"; tipo: string; intervalo: Intervalo };

/** Resultado da leitura: os trechos e os pedaços, ou as falhas. */
export type ResultadoDaLeitura<TTag extends Tag = Tag> =
	| {
			resultado: "lido";
			trechos: readonly Trecho<TTag>[];
			/** Os mesmos trechos, na mesma ordem, com o intervalo de cada um. */
			pedacos: readonly Pedaco<TTag>[];
	  }
	| { resultado: "recusado"; falhas: PeloMenosUm<FalhaDeMarcacao> };
