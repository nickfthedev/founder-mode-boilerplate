import { Link } from "~/i18n/routing";
import { Button } from "~/components/ui/button";
import { api, HydrateClient } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import {
  canPostBlogPostAsPageOwner,
  canPostBlogPosts,
} from "~/types/blog.types";
import { BlogPostList } from "~/components/blog/blog-post-list";
import { env } from "~/env";
import { APP_CONFIG } from "~/config/app.config";
import { getTranslations } from "next-intl/server";

export default async function BlogPage() {
  const t = await getTranslations("Blog");
  const session = await getServerAuthSession();

  // Gets all blog posts from page owners from the current locale
  const pageOwnerPosts = await api.blog.getPageOwnerBlogPostsFromCurrentLocale({
    limit: 10,
  });
  // Gets all blog posts from users from the current locale
  const userPosts = await api.blog.getUsersBlogPostsFromCurrentLocale({
    limit: 10,
  });
  // TODO: Show Page Posts and Owner Posts below, check if user can see posts
  // TODO: Create Page for Users own posts.

  return (
    <HydrateClient>
      <div className="flex flex-col gap-4">
        {session &&
        (canPostBlogPostAsPageOwner({ user: session.user }) ||
          canPostBlogPosts({ user: session.user })) ? (
          <Button asChild className="w-fit" variant={"outline"} size={"sm"}>
            <Link href="/blog/new">{t("new_post")}</Link>
          </Button>
        ) : null}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">
              {t("app_name_blogposts", { appName: env.APP_NAME })}
            </h1>
            <BlogPostList posts={pageOwnerPosts} />
          </div>
        </div>

        {APP_CONFIG.canPostBlogPosts.includes("USER") && (
          <>
            <div className="h-1 border-t border-muted-foreground/30" />
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">{t("users_blogposts")}</h1>
                <BlogPostList posts={userPosts} />
              </div>
            </div>
          </>
        )}
      </div>
    </HydrateClient>
  );
}
