import Link from "next/link";
import { GlobeIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Session } from "next-auth";
import { ThemeToggle } from "./theme-switcher";

export default function SidebarUserMenu({
  session,
}: {
  session: Session | null;
}) {
  return (
    <div className="space-y-4">
      {session ? (
        <Button variant="outline" size="sm" className="w-full">
          Upgrade to Pro
        </Button>
      ) : (
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href="/api/auth/signin">Login</Link>
        </Button>
      )}
      <ThemeToggle />
    </div>
  );
}
