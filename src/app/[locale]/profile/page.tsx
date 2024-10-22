import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import EditProfileForm from "~/components/user/edit-profile-form";
import { db } from "~/server/db";
import { Link } from "~/i18n/routing";
import { env } from "~/env";
import { getTranslations } from "next-intl/server";

export default async function ProfilePage() {
  const session = await getServerAuthSession();
  const t = await getTranslations("Profile");

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
      <h1 className="text-2xl font-bold">{t("edit_profile")}</h1>
      {user.public && user.username ? (
        <p>
          {t("see_public_profile")}{" "}
          <Link
            href={`/user/${user.username.toLowerCase()}`}
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
