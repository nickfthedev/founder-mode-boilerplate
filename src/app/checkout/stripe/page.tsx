import { AlertCircle, CheckIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckoutButton } from "~/components/stripe/checkoutButton";
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";

export default async function CheckoutStripePage(input: {
  searchParams: { success: string };
}) {
  const session = await getServerAuthSession();
  if (!session) {
    return redirect("/login");
  }

  const success = input.searchParams.success === "true";
  const error = input.searchParams.success === "false";
  if (success) {
    return (
      <main className="flex h-full w-full flex-col items-center justify-center gap-4 p-4">
        <CheckIcon className="h-16 w-16 text-green-500" />
        <h1 className="text-2xl font-bold">Purchase Successful!</h1>
        <p className="max-w-lg text-center text-lg">
          Thank you for your purchase!
        </p>
        <Button variant={"default"} asChild>
          <Link href="/">Home</Link>
        </Button>
      </main>
    );
  }
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 p-4">
      <div className="flex flex-col items-center gap-2">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              An error occurred. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        <h1 className="text-2xl font-bold">Checkout</h1>
        <div className="flex flex-col gap-4 rounded-md border border-muted/50 bg-muted/20 p-4">
          <h2 className="text-xl font-medium tracking-tight">
            Founder-Mode Boilerplate
          </h2>
          <h2 className="text-xl font-semibold tracking-tight text-primary">
            29,99$
          </h2>
          <p className="text-sm">
            You support the development of the Founder-Mode Boilerplate.
          </p>
          <CheckoutButton priceLookupKey="boilerplate">Buy</CheckoutButton>
        </div>
      </div>
    </main>
  );
}
