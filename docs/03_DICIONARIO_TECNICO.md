# 📖 Dicionário Técnico para Iniciantes

Bem-vindo ao glossário do projeto! Este documento foi criado para desmistificar os termos técnicos que usamos no dia a dia. Se você encontrar uma palavra que não conhece, provavelmente ela está explicada aqui.

---

## 🏗️ Arquitetura e Conceitos Gerais

### API (Application Programming Interface)
**O que é:** É como um "garçom" que leva o seu pedido (do frontend) para a cozinha (o backend) e traz a comida (os dados) de volta.
**No nosso projeto:** Usamos **Server Actions** em vez de uma API REST tradicional, mas o conceito é o mesmo: comunicação entre cliente e servidor.

### CRUD
**O que é:** Sigla para as 4 operações básicas de qualquer sistema:
- **C**reate (Criar)
- **R**ead (Ler)
- **U**pdate (Atualizar)
- **D**elete (Deletar)

### Deploy
**O que é:** O ato de colocar seu site "no ar". É quando pegamos o código que está no seu computador e o colocamos em um servidor na internet para que todos possam acessar.
**Exemplo:** Publicar o site na Vercel.

### Environment Variables (.env)
**O que é:** São variáveis "secretas" que ficam no servidor e não no código. Usamos para guardar senhas de banco de dados, chaves de API e segredos que não podem vazar.
**Importante:** Nunca suba o arquivo `.env` para o GitHub!

### Full Stack
**O que é:** Um desenvolvedor (ou framework) que lida tanto com o **Frontend** (o que o usuário vê) quanto com o **Backend** (a lógica e o banco de dados). O Next.js é um framework Full Stack.

### JSON (JavaScript Object Notation)
**O que é:** Um formato leve de troca de dados. É como o "idioma universal" da web. Quase tudo que enviamos e recebemos do servidor vem nesse formato.
**Exemplo:** `{ "nome": "Thiago", "idade": 25 }`

### MVC (Model-View-Controller)
**O que é:** Um padrão de arquitetura famoso.
- **Model:** O formato dos dados (ex: `prisma/schema.prisma`).
- **View:** O que o usuário vê (ex: `page.tsx`).
- **Controller:** A lógica que liga os dois (ex: `actions/`).

### T3 Stack
**O que é:** A combinação de tecnologias que usamos neste projeto:
- **Next.js** (Framework)
- **TypeScript** (Linguagem)
- **Tailwind CSS** (Estilos)
- **Prisma** (Banco de Dados)
- **NextAuth.js** (Autenticação)

### Endpoint
**O que é:** O endereço específico (URL) onde um serviço "mora".
**Exemplo:** `/api/auth/signin` é o endpoint onde o navegador bate para começar o login.

### Payload (Carga Útil)
**O que é:** Os dados úteis que são enviados dentro de uma requisição. É o "conteúdo da carta", enquanto o cabeçalho é o envelope.

### Request (Requisição) & Response (Resposta)
**O que é:** O diálogo básico da web.
- **Request:** O cliente (navegador) pede algo ("Me vê a página de login").
- **Response:** O servidor responde ("Toma aqui o HTML").

### Status Code
**O que é:** Um número que o servidor devolve para dizer se deu tudo certo.
- **200:** Sucesso (OK).
- **404:** Não encontrado (Not Found).
- **500:** Erro no servidor (Deu ruim).

---

## ⚛️ Frontend (React & Next.js)

### Client Component (`"use client"`)
**O que é:** Componentes que rodam no navegador do usuário. Eles podem ter interatividade (cliques, `useState`, `useEffect`).
**Regra:** Se precisa de `onClick` ou `onChange`, é Client Component.

### Debounce
**O que é:** Uma técnica para evitar que uma função rode muitas vezes seguidas.
**Exemplo:** Quando você digita na busca, esperamos você parar de digitar por 300ms antes de enviar a requisição ao servidor. Isso evita travar o banco de dados com buscas inúteis ("M", "Ma", "Mar", "Mari", "Maria").

