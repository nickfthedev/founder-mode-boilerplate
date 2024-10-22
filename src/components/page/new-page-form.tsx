"use client";

import { NewPageSchema } from "~/types/page.types";
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
import { UserRole } from "~/types/user.types";
import { useRouter } from "~/i18n/routing";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function NewPageForm({ userRole }: { userRole: UserRole }) {
  const router = useRouter();
  const t = useTranslations("Page");
  const utils = api.useUtils();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof NewPageSchema>>({
    resolver: zodResolver(NewPageSchema),
    defaultValues: {
      title: "",
      content: "",
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

  const { mutate, isPending } = api.page.createPage.useMutation({
    onSuccess: async (page) => {
      toast({
        title: "Page created successfully",
      });
      await utils.page.getAllPages.invalidate();
      router.push(`/page/${page.slug}`);
      form.reset();
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Failed to create page",
        description: error.message,
      });
    },
  });

  function onSubmit(values: z.infer<typeof NewPageSchema>) {
    mutate({
      ...values,
      keywords,
    });
  }

  return (
    <>
      <div className="flex flex-row items-center gap-4">
        <BackButton />
        <h1 className="text-2xl font-bold">New Page</h1>
      </div>
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
                <FormDescription>
                  The keywords of the page as a comma separated list.
                </FormDescription>
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
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </>
  );
}
