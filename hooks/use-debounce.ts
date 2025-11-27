import { useEffect, useState } from 'react';

// 🧠 CUSTOM HOOK: useDebounce
// Serve para atrasar a atualização de um valor.
// Muito útil para inputs de busca: evita fazer uma requisição a cada letra digitada.
// Ex: "M" -> "Ma" -> "Mar" -> "Maria" (Só busca "Maria" depois de 500ms)
export function useDebounce<T>(value: T, delay: number): T {
    // 1. Guardamos o valor "atrasado" no estado local
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // 2. Criamos um timer para atualizar o valor depois de X milissegundos
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // 3. CLEANUP: Se o valor mudar antes do tempo acabar (o usuário digitou mais uma letra),
        // cancelamos o timer anterior e começamos um novo.
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Só roda quando o valor ou o delay mudam

    return debouncedValue;
}
