"use client";

import { z } from "zod";
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

// Wrap your component with this provider in a parent component or _app.tsx
export function ReCaptchaProvider({ children }: { children: React.ReactNode }) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}

export default function ContactForm() {
  const { toast } = useToast();
  const { executeRecaptcha } = useGoogleReCaptcha();

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
        title: "Message sent",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        variant: "destructive",
        description: error.message,
      });
    },
  });
  const onSubmit = async (values: z.infer<typeof ContactSchema>) => {
    if (!executeRecaptcha) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "reCAPTCHA not available",
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
            <CardTitle>Kontakt</CardTitle>
            <CardDescription>Wir freuen uns von dir zu hören</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Deine Email"
                  {...form.register("email")}
                />
                {form.formState.errors.email?.message && (
                  <p className="text-sm text-red-500" role="alert">
                    {form.formState.errors.email?.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Dein Name"
                  {...form.register("name")}
                />
                {form.formState.errors.name?.message && (
                  <p className="text-sm text-red-500" role="alert">
                    {form.formState.errors.name?.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="subject">Betreff</Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="Betreff"
                  {...form.register("subject")}
                />
                {form.formState.errors.subject?.message && (
                  <p className="text-sm text-red-500" role="alert">
                    {form.formState.errors.subject?.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="message">Nachricht</Label>
                <Textarea
                  id="message"
                  placeholder="Deine Nachricht"
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
              Senden
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
