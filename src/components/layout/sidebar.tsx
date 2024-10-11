import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Session } from "next-auth";
import { ThemeToggle } from "./theme-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { LogOutIcon, PlusIcon } from "lucide-react";
import { canPostBlogPosts } from "~/types/blog.types";

export default function SidebarUserMenu({
  session,
}: {
  session: Session | null;
}) {
  return (
    <div className="space-y-4">
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              My Account
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel className="text-sm font-medium text-muted-foreground">
              Hello, {session.user?.name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {canPostBlogPosts({ user: session.user }) && (
              <Link href="/blog/new">
                <DropdownMenuItem>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  New Blogpost
                </DropdownMenuItem>
              </Link>
            )}
            <Link href="/api/auth/signout">
              <DropdownMenuItem>
                <LogOutIcon className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href="/api/auth/signin">Login</Link>
        </Button>
      )}
      <ThemeToggle />
    </div>
  );
}
