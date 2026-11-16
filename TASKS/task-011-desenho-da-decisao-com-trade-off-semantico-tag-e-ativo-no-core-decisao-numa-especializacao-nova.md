# 🧩 Task 011 — Desenho da decisão com trade-off semântico: tag e ativo no core, decisão numa especialização nova

- Status: pending
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
- [ ] (A) O pacote 2026-000003 tem a seção de desenho, com os tipos propostos para tag, ativo, decisão e trade-off
- [ ] (A) Um exemplo fictício cobre tag na pergunta, numa alternativa e num eixo; um ativo citado duas vezes, com ponto de leitura; um ativo ainda inexistente; e uma decisão que só é necessária conforme a resposta de outra
- [ ] (A) Cada ponto em aberto do pacote está decidido, ou adiado com a razão, e foi apresentado como trade-off semântico
- [ ] (A) Nenhum nome de cliente, produto ou projeto de terceiro no texto nem no exemplo
- [ ] (A) As tarefas de implementação (core e especialização) estão registradas, cada uma com critérios de aceite
- [ ] (C) Sidarta Veloso decide o nome da especialização e o nome do conceito hoje chamado de ativo, e aprova o desenho

## Tasks
<!-- [x] feito · [ ] em aberto · [ ] ... — adiado: <razão> para o que se decidiu não fazer -->
- [ ] Apresentar os pontos em aberto como trade-off semântico e registrar a decisão de cada um
- [ ] Escrever os tipos propostos e o exemplo fictício no pacote
- [ ] Conferir os nomes com o pacote 2026-000002 (`AtivoVisual` e recurso)
- [ ] Registrar as tarefas de implementação

## Notes
Pacote: 2026-000003

O protótipo conceitual que originou o pacote fica fora deste repositório: usa dados de um projeto real. O que ele carregava em cada decisão está descrito no contexto do pacote.

Esta tarefa não escreve código em `packages/`.
