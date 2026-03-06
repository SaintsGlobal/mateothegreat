"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfile, uploadAvatar, changePassword, updatePreferences, updateNotifications } from "@/app/actions/auth";
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
            <>
              <ProfileSection user={user} />
              <ChangePasswordSection />
            </>
          )}
          {currentSection === "preferences" && (
            <>
              <PreferencesSection user={user} />
              <NotificationsSection user={user} />
            </>
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

function Avatar({ name, avatarUrl, size = "md" }: { name: string | null; avatarUrl: string | null; size?: "md" | "lg" }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const sizeClasses = size === "lg" ? "h-24 w-24 text-3xl" : "h-20 w-20 text-2xl";

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name || "User avatar"}
        className={`${sizeClasses} rounded-full object-cover border-2 border-brand-cyan/30`}
      />
    );
  }

  return (
    <div className={`${sizeClasses} rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan font-bold border-2 border-brand-cyan/30`}>
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

  // Avatar upload state
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarSuccess, setAvatarSuccess] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(user.avatarUrl);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setAvatarError(null);
    setAvatarSuccess(false);

    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setAvatarError("Only JPG, PNG, and WebP images are allowed");
      return;
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setAvatarError("File size must be less than 2MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    setAvatarFile(file);
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    setAvatarUploading(true);
    setAvatarError(null);

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    const result = await uploadAvatar(formData);

    if ("error" in result) {
      setAvatarError(result.error);
    } else {
      setCurrentAvatarUrl(result.avatarUrl);
      setAvatarSuccess(true);
      setAvatarPreview(null);
      setAvatarFile(null);
    }

    setAvatarUploading(false);
  };

  const cancelAvatarUpload = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    setAvatarError(null);
  };

  const formattedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar with Upload */}
        <div className="flex-shrink-0">
          <div className="relative">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="h-24 w-24 rounded-full object-cover border-2 border-brand-cyan"
              />
            ) : (
              <Avatar name={user.name} avatarUrl={currentAvatarUrl} size="lg" />
            )}
          </div>

          {avatarPreview ? (
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                onClick={handleAvatarUpload}
                loading={avatarUploading}
                disabled={avatarUploading}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={cancelAvatarUpload}
                disabled={avatarUploading}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <label className="mt-3 block">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              <span className="inline-flex items-center gap-1.5 text-sm text-brand-cyan hover:text-brand-cyan/80 cursor-pointer">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Change photo
              </span>
            </label>
          )}

          {avatarError && (
            <p className="mt-2 text-xs text-brand-coral">{avatarError}</p>
          )}
          {avatarSuccess && (
            <p className="mt-2 text-xs text-brand-green">Photo updated!</p>
          )}
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

function ChangePasswordSection() {
  const [showForm, setShowForm] = useState(false);
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const result = await changePassword(formData);
      if ("error" in result) {
        return { error: result.error };
      }
      setShowForm(false);
      return { success: true };
    },
    null
  );

  return (
    <Card className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>

      {!showForm ? (
        <div className="flex items-center justify-between">
          <p className="text-brand-gray">
            Update your password to keep your account secure.
          </p>
          <Button variant="secondary" size="sm" onClick={() => setShowForm(true)}>
            Change Password
          </Button>
        </div>
      ) : (
        <form action={formAction} className="space-y-4 max-w-md">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-brand-gray mb-1">
              Current Password
            </label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              disabled={isPending}
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-brand-gray mb-1">
              New Password
            </label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              minLength={8}
              disabled={isPending}
              placeholder="Enter new password (min 8 characters)"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-brand-gray mb-1">
              Confirm New Password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              disabled={isPending}
              placeholder="Confirm new password"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-brand-coral">{state.error}</p>
          )}

          <div className="flex gap-2">
            <Button type="submit" loading={isPending}>
              Update Password
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowForm(false);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {state?.success && !showForm && (
        <div className="mt-4 rounded-lg bg-brand-green/10 p-3 text-sm text-brand-green">
          Password changed successfully!
        </div>
      )}
    </Card>
  );
}

