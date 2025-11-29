import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// 🛡️ MIDDLEWARE: O Porteiro do Sistema
// Este arquivo é o primeiro a ser executado em cada requisição.
// Ele usa a configuração do NextAuth para verificar se o usuário pode acessar a rota.
export default NextAuth(authConfig).auth;

export const config = {
    // 🧠 MATCHER: Define quais rotas o middleware deve "vigiar".
    // A expressão regular abaixo diz: "Vigie tudo, MENOS api, arquivos estáticos e imagens".
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
