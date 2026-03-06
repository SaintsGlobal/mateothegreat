import { NewsletterForm } from "@/components/newsletter-form";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      {/* Gradient accent */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-coral to-brand-cyan opacity-20 blur-3xl" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
          <span className="bg-gradient-to-r from-brand-coral to-brand-cyan bg-clip-text text-transparent">
            Mateo The Great
          </span>
        </h1>
        <p className="mt-4 max-w-md text-lg text-brand-gray md:text-xl">
          AI insights for the curious mind
        </p>

        {/* YouTube embed */}
        <div className="mt-10 w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 shadow-2xl">
          <div className="relative aspect-video">
            <iframe
              src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
              title="Mateo The Great - Featured Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="mt-12 flex w-full flex-col items-center">
          <h2 className="mb-4 text-xl font-medium text-white">
            Stay in the loop
          </h2>
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
}
