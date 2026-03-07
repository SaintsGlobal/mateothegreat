// FD-013: Mobile hamburger menu

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface MobileMenuProps {
  navLinks: { href: string; label: string }[];
  isLoggedIn: boolean;
}

export function MobileMenu({ navLinks, isLoggedIn }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="md:hidden" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white/60 hover:text-white transition-colors p-2"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[rgba(10,10,10,0.95)] backdrop-blur-md border-b border-white/[0.06]">
          <nav className="flex flex-col py-4 px-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors px-4 py-3 rounded-lg"
              >
                {link.label}
              </Link>
            ))}
            {!isLoggedIn && (
              <Link
                href="/signin"
                onClick={() => setIsOpen(false)}
                className="text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors px-4 py-3 rounded-lg"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
