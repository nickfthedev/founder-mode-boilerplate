"use client";

import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export function TogglePublishedButton({
  slug,
  published,
}: {
  slug: string;
  published: boolean;
}) {
  const utils = api.useUtils();
  const router = useRouter();
  const { toast } = useToast();
  const togglePublish = api.page.togglePublished.useMutation({
    onSuccess: async () => {
      toast({
        title: `Page ${published ? "unpublished" : "published"}`,
      });
      await utils.page.getPageBySlug.invalidate(slug);
      await utils.page.getAllPages.invalidate();
      router.refresh();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to toggle publish",
        description: error.message,
      });
    },
  });

  return (
    <Button
      onClick={() => togglePublish.mutate(slug)}
      disabled={togglePublish.isPending}
    >
      {published ? "Unpublish" : "Publish"}
    </Button>
  );
}
