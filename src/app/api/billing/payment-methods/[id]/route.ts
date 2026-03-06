import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { removePaymentMethod } from "@/lib/billing/payment-service";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const result = await removePaymentMethod(session.user.id, id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error removing payment method:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
