import { Link, redirect } from "~/i18n/routing";
import { Button } from "~/components/ui/button";
import { api, HydrateClient } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { PageList } from "~/components/page/page-list";
import { env } from "~/env";
import { canCreatePages } from "~/types/page.types";
import { getTranslations } from "next-intl/server";

export default async function PagePage() {
  const session = await getServerAuthSession();
  const t = await getTranslations("Page");

  if (!session?.user) {
    return redirect("/");
  }
  if (!canCreatePages({ user: session.user })) {
    return redirect("/");
  }

  const pages = await api.page.getAllPages({ limit: 10 });

  return (
    <HydrateClient>
      <div className="flex flex-col gap-4">
        {session && canCreatePages({ user: session.user }) && (
          <Button asChild className="w-fit" variant={"outline"} size={"sm"}>
            <Link href="/page/new">{t("new_page")}</Link>
          </Button>
        )}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">
              {t("app_name_pages", { appName: env.APP_NAME })}
            </h1>
            <PageList pages={pages} showLanguage={true} />
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
