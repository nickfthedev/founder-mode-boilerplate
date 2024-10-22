import type { Metadata, ResolvingMetadata } from "next";
import { Link } from "~/i18n/routing";
import { TogglePublishedButton } from "~/components/page/toggle-published-button";
import BackButton from "~/components/common/back-button";
import { MarkdownRenderer } from "~/components/common/markdown-renderer";
import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { canCreatePages, canSeePage } from "~/types/page.types";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = params;
  const parentData = await parent;
  const parentTitle = parentData.title?.absolute ?? "";
  const t = await getTranslations("Page");
  const page = await api.page.getPageBySlug(slug);

  if (!page?.published) {
    return {
      title: t("page_not_found") + " | " + parentTitle,
    };
  }

  return {
    title: page.title + " | " + parentTitle,
    description: page.content.slice(0, 150),
    ...(page.keywords?.length && { keywords: page.keywords }),
    openGraph: {
      title: page.title + " | " + parentTitle,
      description: page.content.slice(0, 150),
    },
  };
}

export default async function PagePage({ params }: Props) {
  const { slug } = params;
  const session = await getServerAuthSession();
  const page = await api.page.getPageBySlug(slug);
  const t = await getTranslations("Page");

  if (!page) {
    return <div>{t("page_not_found")}</div>;
  }

  // Redirect to the correct locale if the page is not in the current locale
  const locale = await getLocale();
  if (page.language !== locale) {
    return redirect(`/${page.language}/page/${slug}`);
  }

  if (!canSeePage({ user: session?.user, page })) {
    return <div>{t("page_not_found")}</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {canCreatePages({ user: session?.user }) && (
        <div className="flex justify-between gap-2">
          <BackButton />
          <div className="flex gap-2">
            <>
              <TogglePublishedButton
                slug={page.slug}
                published={page.published}
              />
              <Button asChild>
                <Link href={`/page/edit/${page.slug}`}>{t("edit")}</Link>
              </Button>
            </>
          </div>
        </div>
      )}
      <div className="flex w-full flex-col gap-2 px-2 py-4">
        <div className="text-2xl font-bold">{page.title}</div>
        <div className="flex flex-col gap-2 md:flex-row">
          <span className="text-sm text-muted-foreground">
            {t("created")}: {page.createdAt.toLocaleDateString()}
          </span>
          <span className="text-sm text-muted-foreground">
            {t("updated")}: {page.updatedAt.toLocaleDateString()}
          </span>
        </div>
        <div className="prose dark:prose-invert">
          <MarkdownRenderer content={page.content} />
        </div>
      </div>
    </div>
  );
}
