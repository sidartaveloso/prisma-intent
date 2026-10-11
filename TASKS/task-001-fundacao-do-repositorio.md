# 🧩 Task 001 — Fundação do repositório

- Status: done
- Type: chore
- Assignee: sidartaveloso

## Description
O repositório `prisma-intent` nasce vazio de código, com o ferramental para receber o core e as especializações: Node e pnpm fixados pelo asdf (`.tool-versions`), workspace pnpm (`apps/*`, `packages/*`), turbo para `build`/`typecheck`/`test`, taskin com provider `fs` sobre `TASKS/`, Biome com tab e aspas duplas (o estilo do código de origem) e os registros da metodologia OpenTask.

O plano inteiro está no pacote 2026-000001; esta task é só a T1.

## Acceptance criteria
- [x] (A) `.tool-versions` com Node 24 e pnpm 10, e `packageManager` igual no `package.json`
- [x] (A) `pnpm install` com turbo, taskin, Biome, TypeScript 6 e tsx
- [x] (A) `pnpm lint` (Biome + `taskin lint`), `pnpm typecheck`, `pnpm test` e `pnpm build` saem com código 0
- [x] (A) AGENTS.md, CLAUDE.md, README e `.opentask/` com o pacote 2026-000001
- [x] (A) `"license": "UNLICENSED"` e `"private": true` na raiz

## Tasks
<!-- [x] feito · [ ] em aberto -->
- [x] Ferramental (asdf, pnpm, turbo, taskin, Biome)
- [x] Registros OpenTask e plano
- [x] Rodar os gates

## Notes
Pacote: 2026-000001

Evidência (2026-10-10, local): asdf resolve Node 24.17.0 e pnpm 10.15.1 pelo `.tool-versions`; `pnpm install` com turbo 2.11, taskin 5, Biome 2.5, TypeScript 6.0.3 e tsx 4.23; `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` com código 0 (turbo sem pacotes ainda: 0 tarefas); `taskin list` lê a task.

O repositório remoto no GitHub não faz parte desta task: criá-lo e ligá-lo como `origin` é decisão de Sidarta.
