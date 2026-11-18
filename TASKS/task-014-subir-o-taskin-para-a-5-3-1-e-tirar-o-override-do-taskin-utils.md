# 🧩 Task 014 — Subir o taskin para a 5.3.1 e tirar o override do taskin-utils

- Status: in-progress
- Type: chore
- Assignee: sidartaveloso

## Description
A task-010 deixou o `taskin` na 5.0.0, porque a 5.2.0 publicada não iniciava, e pôs um `override` de `@opentask/taskin-utils` para 1.2.0, para zerar a vulnerabilidade alta do `zod` 3 na auditoria. O motivo e a condição de saída estão ao lado do `override`, no `pnpm-workspace.yaml`: "Sai quando houver um taskin acima da 5.2.0 que funcione."

A 5.3.1 saiu em 18/11/2026 e corrige a 5.2.0. Pedido de Sidarta, no mesmo dia: subir.

O que a subida traz de diferente, conferido no fonte da 5.3.1:

- **commits de status em inglês por padrão.** Este repositório escreve os commits em português: `taskin config --commit-language pt-BR`;
- **com `autoSync` e `defaultBranch`, `start`, `review` e `finish` publicam o status em `origin/develop`**, sem checkout, além de commitar na branch corrente. Na 5.0.0 isso não acontecia;
- **o `finish` no nível `assisted` não commita o trabalho**: só o arquivo da task. O commit de tudo (`git add -A`) fica no `finish` em `autopilot` e no `pause` em `assisted` — e o `pause` levaria arquivo não rastreado que esteja na pasta.

## Acceptance criteria
- [ ] (A) `taskin` na 5.3.1, com `^5.3.1` no `package.json`; `pnpm taskin list` e `pnpm lint:tasks` funcionam
- [ ] (A) O `override` de `@opentask/taskin-utils` saiu do `pnpm-workspace.yaml`, e `pnpm audit --audit-level high` sai com código 0
- [ ] (A) Os commits de status do taskin saem em português (`taskin config --commit-language pt-BR`)
- [ ] (A) `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` saem com código 0
- [ ] (A) O CI passa, com o job de auditoria

## Tasks
<!-- [x] feito · [ ] em aberto · [ ] ... — adiado: <razão> para o que se decidiu não fazer -->
- [ ] Subir o taskin e tirar o override
- [ ] Idioma dos commits de status
- [ ] Ensaiar new, start, review e finish num clone descartável
- [ ] Auditoria e gates

## Notes
Pacote: 2026-000001
