import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Fallback data for when database is unavailable
const FALLBACK_STATES = [
  { id: 1, name: "Andhra Pradesh" },
  { id: 2, name: "Karnataka" },
  { id: 3, name: "Maharashtra" },
  { id: 4, name: "Tamil Nadu" },
  { id: 5, name: "Telangana" },
  { id: 6, name: "Gujarat" },
  { id: 7, name: "Rajasthan" },
  { id: 8, name: "Madhya Pradesh" },
  { id: 9, name: "Uttar Pradesh" },
  { id: 10, name: "Bihar" }
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

export async function GET() {
  const startTime = Date.now();
  
  try {
    const states = await withRetry(() => prisma.state.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }));

    const responseTime = Date.now() - startTime;

    const response = NextResponse.json({
      success: true,
      data: states,
      metadata: {
        source: "database",
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
        count: states.length
      }
    });

    response.headers.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    response.headers.set("X-Response-Time", `${responseTime}ms`);
    
    return response;

  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    console.error("/api/meta/states error:", {
      message: error?.message,
      code: error?.code,
      stack: process.env.NODE_ENV === "development" ? error?.stack : undefined,
      timestamp: new Date().toISOString()
    });

    // Return fallback data when database is unavailable
    if (error?.code === "P2024" || error?.code === "P1001" || error?.message?.includes("Can't reach database")) {
      console.warn("Database unavailable, returning fallback states data");
      
      const response = NextResponse.json({
        success: true,
        data: FALLBACK_STATES,
        metadata: {
          source: "fallback",
          responseTime: `${responseTime}ms`,
          timestamp: new Date().toISOString(),
          count: FALLBACK_STATES.length,
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
      error: "Failed to fetch states",
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
