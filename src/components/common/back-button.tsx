"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

function BackButton({
  className,
  size = "icon",
  variant = "ghost",
}: React.PropsWithChildren<{
  className?: string;
  size?: "icon" | "default" | "sm" | "lg";
  variant?: "ghost" | "default" | "outline" | "secondary" | "destructive";
}>) {
  const router = useRouter();
  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={className}
      onClick={() => router.back()}
    >
      <Link href="/dashboard/">
        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
      </Link>
    </Button>
  );
}

export default BackButton;
