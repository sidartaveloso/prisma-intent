# PRISMA Intent

**A typed, structured way to think, build, fix, communicate, provide — and be.**

O PRISMA Intent é uma maneira estruturada e tipada de transformar intenção em
pensamento, ação e resultado. Ele estrutura **o que** queremos fazer, **por
que** queremos fazer, **como** pretendemos fazê-lo e **como reconhecemos** se
fizemos bem — numa representação que pessoas e agentes de IA compartilham, e
que validações executáveis conseguem conferir.

> A intenção define o propósito. Os tipos tornam a estrutura explícita. A
> execução a transforma em ação. A validação confere o que pode ser verificado.

## Os verbos

| Verbo | O que significa |
| --- | --- |
| **Think** — pensar | Estruturar problemas, objetivos, hipóteses, evidências e decisões. Tornar o raciocínio explícito o suficiente para ser examinado, compartilhado e aprimorado. |
| **Build** — construir | Transformar intenções e especificações em sistemas, produtos, experiências e entregáveis com critérios claros de aceitação. |
| **Fix** — corrigir | Identificar o que está errado, entender o comportamento esperado, investigar evidências e verificar se a correção resolveu o problema sem criar outros. |
| **Communicate** — comunicar | Preservar o significado e a intenção enquanto a expressão se adapta a pessoas, contextos, idiomas e canais. |
| **Provide** — entregar valor | Alinhar necessidades, expectativas, compromissos e critérios de qualidade ao que efetivamente será entregue. |
| **Be** — ser | Aplicar a mesma estrutura à maneira como aprendemos, amadurecemos, nos posicionamos e agimos — sem presumir que a vida humana possa ser reduzida a tipos ou regras. |

## Por que tipado

Instruções vagas — "resolva o problema com cuidado", "escreva algo
convincente" — deixam implícito justamente o que precisaria ser conferido. Uma
instância PRISMA declara:

- qual problema precisa ser resolvido e qual estado é desejado;
- quais fatos e evidências estão disponíveis, e de onde vieram;
- quais hipóteses ainda precisam ser verificadas — o desconhecido é um valor
  (`Certeza` com `a_confirmar`), não um campo esquecido;
- quais ações são permitidas e quais invariantes precisam ser preservados;
- como determinar se o resultado atende aos critérios.

A tipagem não serve apenas para organizar dados: ela torna explícitas as
condições para pensar e agir corretamente num contexto, e parte das
inconsistências deixa de ser revisão para virar erro de compilação ou de
validação.

**O que o PRISMA não pretende** é tipar a vida inteira. Ele torna estruturáveis,
explícitos e verificáveis os aspectos de uma intenção que precisam orientar uma
ação. Até onde essa promessa vai depende do que o modelo e os validadores
realmente conseguem expressar — e este repositório só afirma o que eles já
conferem.

## Hoje: a comunicação como primeira aplicação

A primeira aplicação implementada é **Communicate**. Antes de escrever uma
página, um currículo ou uma proposta, a mensagem é modelada como dado — quem vai
ler, o que essa pessoa quer descobrir, o que queremos que ela conclua, o que
afirmamos e com que prova, o que a impede de acreditar e o que nenhuma versão
pode afirmar. Dessa base única saem as renderizações, por canal, profundidade e
idioma:

```text
fatos e evidências ──► ARGUMENTOS que podemos provar
                                │
     nossa intenção × intenção de quem lê × canal
                                │
          página · currículo · proposta · dados semânticos
```

O que o compilador e os validadores já conferem:

- um argumento que cita uma evidência inexistente **não compila**;
- as **regras de integridade** dizem o que nenhuma saída pode afirmar, e
  `verificarRegras` reprova a saída que afirma;
- o que falta saber vira uma lista de **lacunas** a preencher;
- cada fato carrega a **procedência**: de onde veio e quem o sustenta.

### A gramática do core

