import NewBlogPostForm from "~/components/blog/new-blog-post-form";
import { getServerAuthSession } from "~/server/auth";
import {
  canPostBlogPostAsPageOwner,
  canPostBlogPosts,
} from "~/types/blog.types";
import { getTranslations } from "next-intl/server";

export default async function NewBlogPage() {
  const session = await getServerAuthSession();
  const t = await getTranslations("Blog");

  if (!session) {
    return <div>{t("unauthorized")}</div>;
  }

  if (
    !(
      canPostBlogPosts({ user: session.user }) ||
      canPostBlogPostAsPageOwner({ user: session.user })
    )
  ) {
    return <div>{t("unauthorized")}</div>;
  }

  return (
    <div className="flex flex-col justify-center gap-2">
      <NewBlogPostForm userRole={session.user?.userRole} />
    </div>
  );
}
