"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

// Demo credentials for testing
const DEMO_EMAIL = "demo@mateothegreat.ai";
const DEMO_PASSWORD = "demo1234";

type FormState = { error?: string } | null;

function SignInForm() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      try {
        const result = await signIn(formData);
        if (result && "error" in result) {
          return { error: result.error };
        }
        return null;
      } catch (error) {
        // Re-throw redirect errors so Next.js can handle them
        if (error && typeof error === "object" && "digest" in error) {
          throw error;
        }
        return { error: "An unexpected error occurred" };
      }
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
          defaultValue={DEMO_EMAIL}
          required
          disabled={isPending}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Your password"
          defaultValue={DEMO_PASSWORD}
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

      <p className="mt-4 text-center text-xs text-brand-gray/60">
        Demo: {DEMO_EMAIL} / {DEMO_PASSWORD}
      </p>

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
