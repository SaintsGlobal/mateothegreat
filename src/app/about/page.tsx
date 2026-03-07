import { Card } from "@/components/ui/card";
import { GradientMesh } from "@/components/animation/GradientMesh";

const values = [
  {
    title: "Clarity",
    description:
      "Complex ideas deserve simple explanations. I strive to make every piece of content understandable without dumbing it down.",
  },
  {
    title: "Honesty",
    description:
      "No hype, no fear-mongering. Just thoughtful, balanced perspectives on what AI can and cannot do.",
  },
  {
    title: "Curiosity",
    description:
      "The best learning happens when we stay curious. I approach every topic with genuine wonder and a desire to understand deeply.",
  },
  {
    title: "Community",
    description:
      "We learn better together. Building a space where questions are welcomed and knowledge is shared freely.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center px-4 py-16 relative">
      <GradientMesh />

      {/* Hero section */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
          <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
            About Mateo
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white/60 md:text-xl">
          Creator, educator, and AI enthusiast on a mission to demystify artificial intelligence for everyone.
        </p>
      </div>

      {/* Bio section */}
      <div className="relative z-10 mt-16 max-w-3xl">
        <p className="text-center text-white/60 leading-relaxed">
          Mateo The Great is the voice behind cutting-edge AI content that bridges the gap between complex technology and everyday understanding. With a passion for exploring the frontiers of artificial intelligence, Mateo brings clarity to the chaos of rapid technological change through engaging videos, thoughtful analysis, and accessible explanations.
        </p>
      </div>

      {/* Mission section */}
      <div className="relative z-10 mt-20 w-full max-w-4xl">
        <h2 className="text-center text-3xl font-bold text-white md:text-4xl">
          The Mission
        </h2>
        <p className="mt-6 text-center text-white/60 leading-relaxed">
          To make artificial intelligence accessible to everyone—breaking down barriers between cutting-edge technology and the people it impacts. Through clear explanations, honest analysis, and engaging content, I aim to empower others to understand and shape our AI-driven future.
        </p>
      </div>

      {/* Values section */}
      <div className="relative z-10 mt-16 w-full max-w-4xl">
        <h2 className="text-center text-3xl font-bold text-white md:text-4xl">
          Core Values
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {values.map((value) => (
            <Card key={value.title} glow>
              <h3 className="text-xl font-semibold text-white">{value.title}</h3>
              <p className="mt-2 text-white/60">{value.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
