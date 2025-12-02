# 📜 Histórico de Desenvolvimento do Projeto

Este documento unifica o histórico de conversas e decisões tomadas durante o desenvolvimento do Sistema de Gestão de ONGs. Ele serve como um registro cronológico da evolução do projeto.

---

## 📅 27 de Novembro de 2025

### 1. O Início: Boilerplate e Arquitetura (Madrugada)
**Objetivo:** Criar uma base sólida e pronta para produção.
*   **Ação:** Criação do boilerplate completo usando a **T3 Stack** (Next.js, Prisma, Tailwind, NextAuth).
*   **Entregas:**
    *   Estrutura de pastas escalável.
    *   Configuração inicial do Prisma (`schema.prisma`) e Autenticação (`auth.ts`).
    *   Scripts de setup e variáveis de ambiente (`.env.example`).

### 2. Módulo de Formulários Digitais (Madrugada)
**Objetivo:** Modernizar a coleta de dados, substituindo formulários em papel/Word.
*   **Ação:** Implementação do sistema de formulários dinâmicos e geração de PDFs.
*   **Entregas:**
    *   Modelagem de dados para `SocialAssessment` e `ImageAuthorization`.
    *   Criação de Server Actions para processamento de formulários (`actions/forms.ts`).
    *   Integração com `@react-pdf/renderer` para gerar documentos fiéis aos originais.

### 3. Tradução e Internacionalização (Tarde)
**Objetivo:** Tornar o código acessível para estudantes brasileiros.
*   **Ação:** Tradução massiva de comentários de código e documentação.
*   **Entregas:**
    *   Revisão de todos os arquivos em `actions/`, `lib/` e `components/`.
    *   Tradução de termos técnicos e explicações nos comentários.

### 4. Expansão da Documentação Educacional (Noite)
**Objetivo:** Transformar o projeto em um recurso didático rico.
*   **Ação:** Criação e expansão de documentos explicativos.
*   **Entregas:**
    *   Criação do `docs/03_DICIONARIO_TECNICO.md` com analogias para termos complexos.
    *   Detalhamento da arquitetura em `docs/02_ARQUITETURA_DO_SISTEMA.md`.

### 5. Refinamento Didático (Noite)
**Objetivo:** Garantir que novos arquivos mantenham o padrão educacional.
*   **Ação:** Revisão de arquivos recém-criados para adicionar comentários explicativos em português.

---

## 📅 28 de Novembro de 2025

### 6. Pesquisa e Dados Reais (Noite)
**Objetivo:** Enriquecer o projeto com contexto real da ONG "Além dos Olhos".
*   **Ação:** Web scraping do site oficial para extrair missão, visão, valores e detalhes de projetos.
*   **Resultado:** Dados coletados para futura integração na página "Sobre" ou no seed do banco de dados.

---

## 📅 29 de Novembro de 2025

### 7. Rastreabilidade e Visualização (Atual)
**Objetivo:** Facilitar o entendimento do fluxo de dados e dependências.
*   **Ação:** Anotação profunda do código e criação de mapas visuais.
*   **Entregas:**
    *   **Comentários de Rastreabilidade:** Adição de `// ⬅️ ORIGEM:` e `// ➡️ DESTINO:` em `actions/`, `lib/` e `prisma/seed.ts`.
    *   **Mapa de Dependências:** Criação de `docs/10_MAPA_DE_DEPENDENCIAS.md` com diagramas Mermaid (Fluxo de Doação, Auth, Arquitetura Global).
    *   **Correções:** Ajustes de sintaxe no Mermaid e remoção do `.env` do rastreamento do Git.
    *   **Integração:** Linkagem dos novos documentos no `README.md` e outros guias.

---

## 📈 Resumo da Evolução

O projeto evoluiu de um **Boilerplate Técnico** para uma **Plataforma Educacional Completa**. O foco mudou de apenas "funcionar" para "ensinar como funciona", com ênfase pesada em documentação, comentários didáticos e visualização de arquitetura.
