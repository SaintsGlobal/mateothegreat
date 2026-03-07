import { NewsletterForm } from "@/components/newsletter-form";
import { GradientMesh } from "@/components/animation/GradientMesh";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 relative">
      {/* Background effects */}
      <GradientMesh />

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
          <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
            Mateo The Great
          </span>
        </h1>
        <p className="mt-4 max-w-md text-lg text-white/60 md:text-xl">
          AI insights for the curious mind
        </p>

        {/* YouTube embed */}
        <div className="mt-10 w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 shadow-2xl hover-lift">
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
