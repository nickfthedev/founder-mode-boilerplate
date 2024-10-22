"use client";

import { Link } from "~/i18n/routing";
import { default as NextLink } from "next/link";
import { Button } from "~/components/ui/button";
import { ThemeToggle } from "./theme-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import {
  LogOutIcon,
  PlusIcon,
  MenuIcon,
  FileIcon,
  UserCircle,
  MessageCircleIcon,
} from "lucide-react";
import {
  canPostBlogPostAsPageOwner,
  canPostBlogPosts,
} from "~/types/blog.types";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { UserRole } from "~/types/user.types";
import { HomeIcon, NewspaperIcon, BookIcon } from "lucide-react";
import { useState } from "react";
import { canCreatePages } from "~/types/page.types";
import { useTranslations } from "next-intl";

export type Navigation = {
  href: string;
  label: string;
  icon: React.ElementType;
};

/**
 * Desktop Sidebar
 */
export function SidebarDesktop() {
  const t = useTranslations("Sidebar");

  const navigation: Navigation[] = [
    { href: "/", label: t("home"), icon: HomeIcon },
    { href: "/stories", label: t("stories"), icon: BookIcon },
    { href: "/blog", label: t("blog"), icon: NewspaperIcon },
    { href: "/contact", label: t("contact"), icon: MessageCircleIcon },
  ];

  return (
    <nav className="space-y-1">
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50"
          prefetch={false}
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

/**
 * Mobile Sidebar
 */
export function SidebarMobile({
  user,
}: {
  user?: {
    name?: string | null;
    userRole: UserRole;
    bannedFromPosting: boolean;
    username?: string | null | undefined;
    public: boolean;
  };
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Sidebar");

  const navigation: Navigation[] = [
    { href: "/", label: t("home"), icon: HomeIcon },
    { href: "/stories", label: t("stories"), icon: BookIcon },
    { href: "/blog", label: t("blog"), icon: NewspaperIcon },
    { href: "/contact", label: t("contact"), icon: MessageCircleIcon },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">{t("toggle_navigation")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <DialogTitle className="sr-only">{t("toggle_navigation")}</DialogTitle>
        <DialogDescription className="sr-only">
          {t("toggle_navigation")}
        </DialogDescription>
        <div className="flex h-full flex-col justify-between px-4 py-6">
          <div className="space-y-6">
            <nav className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50"
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <SidebarUserMenu user={user} setOpen={setOpen} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

/**
 * User Menu
 * Used on Desktop and Mobile
 */
export function SidebarUserMenu({
  user,
  setOpen,
}: {
  user?: {
    name?: string | null;
    userRole: UserRole;
    bannedFromPosting: boolean;
    public: boolean;
    username?: string | null | undefined;
  };
  setOpen?: (open: boolean) => void;
}) {
  const t = useTranslations("Sidebar");

  return (
    <div className="space-y-4">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              {t("my_account")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel className="text-sm font-medium text-muted-foreground">
              {t("welcome", { name: user.name })}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/profile" onClick={() => setOpen && setOpen(false)}>
              <DropdownMenuItem>
                <UserCircle className="mr-2 h-4 w-4" />
                {t("my_profile")}
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            {(canPostBlogPosts({ user }) ||
              canPostBlogPostAsPageOwner({ user })) && (
              <>
                <Link
                  href="/blog/new"
                  onClick={() => setOpen && setOpen(false)}
                >
                  <DropdownMenuItem>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    {t("new_blogpost")}
                  </DropdownMenuItem>
                </Link>
                <Link href="/blog/my" onClick={() => setOpen && setOpen(false)}>
                  <DropdownMenuItem>
                    <FileIcon className="mr-2 h-4 w-4" />
                    {t("my_blogposts")}
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />
              </>
            )}
            {canCreatePages({ user }) && (
              <>
                <Link
                  href="/page/new"
                  onClick={() => setOpen && setOpen(false)}
                >
                  <DropdownMenuItem>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    {t("new_page")}
                  </DropdownMenuItem>
                </Link>
                <Link href={"/page"} onClick={() => setOpen && setOpen(false)}>
                  <DropdownMenuItem>
                    <FileIcon className="mr-2 h-4 w-4" />
                    {t("all_pages")}
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />
              </>
            )}
            <NextLink
              href="/api/auth/signout"
              onClick={() => setOpen && setOpen(false)}
            >
              <DropdownMenuItem>
                <LogOutIcon className="mr-2 h-4 w-4" />
                {t("logout")}
              </DropdownMenuItem>
            </NextLink>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="outline" size="sm" className="w-full" asChild>
          <NextLink
            href="/api/auth/signin"
            onClick={() => setOpen && setOpen(false)}
          >
            {t("login")}
          </NextLink>
        </Button>
      )}
      <ThemeToggle />
    </div>
  );
}
