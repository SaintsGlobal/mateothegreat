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

      {/* Mission section */}
      <div className="relative z-10 mt-20 w-full max-w-4xl">
        <h2 className="text-center text-3xl font-bold text-white md:text-4xl">
          The Mission
        </h2>
        <p className="mt-6 text-center text-brand-gray leading-relaxed">
          To make artificial intelligence accessible to everyone—breaking down barriers between cutting-edge technology and the people it impacts. Through clear explanations, honest analysis, and engaging content, I aim to empower others to understand and shape our AI-driven future.
        </p>
      </div>

      {/* Values section */}
      <div className="relative z-10 mt-16 w-full max-w-4xl">
        <h2 className="text-center text-3xl font-bold text-white md:text-4xl">
          Core Values
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold text-white">Clarity</h3>
            <p className="mt-2 text-brand-gray">
              Complex ideas deserve simple explanations. I strive to make every piece of content understandable without dumbing it down.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold text-white">Honesty</h3>
            <p className="mt-2 text-brand-gray">
              No hype, no fear-mongering. Just thoughtful, balanced perspectives on what AI can and cannot do.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold text-white">Curiosity</h3>
            <p className="mt-2 text-brand-gray">
              The best learning happens when we stay curious. I approach every topic with genuine wonder and a desire to understand deeply.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold text-white">Community</h3>
            <p className="mt-2 text-brand-gray">
              We learn better together. Building a space where questions are welcomed and knowledge is shared freely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
