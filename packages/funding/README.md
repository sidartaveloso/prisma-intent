# @prisma-intent/funding

**PRISMA Intent — especialização Funding.** Financiar um produto antes de ele existir em série: validar demanda, convencer a apoiar só com o que já foi provado, prestar contas depois, e decidir cada etapa interna por evidência.

Este pacote modela **o que uma campanha de financiamento significa**. O [core](../core/README.md) modela **como uma mensagem ganha intenção**; ele não sabe o que é campanha, apoiador, protótipo ou etapa — esses conceitos existem só aqui.

```text
Work ───────┐
Educate ────┤
Sales ──────┼──► Core
Funding ────┘
```

Vocabulário, tipos e as conferências. As **instâncias** — as campanhas concretas, com produto, recursos e estratégia — ficam com quem as usa, em outro repositório. Nenhum dado de produto ou campanha real entra aqui, e um teste confere.

## A tese

Apoiar não é comprar: quem apoia financia uma execução que ainda pode falhar. Por isso a pergunta central do leitor não é "isso atende ao que pedi?" (a da Sales), e sim **"isso existe, e vai chegar?"**. A Funding acrescenta ao core:

- **recurso** com natureza — `conceito`, `prototipo`, `registro_real` — e **vínculo** com a intenção que ele carrega ou apoia;
- **evidência** de produto (`demonstracao`, `medicao`), que só vale sobre registro do objeto real;
- **campanha**: consumidores, intenções com observação de cada efeito, argumentos, objeções com a resposta redigida ao leitor, renderizações por canal, regras e lacunas;
- **dossiê de etapa**: cada etapa interna como peça com consumidor próprio (o decisor), perguntas como argumentos, e a decisão registrada.

## Gramática

| Conceito | Pergunta que responde |
| --- | --- |
| `Campanha` | A base única de que saem a página, o vídeo, as recompensas, o FAQ, os riscos e o site |
| `Recurso`, `Vinculo` | Que peça (imagem, vídeo, documento, objeto) serve a que intenção, e se ela prova algo? |
| `EvidenciaFunding` | O que sustenta uma afirmação sobre o produto, e sobre que registro? |
| `NossaIntencaoFunding`, `ObservacaoDoEfeito` | O que queremos que o leitor conclua, e como saberemos que ele agiu? |
| `respostasAoLeitor` | O que o leitor lê em resposta a cada objeção (a diretriz é estratégia, não texto) |
| `Dossie`, `DecisaoDaEtapa` | Esta etapa tem evidência para avançar, e quem decidiu? |
| `regrasDoDominio` | O que nenhuma saída pode afirmar |

## Três decisões que o domínio carrega

- **Conceito não prova.** Renderização apresentada como produto é proibida pelas plataformas de financiamento. Recurso `conceito` não sustenta `demonstracao` (erro) nem carrega intenção pública (bloqueio).
- **Promessa sem prova não sai.** Argumento sem evidência é promessa a provar: pode existir na campanha e no dossiê, e não entra em canal público (bloqueio de publicação).
- **Avançar etapa exige evidência.** Um dossiê decidido `avanca` com pergunta crítica sem evidência, ou com lacuna crítica, é erro.

## Conferência

- `verificarCampanha(campanha)` → `{ erros, bloqueios, avisos }`. **Erros** são incoerência do modelo. **Bloqueios** são o checklist de publicação: só impedem `pronta_para_publicar` e `publicada`. **Avisos** são para a curadoria.
- `verificarTexto(texto, campanha)` → `verificarRegras` do core com as regras do domínio e as da casa. Rode sobre a **projeção pública** de cada canal.
- `verificarDossie(dossie, recursos)` → as regras de avanço de etapa.
- A projeção pública deve ser montada como `ConteudoRenderizavel` e passar por `garantirRenderizavel` (core).

## Comandos

```bash
pnpm --filter @prisma-intent/funding typecheck   # inclui os testes de tipo
pnpm --filter @prisma-intent/funding test        # conferências, tipos e dependências
```

> Antes de mexer em qualquer coisa aqui, leia o [AGENTS.md](AGENTS.md).
