# 🧩 Task 016 — Marcação por diretivas do CommonMark: tag com atributos no core sem dependências e leitura e escrita num pacote à parte

- Status: pending
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
- [ ] (A) O pacote 2026-000003 registra a decisão revista: diretivas no lugar de `[[tipo:id|rótulo]]`, atributos na tag e a leitura e a escrita fora do core, com o trade-off semântico (eixos, o que cada alternativa escolhe e abdica, se tem volta) e a medição
- [ ] (A) A especificação de tipos e a task-012 passam a dizer `Tag` com atributos, `TipoDeElemento` com os atributos declarados (nome, valores aceitos, obrigatório ou não) e a sintaxe das diretivas; `lerMarcacao` e `escreverMarcacao` saem do core
- [ ] (A) O pacote novo de marcação lê e escreve só diretivas de texto (`:tipo[rótulo]{#id …}`), com as construções de Markdown que não são usadas desligadas na leitura
- [ ] (A) `lerMarcacao` e `escreverMarcacao` são inversas sobre os trechos; o texto escrito é a forma canônica (aspas e ordem fixa dos atributos); o texto corrido reproduz o original
- [ ] (A) A leitura recusa tipo não registrado, atributo não declarado, valor fora dos aceitos e atributo obrigatório ausente, cada um com teste
- [ ] (A) O core segue sem dependências (teste)
- [ ] (A) Medição de tempo por tamanho (1 KB a 1 MB) versionada no pacote novo, para acompanhar a regressão
- [ ] (A) Nenhum nome de cliente, produto ou projeto de terceiro; os exemplos usam dados fictícios
- [ ] (A) `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` saem com código 0
- [ ] (C) Sidarta Veloso aprova a decisão revista e o nome do pacote novo

## Tasks
<!-- [x] feito · [ ] em aberto · [ ] ... — adiado: <razão> para o que se decidiu não fazer -->
- [ ] Registrar a decisão revista no pacote 2026-000003, como trade-off semântico
- [ ] Ajustar a especificação de tipos e a task-012
- [ ] Pacote de marcação: leitura, escrita, falhas e medição
- [ ] Changeset e documentação

## Notes
Pacote: 2026-000003

Muda a task-012, que ainda não começou: ela fica com os tipos, o registro e `verificarTags` no core, e esta, com a sintaxe e o pacote de marcação. A task-013 continua dependendo da 012.
