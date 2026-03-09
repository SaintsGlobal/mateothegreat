// US-009: Client-side animated article listing

"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ParallaxLayer } from "@/components/animation/parallax-layer";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { TiltCard } from "@/components/ui/tilt-card";

interface ContentItem {
  id: string;
  slug: string;
  title: string;
  type: string;
  publishedAt: Date | null;
}

interface ExclusiveContentProps {
  content: ContentItem[];
  isPremium: boolean;
}

const typeBadgeColors: Record<string, string> = {
  ARTICLE: "bg-brand-cyan/20 text-brand-cyan",
  VIDEO: "bg-brand-coral/20 text-brand-coral",
  ANNOUNCEMENT: "bg-brand-gold/20 text-brand-gold",
};

export function ExclusiveContent({ content, isPremium }: ExclusiveContentProps) {
  const [featured, ...rest] = content;

  return (
    <>
      {/* Hero section with parallax */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden mb-12 rounded-xl">
        <ParallaxLayer speed={-0.2} className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-br from-[var(--brand-coral)]/5 via-transparent to-[var(--brand-cyan)]/5" />
        </ParallaxLayer>
        <ScrollReveal variant="fade" className="relative z-10 text-center">
          <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
            Exclusive Content
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Premium articles, videos, and announcements
          </p>
        </ScrollReveal>
      </section>

      {/* Featured article */}
      {featured && (
        <ScrollReveal variant="scale" className="mb-8">
          <Link href={`/exclusive/${featured.slug}`}>
            <TiltCard>
              <Card glow className="p-8 transition-transform">
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${typeBadgeColors[featured.type] || ""}`}
                  >
                    {featured.type}
                  </span>
                  <span className="text-xs text-gray-400">Featured</span>
                  {!isPremium && (
                    <span className="rounded-full bg-brand-gold/20 px-2 py-0.5 text-xs font-medium text-brand-gold">
                      Premium
                    </span>
                  )}
                </div>
                <h2 className="mb-2 text-2xl font-bold md:text-3xl">{featured.title}</h2>
                {featured.publishedAt && (
                  <p className="text-sm text-gray-400">
                    {new Date(featured.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </Card>
            </TiltCard>
          </Link>
        </ScrollReveal>
      )}

      {/* Card grid with staggered reveal */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((item, index) => (
          <ScrollReveal
            key={item.id}
            variant="slide-up"
            delay={index * 100}
          >
            <Link href={`/exclusive/${item.slug}`}>
              <TiltCard>
                <Card glow className="h-full transition-transform">
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${typeBadgeColors[item.type] || ""}`}
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
                    <p className="text-sm text-gray-400">
                      {new Date(item.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </Card>
              </TiltCard>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </>
  );
}
