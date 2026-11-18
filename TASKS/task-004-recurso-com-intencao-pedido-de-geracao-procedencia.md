# 🧩 Task 004 — Recurso com intenção: pedido de geração, procedência e avaliação no core

- Status: pending
- Type: feat
- Assignee: sidartaveloso

## Description
Generalizar `AtivoVisual` (em `narrativa.ts`) para um **recurso** que existe por uma intenção, em qualquer linguagem (imagem, som), e dar ao core o caminho entre a intenção e o arquivo, que hoje dois consumidores implementam cada um por si:

- **pedido**, derivado da intenção: o texto do pedido, o que desqualifica uma candidata, a forma esperada (proporção; duração, para som) e a versão; o destinatário é um gerador ou uma pessoa, e o tipo não muda com isso;
- **procedência** de cada candidata: quem produziu (gerador e modelo, ou pessoa), pedido usado, referências, custo, instante, e, para o que uma pessoa fornece, a autorização declarada (reaproveitando `Procedencia` onde couber);
- **elegibilidade** automática: admite ou recusa com motivo, nunca ordena;
- **avaliação** humana, só por acréscimo: aprovar uma candidata, ou reprovar com categorias e motivo; a categoria declara o que a rodada seguinte muda no pedido.

Sem provedor, sem modelo, sem nome de produto: o core declara; quem gera e quem mostra a tela de revisão é o consumidor.

## Acceptance criteria
- [ ] (A) Um exemplo fictício declara um recurso com pedido (um a gerador, outro a pessoa), candidatas com procedência e avaliações, e compila; um recurso `produzido` sem aprovação é recusado pelo compilador ou por `verificarRegras`
- [ ] (A) `AtivoVisual` continua existindo (alias ou especialização) e os testes atuais do core passam
- [ ] (A) Nenhum nome de provedor, modelo, pessoa ou produto no código, nos testes nem na documentação
- [ ] (A) `apps/docs` tem a seção "intenção antes da imagem", com build e testes verdes
- [ ] (C) Sidarta Veloso decide o nome do conceito e aprova os tipos

## Tasks
<!-- [x] feito · [ ] em aberto · [ ] ... — adiado: <razão> para o que se decidiu não fazer -->
- [ ] Esperar a T3 do pacote 2026-000001 (o core neste repositório)
- [ ] Nome do conceito decidido por Sidarta
- [ ] Tipos e regras de integridade, com exemplo fictício em teste
- [ ] Seção do método em `apps/docs`

## Notes
Pacote: 2026-000002

As duas implementações de origem (um site de páginas de consultoria e uma plataforma de histórias) ficam nos repositórios dos consumidores e migram para o core depois, cada uma na própria tarefa.
