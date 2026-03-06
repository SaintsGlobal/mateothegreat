#!/usr/bin/env npx tsx

import { readdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { config } from "dotenv";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@prisma/client";

// Load environment variables
config({ path: path.join(process.cwd(), ".env") });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Initialize Prisma with pg adapter
const pool = new pg.Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DRAFTS_DIR = path.join(process.cwd(), "content/newsletters/drafts");
const PUBLISHED_DIR = path.join(process.cwd(), "content/newsletters/published");

interface NewsletterContent {
  id: string;
  title: string;
  slug: string;
  template: string;
  status: string;
  author: string;
  version: number;
  blocks: unknown[];
  publishedAt?: string;
}

async function publishNewsletters() {
  console.log("Starting newsletter publish process...");

  // Read all files in drafts directory
  let files: string[];
  try {
    files = await readdir(DRAFTS_DIR);
  } catch {
    console.log("Drafts directory empty or not accessible. Nothing to publish.");
    return;
  }

  // Filter to only JSON files (exclude .gitkeep, etc.)
  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  if (jsonFiles.length === 0) {
    console.log("No draft newsletters found. Nothing to publish.");
    return;
  }

  console.log(`Found ${jsonFiles.length} draft file(s)`);

  let publishedCount = 0;

  for (const file of jsonFiles) {
    const filePath = path.join(DRAFTS_DIR, file);
    const content = await readFile(filePath, "utf-8");
    const newsletter: NewsletterContent = JSON.parse(content);

    if (newsletter.status !== "approved") {
      console.log(`Skipping ${file} - status is "${newsletter.status}", not "approved"`);
      continue;
    }

    console.log(`Publishing: ${newsletter.title} (${newsletter.slug})`);

    // Check if newsletter already exists
    const existing = await prisma.newsletter.findUnique({
      where: { slug: newsletter.slug },
    });

    const publishedAt = new Date();
    let newVersion: number;

    if (existing) {
      // Update existing newsletter and increment version
      newVersion = existing.version + 1;

      await prisma.newsletter.update({
        where: { slug: newsletter.slug },
        data: {
          title: newsletter.title,
          template: newsletter.template,
          content: newsletter as unknown as Prisma.InputJsonValue,
          author: newsletter.author,
          status: "published",
          version: newVersion,
          publishedAt,
        },
      });
    } else {
      // Create new newsletter
      newVersion = 1;

      await prisma.newsletter.create({
        data: {
          title: newsletter.title,
          slug: newsletter.slug,
          template: newsletter.template,
          content: newsletter as unknown as Prisma.InputJsonValue,
          author: newsletter.author,
          status: "published",
          version: newVersion,
          publishedAt,
        },
      });
    }

    // Create version record
    const newsletterRecord = await prisma.newsletter.findUnique({
      where: { slug: newsletter.slug },
    });

    if (newsletterRecord) {
      await prisma.newsletterVersion.create({
        data: {
          newsletterId: newsletterRecord.id,
          version: newVersion,
          content: newsletter as unknown as Prisma.InputJsonValue,
        },
      });
    }

    // Update the newsletter file with published status
    newsletter.status = "published";
    newsletter.version = newVersion;
    newsletter.publishedAt = publishedAt.toISOString();

    // Move file to published directory
    const publishedPath = path.join(PUBLISHED_DIR, file);
    await writeFile(publishedPath, JSON.stringify(newsletter, null, 2));
    await rename(filePath, `${filePath}.bak`).catch(() => {
      // If rename fails, just delete by not doing anything - the writeFile already created the new file
    });

    // Remove the original file (clean up)
    const { unlink } = await import("node:fs/promises");
    await unlink(filePath).catch(() => {
      // Already moved or renamed
    });
    await unlink(`${filePath}.bak`).catch(() => {
      // Backup might not exist
    });

    console.log(`  -> Published version ${newVersion}`);
    publishedCount++;
  }

  console.log(`\nPublish complete. ${publishedCount} newsletter(s) published.`);
}

// Run the script
publishNewsletters()
  .catch((error) => {
    console.error("Publish failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
