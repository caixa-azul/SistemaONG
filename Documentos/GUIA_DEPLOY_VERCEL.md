# 🚀 Guia de Deploy na Vercel

Este guia foi preparado especificamente para o projeto **NGO Management System**. Siga os passos abaixo para colocar o sistema no ar sem erros.

## 1. Preparação do Banco de Dados (Neon / PostgreSQL)

Antes de ir para a Vercel, certifique-se de que seu banco de dados está pronto.

*   **Connection Pooling:** A Vercel é "Serverless", o que significa que ela pode abrir muitas conexões simultâneas. **Você DEVE usar a URL de "Pooled Connection"** do Neon para a variável principal.
*   **Direct Connection:** O Prisma precisa de uma conexão direta para rodar migrações.

## 2. Variáveis de Ambiente (Environment Variables)

Ao criar o projeto na Vercel, vá em **Settings > Environment Variables** e adicione as seguintes chaves.

| Chave | Valor (Exemplo/Instrução) |
| :--- | :--- |
| `DATABASE_URL` | `postgres://user:pass@ep-pool.neon.tech/neondb?sslmode=require` <br> **⚠️ Importante:** Use a URL "Pooled" do Neon. |
| `DIRECT_URL` | `postgres://user:pass@ep-direct.neon.tech/neondb?sslmode=require` <br> **⚠️ Importante:** Use a URL "Direct" do Neon (necessário para migrações). |
| `AUTH_SECRET` | Rode o comando abaixo no seu terminal e copie o resultado: <br> `openssl rand -base64 32` <br> *Nunca use senhas fáceis como "123" em produção!* |
| `AUTH_URL` | `https://seu-projeto.vercel.app` <br> *(A Vercel costuma detectar automaticamente, mas é bom definir se tiver problemas de redirecionamento)* |

> **Nota:** Não precisamos definir `NEXT_PUBLIC_...` a menos que você tenha criado alguma variável customizada que o frontend precise acessar.

## 3. Configuração do Projeto na Vercel

1.  Importe o repositório do GitHub.
2.  **Framework Preset:** Next.js (Deve detectar automaticamente).
3.  **Root Directory:** `./` (Raiz).
4.  **Build Command:** `next build` (Padrão).
5.  **Install Command:** `npm install` (Padrão).
    *   *Nota:* Adicionamos um script `"postinstall": "prisma generate"` no `package.json` que rodará automaticamente após a instalação para gerar o cliente do Prisma.

## 4. Teste de Build Local (Simulação)

Antes de fazer o push, **rode este comando na sua máquina**. Se ele falhar aqui, falhará na Vercel.

```bash
npm run build
```

### O que este comando faz?
1.  Gera o Prisma Client.
2.  Compila o código TypeScript (verifica erros de tipagem).
3.  Gera as páginas estáticas e dinâmicas.
4.  Verifica erros de ESLint.

**Se aparecer "Build successfully", você está pronto para o deploy! 🚀**
