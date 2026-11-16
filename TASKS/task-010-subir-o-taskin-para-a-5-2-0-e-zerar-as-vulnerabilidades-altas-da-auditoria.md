# 🧩 Task 010 — Subir o taskin para a 5.2.0 e zerar as vulnerabilidades altas da auditoria

- Status: in-review
- Type: chore
- Assignee: sidartaveloso

## Description
O job "Vulnerabilidades das dependências" do CI roda `pnpm audit --audit-level high` e reprova desde o primeiro push de novembro. As vulnerabilidades altas estão em dependências transitivas do `taskin` 5.0.0, a ferramenta de tasks instalada na raiz:

- `zod` abaixo de 4.6.6 (GHSA-mrhx-c7xc-m3w5), por `taskin` e `@opentask/taskin-utils`;
- `body-parser` de 2.0.0 até antes de 2.4.0 (GHSA-27r3-jxmh-p828), por `taskin > express`.

Nenhuma delas chega aos pacotes publicáveis: o `taskin` é ferramenta de desenvolvimento. Mas a `main` só aceita PR com o CI verde, e um job sempre vermelho deixa de avisar quando algo novo aparecer.

Decisão de Sidarta (2026-11-16): subir o `taskin` para a 5.2.0 e corrigir a auditoria.

## Acceptance criteria
- [ ] (A) `taskin` na 5.2.0, e `pnpm taskin list` e `pnpm lint:tasks` funcionam — **não cumprido**: a 5.2.0 publicada não sobe; o `taskin` continua na 5.0.0, funcionando
- [x] (A) `pnpm audit --audit-level high` sai com código 0
- [x] (A) Toda exceção de quarentena ou `override` acrescentada tem o motivo ao lado
- [x] (A) `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` saem com código 0
- [ ] (A) O job de auditoria passa no CI

## Tasks
<!-- [x] feito · [ ] em aberto · [ ] ... — adiado: <razão> para o que se decidiu não fazer -->
- [ ] Subir o taskin — adiado: a 5.2.0 publicada não sobe
- [x] Levar `zod` e `body-parser` às versões corrigidas
- [x] Conferir o taskin, a auditoria e os gates

## Notes
Pacote: 2026-000001

### O taskin 5.2.0 não sobe

Instalada a 5.2.0 (publicada em 2026-11-15), qualquer comando termina em:

```text
SyntaxError: The requested module '@opentask/taskin-types' does not provide an export named 'CAPABILITIES'
```

O `taskin` 5.2.0 importa `CAPABILITIES` de `@opentask/taskin-types` e fixa a versão 2.7.0, que é a última publicada e não exporta esse nome. Com ela, `pnpm lint` reprova, porque `taskin lint` não roda. Subir a versão depende de um `taskin` acima da 5.2.0, publicado junto com um `taskin-types` que tenha o export.

### O que foi feito no lugar

As vulnerabilidades altas eram três caminhos de duas dependências:

| Dependência | Caminho | Correção |
| --- | --- | --- |
| `zod` 4.6.5 | `taskin > zod` | lockfile em 4.6.7; cabe na faixa `^4.5.4` que o `taskin` já pedia |
| `body-parser` 2.3.0 | `taskin > express > body-parser` | lockfile em 2.4.0; cabe na faixa do `express` |
| `zod` 3.25.76 | `taskin > @opentask/taskin-utils > zod` | `override` de `@opentask/taskin-utils` para 1.2.0, que usa o `zod` 4. O `zod` 3 não tem versão corrigida |

O `override` está em `pnpm-workspace.yaml`, com o motivo e a condição de saída ao lado. `package.json` não mudou.

Evidência (2026-11-16, local, em `chore/task-010`):

- `pnpm audit --audit-level high`: código 0; sobram 3 baixas e 10 moderadas, todas em dependências do `taskin`, abaixo do corte do CI;
- `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build`: código 0; `pnpm install --frozen-lockfile`: lockfile em dia;
- o `taskin` 5.0.0 com o `taskin-utils` 1.2.0 não é a combinação publicada, então foi ensaiado num clone descartável, com um repositório local no lugar do remoto: `new` (com commit e push), `start`, `lint`, `list` e `finish` funcionaram.

Para a leitura de Sidarta: o `package.json` continua pedindo `taskin ^5.0.0`. O lockfile segura a 5.0.0, mas um `pnpm update taskin` traz a 5.2.0, que não sobe.
