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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Newsletters
        </h1>

        {newsletters.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            No published newsletters yet.
          </p>
        ) : (
          <div className="grid gap-4">
            {newsletters.map((newsletter) => (
              <Link
                key={newsletter.id}
                href={`/newsletters/${newsletter.slug}`}
                className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:border-cyan-500 dark:hover:border-cyan-400 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                      {newsletter.title}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300">
                      {newsletter.template}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
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
