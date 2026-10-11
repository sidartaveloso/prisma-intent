# PRISMA Intent

**Narrativa Semântica Adaptativa orientada por intenção.** Antes de escrever uma
mensagem, modela-se quem a recebe, o que essa pessoa quer descobrir, o que
queremos que ela conclua, o que afirmamos e com que prova, o que a impede de
acreditar e o que nenhuma saída pode afirmar. Dessa base única saem as
renderizações — página, currículo, proposta, dados semânticos, objeto físico —
por canal, profundidade e idioma.

Este monorepo é o produto: o núcleo e as especializações, publicados como
`@prisma-intent/*` num registry npm privado.

```text
especializações   work · educate · sales
        ↓ dependem de
core              a gramática; não conhece nenhum domínio
```

A regra que sustenta a arquitetura: **o core nunca conhece conceito de uma
especialização**, e este repositório não conhece quem o consome.

## Estrutura

| Pasta | Conteúdo |
| --- | --- |
| `packages/` | `@prisma-intent/core` e as especializações (chegam pelo pacote 2026-000001) |
| `apps/docs` | o método documentado (previsto no mesmo pacote) |
| `.opentask/` | pacotes da metodologia OpenTask |
| `TASKS/` | tarefas (taskin) |

## Ambiente

As versões de Node e pnpm estão em `.tool-versions` (asdf):

```bash
asdf install
pnpm install
```

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

## Licença

Por enquanto proprietário (`UNLICENSED`), com repositório e pacotes privados. O PRISMA Intent será aberto: a licença é escolhida antes disso (pacote 2026-000001, T6).
