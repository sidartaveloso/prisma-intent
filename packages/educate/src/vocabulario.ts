/**
 * Vocabulário do domínio Educate.
 *
 * Estes termos não existem no core — e não devem existir. Aprendiz, quem
 * decide, quem acompanha, missão e efeito de aprendizagem são conceitos desta
 * especialização; o core só sabe que existem consumidores, intenções,
 * argumentos, evidências e renderizações.
 *
 * Só mora aqui o que vale para educar alguém de qualquer idade. O que é de um
 * produto — faixas etárias, canais, linhas de conteúdo, nomes próprios — é
 * vocabulário da instância: quem usa o pacote o declara e o entrega ao brief
 * (`VocabularioDaInstancia`, em `brief.ts`).
 */
import { definirVocabulario } from "@prisma-intent/core";

/**
 * Perfis humanos. São papéis, não pessoas: a mesma pessoa pode decidir,
 * acompanhar e curar — e o aprendiz adulto pode ser quem decide por si.
 */
export const perfisHumanos = definirVocabulario({
	aprendiz: {
		nome: "Aprendiz",
		descricao:
			"Quem aprende e vive a experiência. Consumidor principal, e nem sempre quem decide: a criança vive e outra pessoa decide; o adulto que estuda por conta própria vive e decide.",
	},
	par: {
		nome: "Par",
		descricao:
			"Outro aprendiz que convive com o primeiro — irmão, colega, parceiro de estudo —, com perfil próprio; pode compartilhar o que é para viver junto.",
	},
	decisor: {
		nome: "Decisor",
		descricao:
			"Quem decide o que o aprendiz recebe: configura, aprova o conteúdo e recebe o acompanhamento. Na infância é o responsável; no estudo por conta própria é o próprio aprendiz.",
	},
	acompanhante: {
		nome: "Acompanhante",
		descricao:
			"Quem participa sem decidir: recebe missões, prepara o que a experiência pede fora da tela e confirma; pode estar em outro lugar.",
	},
	curador: {
		nome: "Curador",
		descricao:
			"Quem decide o que é conteúdo que vale o tempo do aprendiz, antes de qualquer recomendação.",
	},
	mediador: {
		nome: "Mediador",
		descricao:
			"Ponto focal humano junto a uma instituição, sempre o mesmo; captura e estrutura o contexto do que o grupo está estudando.",
	},
	educador: {
		nome: "Educador",
		descricao:
			"Quem ensina o grupo: informa o que está sendo trabalhado; nunca vê o que cada aprendiz fez fora da aula.",
	},
	instituicao: {
		nome: "Instituição",
		descricao:
			"Escola, curso ou organização que autoriza a relação e recebe retorno agregado; fornece contexto, não controla a experiência de cada aprendiz.",
	},
});

export type PerfilHumano = keyof typeof perfisHumanos;

/** Agentes que consomem ou produzem material sem intermediação humana. */
export const perfisAgente = definirVocabulario({
	agente_de_producao: {
		nome: "Agente de produção",
		descricao:
			"Gera roteiro, dados e mídia a partir do brief; precisa de datas, papéis e entidades explícitos.",
	},
	assistente_de_rotina: {
		nome: "Assistente de rotina",
		descricao:
			"Executa os acionamentos e as dicas da rotina: lembra, ajuda, incentiva e orienta.",
	},
	motor_de_recomendacao: {
		nome: "Motor de recomendação",
		descricao:
			"Escolhe o recomendado dentro do permitido; nunca ultrapassa o que quem decide liberou. Desativável.",
	},
});

export type PerfilAgente = keyof typeof perfisAgente;

/**
 * Intenção do consumidor: o que ele busca nesta interação. Eixo independente
 * de quem ele é. Agrupada por família porque a família muda a situação: o
 * aprendiz que quer rir e o que quer ganhar um desafio pedem coisas diferentes
 * da mesma história.
 */
