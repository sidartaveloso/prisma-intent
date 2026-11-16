# 🧩 Task 006 — Trazer core, sales e funding para packages, sem histórico e com a procedência

- Status: in-review
- Type: feat
- Assignee: sidartaveloso

## Description
T3 do pacote 2026-000001, primeira de três partes. A T3 foi dividida pelo que cada pacote exige:

1. **esta task** — `core`, `sales` e `funding`: entram por cópia, sem mudança de comportamento;
2. `work` — sai a instância real, e os testes e scripts que dependiam dela passam a usar uma instância fictícia; o teste que compila os exemplos do README entra com ele, porque o exemplo usa o `work`;
3. `educate` — o `educar` renomeado e generalizado para qualquer idade.

Aqui, os três pacotes vêm de `sidartaveloso/sidartaveloso`, commit `3d8bed2` da `develop` (2026-11-14), fixado na task-005:

| Origem | Destino |
| --- | --- |
| `packages/prisma-intent-core` | `packages/core` |
| `packages/prisma-intent-sales` | `packages/sales` |
| `packages/prisma-intent-funding` | `packages/funding` |

O código entra como está, sem reformatar e sem o histórico. O que muda é o que a casa nova exige:

- `package.json`: licença MIT, autor, repositório, `publishConfig` com `access: "public"` e `provenance: true`. `private: true` continua até a T4, que decide o que vai no pacote publicado — hoje os pacotes exportam o fonte `.ts`;
- `tsconfig.json` de cada pacote estende o `tsconfig.base.json` da raiz;
- documentação (`README.md`, `AGENTS.md`): sai o que cita produto, consumidor ou repositório de origem; `educar` vira `educate`;
- testes de vedação: hoje guardam nomes de organizações reais numa lista de "vedados" para garantir que não apareçam no pacote. Num repositório aberto a lista é o vazamento. A lista sai do repositório e passa a vir de fora, por variável de ambiente.

## Acceptance criteria
- [x] (A) `packages/core`, `packages/sales` e `packages/funding` existem, e o commit de entrada registra repositório, commit e caminho de origem de cada um
- [x] (A) `src/` de cada pacote é idêntico ao da origem (`diff -r` vazio); as diferenças fora de `src/` estão listadas na evidência
- [x] (A) `sales` e `funding` dependem só de `@prisma-intent/core`, por `workspace:*`; nenhum `link:`, nenhum caminho para fora do repositório, nenhuma especialização depende de outra
- [x] (A) Cada `package.json` tem licença MIT e `publishConfig` com `access: "public"` e `provenance: true`
- [x] (A) Nenhum nome de organização, produto, pessoa ou repositório real nos três pacotes, inclusive em lista de vedação; gitleaks limpo
- [x] (A) `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` saem com código 0
- [ ] (C) Sidarta Veloso confirma a troca da lista de vedação por variável de ambiente

## Tasks
<!-- [x] feito · [ ] em aberto · [ ] ... — adiado: <razão> para o que se decidiu não fazer -->
- [x] Copiar os três pacotes
- [x] Ajustar `package.json` e `tsconfig.json`
- [x] Documentação sem produto nem consumidor
- [x] Vedação por variável de ambiente
- [x] Gates e varredura

## Notes
Pacote: 2026-000001

Depende da task-005 (core canônico). A lacuna com sustentação, pendente lá, não entra aqui.

Evidência (2026-11-14, local, commit `57db6d1` em `feat/task-006`):

- procedência no commit de entrada: `sidartaveloso/sidartaveloso`, `3d8bed2`, com o caminho de origem de cada pacote;
- `diff -r` de `src/` contra a origem: vazio nos três. Fora de `src/` diferem `package.json`, `tsconfig.json`, `README.md` e `AGENTS.md` dos três, e `test/dependencias.test.ts` de `sales` e `funding`;
- `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build`: código 0. Testes: core 5 de 5; funding 19 de 20 e sales 48 de 49, com o teste de vedação pulado por não haver `PRISMA_NOMES_VEDADOS`;
- vedação exercitada com a variável: passa com uma expressão que não casa, falha com uma que casa, e passa com a lista de nomes reais mantida fora do repositório;
- busca pelos mesmos nomes em `packages/`: só a autoria nos `package.json`; gitleaks em `packages/` e no pre-commit: `no leaks found`.

Para a leitura de Sidarta:

- a troca da lista de vedação por variável de ambiente (critério C);
- a linha do `funding` no README da raiz, aprovado em 2026-10-11 sem ela;
- `AGENTS.md` do core e do `funding` apontam para `../work/AGENTS.md`, que só existe quando o `work` entrar.
