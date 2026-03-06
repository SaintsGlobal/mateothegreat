import { redirect } from "next/navigation";
import { ProfileLayout } from "./profile-layout";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { getSession } = await import("@/lib/auth");
  const session = await getSession();

  if (!session) {
    redirect("/signin");
  }

  const { user } = session;

  return <ProfileLayout user={user} />;
}
