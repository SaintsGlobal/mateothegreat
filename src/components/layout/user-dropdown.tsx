"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { SubscriptionTier } from "@prisma/client";

interface UserDropdownProps {
  name: string | null;
  avatarUrl: string | null;
  tier: SubscriptionTier;
}

function Avatar({ name, avatarUrl }: { name: string | null; avatarUrl: string | null }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name || "User avatar"}
        className="h-8 w-8 rounded-full object-cover border border-brand-cyan/30"
      />
    );
  }

  return (
    <div className="h-8 w-8 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan text-xs font-bold border border-brand-cyan/30">
      {initials}
    </div>
  );
}

function TierBadge({ tier }: { tier: SubscriptionTier }) {
  if (tier === "PREMIUM") {
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-brand-gold/10 text-brand-gold border border-brand-gold/30">
        Premium
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-brand-gray/10 text-brand-gray border border-brand-gray/30">
      Free
    </span>
  );
}

export function UserDropdown({ name, avatarUrl, tier }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <Avatar name={name} avatarUrl={avatarUrl} />
        <span className="text-sm text-white hidden sm:inline">{name || "User"}</span>
        <TierBadge tier={tier} />
        <svg
          className={`w-4 h-4 text-brand-gray transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-48 bg-dark-alt border border-brand-gray/20 rounded-lg shadow-lg z-20">
            <div className="py-1">
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-brand-gray hover:bg-brand-gray/10 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/profile?section=billing"
                className="block px-4 py-2 text-sm text-brand-gray hover:bg-brand-gray/10 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Billing
              </Link>
              <hr className="my-1 border-brand-gray/20" />
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="w-full text-left px-4 py-2 text-sm text-brand-coral hover:bg-brand-coral/10 transition-colors disabled:opacity-50"
              >
                {isSigningOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
