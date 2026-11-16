---
id: "2026-000003"
tipo: pacote
status: rascunho
modo: agencia
visibilidade: interna
metodologia_versao: "0.1"
estrutura_versao: "2"
regra_devbits_versao: "0.1"
fonte_oficial: true
criado_em: 2026-11-16
atualizado_em: 2026-11-16
---

# Decisão com trade-off semântico: tag no texto e ativo no core, decisão numa especialização nova

## Contexto

Quando um trabalho para à espera da escolha de uma pessoa, o que ela costuma receber é prosa: uma lista de perguntas, com prós e contras em frases. Quem decide precisa remontar sozinho o que compete com o quê, o que cada caminho custa e o que uma resposta muda nas perguntas seguintes.

A metodologia OpenTask define, para as revisões, o **trade-off semântico**: cada eixo é bipolar, entre duas qualidades desejáveis que competem (nunca "bom contra ruim"); as alternativas ficam posicionadas no eixo, de −5 a +5, com a justificativa da posição; e cada alternativa diz o que se escolhe e o que se abdica. A resposta também é semântica: aprovar, ajustar ou rejeitar.

Em novembro de 2026, um protótipo conceitual, feito fora deste repositório e com dados que não podem vir para cá, aplicou esse modelo a quatro decisões encadeadas de um projeto. Ele mostrou o que uma decisão carrega além do eixo:

- **o que saber antes**: os fatos, de onde vieram e quão firme é a base da recomendação;
- **o caminho de cada alternativa**: as consequências em ordem e se o caminho tem volta ou é difícil de desfazer;
- **a explicação para quem não é do assunto**: a pergunta em palavras simples, por que ela está na mesa e cenas que a desenham;
- **texto que cita coisas**: uma tarefa, um registro de decisão técnica, um arquivo, uma branch, uma pessoa, um documento de identificação. Cada citação tem tipo, e a coisa citada várias vezes é declarada uma vez só, com o lugar e a versão em que foi lida;
- **decisões que dependem umas das outras**: a quarta só precisava ser tomada conforme a resposta da primeira, e cada uma dizia o que travava enquanto não fosse respondida;
- **a resposta com ressalva**: a escolha acompanhada de um ajuste ou de uma condição, no mesmo gesto.

Três consumidores já têm pedaços disso, cada um a seu modo:

- um produto de leitura de contratos extrai do texto dados com tipo e validação (documentos de identificação, telefone, e-mail, prazo, valor) e, noutro módulo, escreve a cláusula como trechos em que uma parte ou um termo do contrato é citado por referência; ao lado do texto, mostra a explicação em palavras simples, o porquê da cláusula e cenas desenhadas;
- o gerenciador de tarefas (taskin) precisa citar tarefa, branch e commit, porque a mesma tarefa pode estar diferente em cada branch e em cada commit;
- a própria OpenTask tem, em aberto, um desenho de marcação semântica no texto e um tipo de trade-off para as revisões.

O core do PRISMA Intent já tem as pontas: `Redacao` (o único lugar em que `string` livre é legítima), `Procedencia` (arquivo, linha, trecho literal e ressalva), `DecisaoRegistrada` (quem decidiu, quando e onde está registrado) e `CriterioDeDecisao`. O pacote 2026-000001 deixou em aberto, para pacote próprio, o crescimento do core para além da comunicação (pensar, construir, corrigir); decidir é parte disso.

### Decisões de 2026-11-16 (Sidarta Veloso)

1. **A referência no texto, os ativos e o trade-off moram no PRISMA Intent.** Os consumidores usam daqui; nenhum deles é dono do mecanismo. Isso inverte o desenho em aberto da OpenTask, que punha o mecanismo no núcleo dela e deixava ao PRISMA Intent o registro de tipos; os registros de lá precisam acompanhar.
2. **Tag é uma coisa só.** A tag que um consumidor extrai do texto e a referência que quem redige escreve são a mesma tag, usável do mesmo jeito em qualquer parte de uma decisão: pergunta, alternativa, eixo, trilha.
3. **No core entram a tag no texto e o ativo com ponto de leitura.** Eles evoluem `Redacao` e `Procedencia`, que já moram lá.
4. **A decisão e o trade-off nascem numa especialização nova.** O trade-off sobe ao core quando um segundo domínio precisar dele, como aconteceu com `Premissa`.
5. **O core segue sem dependências e sem conhecer tipo concreto.** Ele define o mecanismo; quem conhece documento de identificação, tarefa ou commit registra o tipo, com a validação e a resolução que couberem.

