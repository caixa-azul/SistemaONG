# Walkthrough do Boilerplate do Sistema de Gestão de ONGs

Criei um boilerplate completo e pronto para produção para um Sistema de Gestão de ONGs. Este sistema é construído com Next.js, Prisma, Tailwind CSS e NextAuth.js.

## Funcionalidades Implementadas

### 1. Arquitetura Principal
- **Banco de Dados**: PostgreSQL com Prisma ORM (Produção-ready).
- **Autenticação**: NextAuth.js com provedor de Credenciais (pronto para OAuth).
- **Estilização**: Tailwind CSS com um design moderno e limpo.
- **Segurança de Tipos**: Suporte completo a TypeScript com tipos compartilhados.

### 2. Módulos do Dashboard
- **Beneficiários**: Gerenciar perfis de beneficiários (Criar, Listar).
- **Avaliação Social**: Formulários complexos com histórico familiar e condições de moradia.
- **Doações**: Registrar doações financeiras e materiais.
- **Estoque**: Acompanhar níveis de estoque com alertas de "Estoque Baixo".
- **Financeiro**: Visualizar livro caixa e saldo financeiro.
- **Documentos**: Geração automática de PDFs (Avaliação Social, Termos).

### 3. Server Actions (Ações do Servidor)
Implementadas Server Actions robustas para operações CRUD, garantindo manuseio de dados seguro e eficiente:
- `createBeneficiary` (criarBeneficiario)
- `createDonation` (criarDoacao - com suporte a transações para atualizações de Livro Caixa/Estoque)
- `createInventoryItem` / `updateInventoryItem` (criarItemEstoque / atualizarItemEstoque)
- `recordTransaction` (registrarTransacao)

### 4. Componentes
- **Biblioteca de UI**: Componentes reutilizáveis como `Button` (Botão), `Input` (Entrada), `Card` (Cartão), `Table` (Tabela).
- **Layout**: Barra Lateral e Cabeçalho responsivos.
- **Formulários**: Formulários validados no servidor usando Zod.

## Como Executar

### 1. Configuração do Ambiente
Certifique-se de que seu arquivo `.env` está configurado. Para a demonstração local, já configuramos para usar SQLite.

### 2. Configuração do Banco de Dados (PostgreSQL)
O projeto usa **PostgreSQL**. Você precisará de uma URL de conexão (ex: Neon, Supabase, ou local).

1.  **Configurar .env**:
    Crie um arquivo `.env` na raiz e adicione:
    ```env
    DATABASE_URL="postgresql://user:password@host:port/database"
    AUTH_SECRET="seu-segredo-aqui"
    ```

2.  **Gerar Cliente e Enviar Schema**:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

2.  **Popular Banco de Dados (Seed)**:
    Crie o usuário admin inicial (`admin@example.com` / `password123`):
    ```bash
    npx prisma db seed
    ```

### 3. Executando o App
Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
Visite [http://localhost:3000](http://localhost:3000) e faça login.

## Resultados da Verificação

- **Geração do Prisma**: Bem-sucedida (Downgrade para Prisma 5 para estabilidade).
- **Verificação de Build**: Estrutura do código é válida.
- **Componentes**: Todos os componentes estão implementados e integrados.

## Próximos Passos para o Usuário

- **Dados Iniciais**: O script de seed cria um usuário admin.
- **OAuth**: Configure provedores Google/GitHub em `auth.ts` se desejar.
- **Implantação**: Pronto para implantar na Vercel ou qualquer host Node.js (consulte `DEPLOY.md`).
