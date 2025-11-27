"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

// 🧠 SERVER ACTION: Autenticação
// Esta função é chamada pelo formulário de login.
export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        // ⚡ SIGN IN: Chama a função do NextAuth para iniciar a sessão.
        // O "credentials" refere-se ao provider que configuramos no auth.ts.
        await signIn("credentials", formData);
    } catch (error) {
        // 🧠 ERROR HANDLING: O NextAuth lança erros específicos que podemos tratar.
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid credentials.";
                default:
                    return "Something went wrong.";
            }
        }
        // ⚡ RE-THROW: Se o erro não for de autenticação (ex: redirecionamento),
        // precisamos lançá-lo novamente para o Next.js lidar (ex: redirecionar para dashboard).
        throw error;
    }
}
