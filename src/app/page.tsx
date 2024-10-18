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
      <div className="mb-12 flex flex-col items-center text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Welcome to founder-mo.de
        </h1>
        <p className="mb-6 max-w-2xl text-xl text-muted-foreground">
          Boilerplate? Toollist? Launch Platform? Who knows.
        </p>
        <div className="flex gap-4">
          <Link
            href="/about"
            className="rounded-md bg-primary px-4 py-2 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Learn More
          </Link>
          <Link
            href="/signup"
            className="rounded-md border border-primary bg-background px-4 py-2 text-lg font-semibold text-primary hover:bg-primary/10"
          >
            Get Started
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-lg bg-muted/30 p-6">
        <h2 className="text-xl font-bold">Newsletter</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Sign up for our newsletter to get the latest news and updates.
        </p>
        <NewsletterSignupForm />
      </div>
    </HydrateClient>
  );
}
