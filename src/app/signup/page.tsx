"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type FormState = { error?: string } | null;

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      try {
        const result = await signUp(formData);
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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8">
        <h1 className="mb-6 text-center text-2xl font-bold">Create Account</h1>

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
            placeholder="At least 8 characters"
            required
            disabled={isPending}
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            required
            disabled={isPending}
          />

          {state?.error && (
            <p className="text-sm text-red-400">{state.error}</p>
          )}

          <Button type="submit" loading={isPending} className="w-full">
            Sign Up
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          Already have an account?{" "}
          <Link href="/signin" className="text-violet-400 hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
