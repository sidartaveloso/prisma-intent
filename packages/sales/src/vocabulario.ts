/**
 * Vocabulário do domínio Sales.
 *
 * Estes termos não existem no core — e não devem existir. Proposta, preço,
 * requisito, conformidade e leitura medida são conceitos desta
 * especialização; o core só sabe que existem consumidores, intenções,
 * argumentos, evidências e renderizações.
 *
 * Os termos valem para qualquer proposta comercial. Quem são os leitores de
 * uma proposta concreta, o que ela afirma e quanto custa é instância, e fica
 * com quem a usa.
 */
import {
	definirVocabulario,
	type RespostaEstrategica,
} from "@prisma-intent/core";

/**
 * Perfis humanos que leem uma proposta. São papéis, não pessoas: a mesma
 * pessoa pode avaliar a técnica e decidir a compra.
 */
export const perfisHumanos = definirVocabulario({
	avaliador_tecnico: {
		nome: "Avaliador técnico",
		descricao:
			"Avalia arquitetura, tecnologias, integração com dispositivos e sistemas e a capacidade de entrega do proponente.",
	},
	decisor_comercial: {
		nome: "Decisor comercial",
		descricao:
			"Avalia preço, risco e prazo; quando revende ou subcontrata, avalia também se a proposta cabe no negócio dele.",
	},
	compras: {
		nome: "Compras",
		descricao:
			"Confere a conformidade formal: planilhas no formato pedido, validade, condições comerciais e documentos exigidos.",
	},
	avaliador_do_cliente_final: {
		nome: "Avaliador do cliente final",
		descricao:
			"Avalia, do lado de quem recebe a solução, a aderência ao edital, os níveis de serviço, a residência de dados e a ausência de aprisionamento ao fornecedor. Existe quando a proposta chega a ele por meio de outra organização.",
	},
	parceiro_de_canal: {
		nome: "Parceiro de canal",
		descricao:
			"Avalia complementaridade e confiabilidade para vender ou entregar junto com o proponente.",
	},
});

export type PerfilHumano = keyof typeof perfisHumanos;

/** Agentes que leem a proposta sem intermediação humana. */
export const perfisAgente = definirVocabulario({
	agente_de_triagem: {
		nome: "Agente de triagem",
		descricao:
			"Resume e compara propostas para quem decide. Precisa de entidades, números, unidades e relações explícitas, para não inferir.",
	},
});

export type PerfilAgente = keyof typeof perfisAgente;

/**
 * O que o leitor está tentando descobrir, agrupado por família.
 *
 * A família é parte do tipo porque muda a situação de leitura: quem compara
 * preço e quem verifica conformidade leem a mesma proposta procurando coisas
 * diferentes. Cada família é um vocabulário; a união discriminada
 * `IntencaoDoConsumidor` é derivada daqui, e um termo novo entra no tipo
 * sozinho.
 */