### Server Component (Padrão)
**O que é:** Componentes que rodam **apenas** no servidor. Eles buscam dados, renderizam o HTML e enviam pronto para o navegador. São mais rápidos e seguros, mas não têm interatividade direta.

### Hook
**O que é:** Funções especiais do React que começam com `use` (ex: `useState`, `useEffect`). Elas permitem "ligar" recursos do React dentro de componentes funcionais.

### Hydration (Hidratação)
**O que é:** O processo onde o React "acorda" o HTML estático que veio do servidor.
**Analogia:** O servidor manda uma "estátua" (HTML). A hidratação é quando o JavaScript entra na estátua e ela ganha vida (pode se mexer/interagir).

### Props
**O que é:** Abreviação de "Properties". São os dados que passamos de um componente pai para um componente filho. É como passar argumentos para uma função.

### State (Estado)
**O que é:** A "memória" de um componente. Quando o estado muda, o React redesenha o componente na tela automaticamente.

### Toast
**O que é:** Aquela notificaçãozinha flutuante que aparece no canto da tela dizendo "Salvo com sucesso!" ou "Erro ao salvar".

---

## 🔙 Backend & Banco de Dados

### ACID
**O que é:** Sigla para as propriedades que garantem que uma transação no banco de dados seja segura:
- **A**tomicidade (Tudo ou nada)
- **C**onsistência (Respeita as regras)
- **I**solamento (Uma transação não interfere na outra)
- **D**urabilidade (Se salvou, tá salvo mesmo se acabar a luz)

### Foreign Key (Chave Estrangeira)
**O que é:** Um campo que aponta para o ID de outra tabela. É o que cria o "link" entre dados.
**Exemplo:** Na tabela `Donation`, temos `registeredById` que aponta para o `id` da tabela `User`.

### Index (Índice)
**O que é:** Uma estrutura especial no banco de dados que faz as buscas ficarem muito mais rápidas.
**Analogia:** É como o índice remissivo no final de um livro. Sem ele, você teria que ler o livro todo para achar uma palavra.

### Migration
**O que é:** Um arquivo de histórico que diz ao banco de dados como ele deve mudar.
**Exemplo:** "Crie a tabela Usuários", depois "Adicione o campo Telefone na tabela Usuários". É o controle de versão do seu banco de dados.

### Normalização
**O que é:** A arte de organizar tabelas para evitar repetição de dados.
**Exemplo:** Em vez de repetir o endereço completo em cada pedido, criamos uma tabela `Endereços` e só usamos o ID dela.

### ORM (Object-Relational Mapping)
**O que é:** Um "tradutor" que permite mexer no banco de dados usando código JavaScript em vez de SQL puro.
**No nosso projeto:** Usamos o **Prisma**.

### Server-Side Pagination
**O que é:** Dividir os resultados em páginas (Página 1, 2, 3...) direto no servidor.
**Por que:** Se tivermos 1 milhão de registros, não podemos enviar tudo para o navegador de uma vez (ia travar tudo). O servidor manda só os 10 primeiros, depois os próximos 10, e assim por diante.

### Race Condition (Condição de Corrida)
**O que é:** Um bug que acontece quando dois processos tentam mudar o mesmo dado ao mesmo tempo e o resultado depende da sorte de quem chega primeiro.
**Solução:** Usar Transações (`prisma.$transaction`).

### Seed
**O que é:** Dados iniciais ou de teste que colocamos no banco para não começar com ele vazio.

### Transaction (Transação)
**O que é:** Um grupo de operações que devem acontecer todas juntas. Se uma falhar, todas são canceladas (Rollback).
**Exemplo:** Transferência bancária. Se tirar dinheiro da minha conta mas der erro ao colocar na sua, o dinheiro tem que voltar pra mim.

### Singleton
**O que é:** Um padrão de código que garante que uma classe tenha apenas **uma** instância rodando no sistema todo.
**No nosso projeto:** Usamos no `lib/prisma.ts` para não abrir mil conexões com o banco de dados à toa.

---

## 🛡️ Segurança & Autenticação

### Authentication (Autenticação) vs Authorization (Autorização)
- **Autenticação:** "Quem é você?" (Login/Senha)
- **Autorização:** "O que você pode fazer?" (Permissões/Roles)

