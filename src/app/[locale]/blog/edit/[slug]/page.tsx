import EditBlogPostForm from "~/components/blog/edit-blog-post-form";
import { getServerAuthSession } from "~/server/auth";
import BackButton from "~/components/common/back-button";
import { api } from "~/trpc/server";
import { canEditBlogPost } from "~/types/blog.types";
import { getTranslations } from "next-intl/server";

export default async function EditBlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await getServerAuthSession();
  const t = await getTranslations("Blog");

  if (!session?.user) {
    return <div>{t("unauthorized")}</div>;
  }

  const post = await api.blog.getBlogPostBySlug(params.slug);

  if (!post || !canEditBlogPost({ user: session.user, post })) {
    return <div>{t("unauthorized")}</div>;
  }

  return (
    <div className="flex flex-col justify-center gap-2">
      <div className="flex flex-row items-center gap-4">
        <BackButton />
        <h1 className="text-2xl font-bold">{t("edit_blog_post")}</h1>
      </div>
      <EditBlogPostForm post={post} user={session.user} />
    </div>
  );
}
