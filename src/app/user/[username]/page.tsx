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
          className="w-96 overflow-hidden bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
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
      {user.twitter ||
      user.instagram ||
      user.facebook ||
      user.linkedin ||
      user.youtube ||
      user.tiktok ||
      user.github ||
      user.discord ||
      user.twitch ? (
        <>
          <h2 className="text-xl font-bold">Socials</h2>
          <div className="flex flex-wrap gap-2">
            {user.twitter ? (
              <Button
                variant="default"
                className="w-40 bg-blue-400 text-white hover:bg-blue-500 hover:text-white"
              >
                Twitter
              </Button>
            ) : null}
            {user.instagram ? (
              <Button
                variant="default"
                className="w-40 bg-pink-400 text-white hover:bg-pink-500 hover:text-white"
              >
                Instagram
              </Button>
            ) : null}
            {user.facebook ? (
              <Button
                variant="default"
                className="w-40 bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
              >
                Facebook
              </Button>
            ) : null}
            {user.linkedin ? (
              <Button
                variant="default"
                className="w-40 bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
              >
                LinkedIn
              </Button>
            ) : null}
            {user.youtube ? (
              <Button
                variant="default"
                className="w-40 bg-red-500 text-white hover:bg-red-600 hover:text-white"
              >
                YouTube
              </Button>
            ) : null}
            {user.tiktok ? (
              <Button
                variant="default"
                className="w-40 bg-purple-500 text-white hover:bg-purple-600 hover:text-white"
              >
                TikTok
              </Button>
            ) : null}
            {user.github ? (
              <Button
                variant="default"
                className="w-40 bg-gray-500 text-white hover:bg-gray-600 hover:text-white"
              >
                GitHub
              </Button>
            ) : null}
            {user.discord ? (
              <Button
                variant="default"
                className="w-40 bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
              >
                Discord
              </Button>
            ) : null}
            {user.twitch ? (
              <Button
                variant="default"
                className="w-40 bg-purple-700 text-white hover:bg-purple-800 hover:text-white"
              >
                Twitch
              </Button>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
