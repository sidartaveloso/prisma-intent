# 🧩 Task 013 — Especialização tradeoff: decisão, trade-off e grafo de decisões

- Status: pending
- Type: feat
- Assignee: sidartaveloso

## Description
Criar a especialização `tradeoff` (`@prisma-intent/tradeoff`, em `packages/tradeoff`) do desenho aprovado do pacote 2026-000003 (aprovação de Sidarta Veloso em 2026-11-16). A especificação está em `especificacao-de-tipos.md`, na pasta do pacote. O pacote depende só do core, com o que a task-012 entrega.

O que entra:

- **deliberação**: `Deliberacao`, o que se leva a uma pessoa para decidir: quem decide, os critérios dela (`CriterioDoDecisor`), os tipos, os elementos e as decisões;
- **decisão**: `Decisao`, com a pergunta, a explicação em palavras simples e as cenas, os fatos, as alternativas (`Alternativa`: o que escolhe, o que abdica, a trilha, se tem volta e o que cria), os eixos (`Eixo` e `Posicao`), a proposta (`Proposta`) e o que trava;
- **resposta**: `Resposta`, em cinco formas, guardada só por acréscimo, com `DecisaoRegistrada`;
- **grafo**: `Necessidade` e `decisoesExigidas`;
- **conferência**: `verificarDeliberacao` e `ViolacaoDaDeliberacao`.

Ficam para decidir nesta tarefa, por não mudarem o desenho: um `definirDeliberacao` que infira os literais, como as outras especializações fazem; o que acontece com a decisão rejeitada (nova proposta na mesma decisão, ou decisão nova que a substitui); e a decisão que depende de outra respondida com caminho próprio.

Fora desta tarefa: a tela, que é de um consumidor, e a promoção do trade-off ao core.

## Acceptance criteria
- [ ] (A) O pacote `@prisma-intent/tradeoff` existe, com `publishConfig` público e com provenance, e depende só do core (teste de dependências)
- [ ] (A) O exemplo fictício da especificação compila: uma deliberação com duas decisões, uma delas necessária só conforme a resposta da outra, com tag na pergunta, numa alternativa e num eixo
- [ ] (A) `decisoesExigidas` só devolve a decisão condicional depois da resposta que a torna necessária
- [ ] (A) Cada violação de `ViolacaoDaDeliberacao` tem teste, incluída a dependência circular
- [ ] (A) O compilador recusa posição fora da régua, eixo sem todas as alternativas e polo que não é critério declarado (testes de tipo)
- [ ] (A) Uma decisão respondida só cita elemento lido com versão fixa
- [ ] (A) Nenhum nome de cliente, produto ou projeto de terceiro; os exemplos usam dados fictícios
- [ ] (A) `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` saem com código 0
- [ ] (C) Sidarta Veloso aprova

## Tasks
<!-- [x] feito · [ ] em aberto · [ ] ... — adiado: <razão> para o que se decidiu não fazer -->
- [ ] Criar o pacote `packages/tradeoff`, com o teste de dependências
- [ ] Tipos da deliberação, da decisão, do eixo, da proposta e da resposta
- [ ] Grafo: `Necessidade` e `decisoesExigidas`
- [ ] `verificarDeliberacao` e os testes de cada violação
- [ ] Exemplo fictício e README do pacote
- [ ] Changeset

## Notes
Pacote: 2026-000003

Depende da task-012 (tag no texto e elemento com ponto de leitura no core).

O desenho e a especificação de tipos entram na `develop` pela task-011. Até lá, estão na branch `docs/task-011`.