| Conceito | Pergunta que responde |
| --- | --- |
| `Consumidor` | Quem recebe e interpreta? (pessoa ou agente) |
| `IntencaoDoConsumidor` | O que ele está tentando descobrir? |
| `NossaIntencao` | O que queremos que ele conclua? |
| `Contexto` | Em que canal e situação isso é consumido? |
| `Argumento` | O que estamos afirmando — e com o que provamos? |
| `Evidencia` | O que sustenta a afirmação? |
| `Objecao` | O que pode impedir que ele acredite ou avance? |
| `CriterioDeDecisao` | Por quais dimensões ele decide? |
| `EstrategiaNarrativa` | O que a peça deve provocar? |
| `Renderizacao` | Como isso vira uma saída concreta — em que profundidade, com que limites e em que idiomas? |
| `RegraDeIntegridade` | O que nenhuma saída pode afirmar? |

## Pacotes

| Pacote | Para quê |
| --- | --- |
| [`@prisma-intent/core`](packages/core) | A estrutura semântica e tipada. Não conhece nenhum domínio. |
| [`@prisma-intent/work`](packages/work) | Posicionamento e desenvolvimento profissional: currículo, portfólio, site pessoal, candidatura, entrevista. |
| [`@prisma-intent/educate`](packages/educate) | Educação e aprendizagem, em qualquer idade: o que se quer que alguém aprenda, como se observa que aprendeu, e as histórias, missões e rotinas que levam até lá — separando quem aprende de quem decide e de quem acompanha. |
| [`@prisma-intent/sales`](packages/sales) | Estratégia e execução comercial: proposta, escopo, conformidade, preço, cronograma e leitura por leitor. |

São aplicações de uma mesma abordagem, não produtos sem relação entre si. As
especializações dependem do core; o core nunca conhece uma especialização, e
nenhuma depende de outra. Um domínio novo — desenvolvimento de software,
diagnóstico, operações, tomada de decisão — é uma especialização nova, sem
redefinir o core, desde que faça sentido para a arquitetura.

> **Estado:** os pacotes estão sendo trazidos para este repositório e ainda não
> foram publicados. A primeira versão sai junto para todos.

## Instalação

```bash
pnpm add @prisma-intent/core @prisma-intent/work
```

Os pacotes são publicados no npmjs com procedência (*provenance*) assinada pelo
GitHub Actions; cada versão tem um [release](https://github.com/sidartaveloso/prisma-intent/releases)
com as notas da mudança.

## Um exemplo

Uma instância é a base única de que saem todas as renderizações. Declará-la faz
o compilador conferir as referências cruzadas — este exemplo é compilado pelos
testes do repositório, então ele não fica para trás quando a API muda:

```ts
import { definirInstancia } from "@prisma-intent/work";

export const instancia = definirInstancia({
	cases: [{ id: "migracao-de-pagamentos" /* … */ }],
	argumentos: [
		{
			id: "arquitetura-e-execucao",
			// @ts-expect-error — o case "migracao-de-pagamento" não existe
			evidencias: [{ tipo: "case", case: "migracao-de-pagamento" }],
		},
	],
});
```

## Princípios

- **Fatos, não voz.** A instância guarda o que é verdade e o que o sustenta; o
  tom é do canal.
- **Tipagem semântica forte.** União discriminada em vez de propriedades
  opcionais, vocabulário literal em vez de `string`, *make impossible states
  unrepresentable*.
- **Todo termo tem definição.** O vocabulário é legível por pessoas e por
  agentes.
- **Só se afirma o que se verifica.** Isso vale para as instâncias e para este
  README.

## Contribuindo

O repositório segue a metodologia OpenTask: nenhuma mudança sem tarefa e
critérios de aceite registrados (`TASKS/`, `.opentask/`). Veja o
[AGENTS.md](AGENTS.md) antes de abrir um PR.

```bash
asdf install       # Node e pnpm nas versões do .tool-versions
pnpm install
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

Tudo neste repositório é público: exemplos e testes usam dados fictícios, e o
gitleaks confere segredos e dados pessoais em cada commit. Encontrou algo que não
deveria estar aqui? Veja o [SECURITY.md](SECURITY.md).

## Licença

[MIT](LICENSE) © 2026 Sidarta Veloso
