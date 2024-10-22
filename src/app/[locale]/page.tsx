import { getServerAuthSession } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { env } from "~/env";
import { NewsletterSignupForm } from "~/components/newsletter/signup-form";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  // Check if the user is authenticated
  const session = await getServerAuthSession();

  const appUrl = env.APP_URL;
  const appName = env.APP_NAME;

  const t = await getTranslations("Home");

  return (
    <HydrateClient>
      <div className="flex h-screen flex-col gap-4">
        {/* Hero */}
        <div className="mb-12 flex flex-col items-center text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Storyli
          </h1>
          <p className="mb-6 max-w-2xl text-xl text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-2 rounded-lg bg-muted/30 p-6">
          <h2 className="text-xl font-bold">{t("newsletter")}</h2>
          <p className="text-gray-500 dark:text-gray-400">
            {t("newsletter_description")}
          </p>
          <NewsletterSignupForm />
        </div>
      </div>
    </HydrateClient>
  );
}
