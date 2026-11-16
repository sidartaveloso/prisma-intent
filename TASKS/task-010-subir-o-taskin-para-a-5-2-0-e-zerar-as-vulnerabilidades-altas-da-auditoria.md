# 🧩 Task 010 — Subir o taskin para a 5.2.0 e zerar as vulnerabilidades altas da auditoria

- Status: pending
- Type: chore
- Assignee: sidartaveloso

## Description
O job "Vulnerabilidades das dependências" do CI roda `pnpm audit --audit-level high` e reprova desde o primeiro push de novembro. As vulnerabilidades altas estão em dependências transitivas do `taskin` 5.0.0, a ferramenta de tasks instalada na raiz:

- `zod` abaixo de 4.6.6 (GHSA-mrhx-c7xc-m3w5), por `taskin` e `@opentask/taskin-utils`;
- `body-parser` de 2.0.0 até antes de 2.4.0 (GHSA-27r3-jxmh-p828), por `taskin > express`.

Nenhuma delas chega aos pacotes publicáveis: o `taskin` é ferramenta de desenvolvimento. Mas a `main` só aceita PR com o CI verde, e um job sempre vermelho deixa de avisar quando algo novo aparecer.

Decisão de Sidarta (2026-11-16): subir o `taskin` para a 5.2.0 e corrigir a auditoria.

## Acceptance criteria
- [ ] (A) `taskin` na 5.2.0, e `pnpm taskin list` e `pnpm lint:tasks` funcionam
- [ ] (A) `pnpm audit --audit-level high` sai com código 0
- [ ] (A) Toda exceção de quarentena ou `override` acrescentada tem o motivo ao lado
- [ ] (A) `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` saem com código 0
- [ ] (A) O job de auditoria passa no CI

## Tasks
<!-- [x] feito · [ ] em aberto · [ ] ... — adiado: <razão> para o que se decidiu não fazer -->
- [ ] Subir o taskin
- [ ] Levar `zod` e `body-parser` às versões corrigidas
- [ ] Conferir o taskin, a auditoria e os gates

## Notes
Pacote: 2026-000001
