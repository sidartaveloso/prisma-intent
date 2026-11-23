# Changesets

Cada mudança que deve sair numa versão publicada ganha um changeset: `pnpm changeset`, escolhe os
pacotes, o tipo (patch, minor, major) e escreve o que muda para quem usa.

Core, especializações e o alias `prisma-intent` estão num grupo `fixed`: saem sempre juntos, na
mesma versão, mesmo que o changeset cite um só.

A versão e a publicação são do CI (`.github/workflows/release.yml`): o push na `main` abre o PR de
versão quando há changesets, e o merge dele publica no npm por *trusted publishing*, com
proveniência, e cria o release no GitHub.
