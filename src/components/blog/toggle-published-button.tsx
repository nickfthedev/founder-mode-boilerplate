"use client";

import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import { useRouter } from "~/i18n/routing";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Blog");

  const togglePublish = api.blog.togglePublished.useMutation({
    onSuccess: async () => {
      toast({
        title: published ? t("post_unpublished") : t("post_published"),
      });
      await utils.blog.getBlogPostBySlug.invalidate(slug);
      await utils.blog.getBlogPosts.invalidate();
      router.refresh();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: t("failed_to_toggle_publish"),
        description: error.message,
      });
    },
  });

  return (
    <Button
      onClick={() => togglePublish.mutate(slug)}
      disabled={togglePublish.isPending}
    >
      {published ? t("unpublish") : t("publish")}
    </Button>
  );
}
