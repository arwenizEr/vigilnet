import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Only initialize Prisma if DATABASE_URL is set
const prismaClient = process.env.DATABASE_URL
  ? new PrismaClient()
  : null

export const prisma = globalForPrisma.prisma ?? prismaClient

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma
}

