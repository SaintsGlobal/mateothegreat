import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Card } from "@/components/ui/card";

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

  const typeBadgeColors: Record<string, string> = {
    ARTICLE: "bg-brand-cyan/20 text-brand-cyan",
    VIDEO: "bg-brand-coral/20 text-brand-coral",
    ANNOUNCEMENT: "bg-brand-gold/20 text-brand-gold",
  };

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

        <div
          className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-brand-gray prose-a:text-brand-cyan prose-strong:text-white"
          dangerouslySetInnerHTML={{ __html: content.content }}
        />
      </Card>
    </div>
  );
}
