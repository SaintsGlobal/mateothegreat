import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white hover:text-brand-coral transition-colors">
          Mateo The Great
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm text-brand-gray hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-sm text-brand-gray hover:text-white transition-colors">
            About
          </Link>
          <Link href="/exclusive" className="text-sm text-brand-gray hover:text-white transition-colors">
            Exclusive
          </Link>
          <Link href="/signin" className="text-sm text-brand-gray hover:text-white transition-colors">
            Sign In
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
