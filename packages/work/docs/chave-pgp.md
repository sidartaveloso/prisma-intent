# A chave PGP da pessoa

Manual para quem adota o PRISMA e quer que suas renderizações sejam
**verificáveis**, não só verdadeiras. Escrito para "quem declarar"; os exemplos
vêm do primeiro site que adotou o canal de política de segurança.

## 1. A chave é fato da pessoa, não do canal

O PRISMA separa **fato** (vive na instância) de **voz de canal** (vive no
`editorial.ts` de quem publica). O teste prático: *a frase pode ser desmentida
por um documento?* Se sim, é fato.

A fingerprint de uma chave PGP pode ser desmentida — pela chave. É fato. E é
**um só** fato usado por várias renderizações:

| Renderização | Uso da mesma chave |
| --- | --- |
| Política de segurança (site) | fingerprint publicada; chave pública para download |
| `/.well-known/security.txt` | a RFC 9116 recomenda assinar o próprio arquivo (OpenPGP em texto claro) |
| Commits do repositório | `commit.gpgsign` + `user.signingkey` — a instância é a fonte de verdade sobre a pessoa; assinar a história dela é coerente |
| Currículo | fingerprint no bloco de contatos; assinatura destacada do PDF (§6) |
| E-mail | segunda `uid` para o endereço principal — uma chave, dois endereços |
| JSON-LD | `sameAs` apontando para a chave em `keys.openpgp.org` |

Isso decide onde ela mora: **na instância, em `pessoa`** — fingerprint, `uids`,
URL de publicação, expiração. Cada renderização deriva de lá pelo mesmo caminho
que deriva tudo o mais (no site, o conteúdo pré-computado). A fingerprint é
digitada uma vez.

> **Estado do modelo:** `Pessoa` ainda não tem campo para a chave. Até ter, quem
> publica guarda a fingerprint numa constante do canal — vazia enquanto a chave
> não existir, para que a página não prometa o que não tem (§7). É um erro de
> modelagem conhecido: "contato é do canal" vale para o **endereço** `security@`,
> que é roteamento e muda por canal; não vale para a chave, que é identidade e
> não muda.

## 2. Gerar

```bash
gpg --quick-generate-key "Nome (segurança) <security@dominio>" ed25519 sign,encr 2y
```

- **ed25519**, não RSA: chaves menores, assinaturas rápidas, sem parâmetro para
  errar.
- **`2y`**: chave sem expiração num canal público é a que acaba esquecida.
  Dois anos casa com o ciclo do `Expires` do `security.txt` (anual, renovado) —
  renovar os dois vira um ritual só.
- A `uid` leva o endereço do canal. Acrescente a `uid` do e-mail principal
  depois (`gpg --quick-add-uid`) se quiser assinar e receber cifrado ali também.

O `gpg` gera junto o **certificado de revogação**, em
`~/.gnupg/openpgp-revocs.d/<fingerprint>.rev`. Ele é a peça mais importante
deste manual (§4).

## 3. Guardar

Para um canal pessoal, o risco realista é **perder**, não ter roubada. O que
você não pode perder de jeito nenhum não é a chave — é o certificado de
revogação: sem ele, chave perdida vira chave pública anunciada no site para
sempre, recebendo relatos que ninguém consegue abrir.

O mínimo, e que basta:

1. **Dois backups cifrados da privada, em domínios de falha diferentes.**
   `gpg --armor --export-secret-keys <uid>` para um arquivo. Uma cópia no
   gerenciador de senhas com anexos (1Password, Bitwarden Premium, Proton Pass —
   cifrado, sincronizado, sobrevive à máquina). Outra **offline**: pendrive
   cifrado ou `paperkey` impresso, guardado em **outro lugar físico**. Papel não
   sofre bit rot nem lock-in de fornecedor.
2. **Passphrase separada da chave.** Item próprio no gerenciador; cópia em papel
   junto do backup físico.
3. **Certificado de revogação** nos dois lugares também — separado da chave.
4. **Teste a restauração uma vez**: importe o backup num `GNUPGHOME` limpo e
   decifre uma mensagem de teste. Backup que nunca foi restaurado é esperança.

Opcional, o padrão de quem faz isso profissionalmente: **YubiKey** com as
subchaves (`keytocard`), primária só no backup offline — a privada nunca fica no
disco do notebook. Para um canal pessoal é conforto, não necessidade: os quatro
passos acima já cobrem a perda.

**Nunca:** commitar a privada; deixar em iCloud/Dropbox sem cifrar; mandar por
e-mail para si mesmo; guardar passphrase e chave no mesmo item.

## 4. Revogar e renovar

**Chave perdida ou comprometida:** importe o certificado de revogação, publique
a chave revogada (`gpg --send-keys`, e substitua o `.asc` publicado), gere outra
(§2) e atualize a instância. As renderizações seguem sozinhas: um indicador
único acompanha a fingerprint, e o teste de consistência acusa se o `.asc`, a
linha `Encryption:` e a página ficarem em estados diferentes.

