---
id: "2026-000003"
tipo: pacote
status: rascunho
modo: agencia
visibilidade: interna
metodologia_versao: "0.1"
estrutura_versao: "2"
regra_devbits_versao: "0.1"
fonte_oficial: true
criado_em: 2026-11-16
atualizado_em: 2026-11-16
---

# Decisão com trade-off semântico: tag no texto e elemento no core, decisão na especialização `tradeoff`

## Contexto

Quando um trabalho para à espera da escolha de uma pessoa, o que ela costuma receber é prosa: uma lista de perguntas, com prós e contras em frases. Quem decide precisa remontar sozinho o que compete com o quê, o que cada caminho custa e o que uma resposta muda nas perguntas seguintes.

A metodologia OpenTask define, para as revisões, o **trade-off semântico**: cada eixo é bipolar, entre duas qualidades desejáveis que competem (nunca "bom contra ruim"); as alternativas ficam posicionadas no eixo, de −5 a +5, com a justificativa da posição; e cada alternativa diz o que se escolhe e o que se abdica. A resposta também é semântica: aprovar, ajustar ou rejeitar.

Em novembro de 2026, um protótipo conceitual, feito fora deste repositório e com dados que não podem vir para cá, aplicou esse modelo a quatro decisões encadeadas de um projeto. Ele mostrou o que uma decisão carrega além do eixo:

- **o que saber antes**: os fatos, de onde vieram e quão firme é a base da recomendação;
- **o caminho de cada alternativa**: as consequências em ordem e se o caminho tem volta ou é difícil de desfazer;
- **a explicação para quem não é do assunto**: a pergunta em palavras simples, por que ela está na mesa e cenas que a desenham;
- **texto que cita coisas**: uma tarefa, um registro de decisão técnica, um arquivo, uma branch, uma pessoa, um documento de identificação. Cada citação tem tipo, e a coisa citada várias vezes é declarada uma vez só, com o lugar e a versão em que foi lida;
- **decisões que dependem umas das outras**: a quarta só precisava ser tomada conforme a resposta da primeira, e cada uma dizia o que travava enquanto não fosse respondida;
- **a resposta com ressalva**: a escolha acompanhada de um ajuste ou de uma condição, no mesmo gesto.

Três consumidores já têm pedaços disso, cada um a seu modo:

- um produto de leitura de contratos extrai do texto dados com tipo e validação (documentos de identificação, telefone, e-mail, prazo, valor) e, noutro módulo, escreve a cláusula como trechos em que uma parte ou um termo do contrato é citado por referência; ao lado do texto, mostra a explicação em palavras simples, o porquê da cláusula e cenas desenhadas;
- o gerenciador de tarefas (taskin) precisa citar tarefa, branch e commit, porque a mesma tarefa pode estar diferente em cada branch e em cada commit;
- a própria OpenTask tem, em aberto, um desenho de marcação semântica no texto e um tipo de trade-off para as revisões.

O core do PRISMA Intent já tem as pontas: `Redacao` (o único lugar em que `string` livre é legítima), `Procedencia` (arquivo, linha, trecho literal e ressalva), `DecisaoRegistrada` (quem decidiu, quando e onde está registrado) e `CriterioDeDecisao`. O pacote 2026-000001 deixou em aberto, para pacote próprio, o crescimento do core para além da comunicação (pensar, construir, corrigir); decidir é parte disso.

### Decisões de 2026-11-16 (Sidarta Veloso)

1. **A referência no texto, os elementos e o trade-off moram no PRISMA Intent.** Os consumidores usam daqui; nenhum deles é dono do mecanismo. Isso inverte o desenho em aberto da OpenTask, que punha o mecanismo no núcleo dela e deixava ao PRISMA Intent o registro de tipos; os registros de lá precisam acompanhar.
2. **Tag é uma coisa só.** A tag que um consumidor extrai do texto e a referência que quem redige escreve são a mesma tag, usável do mesmo jeito em qualquer parte de uma decisão: pergunta, alternativa, eixo, trilha.
3. **No core entram a tag no texto e o elemento com ponto de leitura.** Eles evoluem `Redacao` e `Procedencia`, que já moram lá.
4. **A decisão e o trade-off nascem numa especialização nova.** O trade-off sobe ao core quando um segundo domínio precisar dele, como aconteceu com `Premissa`.
5. **O core segue sem dependências e sem conhecer tipo concreto.** Ele define o mecanismo; quem conhece documento de identificação, tarefa ou commit registra o tipo, com a validação e a resolução que couberem.

