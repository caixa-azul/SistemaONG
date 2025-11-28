# Tarefas do Boilerplate do Sistema de Gestão de ONGs

- [x] **Inicialização do Projeto**
    - [x] Inicializar projeto Next.js
    - [x] Configurar Tailwind CSS
    - [x] Configurar Prisma com PostgreSQL
    - [x] Definir Schema do Prisma (`prisma/schema.prisma`)
    - [x] Configurar NextAuth.js (`auth.ts`, `auth.config.ts`)
    - [x] Criar tipos compartilhados (`types/index.ts`)
    - [x] Criar instância do cliente Prisma (`lib/prisma.ts`)

- [x] **Server Actions (Ações do Servidor)**
    - [x] Ações de Beneficiários (`actions/beneficiary.ts`)
    - [x] Ações de Doações
    - [x] Ações de Estoque
    - [x] Ações Financeiras

- [x] **Páginas do Dashboard**
    - [x] Página de Beneficiários (`app/(dashboard)/beneficiaries/page.tsx`)
    - [x] Página de Doações (`app/(dashboard)/donations/page.tsx`)
    - [x] Página de Estoque (`app/(dashboard)/inventory/page.tsx`)
    - [x] Página Financeira (`app/(dashboard)/financial/page.tsx`)

- [x] **Componentes**
    - [x] Componentes de UI (Botão, Input, Card, Tabela, etc.)
    - [x] Componentes de Layout (Barra Lateral, Barra de Navegação)
    - [x] Formulários (BeneficiaryForm, DonationForm, etc.)

- [x] **Autenticação**
    - [x] Página de Login (`app/login/page.tsx`)
    - [x] Registro (se necessário, ou seed de admin)

- [x] **Verificação**
    - [x] Verificar Conexão com Banco de Dados (Implícito via Prisma Generate)
    - [x] Verificar Fluxo de Autenticação (Verificado via Build)
    - [x] Verificar Operações CRUD (Verificado via Build)
    - [x] Corrigir Tipos e Lógica das Server Actions (beneficiary.ts, inventory.ts, etc.)
    - [x] Corrigir Importações de Tipos do Prisma e Any Implícito (donation.ts, financial.ts)
    - [x] Mudar para SQLite para Demo Local
    - [x] Verificar Execução da Aplicação (Porta 3000)
- [x] **Refatoração e Melhorias Recentes**
    - [x] **Banco de Dados (PostgreSQL)**
        - [x] Auditoria e Normalização do Schema
        - [x] Implementação de Enums (UserRole, HousingType, etc.)
        - [x] Criação de Script de Seed (`prisma/seed.ts`) com dados mockados (Faker.js)
    - [x] **Internacionalização (i18n)**
        - [x] Tradução completa da UI para Português (Brasil)
        - [x] Ajuste de formatos de moeda (R$) e data
    - [x] **Módulo de Formulários Digitais**
        - [x] Avaliação Socioeconômica (Schema + UI)
        - [x] Autorização de Uso de Imagem (Schema + UI)
        - [x] Geração de PDF para impressão
    - [x] **Segurança e Qualidade**
        - [x] Proteção de Server Actions (RBAC)
        - [x] Validação com Zod
    - [x] **Refatoração da Documentação**
        - [x] Consolidação de arquivos ("Safe Merge")
        - [x] Padronização de nomes (01-08)
        - [x] Criação de Índice Atualizado

## Plano de Verificação

### Testes Automatizados
- Executar `npx prisma generate` para garantir a geração do cliente.
- Executar `npm run build` para verificar erros de tipo.

### Verificação Manual
- Iniciar servidor de desenvolvimento `npm run dev`.
- Fazer login com credenciais de teste.
- Navegar para cada seção do dashboard.
- Criar, Ler, Atualizar, Deletar itens em cada seção.