**Renovação (a cada `2y`):** `gpg --quick-set-expire <fingerprint> 2y`,
re-exporte a pública, substitua o `.asc`. A fingerprint não muda — só a
expiração. Faça junto com a renovação do `Expires` do `security.txt`, que
merece um teste falhando 30 dias antes de vencer.

## 5. Onde a chave privada pode estar

Em três lugares, e só neles: no backup offline, no gerenciador de senhas
cifrado, e — para uso diário — no chaveiro da máquina ou num token de hardware.

**Nunca num secret de CI.** Se uma renderização precisa ser assinada em CI (§6),
o que vai para o secret é uma **subchave de assinatura** dedicada
(`gpg --quick-add-key <fingerprint> ed25519 sign 1y`), exportada sozinha
(`--export-secret-subkeys`). Ela assina; não certifica, não decifra, e pode ser
revogada sem tocar na primária.

## 6. Assinar o currículo

"Assinar o PDF" são duas coisas diferentes:

| | Assinatura PDF nativa | Assinatura OpenPGP destacada |
| --- | --- | --- |
| O que é | o selo que Acrobat/Preview mostram dentro do arquivo | um `curriculo.pdf.asc` ao lado, verificado com `gpg --verify` |
| Chave | **X.509**, não PGP — uma chave PGP não a produz | a mesma chave deste manual |
| Confiança | auto-assinado aparece como "não confiável"; emitido por CA custa e expira | quem tem a chave pública (o site publica) verifica |
| Onde é comum | contratos, documentos jurídicos | releases de software |

Para uma pessoa cujo site já publica a chave, a destacada é a coerente: o
currículo é renderização da mesma fonte, e o público que a instância declara —
liderança técnica, pesquisador de segurança — sabe rodar `gpg --verify`.
Recrutamento não vai verificar, e não precisa: a assinatura não é para
convencer, é para **poder ser conferida** por quem quiser.

**O que a assinatura prova:** integridade e origem — "estes bytes são os que eu
publiquei, sem alteração". **O que não prova:** que o conteúdo é verdadeiro. Isso
é o que `regrasDeIntegridade` e `prisma-verificar-publicacao` cobrem. As duas
camadas compõem: commit assinado da instância → PDF derivado → PDF assinado.
Fato verificado, publicação verificável.

**A armadilha:** assinar no *build* exige a privada no build. A saída é assinar
com a **subchave** (§5), guardada como secret, no job de **publicar** — que é
manual e com aprovação — e não no de construir. A assinatura vira ato de
publicação, não subproduto de compilação.

**Antes de qualquer chave**, o PDF deveria carregar metadados de autoria
(`/Author`, `/Title`, `/Subject`, `/Keywords`) a partir da instância. Um PDF
com `/Author` vazio e `/Creator Chromium` poderia ter sido gerado por qualquer
pessoa. Não é prova de origem — é o mínimo de proveniência.

## 7. Publicar no site

Quatro passos, nesta ordem (adapte os caminhos ao seu app):

```bash
# 1. exportar SÓ a pública, em ASCII armor, para onde a página e o security.txt apontam
gpg --armor --export security@dominio > public/.well-known/security-key.asc

# 2. ler a fingerprint e declará-la (na constante do canal, enquanto `Pessoa` não tiver o campo)
gpg --fingerprint security@dominio

# 3. devolver a linha ao security.txt
#    Encryption: https://dominio/.well-known/security-key.asc

# 4. conferir que os três mudaram juntos
pnpm test   # o teste de consistência do app que publica
```

O teste de consistência trava fingerprint ⇔ arquivo `.asc` ⇔ `Encryption:` ⇔
página no mesmo estado, e acusa qual ficou para trás — **com o passo que
falta**, não só o booleano que divergiu. É o que impede a página de
voltar ao estado em que nasceu: oferecendo download de um arquivo que não
existia.

Enquanto a chave não existir, a geração do conteúdo (e portanto todo build)
**avisa**, sem falhar: lista os blocos do mapa de intenção que ficam sem entrega
e aponta para esta seção. Aviso, não erro, porque o estado é legítimo —
`Encryption` é opcional na RFC — e porque o repositório precisa buildar em CI
sem segredos. Mas honestidade com o leitor não pode virar mudez com o operador.

## 8. Checklist para quem adota

- [ ] Chave gerada com expiração; `uid` do canal de segurança
- [ ] Dois backups cifrados da privada, em lugares diferentes; passphrase à parte
- [ ] Certificado de revogação guardado separado da chave
- [ ] Restauração testada num `GNUPGHOME` limpo
- [ ] Fingerprint declarada como fato da pessoa (instância), não como voz de canal
- [ ] Pública publicada em `/.well-known/`; `Encryption:` no `security.txt`
- [ ] Teste de consistência entre fingerprint, arquivo e `security.txt`
- [ ] Renovação da chave no mesmo ritual do `Expires`
- [ ] Se assinar em CI: subchave dedicada, no job de publicar, nunca a primária
