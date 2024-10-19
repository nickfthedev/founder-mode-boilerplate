import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { env } from "~/env";
import { NewsletterSignupForm } from "~/components/newsletter/signup-form";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { CheckoutButton } from "~/components/stripe/checkoutButton";

export default async function Home() {
  // Check if the user is authenticated
  const session = await getServerAuthSession();

  const appUrl = env.APP_URL;
  const appName = env.APP_NAME;

  return (
    <HydrateClient>
      <div className="flex flex-col gap-4">
        {/* Hero */}
        <div className="mb-12 flex flex-col items-center text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Welcome to founder-mo.de
          </h1>
          <p className="mb-6 max-w-2xl text-xl text-muted-foreground">
            Boilerplate? Toollist? Launch Platform? Who knows.
          </p>
        </div>

        {/* Boilerplate */}
        <div className="flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold">
              NextJS / Typescript Boilerplate
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              A boilerplate for your next project. Built on top of the t3-stack
              by{" "}
              <Link href="https://t3.gg" className="text-blue-500">
                t3.gg
              </Link>
              <br />
              <span className="italic">
                Pay for it, or use it for free. Your choice.
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold">Tech Stack</h3>
            <p className="text-muted-foreground">
              Comes with the latest tech for building solid web apps.
            </p>
            <div className="flex flex-wrap gap-1">
              <Badge className="bg-blue-500 text-white hover:bg-blue-600">
                Next.js
              </Badge>
              <Badge className="bg-orange-500 text-white hover:bg-orange-600">
                Prisma
              </Badge>
              <Badge className="bg-green-500 text-white hover:bg-green-600">
                Tailwind CSS
              </Badge>
              <Badge className="bg-purple-500 text-white hover:bg-purple-600">
                Shadcn/UI
              </Badge>
              <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
                TRPC
              </Badge>
              <Badge className="bg-red-500 text-white hover:bg-red-600">
                AuthJS
              </Badge>
              <Badge className="bg-pink-500 text-white hover:bg-pink-600">
                Resend
              </Badge>
              <Badge className="bg-gray-500 text-white hover:bg-gray-600">
                Stripe
              </Badge>
            </div>
          </div>

          {/* What's included? */}
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">What&apos;s included?</h2>
            <p className="text-gray-500 dark:text-gray-400">
              A list of features that come with this boilerplate.
            </p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline">Authentication</Badge>
              <Badge variant="outline">Database</Badge>
              <Badge variant="outline">Email</Badge>
              <Badge variant="outline">Payment</Badge>
              <Badge variant="outline">Contact Form</Badge>
              <Badge variant="outline">Newsletter</Badge>
              <Badge variant="outline">Blog</Badge>
              <Badge variant="outline">Cookie Banner</Badge>
              <Badge variant="outline">Pages</Badge>
              <Badge variant="outline">Sidebar-Layout</Badge>
              <Badge variant="outline">Dark-/Lightmode</Badge>
              <Badge variant="outline">Users with Profiles</Badge>
              <Badge variant="outline">Allow Users to Post Blogposts</Badge>
              <Badge variant="outline">Configurable via app.config.ts</Badge>
            </div>
          </div>

          {/* Interested? */}
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">Interested?</h2>
            <p className="text-gray-500 dark:text-gray-400">
              As mentioned, you can pay for it, or use it for free. Your choice.
              <br />
              <span className="text-sm text-muted-foreground/50">
                Pro Tip: Sign up for the newsletter to get the latest news and
                updates.
              </span>
            </p>

            <div className="flex flex-row gap-2">
              <CheckoutButton priceLookupKey="boilerplate">
                Buy the Boilerplate
              </CheckoutButton>
              <Button variant="outline" className="w-fit" asChild>
                <Link
                  href={`https://github.com/nickfthedev/founder-mode-boilerplate`}
                >
                  Use it for free
                </Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Boilerplate end */}

        {/* Newsletter */}
        <div className="flex flex-col gap-2 rounded-lg bg-muted/30 p-6">
          <h2 className="text-xl font-bold">Newsletter</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Sign up for the newsletter to get the latest news and updates.
          </p>
          <NewsletterSignupForm />
        </div>
      </div>
    </HydrateClient>
  );
}
