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
import { useRouter } from "~/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useTranslations } from "next-intl";

type Page = {
  id: number;
  title: string;
  content: string;
  slug: string;
  published: boolean;
  keywords: string[];
  updatedAt: Date;
  createdById: string;
  language: string;
};

export default function EditPageForm({
  page,
  user,
}: {
  page: Page;
  user?: { userRole: UserRole };
}) {
  const t = useTranslations("Page");
  const router = useRouter();
  const { toast } = useToast();
  const utils = api.useUtils();

  const form = useForm<z.infer<typeof UpdatePageSchema>>({
    resolver: zodResolver(UpdatePageSchema),
    defaultValues: {
      id: page.id,
      title: page.title,
      content: page.content,
      slug: page.slug,
      published: page.published,
      language: page.language as "en" | "de",
    },
  });

  useEffect(() => {
    if (page) {
      form.reset({
        id: page.id,
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
        title: t("page_updated_success"),
      });
      await utils.page.getPageBySlug.invalidate(page.slug);
      await utils.page.getAllPages.invalidate();
      router.refresh();
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        title: t("page_update_failed"),
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
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("slug")}</FormLabel>
              <FormControl>
                <Input placeholder={t("slug")} {...field} />
              </FormControl>
              <FormDescription>{t("slug_description")}</FormDescription>
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

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormLabel className="w-32">{t("published")}</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormDescription>{t("published_description")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("language")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        <Button type="submit" disabled={isPending}>
          {isPending ? t("updating") : t("update")}
        </Button>
      </form>
    </Form>
  );
}
