"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type FormState = { error?: string } | null;

function SignInForm() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const result = await signIn(formData);
      if ("error" in result) {
        return { error: result.error };
      }
      return null;
    },
    null
  );

  return (
    <Card className="w-full max-w-md p-8">
      <h1 className="mb-6 text-center text-2xl font-bold">Sign In</h1>

      {message && (
        <p className="mb-4 rounded-lg bg-brand-green/10 p-3 text-center text-sm text-brand-green">
          {message}
        </p>
      )}

      <form action={formAction} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="you@example.com"
          required
          disabled={isPending}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Your password"
          required
          disabled={isPending}
        />

        {state?.error && (
          <p className="text-sm text-brand-coral">{state.error}</p>
        )}

        <Button type="submit" loading={isPending} className="w-full">
          Sign In
        </Button>
      </form>

      <div className="mt-6 space-y-2 text-center text-sm">
        <p>
          <Link href="/forgot-password" className="text-brand-cyan hover:underline">
            Forgot password?
          </Link>
        </p>
        <p className="text-brand-gray">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-brand-cyan hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </Card>
  );
}

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Suspense fallback={<Card className="w-full max-w-md p-8 animate-pulse" />}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
