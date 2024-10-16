import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import EditProfileForm from "~/components/user/edit-profile-form";
import { db } from "~/server/db";
import Link from "next/link";
import { env } from "~/env";
import { canAccessUserProfile } from "~/types/user.types";

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
      <h1 className="text-2xl font-bold">Edit Profile</h1>
      {user.public && user.username ? (
        <p>
          See your public profile at{" "}
          <Link
            href={`${env.APP_URL}/user/${user.username.toLowerCase()}`}
            target="_blank"
            className="text-blue-500"
          >
            {env.APP_URL}/user/{user.username.toLowerCase()}
          </Link>
        </p>
      ) : null}
      <EditProfileForm user={user} acceptedMarketing={acceptedMarketing} />
    </div>
  );
}
