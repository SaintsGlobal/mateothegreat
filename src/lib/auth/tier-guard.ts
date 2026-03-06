import { db } from "@/lib/db";
import { SubscriptionTier } from "@prisma/client";

/**
 * Get the current subscription tier for a user
 * @param userId - The user's ID
 * @returns The user's subscription tier (FREE or PREMIUM)
 */
export async function getUserTier(userId: string): Promise<SubscriptionTier> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { tier: true },
  });

  return user?.tier ?? SubscriptionTier.FREE;
}

/**
 * Check if a user has Premium tier access
 * @param userId - The user's ID
 * @returns true if user has PREMIUM tier, false otherwise
 */
export async function requirePremium(userId: string): Promise<boolean> {
  const tier = await getUserTier(userId);
  return tier === SubscriptionTier.PREMIUM;
}