Até a decisão do ponto 2, mais abaixo, o elemento era chamado de "ativo" nas conversas. O título da task-011 ainda traz a palavra.

## Problema

O mesmo mecanismo, "um texto cita coisas com tipo, e uma decisão se apresenta por eixos, caminhos e dependências", está espalhado em três lugares, com nomes e formas diferentes, e nenhum deles serve aos outros. No core, `Redacao` é `string` livre: uma citação dentro dela não tem tipo, não é conferida e não leva a lugar nenhum. E não existe, em pacote nenhum, um tipo para a decisão que espera uma pessoa.

## Objetivo

1. **Tag no texto**, no core: uma citação com tipo dentro de uma redação. O core define a forma da tag e o registro de tipos; texto sem tag continua válido.
2. **Elemento com ponto de leitura**, no core: a coisa declarada uma vez e citada por tag quantas vezes for preciso, com onde e em que versão foi lida. Inclui o elemento que ainda não existe e nasce de uma alternativa.
3. **Decisão**, na especialização `tradeoff`: a pergunta; o que saber antes; as alternativas, cada uma com o que se escolhe, o que se abdica, a trilha de consequências e se tem volta; os eixos de trade-off com as alternativas posicionadas; a proposta, com o porquê e a firmeza da base; a resposta (aprovar, ajustar com condição, rejeitar), registrada com `DecisaoRegistrada`; e a explicação em palavras simples, com o porquê e as cenas.
4. **Grafo de decisões**, na especialização `tradeoff`: uma decisão declara de qual anterior depende e com quais respostas se torna necessária, e o que fica travado enquanto ela não é respondida.
5. **Regras de integridade** para o que o compilador não pega.

## Escopo

- o desenho aprovado: os tipos de tag, elemento, decisão e trade-off, com exemplo fictício, e os pontos em aberto decididos (task-011);
- os tipos e as regras no core e na especialização `tradeoff`, em tarefas que saem do desenho;
- documentação no método (`apps/docs`), quando houver o que documentar.

## Fora do escopo

- **A tela.** Página, mapa de caminhos, sons e desenhos são do consumidor (ponto 8); aqui entra só o que a tela precisa ler.
- **Os tipos concretos.** Documento de identificação, tarefa, branch, commit e os demais são registrados por quem os conhece, no próprio repositório.
- **Resolver a tag contra um sistema.** Buscar a tarefa ou validar o documento é implementação do consumidor; o core define a interface.
- **Promover o trade-off ao core.** Só quando um segundo domínio precisar.
- **A migração dos consumidores.** Cada um na própria tarefa, no próprio repositório.

## Pontos decididos

Os oito pontos que este pacote deixou em aberto subiram ao decisor em 2026-11-16, cada um como trade-off semântico: eixos entre duas qualidades desejáveis, as alternativas posicionadas de −5 a +5, o que cada uma escolhe e abdica, e a proposta. A apresentação foi feita fora deste repositório. Abaixo fica o registro: os eixos, as alternativas e a resposta de Sidarta Veloso a cada ponto.

| # | Ponto | Decisão | Resposta |
| --- | --- | --- | --- |
| 1 | Nome da especialização | `tradeoff` | ajustada: outro caminho apresentado (a proposta era `decide`) |
| 2 | Nome do conceito chamado de "ativo" | `Elemento` | rejeitada; depois ajustada, com caminho próprio |
| 3 | Forma da tag no texto | trechos, com marcação | aprovada |
| 4 | Quanto o core sabe de versão | versão genérica | aprovada |
| 5 | Ponto de leitura e `Procedencia` | a `Procedencia` é o ponto de leitura mais o trecho | aprovada |
| 6 | Eixo e `CriterioDeDecisao` | cada polo é um critério | aprovada |
| 7 | Escala do eixo | inteiros de −5 a +5 | aprovada |
| 8 | Dono da tela | um consumidor, como módulo dele | aprovada |

