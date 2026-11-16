/**
 * Experiência profissional.
 *
 * O ponto sensível aqui é autoria. Fundar uma empresa, liderar um time,
 * arquitetar um sistema e escrever o código são responsabilidades distintas —
 * e o material perde credibilidade se as funde. `Autoria` existe para que o
 * grau de participação seja um dado, não um adjetivo escolhido na redação.
 */
import type { Evidencia, Procedencia, Redacao } from "@prisma-intent/core";
import type { Unidade } from "./vocabulario.ts";

/**
 * Grau de participação em uma frente de trabalho.
 *
 * Cada variante exige o que a torna verificável: participação compartilhada
 * exige os participantes; responsabilidade de terceiro exige o responsável.
 */
export type Autoria =
	| { grau: "direta"; responsavel: Redacao }
	| { grau: "compartilhada"; participantes: readonly Redacao[] }
	| {
			grau: "lideranca";
			executor: Redacao;
			/** O que a liderança de fato fez — evita virar autoria implícita. */
			participacao: readonly Redacao[];
	  }
	| { grau: "de_terceiro"; responsavel: Redacao }
	| {
			grau: "tecnologia_incorporada";
			/** Componente de terceiro embutido na solução, não construído aqui. */
			descricao: Redacao;
	  };

/** Frente de trabalho de um produto, com sua autoria própria. */
export interface Frente {
	frente:
		| "produto"
		| "arquitetura"
		| "software"
		| "firmware"
		| "hardware"
		| "eletronica"
		| "infraestrutura"
		| "visao_computacional";
	autoria: Autoria;
}

/**
 * Quantidade com a precisão declarada.
 *
 * "20 programadores" e "mais de 20 programadores" afirmam coisas diferentes, e
 * um `number` solto não guarda essa diferença — quem renderiza acaba
 * escolhendo o advérbio por conta.
 *
 * `maxima` é o teto: "até 2 dias úteis". É a precisão de um prazo que se
 * promete cumprir sem garantir o dia exato.
 */
export type Quantidade =
	| { tipo: "exata"; valor: number }
	| { tipo: "aproximada"; valor: number }
	| { tipo: "minima"; valor: number }
	| { tipo: "maxima"; valor: number };

export interface Periodo {
	inicio: Redacao;
	fim: Redacao | null;
	/**
	 * Precisão da data de início.
	 *
	 * "Faz mais ou menos um ano e meio" é a forma como as pessoas lembram — e
	 * transformar isso numa data exata inventaria precisão que a fonte não tem.
	 */
	precisao?: "exata" | "aproximada";
}

/**
 * Natureza do vínculo.
 *
 * Um retorno como prestador não é a mesma coisa que a contratação anterior na
 * mesma empresa, e o currículo que mostra só "Empresa · atual" esconde a
 * diferença — que um recrutador vai perguntar de qualquer forma.
 */
export type Vinculo =
	| { tipo: "clt" }
	| {
			tipo: "pj";
			/** Empresa através da qual o serviço é faturado. */
			por?: Redacao;
			/**
			 * Quem de fato executa.
			 *
			 * `pessoal` quando a empresa é apenas o veículo de emissão de nota e o
			 * trabalho é da própria pessoa; `equipe` quando há time alocado. A
			 * distinção existe porque "minha empresa presta serviço para X" e "eu
			 * presto serviço para X" afirmam capacidades diferentes — e a primeira,
			 * dita no lugar da segunda, esconde a mão na massa que é justamente o
			 * ponto a provar.
			 */
			execucao?: "pessoal" | "equipe";
	  }
	| { tipo: "socio" }
	| { tipo: "estagio" }
	| { tipo: "temporario"; ate?: Redacao };

/**
 * Dedicação ao vínculo.
 *
 * Declarar a carga parcial evita a leitura de exclusividade em uma trajetória
 * com mais de um vínculo ativo ao mesmo tempo.
 */
export type Dedicacao =
	| { tipo: "integral" }
	| {
			tipo: "parcial";
			horasSemanais: number;
			precisao?: "exata" | "aproximada";
	  };

