/**
 * Intenção da proposta e sinal de leitura.
 *
 * `NossaIntencao` do core diz o que queremos que o leitor conclua e por quais
 * efeitos. A Sales acrescenta o vínculo entre o efeito e a medição: cada
 * efeito comportamental desejado declara como é observado. Assim a hipótese de
 * cada intenção fica testável — se ninguém agendou reunião e ninguém
 * encaminhou, a proposta não provocou o que pretendia.
 *
 * Nem todo efeito se observa na leitura. Aprovar o preço ou pedir o contrato
 * acontece fora do site, e é registrado por uma pessoa a partir da resposta do
 * leitor. Fingir um sinal de leitura para esses efeitos daria medição sem
 * medir nada.
 */
import type {
	NossaIntencao,
	ObservacaoDosEfeitos as ObservacaoDosEfeitosDoCore,
	PeloMenosUm,
	Redacao,
} from "@prisma-intent/core";
import type {
	CanalDeContato,
	EfeitoCognitivo,
	EfeitoComportamental,
	EfeitoEmocional,
	SecaoDaProposta,
	TipoDeIntencao,
	TipoDeRenderizacao,
} from "./vocabulario.ts";

/** A intenção do core com os vocabulários desta especialização. */
export type NossaIntencaoSales<
	TComportamental extends EfeitoComportamental = EfeitoComportamental,
> = NossaIntencao<
	TipoDeIntencao,
	EfeitoCognitivo,
	EfeitoEmocional,
	TComportamental
>;

/** Uma intenção da proposta, dirigida a leitores declarados. */
export type IntencaoDaProposta<
	TComportamental extends EfeitoComportamental = EfeitoComportamental,
	TLeitor extends string = string,
> = NossaIntencaoSales<TComportamental> & {
	para: PeloMenosUm<TLeitor>;
};

/** Saídas que o leitor pode baixar e levar. */
export type MaterialLevavel = Extract<
	TipoDeRenderizacao,
	| "pdf_da_proposta"
	| "planilha_de_precos"
	| "matriz_de_conformidade"
	| "resumo_executivo"
>;

/**
 * Sinal de leitura: o comportamento observável e os parâmetros que o tornam
 * conferível. Os nomes e as definições estão em `sinaisDeLeitura`.
 */
export type SinalDeLeitura =
	| {
			sinal: "secao_lida";
			secao: SecaoDaProposta;
			/** Tempo mínimo com a seção visível para contar como lida. */
			permanenciaMinimaEmSegundos: number;
	  }
	| { sinal: "preco_examinado"; permanenciaMinimaEmSegundos: number }
	| { sinal: "material_levado"; material: MaterialLevavel }
	| { sinal: "retorno" }
	| { sinal: "encaminhamento_provavel" }
	| { sinal: "contato"; canal: CanalDeContato };

/** Como um efeito comportamental desejado é observado. */
export type ObservacaoDoEfeito =
	| { por: "sinal_de_leitura"; sinais: PeloMenosUm<SinalDeLeitura> }
	| {
			/** Fora da leitura: uma pessoa registra a partir da resposta do leitor. */
			por: "resposta_do_leitor";
			como: Redacao;
	  };

/**
 * Uma observação para cada efeito comportamental que as intenções declaram.
 *
 * Quando os efeitos são conhecidos (uma instância concreta), o registro exige
 * todos: esquecer um é erro de compilação. Quando o tipo é genérico — uma
 * função que aceita qualquer instância —, as chaves ficam opcionais; sem isso,
 * nenhuma instância concreta caberia no tipo genérico.
 */
export type ObservacaoDosEfeitos<TComportamental extends EfeitoComportamental> =
	ObservacaoDosEfeitosDoCore<
		TComportamental,
		EfeitoComportamental,
		ObservacaoDoEfeito
	>;
