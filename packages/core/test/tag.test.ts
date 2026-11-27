/**
 * A tag com atributos e o registro de tipos com os atributos declarados
 * (task-016). O core define a forma; ler e escrever a marcação é do
 * `@prisma-intent/tags`.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import {
	type AtributoDeclarado,
	type RegistroDeTipos,
	registrarTipos,
	type Tag,
	type TagNoTexto,
	type Trecho,
} from "../src/index.ts";

const tipos = registrarTipos({
	pessoa: {
		nome: "Pessoa",
		descricao: "Quem participa.",
		formaDoId: "^[a-z_]+$",
		declaracao: "exigida",
		atributos: {
			tratamento: {
				descricao: "Como a pessoa é tratada.",
				valores: "enumerados",
				aceitos: ["formal", "informal"],
				presenca: "opcional",
			},
			apelido: {
				descricao: "Obrigatório quando o tratamento é dado.",
				valores: "livres",
				presenca: "obrigatoria_quando",
				presente: ["tratamento"],
			},
		},
	},
	data: {
		nome: "Data",
		descricao: "O id é a própria data.",
		formaDoId: "^\\d{4}-\\d{2}-\\d{2}$",
		declaracao: "dispensada",
		atributos: {},
	},
});

test("registrarTipos preserva os literais e acrescenta o id", () => {
	const tipo: "pessoa" = tipos.pessoa.id;
	assert.equal(tipo, "pessoa");
	assert.equal(tipos.data.id, "data");
	assert.deepEqual(tipos.pessoa.atributos.tratamento.aceitos, [
		"formal",
		"informal",
	]);
	type Registrado = keyof typeof tipos;
	const registrados: Registrado[] = ["pessoa", "data"];
	assert.equal(registrados.length, 2);
	// o registro serve onde se pede um RegistroDeTipos
	const comoRegistro: RegistroDeTipos<Registrado> = tipos;
	assert.ok(comoRegistro);
});

test("a tag leva atributos, e o trecho é texto ou tag com rótulo", () => {
	const tag: TagNoTexto<Tag<"pessoa">> = {
		tipo: "pessoa",
		id: "ana",
		atributos: { tratamento: "informal", apelido: "Aninha" },
		rotulo: "Ana",
	};
	const trechos: Trecho<Tag<"pessoa">>[] = ["Fala com ", tag, "."];
	assert.equal(trechos.length, 3);
	// @ts-expect-error: a tag sem atributos não compila; sem atributos, o objeto é vazio
	const semAtributos: Tag = { tipo: "pessoa", id: "ana" };
	const outroTipo: Trecho<Tag<"pessoa">> = {
		// @ts-expect-error: tipo fora do parâmetro
		tipo: "data",
		id: "x",
		atributos: {},
		rotulo: "",
	};
	assert.ok(semAtributos && outroTipo);
});

test("o atributo declara valores aceitos e presença, sem combinação inválida", () => {
	const livre: AtributoDeclarado = {
		descricao: "x",
		valores: "livres",
		presenca: "obrigatoria",
	};
	// @ts-expect-error: valores enumerados exigem a lista de aceitos
	const semLista: AtributoDeclarado = {
		descricao: "x",
		valores: "enumerados",
		presenca: "opcional",
	};
	const semGatilho: AtributoDeclarado = {
		descricao: "x",
		valores: "livres",
		presenca: "obrigatoria_quando",
		// @ts-expect-error: obrigatória quando presente exige ao menos um atributo
		presente: [],
	};
	assert.ok(livre && semLista && semGatilho);
});
