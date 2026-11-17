# 🧩 Task 012 — Tag no texto e elemento com ponto de leitura no core

- Status: pending
- Type: feat
- Assignee: sidartaveloso

## Description
Implementar no core o desenho aprovado do pacote 2026-000003 (aprovação de Sidarta Veloso em 2026-11-16). A especificação está em `especificacao-de-tipos.md`, na pasta do pacote. As decisões que a sustentam estão nas seções "Pontos decididos" e "Escolhas do desenho" do pacote.

O que entra no core:

- **redação com tag**: `Tag`, `TagNoTexto`, `Trecho` e `Redacao`, que passa a aceitar texto ou uma sequência de trechos; `lerMarcacao`, `escreverMarcacao` e `textoCorrido`, para a marcação `[[tipo:id|rótulo]]`;
- **registro de tipos**: `TipoDeElemento` (nome, descrição, forma do id e se a tag exige elemento declarado), `RegistroDeTipos` e `registrarTipos`. O core não registra tipo nenhum;
- **elemento com ponto de leitura**: `Elemento` (lido ou a criar), `PontoDeLeitura` e `VersaoLida`. `Procedencia` passa a ser o ponto de leitura mais o trecho literal e a ressalva;
- **conferência**: `verificarTags` e `ViolacaoDeTag`.

O que muda no que existe: alargar `Redacao` quebra quem lê redação como `string`. A medição de 2026-11-16 apontou 28 erros de typecheck em 9 arquivos (`work`, `sales`, `funding` e `educate`), nenhum no core nem em instância ou exemplo. O número não cobre o leitor que só usa métodos comuns a `string` e lista (`length`, `includes`, `slice`): esse compila e passa a se comportar errado.

Ficam para decidir nesta tarefa, por não mudarem o desenho: como escrever a marcação literal sem que vire tag; a interface de resolução da tag contra um sistema; e as representações em JSON Schema e no vocabulário.

## Acceptance criteria
- [ ] (A) O exemplo fictício da especificação compila; em trechos, o compilador recusa tipo não registrado e tag de elemento não declarado, quando o tipo exige declaração
- [ ] (A) `verificarTags` recusa, na marcação, tipo não registrado, id fora da forma, elemento não declarado em tipo que exige declaração e elemento declarado duas vezes; cada violação tem teste
- [ ] (A) A tag de um tipo que dispensa declaração vale sem elemento, e o id dela é conferido pela forma
- [ ] (A) `lerMarcacao` e `escreverMarcacao` são inversas, e o texto corrido de uma tag extraída reproduz o texto original
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
- [ ] Tipos de tag, trecho e redação; leitura e escrita da marcação
- [ ] Registro de tipos, elemento, ponto de leitura e `Procedencia`
- [ ] `verificarTags` e os testes de cada violação
- [ ] Adaptar os leitores de redação nos cinco pacotes
- [ ] Reescrever os dois comentários do core que usam "elemento" no sentido comum (`prioridade.ts` e `utilitarios.ts`)
- [ ] Changeset e documentação do core

## Notes
Pacote: 2026-000003

O desenho e a especificação de tipos entram na `develop` pela task-011. Até lá, estão na branch `docs/task-011`.

A task-013 (especialização `tradeoff`) depende desta.
