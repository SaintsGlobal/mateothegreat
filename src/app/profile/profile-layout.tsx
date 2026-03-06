"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import type { User } from "@prisma/client";

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

function ProfileSection({ user }: { user: User }) {
  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
      <p className="text-brand-gray">
        Manage your personal information and account settings.
      </p>
      <div className="mt-4 text-sm text-brand-gray/60">
        Logged in as: {user.email}
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