export const intencoesDoConsumidor = {
	escopo_e_entrega: definirVocabulario({
		verificar_aderencia_ao_escopo: {
			nome: "Verificar aderência ao escopo",
			descricao:
				"Conferir se a proposta cobre o que foi pedido, requisito por requisito.",
		},
		avaliar_capacidade_de_entrega: {
			nome: "Avaliar capacidade de entrega",
			descricao:
				"Julgar se o proponente tem equipe, método e histórico para entregar o que promete.",
		},
		avaliar_prazo: {
			nome: "Avaliar prazo",
			descricao:
				"Julgar se o cronograma é exequível e se cabe na janela de quem compra.",
		},
		entender_sustentacao: {
			nome: "Entender a sustentação",
			descricao:
				"Saber o que acontece depois da entrega: operação, suporte, evolução e o custo recorrente.",
		},
	}),
	preco: definirVocabulario({
		comparar_preco: {
			nome: "Comparar preço",
			descricao:
				"Pôr o preço ao lado de outras propostas ou de uma referência que o leitor já tem.",
		},
		entender_composicao_do_preco: {
			nome: "Entender a composição do preço",
			descricao:
				"Saber de onde vem cada parcela: esforço, licenças, sustentação, viagens, contingência e opcionais.",
		},
	}),
	risco_e_conformidade: definirVocabulario({
		avaliar_risco: {
			nome: "Avaliar risco",
			descricao:
				"Identificar o que pode dar errado na entrega e quem responde por isso.",
		},
		verificar_conformidade: {
			nome: "Verificar conformidade",
			descricao:
				"Conferir a resposta a cada exigência formal: matriz, documentos, condições.",
		},
		avaliar_lock_in: {
			nome: "Avaliar aprisionamento ao fornecedor",
			descricao:
				"Saber se a solução pode ser operada, mantida ou substituída sem depender do proponente.",
		},
		validar_referencias: {
			nome: "Validar referências",
			descricao:
				"Conferir se os casos e números citados existem e são do proponente.",
		},
	}),
	triagem_automatizada: definirVocabulario({
		resumir_a_proposta: {
			nome: "Resumir a proposta",
			descricao:
				"Produzir, para quem decide, um resumo fiel do que é oferecido, por quanto e em que prazo.",
		},
		comparar_com_outras_propostas: {
			nome: "Comparar com outras propostas",
			descricao:
				"Alinhar a proposta a outras pelos mesmos critérios: escopo, preço, prazo, conformidade.",
		},
		extrair_numeros_e_compromissos: {
			nome: "Extrair números e compromissos",
			descricao:
				"Encontrar valores, prazos, níveis de serviço e responsabilidades com unidade e sujeito explícitos.",
		},
	}),
};

type FamiliasDeIntencao = typeof intencoesDoConsumidor;

export type FamiliaDeIntencao = keyof FamiliasDeIntencao;

/** União discriminada por `familia`: o objetivo só vale dentro da sua família. */
export type IntencaoDoConsumidor = {
	[F in FamiliaDeIntencao]: {
		familia: F;
		objetivo: keyof FamiliasDeIntencao[F];
	};
}[FamiliaDeIntencao];

/** O que queremos que o leitor conclua (`NossaIntencao.tipo` do core). */
export const tiposDeIntencao = definirVocabulario({
	qualificar_para_a_lista_curta: {
		nome: "Qualificar para a lista curta",
		descricao:
			"O leitor conclui que a proposta merece seguir na avaliação, ao lado das poucas que restam.",
	},
	gerar_confianca_tecnica: {
		nome: "Gerar confiança técnica",
		descricao:
			"O leitor conclui que a solução é tecnicamente sólida e que o proponente sabe entregá-la.",
	},
	justificar_o_preco: {
		nome: "Justificar o preço",
		descricao:
			"O leitor conclui que o preço decorre do escopo e entende cada parcela.",
	},
	reduzir_o_risco_percebido: {
		nome: "Reduzir o risco percebido",
		descricao:
			"O leitor conclui que os riscos da entrega são conhecidos, delimitados e têm responsável.",
	},
	provocar_a_decisao: {
		nome: "Provocar a decisão",
		descricao:
			"O leitor conclui que tem o que precisa para decidir e dá o próximo passo.",
	},
});

export type TipoDeIntencao = keyof typeof tiposDeIntencao;

/** O que o leitor passa a entender. */
export const efeitosCognitivos = definirVocabulario({
	entende_o_escopo: {
		nome: "Entende o escopo",
		descricao:
			"Sabe o que está incluído, o que está fora e quem faz cada parte.",
	},
	ve_aderencia_ao_requisito: {
		nome: "Vê aderência ao requisito",
		descricao:
			"Encontra a resposta a cada requisito que importa para ele, com a forma de atendimento.",
	},
	compreende_a_composicao_do_preco: {
		nome: "Compreende a composição do preço",
		descricao:
			"Consegue explicar de onde vem o total, linha por linha, a quem precisa aprová-lo.",
	},
	reconhece_experiencia_comparavel: {
		nome: "Reconhece experiência comparável",
		descricao:
			"Associa o proponente a entregas de porte e natureza parecidos com o que está comprando.",
	},
});

