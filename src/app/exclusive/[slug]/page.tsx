import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requirePremium } from "@/lib/auth/tier-guard";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ExclusiveContentPage({ params }: PageProps) {
  const { slug } = await params;

  const { getSession } = await import("@/lib/auth");
  const session = await getSession();

  if (!session) {
    redirect(`/signin?redirect=/exclusive/${slug}`);
  }

  const { db } = await import("@/lib/db");
  const content = await db.exclusiveContent.findUnique({
    where: { slug },
  });

  if (!content || !content.publishedAt) {
    notFound();
  }

  const isPremium = await requirePremium(session.user.id);

  const typeBadgeColors: Record<string, string> = {
    ARTICLE: "bg-brand-cyan/20 text-brand-cyan",
    VIDEO: "bg-brand-coral/20 text-brand-coral",
    ANNOUNCEMENT: "bg-brand-gold/20 text-brand-gold",
  };

  // Create a preview of the content (first 200 characters)
  const contentPreview = content.content.replace(/<[^>]*>/g, "").slice(0, 200);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/exclusive"
        className="mb-8 inline-flex items-center text-brand-gray hover:text-white transition-colors"
      >
        <svg
          className="mr-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Exclusive Content
      </Link>

      <Card className="p-8">
        <div className="mb-6 flex items-center gap-4">
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${typeBadgeColors[content.type]}`}
          >
            {content.type}
          </span>
          {content.publishedAt && (
            <span className="text-sm text-brand-gray">
              {new Date(content.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
        </div>

        <h1 className="mb-8 text-4xl font-bold">{content.title}</h1>

        {isPremium ? (
          <div
            className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-brand-gray prose-a:text-brand-cyan prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
        ) : (
          <div className="relative">
            {/* Content Preview */}
            <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-brand-gray">
              <p>{contentPreview}...</p>
            </div>

            {/* Upgrade Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-dark via-dark/95 to-transparent">
              <div className="text-center p-8 max-w-md">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold/20">
                  <svg
                    className="h-8 w-8 text-brand-gold"
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
                </div>
                <h3 className="mb-2 text-2xl font-bold text-white">Premium Content</h3>
                <p className="mb-6 text-brand-gray">
                  Upgrade to Premium to unlock this exclusive content and get access to all premium features.
                </p>
                <Link href="/profile?section=billing">
                  <Button variant="primary" size="lg">
                    Upgrade to Access
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