## Problema

O mesmo mecanismo, "um texto cita coisas com tipo, e uma decisão se apresenta por eixos, caminhos e dependências", está espalhado em três lugares, com nomes e formas diferentes, e nenhum deles serve aos outros. No core, `Redacao` é `string` livre: uma citação dentro dela não tem tipo, não é conferida e não leva a lugar nenhum. E não existe, em pacote nenhum, um tipo para a decisão que espera uma pessoa.

## Objetivo

1. **Tag no texto**, no core: uma citação com tipo dentro de uma redação. O core define a forma da tag e o registro de tipos; texto sem tag continua válido.
2. **Ativo com ponto de leitura**, no core: a coisa declarada uma vez e citada por tag quantas vezes for preciso, com onde e em que versão foi lida. Inclui o ativo que ainda não existe e nasce de uma alternativa.
3. **Decisão**, na especialização nova: a pergunta; o que saber antes; as alternativas, cada uma com o que se escolhe, o que se abdica, a trilha de consequências e se tem volta; os eixos de trade-off com as alternativas posicionadas; a proposta, com o porquê e a firmeza da base; a resposta (aprovar, ajustar com condição, rejeitar), registrada com `DecisaoRegistrada`; e a explicação em palavras simples, com o porquê e as cenas.
4. **Grafo de decisões**, na especialização nova: uma decisão declara de qual anterior depende e com quais respostas se torna necessária, e o que fica travado enquanto ela não é respondida.
5. **Regras de integridade** para o que o compilador não pega.

## Escopo

- o desenho aprovado: os tipos de tag, ativo, decisão e trade-off, com exemplo fictício, e os pontos em aberto decididos (task-011);
- os tipos e as regras no core e na especialização nova, em tarefas que saem do desenho;
- documentação no método (`apps/docs`), quando houver o que documentar.

## Fora do escopo

- **A tela.** Página, mapa de caminhos, sons e desenhos são do consumidor; aqui entra só o que a tela precisa ler.
- **Os tipos concretos.** Documento de identificação, tarefa, branch, commit e os demais são registrados por quem os conhece, no próprio repositório.
- **Resolver a tag contra um sistema.** Buscar a tarefa ou validar o documento é implementação do consumidor; o core define a interface.
- **Promover o trade-off ao core.** Só quando um segundo domínio precisar.
- **A migração dos consumidores.** Cada um na própria tarefa, no próprio repositório.

## Pontos em aberto

Cada ponto sobe ao decisor como trade-off semântico, na task-011.

| # | Ponto | O que já se sabe |
| --- | --- | --- |
| 1 | Nome da especialização | Em inglês, como as outras. Candidatos: `decide`, `decision`. |
| 2 | Nome do "ativo" | O core já tem `AtivoVisual`, e o pacote 2026-000002 o generaliza para "recurso". Chamar de ativo a coisa citada no texto dá dois sentidos à mesma palavra no core. |
| 3 | Forma da tag no texto | `Redacao` segue `string`, com marcação dentro (o protótipo usou `[[tipo:id\|rótulo]]`), ou passa a aceitar uma sequência de trechos, em que cada trecho é texto ou citação, como um dos consumidores já faz. Pesam a compatibilidade com tudo o que hoje é `Redacao`, a conferência pelo compilador e a leitura do arquivo por uma pessoa. |
| 4 | Quanto o core sabe de controle de versão | `Procedencia.arquivo` já fala em repositório. Branch e commit podem ser um campo genérico de versão no core, ou ficar inteiros no tipo de quem conhece git. |
| 5 | Ponto de leitura e `Procedencia` | O ponto de leitura é uma procedência sem trecho. Pode ser campo novo em `Procedencia` ou um tipo de que `Procedencia` passa a depender. |
| 6 | Eixo e `CriterioDeDecisao` | São vizinhos: o critério é a dimensão pela qual alguém decide; o eixo é a tensão entre duas qualidades. Falta decidir se o eixo cita critérios. |
| 7 | Escala do eixo | A metodologia usa −5 a +5. Falta decidir se o tipo fixa esses valores. |
| 8 | Dono da tela | Fora deste pacote, mas o desenho precisa saber quem a faz para dizer o que entrega a ela. |

