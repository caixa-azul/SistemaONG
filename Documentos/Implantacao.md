# Guia de Implantação (Vercel)

Este projeto é otimizado para implantação na [Vercel](https://vercel.com).

## Pré-requisitos

1.  **Repositório GitHub**: Envie este código para um repositório GitHub.
2.  **Conta Vercel**: Cadastre-se em vercel.com.
3.  **Banco de Dados**: Você precisa de um banco de dados PostgreSQL hospedado (ex: Vercel Postgres, Supabase, Neon ou Railway).

## Passos

1.  **Enviar para o GitHub**
    ```bash
    git init
    git add .
    git commit -m "Commit inicial"
    # Adicione sua origem remota
    # git remote add origin https://github.com/seuusuario/seu-repo.git
    # git push -u origin main
    ```

2.  **Importar na Vercel**
    - Vá para o seu Dashboard da Vercel.
    - Clique em **"Add New..."** (Adicionar Novo) -> **"Project"** (Projeto).
    - Importe seu repositório do GitHub.

3.  **Configurar Variáveis de Ambiente**
    Nas Configurações do Projeto na Vercel, adicione as seguintes variáveis de ambiente:
    - `DATABASE_URL`: Sua string de conexão do banco de dados hospedado (URL de pooling).
    - `DIRECT_URL`: Sua string de conexão do banco de dados hospedado (URL direta, se usar Supabase/Neon).
    - `AUTH_SECRET`: Uma string aleatória forte (gere com `openssl rand -base64 32`).

4.  **Implantar**
    - Clique em **"Deploy"** (Implantar).
    - A Vercel irá construir e implantar sua aplicação.

5.  **Pós-Implantação**
    - Uma vez implantado, seu app estará disponível em `https://seu-projeto.vercel.app`.
    - Você pode rodar o script de seed localmente apontando para o banco de produção para criar o usuário admin, ou usar o Console da Vercel/Prisma Studio.

## Desenvolvimento Local
Para rodar localmente (se quiser voltar para PostgreSQL):
1.  Garanta que você tem um PostgreSQL local rodando ou atualize o `.env` para apontar para um banco de desenvolvimento remoto.
2.  Execute `npx prisma db push` para sincronizar o schema.
3.  Execute `npx prisma db seed` para criar o usuário admin.
4.  Execute `npm run dev`.
