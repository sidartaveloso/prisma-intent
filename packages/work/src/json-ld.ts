/**
 * Projeção JSON-LD da instância.
 *
 * Destinada ao consumidor do tipo agente: o objetivo não é aparecer em busca,
 * e sim **reduzir ambiguidade** — deixar explícito o que é organização, o que
 * é produto, o que é tecnologia e qual é exatamente o papel da pessoa em cada
 * um.
 *
 * A autoria é traduzida com rigor, porque é aqui que um agente erraria com mais
 * facilidade: autoria direta vira `creator`; liderança e participação viram
 * `contributor`; tecnologia incorporada não gera atribuição nenhuma. É a regra
 * de separação de autoria aplicada na saída, não apenas documentada.
 */
import type { Autoria } from "./experiencia.ts";
import type { InstanciaWork } from "./instancia.ts";

interface NoJsonLd {
	"@type": string;
	[chave: string]: unknown;
}

/** Papel da pessoa em uma frente, segundo o grau de autoria declarado. */
function papelDe(autoria: Autoria): "creator" | "contributor" | null {
	switch (autoria.grau) {
		case "direta":
			return "creator";
		case "compartilhada":
		case "lideranca":
			return "contributor";
		case "de_terceiro":
		case "tecnologia_incorporada":
			return null;
	}
}

/** Dados do canal que não pertencem à instância (perfis externos, local). */
export interface ContextoDaPagina {
	nome: string;
	descricao: string;
	sameAs?: readonly string[];
	local?: string;
	/** URL canônica da página (absoluta). */
	url?: string;
	/** URL da imagem do perfil (absoluta). */
	image?: string;
	/** Telefone em E.164 (ex.: "+5500900000000"). */
	telefone?: string;
}

/**
 * Página de perfil, para o canal `site_pessoal`.
 *
 * Mesma base do `@graph`, embrulhada em `ProfilePage` — o que um buscador
 * espera encontrar em um site pessoal. `knowsAbout` sai da base técnica
 * declarada, e não de uma lista mantida à parte: é assim que o site para de
 * afirmar competências que a instância não sustenta.
 *
 * O `WebSite` é irmão do `ProfilePage` no grafo, não um objeto dentro dele.
 * Enquanto viveu aninhado em `isPartOf`, o Google não o lia: o resultado de
 * busca saía encabeçado pelo domínio, que ele usa quando não encontra nome
 * declarado, no lugar do nome da pessoa. O `@id` mantém a
 * mesma relação de antes — o que muda é onde o nó está, não o que ele diz.
 */
export function montarProfilePage(
	instancia: InstanciaWork,
	pagina: ContextoDaPagina,
): Record<string, unknown> {
	const { "@graph": grafo } = montarJsonLd(instancia);
	const [pessoa, ...resto] = grafo;
	if (!pessoa) {
		throw new Error("A instância não emite o nó da pessoa no JSON-LD.");
	}
	const idPessoa = pessoa["@id"] as string;

	const idSite = "#site";

	/**
	 * A raiz, não a página: `WebSite` descreve o site inteiro. Derivar de
	 * `pagina.url` evita uma segunda constante com o domínio, que passaria a
	 * poder divergir do canônico.
	 */
	const urlDoSite = pagina.url
		? new URL("/", pagina.url).toString()
		: undefined;

	const perfil = {
		"@type": "ProfilePage",
		name: pagina.nome,
		description: pagina.descricao,
		inLanguage: instancia.instancia.idiomaBase,
		...(pagina.url ? { url: pagina.url } : {}),
		mainEntity: {
			...pessoa,
			...(pagina.url ? { url: pagina.url } : {}),
			...(pagina.image ? { image: pagina.image } : {}),
			...(pagina.telefone ? { telephone: pagina.telefone } : {}),
			...(pagina.sameAs ? { sameAs: pagina.sameAs } : {}),
			...(pagina.local
				? { homeLocation: { "@type": "Place", name: pagina.local } }
				: {}),
		},
		about: { "@id": idPessoa },
		...(pagina.image ? { primaryImageOfPage: pagina.image } : {}),
		isPartOf: { "@id": idSite },
		hasPart: resto.filter((no) => no["@type"] === "SoftwareApplication"),
	};

	const site = {
		"@type": "WebSite",
		"@id": idSite,
		name: instancia.pessoa.nome,
		...(urlDoSite ? { url: urlDoSite } : {}),
		publisher: { "@id": idPessoa },
		inLanguage: instancia.instancia.idiomaBase,
	};

	return { "@context": "https://schema.org", "@graph": [site, perfil] };
}

