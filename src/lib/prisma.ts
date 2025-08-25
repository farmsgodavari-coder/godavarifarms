import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ["error", "warn"],
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

// Best-effort DB connectivity check to aid local debugging
// Runs only once per process start.
(async () => {
  try {
    await prisma.$connect();
    // eslint-disable-next-line no-console
    console.log("[Prisma] Connected to database");
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error("[Prisma] Failed to connect to database. Check DATABASE_URL and Docker.", e?.message || e);
  }
})();
