import { db } from "@/lib/db";
import type { PaymentMethod } from "@prisma/client";

export type PaymentMethodResult =
  | { success: true; paymentMethod: PaymentMethod }
  | { success: false; error: string };

export type PaymentMethodListResult =
  | { success: true; paymentMethods: PaymentMethod[] }
  | { success: false; error: string };

export type PaymentMethodActionResult =
  | { success: true }
  | { success: false; error: string };

export interface AddPaymentMethodInput {
  type: string;
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
}

/**
 * Adds a new payment method for a user.
 * Currently creates a stubbed payment method - Stripe integration to be added.
 */
export async function addPaymentMethod(
  userId: string,
  input: AddPaymentMethodInput
): Promise<PaymentMethodResult> {
  // STRIPE_INTEGRATION_POINT: Create Stripe payment method and attach to customer
  try {
    // Check if this is the first payment method (make it default)
    const existingMethods = await db.paymentMethod.count({
      where: { userId },
    });

    const paymentMethod = await db.paymentMethod.create({
      data: {
        userId,
        type: input.type,
        last4: input.last4,
        brand: input.brand,
        expiryMonth: input.expiryMonth,
        expiryYear: input.expiryYear,
        isDefault: existingMethods === 0,
        // stripePaymentMethodId left null for stub
      },
    });

    return { success: true, paymentMethod };
  } catch (error) {
    console.error("Failed to add payment method:", error);
    return { success: false, error: "Failed to add payment method" };
  }
}

/**
 * Removes a payment method.
 * Cannot remove the default payment method if it's the only one.
 */
export async function removePaymentMethod(
  userId: string,
  paymentMethodId: string
): Promise<PaymentMethodActionResult> {
  // STRIPE_INTEGRATION_POINT: Detach payment method from Stripe customer
  try {
    const paymentMethod = await db.paymentMethod.findFirst({
      where: {
        id: paymentMethodId,
        userId,
      },
    });

    if (!paymentMethod) {
      return { success: false, error: "Payment method not found" };
    }

    if (paymentMethod.isDefault) {
      const otherMethods = await db.paymentMethod.count({
        where: {
          userId,
          id: { not: paymentMethodId },
        },
      });

      if (otherMethods === 0) {
        return { success: false, error: "Cannot remove the only payment method. Add another first." };
      }

      // Set another method as default
      const nextDefault = await db.paymentMethod.findFirst({
        where: {
          userId,
          id: { not: paymentMethodId },
        },
      });

      if (nextDefault) {
        await db.paymentMethod.update({
          where: { id: nextDefault.id },
          data: { isDefault: true },
        });
      }
    }

    await db.paymentMethod.delete({
      where: { id: paymentMethodId },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to remove payment method:", error);
    return { success: false, error: "Failed to remove payment method" };
  }
}

/**
 * Sets a payment method as the default.
 */
export async function setDefaultPaymentMethod(
  userId: string,
  paymentMethodId: string
): Promise<PaymentMethodActionResult> {
  // STRIPE_INTEGRATION_POINT: Update default payment method in Stripe
  try {
    const paymentMethod = await db.paymentMethod.findFirst({
      where: {
        id: paymentMethodId,
        userId,
      },
    });

    if (!paymentMethod) {
      return { success: false, error: "Payment method not found" };
    }

    // Remove default from all other methods
    await db.paymentMethod.updateMany({
      where: {
        userId,
        id: { not: paymentMethodId },
      },
      data: { isDefault: false },
    });

    // Set this one as default
    await db.paymentMethod.update({
      where: { id: paymentMethodId },
      data: { isDefault: true },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to set default payment method:", error);
    return { success: false, error: "Failed to set default payment method" };
  }
}

/**
 * Lists all payment methods for a user.
 */
export async function listPaymentMethods(
  userId: string
): Promise<PaymentMethodListResult> {
  // STRIPE_INTEGRATION_POINT: Sync with Stripe payment methods
  try {
    const paymentMethods = await db.paymentMethod.findMany({
      where: { userId },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" },
      ],
    });

    return { success: true, paymentMethods };
  } catch (error) {
    console.error("Failed to list payment methods:", error);
    return { success: false, error: "Failed to list payment methods" };
  }
}
