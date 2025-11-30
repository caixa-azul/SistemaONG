# 📊 Diagramas Visuais da Arquitetura

Este documento contém representações visuais da arquitetura, fluxo de dados e infraestrutura do sistema, utilizando a sintaxe **Mermaid.js**.

> ⚠️ **Nota sobre o Banco de Dados:** Para visualizar o Diagrama Entidade-Relacionamento (ERD) detalhado das tabelas e colunas, consulte o documento dedicado: [04_MODELAGEM_DE_DADOS.md](./04_MODELAGEM_DE_DADOS.md).
>
> 🗺️ **Nota sobre Dependências:** Para ver quem importa quem (fluxo de arquivos), veja o [10_MAPA_DE_DEPENDENCIAS.md](./10_MAPA_DE_DEPENDENCIAS.md).

---

## 1. Arquitetura de Containers (Modelo C4)

Este diagrama mostra os principais "containers" do sistema e como eles interagem. Ele define as fronteiras da aplicação.

```mermaid
C4Context
    title Diagrama de Containers - NGO Management System

    Person(user, "Usuário", "Funcionário ou Voluntário da ONG")
    
    System_Boundary(system, "NGO Management System") {
        Container(spa, "Single Page App", "Next.js Client", "Interface do usuário no navegador")
        Container(api, "Server Actions / API", "Next.js Server", "Lógica de negócio e validação")
        Container(auth, "Auth Provider", "NextAuth.js", "Gerenciamento de sessão e autenticação")
    }

    System_Ext(db, "Banco de Dados", "Neon (PostgreSQL)", "Armazenamento persistente de dados")
    System_Ext(pdf, "Gerador de PDF", "@react-pdf", "Geração de documentos para impressão")

    Rel(user, spa, "Usa", "HTTPS")
    Rel(spa, api, "Envia dados", "Server Actions / JSON")
    Rel(api, auth, "Verifica sessão", "Internal")
    Rel(api, db, "Lê/Escreve dados", "Prisma ORM")
    Rel(spa, pdf, "Gera documentos", "Client-side")
```

---

## 2. Fluxo de Lógica (Sequence Diagram)

Detalhe do fluxo de **Registro de Beneficiário**, mostrando a validação e a natureza assíncrona das Server Actions.

```mermaid
sequenceDiagram
    autonumber
    participant User as 👤 Usuário
    participant UI as 🖥️ UI Form
    participant Zod as 🛡️ Zod Validation
    participant Server as ☁️ Server Action
    participant DB as 💾 Prisma (DB)

    User->>UI: Preenche dados e clica "Salvar"
    UI->>Zod: Valida dados no Client (CPF, Email)
    
    alt Dados Inválidos
        Zod-->>UI: Erro de validação
        UI-->>User: Exibe mensagem de erro vermelha
    else Dados Válidos
        UI->>Server: Envia dados (actions/beneficiaries.ts)
        activate Server
        
        Server->>Server: Verifica Autenticação (auth())
        Server->>Zod: Re-valida dados no Server (Segurança)
        
        Server->>DB: create({ data: ... })
        activate DB
        DB-->>Server: Retorna Beneficiário Criado
        deactivate DB
        
        Server->>Server: revalidatePath('/beneficiaries')
        Server-->>UI: Retorna Sucesso
        deactivate Server
        
        UI-->>User: Exibe Toast de Sucesso e Redireciona
    end
```

---

## 3. Infraestrutura (Deployment Diagram)

Mapa da infraestrutura de deploy na Vercel e serviços conectados.

```mermaid
graph TD
    subgraph clientDevice ["📱 Dispositivo do Cliente"]
        browser["Navegador Web"]
    end

    subgraph subGraph1 ["☁️ Vercel Cloud"]
        edge["⚡ Edge Network (CDN)"]
        serverless["⚙️ Serverless Functions (Next.js)"]
    end

    subgraph dataLayer ["💾 Camada de Dados"]
        neon["Neon Database (PostgreSQL)"]
    end

    subgraph ciCd ["🔄 CI/CD"]
        github["GitHub Repository"]
    end

    browser -- "HTTPS" --> edge
    edge -- "Roteamento" --> serverless
    serverless -- "Prisma Connection Pool" --> neon
    github -- "Git Push (Trigger Deploy)" --> subGraph1
```

---

## 4. Mapa de Rotas (App Router Tree)

Visualização da estrutura de diretórios e rotas dentro de `app/`.

```mermaid
graph TD
    root["/ (app)"]
    
    subgraph public ["Rotas Públicas"]
        login["/login"]
    end
    
    subgraph protected ["Rotas Protegidas (Dashboard)"]
        layout["layout.tsx (Sidebar + Header)"]
        home["/ (Dashboard Home)"]
        
        subgraph modules ["Módulos"]
            beneficiaries["/beneficiaries"]
            donations["/donations"]
            consultas["/consultas (Data Explorer)"]
            inventory["/inventory"]
            financial["/financial"]
            volunteers["/volunteers"]
            distributions["/distributions"]
        end
    end

    root --> public
    root --> protected
    protected --> layout
    layout --> home
    layout --> modules
```

---

## 5. Arquitetura Lógica em Camadas (Logical Layers)

Este diagrama mapeia os conceitos do T3 Stack para a arquitetura clássica em camadas, facilitando o entendimento acadêmico.

```mermaid
graph TD
    subgraph presentation ["1. Camada de Apresentação (Frontend)"]
        ui["Pages & Components"]
        style ui fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    end

    subgraph service ["2. Camada de Serviço/Controller (Backend Logic)"]
        action["Server Actions"]
        auth["Auth.js"]
        zod["Zod Validation"]
        style action fill:#fff9c4,stroke:#fbc02d,stroke-width:2px
    end

    subgraph dataAccess ["3. Camada de Acesso a Dados (Persistence)"]
        prisma["Prisma Client"]
        style prisma fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    end

    subgraph database ["4. Camada de Banco de Dados (Storage)"]
        neon["Neon (PostgreSQL)"]
        style neon fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    end

    %% Fluxo
    ui -- "1. Request (Form Submit)" --> action
    action -- "2. Auth Check" --> auth
    action -- "3. Validate" --> zod
    action -- "4. Call DB" --> prisma
    prisma -- "5. SQL Query" --> neon
    neon -- "6. Raw Data" --> prisma
    prisma -- "7. Typed Object" --> action
    action -- "8. Response (UI Update)" --> ui
```
