"use client";

import { useFormState, useFormStatus } from "react-dom";
import { authenticate } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
    const [errorMessage, dispatch] = useFormState(authenticate, undefined);

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
                    minLength={6}
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
    const { pending } = useFormStatus();

    return (
        <Button className="w-full" aria-disabled={pending}>
            Entrar
        </Button>
    );
}
