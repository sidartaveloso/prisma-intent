# 🧩 Task 012 — Tag no texto e elemento com ponto de leitura no core

- Status: pending
- Type: feat
- Assignee: sidartaveloso

## Description
Implementar no core o desenho aprovado do pacote 2026-000003 (aprovação de Sidarta Veloso em 2026-11-16). A especificação está em `especificacao-de-tipos.md`, na pasta do pacote. As decisões que a sustentam estão nas seções "Pontos decididos" e "Escolhas do desenho" do pacote.

O que entra no core:

- **redação com tag**: `Tag` (tipo, id e atributos), `TagNoTexto`, `Trecho` e `Redacao`, que passa a aceitar texto ou uma sequência de trechos; `textoCorrido`;
- **registro de tipos**: `TipoDeElemento` (nome, descrição, forma do id, se a tag exige elemento declarado e os atributos declarados, com nome, valores aceitos e presença), `RegistroDeTipos` e `registrarTipos`. O core não registra tipo nenhum;
- **elemento com ponto de leitura**: `Elemento` (lido ou a criar), `PontoDeLeitura` e `VersaoLida`. `Procedencia` passa a ser o ponto de leitura mais o trecho literal e a ressalva;
- **conferência**: `verificarTags` e `ViolacaoDeTag`.

O que muda no que existe: alargar `Redacao` quebra quem lê redação como `string`. A medição de 2026-11-16 apontou 28 erros de typecheck em 9 arquivos (`work`, `sales`, `funding` e `educate`), nenhum no core nem em instância ou exemplo. O número não cobre o leitor que só usa métodos comuns a `string` e lista (`length`, `includes`, `slice`): esse compila e passa a se comportar errado.

Ficam para decidir nesta tarefa, por não mudarem o desenho: a interface de resolução da tag contra um sistema; e as representações em JSON Schema e no vocabulário.

### Revisão de 2026-11-27 (task-016)

A marcação passou a ser a das diretivas de texto do CommonMark, `:tipo[rótulo]{#id atributo="valor"}`, e a leitura e a escrita (`lerMarcacao`, `escreverMarcacao`) saíram do core para `@prisma-intent/tags`, que depende do micromark. O escape, que era ponto em aberto aqui, é o do CommonMark (`\:`). A decisão está no pacote 2026-000003, seção "Decisão revista em 2026-11-27".

A task-016 já pôs em `packages/core/src/tag.ts` o que o pacote de marcação usa: `AtributosDaTag`, `Tag`, `TagNoTexto`, `Trecho`, `ValoresDoAtributo`, `PresencaDoAtributo`, `AtributoDeclarado`, `TipoDeElemento`, `RegistroDeTipos` e `registrarTipos`, com testes, e o teste de que o core não tem dependências. Esta tarefa parte daí: `Redacao` com trechos, `textoCorrido`, elemento, ponto de leitura, `Procedencia`, `verificarTags` e a adaptação dos leitores. Os tipos podem mudar de arquivo (a especificação os punha em `utilitarios.ts`). `Elemento` usa `Omit<Tag, "atributos">`: os atributos são da citação.

## Acceptance criteria
- [ ] (A) O exemplo fictício da especificação compila; em trechos, o compilador recusa tipo não registrado e tag de elemento não declarado, quando o tipo exige declaração
- [ ] (A) `verificarTags` recusa, nos trechos, tipo não registrado, id fora da forma, elemento não declarado em tipo que exige declaração e elemento declarado duas vezes; cada violação tem teste
- [ ] (A) A tag de um tipo que dispensa declaração vale sem elemento, e o id dela é conferido pela forma
- [ ] (A) O texto corrido de uma redação em trechos reproduz o texto com cada tag pelo rótulo (`lerMarcacao` e `escreverMarcacao` passaram à task-016)
- [ ] (A) Toda redação e toda `Procedencia` que existem hoje compilam sem alteração: os testes dos cinco pacotes passam sem mudar instância nem exemplo
- [ ] (A) Cada campo `Redacao` do core e das especializações está classificado como prosa ou literal; os literais passam a `string`
- [ ] (A) Os leitores de redação dos cinco pacotes tratam as duas formas; a lista deles foi levantada trocando o tipo, por um momento, por um tipo opaco
- [ ] (A) O core segue sem dependências e sem nome de tipo concreto (teste)
- [ ] (A) Nenhum nome de cliente, produto ou projeto de terceiro; os exemplos usam dados fictícios
- [ ] (A) `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` saem com código 0
- [ ] (C) Sidarta Veloso aprova

## Tasks
<!-- [x] feito · [ ] em aberto · [ ] ... — adiado: <razão> para o que se decidiu não fazer -->
- [ ] Listar os leitores de redação com o tipo opaco e classificar os campos `Redacao`
- [ ] Redação com trechos e `textoCorrido` (tag, trecho e registro de tipos já vieram da task-016; a leitura e a escrita da marcação estão em `@prisma-intent/tags`)
- [ ] Registro de tipos, elemento, ponto de leitura e `Procedencia`
- [ ] `verificarTags` e os testes de cada violação
- [ ] Adaptar os leitores de redação nos cinco pacotes
- [ ] Reescrever os dois comentários do core que usam "elemento" no sentido comum (`prioridade.ts` e `utilitarios.ts`)
- [ ] Changeset e documentação do core

## Notes
Pacote: 2026-000003

O desenho e a especificação de tipos entram na `develop` pela task-011. Até lá, estão na branch `docs/task-011`.

A task-013 (especialização `tradeoff`) depende desta.

A task-016 (2026-11-27) tirou daqui a leitura e a escrita da marcação e adiantou os tipos de tag, trecho e registro.
