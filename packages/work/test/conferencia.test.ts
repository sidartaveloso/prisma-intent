/**
 * A conferência é testada contra os erros que a motivaram.
 *
 * Os três casos abaixo aconteceram de verdade numa instância real, e foram
 * achados por leitura humana da página renderizada — um de cada vez. Aqui eles
 * estão reproduzidos na instância fictícia dos testes. Se a conferência não
 * tornar os três visíveis, ela não resolve o problema para o qual foi escrita,
 * e o formato está errado.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { aconselhar, coletarAfirmacoes } from "../src/conferencia.ts";
import { exemplo } from "./exemplo.ts";

const afirmacoes = coletarAfirmacoes(exemplo);

const acharPorOnde = (onde: string) =>
	afirmacoes.filter((afirmacao) => afirmacao.onde === onde);

test("erro 1 — reconhecimento sem sujeito: a conferência cobra quem recebeu", () => {
	const reconhecimento = afirmacoes.find((afirmacao) =>
		afirmacao.assunto.endsWith("reconhecimento"),
	);
	assert.ok(
		reconhecimento,
		"o reconhecimento da instância precisa ser coletado",
	);

	/**
	 * O bug: "Vencedora de duas edições…" nasceu sob um título em que
	 * concordava com a empresa. O título mudou, o sujeito sumiu, e a frase
	 * passou a ser lida como se falasse da pessoa.
	 *
	 * A evidência sempre soube quem recebeu: `organizacao`. O que faltava era
	 * alguém pôr esse campo na frente de quem lê a frase publicada.
	 */
	assert.match(
		reconhecimento.conselhos.join(" "),
		/Alfa Sistemas/,
		"o conselho precisa nomear a organização que recebeu o reconhecimento",
	);
	assert.match(reconhecimento.declarado, /de: Alfa Sistemas/);
});

test("erro 2 — liderança na organização errada: a conferência nomeia a dona do fato", () => {
	const [lideranca] = acharPorOnde("experiencias.beta.lideranca");
	assert.ok(lideranca, "a liderança da Beta Mobilidade precisa ser coletada");

	/**
	 * O bug: o campo morava na experiência da outra organização, e o cartão
	 * que o publica leva o título dela. O dado isolado estava certo; a
	 * vizinhança é que reatribuía. Por isso o conselho fala de título, não de
	 * valor — é a única leitura que expõe o erro.
	 */
	assert.match(lideranca.assunto, /^Beta Mobilidade/);
	assert.match(lideranca.conselhos.join(" "), /o fato é da Beta Mobilidade/);
	assert.match(lideranca.conselhos.join(" "), /título/);
});

test("erro 2 — nenhuma liderança sobrou pendurada na outra organização", () => {
	assert.equal(
		acharPorOnde("experiencias.alfa.lideranca").length,
		0,
		"a liderança de time não é um fato da Alfa Sistemas",
	);
});

test("erro 3 — formulação: 'cerca de' é desaconselhado, piso passa em silêncio", () => {
	/**
	 * O bug: `minima: 20` publicava "mais de 20 programadores", que nenhuma das
	 * formulações da fonte sustentava. Corrigido para um piso de 15.
	 *
	 * O conselho sobre `aproximada` é o que sobrou dessa história: "cerca de 20"
	 * foi o meio do caminho, e pede desculpa pelo próprio número.
	 */
	assert.match(
		aconselhar({ tipo: "aproximada", valor: 20 }, "programadores").join(" "),
		/piso/,
	);

	/**
	 * `minima` passa em silêncio de propósito. Sem ler a procedência, esta
	 * função não tem como saber se um piso está fiel ou tímido, e um conselho
	 * que dispara em toda quantidade vira decoração — a pessoa para de ler as
	 * linhas ↑, inclusive as que importam.
	 */
	assert.deepEqual(
		aconselhar({ tipo: "minima", valor: 15 }, "programadores"),
		[],
	);
	assert.deepEqual(aconselhar({ tipo: "minima", valor: 2000 }, "veículos"), []);

	/**
	 * `maxima` também passa em silêncio: um teto é uma promessa sobre o futuro
	 * ("até 2 dias úteis"), não uma afirmação sobre a fonte, e não há o que
	 * conferir antes de cumprir.
	 */
	assert.deepEqual(aconselhar({ tipo: "maxima", valor: 2 }, "dias úteis"), []);
});

test("a marca de uma quantidade não carrega o substantivo", () => {
	const [lideranca] = acharPorOnde("experiencias.beta.lideranca");
	assert.ok(lideranca);

	/**
	 * Um canal escreve "times com mais de 15 programadores" e outro "times de
	 * mais de 15 programadores". A marca precisa ser o pedaço que sobrevive aos
	 * dois, senão a conferência acha o fato num canal e o dá por não publicado
	 * no outro.
	 */
	assert.deepEqual(lideranca.marcas, ["mais de 15"]);
});

test("métrica com redação segura é procurada pela frase, não pelo número", () => {
	const unidades = afirmacoes.find((afirmacao) =>
		afirmacao.assunto.includes("Unidades com operação"),
	);
	assert.ok(unidades);

	/**
	 * "4 organizacoes" casava com "4 mil usuários" de outro case, e a
	 * conferência anunciava a métrica de um sob o título do outro. Falso
	 * positivo aqui é pior que falso negativo: a pessoa vem conferir atribuição
	 * e recebe atribuição inventada.
	 */
	assert.ok(
		unidades.marcas.every((marca) => !/^\d+$/.test(marca)),
		"um número solto não pode ser a marca quando existe redação segura",
	);
});

test("toda afirmação diz onde mora, para que dê para corrigir", () => {
	for (const afirmacao of afirmacoes) {
		assert.ok(afirmacao.onde.length > 0, `sem 'onde': ${afirmacao.assunto}`);
		assert.ok(
			afirmacao.declarado.length > 0,
			`sem 'declarado': ${afirmacao.onde}`,
		);
	}
});
