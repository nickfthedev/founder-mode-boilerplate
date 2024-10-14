import Link from "next/link";
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

export default async function BlogPage() {
  const session = await getServerAuthSession();

  const pageOwnerPosts = await api.blog.getPageOwnerBlogPosts({ limit: 10 });
  const userPosts = await api.blog.getUsersBlogPosts({ limit: 10 });
  // TODO: Show Page Posts and Owner Posts below, check if user can see posts
  // TODO: Create Page for Users own posts.

  return (
    <HydrateClient>
      <div className="flex flex-col gap-4">
        {session && canPostBlogPostAsPageOwner({ user: session.user }) && (
          <Button asChild className="w-fit" variant={"outline"} size={"sm"}>
            <Link href="/blog/new">New Post</Link>
          </Button>
        )}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">{env.APP_NAME} Blogposts</h1>
            <BlogPostList posts={pageOwnerPosts} />
          </div>
        </div>

        {APP_CONFIG.canPostBlogPosts.includes("USER") && (
          <>
            <div className="h-1 border-t border-muted-foreground/30" />
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Users Blogposts</h1>
                <BlogPostList posts={userPosts} />
              </div>
            </div>
          </>
        )}
      </div>
    </HydrateClient>
  );
}
