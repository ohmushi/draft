import { PrismaClient } from './generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

// Lazy: client is created on first call, not at module import time.
// This avoids errors during Next.js build when DATABASE_URL is unavailable.
export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) throw new Error('DATABASE_URL is not set')
    const adapter = new PrismaPg({ connectionString })
    globalForPrisma.prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0])
  }
  return globalForPrisma.prisma
}