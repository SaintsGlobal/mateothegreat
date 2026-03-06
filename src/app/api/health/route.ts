import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();

  try {
    const { db } = await import("@/lib/db");

    // Test database connection with a simple query
    await db.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "ok",
      timestamp: startTime,
      latency: Date.now() - startTime,
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        timestamp: startTime,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