/**
 * Um cargo dentro de uma organização.
 *
 * Existe porque uma trajetória longa na mesma empresa não é uma linha só:
 * estagiário, programador e gerente de projetos são responsabilidades
 * diferentes, com períodos próprios, e achatá-las em um cargo único apaga
 * justamente a progressão que sustenta a senioridade.
 */
export interface Cargo {
	titulo: Redacao;
	periodo: Periodo;
	vinculo?: Vinculo;
	dedicacao?: Dedicacao;
	/** Taxonomia do que era seu — substantivos, para consumo por agentes. */
	responsabilidades?: readonly Redacao[];
	/**
	 * O que foi feito, com a complexidade e o efeito.
	 *
	 * Diferente de `responsabilidades`: "arquitetura de software" é atividade;
	 * "Defini a arquitetura de plataformas distribuídas de missão crítica" é
	 * evidência. Para leitura humana em posição sênior, é isto que conta.
	 *
	 * Voz: primeira pessoa implícita, verbo no passado — "Liderei", "Defini",
	 * "Conduzi". Sem "eu", que soa apresentação oral, e sem terceira pessoa, que
	 * soa carta de recomendação. O verbo na primeira pessoa é o que deixa claro
	 * quem tomou a decisão, e em vaga de liderança essa diferença é o argumento.
	 */
	realizacoes?: readonly Redacao[];
	marcos?: readonly Redacao[];
	/** Sistemas ou produtos construídos neste cargo. */
	sistemas?: readonly Redacao[];
}

export interface ExperienciaProfissional {
	id: Redacao;
	organizacao: Redacao;
	estado: "atual" | "encerrada";
	local?: Redacao;
	/** Cargos em ordem cronológica — o mais recente primeiro. */
	cargos: readonly Cargo[];
	frentes?: readonly Frente[];
	/**
	 * Liderança direta de pessoas nesta experiência.
	 *
	 * O campo já se chamou `maiorTimeLiderado`, e o nome vazou para a página
	 * como rótulo: "Maior time liderado: cerca de 20 programadores". Um
	 * superlativo com uma ressalva em cima dele afirma teto duas vezes — foi o
	 * máximo que deu, e nem esse número é firme. Ninguém se apresenta assim.
	 *
	 * `quantidade` guarda um piso (`minima`), não um pico: "mais de 15" é
	 * verdade quando o time beirava vinte, não infla nada e deixa o topo em
	 * aberto, que é como a afirmação deve ser lida.
	 *
	 * `minima` qualifica o número afirmado, não o efetivo de cada dia: diz "o
	 * time passava de quinze pessoas", e não "nunca houve menos de quinze". Um
	 * time cresce e encolhe; o que a frase publica é a ordem de grandeza que a
	 * liderança alcançou.
	 */
	lideranca?: {
		quantidade: Quantidade;
		/**
		 * Quem compunha o time, como sintagma que continua a frase.
		 *
		 * Era uma sentença própria ("Desenvolvedores de diferentes níveis…"), e o
		 * currículo a imprimia depois de "Liderei times de N programadores." —
		 * duas frases dizendo o mesmo sujeito, a segunda repetindo em
		 * "desenvolvedores" o que a primeira já chamara de "programadores".
		 * Como sintagma, encaixa sem repetir.
		 */
		composicao: Redacao;
		procedencia?: Procedencia;
	};
	/** O que sustenta o que esta experiência afirma. */
	evidencias?: readonly Evidencia<Unidade>[];
	/**
	 * Relevância para esta instância.
	 *
	 * A base guarda a trajetória inteira; cada canal decide até onde vai. Um
	 * estágio de 2000 pertence ao histórico, não ao currículo de liderança
	 * técnica — e essa decisão fica no dado, não numa condição espalhada por
	 * cada renderizador.
	 */
	relevancia: "principal" | "complementar" | "historica";
	/**
	 * Presente quando a experiência não deve aparecer nas renderizações.
	 *
	 * Relevância e divulgação são eixos diferentes: algo pode ser atual e ainda
	 * assim não pertencer ao material. O motivo é obrigatório para que omitir
	 * seja uma decisão registrada, e não um esquecimento.
	 */
	reserva?: { motivo: Redacao };
}
