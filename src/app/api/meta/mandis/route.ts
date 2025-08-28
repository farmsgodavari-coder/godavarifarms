import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Fallback data for when database is unavailable
const FALLBACK_MANDIS = [
  { id: 1, name: "Nashik", stateId: 3 },
  { id: 2, name: "Pune", stateId: 3 },
  { id: 3, name: "Mumbai", stateId: 3 },
  { id: 4, name: "Bangalore", stateId: 2 },
  { id: 5, name: "Hyderabad", stateId: 5 },
  { id: 6, name: "Chennai", stateId: 4 },
  { id: 7, name: "Vijayawada", stateId: 1 },
  { id: 8, name: "Ahmedabad", stateId: 6 },
  { id: 9, name: "Jaipur", stateId: 7 },
  { id: 10, name: "Indore", stateId: 8 }
];

// Enhanced retry mechanism
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on certain errors
      if (error?.code === "P2025" || error?.code === "P2002") {
        throw error;
      }
      
      // Exponential backoff for connection issues
      if (attempt < maxRetries && (error?.code === "P2024" || error?.code === "P1001")) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError;
}

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(req.url);
    const stateId = searchParams.get("stateId");

    const where = stateId ? { stateId: Number(stateId) } : {};

    const mandis = await withRetry(() => prisma.mandi.findMany({
      where,
      select: { id: true, name: true, stateId: true },
      orderBy: { name: "asc" },
    }));

    const responseTime = Date.now() - startTime;

    const response = NextResponse.json({
      success: true,
      data: mandis,
      metadata: {
        source: "database",
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
        count: mandis.length,
        stateId: stateId ? Number(stateId) : null
      }
    });

    response.headers.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    response.headers.set("X-Response-Time", `${responseTime}ms`);
    
    return response;

  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    console.error("/api/meta/mandis error:", {
      message: error?.message,
      code: error?.code,
      stack: process.env.NODE_ENV === "development" ? error?.stack : undefined,
      timestamp: new Date().toISOString()
    });

    // Return fallback data when database is unavailable
    if (error?.code === "P2024" || error?.code === "P1001" || error?.message?.includes("Can't reach database")) {
      console.warn("Database unavailable, returning fallback mandis data");
      
      const { searchParams } = new URL(req.url);
      const stateId = searchParams.get("stateId");
      const filteredMandis = stateId 
        ? FALLBACK_MANDIS.filter(m => m.stateId === Number(stateId))
        : FALLBACK_MANDIS;
      
      const response = NextResponse.json({
        success: true,
        data: filteredMandis,
        metadata: {
          source: "fallback",
          responseTime: `${responseTime}ms`,
          timestamp: new Date().toISOString(),
          count: filteredMandis.length,
          stateId: stateId ? Number(stateId) : null,
          warning: "Database unavailable, using fallback data"
        }
      });

      response.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
      response.headers.set("X-Response-Time", `${responseTime}ms`);
      response.headers.set("X-Data-Source", "fallback");
      
      return response;
    }

    // For other errors, return proper error response
    const errorResponse = {
      success: false,
      error: "Failed to fetch mandis",
      code: error?.code || "UNKNOWN_ERROR",
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      ...(process.env.NODE_ENV === "development" && {
        details: error?.message,
        stack: error?.stack
      })
    };

    return NextResponse.json(errorResponse, { 
      status: 500,
      headers: {
        "X-Response-Time": `${responseTime}ms`
      }
    });
  }
}
