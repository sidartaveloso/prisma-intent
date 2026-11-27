# 🧩 Task 005 — Core canônico: uma cópia só, com a decisão de cada diferença

- Status: in-review
- Type: docs
- Assignee: sidartaveloso

## Description
T2 do pacote 2026-000001. Quando o pacote foi escrito (2026-10-10) havia duas cópias do core com `src/index.ts` e `src/integridade.ts` diferentes: a do repositório de origem e a de um clone onde nasceu a especialização `sales`. Esta task compara as cópias que existem hoje e registra a decisão de cada diferença, para que a T3 traga um core só.

Não há código a escrever aqui. O que ela entrega é a evidência, o commit de origem que a T3 copia e a diferença que ainda espera decisão.

## Acceptance criteria
- [x] (A) As cópias do core que existem na origem estão comparadas, com o comando e a saída registrados
- [x] (A) Cada diferença aponta a decisão de origem (task e commit) ou está marcada como pendente
- [x] (A) O commit de origem que a T3 copia está fixado
- [ ] (C) Sidarta Veloso decide a diferença pendente (lacuna com sustentação) e confirma o core canônico

## Tasks
<!-- [x] feito · [ ] em aberto · [ ] ... — adiado: <razão> para o que se decidiu não fazer -->
- [x] Comparar as cópias
- [x] Registrar a decisão de cada diferença
- [ ] Decisão de Sidarta sobre a diferença pendente

## Notes
Pacote: 2026-000001

### Resultado

Das duas divergências, uma se resolveu na origem e a outra continua aberta.

- **Resolvida:** o ramo do `sales` entrou na `develop` de origem, e o que `sales` e `funding` compartilhavam subiu para o core. A cópia do clone não tem nada que a `develop` não tenha.
- **Aberta:** a diferença de `src/index.ts` e `src/integridade.ts` registrada em 2026-10-10 é a de um ramo de funcionalidade que ainda não entrou na `develop`. Ela espera decisão de Sidarta.

### Core que a T3 copia

`packages/prisma-intent-core` do repositório de origem `sidartaveloso/sidartaveloso`, no commit `3d8bed2` da `develop` (2026-11-14). É o core que os consumidores usam hoje.

### Evidência (2026-11-14, local, no repositório de origem)

O ramo onde nasceu o `sales` está inteiro na `develop`:

```text
$ git merge-base --is-ancestor feat/prisma-intent-sales develop; echo $?
0
```

Ponta do ramo: `550c16a` (2026-10-03). Ponta da `develop`: `3d8bed2`.

Core da `develop` contra o da cópia do clone (`diff -rq`, sem `node_modules` nem `dist`):

```text
Files …/AGENTS.md differ
Files …/README.md differ
Files …/package.json differ
Files …/tsconfig.json differ
Files …/src/index.ts differ
Only in develop/…/src: interno.ts
Only in develop/…/src: observacao.ts
Only in develop/…/src: premissa.ts
Only in develop/…: test
```

`src/index.ts` difere só por exportar os três módulos novos. `src/integridade.ts` é idêntico nas duas e tem um único commit na história da `develop` (`e0096b6`, 2026-08-24).

Core da cópia do clone contra o do ramo de funcionalidade aberto (`diff -rq` de `src/`):

```text
Files …/src/index.ts differ
Files …/src/integridade.ts differ
```

São os dois arquivos que o pacote registrou como divergentes em 2026-10-10.

### Decisão de cada diferença

| Diferença | Decisão | Onde foi decidida |
| --- | --- | --- |
| `src/interno.ts`, `src/observacao.ts`, `src/premissa.ts` | Ficam: premissa, dado interno e observação dos efeitos subiram do `sales` para o core quando o `funding` precisou dos mesmos conceitos | origem, task-042, commit `8a8d78b` |
| `src/index.ts` (exportar os três módulos) | Fica | origem, task-042, commit `8a8d78b` |
| `test/promovidos.test.ts` | Fica: cobre os três módulos promovidos | origem, task-042, commit `8a8d78b` |
| `AGENTS.md`, `README.md`, `package.json`, `tsconfig.json` | Fica a versão da `develop`; nome, licença e publicação do `package.json` são ajustados na T3 | origem, task-042 |
| `src/integridade.ts` e `src/index.ts` (lacuna com sustentação) | **Pendente** | decisão de Sidarta |

### A diferença pendente: lacuna com sustentação

O commit `c984035` (2026-10-03), num ramo de funcionalidade ainda aberto na origem:

- acrescenta `Sustentacao<TReferencia, TArgumento>` a `src/integridade.ts` — o que uma lacuna sustenta: um argumento, uma referência ou outro contexto;
- muda `Lacuna`: a variante `informacao_a_confirmar` ganha `pergunta` e `sustenta`, obrigatórios, e `ondeProcurar`, opcional; `Lacuna` ganha o segundo parâmetro `TArgumento`, com padrão `string`;
- exporta `Sustentacao` em `src/index.ts`.

O mesmo ramo muda tipos do `work` que usam essa lacuna. Um segundo ramo aberto acrescenta um tipo a `src/case-profissional.ts` do `work`. Conferidos todos os ramos locais e remotos da origem fora da `develop`: além desses dois, nenhum altera `packages/prisma-intent-*`.

A T3 copia a `develop` e **não** traz essas mudanças: são trabalho em andamento, sem revisão, e a `develop` é o que os consumidores compilam hoje. `pergunta` e `sustenta` obrigatórios quebram quem declara lacuna, então a entrada pede changeset.

Decisão que cabe a Sidarta, uma de duas:

1. a lacuna com sustentação vem para cá em task própria, quando o ramo entrar na `develop` de origem ou direto do commit `c984035`, e a primeira publicação (T4) pode sair antes ou depois dela;
2. a primeira publicação espera a lacuna com sustentação, para que a versão inicial do core já a tenha.
