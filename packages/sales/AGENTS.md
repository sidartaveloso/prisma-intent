# AGENTS.md — @prisma-intent/sales

Manual operacional. A tese está no [README](README.md); aqui está o que decide onde cada coisa vai e o que já se sabe que dá errado.

## 1. Três camadas

| Camada | O que é | Onde |
| --- | --- | --- |
| Core | Gramática universal: consumidor, intenção, argumento, evidência, objeção, renderização, regra de integridade | `../core` |
| **Sales (este pacote)** | Vocabulário e tipos de qualquer proposta comercial — leitores, intenções, efeitos, evidências, objeções típicas, escopo, conformidade, preço, cronograma, sinal de leitura — e a função de preço | aqui |
| Instância | Uma proposta concreta: quem lê, o que se afirma, quanto custa, a estratégia | quem usa — em outro repositório |

Teste para saber onde algo vai: **a frase é verdadeira para qualquer proposta comercial, ou só para esta?** "Uma certificação só se renderiza com fonte confirmada" é do domínio. "A taxa é X por hora" é instância. "O consumidor tem intenções prováveis" é core.

Se um tipo novo precisa citar uma empresa pelo nome, ele não é deste pacote. `test/dependencias.test.ts` confere que a única dependência é o core — nada de `work`, de `educate` nem de `funding` — e, quando a variável `PRISMA_NOMES_VEDADOS` traz uma expressão regular, que nenhum arquivo do pacote casa com ela. A lista de nomes não mora aqui: num repositório aberto, ela seria o vazamento.

## 2. Dado interno e conteúdo renderizável

A instância carrega o `entendimento` de cada requisito e a `Estimativa` de cada pacote. Os dois vivem ao lado do texto que vai ao leitor, e a separação não pode depender de quem escreve o renderizador lembrar dela.

- **O dado interno é objeto, não `string`.** `Redacao` é `string` no core; uma `Marca<string, …>` continuaria atribuível a ela. `Interno<T>` acrescenta `visibilidade: "interna"`, e `TextoInterno` é `Interno<{ texto }>`. Declare com `interno("…")`.
- **`ConteudoRenderizavel` é a forma do que atravessa para a saída**: texto, número, booleano, listas e objetos disso, nunca um objeto com `visibilidade`. Todo tipo de conteúdo que um renderizador produz — o JSON do site, as linhas da planilha, o modelo do PDF — deve caber nele.
- **Projete antes de renderizar.** `requisitoParaLeitor` e `pacoteParaLeitor` retiram o dado interno em execução. Os tipos `RequisitoParaLeitor` e `PacoteParaLeitor` proíbem a chave (`?: never`), para que o objeto completo não passe por eles.
- **`garantirRenderizavel(conteudo)`** confere por tipo e em execução, e diz o caminho do dado interno quando acha um. Use no ponto em que o conteúdo sai do Node.

Isso não substitui a regra do `AGENTS.md` da raiz: **nada empacotado importa a instância**. O tipo impede o dado interno de entrar no conteúdo; só a pré-computação impede a instância inteira de entrar no bundle.

## 3. O que este domínio pediu ao core e como foi resolvido

| Pressão | Resolução | Onde |
| --- | --- | --- |
| A proposta chega a mais de uma organização, e o mesmo perfil lê diferente em cada uma | `OrganizacaoEnvolvida` declarada uma vez, com `papel`; `LeitorDaProposta` = `Consumidor` do core + `organizacao`, conferida pelo compilador | `leitor.ts` |
| Cada leitor vê uma parte (preço só para quem decide comercialmente) | `secoesOcultas` e `profundidade` no leitor; `leitores` na renderização | `leitor.ts`, `renderizacao.ts` |
| Calcular com valor ainda não confirmado | `Premissa<T>`: o `a_confirmar` do core não carrega valor; a premissa carrega o valor de trabalho e a decisão registrada de pessoa | `premissa.ts` |
| Efeito desejado precisa de forma verificável | `observacaoDosEfeitos`, um registro por efeito comportamental desejado, por sinal de leitura ou por resposta do leitor | `intencao.ts` |
| Texto que não pode chegar ao leitor | `Interno<T>` e `ConteudoRenderizavel` | `interno.ts` |
| Fato sobre o proponente sem fonte | `fonte: Certeza<FonteDaEvidencia>` nos tipos de evidência que afirmam fato | `evidencia.ts` |

