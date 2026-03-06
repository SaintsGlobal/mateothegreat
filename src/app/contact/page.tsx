import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
      {/* Gradient accent */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-coral to-brand-cyan opacity-20 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          <span className="bg-gradient-to-r from-brand-coral to-brand-cyan bg-clip-text text-transparent">
            Get in Touch
          </span>
        </h1>
        <p className="mt-4 text-lg text-brand-gray">
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
