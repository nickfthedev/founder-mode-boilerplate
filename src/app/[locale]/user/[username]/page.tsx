import { Globe2Icon } from "lucide-react";
import { Link } from "~/i18n/routing";
import { redirect } from "next/navigation";
import { BlogPostList } from "~/components/blog/blog-post-list";
import { Button } from "~/components/ui/button";
import { db } from "~/server/db";
import { api } from "~/trpc/server";
import { canAccessUserProfile } from "~/types/user.types";
import { getTranslations } from "next-intl/server";

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const t = await getTranslations("UserProfile");

  const user = await db.user.findUnique({
    where: {
      username: params.username,
    },
  });

  if (!user) {
    return t("not_found");
  }

  if (!canAccessUserProfile({ user })) {
    return t("unauthorized");
  }

  const blogposts = await api.blog.getPublishedBlogPostsByUserId({
    userId: user.id,
  });

  return (
    <div className="flex max-w-xl flex-col justify-center gap-2">
      <h1 className="text-2xl font-bold">
        {t("profile", { name: user.name })}
      </h1>
      <div className="flex flex-row gap-4">
        {user.name && (
          <p>
            <span className="text-muted-foreground">{t("name")}:</span>{" "}
            {user.name}
          </p>
        )}
        {user.location && (
          <p>
            <span className="text-muted-foreground">{t("location")}:</span>{" "}
            {user.location}
          </p>
        )}
      </div>

      {user.bio && <p className="p-2 italic">{user.bio}</p>}

      {user.website && (
        <Button
          variant="default"
          className="w-96 overflow-hidden bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
          asChild
        >
          <Link
            href={user.website}
            className="flex items-center gap-2"
            target="_blank"
          >
            <Globe2Icon className="inline-block h-4 w-4" />
            {user.website}
          </Link>
        </Button>
      )}

      {(user.twitter ||
        user.instagram ||
        user.facebook ||
        user.linkedin ||
        user.youtube ||
        user.tiktok ||
        user.github ||
        user.discord ||
        user.twitch) && (
        <>
          <h2 className="text-xl font-bold">{t("socials")}</h2>
          <div className="flex flex-wrap gap-2">
            {user.twitter && (
              <Button
                variant="default"
                className="w-40 bg-blue-400 text-white hover:bg-blue-500 hover:text-white"
              >
                Twitter
              </Button>
            )}
            {user.instagram && (
              <Button
                variant="default"
                className="w-40 bg-pink-400 text-white hover:bg-pink-500 hover:text-white"
              >
                Instagram
              </Button>
            )}
            {user.facebook && (
              <Button
                variant="default"
                className="w-40 bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
              >
                Facebook
              </Button>
            )}
            {user.linkedin && (
              <Button
                variant="default"
                className="w-40 bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
              >
                LinkedIn
              </Button>
            )}
            {user.youtube && (
              <Button
                variant="default"
                className="w-40 bg-red-500 text-white hover:bg-red-600 hover:text-white"
              >
                YouTube
              </Button>
            )}
            {user.tiktok && (
              <Button
                variant="default"
                className="w-40 bg-purple-500 text-white hover:bg-purple-600 hover:text-white"
              >
                TikTok
              </Button>
            )}
            {user.github && (
              <Button
                variant="default"
                className="w-40 bg-gray-500 text-white hover:bg-gray-600 hover:text-white"
              >
                GitHub
              </Button>
            )}
            {user.discord && (
              <Button
                variant="default"
                className="w-40 bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
              >
                Discord
              </Button>
            )}
            {user.twitch && (
              <Button
                variant="default"
                className="w-40 bg-purple-700 text-white hover:bg-purple-800 hover:text-white"
              >
                Twitch
              </Button>
            )}
          </div>
        </>
      )}

      {blogposts.length > 0 && (
        <>
          <h2 className="text-xl font-bold">{t("blogposts")}</h2>
          <BlogPostList posts={blogposts} />
        </>
      )}
    </div>
  );
}
