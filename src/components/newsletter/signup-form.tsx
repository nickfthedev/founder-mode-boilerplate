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

const NewsletterSignupSchema = z.object({
  email: z.string().email(),
});

export function NewsletterSignupForm() {
  const toast = useToast();
  const form = useForm<z.infer<typeof NewsletterSignupSchema>>({
    resolver: zodResolver(NewsletterSignupSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = api.user.signUpForNewsletter.useMutation({
    onSuccess: () => {
      toast.toast({
        title: "Newsletter",
        description:
          "You have been added to the newsletter. Please check your email for a confirmation link.",
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
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