function PreferencesSection({ user }: { user: User }) {
  const [bio, setBio] = useState(user.bio || "");
  const preferences = (user.preferences as Record<string, unknown>) || {};
  const [showEmailPublicly, setShowEmailPublicly] = useState(
    (preferences.showEmailPublicly as boolean) || false
  );

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const result = await updatePreferences(formData);
      if ("error" in result) {
        return { error: result.error };
      }
      return { success: true };
    },
    null
  );

  const charCount = bio.length;
  const maxChars = 500;

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-6">Bio & Display</h2>

      <form action={formAction} className="space-y-6">
        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-brand-gray mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={isPending}
            maxLength={maxChars}
            rows={4}
            placeholder="Tell others about yourself..."
            className="w-full px-4 py-3 bg-dark border border-brand-gray/20 rounded-lg text-white placeholder:text-brand-gray/50 focus:outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/50 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
          />
          <div className="mt-1 flex justify-end">
            <span className={`text-xs ${charCount >= maxChars ? "text-brand-coral" : "text-brand-gray"}`}>
              {charCount}/{maxChars}
            </span>
          </div>
        </div>

        {/* Show email publicly toggle */}
        <div className="flex items-center justify-between">
          <div>
            <label htmlFor="showEmailPublicly" className="text-sm font-medium text-white">
              Show email publicly
            </label>
            <p className="text-xs text-brand-gray mt-0.5">
              Allow others to see your email address on your profile
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="showEmailPublicly"
              name="showEmailPublicly"
              checked={showEmailPublicly}
              onChange={(e) => setShowEmailPublicly(e.target.checked)}
              disabled={isPending}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-brand-gray/30 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-cyan/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-cyan peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
          </label>
        </div>

        {/* Error message */}
        {state?.error && (
          <p className="text-sm text-brand-coral">{state.error}</p>
        )}

        {/* Success message */}
        {state?.success && (
          <div className="rounded-lg bg-brand-green/10 p-3 text-sm text-brand-green">
            Preferences saved successfully!
          </div>
        )}

        {/* Save button */}
        <div>
          <Button type="submit" loading={isPending}>
            Save Preferences
          </Button>
        </div>
      </form>
    </Card>
  );
}

interface NotificationToggle {
  key: "emailNewsletter" | "emailContentAlerts" | "emailAccountActivity";
  label: string;
  description: string;
}

const notificationToggles: NotificationToggle[] = [
  {
    key: "emailNewsletter",
    label: "Newsletter updates",
    description: "Receive our weekly newsletter with latest content",
  },
  {
    key: "emailContentAlerts",
    label: "New content alerts",
    description: "Get notified when new content is published",
  },
  {
    key: "emailAccountActivity",
    label: "Account activity",
    description: "Security alerts and account-related notifications",
  },
];

function NotificationsSection({ user }: { user: User }) {
  const preferences = (user.preferences as Record<string, unknown>) || {};

  const [values, setValues] = useState<Record<string, boolean>>({
    emailNewsletter: (preferences.emailNewsletter as boolean) ?? true,
    emailContentAlerts: (preferences.emailContentAlerts as boolean) ?? true,
    emailAccountActivity: (preferences.emailAccountActivity as boolean) ?? true,
  });

  const [saving, setSaving] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async (key: string, checked: boolean) => {
    setSaving(key);
    setError(null);
    setSuccess(null);

    // Optimistically update UI
    setValues((prev) => ({ ...prev, [key]: checked }));

    const result = await updateNotifications(key, checked);

    if ("error" in result) {
      // Revert on error
      setValues((prev) => ({ ...prev, [key]: !checked }));
      setError(result.error);
    } else {
      setSuccess(key);
      // Clear success after 2 seconds
      setTimeout(() => setSuccess(null), 2000);
    }

    setSaving(null);
  };

  return (
    <Card className="mt-6">
      <h2 className="text-xl font-semibold mb-6">Email Notifications</h2>

      <div className="space-y-4">
        {notificationToggles.map((toggle) => (
          <div
            key={toggle.key}
            className="flex items-center justify-between py-2"
          >
            <div>
              <label
                htmlFor={toggle.key}
                className="text-sm font-medium text-white"
              >
                {toggle.label}
              </label>
              <p className="text-xs text-brand-gray mt-0.5">
                {toggle.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {saving === toggle.key && (
                <span className="text-xs text-brand-gray">Saving...</span>
              )}
              {success === toggle.key && (
                <span className="text-xs text-brand-green">Saved</span>
              )}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id={toggle.key}
                  checked={values[toggle.key]}
                  onChange={(e) => handleToggle(toggle.key, e.target.checked)}
                  disabled={saving !== null}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-brand-gray/30 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-cyan/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-cyan peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
              </label>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="mt-4 text-sm text-brand-coral">{error}</p>
      )}
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
