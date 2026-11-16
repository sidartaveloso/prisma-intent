# Canal: `politica_de_seguranca`

Manual do canal para quem o declarar numa instância. O que ele é, o que a
instância precisa dizer, o que a renderização precisa entregar e — a parte que
ninguém escreve — o que **operar** o canal exige depois de publicado.

## 1. O que é, e para quem

Uma política de divulgação responsável de vulnerabilidades: o canal por onde
quem encontrou uma falha no site relata em privado, e o compromisso de quem
recebe.

É canal próprio, e não uma seção do site, porque o leitor traz outra pergunta.
Quem chega ao site pergunta "quem é essa pessoa?"; quem chega aqui já encontrou
um problema e pergunta "como reporto isso sem causar dano e sem me expor?". A
leitura é operacional, e o leitor é frequentemente internacional — o que muda o
idioma, o tom e o que precisa vir primeiro.

Público declarado no vocabulário (`vocabulario.ts`):

- `perfisHumanos.pesquisador_de_seguranca` — avalia se existe canal seguro e se
  não corre risco jurídico ao relatar.
- `perfisHumanos.desenvolvedor` — encontrou algo por acaso, quer saber onde
  contar.
- `perfisAgente.leitor_de_security_txt` — ferramenta que lê
  `/.well-known/security.txt` (RFC 9116) e **nunca abre a página**. Ainda assim
  é consumidor do canal.

## 2. O que a instância declara

Uma entrada em `renderizacoes[]`:

```ts
{
  tipo: "politica_de_seguranca",
  prioridade: "media",
  objetivo: "Oferecer um canal confiável, privado e padronizado para comunicar vulnerabilidades.",
  profundidade: "minima",
  idiomas: ["pt-BR", "en"],
  conteudoPrioritario: [],
  regras: [ /* editoriais — ver abaixo */ ],
}
```

Três coisas que não são óbvias:

- **`conteudoPrioritario: []` é declaração, não omissão.** O canal não prioriza
  case nenhum: o leitor não está avaliando o profissional, está reportando um
  problema. Qualquer case na frente é ruído. Declare o motivo em comentário.
- **`idiomas`** é propriedade do canal, não da instância. `idiomaBase` diz em que
  língua os *fatos* foram escritos; isso não muda. Um canal cujo leitor é
  internacional publica em mais de um idioma sobre a mesma base.
- **`objetivo` e `regras` são instrução, não conteúdo.** Escritos para quem
  monta a saída — como a `conclusao.tese` — e, como ela, nunca chegam ao leitor.
  Quem gera a página os lê e os deixa **fora** do que vai ao navegador; vale um
  teste conferindo.

As regras editoriais que este canal precisa ter, e por quê:

| Regra | Motivo |
| --- | --- |
| Não falar da trajetória profissional | quem chega aqui não veio avaliar ninguém; qualquer prova de competência vira conteúdo promocional |
| Não descrever infraestrutura, stack ou superfície de ataque | a página não pode virar mapa |
| Compromisso de resposta dentro das regras de integridade da instância | uma regra que veda carga horária (`\bhoras?\b`) vale em toda renderização — e "respondo em 48 horas" é a frase mais natural do mundo aqui |
| O segundo idioma é **tradução**, não outra política | divergência entre versões não seria diferença editorial: seria o site prometendo coisas diferentes conforme a língua de quem encontrou a falha |

## 3. O que a renderização entrega

- **Uma página por idioma declarado**, com `<html lang>` e `canonical` do
  idioma, e `hreflang` **recíproco**: cada versão lista as duas e aponta a si
  mesma. `hreflang` sem contrapartida é ignorado pelos buscadores.
- **`/.well-known/security.txt`** conforme a RFC 9116: `Contact` (obrigatório,
  pode repetir), `Expires` (obrigatório, no máximo um ano), `Policy` — **uma por
  idioma publicado**, senão `Preferred-Languages` promete uma língua sem endereço
  —, `Canonical`, `Preferred-Languages`, e `Encryption` **só quando a chave
  existe** (§4).
- **Um seletor de idioma** que marca a página corrente como texto
  (`aria-current="page"`) e a outra como link. Dois links clicáveis não dizem em
  qual delas o leitor está.
- **Botão de copiar** para endereço e fingerprint, com retorno perceptível —
  `role="status"` que permanece no DOM e só alterna visibilidade, para o
  `aria-live` anunciar. Copiar pode falhar (clipboard sem permissão); a falha
  anunciada é comportamento certo. O que não pode é silêncio.

## 4. Deveres operacionais

É aqui que a maioria das políticas de segurança apodrece: publicadas certas,
esquecidas depois.

**`Expires` do `security.txt`.** Vencido, a RFC manda o leitor tratar o arquivo
como inválido — e ele faz isso em silêncio: nada quebra, o scanner só passa a
ignorar o canal. Vale um teste que **falhe 30 dias antes** de vencer,
transformando renovação anual em aviso em vez de descoberta.

**A chave PGP.** Se a página promete criptografia, precisa haver chave — e a
chave é **fato da pessoa**, não do canal, porque a mesma chave assina o
`security.txt`, os commits e o currículo. Tudo sobre gerar, guardar, revogar e
renovar está em [`../chave-pgp.md`](../chave-pgp.md). O que é dever *deste
canal*: **não prometer chave que não existe.** Um indicador único deriva da
fingerprint; com ela ausente, o CTA de download não é renderizado, a linha do
protocolo vira "indisponível" e `Encryption:` sai do `security.txt`. Um teste
trava os quatro no mesmo estado. O primeiro site a usar este canal nasceu no
estado contrário — download de um arquivo que não existia — e para um
pesquisador isso é sinal de canal abandonado.

**Resposta.** O compromisso declarado ("confirmarei o recebimento assim que
possível") é uma promessa operacional. Um canal que não responde é pior que
canal nenhum: o pesquisador divulga por falta de retorno, que é exatamente o que
a política existe para evitar.

**Verificação de integridade nos dois idiomas.** `padroesVedados` são regex
escritos numa língua. Uma saída em outro idioma **não é coberta** até que as
regras ganhem padrão naquele idioma — e "nenhuma violação" passa a significar
"não entendi o texto". Ao declarar um idioma novo, amplie as regras antes de
publicar.

## 5. As peças de uma implementação

| Peça | Onde mora |
| --- | --- |
| Canal, perfis, `IdiomaDePublicacao` | `src/vocabulario.ts`, neste pacote |
| Entrada em `renderizacoes[]` e padrões das regras em cada idioma publicado | a instância |
| Vínculo página → canal, com a geração falhando se o canal não existir | o app que publica |
| Blocos e intenção (natureza funcional) | o app que publica |
| Prosa por idioma; constantes do canal | o app que publica, um arquivo por idioma |
| `security.txt` e teste de consistência | o app que publica |
| Conferência em navegador real, nas duas publicações | o app que publica |
| Entradas do build derivadas dos `idiomas` do canal | o app que publica |

## 6. Uma ressalva de modelagem

Este canal vive em `@prisma-intent/work` — posicionamento *profissional* —, mas
uma política de divulgação é propriedade de um **site**, não de uma pessoa. Foi
um alongamento aceito para não abrir uma especialização nova por um canal só. Se
um dia surgir uma especialização "site", este canal e este manual mudam de lugar
junto com o literal em `Canal`.
