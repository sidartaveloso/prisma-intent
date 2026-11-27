# 🧩 Task 016 — Marcação por diretivas do CommonMark: tag com atributos no core sem dependências e leitura e escrita num pacote à parte

- Status: in-progress
- Type: feat
- Assignee: sidartaveloso

## Description
A task-012 implementa a tag no texto com a marcação `[[tipo:id|rótulo]]`, que ainda não tem código. Dois consumidores que guardam texto como trechos tipados (um produto de acordos e os documentos técnicos da OpenTask) precisam de mais do que tipo, id e rótulo: atributos com chave e valor, como o atributo da parte citada, o artigo, a preposição, as duas formas da concordância, o número e o dispositivo de uma lei. Crescer `[[…]]` com parâmetros exigiu um escape próprio para `[[`, `|`, `]`, `;`, `=` e `\`, sem padrão nem biblioteca que o mantenha. É o ponto "como escrever a marcação literal sem que vire tag", que a task-012 deixou para decidir.

### Decisões de Sidarta Veloso (27/11/2026)

1. A leitura e a escrita da marcação semântica moram no PRISMA Intent, como o pacote 2026-000003 já diz da referência no texto. Os consumidores usam daqui. O devix-stack não tem pacote de marcação, só a recomendação de usar a intenção do PRISMA Intent.
2. **O core segue sem dependências.** Nele ficam os trechos, a tag com atributos, o registro de tipos com os atributos declarados e `verificarTags`. A leitura e a escrita da sintaxe vão para um pacote à parte do PRISMA Intent, que depende do unified.
3. A sintaxe proposta é a das diretivas genéricas do CommonMark, `:tipo[rótulo]{#id atributo=valor}`, lida e escrita por `micromark-extension-directive` e `mdast-util-directive`. A comparação com outras sintaxes, o trade-off semântico e a medição de tempo estão nos RDTs dos consumidores, e esta task os traz ao pacote 2026-000003 como decisão revista.

### Medição (27/11/2026, Apple M3, Node 24)

Para ler e escrever de volta, as diretivas levam 0,46 ms em 1 KB, 3,9 ms em 10 KB, 45 ms em 100 KB e 0,5 s em 1 MB. É de 25 a 45 vezes o tempo de uma expressão regular própria, crescendo de forma linear. A árvore volta igual; o texto volta normalizado, com aspas nos valores.


## Acceptance criteria
- [x] (A) O pacote 2026-000003 registra a decisão revista: diretivas no lugar de `[[tipo:id|rótulo]]`, atributos na tag e a leitura e a escrita fora do core, com o trade-off semântico (eixos, o que cada alternativa escolhe e abdica, se tem volta) e a medição
- [x] (A) A especificação de tipos e a task-012 passam a dizer `Tag` com atributos, `TipoDeElemento` com os atributos declarados (nome, valores aceitos, obrigatório ou não) e a sintaxe das diretivas; `lerMarcacao` e `escreverMarcacao` saem do core
- [x] (A) O pacote novo de marcação lê e escreve só diretivas de texto (`:tipo[rótulo]{#id …}`), com as construções de Markdown que não são usadas desligadas na leitura
- [x] (A) `lerMarcacao` e `escreverMarcacao` são inversas sobre os trechos; o texto escrito é a forma canônica (aspas e ordem fixa dos atributos); o texto corrido reproduz o original
- [x] (A) A leitura recusa tipo não registrado, atributo não declarado, valor fora dos aceitos e atributo obrigatório ausente, cada um com teste
- [x] (A) O core segue sem dependências (teste)
- [x] (A) Medição de tempo por tamanho (1 KB a 1 MB) versionada no pacote novo, para acompanhar a regressão
- [x] (A) Nenhum nome de cliente, produto ou projeto de terceiro; os exemplos usam dados fictícios
- [x] (A) `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` saem com código 0
- [ ] (C) Sidarta Veloso aprova a decisão revista e o nome do pacote novo

## Tasks
<!-- [x] feito · [ ] em aberto · [ ] ... — adiado: <razão> para o que se decidiu não fazer -->
- [x] Registrar a decisão revista no pacote 2026-000003, como trade-off semântico
- [x] Ajustar a especificação de tipos e a task-012
- [x] Pacote de marcação: leitura, escrita, falhas e medição
- [x] Changeset e documentação

## Notes
Pacote: 2026-000003

## Evidência (2026-11-27)

- Decisão revista: `.opentask/pacotes/2026-000003-decisao-com-trade-off-semantico/pacote.md`, seção "Decisão revista em 2026-11-27", com o trade-off (três eixos, três alternativas, o que cada uma escolhe e abdica, se tem volta), a medição e as escolhas da implementação à espera de aprovação. Especificação de tipos e task-012 ajustadas.
- Core: `packages/core/src/tag.ts` (`Tag` com atributos, `TipoDeElemento` com os atributos declarados, `registrarTipos`); `packages/core/test/tag.test.ts` e `packages/core/test/dependencias.test.ts` (sem dependências).
- Pacote `@prisma-intent/markup` (nome proposto): `lerMarcacao(texto, catalogo)` e `escreverMarcacao(trechos)`. Testes: `test/ida-e-volta.test.ts` (inversas, com 3000 trechos aleatórios; texto corrido igual ao original), `test/falhas.test.ts` (uma por falha: tipo não registrado, id ausente, atributo não declarado, valor fora dos aceitos, atributo obrigatório ausente, sempre e por dependência, tag sem fechamento, tag no rótulo) e `test/dependencias.test.ts`. O catálogo dos testes tem os cinco tipos do primeiro consumidor.
- Medição: `packages/markup/medicao/medir.ts` e `medicao/resultados.md` (1 KB 0,48 ms; 10 KB 4,4 ms; 100 KB 51,5 ms; 1 MB 0,56 s; mediana, Apple M3, Node 24).
- `scripts/verificar-carga.ts` liga as dependências de terceiros ao consumidor vazio; o alias `prisma-intent` deixa o pacote de fora.
- Changeset: `.changeset/marcacao-por-diretivas.md`.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` e `pnpm verificar:carga` saem com código 0.

Falta o critério (C): a aprovação da decisão revista, do nome do pacote e das seis escolhas da implementação.

Muda a task-012, que ainda não começou: ela fica com os tipos, o registro e `verificarTags` no core, e esta, com a sintaxe e o pacote de marcação. A task-013 continua dependendo da 012.
