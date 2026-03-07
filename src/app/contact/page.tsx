import { ContactForm } from "@/components/contact-form";
import { GradientMesh } from "@/components/animation/GradientMesh";

export default function ContactPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12 relative">
      <GradientMesh />

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
            Get in Touch
          </span>
        </h1>
        <p className="mt-4 text-lg text-white/60">
          Have a question or want to collaborate? Drop me a message and I&apos;ll get back to you as soon as possible.
        </p>

        {/* Contact Form */}
        <div className="mt-8 w-full">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
