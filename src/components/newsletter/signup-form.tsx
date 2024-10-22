"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

const NewsletterSignupSchema = z.object({
  email: z.string().email(),
});

export function NewsletterSignupForm() {
  const toast = useToast();
  const t = useTranslations("Newsletter");
  const form = useForm<z.infer<typeof NewsletterSignupSchema>>({
    resolver: zodResolver(NewsletterSignupSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = api.user.signUpForNewsletter.useMutation({
    onSuccess: () => {
      toast.toast({
        title: t("title"),
        description: t("success_message"),
      });
    },
  });
  const onSubmit = (data: z.infer<typeof NewsletterSignupSchema>) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-2"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder={t("email")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? t("submitting") : t("submit")}
        </Button>
      </form>
    </Form>
  );
}