Em cada eixo, a letra marca a posição da alternativa, da esquerda (−5) para a direita (+5).

### Ponto 1: o nome da especialização

```text
    Diz o ato  ◄────A───────────────────────────B───────C►  Diz o objeto
Nome que dura  ◄────A───B───────────────────────────────C►  Nome do que mais aparece
```

| Alternativa | Escolhe | Abdica |
| --- | --- | --- |
| A, `decide` (proposta) | O par com `educate` e com os verbos do posicionamento: pensar, construir, corrigir. | O substantivo, que diz o que o pacote guarda. |
| B, `decision` | Nomear o que se modela, como `sales` e `funding`. | A leitura de ação que o `educate` abriu. |
| **C, `tradeoff` (decidida)** | O nome da parte mais visível da decisão. | O sentido do nome no dia em que o trade-off for promovido ao core (decisão 4 do contexto). |

Os três caminhos têm volta: antes da primeira publicação no npm, trocar é renomear a pasta e o literal.

**Decisão:** o pacote é `@prisma-intent/tradeoff`, na pasta `packages/tradeoff`, e a instância declara `especializacao: "tradeoff"`.

### Ponto 2: o nome do conceito chamado de "ativo"

```text
Palavra já usada na conversa  ◄A───────────────────────────C───────B────►  Um sentido só no core
     Não toca no AtivoVisual  ◄────BC──────────────────────────────A────►  Resolve a palavra "ativo" de vez
```

| Alternativa | Escolhe | Abdica |
| --- | --- | --- |
| A, `Ativo` | A palavra já usada na conversa. | O alias de compatibilidade do `AtivoVisual`. Pessoa e parte de contrato passariam a se chamar ativo. |
| B, `Referente` (proposta) | Um sentido só no core, e o par exato: a tag é a referência, a coisa citada é o referente. | Uma palavra do dia a dia. |
| C, `Entidade` | O termo que quem extrai dados de texto já conhece. | Clareza para quem modela banco ou domínio, onde entidade é outra coisa. |

**Decisão:** nenhum dos três. O decisor rejeitou os caminhos apresentados e, em seguida, trouxe o próprio: o tipo se chama **`Elemento`**.

Leitura do desenho, a confirmar na aprovação: `Elemento` escolhe uma palavra do dia a dia, com um sentido só entre os tipos do core, e não toca no `AtivoVisual`, que segue com o pacote 2026-000002. Abdica de uma palavra exclusiva: "elemento" já aparece, no sentido comum, em dois comentários do core (`prioridade.ts` e `utilitarios.ts`), que a tarefa do core reescreve.

### Ponto 3: a forma da tag no texto

```text
Lê-se como texto corrido  ◄A───────────────────────C───────────────B►  O compilador confere
 Nada do que existe muda  ◄A───────────────────────────────B───────C►  Uma estrutura para as duas tags
            Core pequeno  ◄────B───────────────────────────A───────C►  Vale em Markdown e JSON
```

| Alternativa | Escolhe | Abdica | Volta |
| --- | --- | --- | --- |
| A, marcação na `string` | Nada do que existe muda, e a mesma forma vale em qualquer arquivo. | A conferência pelo compilador: citação errada só aparece quando a regra roda. | Tem: a estrutura pode entrar depois, por cima da marcação. |
| B, sequência de trechos | O compilador recusa tipo não registrado e elemento não declarado. | A escrita leve, e a forma para documentos em Markdown. | Difícil: depois de publicado, voltar a `string` quebra quem já escreveu trechos. |
| **C, trechos, com marcação (proposta, decidida)** | A tag extraída e a tag escrita na mesma estrutura, com a marcação para Markdown e JSON. | Um core menor: entra um leitor de marcação para manter. | Difícil: a estrutura fica no tipo. A marcação pode sair depois sem quebrar o modelo. |

