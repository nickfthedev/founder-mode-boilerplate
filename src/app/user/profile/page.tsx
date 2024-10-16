import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import EditProfileForm from "~/components/user/edit-profile-form";
import { db } from "~/server/db";

export default async function ProfilePage() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return redirect("/login");
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  const newsletter = await db.newsletter.findUnique({
    where: {
      email: session.user.email ?? "",
    },
  });

  const acceptedMarketing = newsletter?.acceptedMarketing ?? false;

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex flex-col justify-center gap-2">
      <EditProfileForm user={user} acceptedMarketing={acceptedMarketing} />
    </div>
  );
}
