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
import { useToast } from "~/hooks/use-toast";
import { useEffect, useState } from "react";
import BackButton from "../common/back-button";
import { Switch } from "../ui/switch";
import { UserRole } from "~/types/user.types";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function NewBlogPostForm({ userRole }: { userRole: UserRole }) {
  const { toast } = useToast();
  const t = useTranslations("Blog");
  const form = useForm<z.infer<typeof NewBlogPostSchema>>({
    resolver: zodResolver(NewBlogPostSchema),
    defaultValues: {
      title: "",
      content: "",
      asPageOwner: false,
      language: "en",
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
        title: t("blog_post_created_success"),
      });
      form.reset();
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        title: t("blog_post_creation_failed"),
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
    <>
      <div className="flex flex-row items-center gap-4">
        <BackButton />
        <h1 className="text-2xl font-bold">{t("new_blog_post")}</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("title")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("title")} {...field} />
                </FormControl>
                <FormDescription>{t("title_description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("content")}</FormLabel>
                <FormControl>
                  <Textarea placeholder={t("content")} rows={10} {...field} />
                </FormControl>
                <FormDescription>{t("content_description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="keywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("keywords")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("keywords")}
                    value={keywords.join(",")}
                    onChange={(e) => setKeywords(e.target.value.split(","))}
                  />
                </FormControl>
                <FormDescription>{t("keywords_description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {userRole === "ADMIN" && (
            <FormField
              control={form.control}
              name="asPageOwner"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormLabel>{t("as_page_owner")}</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("as_page_owner_description")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("language")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("language")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="en">{t("english")}</SelectItem>
                    <SelectItem value="de">{t("german")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>{t("language_description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? t("submitting") : t("submit")}
          </Button>
        </form>
      </Form>
    </>
  );
}
