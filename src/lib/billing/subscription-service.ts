import { db } from "@/lib/db";
import { SubscriptionStatus, SubscriptionTier } from "@prisma/client";

export type SubscriptionResult =
  | { success: true; subscription: Awaited<ReturnType<typeof db.subscription.findUnique>> }
  | { success: false; error: string };

export type SubscriptionActionResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Creates a new subscription for a user.
 * Currently creates a stubbed subscription - Stripe integration to be added.
 */
export async function createSubscription(
  userId: string,
  tier: SubscriptionTier = "PREMIUM"
): Promise<SubscriptionResult> {
  // STRIPE_INTEGRATION_POINT: Create Stripe subscription and customer
  try {
    // Check if user already has an active subscription
    const existing = await db.subscription.findFirst({
      where: {
        userId,
        status: "ACTIVE",
      },
    });

    if (existing) {
      return { success: false, error: "User already has an active subscription" };
    }

    // Create subscription with stubbed data
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const subscription = await db.subscription.create({
      data: {
        userId,
        tier,
        status: "ACTIVE",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        // stripeSubscriptionId and stripeCustomerId left null for stub
      },
    });

    // Update user tier
    await db.user.update({
      where: { id: userId },
      data: { tier },
    });

    return { success: true, subscription };
  } catch (error) {
    console.error("Failed to create subscription:", error);
    return { success: false, error: "Failed to create subscription" };
  }
}

/**
 * Cancels an active subscription.
 * Sets status to CANCELED - user retains access until period end.
 */
export async function cancelSubscription(
  userId: string
): Promise<SubscriptionActionResult> {
  // STRIPE_INTEGRATION_POINT: Cancel Stripe subscription at period end
  try {
    const subscription = await db.subscription.findFirst({
      where: {
        userId,
        status: "ACTIVE",
      },
    });

    if (!subscription) {
      return { success: false, error: "No active subscription found" };
    }

    await db.subscription.update({
      where: { id: subscription.id },
      data: { status: "CANCELED" },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to cancel subscription:", error);
    return { success: false, error: "Failed to cancel subscription" };
  }
}

/**
 * Gets the current subscription for a user.
 */
export async function getSubscription(
  userId: string
): Promise<SubscriptionResult> {
  // STRIPE_INTEGRATION_POINT: Sync with Stripe subscription status
  try {
    const subscription = await db.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (!subscription) {
      return { success: false, error: "No subscription found" };
    }

    return { success: true, subscription };
  } catch (error) {
    console.error("Failed to get subscription:", error);
    return { success: false, error: "Failed to get subscription" };
  }
}

/**
 * Reactivates a canceled subscription before period end.
 */
export async function reactivateSubscription(
  userId: string
): Promise<SubscriptionActionResult> {
  // STRIPE_INTEGRATION_POINT: Reactivate Stripe subscription
  try {
    const subscription = await db.subscription.findFirst({
      where: {
        userId,
        status: "CANCELED",
      },
    });

    if (!subscription) {
      return { success: false, error: "No canceled subscription found" };
    }

    // Check if still within the billing period
    if (new Date() > subscription.currentPeriodEnd) {
      return { success: false, error: "Subscription period has ended. Please create a new subscription." };
    }

    await db.subscription.update({
      where: { id: subscription.id },
      data: { status: "ACTIVE" },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to reactivate subscription:", error);
    return { success: false, error: "Failed to reactivate subscription" };
  }
}
