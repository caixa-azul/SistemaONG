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
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

            if (isOnDashboard) {
                // Se está tentando acessar o Dashboard...
                if (isLoggedIn) return true; // Deixa passar se estiver logado.
                return false; // 🚫 Bloqueia e manda pro login se não estiver.
            } else if (isLoggedIn) {
                // Se já está logado e tenta acessar o Login...
                if (nextUrl.pathname === "/login") {
                    return Response.redirect(new URL("/dashboard", nextUrl)); // Manda pro Dashboard.
                }
            }
            return true; // Outras páginas (públicas) são liberadas.
        },

        // 🧠 JWT: Ocorre quando o Token é criado ou atualizado.
        // Aqui copiamos dados importantes do Usuário para o Token.
        jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },

        // 🧠 SESSION: Ocorre quando o frontend pede a sessão (useSession).
        // Aqui copiamos dados do Token para a Sessão que o React vai usar.
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
