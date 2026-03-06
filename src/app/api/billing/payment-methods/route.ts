import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  addPaymentMethod,
  listPaymentMethods,
  type AddPaymentMethodInput,
} from "@/lib/billing/payment-service";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await listPaymentMethods(session.user.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ paymentMethods: result.paymentMethods }, { status: 200 });
  } catch (error) {
    console.error("Error listing payment methods:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, last4, brand, expiryMonth, expiryYear } = body;

    if (!type || !last4 || !brand || !expiryMonth || !expiryYear) {
      return NextResponse.json(
        { error: "Missing required fields: type, last4, brand, expiryMonth, expiryYear" },
        { status: 400 }
      );
    }

    const input: AddPaymentMethodInput = {
      type,
      last4,
      brand,
      expiryMonth: Number(expiryMonth),
      expiryYear: Number(expiryYear),
    };

    const result = await addPaymentMethod(session.user.id, input);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ paymentMethod: result.paymentMethod }, { status: 201 });
  } catch (error) {
    console.error("Error adding payment method:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
