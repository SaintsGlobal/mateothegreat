export default function AboutPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center px-4 py-16">
      {/* Gradient accent */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-green to-brand-cyan opacity-20 blur-3xl" />
      </div>

      {/* Hero section */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
          <span className="bg-gradient-to-r from-brand-coral to-brand-cyan bg-clip-text text-transparent">
            About Mateo
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-brand-gray md:text-xl">
          Creator, educator, and AI enthusiast on a mission to demystify artificial intelligence for everyone.
        </p>
      </div>

      {/* Bio section */}
      <div className="relative z-10 mt-16 max-w-3xl">
        <p className="text-center text-brand-gray leading-relaxed">
          Mateo The Great is the voice behind cutting-edge AI content that bridges the gap between complex technology and everyday understanding. With a passion for exploring the frontiers of artificial intelligence, Mateo brings clarity to the chaos of rapid technological change through engaging videos, thoughtful analysis, and accessible explanations.
        </p>
      </div>
    </div>
  );
}
