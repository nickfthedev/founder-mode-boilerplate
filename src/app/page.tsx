import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { env } from "~/env";
import { NewsletterSignupForm } from "~/components/newsletter/signup-form";

export default async function Home() {
  const session = await getServerAuthSession();

  const appUrl = env.APP_URL;
  const appName = env.APP_NAME;

  return (
    <HydrateClient>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400">
        Welcome to your dashboard. Here you can manage your products, customers,
        and analytics.
      </p>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Newsletter</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Sign up for our newsletter to get the latest news and updates.
        </p>
        <NewsletterSignupForm />
      </div>
    </HydrateClient>
  );
}