Nada disso mudou o core. Se algum dia precisar, a forma é genérico novo com `default` (ver o `AGENTS.md` do core).

## 4. `Redacao` em outro idioma

O core define `Redacao` como "texto em português destinado a leitura humana". Uma proposta pode ser escrita direto no idioma do leitor — por isso `instancia.idiomaBase` aceita `"pt-BR"` ou `"en"`, e os textos da instância estão nesse idioma.

A consequência é a mesma registrada no core e na Work: **`padroesVedados` é escrito numa língua.** Uma instância em inglês com regras só em português passa por `verificarRegras` com "nenhuma violação" — o que é pior do que não verificar. Toda regra verificável precisa de padrões no `idiomaBase` e em cada idioma de `renderizacoes[].idiomas`.

O que é interno (`TextoInterno`, `Estimativa.fonte`) pode ficar em português mesmo numa instância em inglês: não chega ao leitor.

## 5. Receitas

### Adicionar um termo de vocabulário

1. `vocabulario.ts`, no `definirVocabulario` certo, com `nome` e `descricao` que digam o que o termo **é**.
2. Se o termo é uma intenção do consumidor, ele entra na família (`intencoesDoConsumidor.<familia>`); a união `IntencaoDoConsumidor` é derivada e o acompanha sozinha.
3. Nenhum exemplo com empresa, caso ou número real na descrição.

### Adicionar uma natureza de linha de preço

1. `linha-de-preco.ts`, em `LinhaSimples`, com os campos que tornam a linha calculável. Esforço é hora à taxa da proposta, não `Dinheiro` digitado.
2. `preco.ts`: os dois `switch` sobre `natureza` (`valorSemContingencia` e `periodicidadeDe`) são exaustivos e acusam a natureza nova.
3. Um teste de tipo em `test/estados-ilegais.tipos.ts` para a linha sem o campo obrigatório.

### Adicionar um tipo de evidência

1. O termo em `tiposDeEvidencia` e o membro em `EvidenciaSales`.
2. Se afirma fato sobre o proponente, `fonte: Certeza<FonteDaEvidencia>`.

### Adicionar uma seção, uma saída ou um sinal de leitura

1. O termo em `secoesDaProposta`, `tiposDeRenderizacao` ou `sinaisDeLeitura`.
2. Sinal novo: o membro em `SinalDeLeitura`, com os parâmetros que o tornam conferível (limiar, material, canal). O nome do evento no serviço de medição é do app que mede.
3. Saída que se baixa: acrescente-a a `MaterialLevavel`.

## 6. Armadilhas conhecidas

- **`interface` não cabe em `ConteudoRenderizavel`.** O TypeScript só dá assinatura de índice implícita a tipos literais de objeto. Declare tipos de conteúdo com `type`; uma `interface` é recusada mesmo sem dado interno, e a mensagem ("Index signature … is missing") engana.
- **`Omit` não proíbe.** Um `Requisito` é atribuível a `Omit<Requisito, "entendimento">`, porque o TypeScript aceita propriedade a mais — e o entendimento iria junto para o JSON. As projeções somam `?: never` à chave retirada; faça o mesmo em projeções novas.
- **Não remova o `NoInfer`** das posições de referência em `InstanciaSales`. Sem ele, um id errado amplia a união em vez de ser recusado.
- **`ObservacaoDosEfeitos` fica opcional no tipo genérico.** Com os efeitos conhecidos (uma instância concreta), cada um é obrigatório; com o genérico (`InstanciaSales` sem parâmetros), as chaves são opcionais, senão nenhuma instância caberia numa função que aceita qualquer uma. Uma instância que deseje todos os efeitos do vocabulário cai no caso genérico e perde a exigência.
- **`PrecoDaProposta` é união por moeda.** Uma linha em outra moeda é erro de compilação, e o erro aparece na declaração do preço inteiro, não na linha.
- **Horas e percentuais aceitam até duas casas decimais.** `12,25` h e `7,5`% passam; `1,005` h é recusado com `ErroDePreco`, em vez de arredondado em silêncio. A soma dos marcos tem de dar exatamente 100.
- **Taxa implícita é razão, não `Dinheiro`.** 186.000,00 ÷ 2.323 h não cabe em centavos; declare `{ forma: "razao", valor, porHoras }`. Arredondar a taxa antes de multiplicar erra em cada hora, e o teste `arredondar a taxa…` mostra quanto.
- **O total apresentado é `total`, não `calculado`.** Com arredondamento comercial, a diferença é `ajuste`; a planilha que mostra as linhas precisa mostrar o ajuste para fechar a soma. Os subtotais por categoria somam `calculado`.
- **Opcionais ficam fora do custo único, do TCO e dos marcos.** Cada um tem os próprios totais e TCO; a contingência declarada dentro dele incide só sobre as linhas dele.
- **`resposta: { estado: "a_confirmar" }` numa `Conformidade` significa resposta ainda não redigida.** Não se renderiza; a linha da matriz mostra a forma de atendimento e espera o texto.
- **Um `@ts-expect-error` vale para a linha seguinte.** Em união, o TypeScript às vezes acusa a declaração inteira e não a propriedade; ponha a diretiva onde o erro aparece, e confira que ele é o erro pretendido.

