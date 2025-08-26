/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
// Simple JS seed to avoid ts-node dependency
const fs = require("node:fs");
const path = require("node:path");

// Load env: prefer .env.local, fallback to .env
const projectRoot = process.cwd();
const envLocal = path.join(projectRoot, ".env.local");
const envDefault = path.join(projectRoot, ".env");
(function ensureDatabaseUrl() {
  try {
    if (!process.env.DATABASE_URL) {
      const chosen = fs.existsSync(envLocal) ? envLocal : envDefault;
      // Try Node's built-in loader if available
      if (typeof process.loadEnvFile === "function") {
        process.loadEnvFile(chosen, { override: false });
      }
      // If still not set, parse file manually
      if (!process.env.DATABASE_URL && fs.existsSync(chosen)) {
        const text = fs.readFileSync(chosen, "utf8");
        for (const line of text.split(/\r?\n/)) {
          const m = line.match(/^\s*DATABASE_URL\s*=\s*(.*)\s*$/);
          if (m) {
            let v = m[1].trim();
            if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
              v = v.slice(1, -1);
            }
            if (!process.env.DATABASE_URL) process.env.DATABASE_URL = v;
            break;
          }
        }
      }
    }
  } catch {}
})();

const { PrismaClient, Packing, Quality, Size } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const mh = await prisma.state.upsert({
    where: { name: "Maharashtra" },
    update: {},
    create: { name: "Maharashtra" },
  });
  const gj = await prisma.state.upsert({
    where: { name: "Gujarat" },
    update: {},
    create: { name: "Gujarat" },
  });

  const lasalgaon = await prisma.mandi.upsert({
    where: { name_stateId: { name: "Lasalgaon", stateId: mh.id } },
    update: {},
    create: { name: "Lasalgaon", stateId: mh.id },
  });

  const rajkot = await prisma.mandi.upsert({
    where: { name_stateId: { name: "Rajkot", stateId: gj.id } },
    update: {},
    create: { name: "Rajkot", stateId: gj.id },
  });

  const today = new Date();
  const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  await prisma.dailyPrice.upsert({
    where: {
      date_stateId_mandiId_size_quality_packing: {
        date: dateOnly,
        stateId: mh.id,
        mandiId: lasalgaon.id,
        size: Size.MEDIUM,
        quality: Quality.MEDIUM,
        packing: Packing.BAG,
      },
    },
    update: {
      minPrice: 1200,
      avgPrice: 1500,
      maxPrice: 1800,
    },
    create: {
      date: dateOnly,
      stateId: mh.id,
      mandiId: lasalgaon.id,
      size: Size.MEDIUM,
      quality: Quality.MEDIUM,
      packing: Packing.BAG,
      minPrice: 1200,
      avgPrice: 1500,
      maxPrice: 1800,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
