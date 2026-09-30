/**
 * Prisma Client Singleton
 *
 * Optimizado para desarrollo y producción:
 * - En desarrollo: Evita múltiples instancias por hot-reload
 * - En producción: Una sola instancia compartida
 * - Compatible con Vercel Serverless Functions
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
