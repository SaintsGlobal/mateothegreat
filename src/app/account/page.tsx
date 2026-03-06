import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { ProfileForm, PasswordForm, SignOutButton } from "./account-forms";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const { getSession } = await import("@/lib/auth");
  const session = await getSession();

  if (!session) {
    redirect("/signin");
  }

  const { user } = session;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Account Settings</h1>
      <div className="space-y-6">
        <ProfileForm initialName={user.name || ""} email={user.email} />
        <PasswordForm />
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Sign Out</h2>
          <p className="mb-4 text-sm text-brand-gray">
            Sign out of your account on this device.
          </p>
          <SignOutButton />
        </Card>
      </div>
    </div>
  );
}
