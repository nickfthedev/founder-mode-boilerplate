"use client";

import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import { useState } from "react";

export function TogglePublishedButton({
  slug,
  published,
}: {
  slug: string;
  published: boolean;
}) {
  const utils = api.useUtils();
  const { toast } = useToast();
  const [isPublished, setIsPublished] = useState(published);
  const togglePublish = api.blog.togglePublished.useMutation({
    onSuccess: () => {
      toast({
        title: `Post ${isPublished ? "unpublished" : "published"}`,
      });
      setIsPublished(!isPublished);
      utils.blog.getBlogPostBySlug.invalidate();
      utils.blog.getBlogPosts.invalidate();
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
      {isPublished ? "Unpublish" : "Publish"}
    </Button>
  );
}
