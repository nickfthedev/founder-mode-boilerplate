"use client";
import { Button } from "~/components/ui/button";
import { useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import { useRouter } from "~/i18n/routing";
import { useToast } from "~/hooks/use-toast";

/*
 * Newsletter Signout Page
 * Make sure to add the newsletter/signout route to newsletter
 * takes search params: email
 */
export default function NewsletterSignoutPage() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email");
  const mutation = api.user.signOutFromNewsletter.useMutation({
    onSuccess: () => {
      toast.toast({
        title: "Success",
        description:
          "You have been successfully signed out from the newsletter",
      });
      router.push("/");
    },
    onError: () => {
      toast.toast({
        title: "Error",
        description: "Failed to sign out from the newsletter",
      });
    },
  });
  if (!email) {
    return <div>Error. No email provided.</div>;
  }
  return (
    <div className="flex max-w-lg flex-col gap-2">
      <h1>Sign out from newsletter</h1>
      <p>Are you sure you want to sign out from the newsletter?</p>
      <Button onClick={() => mutation.mutate({ email })}>Sign out</Button>
    </div>
  );
}
