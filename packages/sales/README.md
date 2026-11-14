# @prisma-intent/sales

**PRISMA Intent — especialização Sales.** A proposta comercial orientada por intenção: uma mensagem para vários leitores dentro da organização compradora, cada um decidindo por critérios diferentes, gerada de uma instância única e medida pela leitura.

Este pacote modela **o que uma proposta significa**. O [core](../core/README.md) modela **como uma mensagem ganha intenção**; ele não sabe o que é preço, requisito, conformidade ou leitura medida — esses conceitos existem só aqui.

```text
Work ──────┐
Educate ───┼──► Core
Sales ─────┘
```

Vocabulário, tipos e a função de preço. As **instâncias** — as propostas concretas, com leitores, preços e estratégia — ficam com quem as usa, em outro repositório. Nenhum dado de proponente ou comprador real entra aqui, e um teste confere.

## A tese

Uma proposta comercial não é um documento: é um conjunto de leitores. A diretoria comercial lê o preço, a avaliação técnica lê a arquitetura, compras confere o formato, o avaliador do cliente final procura aderência ao edital e um agente resume tudo para alguém que não vai ler. A Sales acrescenta ao core o que só existe em venda:

- **escopo**, com os requisitos do cliente e a conformidade de cada um;
- **preço** — calculado por `calcularPreco` a partir de linhas, taxa e premissas, nunca digitado;
- **cronograma**, com marcos de aceite;
- **leitor** com organização e o que ele vê;
- **sinal de leitura**, que liga cada efeito desejado a um comportamento observável;
- **dado interno** que nenhum conteúdo renderizável aceita.

## Gramática

| Conceito | Pergunta que responde |
| --- | --- |
| `LeitorDaProposta` | Quem lê, de que organização, com que profundidade e o que não vê? |
| `OrganizacaoEnvolvida` | Quem é a destinatária, quem é o cliente final, quem é parceiro? |
| `IntencaoDaProposta` | O que queremos que este leitor conclua, e por quais efeitos? |
| `ObservacaoDoEfeito`, `SinalDeLeitura` | Como saberemos se o efeito aconteceu? |
| `EvidenciaSales` | O que sustenta a afirmação, e com que fonte? |
| `PacoteDeTrabalho` | O que se entrega, quem executa, quanto esforço foi estimado? |
| `Requisito`, `Conformidade` | O que o cliente pediu, e como cada pedido é atendido? |
| `Estimativa` | Quanto esforço, estimado por quem? (interna) |
| `LinhaDePreco`, `Dinheiro`, `TaxaPorHora`, `Premissa` | De que se compõe o preço, e o que ainda está por confirmar? |
| `calcularPreco`, `PrecoCalculado` | Quanto custa, uma vez e por mês, em N anos, e quanto se paga em cada marco? |
| `Cronograma`, `MarcoDeAceite` | Em que meses, com que aceite, entregando que pacotes? |
| `RenderizacaoSales` | Que saída, para quem, com que seções, em que idioma? |
| `InstanciaSales` | A proposta inteira: tudo acima, com as referências conferidas |

## Três decisões que o domínio carrega

- **O preço é calculado, nunca escrito.** A linha de implementação tem horas; a taxa é parâmetro da proposta; `calcularPreco` devolve os totais (ver [Preço](#preço)).
- **Entendimento e estimativa são internos, por tipo.** `Redacao` é `string`, e qualquer `string` marcada continuaria atribuível a ela. Por isso o dado interno é um objeto marcado `visibilidade: "interna"`: não cabe num campo de texto, e `ConteudoRenderizavel` o recusa em qualquer profundidade. `garantirRenderizavel` repete a conferência em execução.
- **O que afirma fato sobre o proponente exige fonte.** Caso, métrica, demonstração e certificação têm `fonte: Certeza<FonteDaEvidencia>`. Enquanto a fonte está `a_confirmar`, a evidência existe no modelo e não se renderiza.

## Instância

Declarada com `definirInstancia`, que infere os ids do próprio dado e faz o compilador recusar referência a leitor, organização, argumento, evidência, pacote, requisito ou marco inexistente — e exigir a observação de cada efeito comportamental desejado:

```ts
export const proposta = definirInstancia({
  intencoes: [{ /* … */ efeitosDesejados: { comportamentais: ["agenda_reuniao"] } }],
  observacaoDosEfeitos: {},
  //                    ^ erro: falta agenda_reuniao
  preco: {
    marcosDePagamento: [{ marco: "aceite_fnal", percentual: 100 }],
    //                            ^ erro: o cronograma não tem esse marco
  },
});
```

A instância fictícia dos testes ([`test/exemplo.ts`](test/exemplo.ts)) mostra todos os campos.

> Antes de mexer em qualquer coisa aqui, leia o [AGENTS.md](AGENTS.md): o que é deste pacote e o que é da instância, como se declara conteúdo renderizável e as armadilhas conhecidas.

## Preço

`calcularPreco(instancia.preco)` devolve, numa moeda só:

- cada linha com valor e periodicidade (`linhas`), e a contingência como linha própria, calculada sobre as linhas de implementação;
- `custoUnico`, `recorrenteMensal` e `recorrenteAnual`, cada um com `calculado`, `ajuste` e `total`;
- `recorrenteEmUmAno` (12 × mensal + anual) e o `tco` de cada horizonte: custo único + anos × recorrente em um ano;
- `subtotaisPorCategoria`, pelo rótulo livre que a instância dá a cada linha;
- `opcionais`, cada um com os próprios totais, fora do preço base e do fluxo de pagamento;
- `pagamentos`: o custo único dividido pelos marcos, somando exatamente o total;
- `situacao`: `rascunho` enquanto a taxa ou alguma premissa estiver `a_confirmar`.

```ts
calcularPreco({
  moeda: "USD",
  taxaPorHora: { estado: "confirmada", valor: { forma: "razao", valor: { centavos: 18_600_000, moeda: "USD" }, porHoras: 2_323 }, decisao },
  arredondamento: { custoUnico: { tipo: "nenhum" }, recorrente: { tipo: "nenhum" } },
  linhas: [{ natureza: "implementacao", descricao: "…", categoria: "…", horas: 2_323 }],
  horizontesDoTcoEmAnos: [3, 5],
  marcosDePagamento: [{ marco: "aceite", percentual: 100 }],
  premissas: [],
}).custoUnico.total; // { centavos: 18_600_000, moeda: "USD" } — exatos
```

Três regras de aritmética:

- **Sem ponto flutuante acumulado.** Dinheiro é centavo inteiro; horas e percentuais aceitam até duas casas decimais e viram centésimos; a conta é em `bigint`.
- **A taxa pode ser uma razão.** Uma taxa implícita (um total sobre um número de horas) não cabe em centavos inteiros e, arredondada antes, erraria em cada hora. `{ forma: "razao", valor, porHoras }` mantém a conta exata, e cada linha vai ao centavo uma vez, a partir do valor exato (meio centavo para cima).
- **O arredondamento comercial é explícito e é o último passo.** `nenhum` ou múltiplo de um valor (`mais_proximo`, `para_cima`, `para_baixo`), declarado à parte para custo único e recorrente. A diferença aparece como `ajuste`, para que as linhas mais o ajuste deem o total.

Entrada que exigiria arredondamento escondido — centavo fracionário, três casas decimais, moeda diferente da proposta — e marcos que não somam 100% são recusados com `ErroDePreco`.

## Comandos

```bash
pnpm --filter @prisma-intent/sales typecheck   # inclui os testes de tipo
pnpm --filter @prisma-intent/sales test        # preço, vocabulário, projeções, dependências e tsc
```
