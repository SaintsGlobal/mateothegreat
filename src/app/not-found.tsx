import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      {/* Gradient accent */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-coral to-brand-cyan opacity-20 blur-3xl" />
      </div>

      {/* 404 content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-8xl font-bold tracking-tight md:text-9xl">
          <span className="bg-gradient-to-r from-brand-coral to-brand-cyan bg-clip-text text-transparent">
            404
          </span>
        </h1>
        <p className="mt-4 text-2xl font-medium text-white md:text-3xl">
          Page not found
        </p>
        <p className="mt-2 max-w-md text-lg text-brand-gray">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Navigation */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
          <Link href="/">
            <Button size="lg">Go Home</Button>
          </Link>
          <Link href="/contact">
            <Button variant="secondary" size="lg">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
