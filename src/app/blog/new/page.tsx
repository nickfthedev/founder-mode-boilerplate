import NewBlogPostForm from "~/components/blog/new-blog-post-form";
import { getServerAuthSession } from "~/server/auth";
import { canPostBlogPosts } from "~/types/blog.types";

export default async function NewBlogPage() {
  const session = await getServerAuthSession();

  if (!session) {
    return <div>Unauthorized</div>;
  }

  if (!canPostBlogPosts({ user: session.user })) {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="flex flex-col justify-center gap-2">
      <NewBlogPostForm userRole={session.user?.userRole} />
    </div>
  );
}
