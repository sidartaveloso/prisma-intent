# AGENTS.md — @prisma-intent/core

Instruções para quem for **mexer no core**. Para entender a tese, leia o
[README](README.md); este arquivo é sobre operação.

## A regra que não se negocia

O core não conhece currículo, vaga, recrutador, canal, cargo nem preço. Se um
tipo novo precisa citar um conceito de domínio, **ele não é do core** — é da
especialização (`@prisma-intent/work`, ou outra que venha). A dependência é
sempre `especialização → core`, nunca de volta.

O mecanismo que sustenta isso é o parâmetro genérico: cada tipo daqui recebe o
vocabulário de fora.

```ts
Renderizacao<TTipo, TReferencia, TIdioma>
Consumidor<TPerfilHumano, TPerfilAgente, TIntencao, TArgumentoId>
Argumento<TId, TReferencia>
```

**Como estender sem quebrar quem já instancia:** genérico novo entra com
`default`. Foi assim que `TIdioma` entrou em `Renderizacao` — `TIdioma extends
string = string` deixou todas as instanciações existentes válidas, e só a
especialização que quis amarrar ao seu vocabulário precisou mudar.

## Modelagem

Tipagem semântica forte, no espírito de *make impossible states unrepresentable*:

- **União discriminada** em vez de saco de opcionais. `{ copiar?, baixar? }`
  deixa representável o objeto com os dois — e o com nenhum.
- **Vocabulário literal** em vez de `string`. `definirVocabulario` existe para
  que um termo não seja só um valor válido: ele carrega nome e definição, e a
  ontologia fica legível por pessoas e por agentes.
- **`Certeza<T>`** torna o desconhecido representável: `a_confirmar` é um valor,
  não a ausência de um campo.
- **`PeloMenosUm<T>`** para lista que não pode estar vazia.
- **`Marca<T, S>`** (branded) onde não há vocabulário literal melhor.

### `Redacao` é português por contrato

`Redacao = string` marca os poucos pontos em que texto livre é legítimo, e sua
própria definição diz "texto em português destinado a leitura humana".

A consequência é operacional, não decorativa: **saída em outro idioma é
responsabilidade do canal**, e `verificarRegras` não a cobre até que a regra
ganhe padrões naquele idioma. Uma política publicada em inglês contra regras
escritas só em português passa com "nenhuma violação" — o que é pior do que não
verificar, porque dá a impressão de material conferido.

## `verificarRegras` — o que ele faz, e o que não faz

`integridade.ts`. Casa expressão regular contra um texto e devolve as violações.

```ts
verificarRegras(texto, regras) → Violacao[]
```

O que ele **não** faz, e é fácil supor que faça:

- **Ignora 5 das 7 naturezas de regra.** Só `restricao_de_divulgacao` e
  `restricao_de_competencia` carregam `padroesVedados`; `fato_invariavel`,
  `separacao_de_autoria`, `restricao_de_projeto`, `restricao_de_resultado` e
  `restricao_de_case` passam direto. Regra sem padrão é documentação — vale como
  orientação editorial, mas nada a confere.
- **Para no primeiro match por padrão.** Devolve uma violação por padrão, não uma
  por ocorrência.
- **Não sabe de idioma.** É `RegExp(padrao, "i")` sobre o texto que você passar.

Não confunda com `prisma-verificar-publicacao`, que é outra ferramenta, em outra
camada, com outro escopo — a comparação está no
[AGENTS.md de work](../work/AGENTS.md).

## Mapa de arquivo → conceito

| Arquivo | O que modela |
| --- | --- |
| `consumidor.ts` | Quem recebe e interpreta (humano e agente não compartilham forma) |
| `intencao.ts` | O que queremos que ele conclua |
| `contexto.ts` | Canal e profundidade |
| `argumento.ts` | O que afirmamos, e com o que provamos |
| `evidencia.ts` | O que sustenta a afirmação (8 arms, cada um com o que o torna verificável) |
| `objecao.ts` | O que pode impedir que ele acredite ou avance |
| `criterio.ts` | Por quais dimensões ele decide |
| `narrativa.ts` | O que a peça deve provocar |
| `renderizacao.ts` | Como isso vira uma saída concreta |
| `integridade.ts` | O que nenhuma saída pode afirmar (+ `verificarRegras`) |
| `prioridade.ts` | Escalas: `Prioridade`, `NivelDeEvidencia`, `Certeza` |
| `premissa.ts` | `Premissa` (valor de trabalho antes da decisão), `DecisaoRegistrada`, `Data`, `valorDaPremissa` |
| `interno.ts` | `Interno`, `TextoInterno`, `ConteudoRenderizavel`, `garantirRenderizavel` |
| `observacao.ts` | `ObservacaoDosEfeitos`: uma observação por efeito comportamental desejado |
| `vocabulario.ts` | `Termo`, `Vocabulario`, `definirVocabulario` |
| `utilitarios.ts` | `Marca`, `PeloMenosUm`, `Redacao`, `GarantirExaustividade` |

## Promovido de especialização

`premissa.ts`, `interno.ts` e `observacao.ts` nasceram na Sales e subiram
quando a Funding precisou dos mesmos conceitos. É o critério: **dois
domínios precisando do mesmo conceito, sem nenhum termo de domínio nele**, é
gramática. A Sales reexporta os nomes, para que quem já a consome não mude.

`garantirRenderizavel` e `valorDaPremissa` são as únicas funções do core além
de `verificarRegras` e `definirVocabulario`, e têm teste (`test/`).

## Exportado e sem uso

`Marca`, `AtivoVisual`, `Variante` e `Contexto` são exportados e nenhuma
instância os usa hoje. Estão registrados aqui para que ninguém conclua que
precisa preenchê-los — nem que a ausência deles é um esquecimento a corrigir.
