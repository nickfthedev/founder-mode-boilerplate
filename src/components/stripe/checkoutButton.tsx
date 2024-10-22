"use client";

import { useRouter } from "~/i18n/routing";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";

export const CheckoutButton = ({
  priceLookupKey,
  children,
  className,
}: {
  priceLookupKey: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate, isPending } = api.stripe.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      // Redirect to the checkout page
      router.push(data.checkoutSessionUrl ?? "");
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        title: "There was an error. Please try again later.",
      });
    },
  });
  return (
    <Button
      variant={"default"}
      disabled={isPending}
      onClick={() => {
        mutate({ priceLookupKey });
      }}
      className={className}
    >
      {isPending ? "Loading..." : children}
    </Button>
  );
};
