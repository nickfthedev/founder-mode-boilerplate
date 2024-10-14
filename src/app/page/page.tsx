import Link from "next/link";
import { Button } from "~/components/ui/button";
import { api, HydrateClient } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { PageList } from "~/components/page/page-list";
import { env } from "~/env";
import { canCreatePages } from "~/types/page.types";

export default async function BlogPage() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    return <div>Unauthorized</div>;
  }
  if (!canCreatePages({ user: session.user })) {
    return <div>Unauthorized</div>;
  }

  const pages = await api.page.getAllPages({ limit: 10 });

  return (
    <HydrateClient>
      <div className="flex flex-col gap-4">
        {session && canCreatePages({ user: session.user }) && (
          <Button asChild className="w-fit" variant={"outline"} size={"sm"}>
            <Link href="/page/new">New Page</Link>
          </Button>
        )}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">{env.APP_NAME} Pages</h1>
            <PageList pages={pages} />
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
