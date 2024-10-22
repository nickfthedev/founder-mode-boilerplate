import { Link } from "~/i18n/routing";
import { getTranslations } from "next-intl/server";

interface Page {
  title: string;
  id: number;
  content: string;
  keywords: string[];
  slug: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  language: string;
}

export async function PageList({
  pages,
  showLanguage = false,
}: {
  pages: Page[];
  showLanguage?: boolean;
}) {
  const t = await getTranslations("Page");

  if (pages.length === 0) {
    return <div className="text-muted-foreground">{t("no_pages_yet")}</div>;
  }

  return (
    <>
      {pages.map((page) => (
        <div key={page.id} className="w-full px-4 py-2">
          <h2 className="flex flex-row items-center gap-2 text-lg font-bold">
            <Link href={`/page/${page.slug}`}>{page.title}</Link>
            {page.published ? null : (
              <span className="rounded-xl bg-secondary p-1 text-xs text-muted-foreground">
                ({t("draft")})
              </span>
            )}
            {showLanguage && (
              <span className="rounded-xl bg-secondary p-1 text-xs text-muted-foreground">
                {page.language}
              </span>
            )}
          </h2>
          <span className="text-sm text-muted-foreground">
            {t("created")}: {page.createdAt.toLocaleDateString()} /{" "}
            {t("updated")}: {page.updatedAt.toLocaleDateString()}
          </span>
          <div>
            <span className="text-sm text-muted-foreground">
              {page.content.replace(/[#_*~`>]/g, "").slice(0, 100)}...
              <Link href={`/page/${page.slug}`}>{t("read_more")}</Link>
            </span>
          </div>
        </div>
      ))}
    </>
  );
}
