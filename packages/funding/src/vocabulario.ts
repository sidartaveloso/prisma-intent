/**
 * Vocabulário da especialização Funding: convencer pessoas a financiar um
 * produto antes de ele existir em série, e decidir internamente se cada etapa
 * merece avançar.
 *
 * Financiamento coletivo não é compra: quem apoia financia uma execução que
 * ainda pode falhar. Os termos valem para qualquer campanha de financiamento
 * de produto; quem apoia um produto concreto, o que ele afirma e quanto custa é
 * instância, e fica com quem a usa. O vocabulário separa os efeitos
 * por natureza, como o core pede — cognitivo no que se entende, emocional no
 * que se sente, comportamental no que se faz, e só o último se observa.
 */
import { definirVocabulario } from "@prisma-intent/core";

export const perfisHumanos = definirVocabulario({
	apoiador_entusiasta: {
		nome: "Apoiador entusiasta",
		descricao:
			"Acompanha financiamento coletivo de hardware e apoia cedo quando entende o que é e acredita que vai receber.",
	},
	maker: {
		nome: "Maker",
		descricao:
			"Constrói e modifica eletrônicos; quer saber o que é aberto, como se monta e o que dá para estender.",
	},
	responsavel_por_crianca: {
		nome: "Responsável por criança",
		descricao:
			"Decide e paga por um produto que uma criança vai usar; pesa segurança antes de diversão.",
	},
	profissional_de_tecnologia: {
		nome: "Profissional de tecnologia",
		descricao:
			"Usa o produto no próprio trabalho; decide por utilidade diária, ergonomia e integração com o que já usa.",
	},
	consciente_ambiental: {
		nome: "Consciente ambiental",
		descricao:
			"Apoia porque o produto reaproveita o que seria descartado; desconfia de promessa ambiental vaga.",
	},
	dono_de_item_compativel: {
		nome: "Dono de item compatível",
		descricao:
			"Já tem o item que o produto aproveita ou complementa e quer saber se o dele serve e o que ganha com isso.",
	},
	decisor_interno: {
		nome: "Decisor interno",
		descricao:
			"Quem decide na empresa se uma etapa avança, para ou é revista. Lê dossiê, não página de campanha; decide por evidência, não por entusiasmo.",
	},
});
export type PerfilHumano = keyof typeof perfisHumanos;

export const perfisAgente = definirVocabulario({
	curadoria_da_plataforma: {
		nome: "Curadoria da plataforma",
		descricao:
			"Revisão da plataforma de financiamento que confere as regras de projeto: protótipo, renderizações, plano de fabricação.",
	},
	assistente_de_busca: {
		nome: "Assistente de busca",
		descricao:
			"Agente que resume a campanha para quem perguntou; precisa de fatos explícitos, estágio declarado e números com unidade.",
	},
	juiz_da_rinha: {
		nome: "Juiz da rinha",
		descricao:
			"Juiz automático que compara projetos por evidência, economia e lacunas; ranqueia, não decide.",
	},
});
export type PerfilAgente = keyof typeof perfisAgente;

export const intencoesDoConsumidor = definirVocabulario({
	entender_o_que_e: {
		nome: "Entender o que é",
		descricao: "O que entra, o que sai e o que muda para quem usa.",
	},
	ver_funcionando: {
		nome: "Ver funcionando",
		descricao:
			"Se existe de verdade, em que estágio, e o que ainda não funciona.",
	},
	saber_se_vai_receber: {
		nome: "Saber se vai receber",
		descricao:
			"Prazo, capacidade de fabricação, quem está por trás e o que acontece se der errado.",
	},
	avaliar_o_preco: {
		nome: "Avaliar o preço",
		descricao:
			"Se o valor da recompensa é justo pelo que se recebe e pelo risco que se assume.",
	},
	saber_se_o_que_tenho_serve: {
		nome: "Saber se o que tenho serve",
		descricao: "Compatibilidade do item que a pessoa já tem com o produto.",
	},
	avaliar_seguranca: {
		nome: "Avaliar a segurança",
		descricao:
			"Bateria, aquecimento, peças pequenas, estrutura: se é seguro para quem vai usar.",
	},
	saber_o_impacto_real: {
		nome: "Saber o impacto real",
		descricao: "Quanto se reaproveita de fato, sem exagero ambiental.",
	},
	decidir_se_avanca: {
		nome: "Decidir se avança",
		descricao:
			"Do decisor interno: se a etapa tem evidência suficiente para consumir o próximo capital.",
	},
});
export type IntencaoDoConsumidor = keyof typeof intencoesDoConsumidor;

export const efeitosCognitivos = definirVocabulario({
	entende_a_transformacao: {
		nome: "Entende a transformação",
		descricao:
			"Sabe dizer o que o produto aproveita ou transforma, e o que resulta.",
	},
	distingue_financiamento_de_compra: {
		nome: "Distingue financiamento de compra",
		descricao:
			"Sabe que está financiando uma execução com risco, não comprando um item em estoque.",
	},
	conhece_o_estagio_real: {
		nome: "Conhece o estágio real",
		descricao: "Sabe o que já foi provado em protótipo e o que ainda não.",
	},
	conhece_os_riscos: {
		nome: "Conhece os riscos",
		descricao: "Sabe os riscos de execução e como serão tratados.",
	},
	sabe_a_compatibilidade: {
		nome: "Sabe a compatibilidade",
		descricao: "Sabe se o item dele serve ou como verificar.",
	},
	entende_a_meta: {
		nome: "Entende a meta",
		descricao:
			"Sabe por que a meta financeira e de unidades é aquela, e o que acontece se não for atingida.",
	},
	avalia_a_evidencia: {
		nome: "Avalia a evidência",
		descricao:
			"Do decisor interno: sabe quais perguntas da etapa têm prova e quais estão em aberto.",
	},
});
export type EfeitoCognitivo = keyof typeof efeitosCognitivos;

