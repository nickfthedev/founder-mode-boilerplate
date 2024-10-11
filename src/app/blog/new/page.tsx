import NewBlogPostForm from "~/components/blog/new-blog-post-form";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getServerAuthSession } from "~/server/auth";

export default async function NewBlogPage() {
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
      <NewBlogPostForm />
    </div>
  );
}
