import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { NewsletterRenderer } from "@/components/newsletter";
import type { Newsletter } from "@/lib/newsletter-schema";

interface NewsletterDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewsletterDetailPage({
  params,
}: NewsletterDetailPageProps) {
  const { slug } = await params;

  const newsletter = await prisma.newsletter.findUnique({
    where: { slug },
  });

  if (!newsletter || newsletter.status !== "published") {
    notFound();
  }

  const content = newsletter.content as unknown as Newsletter;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NewsletterRenderer newsletter={content} />
    </div>
  );
}
