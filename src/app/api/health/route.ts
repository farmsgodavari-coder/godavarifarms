import { NextResponse } from "next/server";
import { checkDatabaseConnection } from "@/lib/database-setup";

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Check database connection
    const dbStatus = await checkDatabaseConnection();
    
    // Check environment variables
    const envCheck = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      ADMIN_USERNAME: !!process.env.ADMIN_USERNAME,
      ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
    };
    
    const responseTime = Date.now() - startTime;
    
    const healthStatus = {
      status: dbStatus.connected ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      database: {
        connected: dbStatus.connected,
        message: dbStatus.message,
        stats: dbStatus.stats || null,
        error: dbStatus.error || null
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        variables: envCheck
      },
      services: {
        api: true,
        database: dbStatus.connected
      }
    };
    
    return NextResponse.json(healthStatus, {
      status: dbStatus.connected ? 200 : 503,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Response-Time": `${responseTime}ms`
      }
    });
    
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: "error",
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      error: error.message
    }, { 
      status: 500,
      headers: {
        "X-Response-Time": `${responseTime}ms`
      }
    });
  }
}