### Hashing
**O que é:** Transformar uma senha (ex: "123456") em uma sopa de letrinhas irreversível (ex: `$2a$12$R9h...`).
**Por que:** Se o banco for hackeado, os hackers não descobrem as senhas reais dos usuários.

### JWT (JSON Web Token)
**O que é:** Um "crachá digital" criptografado que o usuário carrega. Ele diz quem o usuário é e até quando o login vale. O servidor lê esse crachá para saber se deixa o usuário entrar.

### Middleware
**O que é:** Um "porteiro" que intercepta a requisição antes dela chegar na página.
**Uso:** Verificar se o usuário está logado antes de deixar ele ver o Dashboard.

### RBAC (Role-Based Access Control)
**O que é:** Controle de acesso baseado em cargos.
**Exemplo:** ADMIN pode tudo, VOLUNTEER só pode ver, COORDINATOR pode editar.

### Salt
**O que é:** Dados aleatórios adicionados à senha antes de fazer o Hash. Serve para garantir que duas pessoas com a senha "123456" tenham Hashes diferentes no banco.

### Adapter
**O que é:** Uma "ponte" que conecta duas peças que não se encaixam nativamente.
**No nosso projeto:** O `PrismaAdapter` conecta o **NextAuth** (que não sabe qual banco usamos) com o **Prisma** (que sabe falar com o Postgres).

### Callback
**O que é:** Uma função que é passada como argumento para outra função e é "chamada de volta" (called back) quando algo acontece.
**No Login:** O "Callback URL" é para onde o usuário é redirecionado depois que o Google/Email diz "Sim, a senha está certa".

---

## ⚡ Next.js Específico

### Dynamic Route (Rota Dinâmica)
**O que é:** Uma página que serve para vários itens diferentes.
**Sintaxe:** `[id]/page.tsx`.
**Exemplo:** `/beneficiaries/123`, `/beneficiaries/456`. O mesmo arquivo cuida de todos.

### Layout
**O que é:** Uma "moldura" que se repete em várias páginas.
**Uso:** A barra lateral e o cabeçalho do Dashboard ficam no `layout.tsx`, então não precisamos copiá-los em cada página.

### Server Action
**O que é:** Funções que parecem JavaScript normal, mas rodam no servidor. Substituem a necessidade de criar APIs manuais para enviar formulários.

### RevalidatePath
**O que é:** Um comando para "limpar o cache". Diz ao Next.js: "Os dados mudaram, por favor, reconstrua essa página com as informações novas na próxima vez que alguém acessar".

### Search Params (URL Query Parameters)
**O que é:** Aquela parte da URL depois do `?` (ex: `?search=maria&page=1`).
**Uso:** Usamos para guardar o estado dos filtros. Assim, se você recarregar a página, a busca continua lá. Também permite compartilhar o link com o filtro aplicado.

### Route Handler (`route.ts`)
**O que é:** O jeito do Next.js criar endpoints de API tradicionais.
**Uso:** Usamos pouco (preferimos Server Actions), mas é obrigatório para o **NextAuth** funcionar (`app/api/auth/[...nextauth]/route.ts`).

### Slug
**O que é:** A parte de uma URL que identifica uma página de forma legível.
**Exemplo:** Em `meusite.com/blog/como-aprender-react`, o slug é `como-aprender-react`. É melhor que usar IDs (`/blog/123`).

---

## 📦 Ferramentas & Bibliotecas

### Lucide React
**O que é:** A biblioteca de ícones que usamos (ex: 🏠, 👤, ⚙️).

### React Hook Form
**O que é:** Biblioteca para gerenciar formulários complexos sem fazer o React ficar lento.

### Shadcn UI
**O que é:** Uma coleção de componentes bonitos (Botões, Inputs, Cards) que copiamos para o nosso projeto. Não é uma biblioteca que você instala, é código que você possui.

### Zod
**O que é:** Biblioteca de validação.
**Para que serve:** Garante que o CPF tem 11 dígitos, que o email é válido, etc. É o "segurança" dos dados.
