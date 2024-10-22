import { Link } from "~/i18n/routing";
import { getTranslations } from "next-intl/server";

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
  language: string;
}

export async function BlogPostList({
  posts,
  showBadgePageOwner = false,
  showLanguage = false,
}: {
  posts: PageOwnerPosts[];
  showBadgePageOwner?: boolean;
  showLanguage?: boolean;
}) {
  const t = await getTranslations("Blog");
  if (posts.length === 0) {
    return <div className="text-muted-foreground">{t("no_posts_yet")}</div>;
  }

  return (
    <>
      {posts.map((post) => (
        <div key={post.id} className="w-full px-4 py-2">
          <h2 className="flex flex-row items-center gap-2 text-lg font-bold">
            <Link href={`/blog/post/${post.slug}`}>{post.title}</Link>
            {post.published ? null : (
              <span className="rounded-xl bg-secondary p-1 text-xs text-muted-foreground">
                {t("draft")}
              </span>
            )}
            {showBadgePageOwner && post.asPageOwner && (
              <span className="rounded-xl bg-secondary p-1 text-xs text-muted-foreground">
                {t("as_page_owner")}
              </span>
            )}
            {showLanguage && (
              <span className="rounded-xl bg-secondary p-1 text-xs text-muted-foreground">
                {post.language}
              </span>
            )}
          </h2>
          <span className="text-sm text-muted-foreground">
            {t("created")}: {post.createdAt.toLocaleDateString()} /{" "}
            {t("updated")}: {post.updatedAt.toLocaleDateString()}
          </span>
          <div>
            <span className="text-sm text-muted-foreground">
              {post.content.replace(/[#_*~`>]/g, "").slice(0, 100)}...{" "}
              <Link
                className="text-primary/50"
                href={`/blog/post/${post.slug}`}
              >
                {t("read_more")}
              </Link>
            </span>
          </div>
        </div>
      ))}
    </>
  );
}
