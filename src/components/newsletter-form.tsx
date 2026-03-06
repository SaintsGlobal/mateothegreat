"use client";

import { useActionState } from "react";
import { subscribe } from "@/app/actions/newsletter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FormState = { success?: boolean; error?: string } | null;

export function NewsletterForm() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      const result = await subscribe(formData);
      if ("success" in result) {
        return { success: true };
      }
      return { error: result.error };
    },
    null
  );

  if (state?.success) {
    return (
      <div className="w-full max-w-md rounded-xl border border-brand-green/30 bg-dark-alt p-6 text-center">
        <p className="text-lg font-medium text-brand-green">
          You&apos;re subscribed!
        </p>
        <p className="mt-1 text-sm text-brand-gray">
          Thanks for joining. We&apos;ll keep you updated.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="w-full max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            disabled={isPending}
            error={state?.error}
          />
        </div>
        <Button type="submit" loading={isPending} className="sm:w-auto">
          Subscribe
        </Button>
      </div>
      {state?.error && (
        <p className="mt-2 text-sm text-brand-coral">{state.error}</p>
      )}
    </form>
  );
}
