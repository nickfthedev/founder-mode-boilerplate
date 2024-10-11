import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { TogglePublishedButton } from "~/components/blog/toggle-published-button";
import BackButton from "~/components/common/back-button";
import { MarkdownRenderer } from "~/components/common/markdown-renderer";
import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = params;
  const post = await api.blog.getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  if (!post.published) {
    const session = await getServerAuthSession();
    if (!session?.user || !session.user.isAdmin) {
      return {
        title: "Post Not Found",
      };
    }
  }

  return {
    title: "Bewerbungsfoto-ai.de - " + post.title,
    description: post.content.slice(0, 150),
    ...(post.keywords &&
      post.keywords.length > 0 && { keywords: post.keywords }),
    openGraph: {
      title: "Bewerbungsfoto-ai.de - " + post.title,
      description: post.content.slice(0, 150),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = params;
  const session = await getServerAuthSession();
  const post = await api.blog.getBlogPostBySlug(slug);

  if (!post || !post.published) {
    if (!session?.user || !session.user.isAdmin) {
      return <div>Post not found</div>;
    }
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between gap-2">
        <BackButton />
        <div className="flex gap-2">
          {session?.user?.isAdmin && (
            <>
              <TogglePublishedButton
                slug={post.slug}
                published={post.published}
              />
              <Button asChild>
                <Link href={`/blog/edit/${post.slug}`}>Edit</Link>
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex w-full flex-col gap-2 px-2 py-4">
        <div className="text-2xl font-bold">{post.title}</div>
        <span className="text-sm text-muted-foreground">
          {post.createdAt.toLocaleDateString()}
        </span>
        <div className="prose dark:prose-invert">
          <MarkdownRenderer content={post.content} />
        </div>
      </div>
    </div>
  );
}
