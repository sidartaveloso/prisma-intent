/**
 * Cada falha da leitura, com o caso que a provoca. Uma falha recusa a leitura
 * inteira e diz onde está.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { type FalhaDeMarcacao, lerMarcacao } from "../src/index.ts";
import { tipos } from "./catalogo.ts";

/** As falhas, sem o intervalo, que tem teste próprio. */
function falhas(texto: string): Omit<FalhaDeMarcacao, "intervalo">[] {
	const lido = lerMarcacao(texto, tipos);
	assert.equal(lido.resultado, "recusado", JSON.stringify(lido));
	if (lido.resultado !== "recusado") return [];
	return lido.falhas.map(({ intervalo: _, ...falha }) => falha);
}

test("tipo não registrado", () => {
	assert.deepEqual(falhas("Ver :anexo[o anexo]{#a1}."), [
		{ falha: "tipo_nao_registrado", tipo: "anexo" },
	]);
	// propriedade herdada de Object não é tipo registrado
	assert.deepEqual(falhas(":constructor[x]{#a}"), [
		{ falha: "tipo_nao_registrado", tipo: "constructor" },
	]);
});

test("id ausente ou vazio", () => {
	assert.deepEqual(falhas(":termo_do_acordo[prazo]"), [
		{ falha: "id_ausente", tipo: "termo_do_acordo" },
	]);
	assert.deepEqual(falhas(':termo_do_acordo[prazo]{id=""}'), [
		{ falha: "id_ausente", tipo: "termo_do_acordo" },
	]);
});

test("atributo não declarado", () => {
	assert.deepEqual(falhas(":termo_do_acordo[prazo]{#prazo cor=azul}"), [
		{
			falha: "atributo_nao_declarado",
			tipo: "termo_do_acordo",
			atributo: "cor",
		},
	]);
	assert.deepEqual(falhas(":termo_do_acordo[prazo]{#prazo .destaque}"), [
		{
			falha: "atributo_nao_declarado",
			tipo: "termo_do_acordo",
			atributo: "class",
		},
	]);
});

test("valor fora dos aceitos", () => {
	assert.deepEqual(
		falhas(":parte[o locatário]{#locatario artigo=indefinido}"),
		[
			{
				falha: "valor_fora_dos_aceitos",
				tipo: "parte",
				atributo: "artigo",
				valor: "indefinido",
				aceitos: ["definido", "nenhum"],
			},
		],
	);
});

test("atributo obrigatório ausente, sempre", () => {
	assert.deepEqual(falhas(":clausula[a cláusula 2]{#c2}"), [
		{
			falha: "atributo_obrigatorio_ausente",
			tipo: "clausula",
			atributo: "mostrar",
			exigido: { por: "sempre" },
		},
	]);
	assert.deepEqual(falhas(":concordancia[obrigado]{#obrigado}"), [
		{
			falha: "atributo_obrigatorio_ausente",
			tipo: "concordancia",
			atributo: "voce",
			exigido: { por: "sempre" },
		},
	]);
});

test("atributo obrigatório ausente, por depender de outro presente", () => {
	assert.deepEqual(falhas(":definicao[locação]{#locacao par=1 inc=II}"), [
		{
			falha: "atributo_obrigatorio_ausente",
			tipo: "definicao",
			atributo: "art",
			exigido: { por: "atributos_presentes", presentes: ["par", "inc"] },
		},
	]);
	assert.deepEqual(falhas(":definicao[locação]{#locacao art=5 al=b}"), [
		{
			falha: "atributo_obrigatorio_ausente",
			tipo: "definicao",
			atributo: "inc",
			exigido: { por: "atributos_presentes", presentes: ["al"] },
		},
	]);
	// presentes os que exigem e os exigidos, a tag vale
	assert.equal(
		lerMarcacao(":definicao[locação]{#locacao art=5 par=1 inc=II al=b}", tipos)
			.resultado,
		"lido",
	);
});

test("tag sem fechamento, no rótulo e nos atributos", () => {
	assert.deepEqual(falhas("Assina :parte[a locadora, e segue."), [
		{ falha: "tag_sem_fechamento", tipo: "parte", aberto: "rotulo" },
	]);
	assert.deepEqual(
		falhas("Assina :parte[a locadora]{#locadora atributo=nome"),
		[{ falha: "tag_sem_fechamento", tipo: "parte", aberto: "atributos" }],
	);
	assert.deepEqual(falhas("Assina :parte{#locadora"), [
		{ falha: "tag_sem_fechamento", tipo: "parte", aberto: "atributos" },
	]);
	// a linha vazia encerra o parágrafo, e com ele o rótulo
	assert.deepEqual(falhas("Assina :parte[a\n\nlocadora]{#locadora}"), [
		{ falha: "tag_sem_fechamento", tipo: "parte", aberto: "rotulo" },
	]);
});

test("tag dentro do rótulo de outra", () => {
	assert.deepEqual(falhas(":parte[a :termo_do_acordo[x]{#x}]{#locadora}"), [
		{ falha: "tag_no_rotulo", tipo: "parte" },
	]);
});

test("a leitura junta as falhas de todas as tags, cada uma com o intervalo", () => {
	const texto = "A :anexo[a]{#a} e :clausula[c]{#c}.";
	const lido = lerMarcacao(texto, tipos);
	assert.equal(lido.resultado, "recusado");
	if (lido.resultado !== "recusado") return;
	assert.deepEqual(
		lido.falhas.map(({ falha, intervalo }) => [
			falha,
			texto.slice(intervalo.inicio.deslocamento, intervalo.fim.deslocamento),
		]),
		[
			["tipo_nao_registrado", ":anexo[a]{#a}"],
			["atributo_obrigatorio_ausente", ":clausula[c]{#c}"],
		],
	);
});

test("o que não é tag fica como texto, sem falha", () => {
	for (const texto of [
		"às 10:30, na proporção 3:1, e-mail:fulano, Obs:nada",
		"escapada: \\:parte[a]{#a}",
		"::parte e :::parte no começo da linha não são tags de bloco",
		"[[parte:locadora|a locadora]], a marcação antiga, é texto",
	]) {
		const lido = lerMarcacao(texto, tipos);
		assert.equal(lido.resultado, "lido", texto);
		if (lido.resultado === "lido") assert.equal(lido.trechos.length, 1, texto);
	}
});