**Decisão:** o modelo guarda trechos, e o core converte a marcação `[[tipo:id|rótulo]]` de e para eles.

### Ponto 4: quanto o core sabe de versão

```text
     Core neutro e pequeno  ◄A───────────────────────────────B────────►  Prender ao que foi lido
Liberdade de cada extensão  ◄────A───────────────────────────────B────►  Regra única para todos
```

| Alternativa | Escolhe | Abdica | Volta |
| --- | --- | --- | --- |
| A, nada no core | O core mínimo, que não supõe nada sobre versão. | A garantia de que toda decisão registrada aponta para o que foi lido. | Tem: a versão pode entrar depois, como campo novo. |
| **B, versão genérica (proposta, decidida)** | Toda citação pode ser presa ao que foi lido, em qualquer domínio. | Dois campos a mais no core. | Difícil: tirar campo do core depois de publicado quebra quem o usa. |

O nome de um sistema de controle de versão no core ficou fora dos caminhos: a decisão 5 do contexto já diz que commit é tipo de quem o conhece.

**Decisão:** o core conhece duas ideias, o nome que se move e o identificador que não muda. Branch e commit são um caso delas; a versão vigente e a versão assinada de um contrato são outro. Decisão registrada cita pelo identificador que não muda.

### Ponto 5: o ponto de leitura e a `Procedencia`

Este ponto só precisou ser decidido porque o ponto 4 seguiu pela versão genérica.

```text
Procedencia intocada  ◄A───────────────B───────────────────────C►  Um só jeito de dizer onde
Menos trabalho agora  ◄────A───────────────B───────────────C────►  Menos duplicação depois
```

| Alternativa | Escolhe | Abdica | Volta |
| --- | --- | --- | --- |
| A, dois tipos separados | Risco zero no que existe. | Um só jeito de dizer onde. A citação literal segue sem versão. | Tem: juntar depois continua possível. |
| B, versão na `Procedencia` | A citação literal passa a dizer em que versão foi conferida. | Um conceito só: o lugar continua definido duas vezes. | Tem: é campo novo. |
| **C, ponto mais trecho (proposta, decidida)** | Um conceito de lugar para a citação e para o elemento citado. | Deixar quieto um tipo que todos os pacotes usam. | Difícil: depois de publicado, separar de novo mexe em todos os pacotes. |

**Decisão:** a `Procedencia` passa a ser o ponto de leitura mais o trecho literal e a ressalva. Os campos novos são opcionais, e o que existe hoje continua compilando.

### Ponto 6: o polo do eixo e o `CriterioDeDecisao`

```text
Fiel ao modelo da OpenTask  ◄A───────────────────B───────────────────C►  Fiel à gramática do core
Decisão rápida de escrever  ◄────────A───B───────────────────────────C►  Proposta explicada pela prioridade
```

| Alternativa | Escolhe | Abdica | Volta |
| --- | --- | --- | --- |
| A, o eixo se basta | O modelo da metodologia, sem nada a mais. | A qualidade declarada uma vez: ela é redigida de novo em cada decisão. | Tem: ligar a critérios depois é acrescentar. |
| B, cita critério se houver | Liberdade: a decisão rápida não declara critério. | O padrão do repositório, que evita propriedade opcional. | Tem: o campo é opcional. |
| **C, o polo é um critério (proposta, decidida)** | A qualidade declarada uma vez, com prioridade, sustenta a proposta. | A decisão rápida: é preciso declarar os critérios antes da primeira. | Difícil: voltar obriga a reescrever cada decisão registrada. |

**Decisão:** quem decide declara os critérios, com prioridade. Cada eixo opõe dois deles, e a proposta cita o critério que a sustenta.

### Ponto 7: a escala do eixo

```text
Mesma régua da metodologia  ◄────A───────────────────────────────B────►  Não fingir precisão
  Ordena bem três caminhos  ◄────A───────────────────────────B────────►  Fácil de justificar
```

