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

## 🚀 Início Rápido (Automático)

Criamos scripts que fazem todo o trabalho pesado para você (instalar dependências, configurar banco, gerar cliente Prisma).

### Opção A: Windows 🪟
1.  Na pasta do projeto, dê dois cliques no arquivo `setup_windows.bat`.
2.  Siga as instruções na tela.
    - O script **criará o arquivo `.env` automaticamente** e vai pausar.
    - Preencha o arquivo `.env` com as credenciais do seu banco de dados. **Isso é obrigatório!**
    - Depois, ele vai instalar tudo e perguntar se você quer criar dados de teste.

### Opção B: Linux / Mac 🐧
1.  Abra o terminal na pasta do projeto.
2.  Dê permissão de execução (só na primeira vez):
    ```bash
    chmod +x setup_linux.sh
    ```
3.  Rode o script:
    ```bash
    ./setup_linux.sh
    ```

---

## 🛠️ Método Manual (Caso o script falhe)

Se por algum motivo os scripts não funcionarem, você pode fazer tudo manualmente:

### 1. Configuração do Ambiente
Certifique-se de que o **Node.js** está instalado.

### 2. Configuração do Banco de Dados
1.  **Configurar .env**:
    Duplique o arquivo `.env.example`, renomeie para `.env` e adicione sua URL do banco:
    ```env
    DATABASE_URL="postgresql://user:password@host:port/database"
    AUTH_SECRET="seu-segredo-aqui" # Gere um com: openssl rand -base64 32
    ```

2.  **Instalar Dependências**:
    ```bash
    npm install
    ```

3.  **Gerar Cliente Prisma e Sincronizar Banco**:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

4.  **Popular Banco de Dados (Seed)**:
    Isso cria o usuário admin inicial (`admin@example.com` / `password123`):
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