export type EfeitoCognitivo = keyof typeof efeitosCognitivos;

/** O que o leitor passa a sentir. Não se observa: infere-se pelo comportamento. */
export const efeitosEmocionais = definirVocabulario({
	seguranca: {
		nome: "Segurança",
		descricao: "Sente que pode recomendar a proposta sem se expor.",
	},
	confianca: {
		nome: "Confiança",
		descricao: "Acredita que o proponente fará o que afirma.",
	},
	previsibilidade: {
		nome: "Previsibilidade",
		descricao:
			"Sente que custo, prazo e responsabilidades não vão mudar de surpresa.",
	},
});

export type EfeitoEmocional = keyof typeof efeitosEmocionais;

/**
 * O que o leitor faz — a única camada observável (core, `EfeitosDesejados`).
 * Cada efeito comportamental desejado numa instância declara como é
 * observado (`ObservacaoDoEfeito`).
 */
export const efeitosComportamentais = definirVocabulario({
	agenda_reuniao: {
		nome: "Agenda reunião",
		descricao: "Pede ou aceita uma conversa com o proponente.",
	},
	encaminha_internamente: {
		nome: "Encaminha internamente",
		descricao: "Repassa a proposta a outra pessoa da organização.",
	},
	pede_ajuste_de_escopo: {
		nome: "Pede ajuste de escopo",
		descricao:
			"Volta com um pedido de inclusão, exclusão ou mudança — sinal de que está considerando a proposta.",
	},
	aprova_o_preco: {
		nome: "Aprova o preço",
		descricao: "Aceita o preço ou o leva adiante sem pedir redução.",
	},
	solicita_contrato: {
		nome: "Solicita contrato",
		descricao: "Pede a minuta, os documentos de contratação ou a assinatura.",
	},
	leva_o_material: {
		nome: "Leva o material",
		descricao:
			"Baixa o PDF ou a planilha para ler fora do site ou circular entre colegas.",
	},
	retorna_a_proposta: {
		nome: "Retorna à proposta",
		descricao: "Volta a ler a proposta em outra sessão: consideração ativa.",
	},
});

export type EfeitoComportamental = keyof typeof efeitosComportamentais;

/**
 * Tipos de evidência numa proposta. A forma de cada um está em
 * `EvidenciaSales`: os que afirmam um fato sobre o proponente (caso, métrica,
 * demonstração, certificação) exigem fonte confirmada para serem renderizados.
 */
export const tiposDeEvidencia = definirVocabulario({
	caso_entregue: {
		nome: "Caso entregue",
		descricao:
			"Projeto que o proponente entregou, com o que tem de comparável ao que está sendo comprado.",
	},
	metrica_de_escala: {
		nome: "Métrica de escala",
		descricao:
			"Número que mostra porte operado: veículos, usuários, transações, com unidade e definição.",
	},
	arquitetura: {
		nome: "Arquitetura",
		descricao: "Diagrama e tecnologias da solução proposta.",
	},
	item_de_conformidade: {
		nome: "Item de conformidade",
		descricao:
			"Resposta a um requisito do cliente, citado pelo identificador dele.",
	},
	estimativa_rastreavel: {
		nome: "Estimativa rastreável",
		descricao:
			"O método da estimativa e o esforço consolidado por pacote. A `Estimativa` em si, com os números por estimador, é interna e nunca é renderizada.",
	},
	demonstracao: {
		nome: "Demonstração",
		descricao:
			"Ambiente ou vídeo em que a plataforma pode ser vista funcionando.",
	},
	certificacao: {
		nome: "Certificação",
		descricao:
			"Certificação ou homologação do proponente ou da solução. Só é renderizada com fonte confirmada.",
	},
});

export type TipoDeEvidencia = keyof typeof tiposDeEvidencia;

/**
 * Objeções típicas de uma proposta: o que o leitor pode concluir sozinho e que
 * bloqueia o avanço. A instância declara as suas com `Objecao` do core; estas
 * são o ponto de partida, com a resposta que costuma funcionar.
 */
