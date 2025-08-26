import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "prisma/config";

// Resolve env file: prefer .env.local if present, else fallback to .env
const projectRoot = process.cwd();
const envLocalPath = path.join(projectRoot, ".env.local");
const envPath = fs.existsSync(envLocalPath)
  ? envLocalPath
  : path.join(projectRoot, ".env");

// Load env vars for Prisma CLI. Use override:true so .env.local wins over any shell value.
// @ts-ignore - available in Prisma runtime
process.loadEnvFile?.(envPath, { override: true });

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  // migrations: { path: path.join("prisma", "migrations") }, // default is prisma/migrations
});
