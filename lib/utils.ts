// ⬅️ ORIGEM: clsx (Utilitário para classes condicionais)
import { clsx, type ClassValue } from "clsx"
// ⬅️ ORIGEM: tailwind-merge (Resolve conflitos de classes Tailwind)
import { twMerge } from "tailwind-merge"

// ➡️ DESTINO: Usado globalmente em componentes UI (/components/ui/)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
