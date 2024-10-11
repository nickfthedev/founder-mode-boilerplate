"use client";

import { NewBlogPostSchema } from "~/types/blog.types";
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
import { useToast } from "~/hooks/use-toast";
import { useEffect, useState } from "react";

export default function NewBlogPostForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof NewBlogPostSchema>>({
    resolver: zodResolver(NewBlogPostSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const [keywords, setKeywords] = useState<string[]>([]);
  useEffect(() => {
    form.setValue(
      "keywords",
      keywords.map((keyword) => keyword.trim()),
    );
  }, [keywords, form]);

  const { mutate, isPending } = api.blog.createBlogPost.useMutation({
    onSuccess: () => {
      toast({
        title: "Blog post created successfully",
      });
      form.reset();
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Failed to create blog post",
        description: error.message,
      });
    },
  });

  function onSubmit(values: z.infer<typeof NewBlogPostSchema>) {
    mutate({
      ...values,
      keywords,
    });
  }

  return (
    <Card className="w-full px-2 py-6">
      <CardContent className="flex flex-col gap-2">
        <CardTitle>New Blog Post</CardTitle>
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
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Content" rows={10} {...field} />
                  </FormControl>
                  <FormDescription>
                    The content of the blog post.
                  </FormDescription>
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
                  <FormDescription>
                    The keywords of the blog post.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
