"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type FormState = { success?: boolean; error?: string } | null;

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const result = await requestPasswordReset(formData);
      return result;
    },
    null
  );

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8">
        <h1 className="mb-2 text-center text-2xl font-bold">Forgot Password</h1>
        <p className="mb-6 text-center text-sm text-brand-gray">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>

        {state?.success ? (
          <div className="space-y-4">
            <p className="rounded-lg bg-brand-green/10 p-4 text-center text-sm text-brand-green">
              If an account with that email exists, we&apos;ve sent a password reset link.
              Please check your inbox.
            </p>
            <p className="text-center text-sm">
              <Link href="/signin" className="text-brand-cyan hover:underline">
                Back to Sign In
              </Link>
            </p>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              disabled={isPending}
            />

            {state?.error && (
              <p className="text-sm text-brand-coral">{state.error}</p>
            )}

            <Button type="submit" loading={isPending} className="w-full">
              Send Reset Link
            </Button>
          </form>
        )}

        {!state?.success && (
          <p className="mt-6 text-center text-sm text-brand-gray">
            Remember your password?{" "}
            <Link href="/signin" className="text-brand-cyan hover:underline">
              Sign in
            </Link>
          </p>
        )}
      </Card>
    </div>
  );
}
