# 🧩 Task 008 — Trazer o educate: educar renomeado e generalizado para qualquer idade

- Status: pending
- Type: feat
- Assignee: sidartaveloso

## Description
T3 do pacote 2026-000001, terceira de três partes: `packages/prisma-intent-educar` do repositório de origem (commit `3d8bed2`, fixado na task-005) vira `packages/educate`.

Duas decisões de Sidarta, de 2026-10-11, definem o trabalho:

- **o nome**: `educar` passa a `educate`, no pacote, na pasta e no literal `especializacao`;
- **o alcance**: o `educate` não é limitado a crianças. Fica o que vale para educação em qualquer idade — quem aprende, quem decide e quem acompanha; intenção e objetivo observável; tema e sua origem; histórias, missões e rotina; estágio de desenvolvimento como dado; regras de integridade. O que é do produto de origem — faixas etárias, nomes próprios, canais, referências ao book de domínio — volta para a instância, no repositório do consumidor.

Esta task não é cópia: é uma proposta de generalização, tipo a tipo, que compila e tem teste, entregue para a leitura de Sidarta. A regra usada para decidir cada tipo é a pergunta que o próprio pacote já fazia: **a frase é verdadeira para qualquer plataforma que eduque, ou só para uma?**

O que é do produto não some: vira parâmetro. Canal, linha de conteúdo, faixa, necessidade, estágio e os efeitos comportamentais próprios passam a ser vocabulário que a instância declara e entrega ao `Brief`, do mesmo modo que as especializações entregam o seu ao core.

`ObjetivoObservavel` fica num módulo próprio, que só depende do core: é o candidato natural a subir para o core quando uma segunda especialização precisar dele.

## Acceptance criteria
- [ ] (A) `packages/educate` existe, com `@prisma-intent/educate` e `especializacao: "educate"`; nenhum `educar` sobra em nome de pacote, pasta ou literal de especialização
- [ ] (A) Nenhuma faixa etária fixa, nenhum conceito ou nome de produto, nenhuma referência a book ou repositório de consumidor, nenhum nome de pessoa real
- [ ] (A) Um brief de criança, com quem decide por ela, e um de adulto, que decide por si, compilam sobre os mesmos tipos, cada um com o próprio vocabulário de instância
- [ ] (A) O compilador recusa missão de quem acompanha que libera missão inexistente, canal fora do vocabulário da instância e objetivo observável sobre efeito que a instância não declarou
- [ ] (A) Os testes das máquinas de estado e das regras verificáveis passam; o vocabulário é emitido em `dist/educate.vocabulario.json`
- [ ] (A) `educate` depende só de `@prisma-intent/core`, por `workspace:*`; licença MIT e `publishConfig` como nos demais
- [ ] (A) `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` saem com código 0; gitleaks limpo
- [ ] (A) O commit de entrada registra a procedência e a tabela do que ficou, do que saiu e do que mudou de nome está na task
- [ ] (C) Sidarta Veloso lê a generalização e decide cada ponto marcado na tabela

## Tasks
<!-- [x] feito · [ ] em aberto · [ ] ... — adiado: <razão> para o que se decidiu não fazer -->
- [ ] Vocabulário, público, tema, missão, estados e regras generalizados
- [ ] `Brief` sobre o vocabulário da instância
- [ ] Exemplos fictícios de duas idades e testes de tipo
- [ ] Emissor, README e AGENTS
- [ ] Gates e varredura
- [ ] Tabela de decisões para Sidarta

## Notes
Pacote: 2026-000001

Depende das tasks 006 e 007: a branch parte da 007.

Fora desta task: migrar o consumidor atual, que hoje usa os nomes antigos e vai receber de volta o que era do produto; e qualquer especialização nova.
