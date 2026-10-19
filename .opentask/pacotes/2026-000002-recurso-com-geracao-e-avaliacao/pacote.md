---
id: "2026-000002"
tipo: pacote
status: rascunho
modo: agencia
visibilidade: interna
metodologia_versao: "0.1"
estrutura_versao: "2"
regra_devbits_versao: "0.1"
fonte_oficial: true
criado_em: 2026-10-19
atualizado_em: 2026-10-19
---

# Recurso com intenção: pedido de geração, procedência e avaliação

## Contexto

O core tem `AtivoVisual<TSentimento>` (em `narrativa.ts`): id, intenção (o que a imagem deve transmitir, não o que mostra), sentimentos desejados, descrição alternativa, arquivo opcional e estado `proposto | produzido`. É o bastante para declarar que uma imagem existe por uma intenção, e para a página saber o que dizer no `alt`.

Dois consumidores do core chegaram, em outubro de 2026, ao mesmo passo seguinte e o resolveram cada um por si: **gerar a imagem por IA a partir da intenção declarada e escolher entre as candidatas pela intenção**. Um deles (um site de páginas de consultoria) escreveu, no próprio repositório, um tipo `AtivoVisual & { geracao }` com prompt, o que evitar e proporção; um script que gera candidatas; e uma página local de revisão que registra, só por acréscimo, aprovação ou reprovação com categorias, e reescreve o prompt da rodada seguinte pela categoria. O outro (uma plataforma de histórias) planejou a mesma tela de revisão para os recursos de uma história, com a observação de que o recurso pode ser sonoro, e por isso "ativo visual" é nome estreito, e de que a elegibilidade automática (formato, tamanho, proporção) é diferente da decisão humana.

Decisão do autor (2026-10-19): toda imagem de uma página nasce com a intenção declarada no modelo, e é a intenção que orienta o pedido à IA geradora e a escolha entre as geradas.

## Problema

O conceito genérico, "um recurso existe por uma intenção, é pedido a um gerador a partir dela, tem procedência e é avaliado por uma pessoa contra ela", está sendo implementado duas vezes, fora do core, com nomes e formas diferentes. O core só conhece a ponta de cima (a intenção) e a ponta de baixo (o arquivo), e nada do caminho entre elas.

## Objetivo

Um conceito só no core, sem provedor e sem especialização, que as instâncias usem no lugar das implementações próprias:

1. **Recurso** generaliza `AtivoVisual`: imagem, som ou outra linguagem; a intenção e a descrição alternativa continuam propriedade do recurso, não da página.
2. **Pedido**: o que vai a quem produz o recurso, derivado da intenção (o texto do pedido, o que desqualifica, a forma esperada: proporção, duração), com versão. O destinatário pode ser um gerador (IA) ou uma pessoa (a foto que a organização fornece); o pedido é o mesmo, muda quem responde.
3. **Procedência da candidata**: quem produziu (gerador e modelo, ou pessoa), pedido usado, referências, custo e instante; para o que uma pessoa fornece, a autorização declarada (quem a deu, quando).
4. **Avaliação**: elegibilidade automática (admite ou recusa, com motivo, nunca ordena) separada da decisão humana (aprovar uma candidata, ou reprovar com categorias e motivo), registrada só por acréscimo; a categoria diz o que a próxima rodada muda no pedido.

## Escopo

- os tipos no core, com `AtivoVisual` mantido como alias ou especialização de Recurso para não quebrar consumidor;
- as regras de integridade que couberem (um recurso `produzido` tem arquivo e uma aprovação; uma reprovação tem categoria ou motivo);
- documentação no método (`apps/docs`): a inversão vale também para a imagem, "intenção antes da imagem".

## Fora do escopo

- qualquer provedor de geração (OpenRouter, Ollama, API de modelo): é do consumidor ou de uma ferramenta à parte;
- a página de revisão: é ferramenta; só entra no core o que ela registra;
- voto cego entre candidatas e ranking entre geradores: é de um motor de rinha, fora daqui.

## Entregáveis

| Entregável | Descrição | Evidência esperada |
| --- | --- | --- |
| Tipos | Recurso, pedido de geração, procedência, elegibilidade, avaliação | testes de tipo e exemplo fictício compilando |
| Integridade | regras do recurso produzido e da reprovação | testes de `verificarRegras` |
| Método | a seção "intenção antes da imagem" em `apps/docs` | build do docs verde |

## Critérios de aceite

- [ ] (A) Um consumidor declara um recurso com pedido de geração, registra candidatas com procedência e avaliações, e o compilador recusa recurso `produzido` sem aprovação.
- [ ] (A) `AtivoVisual` continua compilando nos consumidores atuais.
- [ ] (A) Nenhum nome de provedor, modelo ou produto no core.
- [ ] (C) Sidarta Veloso decide o nome do conceito (o autor recusou "ativo visual" para o que pode ser som) e aprova os tipos.

## Tarefas

| Posição | Tarefa (taskin) | Complexidade | Entregável |
| --- | --- | --- | --- |
| 1 | task-004 | média | tipos, integridade e método |

Depende da T3 do pacote 2026-000001 (o core dentro deste repositório).

## Funções e responsáveis

- Responsável pelo pacote, líder técnico e decisor: Sidarta Veloso.
- Desenvolvedor: Sidarta Veloso (com agente como ferramenta; o agente não é pessoa nem função).

## Eventos

- 2026-10-19 — pacote criado a partir de duas implementações paralelas do mesmo conceito em consumidores do core, e da decisão de que toda imagem nasce com a intenção declarada (Sidarta Veloso, decisor).
- 2026-10-19 — o pedido pode ser dirigido a uma pessoa, não só a um gerador: um consumidor recebeu uma foto fornecida pela organização, com autorização declarada, e o espaço vazio da imagem deve mostrar o pedido a quem configura a página (Sidarta Veloso, decisor).

## Resultado

## Aprendizado
