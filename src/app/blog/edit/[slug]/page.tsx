import EditBlogPostForm from "~/components/blog/edit-blog-post-form";
import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditBlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await getServerAuthSession();

  if (!session?.user || !session.user.isAdmin) {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="flex flex-col justify-center gap-2">
      <Button asChild variant="ghost" size="icon">
        <Link href="/blog">
          <ArrowLeft className="text-muted-foreground" />
        </Link>
      </Button>
      <EditBlogPostForm slug={params.slug} />
    </div>
  );
}
