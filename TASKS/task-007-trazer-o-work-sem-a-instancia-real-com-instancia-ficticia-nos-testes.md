# 🧩 Task 007 — Trazer o work sem a instância real, com instância fictícia nos testes

- Status: pending
- Type: feat
- Assignee: sidartaveloso

## Description
T3 do pacote 2026-000001, segunda de três partes: o `work`, de `packages/prisma-intent-work` do repositório de origem (commit `3d8bed2`, fixado na task-005) para `packages/work`.

O `work` não entra por cópia, como os da task-006. Na origem ele é a especialização **e** a primeira instância, e a instância é de uma pessoa real. Instância é de quem usa o pacote, não do pacote. O que muda:

- **`src/instancias/` não vem.** Fica na origem a instância e o mapa de códigos públicos; `src/index.ts` deixa de reexportar o mapa, e o `package.json` deixa de exportar `./instancias/*`.
- **Comentários e exemplos do código** citam, na origem, organizações, produtos e a oportunidade reais. Passam a usar nomes fictícios. O código não muda.
- **Testes** de conferência e de procedência rodavam sobre a instância real e sobre a fonte arquivada dela. Passam a rodar sobre uma instância fictícia (`test/exemplo.ts`) e uma fonte fictícia, citada literalmente.
- **Scripts** `emitir` e `prisma-verificar-publicacao` importavam a instância real. Passam a receber o módulo da instância por argumento.
- **Documentação** (`README.md`, `AGENTS.md`, `docs/`): sai o que descreve os apps e a instância do repositório de origem.
- **Exemplo do README da raiz**: entra o teste que o confere contra código compilado (critério do pacote).

## Acceptance criteria
- [ ] (A) `packages/work` existe sem `src/instancias/`, e o commit de entrada registra repositório, commit e caminho de origem
- [ ] (A) Nenhum nome real de pessoa, organização, produto, cliente ou oportunidade no pacote, em código, comentário, teste ou documentação; gitleaks limpo
- [ ] (A) As diferenças de `src/` contra a origem estão listadas: só comentário, exceto `index.ts`
- [ ] (A) Os testes de conferência, procedência e redação passam sobre a instância fictícia; a procedência cita literalmente a fonte fictícia
- [ ] (A) `emitir` e `prisma-verificar-publicacao` recebem a instância por argumento, com teste; a verificação continua falhando fechada
- [ ] (A) O bloco `ts` do README da raiz é conferido contra um arquivo que o `tsc` compila, e o erro esperado do exemplo é pego por `@ts-expect-error`
- [ ] (A) `work` depende só de `@prisma-intent/core`, por `workspace:*`; licença MIT e `publishConfig` como nos demais
- [ ] (A) `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` saem com código 0
- [ ] (C) Sidarta Veloso confirma a instância fictícia, os scripts por argumento, o mapa de códigos fora do pacote e a forma do teste do README

## Tasks
<!-- [x] feito · [ ] em aberto · [ ] ... — adiado: <razão> para o que se decidiu não fazer -->
- [ ] Trazer `src/` sem a instância, com os comentários em nomes fictícios
- [ ] Instância e fonte fictícias; testes
- [ ] Scripts por argumento
- [ ] Documentação
- [ ] Teste do exemplo do README
- [ ] Gates e varredura

## Notes
Pacote: 2026-000001

Depende da task-006: a branch parte da dela, porque o core ainda não está na `develop`.
