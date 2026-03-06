"use server";

import { db } from "@/lib/db";
import { hashPassword, verifyPassword, generateSessionToken, createSession } from "@/lib/auth";
import { resend, EMAIL_FROM } from "@/lib/email";
import { verificationEmail, passwordResetEmail } from "@/lib/email-templates";
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

type SignInResult = { success: true } | { error: string };

export async function signIn(formData: FormData): Promise<SignInResult> {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "Invalid email or password" };
  }

  const isValid = await verifyPassword(password, user.passwordHash);

  if (!isValid) {
    return { error: "Invalid email or password" };
  }

  await createSession(user.id);

  redirect("/account");
}

type PasswordResetRequestResult = { success: true } | { error: string };

export async function requestPasswordReset(
  formData: FormData
): Promise<PasswordResetRequestResult> {
  const email = formData.get("email")?.toString().trim().toLowerCase();

  if (!email) {
    return { error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address" };
  }

  const user = await db.user.findUnique({
    where: { email },
  });

  // Always return success to prevent email enumeration
  if (!user) {
    return { success: true };
  }

  // Generate reset token with 1 hour expiry
  const resetToken = generateSessionToken();
  const resetTokenExp = new Date();
  resetTokenExp.setHours(resetTokenExp.getHours() + 1);

  await db.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExp },
  });

  // Send reset email
  try {
    const { subject, html } = passwordResetEmail(resetToken);
    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject,
      html,
    });
  } catch {
    console.error("Failed to send password reset email");
  }

  return { success: true };
}

type ResetPasswordResult = { success: true } | { error: string };

export async function resetPassword(
  formData: FormData
): Promise<ResetPasswordResult> {
  const token = formData.get("token")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!token) {
    return { error: "Invalid reset link" };
  }

  if (!password || !confirmPassword) {
    return { error: "All fields are required" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  const user = await db.user.findFirst({
    where: { resetToken: token },
  });

  if (!user) {
    return { error: "Invalid or expired reset link" };
  }

  if (!user.resetTokenExp || user.resetTokenExp < new Date()) {
    return { error: "Reset link has expired. Please request a new one." };
  }

  // Update password and clear reset token
  const passwordHash = await hashPassword(password);
  await db.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExp: null,
    },
  });

  redirect("/signin?message=Password reset successful. Please sign in.");
}

type UpdateProfileResult = { success: true } | { error: string };

export async function updateProfile(
  formData: FormData
): Promise<UpdateProfileResult> {
  const { getSession } = await import("@/lib/auth");
  const session = await getSession();

  if (!session) {
    return { error: "Not authenticated" };
  }

  const name = formData.get("name")?.toString().trim() || null;

  await db.user.update({
    where: { id: session.user.id },
    data: { name },
  });

  return { success: true };
}

type ChangePasswordResult = { success: true } | { error: string };

export async function changePassword(
  formData: FormData
): Promise<ChangePasswordResult> {
  const { getSession } = await import("@/lib/auth");
  const session = await getSession();

  if (!session) {
    return { error: "Not authenticated" };
  }

  const currentPassword = formData.get("currentPassword")?.toString();
  const newPassword = formData.get("newPassword")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All fields are required" };
  }

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters" };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match" };
  }

  const isValid = await verifyPassword(currentPassword, session.user.passwordHash);

  if (!isValid) {
    return { error: "Current password is incorrect" };
  }

  const passwordHash = await hashPassword(newPassword);
  await db.user.update({
    where: { id: session.user.id },
    data: { passwordHash },
  });

  return { success: true };
}

export async function signOut(): Promise<void> {
  const { destroySession } = await import("@/lib/auth");
  await destroySession();
  redirect("/");
}

type UploadAvatarResult = { success: true; avatarUrl: string } | { error: string };

export async function uploadAvatar(
  formData: FormData
): Promise<UploadAvatarResult> {
  const { getSession } = await import("@/lib/auth");
  const { writeFile, unlink } = await import("fs/promises");
  const { existsSync } = await import("fs");
  const path = await import("path");

  const session = await getSession();

  if (!session) {
    return { error: "Not authenticated" };
  }

  const file = formData.get("avatar") as File | null;

  if (!file || file.size === 0) {
    return { error: "No file provided" };
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return { error: "Only JPG, PNG, and WebP images are allowed" };
  }

  // Validate file size (2MB max)
  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    return { error: "File size must be less than 2MB" };
  }

  // Determine file extension
  const extMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  const ext = extMap[file.type];
  const fileName = `${session.user.id}.${ext}`;

  // Delete old avatar if exists (might be different extension)
  const avatarsDir = path.join(process.cwd(), "public", "avatars");
  for (const oldExt of ["jpg", "png", "webp"]) {
    const oldPath = path.join(avatarsDir, `${session.user.id}.${oldExt}`);
    if (existsSync(oldPath)) {
      try {
        await unlink(oldPath);
      } catch {
        // Ignore errors deleting old file
      }
    }
  }

  // Write new file
  const filePath = path.join(avatarsDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  // Update user avatarUrl
  const avatarUrl = `/avatars/${fileName}`;
  await db.user.update({
    where: { id: session.user.id },
    data: { avatarUrl },
  });

  return { success: true, avatarUrl };
}
