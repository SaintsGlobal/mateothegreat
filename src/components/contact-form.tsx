"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (formData: FormData): boolean => {
    const newErrors: Record<string, string> = {};

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!message?.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!validateForm(formData)) {
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md rounded-xl border border-violet-500/30 bg-[rgba(17,17,17,0.8)] backdrop-blur-md p-6 text-center">
        <p className="text-lg font-medium text-violet-400">Message Sent!</p>
        <p className="mt-1 text-sm text-white/60">
          Thanks for reaching out. I&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <Input
        type="text"
        name="name"
        label="Name"
        placeholder="Your name"
        disabled={isSubmitting}
        error={errors.name}
      />

      <Input
        type="email"
        name="email"
        label="Email"
        placeholder="your@email.com"
        disabled={isSubmitting}
        error={errors.email}
      />

      <div className="w-full">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-white/70 mb-1.5"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Your message..."
          disabled={isSubmitting}
          className={`
            w-full px-4 py-2.5
            bg-[#1a1a1a] border rounded-lg
            text-white placeholder-white/40
            transition-all duration-200
            focus:outline-none focus:ring-2
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-none
            ${
              errors.message
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-white/10 focus:border-[#8b5cf6] focus:ring-violet-500/20"
            }
          `}
        />
        {errors.message && (
          <p className="mt-1.5 text-sm text-red-400">{errors.message}</p>
        )}
      </div>

      <Button type="submit" loading={isSubmitting} className="w-full">
        Send Message
      </Button>
    </form>
  );
}
