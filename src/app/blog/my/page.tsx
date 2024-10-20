import Link from "next/link";
import { Button } from "~/components/ui/button";
import { api, HydrateClient } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { canPostBlogPosts } from "~/types/blog.types";
import { BlogPostList } from "~/components/blog/blog-post-list";

export default async function BlogPage() {
  const session = await getServerAuthSession();
  const ownPosts = await api.blog.getUserSelfBlogPosts();

  return (
    <HydrateClient>
      <div className="flex flex-col gap-4">
        {session && canPostBlogPosts({ user: session.user }) && (
          <Button asChild className="w-fit" variant={"outline"} size={"sm"}>
            <Link href="/blog/new">New Post</Link>
          </Button>
        )}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">My Blogposts</h1>
            <BlogPostList posts={ownPosts} />
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
