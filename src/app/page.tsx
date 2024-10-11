import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { env } from "~/env";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();
  void api.post.getLatest.prefetch();

  const appUrl = env.APP_URL;
  const appName = env.APP_NAME;

  return (
    <HydrateClient>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400">
        Welcome to your dashboard. Here you can manage your products, customers,
        and analytics.
      </p>
    </HydrateClient>
  );
}
