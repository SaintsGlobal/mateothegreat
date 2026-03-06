"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/app/actions/auth";
import type { User } from "@prisma/client";
import type { SubscriptionTier } from "@prisma/client";

type Section = "profile" | "preferences" | "billing" | "invoices";

interface ProfileLayoutProps {
  user: User;
}

const sections: { id: Section; label: string; icon: string }[] = [
  { id: "profile", label: "Profile", icon: "user" },
  { id: "preferences", label: "Preferences", icon: "settings" },
  { id: "billing", label: "Billing", icon: "credit-card" },
  { id: "invoices", label: "Invoices", icon: "file-text" },
];

function SectionIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "user":
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    case "settings":
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "credit-card":
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      );
    case "file-text":
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    default:
      return null;
  }
}

export function ProfileLayout({ user }: ProfileLayoutProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentSection = (searchParams.get("section") as Section) || "profile";

  const setSection = (section: Section) => {
    const params = new URLSearchParams(searchParams.toString());
    if (section === "profile") {
      params.delete("section");
    } else {
      params.set("section", section);
    }
    const query = params.toString();
    router.push(`/profile${query ? `?${query}` : ""}`, { scroll: false });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Profile</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <nav className="sticky top-24">
            <Card className="p-2">
              <ul className="space-y-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => setSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        currentSection === section.id
                          ? "bg-brand-cyan/10 text-brand-cyan"
                          : "text-brand-gray hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <SectionIcon icon={section.icon} />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          </nav>
        </aside>

        {/* Mobile Tab Navigation */}
        <nav className="lg:hidden -mx-4 px-4 overflow-x-auto">
          <div className="flex gap-2 pb-4 min-w-max">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  currentSection === section.id
                    ? "bg-brand-cyan text-dark"
                    : "bg-dark-alt text-brand-gray hover:text-white"
                }`}
              >
                <SectionIcon icon={section.icon} />
                {section.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {currentSection === "profile" && (
            <ProfileSection user={user} />
          )}
          {currentSection === "preferences" && (
            <PreferencesSection />
          )}
          {currentSection === "billing" && (
            <BillingSection />
          )}
          {currentSection === "invoices" && (
            <InvoicesSection />
          )}
        </main>
      </div>
    </div>
  );
}

type FormState = { success?: boolean; error?: string } | null;

function Avatar({ name, avatarUrl }: { name: string | null; avatarUrl: string | null }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name || "User avatar"}
        className="h-20 w-20 rounded-full object-cover border-2 border-brand-cyan/30"
      />
    );
  }

  return (
    <div className="h-20 w-20 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan text-2xl font-bold border-2 border-brand-cyan/30">
      {initials}
    </div>
  );
}

function TierBadge({ tier }: { tier: SubscriptionTier }) {
  if (tier === "PREMIUM") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-gold/10 text-brand-gold border border-brand-gold/30">
        Premium
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-gray/10 text-brand-gray border border-brand-gray/30">
      Free
    </span>
  );
}

function ProfileSection({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const result = await updateProfile(formData);
      if ("error" in result) {
        return { error: result.error };
      }
      setIsEditing(false);
      return { success: true };
    },
    null
  );

  const formattedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar name={user.name} avatarUrl={user.avatarUrl} />
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-brand-gray mb-1">
              Name
            </label>
            {isEditing ? (
              <form action={formAction} className="flex gap-2">
                <Input
                  name="name"
                  defaultValue={user.name || ""}
                  placeholder="Enter your name"
                  disabled={isPending}
                  className="flex-1"
                />
                <Button type="submit" size="sm" loading={isPending}>
                  Save
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-white">
                  {user.name || <span className="text-brand-gray/60 italic">Not set</span>}
                </span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-brand-cyan text-sm hover:underline"
                >
                  Edit
                </button>
              </div>
            )}
            {state?.error && (
              <p className="text-sm text-brand-coral mt-1">{state.error}</p>
            )}
            {state?.success && (
              <p className="text-sm text-brand-green mt-1">Name updated successfully</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-brand-gray mb-1">
              Email
            </label>
            <div className="text-white">{user.email}</div>
            <p className="text-xs text-brand-gray/60 mt-1">
              Contact support to change your email address
            </p>
          </div>

          {/* Tier */}
          <div>
            <label className="block text-sm font-medium text-brand-gray mb-1">
              Subscription
            </label>
            <TierBadge tier={user.tier} />
          </div>

          {/* Member Since */}
          <div>
            <label className="block text-sm font-medium text-brand-gray mb-1">
              Member Since
            </label>
            <div className="text-white">{formattedDate}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function PreferencesSection() {
  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Preferences</h2>
      <p className="text-brand-gray">
        Customize your experience and notification settings.
      </p>
    </Card>
  );
}

function BillingSection() {
  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Billing</h2>
      <p className="text-brand-gray">
        Manage your subscription and payment methods.
      </p>
    </Card>
  );
}

function InvoicesSection() {
  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Invoices</h2>
      <p className="text-brand-gray">
        View your billing history and download invoices.
      </p>
    </Card>
  );
}
