import Link from "next/link";

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
}

export function PageList({ pages }: { pages: Page[] }) {
  if (pages.length === 0) {
    return <div className="text-muted-foreground">No pages yet</div>;
  }

  return (
    <>
      {pages.map((page) => (
        <div key={page.id} className="w-full px-4 py-2">
          <h2 className="flex flex-row items-center gap-2 text-lg font-bold">
            <Link href={`/page/${page.slug}`}>{page.title}</Link>
            {page.published ? null : (
              <span className="rounded-xl bg-secondary p-1 text-xs text-muted-foreground">
                (Draft)
              </span>
            )}
          </h2>
          <span className="text-sm text-muted-foreground">
            Created: {page.createdAt.toLocaleDateString()} / Updated:{" "}
            {page.updatedAt.toLocaleDateString()}
          </span>
          <div>
            <span className="text-sm text-muted-foreground">
              {page.content.replace(/[#_*~`>]/g, "").slice(0, 100)}...
              <Link href={`/blog/post/${page.slug}`}>Read more</Link>
            </span>
          </div>
        </div>
      ))}
    </>
  );
}
