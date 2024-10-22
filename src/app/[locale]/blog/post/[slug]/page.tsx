import { Metadata, ResolvingMetadata } from "next";
import { Link } from "~/i18n/routing";
import { redirect } from "next/navigation";
import { TogglePublishedButton } from "~/components/blog/toggle-published-button";
import BackButton from "~/components/common/back-button";
import { MarkdownRenderer } from "~/components/common/markdown-renderer";
import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { canEditBlogPost, canSeeBlogPost } from "~/types/blog.types";
import { env } from "~/env";
import { getLocale, getTranslations } from "next-intl/server";

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const t = await getTranslations("Blog");
  const { slug } = params;
  const parentData = await parent;
  const parentTitle = parentData.title?.absolute ?? "";
  const post = await api.blog.getBlogPostBySlug(slug);

  if (!post || !post.published) {
    return {
      title: t("post_not_found") + " " + parentTitle,
    };
  }

  return {
    title: post.title + " | " + parentTitle,
    description: post.content.slice(0, 150),
    ...(post.keywords &&
      post.keywords.length > 0 && { keywords: post.keywords }),
    openGraph: {
      title: post.title + " | " + parentTitle,
      description: post.content.slice(0, 150),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = params;
  const session = await getServerAuthSession();
  const post = await api.blog.getBlogPostBySlug(slug);
  const t = await getTranslations("Blog");
  if (!post) {
    return <div>{t("post_not_found")}</div>;
  }

  // Redirect to the correct locale if the post is not in the current locale
  const locale = await getLocale();
  if (post.language !== locale) {
    return redirect(`/${post.language}/blog/post/${slug}`);
  }

  if (!canSeeBlogPost({ user: session?.user, post })) {
    return <div>{t("post_not_found")}</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between gap-2">
        <BackButton />
        <div className="flex gap-2">
          {canEditBlogPost({ user: session?.user, post }) && (
            <>
              <TogglePublishedButton
                slug={post.slug}
                published={post.published}
              />
              <Button asChild>
                <Link href={`/blog/edit/${post.slug}`}>{t("edit")}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex w-full flex-col gap-2 px-2 py-4">
        <div className="text-2xl font-bold">{post.title}</div>
        <div className="flex flex-col gap-2 md:flex-row">
          <span className="text-sm text-muted-foreground">
            {t("author")}:{" "}
            {post.asPageOwner ? (
              env.APP_NAME
            ) : (
              <Link
                href={`/blog/user/${post.createdBy.id}`}
                className="text-primary hover:underline"
              >
                {post.createdBy.name}
              </Link>
            )}
          </span>
          <span className="text-sm text-muted-foreground">
            {t("created")}: {post.createdAt.toLocaleDateString()}
          </span>
          <span className="text-sm text-muted-foreground">
            {t("updated")}: {post.updatedAt.toLocaleDateString()}
          </span>
        </div>
        <div className="prose dark:prose-invert">
          <MarkdownRenderer content={post.content} />
        </div>
      </div>
    </div>
  );
}
