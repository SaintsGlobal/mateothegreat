"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type FormState = { error?: string } | null;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const result = await resetPassword(formData);
      if ("error" in result) {
        return { error: result.error };
      }
      return null;
    },
    null
  );

  if (!token) {
    return (
      <Card className="w-full max-w-md p-8">
        <h1 className="mb-4 text-center text-2xl font-bold text-brand-coral">
          Invalid Reset Link
        </h1>
        <p className="mb-6 text-center text-sm text-brand-gray">
          This password reset link is invalid or has expired.
        </p>
        <p className="text-center text-sm">
          <Link href="/forgot-password" className="text-brand-cyan hover:underline">
            Request a new reset link
          </Link>
        </p>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md p-8">
      <h1 className="mb-2 text-center text-2xl font-bold">Reset Password</h1>
      <p className="mb-6 text-center text-sm text-brand-gray">
        Enter your new password below.
      </p>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="token" value={token} />

        <Input
          label="New Password"
          type="password"
          name="password"
          placeholder="At least 8 characters"
          required
          disabled={isPending}
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your new password"
          required
          disabled={isPending}
        />

        {state?.error && (
          <p className="text-sm text-brand-coral">{state.error}</p>
        )}

        <Button type="submit" loading={isPending} className="w-full">
          Reset Password
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-gray">
        Remember your password?{" "}
        <Link href="/signin" className="text-brand-cyan hover:underline">
          Sign in
        </Link>
      </p>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Suspense fallback={<Card className="w-full max-w-md p-8 animate-pulse" />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
