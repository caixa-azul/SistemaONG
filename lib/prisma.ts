// ⬅️ ORIGEM: @prisma/client (Cliente gerado automaticamente)
import { PrismaClient } from "@prisma/client";

// 🧠 SINGLETON PATTERN:
// O Next.js em desenvolvimento recarrega os arquivos muitas vezes (Hot Reload).
// Se criássemos `new PrismaClient()` toda vez, teríamos milhares de conexões abertas com o banco,
// o que travaria o sistema ("Too many connections").
//
// Esta lógica garante que, em desenvolvimento, reutilizamos a MESMA conexão sempre.

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// ➡️ DESTINO: Usado globalmente por todas as Server Actions em /actions/
export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ["query"], // ⚡ LOG: Mostra as queries SQL no terminal (útil para debug).
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
