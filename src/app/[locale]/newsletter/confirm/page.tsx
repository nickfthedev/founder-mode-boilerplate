"use client";
import { useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";
import { useRouter } from "~/i18n/routing";
import { useEffect } from "react";

/*
 * Newsletter Confirm Page
 * Make sure to add the newsletter/confirm route to newsletter
 */
export default function NewsletterConfirmPage() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();

  const email = searchParams?.get("email");
  const id = searchParams?.get("id");
  const mutation = api.user.confirmNewsletterSignup.useMutation({
    onSuccess: () => {
      toast.toast({
        title: "Success",
        description: "You have been successfully confirmed for the newsletter",
      });
      router.push("/");
    },
    onError: () => {
      toast.toast({
        title: "Error",
        description: "Failed to confirm newsletter signup",
      });
    },
  });
  useEffect(() => {
    if (email && id) {
      mutation.mutate({ email, id });
    }
  }, []);
  return null;
}
