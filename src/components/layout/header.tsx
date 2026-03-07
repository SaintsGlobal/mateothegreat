import Link from "next/link";
import { UserDropdown } from "./user-dropdown";
import { getSession } from "@/lib/auth";
import { MobileMenu } from "./mobile-menu";

export async function Header() {
  const session = await getSession();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/exclusive", label: "Exclusive" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(10,10,10,0.8)] backdrop-blur-md border-b border-white/[0.06] shadow-lg shadow-black/20">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white hover:text-accent-violet transition-colors">
          Mateo The Great
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/60 hover:text-white transition-colors link-hover-slide pb-1"
            >
              {link.label}
            </Link>
          ))}
          {session ? (
            <UserDropdown
              name={session.user.name}
              avatarUrl={session.user.avatarUrl}
              tier={session.user.tier}
            />
          ) : (
            <Link href="/signin" className="text-sm text-white/60 hover:text-white transition-colors">
              Sign In
            </Link>
          )}
        </nav>

        {/* Mobile menu */}
        <MobileMenu navLinks={navLinks} isLoggedIn={!!session} />
      </div>
    </header>
  );
}
