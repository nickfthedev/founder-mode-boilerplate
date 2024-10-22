import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

import { Link } from "~/i18n/routing";
import { env } from "~/env";

import { getServerAuthSession } from "~/server/auth";
import {
  SidebarUserMenu,
  SidebarMobile,
  SidebarDesktop,
} from "~/components/layout/sidebar";
import { ThemeProvider } from "next-themes";
import { CookieBanner } from "~/components/cookie-banner/cookie-banner";
import { Toaster } from "~/components/ui/toaster";
import { Footer } from "~/components/layout/footer";
import Image from "next/image";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { routing } from "~/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: env.APP_NAME,
  description: "Wonderful stories for your kids",
  icons: [{ rel: "icon", url: "/logo.png" }],
};

function Brand() {
  return (
    <Link
      href={env.APP_URL}
      className="flex items-center gap-2 font-bold text-primary"
      prefetch={false}
    >
      <Image src="/logo.png" alt={env.APP_NAME} width={32} height={32} />
      <span className="text-lg">{env.APP_NAME}</span>
    </Link>
  );
}

export default async function BaseLayout({
  children,
  locale,
}: Readonly<{ children: React.ReactNode; locale: string }>) {
  const session = await getServerAuthSession();
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <TRPCReactProvider>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <div className="flex min-h-screen w-full">
                {/* Sidebar */}
                <div className="hidden h-full lg:fixed lg:block lg:w-64 lg:shrink-0 lg:border-r">
                  <div className="flex h-full flex-col justify-between px-4 py-6">
                    <div className="flex h-full flex-col">
                      <div className="space-y-6">
                        <Brand />
                        <SidebarDesktop />
                      </div>
                      <div className="mt-auto">
                        <SidebarUserMenu user={session?.user} />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Main content area */}
                <div className="flex flex-1 flex-col lg:ml-64">
                  {/* Mobile header */}
                  <header className="sticky top-0 z-10 border-b bg-background/80 px-4 py-3 backdrop-blur-sm lg:hidden">
                    <div className="flex items-center justify-between">
                      <Brand />
                      <SidebarMobile user={session?.user} />
                    </div>
                  </header>
                  {/* Main content and footer wrapper */}
                  <div className="flex flex-grow flex-col">
                    <main className="flex-grow p-4 lg:p-8">{children}</main>
                    <Footer />
                  </div>
                </div>
              </div>
              <CookieBanner />
              <Toaster />
            </ThemeProvider>
          </NextIntlClientProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