export function montarJsonLd(instancia: InstanciaWork): {
	"@context": "https://schema.org";
	"@graph": NoJsonLd[];
} {
	const idPessoa = "#pessoa";
	const idCase = (id: string) => `#case-${id}`;

	const pessoa: NoJsonLd = {
		"@type": "Person",
		"@id": idPessoa,
		name: instancia.pessoa.nome,
		jobTitle: instancia.pessoa.posicionamento.tese,
		description: instancia.conclusao.tese,
		knowsAbout: [
			...instancia.baseTecnica.stackPrincipal,
			...instancia.baseTecnica.complementares,
			...instancia.baseTecnica.areas.map((area) => area.replace(/_/g, " ")),
		],
		/**
		 * Um nó por cargo, não por organização: é o que permite a um agente
		 * reconstruir a progressão dentro da mesma empresa.
		 *
		 * Experiências reservadas ficam de fora. A reserva valia no currículo, que
		 * filtra, mas não aqui — e este é o dado que a IA de recrutamento lê, o
		 * canal onde a omissão importa mais.
		 */
		hasOccupation: instancia.experiencias
			.filter((experiencia) => !experiencia.reserva)
			.flatMap((experiencia) =>
				experiencia.cargos.map((cargo) => ({
					"@type": "Role",
					roleName: cargo.titulo,
					startDate: cargo.periodo.inicio,
					endDate: cargo.periodo.fim ?? undefined,
					worksFor: { "@type": "Organization", name: experiencia.organizacao },
				})),
			),
		alumniOf: instancia.formacao.map((formacao) => ({
			"@type": "EducationalOrganization",
			name: formacao.instituicao,
			description: `${formacao.grau.toUpperCase()} · ${formacao.curso} (${formacao.conclusao})`,
		})),
		knowsLanguage: instancia.idiomas.map((idioma) => ({
			"@type": "Language",
			name: idioma.idioma,
			description: idioma.nivel.replace(/_/g, " "),
		})),
	};

	const cases = instancia.cases.map((caseProfissional): NoJsonLd => {
		const papeis = caseProfissional.frentes.map((frente) => ({
			frente: frente.frente,
			papel: papelDe(frente.autoria),
		}));
		const ehCriador = papeis.some(({ papel }) => papel === "creator");

		const no: NoJsonLd = {
			"@type": "SoftwareApplication",
			"@id": idCase(caseProfissional.id),
			name: caseProfissional.nome,
			description: caseProfissional.problema,
			applicationCategory: caseProfissional.contexto.dominio,
		};

		if (ehCriador) no.creator = { "@id": idPessoa };
		else if (papeis.some(({ papel }) => papel === "contributor")) {
			no.contributor = { "@id": idPessoa };
		}

		// Frentes de terceiros e componentes incorporados ficam fora de qualquer
		// atribuição — a ausência é intencional e é o que a regra exige.
		const frentesDaPessoa = papeis
			.filter(({ papel }) => papel !== null)
			.map(({ frente }) => frente);
		if (frentesDaPessoa.length > 0) no.roleName = frentesDaPessoa;

		if (caseProfissional.tecnologias) {
			no.applicationSuite = caseProfissional.tecnologias;
		}
		if (caseProfissional.contexto.organizacao) {
			no.producer = {
				"@type": "Organization",
				name: caseProfissional.contexto.organizacao,
			};
		}

		const metricas = (caseProfissional.resultados ?? []).flatMap((resultado) =>
			resultado.tipo === "metrica"
				? [
						{
							"@type": "QuantitativeValue",
							name: resultado.nome,
							value: resultado.valor,
							unitText: resultado.unidade,
							description: resultado.definicao,
						},
					]
				: [],
		);
		if (metricas.length > 0) no.measurementTechnique = metricas;

		return no;
	});

	return {
		"@context": "https://schema.org",
		"@graph": [
			pessoa,
			...cases,
			{
				"@type": "Dataset",
				"@id": "#prisma-intent",
				name: `${instancia.produto.nome} — ${instancia.instancia.id}`,
				description: instancia.produto.descricao,
				creativeWorkStatus: instancia.instancia.estado,
				inLanguage: instancia.instancia.idiomaBase,
				about: { "@id": idPessoa },
			},
		],
	};
}