## Entregáveis

| Entregável | Descrição | Evidência esperada |
| --- | --- | --- |
| Desenho | tipos propostos e pontos em aberto decididos | este pacote com a seção de desenho e a aprovação registrada |
| Core | tag no texto, registro de tipos e ativo com ponto de leitura | testes de tipo e exemplo fictício compilando |
| Especialização | decisão, trade-off e grafo, dependendo só do core | testes de tipo, de integridade e de dependências |
| Método | a decisão como aplicação do método, em `apps/docs` | build e testes do docs verdes |

## Critérios de aceite

- [ ] (A) Um exemplo fictício declara uma decisão com tag na pergunta, numa alternativa e num eixo, e o compilador ou `verificarRegras` recusa tag de tipo não registrado e tag que cita ativo não declarado.
- [ ] (A) Um ativo citado mais de uma vez é declarado uma vez só, com ponto de leitura; um ativo ainda inexistente é representável sem ponto de leitura.
- [ ] (A) Uma decisão que depende da resposta de outra só é exigida quando a resposta a torna necessária, e uma dependência circular é recusada.
- [ ] (A) Toda redação que existe hoje continua compilando sem alteração.
- [ ] (A) O core segue sem dependências e sem nome de tipo concreto; a especialização depende só do core (teste de dependências).
- [ ] (A) Nenhum nome de cliente, produto ou projeto de terceiro no código, nos testes nem na documentação; os exemplos usam dados fictícios.
- [ ] (C) Sidarta Veloso decide o nome da especialização e o nome do conceito hoje chamado de ativo, e aprova o desenho.

## Tarefas

| Posição | Tarefa (taskin) | Complexidade | Entregável |
| --- | --- | --- | --- |
| 1 | task-011 | média | desenho aprovado, com os pontos em aberto decididos |
| 2 | a registrar depois do desenho | média | tag no texto e ativo com ponto de leitura, no core |
| 3 | a registrar depois do desenho | alta | especialização nova: decisão, trade-off e grafo |

## Funções e responsáveis

- Responsável pelo pacote, líder técnico e decisor: Sidarta Veloso.
- Desenvolvedor: Sidarta Veloso (com agente como ferramenta; o agente não é pessoa nem função).

## Dependências

- **Pacote 2026-000002** (recurso com intenção): mexe em `AtivoVisual` e na procedência das candidatas. Os nomes dos dois pacotes precisam combinar (ponto em aberto 2).
- **Pacote 2026-000001, T4** (primeira publicação): mudar `Redacao` alcança todos os pacotes. Antes da primeira versão publicada, a mudança não quebra ninguém que instale por versão.
- **OpenTask**: os registros de lá sobre marcação semântica e sobre o tipo de trade-off precisam apontar para cá.

## Riscos

| Risco | Impacto | Tratamento |
| --- | --- | --- |
| Mudar `Redacao` quebra especializações e consumidores | Alto | Texto sem tag continua válido; critério de aceite próprio |
| O core passa a conhecer tipo concreto por conveniência | Médio | Registro de tipos por quem os conhece; teste que recusa dependência e nome de tipo concreto no core |
| Dado real em exemplo de tag (documento, contato, nome de projeto) | Alto | Exemplos fictícios; gitleaks no pre-commit e no CI |
| O mesmo mecanismo definido em dois lugares (aqui e na OpenTask) | Médio | Os registros de lá acompanham a decisão 1 antes de qualquer implementação |
| A especialização nasce moldada por uma tela só | Médio | A tela fica fora do escopo; o exemplo fictício não depende de apresentação |

## Eventos

- 2026-11-16 — pacote criado a partir de um protótipo conceitual da apresentação de decisões e das cinco decisões registradas no contexto (Sidarta Veloso, decisor).

## Resultado

## Aprendizado
