"use client";

import {
  canPostBlogPostAsPageOwner,
  UpdateBlogPostSchema,
} from "~/types/blog.types";
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
import { Card, CardContent, CardTitle } from "../ui/card";
import { Switch } from "../ui/switch";
import { useEffect, useState } from "react";
import { useToast } from "~/hooks/use-toast";
import type { UserRole } from "~/types/user.types";

type BlogPost = {
  id: number;
  title: string;
  content: string;
  slug: string;
  published: boolean;
  keywords: string[];
  updatedAt: Date;
  createdById: string;
  asPageOwner: boolean;
};

export default function EditBlogPostForm({
  post,
  user,
}: {
  post: BlogPost;
  user?: { userRole: UserRole };
}) {
  const { toast } = useToast();
  const utils = api.useUtils();

  const form = useForm<z.infer<typeof UpdateBlogPostSchema>>({
    resolver: zodResolver(UpdateBlogPostSchema),
    defaultValues: {
      title: post.title,
      content: post.content,
      slug: post.slug,
      published: post.published,
    },
  });

  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        content: post.content,
        slug: post.slug,
        published: post.published,
        asPageOwner: post.asPageOwner,
      });
    }
  }, [post, form]);

  const [keywords, setKeywords] = useState<string[]>(post.keywords);

  useEffect(() => {
    form.setValue(
      "keywords",
      keywords.map((keyword) => keyword.trim()),
    );
  }, [keywords, form, post]);

  const { mutate, isPending } = api.blog.updateBlogPost.useMutation({
    onSuccess: () => {
      toast({
        title: "Blog post updated successfully",
      });
      void utils.blog.getBlogPostBySlug.invalidate(post.slug);
      void utils.blog.getBlogPosts.invalidate();
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

  function onSubmit(values: z.infer<typeof UpdateBlogPostSchema>) {
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
              <FormDescription>The title of the blog post.</FormDescription>
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
              <FormDescription>The slug of the blog post.</FormDescription>
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
              <FormDescription>The content of the blog post.</FormDescription>
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
              <FormDescription>The keywords of the blog post.</FormDescription>
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
              <FormDescription>
                Whether the blog post is published.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {canPostBlogPostAsPageOwner({ user }) && (
          <FormField
            control={form.control}
            name="asPageOwner"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormLabel className="w-32">As Page Owner</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Whether the blog post is published as a page owner.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Updating..." : "Update"}
        </Button>
      </form>
    </Form>
  );
}
