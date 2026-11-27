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

## Tasks
<!-- [x] feito · [ ] em aberto · [ ] ... — adiado: <razão> para o que se decidiu não fazer -->
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

## Notes
Add any relevant notes or links here.
