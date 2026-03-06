import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { db } = await import("@/lib/db");

    // Test database connection with a simple query
    await db.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "ok",
      timestamp: Date.now(),
    });
  } catch {
    return NextResponse.json(
      {
        status: "error",
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}
