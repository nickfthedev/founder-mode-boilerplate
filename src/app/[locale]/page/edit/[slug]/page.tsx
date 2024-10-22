import EditPageForm from "~/components/page/edit-page-form";
import { getServerAuthSession } from "~/server/auth";
import BackButton from "~/components/common/back-button";
import { api } from "~/trpc/server";
import { canCreatePages } from "~/types/page.types";
import { getTranslations } from "next-intl/server";

export default async function EditPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await getServerAuthSession();
  const t = await getTranslations("Page");

  if (!session?.user) {
    return <div>{t("unauthorized")}</div>;
  }
  if (!canCreatePages({ user: session.user })) {
    return <div>{t("unauthorized")}</div>;
  }
  const page = await api.page.getPageBySlug(params.slug);

  if (!page) {
    return <div>{t("page_not_found")}</div>;
  }

  return (
    <div className="flex flex-col justify-center gap-2">
      <div className="flex flex-row items-center gap-4">
        <BackButton />
        <h1 className="text-2xl font-bold">{t("edit_page")}</h1>
      </div>
      <EditPageForm page={page} user={session.user} />
    </div>
  );
}
