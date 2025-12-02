# 🤝 Sistema de Gestão de ONGs (Educational T3 Stack Project)

Um sistema completo de gestão para Organizações Não Governamentais, desenvolvido como projeto educacional para demonstrar o poder da **T3 Stack** (Next.js, Prisma, Tailwind, NextAuth).

---

## 🚀 Como Rodar o Projeto (Início Rápido)

Não é necessário rodar comandos manuais. Preparamos scripts de automação para configurar o ambiente (Node, .env, Banco de Dados) para você.

> [!IMPORTANT]
> **Configuração do Banco de Dados**: O script **criará automaticamente** um arquivo `.env` para você. **Você precisará editá-lo** e adicionar a URL do seu banco de dados (PostgreSQL/Neon) quando o script pausar e solicitar.

### Opção A: Windows 🪟
Dê dois cliques no arquivo:
> `setup_windows.bat`

### Opção B: Linux / Mac 🐧
Abra o terminal e rode:
> `./setup_linux.sh`

*(Caso prefira o método manual, consulte o guia passo a passo na documentação).*

---

## 📚 Documentação e Aprendizado

Este projeto foi desenhado para ser transparente e educativo. Embora seja um sistema em produção, toda a lógica está comentada para facilitar o aprendizado.

### 🎓 Comece por aqui:
1.  [**Guia de Estudos (Walkthrough)**](docs/01_GUIA_DE_ESTUDOS.md) - Entenda como ler este código.
2.  [**Dicionário Técnico**](docs/03_DICIONARIO_TECNICO.md) - O significado de termos como ORM, Middleware e Hydration.

### 📂 Índice Completo
Para ver diagramas de banco, arquitetura e manuais de deploy, acesse nossa documentação:

- [🎓 01 - Guia de Estudos](docs/01_GUIA_DE_ESTUDOS.md) - **COMECE AQUI!** Guia sobre os comentários didáticos e como estudar o código.
- [🏰 02 - Arquitetura do Sistema](docs/02_ARQUITETURA_DO_SISTEMA.md) - Explicação do T3 Stack, estrutura de pastas e fluxo de dados.
- [📖 03 - Dicionário Técnico](docs/03_DICIONARIO_TECNICO.md) - Glossário de termos (API, ORM, Middleware) com analogias simples.
- [🗄️ 04 - Modelagem de Dados](docs/04_MODELAGEM_DE_DADOS.md) - Visualização gráfica das tabelas e relacionamentos (ERD).
- [👣 05 - Manual para Rodar Local](docs/05_MANUAL_RODAR_LOCAL.md) - Guia detalhado das funcionalidades e como rodar o projeto.
- [🚀 06 - Manual de Deploy em Produção](docs/06_MANUAL_DEPLOY_PRODUCAO.md) - Checklist para colocar o projeto em produção na Vercel.
- [📋 07 - Status do Projeto](docs/07_STATUS_DO_PROJETO.md) - Checklist de tarefas concluídas e pendentes.
- [🔮 08 - Melhorias Futuras](docs/08_MELHORIAS_FUTURAS.md) - Roteiro para transformar o boilerplate em produto final.
- [📊 09 - Diagramas Visuais](docs/09_DIAGRAMAS_VISUAIS.md) - Representações visuais da arquitetura (C4, Sequence, Deployment).
- [🗺️ 10 - Mapa de Dependências](docs/10_MAPA_DE_DEPENDENCIAS.md) - Diagramas de fluxo de dados e importações.

---

## 🛠️ Stack Tecnológica

* **Framework:** Next.js 14 (App Router)
* **Banco de Dados:** PostgreSQL (via Prisma ORM)
* **Estilização:** Tailwind CSS + Shadcn/UI
*   **Auth:** NextAuth.js v5

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

*Credenciais de Admin (Geradas pelo Seed):* `admin@ong.com` / `admin`
