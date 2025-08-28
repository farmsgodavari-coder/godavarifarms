import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

// Enhanced retry mechanism with exponential backoff
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

// Input validation helper
function validateQueryParams(searchParams: URLSearchParams) {
  const errors: string[] = [];
  
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");
  const sizeMin = searchParams.get("sizeMin");
  const sizeMax = searchParams.get("sizeMax");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  
  if (page && (isNaN(Number(page)) || Number(page) < 1)) {
    errors.push("Page must be a positive integer");
  }
  
  if (pageSize && (isNaN(Number(pageSize)) || Number(pageSize) < 1 || Number(pageSize) > 100)) {
    errors.push("Page size must be between 1 and 100");
  }
  
  if (sizeMin && isNaN(Number(sizeMin))) {
    errors.push("Size minimum must be a valid number");
  }
  
  if (sizeMax && isNaN(Number(sizeMax))) {
    errors.push("Size maximum must be a valid number");
  }
  
  if (dateFrom && isNaN(Date.parse(dateFrom))) {
    errors.push("Date from must be a valid date");
  }
  
  if (dateTo && isNaN(Date.parse(dateTo))) {
    errors.push("Date to must be a valid date");
  }
  
  return errors;
}

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(req.url);
    
    // Validate input parameters
    const validationErrors = validateQueryParams(searchParams);
    if (validationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        error: "Invalid parameters",
        details: validationErrors,
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }
    
    // Extract and validate parameters
    const rateType = searchParams.get("rateType") as "DOMESTIC" | "EXPORT" | null;
    const country = searchParams.get("country");
    const stateId = searchParams.get("stateId");
    const mandiId = searchParams.get("mandiId");
    const quality = searchParams.get("quality") as "LOW" | "MEDIUM" | "HIGH" | null;
    const packing = searchParams.get("packing") as "LOOSE" | "BAG" | "BOX" | null;
    const sizeMin = searchParams.get("sizeMin");
    const sizeMax = searchParams.get("sizeMax");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const sortBy = searchParams.get("sortBy") || "date";
    const sortOrder = searchParams.get("sortOrder") as "asc" | "desc" || "desc";

    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const pageSize = Math.min(100, Number(searchParams.get("pageSize") || 20));
    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: any = {};
    if (rateType) where.rateType = rateType;
    if (country) where.country = { contains: country, mode: 'insensitive' };
    if (stateId) where.stateId = Number(stateId);
    if (mandiId) where.mandiId = Number(mandiId);
    if (quality) where.quality = quality;
    if (packing) where.packing = packing;

    if (sizeMin || sizeMax) {
      where.sizeMm = {} as any;
      if (sizeMin) where.sizeMm.gte = Number(sizeMin);
      if (sizeMax) where.sizeMm.lte = Number(sizeMax);
    }

    if (dateFrom || dateTo) {
      where.date = {} as any;
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }

    // Build order by clause
    const orderBy: any = {};
    if (sortBy === "price") {
      orderBy.pricePerKg = sortOrder;
    } else if (sortBy === "state") {
      orderBy.state = { name: sortOrder };
    } else if (sortBy === "mandi") {
      orderBy.mandi = { name: sortOrder };
    } else {
      orderBy.date = sortOrder;
    }

    // Fetch data with enhanced error handling
    const [items, total] = await Promise.all([
      withRetry(() => prisma.onionRate.findMany({
        where,
        orderBy,
        include: {
          state: { select: { id: true, name: true } },
          mandi: { select: { id: true, name: true } },
        },
        skip,
        take: pageSize,
      })),
      withRetry(() => prisma.onionRate.count({ where }))
    ]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    // Calculate statistics
    const stats = items.length > 0 ? {
      avgPrice: Number((items.reduce((sum, item) => sum + Number(item.pricePerKg), 0) / items.length).toFixed(2)),
      minPrice: Math.min(...items.map(item => Number(item.pricePerKg))),
      maxPrice: Math.max(...items.map(item => Number(item.pricePerKg))),
      totalRecords: total
    } : null;

    // Get last updated timestamp
    const lastUpdated = items.reduce<Date | null>((acc, item: any) => {
      const d = item?.updatedAt as Date | undefined;
      return d && (!acc || d > acc) ? d : acc;
    }, null);

    const responseTime = Date.now() - startTime;

    const response = NextResponse.json({
      success: true,
      data: items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      },
      stats,
      metadata: {
        lastUpdated: lastUpdated?.toISOString() || null,
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
        filters: {
          rateType,
          country,
          stateId: stateId ? Number(stateId) : null,
          mandiId: mandiId ? Number(mandiId) : null,
          quality,
          packing,
          sizeRange: sizeMin || sizeMax ? { min: sizeMin ? Number(sizeMin) : null, max: sizeMax ? Number(sizeMax) : null } : null,
          dateRange: dateFrom || dateTo ? { from: dateFrom, to: dateTo } : null
        }
      }
    });

    // Set appropriate cache headers
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("X-Response-Time", `${responseTime}ms`);
    
    return response;

  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    console.error("/api/rates error:", {
      message: error?.message,
      code: error?.code,
      stack: process.env.NODE_ENV === "development" ? error?.stack : undefined,
      timestamp: new Date().toISOString()
    });

    // Determine error type and appropriate response
    let statusCode = 500;
    let errorMessage = "Internal server error";
    
    if (error?.code === "P2024" || error?.code === "P1001") {
      statusCode = 503;
      errorMessage = "Database connection unavailable";
    } else if (error?.code === "P2025") {
      statusCode = 404;
      errorMessage = "Resource not found";
    }

    const errorResponse = {
      success: false,
      error: errorMessage,
      code: error?.code || "UNKNOWN_ERROR",
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      ...(process.env.NODE_ENV === "development" && {
        details: error?.message,
        stack: error?.stack
      })
    };

    return NextResponse.json(errorResponse, { 
      status: statusCode,
      headers: {
        "X-Response-Time": `${responseTime}ms`
      }
    });
  }
}
