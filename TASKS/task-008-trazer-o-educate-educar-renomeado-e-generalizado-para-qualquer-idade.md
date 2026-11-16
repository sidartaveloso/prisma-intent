# 🧩 Task 008 — Trazer o educate: educar renomeado e generalizado para qualquer idade

- Status: in-review
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
- [x] (A) `packages/educate` existe, com `@prisma-intent/educate` e `especializacao: "educate"`; nenhum `educar` sobra em nome de pacote, pasta ou literal de especialização
- [x] (A) Nenhuma faixa etária fixa, nenhum conceito ou nome de produto, nenhuma referência a book ou repositório de consumidor, nenhum nome de pessoa real
- [x] (A) Um brief de criança, com quem decide por ela, e um de adulto, que decide por si, compilam sobre os mesmos tipos, cada um com o próprio vocabulário de instância
- [x] (A) O compilador recusa missão de quem acompanha que libera missão inexistente, canal fora do vocabulário da instância e objetivo observável sobre efeito que a instância não declarou
- [x] (A) Os testes das máquinas de estado e das regras verificáveis passam; o vocabulário é emitido em `dist/educate.vocabulario.json`
- [x] (A) `educate` depende só de `@prisma-intent/core`, por `workspace:*`; licença MIT e `publishConfig` como nos demais
- [x] (A) `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` saem com código 0; gitleaks limpo
- [x] (A) O commit de entrada registra a procedência e a tabela do que ficou, do que saiu e do que mudou de nome está na task
- [ ] (C) Sidarta Veloso lê a generalização e decide cada ponto marcado na tabela

## Tasks
<!-- [x] feito · [ ] em aberto · [ ] ... — adiado: <razão> para o que se decidiu não fazer -->
- [x] Vocabulário, público, tema, missão, estados e regras generalizados
- [x] `Brief` sobre o vocabulário da instância
- [x] Exemplos fictícios de duas idades e testes de tipo
- [x] Emissor, README e AGENTS
- [x] Gates e varredura
- [x] Tabela de decisões para Sidarta

## Notes
Pacote: 2026-000001

Depende das tasks 006 e 007: a branch parte da 007.

Fora desta task: migrar o consumidor atual, que hoje usa os nomes antigos e vai receber de volta o que era do produto; e qualquer especialização nova.

Evidência (2026-11-16, local, commit `0a35979` em `feat/task-008`):

- procedência no commit de entrada: `sidartaveloso/sidartaveloso`, `3d8bed2`, `packages/prisma-intent-educar`;
- `test/exemplo.ts`: um brief de criança (`quemDecide: outra_pessoa`) e um de adulto (`quemDecide: o_proprio_aprendiz`, sem faixa), cada um com o próprio vocabulário de instância, sobre o mesmo `Brief`;
- `test/estados-ilegais.tipos.ts`: doze `@ts-expect-error`, todos consumidos pelo `tsc` — missão liberando missão inexistente, renderização priorizando missão inexistente, canal, idioma, linha e faixa fora do vocabulário, faixa numa instância sem faixas, "outra pessoa decide" sem ninguém, objetivo observável sobre efeito de outra instância, efeito emocional como comportamental e o literal antigo `"educar"`;
- `test/dependencias.test.ts`: a única dependência é o core; `objetivo.ts` só importa do core; nenhuma faixa etária em `src/`; o nome antigo não sobra;
- `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build`: código 0, com os cinco pacotes. Testes do `educate`: 31 de 32, com o de vedação pulado sem `PRISMA_NOMES_VEDADOS`; com a variável, passa. `pnpm build` emite `dist/educate.vocabulario.json`;
- busca em `packages/educate` pelos nomes do produto de origem, das crianças citadas nos testes de lá, do book e de seus identificadores: nada. gitleaks em `packages/` e no pre-commit: `no leaks found`.

### O que ficou, o que saiu e o que mudou de nome

Cada linha é uma decisão proposta. As marcadas com **D** são as que mais pedem a leitura de Sidarta.