| Alternativa | Escolhe | Abdica | Volta |
| --- | --- | --- | --- |
| **A, inteiros de −5 a +5 (proposta, decidida)** | A régua da metodologia, conferida pelo compilador. | A honestidade fina: entre −3 e −2 nem sempre há diferença real. | Tem: onze pontos viram cinco agrupando. |
| B, cinco posições nomeadas | Só a precisão que se tem. | A régua comum com a metodologia e a ordem fina entre três caminhos. | Difícil: cinco posições não viram onze sem inventar precisão. |

**Decisão:** a posição é um inteiro entre −5 e +5, fixado no tipo, sempre com a justificativa escrita.

### Ponto 8: o dono da tela

```text
Perto das peças prontas  ◄────A───────────────B───────────────C────►  Perto de onde se decide
          Sai mais cedo  ◄────A───────────C───────────────────────B►  Serve a qualquer produto
```

| Alternativa | Escolhe | Abdica |
| --- | --- | --- |
| **A, módulo num consumidor (proposta, decidida)** | As peças que o consumidor já tem: a explicação em palavras simples, as cenas e as tags. | A decisão ao lado da tarefa: quem decide sobre tarefa abre outro produto. |
| B, pacote próprio | Uma tela que nenhum produto prende. | O atalho das peças prontas: mais um pacote para manter e publicar. |
| C, no gerenciador de tarefas | A decisão no lugar onde o trabalho para à espera dela. | As peças que o outro consumidor já tem. |

Os três caminhos têm volta: o modelo fica aqui, e a tela pode mudar de casa.

**Decisão:** a tela é de um consumidor, como módulo dele. Neste pacote ela continua fora do escopo.

## Desenho

Proposta de 2026-11-16, à espera da aprovação do decisor. Os tipos completos e o exemplo fictício estão em [`especificacao-de-tipos.md`](especificacao-de-tipos.md), nesta pasta. O exemplo compila contra os tipos propostos. As funções estão só declaradas.

### Os conceitos

| Conceito | Tipos | Onde | O que é |
| --- | --- | --- | --- |
| Tag | `Tag`, `TagNoTexto` | core | A citação com tipo: aponta para o elemento de mesmo tipo e id. No texto, leva o rótulo com que é lida. |
| Redação | `Redacao`, `Trecho` | core | Texto corrido, texto com a marcação `[[tipo:id\|rótulo]]` ou sequência de trechos. |
| Tipo de elemento | `TipoDeElemento`, `RegistroDeTipos` | core | Nome, descrição e forma do id. Quem conhece o tipo registra. |
| Elemento | `Elemento` | core | O que a redação cita. Declarado uma vez; lido, com ponto de leitura, ou a criar. |
| Ponto de leitura | `PontoDeLeitura`, `VersaoLida` | core | Onde e em que versão algo foi lido: repositório, arquivo, linha, nome que se move e identificador que não muda. |
| Procedência | `Procedencia` | core | O ponto de leitura mais a citação literal e a ressalva. |
| Pauta | `Pauta` | `tradeoff` | O que se leva a uma pessoa para decidir: quem decide, os critérios dela, os tipos, os elementos e as decisões. |
| Critério de quem decide | `CriterioDoDecisor` | `tradeoff` | O `CriterioDeDecisao` do core, com nome e descrição. |
| Decisão | `Decisao` | `tradeoff` | Pergunta, explicação em palavras simples, fatos, alternativas, eixos, proposta, necessidade, o que trava e as respostas. |
| Alternativa | `Alternativa` | `tradeoff` | O que escolhe, o que abdica, a trilha, se tem volta e o que cria. |
| Eixo | `Eixo`, `Posicao` | `tradeoff` | A tensão entre dois critérios, com cada alternativa posicionada de −5 a +5 e a justificativa. |
| Proposta | `Proposta` | `tradeoff` | A alternativa recomendada, o critério que a sustenta e a firmeza da base. |
| Resposta | `Resposta` | `tradeoff` | Aprovada, ajustada ou rejeitada, registrada com `DecisaoRegistrada`. |
| Necessidade | `Necessidade` | `tradeoff` | Sempre, ou conforme a resposta de outra decisão. É o grafo. |

