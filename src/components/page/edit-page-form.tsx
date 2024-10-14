"use client";

import { UpdatePageSchema } from "~/types/page.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/trpc/react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { useEffect, useState } from "react";
import { useToast } from "~/hooks/use-toast";
import type { UserRole } from "~/types/user.types";
import { useRouter } from "next/navigation";

type Page = {
  id: number;
  title: string;
  content: string;
  slug: string;
  published: boolean;
  keywords: string[];
  updatedAt: Date;
  createdById: string;
};

export default function EditPageForm({
  page,
  user,
}: {
  page: Page;
  user?: { userRole: UserRole };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const utils = api.useUtils();

  const form = useForm<z.infer<typeof UpdatePageSchema>>({
    resolver: zodResolver(UpdatePageSchema),
    defaultValues: {
      title: page.title,
      content: page.content,
      slug: page.slug,
      published: page.published,
    },
  });

  useEffect(() => {
    if (page) {
      form.reset({
        title: page.title,
        content: page.content,
        slug: page.slug,
        published: page.published,
      });
    }
  }, [page, form]);

  const [keywords, setKeywords] = useState<string[]>(page.keywords);

  useEffect(() => {
    form.setValue(
      "keywords",
      keywords.map((keyword) => keyword.trim()),
    );
  }, [keywords, form, page]);

  const { mutate, isPending } = api.page.updatePage.useMutation({
    onSuccess: async (page) => {
      toast({
        title: "Page updated successfully",
      });
      await utils.page.getPageBySlug.invalidate(page.slug);
      await utils.page.getAllPages.invalidate();
      router.push(`/page/${page.slug}`);
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Failed to update blog post",
        description: error.message,
      });
    },
  });

  function onSubmit(values: z.infer<typeof UpdatePageSchema>) {
    mutate({ ...values, keywords });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormDescription>The title of the page.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="Slug" {...field} />
              </FormControl>
              <FormDescription>The slug of the page.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Content" rows={10} {...field} />
              </FormControl>
              <FormDescription>The content of the page.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords</FormLabel>
              <FormControl>
                <Input
                  placeholder="Keywords"
                  value={keywords.join(",")}
                  onChange={(e) => setKeywords(e.target.value.split(","))}
                />
              </FormControl>
              <FormDescription>The keywords of the page.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormLabel className="w-32">Published</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormDescription>Whether the page is published.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Updating..." : "Update"}
        </Button>
      </form>
    </Form>
  );
}
