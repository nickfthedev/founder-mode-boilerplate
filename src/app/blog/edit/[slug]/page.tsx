import EditBlogPostForm from "~/components/blog/edit-blog-post-form";
import { getServerAuthSession } from "~/server/auth";
import BackButton from "~/components/common/back-button";
import { api } from "~/trpc/server";
import { canEditBlogPost } from "~/types/blog.types";

export default async function EditBlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return <div>Unauthorized</div>;
  }

  const post = await api.blog.getBlogPostBySlug(params.slug);

  if (!post || !canEditBlogPost({ user: session.user, post })) {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="flex flex-col justify-center gap-2">
      <div className="flex flex-row items-center gap-4">
        <BackButton />
        <h1 className="text-2xl font-bold">Edit Blog Post</h1>
      </div>
      <EditBlogPostForm post={post} user={session.user} />
    </div>
  );
}
