/**
 * Emite o vocabulário do domínio como JSON em `dist/`, para ferramentas que
 * não leem TypeScript: documentação de domínio, prompts de agente,
 * validadores.
 *
 * Só vocabulário e tabelas de transição — nada de instância, que é de quem usa
 * o pacote e mora no repositório dessa pessoa.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
	efeitosCognitivos,
	efeitosComportamentais,
	efeitosEmocionais,
	perfisAgente,
	perfisHumanos,
	regrasDoDominio,
	transicoesDaHistoria,
	transicoesDaMissao,
	transicoesDoConteudo,
	transicoesDoContexto,
	transicoesDoItemDaRotina,
	verbosNaoObservaveis,
} from "../src/index.ts";

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(raiz, "dist");
mkdirSync(dist, { recursive: true });

const { version: versao } = JSON.parse(
	readFileSync(resolve(raiz, "package.json"), "utf8"),
);

const vocabulario = {
	produto: { nome: "PRISMA Intent", especializacao: "educate", versao },
	perfisHumanos,
	perfisAgente,
	efeitos: {
		cognitivos: efeitosCognitivos,
		emocionais: efeitosEmocionais,
		comportamentais: efeitosComportamentais,
	},
	verbosNaoObservaveis,
	regrasDoDominio,
	maquinasDeEstado: {
		historia: transicoesDaHistoria,
		missao: transicoesDaMissao,
		itemDaRotina: transicoesDoItemDaRotina,
		contexto: transicoesDoContexto,
		conteudo: transicoesDoConteudo,
	},
};

const saida = resolve(dist, "educate.vocabulario.json");
writeFileSync(saida, `${JSON.stringify(vocabulario, null, 2)}\n`);
console.log(`Vocabulário emitido em ${saida}`);