export type IntencaoDoConsumidor =
	| {
			familia: "viver_a_experiencia";
			objetivo:
				| "rir"
				| "descobrir"
				| "ouvir_uma_historia"
				| "ganhar_um_desafio"
				| "sair_para_procurar"
				| "ver_junto_com_quem_acompanha";
	  }
	| {
			familia: "confiar_e_acompanhar";
			objetivo:
				| "confiar_no_que_o_aprendiz_ve"
				| "acompanhar_sem_vigiar"
				| "participar_a_distancia"
				| "nao_ter_mais_um_aplicativo";
	  }
	| {
			familia: "continuidade_pedagogica";
			objetivo:
				| "continuar_presente_fora_da_aula"
				| "informar_o_que_a_turma_estuda"
				| "receber_retorno_agregado";
	  }
	| {
			familia: "producao";
			objetivo:
				| "obter_brief_completo"
				| "resolver_ambiguidades_do_tema"
				| "conhecer_as_regras_da_casa";
	  };

/**
 * Efeitos cognitivos: o que o aprendiz passa a entender ou saber fazer.
 * Âncora: os seis processos da Taxonomia de Bloom revisada (Anderson &
 * Krathwohl, 2001; Ferraz & Belhot, 2010).
 */
export const efeitosCognitivos = definirVocabulario({
	lembrar: {
		nome: "Lembrar",
		descricao: "Reconhecer e recordar: identificar, citar, nomear.",
	},
	entender: {
		nome: "Entender",
		descricao:
			"Construir significado: explicar, exemplificar, comparar, resumir.",
	},
	aplicar: {
		nome: "Aplicar",
		descricao: "Usar num caso concreto: executar, implementar, calcular.",
	},
	analisar: {
		nome: "Analisar",
		descricao:
			"Decompor e relacionar: diferenciar, organizar, encontrar a causa.",
	},
	avaliar: {
		nome: "Avaliar",
		descricao: "Julgar com critério: checar, criticar, escolher e justificar.",
	},
	criar: {
		nome: "Criar",
		descricao: "Combinar em algo novo: planejar, inventar, produzir.",
	},
});

export type EfeitoCognitivo = keyof typeof efeitosCognitivos;

/**
 * Efeitos emocionais: o que o aprendiz passa a sentir ou valorizar.
 * Âncoras: domínio afetivo de Krathwohl (receptividade → caracterização) e as
 * competências gerais 8 e 9 da BNCC (autoconhecimento e autocuidado; empatia e
 * cooperação). Não se verificam diretamente: inferem-se pelo comportamento.
 */
export const efeitosEmocionais = definirVocabulario({
	receber: {
		nome: "Receber",
		descricao:
			"Estar disposto a prestar atenção e ouvir (Krathwohl: receptividade).",
	},
	responder: {
		nome: "Responder",
		descricao: "Reagir e participar de boa vontade (Krathwohl: resposta).",
	},
	valorizar: {
		nome: "Valorizar",
		descricao: "Atribuir valor a algo e defendê-lo (Krathwohl: valorização).",
	},
	reconhecer_as_proprias_emocoes: {
		nome: "Reconhecer as próprias emoções",
		descricao:
			"Nomear o que sente e lidar com isso (BNCC competência geral 8).",
	},
	reconhecer_as_emocoes_dos_outros: {
		nome: "Reconhecer as emoções dos outros",
		descricao: "Perceber o que o outro sente (BNCC competência geral 8).",
	},
	sentir_empatia: {
		nome: "Sentir empatia",
		descricao:
			"Colocar-se no lugar do outro, inclusive de quem acabou de contrariá-lo (BNCC competência geral 9).",
	},
	tolerar_a_frustracao: {
		nome: "Tolerar a frustração",
		descricao: "Sentir que perder ou errar não é o fim.",
	},
	sentir_seguranca: {
		nome: "Sentir segurança",
		descricao: "Sentir-se acolhido e protegido para tentar.",
	},
	sentir_curiosidade: {
		nome: "Sentir curiosidade",
		descricao: "Querer saber mais.",
	},
	sentir_orgulho_do_que_fez: {
		nome: "Sentir orgulho do que fez",
		descricao:
			"Reconhecer a própria conquista ao cumprir uma missão ou um desafio.",
	},
	sentir_pertencimento: {
		nome: "Sentir pertencimento",
		descricao:
			"Sentir-se parte do grupo e da história; efeito do que se vive junto e do que se guarda na memória.",
	},
});