export const objecoesTipicas = definirVocabulario({
	fornecedor_distante: {
		nome: "Fornecedor distante",
		descricao:
			"A equipe do proponente está longe de onde a solução vai operar, em outro país ou fuso.",
	},
	preco_acima_da_referencia: {
		nome: "Preço acima da referência",
		descricao:
			"O preço está muito acima do que o leitor conhecia de propostas ou contratos anteriores.",
	},
	prazo_inexequivel: {
		nome: "Prazo inexequível",
		descricao:
			"A solução não entra em produção antes da data de que o comprador precisa.",
	},
	lock_in: {
		nome: "Aprisionamento ao fornecedor",
		descricao:
			"O comprador ficaria preso ao proponente para operar ou evoluir.",
	},
	capacidade_de_equipe: {
		nome: "Capacidade de equipe",
		descricao: "O proponente não conseguiria mobilizar a equipe necessária.",
	},
	dependencia_de_terceiros: {
		nome: "Dependência de terceiros",
		descricao:
			"Parte da entrega depende de dispositivos, integrações ou serviços que o proponente não controla.",
	},
});

export type ObjecaoTipica = keyof typeof objecoesTipicas;

/**
 * A resposta que costuma funcionar para cada objeção típica, no vocabulário
 * de `RespostaEstrategica` do core. O `Record` obriga a cobrir todas.
 */
export const respostaTipicaDaObjecao: Readonly<
	Record<ObjecaoTipica, RespostaEstrategica<never>["tipo"]>
> = {
	fornecedor_distante: "resolver_por_contexto",
	preco_acima_da_referencia: "reposicionamento",
	prazo_inexequivel: "delimitacao",
	lock_in: "resolver_por_evidencia",
	capacidade_de_equipe: "resolver_por_evidencia",
	dependencia_de_terceiros: "resolver_por_contexto",
};

/**
 * Seções de uma proposta. São o que uma renderização ordena
 * (`conteudoPrioritario`), o que um leitor pode não ver (`secoesOcultas`) e o
 * que o sinal `secao_lida` mede.
 */
export const secoesDaProposta = definirVocabulario({
	resumo: {
		nome: "Resumo",
		descricao: "O que se oferece, por quanto e em que prazo, numa página.",
	},
	contexto: {
		nome: "Contexto",
		descricao: "O problema do comprador, como a proposta o lê.",
	},
	solucao: {
		nome: "Solução",
		descricao: "Arquitetura, tecnologias e como a solução atende ao problema.",
	},
	escopo: {
		nome: "Escopo",
		descricao:
			"Pacotes de trabalho, o que cada um entrega e quem é responsável.",
	},
	conformidade: {
		nome: "Conformidade",
		descricao: "A resposta a cada requisito do cliente.",
	},
	cronograma: {
		nome: "Cronograma",
		descricao: "Fases e marcos de aceite.",
	},
	equipe: {
		nome: "Equipe",
		descricao: "Quem entrega e como a equipe é mobilizada.",
	},
	referencias: {
		nome: "Referências",
		descricao: "Casos, métricas e certificações com fonte confirmada.",
	},
	preco: {
		nome: "Preço",
		descricao:
			"Linhas de preço, TCO e fluxo de pagamento, calculados a partir das premissas.",
	},
	sustentacao: {
		nome: "Sustentação",
		descricao: "Operação, suporte e evolução depois da entrega.",
	},
	premissas: {
		nome: "Premissas",
		descricao: "O que a proposta assume e o que ainda precisa ser confirmado.",
	},
	proximos_passos: {
		nome: "Próximos passos",
		descricao: "O que o leitor faz agora e com quem fala.",
	},
});

export type SecaoDaProposta = keyof typeof secoesDaProposta;

