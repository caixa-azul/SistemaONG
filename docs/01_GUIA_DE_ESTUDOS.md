# Walkthrough: Refatoração Educacional Global 🎓

Este documento resume as mudanças realizadas para transformar o Sistema de Gestão de ONGs em um recurso de aprendizado para estudantes de Análise e Desenvolvimento de Sistemas (ADS).

## 🎯 Objetivo
Transformar o código em um "livro aberto", onde cada arquivo explica não apenas **o que** faz, mas **por que** foi feito daquela maneira.

## 📚 Estrutura dos Comentários
Utilizamos emojis para categorizar os comentários e facilitar a leitura:

*   🧠 **Conceito (Teoria):** Explica fundamentos de Engenharia de Software, Design Patterns ou decisões de arquitetura.
    *   *Exemplo:* Singleton Pattern no Prisma, Normalização de Banco de Dados.
*   🛡️ **Segurança:** Destaca práticas de segurança e proteção de dados.
    *   *Exemplo:* Hashing de senhas, Validação Zod, Server-Side Auth Checks.
*   ⚡ **Next.js / React:** Explica recursos específicos do framework.
    *   *Exemplo:* Server Actions, RevalidatePath, Client vs Server Components.

## 📂 Arquivos de Destaque

### 1. Infraestrutura e Autenticação
*   **`auth.ts` & `auth.config.ts`**: Explicação completa do fluxo de autenticação com NextAuth.js, Providers, e Middleware.
*   **`lib/prisma.ts`**: O padrão Singleton para conexões de banco de dados em ambiente Serverless/Hot-Reload.
*   **`lib/schemas/domain.ts`**: Como o Zod garante a integridade dos dados e gera tipos TypeScript automaticamente.

### 2. Lógica de Negócio (Server Actions)
*   **`actions/donation.ts`**: Uso de **Transactions** (`prisma.$transaction`) para garantir consistência entre tabelas (Doação + Financeiro/Estoque).
*   **`actions/auth.ts`**: Tratamento de erros de autenticação no servidor.
*   **`actions/distributions.ts`**: Auditoria de quem realizou a ação (`createdById`) e revalidação de cache.

### 3. Interface do Usuário (Forms & Pages)
*   **`components/forms/social-assessment-form.tsx`**: Formulários complexos com listas dinâmicas (`useFieldArray`) e validação aninhada.
*   **`app/(dashboard)/page.tsx`**: Diferença entre Server Components (busca direta no banco) e Client Components.
*   **`components/pdf/social-assessment-pdf.tsx`**: Geração de documentos PDF no React usando primitivos visuais.

## 🚀 Como Estudar este Código
1.  **Comece pelo Schema**: Abra `prisma/schema.prisma` para entender os dados.
2.  **Siga o Fluxo**: Tente traçar o caminho de uma funcionalidade.
    *   *Exemplo:* Cadastro de Beneficiário -> `beneficiary-form.tsx` (Frontend) -> `actions/beneficiaries.ts` (Backend) -> Banco de Dados.
3.  **Leia os Emojis**: Sempre que vir um 🧠, pare e leia a explicação teórica.

## ✅ Conclusão
O projeto agora serve como um laboratório prático. Estudantes podem clonar, rodar e modificar o código tendo um "professor" embutido nos comentários.
