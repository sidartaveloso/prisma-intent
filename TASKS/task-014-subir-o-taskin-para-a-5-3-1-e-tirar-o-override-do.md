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
- [x] (A) `taskin` na 5.3.1, com `^5.3.1` no `package.json`; `pnpm taskin list` e `pnpm lint:tasks` funcionam
- [x] (A) O `override` de `@opentask/taskin-utils` saiu do `pnpm-workspace.yaml`, e `pnpm audit --audit-level high` sai com código 0
- [x] (A) Os commits de status do taskin saem em português (`taskin config --commit-language pt-BR`)
- [x] (A) `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` saem com código 0
- [ ] (A) O CI passa, com o job de auditoria

## Tasks
<!-- [x] feito · [ ] em aberto · [ ] ... — adiado: <razão> para o que se decidiu não fazer -->
- [x] Subir o taskin e tirar o override
- [x] Idioma dos commits de status
- [x] Ensaiar new, start, review e finish num clone descartável
- [x] Auditoria e gates

## Notes
Pacote: 2026-000001

Evidência (2026-11-18, local, commit `083775c` em `chore/task-014`):

- `taskin` 5.3.1 instalado; `taskin --version`, `taskin list` e `taskin lint` funcionam. `@opentask/taskin-utils` 1.2.0 e `zod` 4.6.7 vêm da própria 5.3.1, sem `override`;
- `pnpm audit --audit-level high`: código 0; sobram 3 baixas e 9 moderadas;
- `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build`: código 0;
- `.taskin.json`: só `"commitLanguage": "pt-BR"` a mais. O `taskin config --commit-language pt-BR` reescreve o arquivo inteiro (quebra os arrays em linhas e grava o `ciSkipTag` padrão); a linha foi posta à mão para o diff ficar só nela, e `taskin config --show` lê `pt-BR` e `[skip ci]`;
- a quarentena não mudou: `taskin` e `@opentask/*` já estão em `minimumReleaseAgeExclude` desde 2026-10-11, por decisão de Sidarta, e o pnpm instalou a 5.3.1 publicada no mesmo dia sem pedir exceção.

Ensaio num clone descartável, com um repositório local no lugar do GitHub e um arquivo não rastreado na pasta:

| Comando | Na branch | Em `origin/develop` |
| --- | --- | --- |
| `new`, na `develop` | — | commit da task, publicado |
| `start`, na branch da task | `atualiza status para in-progress` | o mesmo commit, publicado sem checkout |
| `review` | `atualiza status para in-review`, depois de lint, typecheck e test | publicado |
| `finish` | `atualiza status para done` | publicado |

Os commits de status saíram em português. O arquivo não rastreado ficou de fora de todos.

### O que mudou para quem usa o taskin aqui

- **`start`, `review` e `finish` publicam o status em `origin/develop`** sozinhos. Não há mais `git push origin develop` a fazer depois deles.
- **O `finish` no nível `assisted` commita só o arquivo da task**, mas imprime a sugestão `git add . && git commit -m "…"`. Neste repositório, não seguir: a pasta de trabalho tem arquivo não rastreado que não pode entrar. O mesmo vale para o `pause`, que no `assisted` commita tudo sozinho (`git add -A`, com uma checagem de arquivo sensível antes).

### Nomes de arquivo das tasks

O `taskin lint` da 5.3.1 avisa quando o nome do arquivo de task passa de 50 caracteres. Dez passavam. Decisão de Sidarta (2026-11-18, "pode fazer"): renomear. O `taskin lint --fix` renomeou os dez por `git mv`, sem mudar o conteúdo (commit `5841a8c`); nenhum arquivo do repositório citava os nomes antigos, e o `taskin lint` passa sem aviso.

A task-011 está no PR #1, que altera o arquivo pelo nome antigo. Ensaiado numa worktree descartável, nas duas ordens — esta task antes do PR #1 e depois dele —, o merge sai sem conflito, e a task-011 fica com o nome novo e exatamente o conteúdo do PR #1.

