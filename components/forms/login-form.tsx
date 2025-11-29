"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { authenticate } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
    // ⚡ USE ACTION STATE: Hook do React 19 para conectar com Server Actions.
    // Substitui o antigo `useFormState`.
    // `errorMessage`: O retorno da função `authenticate` (se houver erro).
    // `dispatch`: A função que chamamos no `action` do formulário.
    // `isPending`: Booleano que indica se a ação está em andamento (opcional, mas útil).
    const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);

    return (
        <form action={dispatch} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                    E-mail
                </label>
                <Input
                    className="mt-1"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Digite seu e-mail"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                    Senha
                </label>
                <Input
                    className="mt-1"
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Digite sua senha"
                    required
                    minLength={5}
                />
            </div>
            <LoginButton />
            <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
            >
                {errorMessage && (
                    <p className="text-sm text-red-500">{errorMessage}</p>
                )}
            </div>
        </form>
    );
}

function LoginButton() {
    // ⚡ USE FORM STATUS: Hook que sabe se o formulário pai está enviando dados.
    // Usamos isso para desabilitar o botão e evitar duplo clique.
    const { pending } = useFormStatus();

    return (
        <Button className="w-full" aria-disabled={pending} disabled={pending}>
            {pending ? "Entrando..." : "Entrar"}
        </Button>
    );
}
