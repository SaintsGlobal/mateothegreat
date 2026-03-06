"use client";

import { useActionState, useState } from "react";
import { updateProfile, changePassword, signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type FormState = { success?: boolean; error?: string } | null;

export function ProfileForm({ initialName, email }: { initialName: string; email: string }) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const result = await updateProfile(formData);
      if ("error" in result) {
        return { error: result.error };
      }
      return { success: true };
    },
    null
  );

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-xl font-semibold">Profile</h2>
      <form action={formAction} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          disabled
          className="opacity-60"
        />
        <Input
          label="Name"
          type="text"
          name="name"
          defaultValue={initialName}
          placeholder="Your name"
          disabled={isPending}
        />
        {state?.error && (
          <p className="text-sm text-brand-coral">{state.error}</p>
        )}
        {state?.success && (
          <p className="text-sm text-brand-green">Profile updated successfully</p>
        )}
        <Button type="submit" loading={isPending}>
          Update Profile
        </Button>
      </form>
    </Card>
  );
}

export function PasswordForm() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const result = await changePassword(formData);
      if ("error" in result) {
        return { error: result.error };
      }
      return { success: true };
    },
    null
  );

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-xl font-semibold">Change Password</h2>
      <form action={formAction} className="space-y-4">
        <Input
          label="Current Password"
          type="password"
          name="currentPassword"
          placeholder="Your current password"
          required
          disabled={isPending}
        />
        <Input
          label="New Password"
          type="password"
          name="newPassword"
          placeholder="New password (min 8 characters)"
          required
          disabled={isPending}
        />
        <Input
          label="Confirm New Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm new password"
          required
          disabled={isPending}
        />
        {state?.error && (
          <p className="text-sm text-brand-coral">{state.error}</p>
        )}
        {state?.success && (
          <p className="text-sm text-brand-green">Password changed successfully</p>
        )}
        <Button type="submit" loading={isPending}>
          Change Password
        </Button>
      </form>
    </Card>
  );
}

export function SignOutButton() {
  const [isPending, setIsPending] = useState(false);

  const handleSignOut = async () => {
    setIsPending(true);
    await signOut();
  };

  return (
    <Button
      variant="secondary"
      onClick={handleSignOut}
      loading={isPending}
      className="w-full"
    >
      Sign Out
    </Button>
  );
}
