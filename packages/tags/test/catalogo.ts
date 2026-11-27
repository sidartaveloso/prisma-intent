/**
 * Catálogo fictício para os testes, com os tipos de um produto de acordos:
 * são eles que dão a medida do que o registro de tipos precisa expressar.
 */
import { registrarTipos } from "@prisma-intent/core";

const PREPOSICAO = {
	descricao: "Preposição que antecede a citação, contraída com o artigo.",
	valores: "enumerados",
	aceitos: ["de", "em", "por", "a", "com"],
	presenca: "opcional",
} as const;

const ARTIGO = {
	descricao: "Se a citação leva artigo definido.",
	valores: "enumerados",
	aceitos: ["definido", "nenhum"],
	presenca: "opcional",
} as const;

const DISPOSITIVO = (
	descricao: string,
	presenca:
		| { presenca: "opcional" }
		| {
				presenca: "obrigatoria_quando";
				presente: readonly [string, ...string[]];
		  },
) => ({ descricao, valores: "livres", ...presenca }) as const;

export const tipos = registrarTipos({
	parte: {
		nome: "Parte",
		descricao: "Quem assina o acordo.",
		formaDoId: "^[a-z_]+$",
		declaracao: "exigida",
		atributos: {
			atributo: {
				descricao: "O que da parte é citado.",
				valores: "enumerados",
				aceitos: ["papel", "nome", "documento", "endereco"],
				presenca: "opcional",
			},
			artigo: ARTIGO,
			preposicao: PREPOSICAO,
			com_rotulo: {
				descricao: "Se o valor vem precedido do rótulo do atributo.",
				valores: "enumerados",
				aceitos: ["sim", "nao"],
				presenca: "opcional",
			},
		},
	},
	termo_do_acordo: {
		nome: "Termo do acordo",
		descricao: "Valor combinado no acordo, como prazo ou quantia.",
		formaDoId: "^[a-z_]+$",
		declaracao: "exigida",
		atributos: {},
	},
	concordancia: {
		nome: "Concordância",
		descricao: "Palavra que concorda com quem lê.",
		formaDoId: "^[a-z_]+$",
		declaracao: "dispensada",
		atributos: {
			voce: {
				descricao: "A forma usada quando o texto fala com quem lê.",
				valores: "livres",
				presenca: "obrigatoria",
			},
		},
	},
	definicao: {
		nome: "Definição",
		descricao: "Termo definido, com o dispositivo de lei de onde vem.",
		formaDoId: "^[a-z_]+$",
		declaracao: "exigida",
		atributos: {
			artigo: ARTIGO,
			preposicao: PREPOSICAO,
			numero: {
				descricao: "Singular ou plural.",
				valores: "enumerados",
				aceitos: ["singular", "plural"],
				presenca: "opcional",
			},
			art: DISPOSITIVO("Artigo da lei.", {
				presenca: "obrigatoria_quando",
				presente: ["par", "inc"],
			}),
			par: DISPOSITIVO("Parágrafo.", { presenca: "opcional" }),
			inc: DISPOSITIVO("Inciso.", {
				presenca: "obrigatoria_quando",
				presente: ["al"],
			}),
			al: DISPOSITIVO("Alínea.", { presenca: "opcional" }),
		},
	},
	clausula: {
		nome: "Cláusula",
		descricao: "Outra cláusula do mesmo acordo.",
		formaDoId: "^[a-z0-9_]+$",
		declaracao: "exigida",
		atributos: {
			mostrar: {
				descricao: "Como a cláusula citada aparece.",
				valores: "enumerados",
				aceitos: ["numero", "numero_e_titulo"],
				presenca: "obrigatoria",
			},
			preposicao: PREPOSICAO,
		},
	},
});
