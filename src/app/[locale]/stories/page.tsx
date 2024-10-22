import { Link } from "~/i18n/routing";
import { PlusIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import PageHead from "~/components/common/page-head";
import { getServerAuthSession } from "~/server/auth";
import { canGenerateNewStories } from "./stories.types";

export default async function StoriesPage() {
  const session = await getServerAuthSession();

  return (
    <PageHead
      title="Stories"
      description="Browse already created stories, or search for stories by title."
      button={
        session?.user && canGenerateNewStories(session.user) ? (
          <Button size="icon" className="rounded-full" asChild>
            <Link href="/stories/new">
              <PlusIcon className="h-4 w-4" />
            </Link>
          </Button>
        ) : null
      }
    />
  );
}
