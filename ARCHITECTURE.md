# Arquitetura do Sistema de Gestão de ONGs

Este documento descreve a arquitetura técnica do sistema, incluindo modelos de dados, fluxos de autenticação e módulos principais.

## Visão Geral
O sistema é construído sobre a stack T3 (Next.js, Tailwind CSS, TypeScript), utilizando Prisma como ORM e NextAuth.js para autenticação.

## Módulos Principais

### 1. Autenticação e Usuários
- **Tecnologia**: NextAuth.js v5.
- **Estratégia**: Credentials (Email/Senha) com JWT.
- **Modelos**: `User`.
- **Fluxo**: Login via Server Action -> Validação bcrypt -> Sessão JWT.

### 2. Gestão de Beneficiários
- **Modelos**: `Beneficiary`.
- **Funcionalidades**: CRUD completo, listagem com filtros (futuro).

### 3. Gestão de Doações e Estoque
- **Modelos**: `Donation`, `Inventory`, `FinancialLedger`.
- **Lógica**: Doações financeiras atualizam o `FinancialLedger`. Doações materiais atualizam o `Inventory`.
- **Transações**: Uso de `prisma.$transaction` para garantir integridade.

### 4. Módulo de Formulários Digitais (NOVO)
Este módulo digitaliza os processos de coleta de dados em campo.

#### Fluxo de Dados
1.  **Entrada**: Usuário preenche formulário web (`SocialAssessmentForm`).
2.  **Validação**: Zod Schema valida tipos e regras de negócio no cliente e servidor.
3.  **Persistência**: Dados salvos na tabela `SocialAssessment` via Server Action (`saveSocialAssessment`).
4.  **Saída**: Geração de PDF on-the-fly (`@react-pdf/renderer`) para assinatura e arquivamento.

#### Modelos de Dados
- **SocialAssessment**: Armazena dados socioeconômicos (Renda, Moradia, Saúde). Relacionamento 1:1 com `Beneficiary`.
- **ImageAuthorization**: Armazena consentimento de uso de imagem.

#### Decisões de Design
- **Acoplamento**: O módulo depende apenas do `BeneficiaryId`, mantendo baixo acoplamento com o resto do sistema.
- **PDF**: Geração no cliente (`PDFDownloadLink`) para reduzir carga no servidor e permitir feedback imediato.

## Estrutura de Pastas
- `actions/`: Lógica de negócio e mutações (Server Actions).
- `app/`: Rotas e páginas (App Router).
- `components/`: UI reutilizável e formulários específicos.
- `lib/`: Configurações globais (Prisma, Utils).
- `prisma/`: Schema do banco de dados.
- `types/`: Definições de tipos TypeScript compartilhados.
