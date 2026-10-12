# Diretrizes para agentes

Este repositório segue a metodologia OpenTask. Antes de analisar, planejar ou modificar código, leia:

1. `.opentask/README.md`;
2. o pacote relacionado à demanda em `.opentask/pacotes/`;
3. a tarefa relacionada em `TASKS/`;
4. a fonte oficial das regras: `.opentask/diretrizes-agentes.md` no repositório `sidartaveloso/opentask`.

## Regra principal

Nenhuma implementação, correção, evolução, refatoração ou alteração de infraestrutura começa sem demanda identificada, pacote registrado, tarefa registrada, critérios de aceite e função responsável. Quando faltar pacote ou tarefa, estruture-os primeiro.

## Ciclo de uma tarefa

O gerenciador oficial é o **taskin** (`.taskin.json`, provider `fs` sobre `TASKS/`).

```bash
pnpm taskin list             # situação das tarefas
pnpm taskin start <nnn>      # cria a branch e marca em andamento
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm taskin finish <nnn>     # finaliza
```

## Tudo aqui pode ser exposto

O PRISMA Intent será público. **Nada neste repositório pode ser privado**: código, testes, documentação, registros OpenTask (pacotes, tarefas) e mensagens de commit são escritos como se já fossem abertos. Isso proíbe:

- instância real (de pessoa, empresa ou produto) e qualquer dado dela — nome, empregador, cliente, valor, contato;
- nome de cliente, de oportunidade comercial ou de projeto de terceiro, inclusive como exemplo ou procedência;
- segredo de qualquer tipo (token, senha, chave privada), inclusive em `.env` de exemplo com valor real.

Exemplos e testes usam dados fictícios. A única identificação pessoal admitida é a autoria (nome e e-mail de quem commita e o cadastro no taskin). Na dúvida, não entra: o histórico do git não esquece.

## Fronteiras

- **O core não conhece especialização.** Currículo, vaga, criança, preço: nada disso entra em `@prisma-intent/core`. O que uma especialização pede e o core não tem é resolvido na especialização, ou vira um conceito genérico no core.
- **Especialização depende do core, nunca o contrário**, e nenhuma depende de outra.
- **Instância não mora aqui.** A base de fatos de uma pessoa, empresa ou produto é do consumidor; aqui ficam a gramática, as especializações e, quando houver, ferramentas genéricas (exemplos de instância só em teste ou documentação, com dados fictícios).

## Publicação

Os pacotes são abertos (MIT) e vão para o **npmjs**, na organização `prisma-intent`. Todo pacote publicado declara `publishConfig.access: "public"` e `publishConfig.provenance: true`.

- **Só o CI publica**, a partir da `main`, depois do PR de versão do changesets, por *trusted publishing* (OIDC): não existe token de publicação guardado em lugar nenhum. A exceção é a primeira versão de cada pacote, que Sidarta publica com 2FA, porque o npmjs só deixa configurar o *trusted publishing* num pacote que já existe.
- **Cada versão tem um release no GitHub**, com a tag e as notas do changeset.
- **Versão publicada não se apaga.** Erro se corrige com versão nova e `npm deprecate`.

## Convenções

- Identificadores, comentários e documentação em português. Nomes de pacotes npm em inglês quando o ecossistema exigir.
- Biome com **tab e aspas duplas** — o estilo do código de origem, para que a migração não reformate nada.
- Tipagem semântica forte: união discriminada em vez de propriedades opcionais, vocabulário literal em vez de `string`, `Certeza<T>` para o desconhecido.
- Segredos nunca entram no repositório.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