export const efeitosEmocionais = definirVocabulario({
	curiosidade: {
		nome: "Curiosidade",
		descricao: "Vontade de ver o objeto ganhar outra função.",
	},
	confianca: {
		nome: "Confiança",
		descricao:
			"Sente que quem promete sabe o que está fazendo e diz a verdade sobre o estágio.",
	},
	pertencimento: {
		nome: "Pertencimento",
		descricao: "Sente que faz parte de quem tornou o produto possível.",
	},
	orgulho_de_reaproveitar: {
		nome: "Orgulho de reaproveitar",
		descricao:
			"Satisfação de dar uso ao que estava parado, sem culpa nem exagero.",
	},
	tranquilidade: {
		nome: "Tranquilidade",
		descricao: "Não teme pela segurança de quem vai usar.",
	},
});
export type EfeitoEmocional = keyof typeof efeitosEmocionais;
/** Na Funding, o sentimento de uma peça é um efeito emocional do vocabulário. */
export type Sentimento = EfeitoEmocional;

/** Verbos observáveis: cada um vira contagem ou registro. */
export const efeitosComportamentais = definirVocabulario({
	apoia_a_campanha: {
		nome: "Apoia a campanha",
		descricao: "Escolhe uma recompensa e confirma o apoio na plataforma.",
	},
	entra_na_lista_de_interesse: {
		nome: "Entra na lista de interesse",
		descricao:
			"Deixa o contato, com consentimento, para ser avisado do lançamento.",
	},
	verifica_a_compatibilidade: {
		nome: "Verifica a compatibilidade",
		descricao: "Informa o modelo do item que tem no verificador.",
	},
	compartilha_a_campanha: {
		nome: "Compartilha a campanha",
		descricao: "Envia o link a outra pessoa.",
	},
	envia_uma_pergunta: {
		nome: "Envia uma pergunta",
		descricao: "Faz uma pergunta pública ou privada aos criadores.",
	},
	registra_a_decisao: {
		nome: "Registra a decisão",
		descricao:
			"Do decisor interno: registra avança, revisa ou interrompe, com o motivo.",
	},
});
export type EfeitoComportamental = keyof typeof efeitosComportamentais;

export const criteriosDeDecisao = definirVocabulario({
	funciona_de_verdade: {
		nome: "Funciona de verdade",
		descricao: "Há protótipo demonstrando o que se promete.",
	},
	prazo_crivel: {
		nome: "Prazo crível",
		descricao: "Cronograma com fornecedores e capacidade planejados.",
	},
	preco_justo: {
		nome: "Preço justo",
		descricao: "Valor coerente com o que se recebe.",
	},
	seguranca: {
		nome: "Segurança",
		descricao: "Riscos físicos tratados no projeto.",
	},
	compatibilidade: {
		nome: "Compatibilidade",
		descricao: "O item de quem apoia serve, ou vem junto com o produto.",
	},
	impacto_real: {
		nome: "Impacto real",
		descricao: "Reaproveitamento mensurável, sem exagero.",
	},
	equipe_capaz: {
		nome: "Equipe capaz",
		descricao: "Quem está por trás já mostrou que executa.",
	},
	viabilidade_economica: {
		nome: "Viabilidade econômica",
		descricao:
			"Do decisor interno: margem mínima, meta que cobre a entrega, capital antes da validação controlado.",
	},
});
export type CriterioDeDecisaoId = keyof typeof criteriosDeDecisao;

/**
 * Canais. Cada um é uma situação própria de consumo; `dossie_da_etapa` é o
 * único interno — tudo o mais é público e passa pelas regras de integridade.
 */
export type Canal =
	/** A página principal da campanha: a pessoa decide se apoia. */
	| "pagina_da_campanha"
	/** O vídeo da campanha: primeiro contato, profundidade mínima. */
	| "video_da_campanha"
	/** A lista de recompensas: a pessoa compara valor e risco. */
	| "recompensas"
	/** Perguntas frequentes: objeções respondidas. */
	| "faq"
	/** Seção de riscos e desafios exigida pelas plataformas. */
	| "riscos_e_desafios"
	/** Atualizações aos apoiadores depois do financiamento: prestação de contas. */
	| "atualizacao_aos_apoiadores"
	/** Site institucional e página de pré-lançamento. */
	| "site"
	/** Verificador de compatibilidade com o item que a pessoa já tem. */
	| "verificador_de_compatibilidade"
	/** Dossiê interno de decisão de uma etapa. */
	| "dossie_da_etapa";

export const canaisInternos: readonly Canal[] = ["dossie_da_etapa"];

export type Unidade =
	| "unidades"
	| "centavos_brl"
	| "dias"
	| "fracao"
	| "apoiadores"
	| "milissegundos"
	| "horas"
	| "quilogramas";

/**
 * Idiomas de publicação. As regras do domínio têm padrões só em português:
 * saída em inglês não é coberta por `verificarRegras` (ver AGENTS.md do core).
 */
export type IdiomaDePublicacao = "pt-BR" | "en";

/** Plataformas de financiamento consideradas. Qual será é `Certeza` na campanha. */
export type Plataforma = "kickstarter" | "catarse" | "indiegogo" | "propria";
