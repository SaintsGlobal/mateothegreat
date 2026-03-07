import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function NewslettersPage() {
  const newsletters = await prisma.newsletter.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      template: true,
      version: true,
      publishedAt: true,
    },
  });

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">
          Newsletters
        </h1>

        {newsletters.length === 0 ? (
          <p className="text-white/60">
            No published newsletters yet.
          </p>
        ) : (
          <div className="grid gap-4">
            {newsletters.map((newsletter) => (
              <Link
                key={newsletter.id}
                href={`/newsletters/${newsletter.slug}`}
                className="block bg-dark-alt rounded-lg border border-white/10 p-6 hover:border-violet-500/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-semibold text-white truncate">
                      {newsletter.title}
                    </h2>
                    <p className="text-sm text-white/40 mt-1">
                      {newsletter.publishedAt
                        ? new Date(newsletter.publishedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "Not published"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
                      {newsletter.template}
                    </span>
                    <span className="text-sm text-white/40">
                      v{newsletter.version}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
