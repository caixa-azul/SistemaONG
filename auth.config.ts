import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login", // ⚡ Redireciona para nossa página de login customizada se precisar autenticar.
    },
    callbacks: {
        // 🛡️ AUTHORIZED: O "Porteiro" (Middleware).
        // Roda em TODA requisição para decidir se o usuário pode ver a página.
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnLogin = nextUrl.pathname.startsWith("/login");
            const isPublicApi = nextUrl.pathname.startsWith("/api/auth");

            // 1. Rotas Públicas (Login e API de Auth)
            // Se o usuário tentar acessar login ou API, deixamos passar.
            if (isOnLogin || isPublicApi) {
                // Mas se ele JÁ estiver logado e tentar ir pro login, mandamos pro início.
                if (isLoggedIn && isOnLogin) {
                    return Response.redirect(new URL("/", nextUrl));
                }
                return true;
            }

            // 2. Rotas Protegidas (Todo o resto)
            // Se não estiver logado, bloqueia o acesso (o NextAuth redireciona pro login auto).
            if (!isLoggedIn) {
                return false;
            }

            return true;
        },

        // 🧠 JWT (JSON Web Token): Ocorre quando o Token é criado ou atualizado.
        // O token é o "crachá" criptografado que fica no cookie do usuário.
        // Aqui copiamos dados importantes do Usuário (banco) para o Token.
        jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },

        // 🧠 SESSION: Ocorre quando o frontend pede a sessão (useSession).
        // A sessão é o objeto que o React consegue ler.
        // Aqui copiamos dados do Token (crachá) para a Sessão (React).
        session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (token.role && session.user) {
                session.user.role = token.role as any;
            }
            return session;
        },
    },
    providers: [], // Configurado no auth.ts para evitar problemas de importação circular.
} satisfies NextAuthConfig;
