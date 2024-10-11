import Link from "next/link";

interface PageOwnerPosts {
  title: string;
  id: number;
  content: string;
  keywords: string[];
  asPageOwner: boolean;
  slug: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
}

export function BlogPostList({ posts }: { posts: PageOwnerPosts[] }) {
  if (posts.length === 0) {
    return <div className="text-muted-foreground">No posts yet</div>;
  }

  return (
    <>
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
    </>
  );
}
