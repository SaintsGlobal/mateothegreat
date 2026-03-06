"use server";

import { db } from "@/lib/db";
import { hashPassword, generateSessionToken } from "@/lib/auth";
import { resend, EMAIL_FROM } from "@/lib/email";
import { verificationEmail } from "@/lib/email-templates";
import { redirect } from "next/navigation";

type SignUpResult = { success: true } | { error: string };

export async function signUp(formData: FormData): Promise<SignUpResult> {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  // Validation
  if (!email || !password || !confirmPassword) {
    return { error: "All fields are required" };
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address" };
  }

  // Password min length
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  // Passwords match
  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  // Check for existing user
  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "An account with this email already exists" };
  }

  // Create user
  const passwordHash = await hashPassword(password);
  const verificationToken = generateSessionToken();

  await db.user.create({
    data: {
      email,
      passwordHash,
      verificationToken,
    },
  });

  // Send verification email
  try {
    const { subject, html } = verificationEmail(verificationToken);
    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject,
      html,
    });
  } catch {
    // Don't fail signup if email fails
    console.error("Failed to send verification email");
  }

  redirect("/signin?message=Account created. Please check your email to verify.");
}