### Como cada ponto virou tipo

- **Ponto 1.** O pacote é `@prisma-intent/tradeoff`, e a pauta declara `especializacao: "tradeoff"`.
- **Ponto 2.** O tipo se chama `Elemento`. Um elemento é uma tag (tipo e id) com nome e estado.
- **Ponto 3.** `Redacao` aceita `string` ou uma sequência de trechos. `lerMarcacao` e `escreverMarcacao` convertem entre a marcação e os trechos. Em trechos, o compilador confere a tag. Na marcação, quem confere é `verificarTags`.
- **Ponto 4.** `VersaoLida` tem as duas ideias: `movel`, só com o nome que se move, e `fixa`, com o identificador que não muda. A regra `respondida_sem_versao_fixa` exige a versão fixa em toda decisão respondida.
- **Ponto 5.** `Procedencia` estende `PontoDeLeitura`.
- **Ponto 6.** `Eixo` tem `poloA` e `poloB`, que são ids dos critérios de quem decide. `Proposta.sustentadaPor` cita um deles.
- **Ponto 7.** `Posicao` é a união literal dos onze inteiros.
- **Ponto 8.** Não há tipo de tela. A tela lê a pauta, pede o texto por `textoCorrido` ou pelos trechos e pergunta a `decisoesExigidas` o que mostrar.

### O que o desenho propõe além dos oito pontos

Estes itens não subiram como decisão. Estão aqui para serem vistos na aprovação.

1. **`repositorio` no ponto de leitura.** Opcional; ausente, vale o repositório da própria instância. Sem ele, não há como citar um arquivo de outro repositório.
2. **Forma leve do trecho.** O trecho de texto é uma `string`, sem objeto em volta: `["Onde montar as bancas que o ", { tipo, id, rotulo }, " prevê?"]`. O custo está em "Impacto medido".
3. **Forma do id no registro de tipos.** Cada tipo declara a forma do id como expressão regular, do jeito que `padroesVedados` já faz. Ela confere a escrita. A existência e a validação mais forte (dígito verificador, consulta a um sistema) continuam com quem conhece o tipo.
4. **Toda tag cita um elemento declarado.** Não há tag solta, nem para data ou valor. Quem extrai dados de um texto declara cada um como elemento, com o ponto em que foi lido.
5. **Campo que não é prosa sai de `Redacao`.** `Procedencia.arquivo` e `Procedencia.trecho` passam a `string`. A tarefa do core classifica os demais campos (id, URL, caminho) antes de alargar o tipo.
6. **Benefício, risco e ícone do extremo.** O modelo da metodologia dá a cada extremo nome, descrição, benefício, risco e ícone. Com o polo como critério, nome e descrição vêm do critério. Benefício e risco ficam ditos por alternativa, no que ela escolhe e no que abdica. Ícone é da tela.
7. **A resposta em cinco formas, só por acréscimo.** Aprovada; ajustada na proposta, com ajuste ou condição; ajustada por outro caminho apresentado; ajustada por caminho próprio; rejeitada. Quatro delas apareceram nas respostas aos oito pontos acima, e a quinta é a ressalva descrita no contexto. A decisão guarda todas as respostas, e vale a última: o ponto 2 teve duas.
8. **`Pauta`.** Nome proposto para o conjunto de decisões levado a uma pessoa.
9. **Cena.** Guarda o que a cena mostra e a legenda. O desenho é da tela. Quando o pacote 2026-000002 existir, a cena pode passar a citar um recurso.
10. **Fatos sem campo de fonte.** O que saber antes é uma lista de redações. A origem de cada fato vai na tag, que leva ao elemento e ao ponto de leitura.

### Impacto medido

Em 2026-11-16, `Redacao` foi alargado só para medir, e a troca foi desfeita em seguida. O typecheck apontou **28 erros em 9 arquivos**, todos em quem lê redação como `string`:

