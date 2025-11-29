import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    // 🧠 ADAPTER: Conecta o NextAuth ao nosso banco de dados Prisma.
    // Isso permite salvar sessões e usuários automaticamente no PostgreSQL.
    adapter: PrismaAdapter(prisma) as any,

    // ⚡ STRATEGY: Usamos JWT (JSON Web Token) para sessão.
    // É mais eficiente que salvar sessão no banco para cada request.
    session: { strategy: "jwt" },

    providers: [
        // 🧠 CREDENTIALS PROVIDER: Permite login com Email e Senha.
        // Diferente de Google/Facebook, aqui nós mesmos gerenciamos a segurança.
        Credentials({
            async authorize(credentials) {
                // 🛡️ ZOD VALIDATION: Antes de qualquer coisa, validamos se o input é seguro.
                // Isso previne injeção de código e erros bobos.
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(5) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;

                    // 🧠 PRISMA: Buscamos o usuário no banco.
                    const user = await prisma.user.findUnique({ where: { email } });
                    if (!user) return null;

                    // 🛡️ SECURITY CHECK:
                    // 1. Usuário existe?
                    // 2. Tem senha cadastrada? (Usuários OAuth podem não ter)
                    if (!user.password) return null;

                    // 🛡️ BCRYPT: Comparamos a senha digitada com o HASH salvo no banco.
                    // Nunca comparamos strings puras (ex: "123" === "123") por segurança.
                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (passwordsMatch) return user as any;
                }

                console.log("Invalid credentials");
                return null;
            },
        }),
    ],
});
