# Próximos Passos: Guia Detalhado Rumo à Produção

Este documento detalha tecnicamente como transformar este boilerplate em um sistema robusto e pronto para o cliente final.

## 1. Banco de Dados: Migração para PostgreSQL (CONCLUÍDO ✅)

O sistema já foi migrado com sucesso para PostgreSQL (NeonDB), com um schema robusto e normalizado.

### O que foi feito:
- **Schema Otimizado**: Uso de Enums, Relações e Índices apropriados.
- **Seeding**: Script `prisma/seed.ts` criado para popular o banco com dados de teste realistas.
- **Normalização**: Separação de Endereços, Beneficiários e Distribuições.

### Próximos Ajustes (Opcional):
- **Backup Automático**: Configurar rotina de backup no provedor (Neon/Vercel).
- **Monitoramento**: Acompanhar performance das queries via Prisma Studio ou painel do provedor.

## 2. Autenticação e Segurança Avançada

### Gerar Segredo Forte
Para produção, nunca use senhas fracas. Gere um segredo para o `AUTH_SECRET`:
```bash
openssl rand -base64 32
# Copie a saída para o seu .env
```

### Implementar Recuperação de Senha ("Esqueci minha senha")
O boilerplate atual não tem isso.
1.  **Serviço de Email**: Crie uma conta no [Resend](https://resend.com/) (gratuito para começar).
2.  **Token**: Crie um modelo `PasswordResetToken` no Prisma com `email`, `token` (uuid) e `expires`.
3.  **Fluxo**:
    - Usuário digita email -> Server Action gera token e salva no banco.
    - Envia email com link: `https://app.com/reset-password?token=xyz`.
    - Página de Reset verifica token -> Permite mudar senha -> Atualiza User -> Deleta Token.

### Controle de Acesso (RBAC)
Proteja rotas críticas. Exemplo em uma Server Action:
```typescript
import { auth } from "@/auth";

export async function deleteUser(userId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Não autorizado. Apenas administradores podem deletar usuários.");
  }
  // ... lógica de deletar
}
```

## 3. Melhorias de Funcionalidades

### Validação de CPF/CNPJ
Use a biblioteca `cpf-cnpj-validator` integrada ao Zod para impedir documentos falsos.
```bash
npm install cpf-cnpj-validator
```
No seu schema Zod (`actions/beneficiary.ts`):
```typescript
import { cpf } from 'cpf-cnpj-validator';

const BeneficiarySchema = z.object({
  documentId: z.string().refine((val) => cpf.isValid(val), {
    message: "CPF inválido",
  }),
  // ...
});
```

### Upload de Arquivos
Para fotos de perfil ou comprovantes de doação.
1.  Use [UploadThing](https://uploadthing.com/) (fácil integração com Next.js).
2.  Crie um campo `imageUrl` ou `attachmentUrl` no seu Schema Prisma.
3.  Adicione o componente de botão de upload no formulário.

### Relatórios e Exportação
O cliente vai querer baixar os dados.
1.  Crie uma rota API ou Server Action que busca os dados.
2.  Use a biblioteca `csv-stringify` para gerar um CSV.
3.  No frontend, crie um botão "Exportar Relatório" que baixa esse arquivo.

## 4. Interface e UX (Experiência do Usuário)

### Internacionalização (CONCLUÍDO ✅)
A interface foi totalmente traduzida para Português (Brasil).

### Melhorias Pendentes:

### Feedback Visual (Toasts)
O usuário precisa saber se deu certo. Instale `sonner` (já usado pelo shadcn/ui).
No seu formulário (Client Component):
```typescript
import { toast } from "sonner";

// ... dentro do onSubmit
const result = await createBeneficiary(data);
if (result.success) {
  toast.success("Beneficiário criado com sucesso!");
} else {
  toast.error("Erro ao criar: " + result.error);
}
```

### Paginação
Listar 1000 beneficiários vai travar a página.
1.  No Prisma, use `skip` e `take`:
    ```typescript
    const PAGE_SIZE = 10;
    const beneficiaries = await prisma.beneficiary.findMany({
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });
    ```
2.  Na UI, adicione botões "Anterior" e "Próximo" que alteram o parâmetro `?page=2` na URL.

## 5. Testes Automatizados

Não entregue sem testar. Use **Playwright** para testes ponta-a-ponta (E2E).
1.  Instalar: `npm init playwright@latest`
2.  Criar teste de login (`tests/login.spec.ts`):
    ```typescript
    test('deve fazer login com sucesso', async ({ page }) => {
      await page.goto('/login');
      await page.fill('input[name="email"]', 'admin@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL('/dashboard');
    });
    ```

## 6. Implantação (Deployment) na Vercel

1.  **Repositório**: Garanta que seu código está no GitHub.
2.  **Vercel**: Importe o projeto.
3.  **Build Command**: O padrão `next build` funciona.
4.  **Variáveis**: Configure `DATABASE_URL` e `AUTH_SECRET` nas configurações do projeto na Vercel.
5.  **Domínio**: Em "Settings > Domains", adicione o domínio do cliente (ex: `ong-esperanca.com.br`). A Vercel gerencia o certificado SSL (HTTPS) automaticamente.

## 7. Manutenção e Monitoramento

- **Sentry**: Instale o Sentry para receber alertas por email quando ocorrer um erro no sistema do usuário.
  ```bash
  npx @sentry/wizard@latest -i nextjs
  ```
- **Backups**: Se usar Supabase ou Neon, ative os backups automáticos diários (Point-in-time recovery).

## 8. Refatoração Educacional (CONCLUÍDO ✅)

O projeto foi transformado em um recurso educacional com:
- **Comentários Didáticos**: Explicações detalhadas em `pt_BR` com emojis (🧠, 🛡️, ⚡).
- **Documentação Expandida**: `DICIONARIO_TECNICO.md` e `ENTENDENDO_A_ARQUITETURA.md` detalhados.
- **Walkthrough**: Guia de estudo em `WALKTHROUGH.md`.

## 9. Módulos Adicionais (CONCLUÍDO ✅)

- **Formulários Digitais**: Avaliação Social e Autorização de Imagem implementados.
- **Geração de PDF**: Documentos gerados dinamicamente no frontend.
