import Link from "next/link";
import { Button } from "~/components/ui/button";
import { api, HydrateClient } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { canPostBlogPosts } from "~/types/blog.types";
import { BlogPostList } from "~/components/blog/blog-post-list";

export default async function BlogPage({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();

  const posts = await api.blog.getUserBlogPostsByUserId({
    userId: params.id,
  });

  return (
    <HydrateClient>
      <div className="flex flex-col gap-4">
        {session &&
          session.user.id === params.id &&
          canPostBlogPosts({ user: session.user }) && (
            <Button asChild className="w-fit" variant={"outline"} size={"sm"}>
              <Link href="/blog/new">New Post</Link>
            </Button>
          )}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">
              {posts.length > 0 ? (
                <Link href={`/user/${posts[0]?.createdBy.username}`}>
                  {posts[0]?.createdBy.name
                    ? `${posts[0]?.createdBy.name}s Blogposts`
                    : `${posts[0]?.createdBy.username}s Blogposts`}
                </Link>
              ) : (
                "No blogposts found"
              )}
            </h1>
            <BlogPostList posts={posts} />
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
