import BaseLayout from "~/components/layout/base-layout";
import NotFoundPage from "~/components/layout/not-found-page";
import { routing } from "~/i18n/routing";

// This page renders when a route like `/unknown.txt` is requested.
// In this case, the layout at `app/[locale]/layout.tsx` receives
// an invalid value as the `[locale]` param and calls `notFound()`.

export default function GlobalNotFound() {
  return (
    <BaseLayout locale={routing.defaultLocale}>
      <NotFoundPage />
    </BaseLayout>
  );
}