/** As saídas de uma proposta. Todas saem da mesma instância. */
export const tiposDeRenderizacao = definirVocabulario({
	site_da_proposta: {
		nome: "Site da proposta",
		descricao:
			"Página por leitor, aberta por código opaco, com a leitura medida.",
	},
	pdf_da_proposta: {
		nome: "PDF da proposta",
		descricao: "Documento paginado, para enviar, imprimir e anexar.",
	},
	planilha_de_precos: {
		nome: "Planilha de preços",
		descricao: "As linhas de preço no formato pedido pelo comprador, com TCO.",
	},
	matriz_de_conformidade: {
		nome: "Matriz de conformidade",
		descricao:
			"Uma linha por requisito do cliente, com a forma de atendimento.",
	},
	resumo_executivo: {
		nome: "Resumo executivo",
		descricao: "Uma ou duas páginas para quem decide sem ler o resto.",
	},
	mensagem_de_envio: {
		nome: "Mensagem de envio",
		descricao:
			"O texto que acompanha a proposta, com as perguntas ainda abertas.",
	},
});

export type TipoDeRenderizacao = keyof typeof tiposDeRenderizacao;

/**
 * Sinais de leitura: o comportamento observável que evidencia um efeito
 * desejado. A forma de cada um está em `SinalDeLeitura`; o nome do evento no
 * serviço de medição é do app que mede, não daqui.
 */
export const sinaisDeLeitura = definirVocabulario({
	secao_lida: {
		nome: "Seção lida",
		descricao:
			"A seção ficou visível por mais tempo do que o limiar declarado.",
	},
	preco_examinado: {
		nome: "Preço examinado",
		descricao:
			"A seção de preço ficou visível acima do limiar; a ordem em relação ao escopo (antes ou depois) é registrada.",
	},
	material_levado: {
		nome: "Material levado",
		descricao: "O leitor baixou um material para ler fora do site.",
	},
	retorno: {
		nome: "Retorno",
		descricao: "Segunda sessão com o mesmo código.",
	},
	encaminhamento_provavel: {
		nome: "Encaminhamento provável",
		descricao: "O mesmo código aberto num navegador ou dispositivo novo.",
	},
	contato: {
		nome: "Contato",
		descricao: "Clique num canal de contato com o proponente.",
	},
});

export type NomeDoSinal = keyof typeof sinaisDeLeitura;

/**
 * Papel de uma organização em relação à proposta. Separado do perfil do
 * leitor: o mesmo perfil (`decisor_comercial`) existe na organização que
 * contrata o proponente e na que recebe a solução, e cada uma lê por
 * critérios diferentes.
 */
export const papeisDeOrganizacao = definirVocabulario({
	destinataria: {
		nome: "Destinatária",
		descricao:
			"A organização a quem a proposta é dirigida e que contrata o proponente. Quando o proponente é subcontratado, é a contratada principal.",
	},
	cliente_final: {
		nome: "Cliente final",
		descricao:
			"A organização para quem a solução é entregue, quando não é a destinatária.",
	},
	parceira: {
		nome: "Parceira",
		descricao:
			"Organização que entrega parte da solução junto com o proponente: fabricante, integradora, operadora.",
	},
});

export type PapelDaOrganizacao = keyof typeof papeisDeOrganizacao;

/**
 * Idiomas em que uma proposta é escrita ou publicada. Uma proposta pode ser
 * escrita direto no idioma do leitor (`idiomaBase` da instância).
 */
export type IdiomaDePublicacao = "pt-BR" | "en";

/** Prioridade de um requisito, como o documento do cliente a declara. */
export type PrioridadeDoRequisito = "alta" | "media" | "baixa";

/** Canal de contato cujo clique é o sinal `contato`. */
export type CanalDeContato =
	| "email"
	| "agendamento"
	| "telefone"
	| "mensageiro";

/** Unidades admitidas em métricas de escala. */
export type Unidade =
	| "veiculos"
	| "dispositivos"
	| "usuarios"
	| "pessoas"
	| "organizacoes"
	| "chamadas_por_dia"
	| "transacoes_por_dia"
	| "registros"
	| "requisitos"
	| "meses"
	| "anos"
	| "percentual";
