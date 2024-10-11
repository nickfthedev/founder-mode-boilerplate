import Link from "next/link";
import { Button } from "~/components/ui/button";
import { api, HydrateClient } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { canPostBlogPosts } from "~/types/blog.types";
export default async function BlogPage() {
  const session = await getServerAuthSession();

  const posts = await api.blog.getBlogPosts();

  // TODO: Show Page Posts and Owner Posts below, check if user can see posts
  // TODO: Create Page for Users own posts.

  return (
    <HydrateClient>
      <div className="flex flex-col gap-2">
        {session && canPostBlogPosts({ user: session.user }) && (
          <Button asChild className="w-fit" variant={"outline"} size={"sm"}>
            <Link href="/blog/new">New Post</Link>
          </Button>
        )}

        <h1 className="text-2xl font-bold">Blogposts</h1>
        {posts.length === 0 && (
          <div className="text-muted-foreground">No posts yet</div>
        )}
        {posts.map((post) => (
          <div key={post.id} className="w-full px-4 py-2">
            <h2 className="flex flex-row items-center gap-2 text-lg font-bold">
              <Link href={`/blog/post/${post.slug}`}>{post.title}</Link>
              {post.published ? null : (
                <span className="rounded-xl bg-secondary p-1 text-xs text-muted-foreground">
                  (Draft)
                </span>
              )}
            </h2>
            <span className="text-sm text-muted-foreground">
              Created: {post.createdAt.toLocaleDateString()} / Updated:{" "}
              {post.updatedAt.toLocaleDateString()}
            </span>
            <div>
              <span className="text-sm text-muted-foreground">
                {post.content.replace(/[#_*~`>]/g, "").slice(0, 100)}...
                <Link href={`/blog/post/${post.slug}`}>Read more</Link>
              </span>
            </div>
          </div>
        ))}
      </div>
    </HydrateClient>
  );
}