| | Na origem | Aqui | Por quê |
| --- | --- | --- | --- |
| **D1** | `perfisHumanos`: `crianca`, `irmao`, `responsavel_decisor`, `familiar_participante`, `curador`, o ponto focal junto à escola (com o nome próprio do produto), `professor`, `escola` | `aprendiz`, `par`, `decisor`, `acompanhante`, `curador`, `mediador`, `educador`, `instituicao` | os nomes de origem dizem criança e escola; o papel é o mesmo em qualquer idade. `mediador` é o ponto focal junto à instituição, sem o nome próprio do produto |
| | `perfisAgente.personagem_assistente` | `assistente_de_rotina` | o personagem é do produto; o papel é executar a rotina |
| | Intenções do consumidor | três mudam de nome: `ver_junto_com_quem_acompanha`, `confiar_no_que_o_aprendiz_ve`, `continuar_presente_fora_da_aula`; as outras ficam | só mudou o que nomeava adulto, filhos ou casa |
| **D2** | 14 efeitos comportamentais | os 14 ficam como base; `chamar_o_adulto` vira `chamar_quem_acompanha`; as descrições perdem as referências ao produto | a alternativa é deixar na base só os que não nasceram de uma série do produto e devolver à instância `cumprimentar_quem_ganhou`, `pedir_desculpas`, `dividir`, `guardar_o_que_usou` e `esperar_a_sua_vez` |
| **D3** | `Canal`, `linhasDeConteudo`, `faixasEtarias`, `IdiomaDePublicacao`, `NecessidadeEspecifica` e os estágios literais, todos dentro do pacote | `VocabularioDaInstancia`: a instância declara e entrega a `definirBrief<Vocabulario>()(…)` | é o que a decisão de 2026-10-11 chama de voltar para a instância. `definirBrief` passou a ter dois passos, porque o TypeScript não infere parte dos parâmetros; a alternativa é uma fábrica que recebe os vocabulários como valor |
| **D4** | `PerfilDeCrianca`, com `faixa` obrigatória, `adultos[].papel`, `irmaos` e `registroDeMarca` | `PerfilDeAprendiz`, com `faixa` opcional, `quemDecide`, `quemAcompanha` e `pares` | `QuemDecide` é novo: o próprio aprendiz ou outra pessoa, que então precisa existir. É o que deixa caber o adulto que decide por si. `registroDeMarca` é marca de produto e saiu; `curador` saiu do perfil e continua nos perfis |
| | `faixasSoParaVerJuntos` | fora | regra de um produto; vai para as regras da casa da instância |
| | `EstagioDeDesenvolvimento`: marco oficial ou um de quatro estágios fixos | marco publicado ou estágio do vocabulário da instância | "estágio de desenvolvimento como dado" |
| | `CodigoBncc` em `assunto_escolar` | `Alinhamento { referencial, codigo }` em `assunto_em_estudo` | a base curricular vira um referencial entre outros |
| **D5** | `Casa`, `Familia`, `Conta` | fora; `ObjetoDaCasa` vira `ObjetoDoAmbiente`, dentro de `missao.ts` | descrevem como um produto se organiza (canal por casa, conta por telefone). A alternativa é generalizar para lugar e rede de apoio |
| | `MissaoDaCrianca`, `MissaoDoFamiliar`, `confirmacao: "PRONTO"` | `MissaoDoAprendiz`, `MissaoDeQuemAcompanha`, `confirmacao: Redacao` | a palavra de confirmação é escolha de cada produto; o portão é a transição |
| **D6** | seis máquinas de estado | cinco: sai a da relação com a plataforma; `itemDoPlano` vira `itemDaRotina`; estados com familiar, escola, casa e responsável no nome passam a `quem_acompanha`, `instituicao` e `quem_decide` | a relação com a plataforma é o funil de um produto |
| **D7** | oito regras do domínio | sete: sai `crianca_em_destaque_marca_discreta`, que é regra de um canal. `sem_telemetria_na_saida` passa a falar do que vai para terceiros; `sem_autoplay_nem_recompensa_por_tempo` passa a valer "sem que o aprendiz, ou quem decide por ele, tenha escolhido"; a lei de proteção de crianças e adolescentes fica citada como exigência para esse público | as duas últimas mudam de sentido para o adulto: vale conferir a redação |
| | `ModoDeConsumo` com três modos | quatro: entra `autonomo` | o adulto que decide por si não tem janela combinada com ninguém |
| | `ObjetivoObservavel` em `intencao.ts`, sobre os efeitos do pacote | `objetivo.ts`, genérico no efeito, com `verboNaoObservavel` | só depende do core: pronto para subir quando outra especialização precisar |
| | `Brief.missoesDaCrianca`, `missoesDoFamiliar`, `regrasDaCasa` | `missoesDoAprendiz`, `missoesDeQuemAcompanha`, `regrasDaCasa` | `regrasDaCasa` ficou: é o termo que `sales` e `funding` também usam |
| | cada tipo citava um identificador do book de domínio do consumidor | nenhuma referência; ficam as fontes públicas (Bloom, Krathwohl, Mager, a base curricular, a lei) | o book é do consumidor |

### O que o consumidor atual recebe de volta

Na migração dele, em task do repositório dele: as faixas, os canais, as linhas, as necessidades, os estágios e o registro de marca como vocabulário de instância; casa, família e conta; a máquina da relação; a regra do objeto físico; e a troca dos nomes desta tabela.

2026-11-16 — entrou na `develop` (merge `5ff894e`), direto, sem PR, por decisão de Sidarta. Os critérios (C) continuam abertos.
