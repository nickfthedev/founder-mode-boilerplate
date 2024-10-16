import { Globe2Icon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { db } from "~/server/db";
import { canAccessUserProfile } from "~/types/user.types";

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const user = await db.user.findUnique({
    where: {
      username: params.username,
    },
  });

  if (!user) {
    return redirect("/404");
  }

  if (!canAccessUserProfile({ user })) {
    return redirect("/404");
  }

  return (
    <div className="flex max-w-xl flex-col justify-center gap-2">
      <h1 className="text-2xl font-bold">{user?.name}&apos;s Profile</h1>
      <div className="flex flex-row gap-4">
        {user.name ? (
          <p>
            <span className="text-muted-foreground">Name:</span> {user?.name}
          </p>
        ) : null}
        {user.location ? (
          <p>
            <span className="text-muted-foreground">Location:</span>{" "}
            {user?.location}
          </p>
        ) : null}
      </div>

      {user.bio ? <p className="p-2 italic">{user?.bio}</p> : null}

      {user.website ? (
        <Button
          variant="default"
          className="bg-muted text-muted-foreground"
          asChild
        >
          <Link
            href={user?.website}
            className="flex items-center gap-2"
            target="_blank"
          >
            <Globe2Icon className="inline-block h-4 w-4" />
            {user?.website}
          </Link>
        </Button>
      ) : null}
      {user.twitter ? <p>Twitter: {user?.twitter}</p> : null}
      {user.instagram ? <p>Instagram: {user?.instagram}</p> : null}
      {user.facebook ? <p>Facebook: {user?.facebook}</p> : null}
      {user.linkedin ? <p>LinkedIn: {user?.linkedin}</p> : null}
      {user.youtube ? <p>YouTube: {user?.youtube}</p> : null}
      {user.tiktok ? <p>TikTok: {user?.tiktok}</p> : null}
      {user.github ? <p>GitHub: {user?.github}</p> : null}
      {user.discord ? <p>Discord: {user?.discord}</p> : null}
      {user.twitch ? <p>Twitch: {user?.twitch}</p> : null}
    </div>
  );
}
