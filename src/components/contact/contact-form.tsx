"use client";

import type { z } from "zod";
import { ContactSchema } from "~/types/contact.types";
import { useForm } from "react-hook-form";
import { Textarea } from "~/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useTranslations } from "next-intl";

// Wrap your component with this provider in a parent component or _app.tsx
export function ReCaptchaProvider({ children }: { children: React.ReactNode }) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}

export default function ContactForm() {
  const { toast } = useToast();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const t = useTranslations("Contact");

  const form = useForm<z.infer<typeof ContactSchema>>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  // Recaptcha
  const mutate = api.contact.sendMessage.useMutation({
    onSuccess: () => {
      toast({
        title: t("message_sent"),
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: t("error"),
        variant: "destructive",
        description: error.message,
      });
    },
  });
  const onSubmit = async (values: z.infer<typeof ContactSchema>) => {
    if (!executeRecaptcha) {
      toast({
        title: t("error"),
        variant: "destructive",
        description: t("recaptcha_error"),
      });
      return;
    }

    const token = await executeRecaptcha("contact_form");
    mutate.mutate({ ...values, recaptchaToken: token });
  };

  return (
    <div className="flex w-full justify-center">
      <Card className="my-8 w-full max-w-3xl">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("email_placeholder")}
                  {...form.register("email")}
                />
                {form.formState.errors.email?.message && (
                  <p className="text-sm text-red-500" role="alert">
                    {form.formState.errors.email?.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">{t("name")}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t("name_placeholder")}
                  {...form.register("name")}
                />
                {form.formState.errors.name?.message && (
                  <p className="text-sm text-red-500" role="alert">
                    {form.formState.errors.name?.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="subject">{t("subject")}</Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder={t("subject_placeholder")}
                  {...form.register("subject")}
                />
                {form.formState.errors.subject?.message && (
                  <p className="text-sm text-red-500" role="alert">
                    {form.formState.errors.subject?.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="message">{t("message")}</Label>
                <Textarea
                  id="message"
                  placeholder={t("message_placeholder")}
                  {...form.register("message")}
                />
                {form.formState.errors.message?.message && (
                  <p className="text-sm text-red-500" role="alert">
                    {form.formState.errors.message?.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full">
              {mutate.isPending ? t("sending") : t("send")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
