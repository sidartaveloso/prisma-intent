# @prisma-intent/core

**PRISMA Intent** — Narrativa Semântica Adaptativa orientada por intenção.

Este pacote é o núcleo: modela **como uma mensagem ganha intenção**. As
especializações modelam **o que aquela mensagem significa em cada domínio**.

## A regra que sustenta a arquitetura

O core nunca conhece conceitos de uma especialização. Ele não sabe o que é
currículo, vaga, recrutador, produto ou preço — e é isso que mantém a
generalização possível.

```text
Work ───────┐
Educate ────┤
Sales ──────┼──► Core
Funding ────┘
```

`Work` (posicionamento profissional), `Educate` (educação e aprendizagem, em
qualquer idade), `Sales` (proposta comercial) e `Funding` (financiar um produto
antes de produzi-lo) são as especializações reais. Foi `Educate` quem provou
que o core generaliza além de currículo — e o que ela pediu (um consumidor que
não decide, conteúdo que não argumenta, renderização em objeto físico) foi
resolvido na especialização, sem tocar aqui. Quando `Sales` e `Funding`
precisaram dos mesmos conceitos sem domínio (premissa, dado interno, observação
dos efeitos), eles subiram para cá.

Os tipos daqui são genéricos para que cada domínio forneça seu próprio
vocabulário sem devolver dependência para cá.

## Gramática

| Conceito | Pergunta que responde |
| --- | --- |
| `Consumidor` | Quem recebe e interpreta? (humano ou agente) |
| `IntencaoDoConsumidor` | O que ele está tentando descobrir? |
| `NossaIntencao` | O que queremos que ele conclua? |
| `Contexto` | Em que canal e situação isso é consumido? |
| `Argumento` | O que estamos afirmando — e com o que provamos? |
| `Evidencia` | O que sustenta a afirmação? |
| `Objecao` | O que pode impedir que ele acredite ou avance? |
| `CriterioDeDecisao` | Por quais dimensões ele decide? |
| `EstrategiaNarrativa` | O que a peça deve provocar? |
| `AtivoVisual` | Que imagem ajuda a provocar isso? |
| `Renderizacao` | Como isso vira uma saída concreta — em que profundidade, com que limites e em que idiomas? |
| `RegraDeIntegridade` | O que nenhuma saída pode afirmar? |
| `ObservacaoDosEfeitos` | Como se sabe que cada efeito comportamental desejado aconteceu? |
| `Premissa`, `DecisaoRegistrada` | Com que valor se trabalha antes de decidir, e quem decidiu? |
| `Interno`, `ConteudoRenderizavel` | O que nunca chega a uma saída, e como isso se confere? |

## Modelagem

Tipagem semântica forte, no espírito de *make impossible states unrepresentable*:

- união discriminada em vez de saco de propriedades opcionais;
- vocabulário literal em vez de `string`;
- `Marca<T, S>` (branded) onde não há vocabulário literal melhor;
- `Redacao` marca os poucos pontos em que texto livre é legítimo;
- `Certeza<T>` torna o desconhecido representável — `a_confirmar` é um valor,
  não a ausência de um campo.

O `definirVocabulario` existe para que um termo não seja apenas um valor válido:
ele carrega nome e definição, e a ontologia fica legível por pessoas e agentes.

Para **mexer** no core — o que é dele e o que é da especialização, como estender
sem quebrar, e o que `verificarRegras` não faz — veja [AGENTS.md](AGENTS.md).
