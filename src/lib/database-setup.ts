import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface DatabaseStatus {
  connected: boolean;
  message: string;
  stats?: {
    states: number;
    mandis: number;
    rates: number;
    announcements: number;
  };
  error?: string;
}

export async function checkDatabaseConnection(): Promise<DatabaseStatus> {
  try {
    // Test basic connection
    await prisma.$connect();
    
    // Verify tables exist and get counts
    const [states, mandis, rates, announcements] = await Promise.all([
      prisma.state.count(),
      prisma.mandi.count(), 
      prisma.onionRate.count(),
      prisma.announcement.count()
    ]);

    return {
      connected: true,
      message: "Database connected successfully",
      stats: { states, mandis, rates, announcements }
    };

  } catch (error: any) {
    console.error("Database connection failed:", error);
    
    return {
      connected: false,
      message: getDatabaseErrorMessage(error),
      error: error.message
    };
  } finally {
    await prisma.$disconnect();
  }
}

export async function setupDatabase(): Promise<void> {
  try {
    console.log("🔄 Setting up database...");
    
    // Run migrations
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    await execAsync('npx prisma migrate deploy');
    console.log("✅ Database migrations completed");
    
    // Check if data exists, if not seed
    const stateCount = await prisma.state.count();
    if (stateCount === 0) {
      console.log("🌱 Seeding database with initial data...");
      await execAsync('npx prisma db seed');
      console.log("✅ Database seeding completed");
    }
    
  } catch (error: any) {
    console.error("❌ Database setup failed:", error);
    throw error;
  }
}

function getDatabaseErrorMessage(error: any): string {
  if (error.code === "P1001") {
    return "Cannot reach database server. Please check if PostgreSQL is running.";
  }
  if (error.code === "P2024") {
    return "Connection timeout. Database server may be overloaded.";
  }
  if (error.message?.includes("ECONNREFUSED")) {
    return "Connection refused. Database server is not accepting connections.";
  }
  if (error.message?.includes("authentication failed")) {
    return "Authentication failed. Check database credentials.";
  }
  return `Database error: ${error.message}`;
}

export async function testAllAPIs(): Promise<Record<string, boolean>> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const results: Record<string, boolean> = {};
  
  const endpoints = [
    "/api/health",
    "/api/rates",
    "/api/meta/states",
    "/api/meta/mandis",
    "/api/public/settings",
    "/api/public/announcements"
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`);
      results[endpoint] = response.ok;
    } catch (error) {
      results[endpoint] = false;
    }
  }

  return results;
}
