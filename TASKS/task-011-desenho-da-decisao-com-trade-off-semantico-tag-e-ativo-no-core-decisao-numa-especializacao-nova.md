# 🧩 Task 011 — Desenho da decisão com trade-off semântico: tag e ativo no core, decisão numa especialização nova

- Status: in-progress
- Type: docs
- Assignee: sidartaveloso

## Description
Fechar o desenho do pacote 2026-000003 antes de qualquer código. O que já está decidido (Sidarta Veloso, 2026-11-16): a tag no texto e o ativo com ponto de leitura entram no core; a decisão e o trade-off nascem numa especialização nova; tag é uma coisa só, usável em qualquer parte da decisão; o core segue sem dependências e sem conhecer tipo concreto.

O desenho precisa dizer, com tipos e um exemplo fictício:

- **tag no texto**: a forma da citação dentro de uma redação e o registro de tipos, feito por quem conhece cada tipo;
- **ativo com ponto de leitura**: a coisa declarada uma vez e citada várias, com onde e em que versão foi lida, e o ativo que ainda não existe;
- **decisão**: pergunta, o que saber antes, alternativas (o que se escolhe, o que se abdica, a trilha e se tem volta), eixos com as alternativas posicionadas, proposta com a firmeza da base, resposta (aprovar, ajustar com condição, rejeitar) e a explicação em palavras simples, com o porquê e as cenas;
- **grafo de decisões**: de qual decisão outra depende, com quais respostas ela se torna necessária e o que fica travado enquanto espera.

Os oito pontos em aberto do pacote sobem ao decisor como trade-off semântico: eixo entre duas qualidades desejáveis, alternativas posicionadas, o que se escolhe e o que se abdica, e a proposta.

## Acceptance criteria
- [x] (A) O pacote 2026-000003 tem a seção de desenho, com os tipos propostos para tag, ativo, decisão e trade-off
- [x] (A) Um exemplo fictício cobre tag na pergunta, numa alternativa e num eixo; um ativo citado duas vezes, com ponto de leitura; um ativo ainda inexistente; e uma decisão que só é necessária conforme a resposta de outra
- [x] (A) Cada ponto em aberto do pacote está decidido, ou adiado com a razão, e foi apresentado como trade-off semântico
- [x] (A) Nenhum nome de cliente, produto ou projeto de terceiro no texto nem no exemplo
- [x] (A) As tarefas de implementação (core e especialização) estão registradas, cada uma com critérios de aceite
- [x] (C) Sidarta Veloso decide o nome da especialização e o nome do conceito hoje chamado de ativo, e aprova o desenho

## Tasks
<!-- [x] feito · [ ] em aberto · [ ] ... — adiado: <razão> para o que se decidiu não fazer -->
- [x] Apresentar os pontos em aberto como trade-off semântico e registrar a decisão de cada um
- [x] Escrever os tipos propostos e o exemplo fictício no pacote
- [x] Conferir os nomes com o pacote 2026-000002 (`AtivoVisual` e recurso)
- [x] Registrar as tarefas de implementação

## Notes
Pacote: 2026-000003

O protótipo conceitual que originou o pacote fica fora deste repositório: usa dados de um projeto real. O que ele carregava em cada decisão está descrito no contexto do pacote.

Esta tarefa não escreve código em `packages/`.

### Os nomes mudaram

O conceito que o título e a descrição chamam de "ativo" passou a se chamar `Elemento`, e a especialização nova é a `tradeoff` (pontos 1 e 2 do pacote).

### O que foi feito

- **Pontos decididos.** Os oito pontos subiram ao decisor em 2026-11-16 como trade-off semântico, numa apresentação fora deste repositório. O registro está na seção "Pontos decididos" do pacote: os eixos, as alternativas, o que cada uma escolhe e abdica, e a resposta. Seis propostas foram aprovadas, o nome da especialização foi ajustado e o nome do conceito veio do decisor.
- **Desenho.** Seção "Desenho" do pacote, com os conceitos, o que cada ponto virou em tipo, as escolhas do desenho e quatro itens que seguem a proposta, para serem vistos na aprovação. Os tipos completos e o exemplo fictício estão em `especificacao-de-tipos.md`, na pasta do pacote.
- **Escolhas do desenho.** O desenho trouxe seis escolhas que os oito pontos não cobriam. Elas subiram ao decisor do mesmo jeito e foram decididas em 2026-11-16: quatro propostas aprovadas; a tag de um tipo pode dispensar o elemento declarado; e o conjunto de decisões se chama `Deliberacao`. Os tipos e o exemplo foram refeitos com as duas mudanças.
- **Nomes do pacote 2026-000002.** `Elemento` não colide com `AtivoVisual` nem com "recurso". Ficou anotado, nas dependências do pacote, que "procedência" tem dois sentidos entre os dois pacotes; é ponto para a task-004.

Evidência (2026-11-16, local, em `docs/task-011`):

- os tipos propostos e o exemplo fictício compilam, já com as seis escolhas aplicadas, com o TypeScript e o `tsconfig.base.json` daqui, contra o core do commit `64fb703`, em arquivos fora do repositório; as funções estão só declaradas, e o que elas devolvem ainda não tem teste;
- o exemplo e um arquivo de casos negativos conferem, com `@ts-expect-error`, o que o compilador recusa: a lista está em `especificacao-de-tipos.md`;
- impacto de alargar `Redacao`, medido com uma troca temporária do tipo, já desfeita: 28 erros de typecheck em 9 arquivos, nenhum em instância nem em exemplo.

Sidarta Veloso aprovou o desenho em 2026-11-16, com as seis escolhas aplicadas. As tarefas de implementação foram registradas na `develop` no mesmo dia: task-012 (core) e task-013 (especialização `tradeoff`), cada uma com os critérios de aceite.
