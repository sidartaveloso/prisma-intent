# 🧩 Task 006 — Trazer core, sales e funding para packages, sem histórico e com a procedência

- Status: in-progress
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
- [ ] (A) `packages/core`, `packages/sales` e `packages/funding` existem, e o commit de entrada registra repositório, commit e caminho de origem de cada um
- [ ] (A) `src/` de cada pacote é idêntico ao da origem (`diff -r` vazio); as diferenças fora de `src/` estão listadas na evidência
- [ ] (A) `sales` e `funding` dependem só de `@prisma-intent/core`, por `workspace:*`; nenhum `link:`, nenhum caminho para fora do repositório, nenhuma especialização depende de outra
- [ ] (A) Cada `package.json` tem licença MIT e `publishConfig` com `access: "public"` e `provenance: true`
- [ ] (A) Nenhum nome de organização, produto, pessoa ou repositório real nos três pacotes, inclusive em lista de vedação; gitleaks limpo
- [ ] (A) `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` saem com código 0
- [ ] (C) Sidarta Veloso confirma a troca da lista de vedação por variável de ambiente

## Tasks
<!-- [x] feito · [ ] em aberto · [ ] ... — adiado: <razão> para o que se decidiu não fazer -->
- [ ] Copiar os três pacotes
- [ ] Ajustar `package.json` e `tsconfig.json`
- [ ] Documentação sem produto nem consumidor
- [ ] Vedação por variável de ambiente
- [ ] Gates e varredura

## Notes
Pacote: 2026-000001

Depende da task-005 (core canônico). A lacuna com sustentação, pendente lá, não entra aqui.