| Pacote | Erros | Arquivos |
| --- | --- | --- |
| core | 0 | nenhum |
| `work` | 19 | `src/conferencia.ts`, `src/publicacao.ts`, `src/redacao.ts` e um teste |
| `sales` | 5 | `src/preco.ts` e um teste |
| `funding` | 1 | `src/verificar.ts` |
| `educate` | 3 | dois testes |

Nenhuma instância e nenhum exemplo deixou de compilar: quem escreve redação não muda.

O número não cobre tudo. `string` e lista têm métodos em comum (`length`, `includes`, `slice`), e um leitor que só use esses compila sem erro e passa a se comportar errado. Com a forma leve do trecho, um ponto da `educate` deixou de ser apontado. A tarefa do core lista os leitores trocando o tipo, por um momento, por um tipo opaco, que nenhum método aceita.

### Fica para as tarefas de implementação

- como escrever a marcação literal sem que ela vire tag (escape);
- a interface de resolução da tag contra um sistema, que o core define e o consumidor implementa;
- um `definirPauta` que infira os literais, como as outras especializações fazem;
- o que acontece com a decisão rejeitada: nova proposta na mesma decisão, ou decisão nova que a substitui;
- a decisão que depende de outra respondida com caminho próprio: quem redige precisa dizer se ela continua necessária;
- as representações em JSON Schema e no vocabulário.

### Tarefas de implementação propostas

Registradas no taskin depois da aprovação do desenho.

**Core: tag no texto e elemento com ponto de leitura** (complexidade média)

- (A) O exemplo fictício compila; em trechos, o compilador recusa tipo não registrado e tag de elemento não declarado.
- (A) `verificarTags` recusa, na marcação, tipo não registrado, id fora da forma, elemento não declarado e elemento declarado duas vezes; cada violação tem teste.
- (A) `lerMarcacao` e `escreverMarcacao` são inversas, e o texto corrido de uma tag extraída reproduz o texto original.
- (A) Toda redação e toda `Procedencia` que existem hoje compilam sem alteração: os testes dos cinco pacotes passam sem mudar instância nem exemplo.
- (A) Cada campo `Redacao` do core e das especializações está classificado como prosa ou literal; os literais passam a `string`.
- (A) Os leitores de redação dos cinco pacotes tratam as duas formas, listados com o tipo opaco.
- (A) O core segue sem dependências e sem nome de tipo concreto (teste).
- (C) Sidarta Veloso aprova.

**Especialização `tradeoff`: decisão, trade-off e grafo** (complexidade alta; depende da tarefa do core)

- (A) O pacote `@prisma-intent/tradeoff` existe, com `publishConfig` público e com provenance, e depende só do core (teste de dependências).
- (A) O exemplo fictício declara uma pauta com duas decisões, uma delas necessária só conforme a resposta da outra.
- (A) `decisoesExigidas` só devolve a decisão condicional depois da resposta que a torna necessária.
- (A) Cada violação de `ViolacaoDaPauta` tem teste, incluída a dependência circular.
- (A) O compilador recusa posição fora da régua, eixo sem todas as alternativas e polo que não é critério declarado (testes de tipo).
- (A) Nenhum nome de cliente, produto ou projeto de terceiro; os exemplos usam dados fictícios.
- (C) Sidarta Veloso aprova.

## Entregáveis

| Entregável | Descrição | Evidência esperada |
| --- | --- | --- |
| Desenho | tipos propostos e pontos em aberto decididos | este pacote com a seção de desenho e a aprovação registrada |
| Core | tag no texto, registro de tipos e elemento com ponto de leitura | testes de tipo e exemplo fictício compilando |
| Especialização | decisão, trade-off e grafo, dependendo só do core | testes de tipo, de integridade e de dependências |
| Método | a decisão como aplicação do método, em `apps/docs` | build e testes do docs verdes |

## Critérios de aceite

