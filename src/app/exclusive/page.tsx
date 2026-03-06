import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requirePremium } from "@/lib/auth/tier-guard";

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

  const typeBadgeColors: Record<string, string> = {
    ARTICLE: "bg-brand-cyan/20 text-brand-cyan",
    VIDEO: "bg-brand-coral/20 text-brand-coral",
    ANNOUNCEMENT: "bg-brand-gold/20 text-brand-gold",
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Exclusive Content</h1>
        {!isPremium && (
          <Link href="/profile?section=billing">
            <Button variant="primary" size="sm">
              Upgrade to Premium
            </Button>
          </Link>
        )}
      </div>

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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {content.map((item) => (
          <Link key={item.id} href={`/exclusive/${item.slug}`}>
            <Card glow className="h-full transition-transform hover:scale-[1.02]">
              <div className="mb-3 flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${typeBadgeColors[item.type]}`}
                >
                  {item.type}
                </span>
                {!isPremium && (
                  <span className="rounded-full bg-brand-gold/20 px-2 py-0.5 text-xs font-medium text-brand-gold">
                    Premium
                  </span>
                )}
              </div>
              <h2 className="mb-2 text-xl font-semibold">{item.title}</h2>
              {item.publishedAt && (
                <p className="text-sm text-brand-gray">
                  {new Date(item.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
