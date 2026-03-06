import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { listInvoices } from "@/lib/billing/invoice-service";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page");
    const pageSize = searchParams.get("pageSize");

    const result = await listInvoices(session.user.id, {
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      { invoices: result.invoices, pagination: result.pagination },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error listing invoices:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