- [ ] (A) Um exemplo fictício declara uma decisão com tag na pergunta, numa alternativa e num eixo, e o compilador ou a conferência recusa tag de tipo não registrado e tag que cita elemento não declarado.
- [ ] (A) Um elemento citado mais de uma vez é declarado uma vez só, com ponto de leitura; um elemento ainda inexistente é representável sem ponto de leitura.
- [ ] (A) Uma decisão que depende da resposta de outra só é exigida quando a resposta a torna necessária, e uma dependência circular é recusada.
- [ ] (A) Toda redação que existe hoje continua compilando sem alteração.
- [ ] (A) O core segue sem dependências e sem nome de tipo concreto; a especialização depende só do core (teste de dependências).
- [ ] (A) Nenhum nome de cliente, produto ou projeto de terceiro no código, nos testes nem na documentação; os exemplos usam dados fictícios.
- [ ] (C) Sidarta Veloso decide o nome da especialização e o nome do conceito antes chamado de ativo, e aprova o desenho. Os nomes estão decididos (`tradeoff` e `Elemento`, 2026-11-16); falta a aprovação do desenho.

## Tarefas

| Posição | Tarefa (taskin) | Complexidade | Entregável |
| --- | --- | --- | --- |
| 1 | task-011 | média | desenho aprovado, com os pontos em aberto decididos |
| 2 | a registrar depois da aprovação do desenho | média | tag no texto e elemento com ponto de leitura, no core |
| 3 | a registrar depois da aprovação do desenho | alta | especialização `tradeoff`: decisão, trade-off e grafo |

## Funções e responsáveis

- Responsável pelo pacote, líder técnico e decisor: Sidarta Veloso.
- Desenvolvedor: Sidarta Veloso (com agente como ferramenta; o agente não é pessoa nem função).

## Dependências

- **Pacote 2026-000002** (recurso com intenção): mexe em `AtivoVisual` e na procedência das candidatas. Os nomes não colidem: `Elemento` deixa `AtivoVisual` e "recurso" como estão. Fica um ponto para a task-004: lá, "procedência da candidata" diz quem produziu o recurso; aqui, `Procedencia` diz de onde uma afirmação foi lida. São dois sentidos para a mesma palavra no core.
- **Pacote 2026-000001, T4** (primeira publicação): mudar `Redacao` alcança todos os pacotes. Antes da primeira versão publicada, a mudança não quebra ninguém que instale por versão.
- **OpenTask**: os registros de lá sobre marcação semântica e sobre o tipo de trade-off precisam apontar para cá.

## Riscos

| Risco | Impacto | Tratamento |
| --- | --- | --- |
| Mudar `Redacao` quebra especializações e consumidores | Alto | Texto sem tag continua válido; impacto medido (28 erros em 9 arquivos, nenhum em instância ou exemplo); critério de aceite próprio |
| Leitor de redação que compila e se comporta errado | Médio | A tarefa do core lista os leitores com um tipo opaco antes de alargar `Redacao` |
| O core passa a conhecer tipo concreto por conveniência | Médio | Registro de tipos por quem os conhece; teste que recusa dependência e nome de tipo concreto no core |
| Dado real em exemplo de tag (documento, contato, nome de projeto) | Alto | Exemplos fictícios; gitleaks no pre-commit e no CI |
| O mesmo mecanismo definido em dois lugares (aqui e na OpenTask) | Médio | Os registros de lá acompanham a decisão 1 antes de qualquer implementação |
| A especialização nasce moldada por uma tela só | Médio | A tela fica fora do escopo; o exemplo fictício não depende de apresentação |
| O nome `tradeoff` perde o sentido quando o trade-off subir ao core | Baixo | Custo aceito no ponto 1; antes da primeira publicação, trocar é renomear |

## Eventos

- 2026-11-16 — pacote criado a partir de um protótipo conceitual da apresentação de decisões e das cinco decisões registradas no contexto (Sidarta Veloso, decisor).
- 2026-11-16 — os oito pontos em aberto subiram ao decisor como trade-off semântico e foram decididos: seis propostas aprovadas, o nome da especialização ajustado para `tradeoff` e o nome do conceito trazido pelo decisor, `Elemento` (Sidarta Veloso, decisor).
- 2026-11-16 — desenho escrito, com a especificação de tipos e o exemplo fictício compilando fora do repositório; à espera de aprovação (task-011).

## Resultado

## Aprendizado
