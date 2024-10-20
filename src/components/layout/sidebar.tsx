"use client";

import Link from "next/link";
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
import { canPostBlogPosts } from "~/types/blog.types";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { UserRole } from "~/types/user.types";
import { HomeIcon, NewspaperIcon, UsersIcon, ActivityIcon } from "lucide-react";
import { useState } from "react";
import { canCreatePages } from "~/types/page.types";

export type Navigation = {
  href: string;
  label: string;
  icon: React.ElementType;
};

const navigation: Navigation[] = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/blog", label: "Blog", icon: NewspaperIcon },
  { href: "/contact", label: "Contact", icon: MessageCircleIcon },
];

/**
 * Desktop Sidebar
 */
export function SidebarDesktop() {
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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <DialogTitle className="sr-only">Navigation</DialogTitle>
        <DialogDescription className="sr-only">
          Navigation menu
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
  return (
    <div className="space-y-4">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              My Account
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel className="text-sm font-medium text-muted-foreground">
              Hello, {user.name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/profile" onClick={() => setOpen && setOpen(false)}>
              <DropdownMenuItem>
                <UserCircle className="mr-2 h-4 w-4" />
                My Profile
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            {canPostBlogPosts({ user }) && (
              <>
                <Link
                  href="/blog/new"
                  onClick={() => setOpen && setOpen(false)}
                >
                  <DropdownMenuItem>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    New Blogpost
                  </DropdownMenuItem>
                </Link>
                <Link href="/blog/my" onClick={() => setOpen && setOpen(false)}>
                  <DropdownMenuItem>
                    <FileIcon className="mr-2 h-4 w-4" />
                    My Blogposts
                  </DropdownMenuItem>
                </Link>
              </>
            )}
            <DropdownMenuSeparator />
            {canCreatePages({ user }) && (
              <>
                <Link
                  href="/page/new"
                  onClick={() => setOpen && setOpen(false)}
                >
                  <DropdownMenuItem>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    New Page
                  </DropdownMenuItem>
                </Link>
                <Link href={"/page"} onClick={() => setOpen && setOpen(false)}>
                  <DropdownMenuItem>
                    <FileIcon className="mr-2 h-4 w-4" />
                    All Pages
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />
              </>
            )}
            <Link
              href="/api/auth/signout"
              onClick={() => setOpen && setOpen(false)}
            >
              <DropdownMenuItem>
                <LogOutIcon className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link
            href="/api/auth/signin"
            onClick={() => setOpen && setOpen(false)}
          >
            Login
          </Link>
        </Button>
      )}
      <ThemeToggle />
    </div>
  );
}
