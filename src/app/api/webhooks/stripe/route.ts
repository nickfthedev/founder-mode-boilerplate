import type { NextRequest } from "next/server";
import { env } from "~/env";

import { sendMessageToDiscord } from "~/lib/discord-bot/discord-bot";
import { db } from "~/server/db";

import Stripe from "stripe";
const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-09-30.acacia",
});

export async function POST(req: NextRequest) {
  const signature = req.headers.get("Stripe-Signature") ?? "";
  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(err);
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log(session);
      if (session.payment_status !== "paid") {
        return new Response("Payment status is not paid", { status: 400 });
      }
      const metadata = session.metadata;
      if (!metadata?.priceLookupKey) {
        return new Response("Price lookup key is required", { status: 400 });
      }
      if (!session.client_reference_id) {
        return new Response("Client reference ID is required", { status: 400 });
      }
      const user = await db.user.findUnique({
        where: {
          id: session.client_reference_id,
        },
      });
      if (!user) {
        return new Response("User not found", { status: 404 });
      }
      const priceLookupKey = metadata.priceLookupKey;
      // let credits = 0;
      // let trainingCredits = 0;
      // Here you can add premium flag to the user account, give credits, send an email, or perform other actions
      // Examples:
      // - Set premium status: user.isPremium = true
      // - Add credits: user.credits += purchasedCredits
      // - Send welcome email: await sendWelcomeEmail(user.email)
      // - Trigger any other necessary actions or notifications
      switch (priceLookupKey) {
        case "boilerplate":
          // trainingCredits = 1;
          // credits = 30;
          break;
      }
      // Update user
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          stripeCustomerId: session.customer?.toString() ?? undefined,
          // trainingCredits: {
          //   increment: trainingCredits,
          // },
          // credits: {
          //   increment: credits,
          // },
        },
      });
      // Send a message to your private discord channel to notify you about the new purchase
      await sendMessageToDiscord({
        webhookUrl: env.DISCORD_WEBHOOK_STRIPE,
        content: `Checkout session completed.\n 
        User ID: ${user.id}\n
        Product: ${priceLookupKey}\n
        Email: ${user.email}\n
        Name: ${user.name}\n
        `,
      });
      break;
    // Add more cases for other event types as needed
    default:
      console.log("Unhandled event type:", event.type);
      break;
  }
  return new Response("Webhook received", { status: 200 });
}
