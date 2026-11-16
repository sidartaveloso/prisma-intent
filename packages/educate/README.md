# @prisma-intent/educate

**PRISMA Intent — especialização Educate.** Educação e aprendizagem em qualquer idade: histórias com intenção, missões que saem da tela, rotina e o contexto de quem ensina, com quem acompanha participando.

Este pacote modela **o que uma mensagem significa** neste domínio. O [core](../core/README.md) modela **como uma mensagem ganha intenção**; ele não sabe o que é aprendiz, quem decide, missão ou objetivo observável — esses conceitos existem só aqui.

```text
Work ───────┐
Educate ────┤
Sales ──────┼──► Core
Funding ────┘
```

## Domínio, produto e instância

O pacote guarda só o que vale para educar alguém de qualquer idade. A pergunta que decide onde uma coisa mora: **a frase é verdadeira para qualquer plataforma que eduque, ou só para uma?**

| Camada | Exemplo | Onde mora |
| --- | --- | --- |
| Domínio | "Quem aprende nem sempre é quem decide"; "a moral não é declarada" | aqui |
| Produto | "Abaixo de certa idade, só para ver juntos"; os canais, as faixas, as linhas de conteúdo | vocabulário da instância, declarado por quem usa o pacote |
| Instância | O brief desta história, para este aprendiz | quem usa — em outro repositório |

Faixa etária, canal, linha de conteúdo, necessidade, estágio e os efeitos comportamentais próprios de um produto entram como **vocabulário da instância** (`VocabularioDaInstancia`): a instância os declara com `definirVocabulario` e os entrega ao brief, do mesmo modo que as especializações entregam o seu vocabulário ao core.

## Gramática

| Conceito | Pergunta que responde |
| --- | --- |
| `PerfilDeAprendiz` | Quem vai viver a história — e quem decide por ele, se não for ele |
| `QuemDecide` | O próprio aprendiz ou outra pessoa, que então precisa existir |
| `NossaIntencaoEducate` | Que efeito a história deve provocar: cognitivo, emocional, comportamental (Bloom, Krathwohl, Mager) |
| `ObjetivoObservavel` | Como se relata que o efeito aconteceu, sem inventar |
| `Tema` (com `OrigemDoTema`) | De onde vem a matéria-prima: o que o grupo estuda, um acontecimento ou um interesse |
| `MundoFiccional` | Em que cenário o tema é contado |
| `MissaoDoAprendiz` × `MissaoDeQuemAcompanha` | O que o aprendiz vê × o que alguém prepara em segredo; a confirmação libera |
| Cinco máquinas de estado | História, missão, rotina, contexto e catálogo — independentes |
| `regrasDoDominio` | O que nenhuma saída pode afirmar, com padrão verificável quando há texto |
| `VocabularioDaInstancia` | O que é do produto: canais, linhas, faixas, necessidades, estágios, efeitos próprios e idiomas |
| `Brief` | O contrato de uma história: tudo acima, junto |

## Três decisões que o domínio carrega

- **Quem aprende nem sempre é quem decide** (`QuemDecide`). A criança vive e outra pessoa decide por ela; o adulto que estuda por conta própria vive e decide. O perfil declara qual é o caso, e "outra pessoa decide, e não há ninguém" não compila.
- **A métrica não é tempo de tela** (`sem_telemetria_na_saida`): o acompanhamento diz o que o aprendiz viveu e o que fez depois. A regra tem `padroesVedados` e `verificarRegras` a confere.
- **A moral não é declarada** (`moral_nao_declarada`): a conclusão é formada pelo aprendiz. Também verificável por padrão.

## O vocabulário da instância

```ts
import { definirVocabulario } from "@prisma-intent/core";
import { definirBrief, type EfeitoComportamental } from "@prisma-intent/educate";

const canais = definirVocabulario({
  tela_da_sala: { nome: "Tela da sala", descricao: "A criança diante da tela, com a família por perto." },
});
const meusEfeitos = definirVocabulario({
  convidar_para_jogar_de_novo: { nome: "Convidar para jogar de novo", descricao: "Chamar o outro para mais uma partida." },
});

type Vocabulario = {
  canal: keyof typeof canais;
  linha: "licoes_de_vida";
  faixa: "seis_a_oito";
  necessidade: never;
  estagio: never;
  efeitoComportamental: EfeitoComportamental | keyof typeof meusEfeitos;
  idioma: "pt-BR";
};

export const brief = definirBrief<Vocabulario>()({ /* … */ });
```

`definirBrief` tem dois passos porque o TypeScript não infere parte dos parâmetros de tipo: o primeiro recebe o vocabulário, o segundo infere os ids das missões. Dois briefs completos, de idades diferentes, estão em [`test/exemplo.ts`](test/exemplo.ts).

## Modelagem

A do core, no espírito de *make impossible states unrepresentable*: união discriminada em vez de saco de opcionais (`OrigemDoTema`, `QuemDecide`, `EstagioDeDesenvolvimento`), vocabulário literal via `definirVocabulario` (cada termo carrega nome e definição), `const` genéricos com `NoInfer` em `definirBrief` para que uma missão de quem acompanha não libere uma missão do aprendiz inexistente, e máquinas de estado como dado (`Transicoes`) conferido por teste.

Para **mexer** no pacote — o que é dele, o que é do core e o que é de instância — veja [AGENTS.md](AGENTS.md).

## Comandos

```bash
pnpm --filter @prisma-intent/educate typecheck   # inclui os testes de tipo
pnpm --filter @prisma-intent/educate test        # máquinas de estado, regras, briefs e tsc
pnpm --filter @prisma-intent/educate emitir      # dist/educate.vocabulario.json
```
