import { z } from "zod";
import { env } from "~/env";

import Stripe from "stripe";
const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-09-30.acacia",
});

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

// Jetzt testen

// settings
// Klicken Sie auf die Schaltfläche zum Bezahlen, um zur Stripe Checkout-Seite weitergeleitet zu werden. Verwenden Sie eine dieser Testkarten, um eine Zahlung zu simulieren.

// Zahlung ist erfolgreich

// 4242 4242 4242 4242
// Zahlung erfordert Autorisierung

// 4000 0025 0000 3155
// Zahlung wird abgelehnt

// 4000 0000 0000 9995

export const stripeRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure
    .input(z.object({ priceLookupKey: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const user = await ctx.db.user.findUnique({
          where: {
            id: ctx.session.user.id,
          },
        });
        if (user?.stripeCustomerId) {
          const session = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${env.APP_URL}/checkout/stripe/`,
          });
          return {
            checkoutSessionUrl: session.url,
          };
        } else {
          // Find price id by name
          const price = await stripe.prices.search({
            query: `active: 'true' AND lookup_key:"${input.priceLookupKey}"`,
          });
          if (price.data.length === 0) {
            throw new Error("Price not found");
          }
          const checkoutSession = await stripe.checkout.sessions.create({
            mode: "payment",
            allow_promotion_codes: true,
            customer_email: user?.email ?? "",
            client_reference_id: user?.id ?? "",
            metadata: {
              userId: user?.id ?? "",
              priceLookupKey: input.priceLookupKey,
            },
            success_url: `${env.APP_URL}/checkout/stripe/?success=true`,
            cancel_url: `${env.APP_URL}/checkout/stripe/?success=false`,
            line_items: [
              {
                price: price.data[0]?.id ?? "",
                quantity: 1,
              },
            ],
          });

          if (env.NODE_ENV === "development") {
            console.log(checkoutSession);
          }

          return {
            checkoutSessionUrl: checkoutSession.url,
          };
        }
      } catch (error) {
        console.error(error);
        if (error instanceof Stripe.errors.StripeError) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Stripe error: ${error.message}`,
            cause: error,
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create checkout session',
        });
      }
    }),
  createPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
    if (!user?.stripeCustomerId) {
      throw new Error("User not found");
    }
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${env.APP_URL}/`,
    });
    return {
      portalSessionUrl: portalSession.url,
    };
  }),
});
