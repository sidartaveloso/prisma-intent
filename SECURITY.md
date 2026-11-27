# Política de segurança

## Como relatar

Encontrou uma vulnerabilidade, um segredo ou um dado pessoal publicado por
engano? **Não abra issue pública.** Escreva para sidartaveloso@gmail.com com:

- o que encontrou e onde (arquivo, commit, versão do pacote);
- como reproduzir, quando for o caso;
- o impacto que você vê.

A resposta inicial sai em até 5 dias úteis. Segredo ou dado pessoal exposto é
tratado primeiro: a credencial é revogada e o dado é retirado, inclusive do
histórico quando for preciso.

## O que este repositório faz para evitar

- **Nada aqui é privado** (AGENTS.md): exemplos e testes usam dados fictícios.
- **gitleaks** no pre-commit e no CI, sobre o histórico inteiro, com as regras
  padrão de segredo e regras próprias de dado pessoal (`.gitleaks.toml`).
- **Quarentena de dependências**: o pnpm não instala versão publicada há menos
  de 3 dias, e scripts de instalação só rodam para pacotes listados.
- **CI** com permissão mínima e actions fixadas por SHA; `pnpm audit` reprova
  vulnerabilidade alta ou crítica; Dependabot atualiza npm e Actions.

## Versões cobertas

Só a versão mais recente de cada pacote `@prisma-intent/*` recebe correção.
