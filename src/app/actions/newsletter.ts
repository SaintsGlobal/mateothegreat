"use server";

import { db } from "@/lib/db";
import { resend, EMAIL_FROM } from "@/lib/email";
import { welcomeEmail } from "@/lib/email-templates";

type SubscribeResult =
  | { success: true }
  | { error: string };

export async function subscribe(formData: FormData): Promise<SubscribeResult> {
  const email = formData.get("email");

  if (!email || typeof email !== "string") {
    return { error: "Email is required" };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address" };
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Check for existing subscriber
    const existing = await db.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      if (existing.status === "ACTIVE") {
        return { error: "You're already subscribed!" };
      }
      // Reactivate unsubscribed user
      await db.newsletterSubscriber.update({
        where: { email: normalizedEmail },
        data: { status: "ACTIVE", subscribedAt: new Date() },
      });
      await sendWelcomeEmail(normalizedEmail);
      return { success: true };
    }

    // Create new subscriber
    await db.newsletterSubscriber.create({
      data: {
        email: normalizedEmail,
        status: "ACTIVE",
      },
    });

    await sendWelcomeEmail(normalizedEmail);
    return { success: true };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}

async function sendWelcomeEmail(email: string): Promise<void> {
  const { subject, html } = welcomeEmail();
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject,
      html,
    });
  } catch {
    // Log error but don't fail subscription
    console.error("Failed to send welcome email to:", email);
  }
}