## 7. Mapa de arquivo → conceito

**Vocabulário:** `vocabulario.ts` (`perfisHumanos`, `perfisAgente`, `intencoesDoConsumidor`, `tiposDeIntencao`, `efeitosCognitivos`, `efeitosEmocionais`, `efeitosComportamentais`, `tiposDeEvidencia`, `objecoesTipicas`, `respostaTipicaDaObjecao`, `secoesDaProposta`, `tiposDeRenderizacao`, `sinaisDeLeitura`, `papeisDeOrganizacao`)

**Leitura:** `leitor.ts` (`LeitorDaProposta`, `OrganizacaoEnvolvida`, `PerguntaAOrganizacao`) · `intencao.ts` (`IntencaoDaProposta`, `SinalDeLeitura`, `ObservacaoDoEfeito`)

**Afirmação:** `evidencia.ts` (`EvidenciaSales`, `FonteDaEvidencia`, `ReferenciaSales`)

**Escopo:** `escopo.ts` (`PacoteDeTrabalho`, `Requisito`, `Conformidade`, `Estimativa`, projeções)

**Preço:** `linha-de-preco.ts` (`Dinheiro`, `TaxaPorHora`, `Arredondamento`, `LinhaDePreco`, `PrecoDaProposta`, `MarcoDePagamento`) · `preco.ts` (`calcularPreco`, `PrecoCalculado`, `ErroDePreco`) · `premissa.ts` (`Premissa`, `Data`)

**Prazo:** `cronograma.ts` (`Cronograma`, `FaseDoCronograma`, `MarcoDeAceite`)

**Saída:** `renderizacao.ts` (`RenderizacaoSales`) · `interno.ts` (`Interno`, `ConteudoRenderizavel`, `garantirRenderizavel`)

**Agregado:** `instancia.ts` (`InstanciaSales`, `definirInstancia`)

**Testes:** `test/*.tipos.ts` são conferidos pelo compilador (`pnpm typecheck` e `test/tipos.test.ts`); `test/exemplo.ts` é a instância fictícia de que partem.

## 8. Em aberto e quem consome

- **Câmbio, impostos e IVA** não são modelados: o preço está numa moeda só, sem tributo. Margem, split e comissão não pertencem à proposta.
- **As horas de uma linha vêm da instância.** A conversão de pessoas-mês em horas e a escolha do valor adotado da `Estimativa` são da instância; declare as premissas em `preco.premissas`, para que `situacao` as acuse.
- **JSON-LD para o agente de triagem:** não há renderização `dados_estruturados`. O agente é servido pelas necessidades semânticas do consumidor (`entidades_identificadas`, `relacoes_explicitas`) nas saídas que já existem e pelas saídas tabulares (planilha e matriz). A decisão foi registrada como proposta.
- **Primeiro consumidor:** um app de propostas em outro repositório, que consome core e Sales e roda fora do CI deste monorepo. Nenhum app daqui importa este pacote.