export type EfeitoEmocional = keyof typeof efeitosEmocionais;

/**
 * Efeitos comportamentais: o que o aprendiz faz depois — a única camada
 * observável (core, `EfeitosDesejados`). Âncoras: fórmula de Mager (verbo
 * observável + objeto + condição + critério) e a competência geral 10 da BNCC
 * (autonomia, responsabilidade, cooperação). Cada efeito é algo que dá para
 * ver.
 *
 * Esta é a base comum. A instância soma os seus, com a mesma exigência de
 * verbo observável (`verboNaoObservavel`, em `objetivo.ts`), e entrega a união
 * ao brief. A formulação completa (condição e critério) vai em
 * `ObjetivoObservavel`.
 */
export const efeitosComportamentais = definirVocabulario({
	sair_da_tela_para_procurar: {
		nome: "Sair da tela para procurar",
		descricao:
			"Levantar e procurar a pista no mundo físico; o gesto que define a narrativa físico-digital.",
	},
	chamar_quem_acompanha: {
		nome: "Chamar quem acompanha",
		descricao:
			"Buscar quem decide ou quem acompanha para mostrar, perguntar ou fazer junto.",
	},
	contar_o_que_viu: {
		nome: "Contar o que viu",
		descricao:
			"Recontar a história ou a descoberta a alguém, com as próprias palavras.",
	},
	fazer_o_desafio: {
		nome: "Fazer o desafio",
		descricao:
			"Executar a tarefa proposta: encontrar três coisas que usam água, colocar um planeta no mapa.",
	},
	cumprimentar_quem_ganhou: {
		nome: "Cumprimentar quem ganhou",
		descricao: "Dizer 'boa!' quando o outro ganha.",
	},
	pedir_desculpas: {
		nome: "Pedir desculpas",
		descricao: "Reconhecer o que fez e reparar.",
	},
	dividir: {
		nome: "Dividir",
		descricao: "Repartir material, tempo ou atenção com o outro.",
	},
	guardar_o_que_usou: {
		nome: "Guardar o que usou",
		descricao:
			"Organizar o material depois de usar; responsabilidade e autonomia (BNCC 10).",
	},
	tentar_de_novo: {
		nome: "Tentar de novo",
		descricao: "Repetir depois de errar, sem desistir; resiliência (BNCC 10).",
	},
	esperar_a_sua_vez: {
		nome: "Esperar a sua vez",
		descricao: "Aguardar sem interromper.",
	},
	seguir_a_rotina: {
		nome: "Seguir a rotina",
		descricao:
			"Atender ao acionamento da rotina: arrumar-se, fazer a tarefa, parar para descansar.",
	},
	cuidar_de_si: {
		nome: "Cuidar de si",
		descricao: "Praticar um cuidado com o próprio corpo: higiene, fala, sono.",
	},
	perguntar: {
		nome: "Perguntar",
		descricao:
			"Fazer uma pergunta nova sobre o tema; curiosidade que virou ação.",
	},
	construir_ou_desenhar: {
		nome: "Construir ou desenhar",
		descricao:
			"Produzir algo a partir da história: desenho, maquete, invenção (Bloom: criar, tornado visível).",
	},
});

export type EfeitoComportamental = keyof typeof efeitosComportamentais;

/** Sentimentos que uma peça deve provocar (`EstrategiaNarrativa` do core). */
export type Sentimento =
	| "curiosidade"
	| "alegria"
	| "seguranca"
	| "coragem"
	| "calma"
	| "surpresa"
	| "pertencimento"
	| "orgulho"
	| "ternura";

/** Unidades admitidas em evidências deste domínio. */
export type Unidade =
	| "minutos"
	| "cenas"
	| "missoes"
	| "aprendizes"
	| "familias"
	| "instituicoes"
	| "turmas"
	| "historias";
