// US-009: Redesigned exclusive listing with scroll animations

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { requirePremium } from "@/lib/auth/tier-guard";
import { ExclusiveContent } from "./exclusive-content";

export const dynamic = "force-dynamic";

export default async function ExclusivePage() {
  const { getSession } = await import("@/lib/auth");
  const session = await getSession();

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="mb-4 text-4xl font-bold">Exclusive Content</h1>
        <p className="mb-8 text-lg text-brand-gray">
          Get access to exclusive articles, videos, and announcements by joining the Mateo The Great community.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/signup">
            <Button variant="primary" size="lg">
              Sign Up Free
            </Button>
          </Link>
          <Link href="/signin">
            <Button variant="secondary" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isPremium = await requirePremium(session.user.id);

  const { db } = await import("@/lib/db");
  const content = await db.exclusiveContent.findMany({
    where: {
      publishedAt: {
        not: null,
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
  });

  if (content.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="mb-4 text-4xl font-bold">Exclusive Content</h1>
        <p className="text-lg text-brand-gray">
          No exclusive content yet. Check back soon!
        </p>
      </div>
    );
  }

  // Serialize dates for client component
  const serializedContent = content.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    type: item.type,
    publishedAt: item.publishedAt,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {!isPremium && (
        <div className="mb-6 flex items-center justify-end">
          <Link href="/profile?section=billing">
            <Button variant="primary" size="sm">
              Upgrade to Premium
            </Button>
          </Link>
        </div>
      )}

      {!isPremium && (
        <div className="mb-6 rounded-lg border border-brand-gold/30 bg-brand-gold/10 p-4">
          <div className="flex items-center gap-3">
            <svg
              className="h-5 w-5 text-brand-gold flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <p className="text-sm text-brand-gold">
              You&apos;re viewing previews only. Upgrade to Premium to unlock full access to all exclusive content.
            </p>
          </div>
        </div>
      )}

      <ExclusiveContent content={serializedContent} isPremium={isPremium} />
    </div>
  );
}
