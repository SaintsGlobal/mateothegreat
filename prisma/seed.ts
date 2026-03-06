import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import pg from "pg";
import bcrypt from "bcryptjs";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Demo user credentials
const DEMO_USER = {
  email: "demo@mateothegreat.ai",
  password: "demo1234",
  name: "Demo User",
};

const articles = [
  {
    title: "The Rise of AI Agents",
    slug: "the-rise-of-ai-agents",
    content: `<p>Artificial intelligence has evolved from simple rule-based systems to sophisticated agents capable of reasoning, planning, and executing complex tasks. The emergence of AI agents marks a pivotal moment in the history of computing.</p>

<p>Modern AI agents can browse the web, write code, analyze data, and collaborate with humans in ways that were science fiction just a few years ago. They represent a fundamental shift from tools that wait for instructions to partners that can take initiative and solve problems autonomously.</p>

<p>As we look to the future, AI agents will continue to become more capable, more reliable, and more integrated into our daily workflows. The question is no longer whether AI agents will transform how we work, but how quickly and how deeply that transformation will occur.</p>`,
    type: "ARTICLE" as const,
    publishedAt: new Date("2026-02-15"),
  },
  {
    title: "Claude vs GPT: A Comparison",
    slug: "claude-vs-gpt-a-comparison",
    content: `<p>The AI landscape in 2026 features two major players: Anthropic's Claude and OpenAI's GPT series. Both represent the cutting edge of large language model technology, but they have distinct characteristics that make them suited for different use cases.</p>

<p>Claude is known for its thoughtful, nuanced responses and strong safety considerations. It excels at long-form writing, code generation, and complex analysis tasks. GPT models continue to push the boundaries of capability, with impressive performance across a wide range of benchmarks.</p>

<p>Ultimately, the "best" AI depends on your specific needs. Many developers and businesses use both, choosing the right tool for each task. The competition between these models drives rapid innovation, benefiting everyone who uses AI technology.</p>`,
    type: "ARTICLE" as const,
    publishedAt: new Date("2026-02-20"),
  },
  {
    title: "Building with Next.js 14",
    slug: "building-with-nextjs-14",
    content: `<p>Next.js 14 introduced groundbreaking features that have changed how we build web applications. The App Router architecture, Server Components, and Server Actions have made it possible to build faster, more efficient applications with less client-side JavaScript.</p>

<p>The transition from Pages Router to App Router requires a shift in thinking. Instead of fetching data on the client and managing loading states, we can now fetch data directly in our components on the server. This leads to simpler code and better performance.</p>

<p>Whether you're building a simple landing page or a complex web application, Next.js 14 provides the tools you need to succeed. Its integration with React 18 features like Suspense and Streaming makes it the framework of choice for modern web development.</p>`,
    type: "ARTICLE" as const,
    publishedAt: new Date("2026-03-01"),
  },
];

async function main() {
  console.log("Seeding database...");

  // Create demo user
  const existingUser = await prisma.user.findUnique({
    where: { email: DEMO_USER.email },
  });

  if (existingUser) {
    console.log(`Demo user "${DEMO_USER.email}" already exists, skipping...`);
  } else {
    const passwordHash = await bcrypt.hash(DEMO_USER.password, 12);
    await prisma.user.create({
      data: {
        email: DEMO_USER.email,
        name: DEMO_USER.name,
        passwordHash,
        emailVerified: true,
      },
    });
    console.log(`Created demo user: ${DEMO_USER.email} / ${DEMO_USER.password}`);
  }

  // Create articles
  for (const article of articles) {
    const existing = await prisma.exclusiveContent.findUnique({
      where: { slug: article.slug },
    });

    if (existing) {
      console.log(`Article "${article.title}" already exists, skipping...`);
      continue;
    }

    await prisma.exclusiveContent.create({
      data: article,
    });
    console.log(`Created article: ${article.title}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
