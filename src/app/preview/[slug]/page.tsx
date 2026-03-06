import { notFound } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";
import { newsletterSchema } from "@/lib/newsletter-schema";
import { NewsletterRenderer } from "@/components/newsletter";

interface PreviewPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { slug } = await params;

  const draftPath = path.join(
    process.cwd(),
    "content/newsletters/drafts",
    `${slug}.json`
  );

  let fileContent: string;
  try {
    fileContent = await fs.readFile(draftPath, "utf-8");
  } catch {
    notFound();
  }

  const data = JSON.parse(fileContent);
  const parseResult = newsletterSchema.safeParse(data);

  if (!parseResult.success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded mb-6">
            <p className="font-medium">Invalid newsletter format</p>
            <pre className="text-xs mt-2 overflow-auto">
              {JSON.stringify(parseResult.error.issues, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  const newsletter = parseResult.data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-amber-500 text-amber-950 px-4 py-3 text-center font-semibold">
        PREVIEW - NOT PUBLISHED
      </div>
      <NewsletterRenderer newsletter={newsletter} />
    </div>
  );
}
