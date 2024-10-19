import { z } from "zod";
import { ContactSchema } from "~/types/contact.types";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { sendMail } from "~/lib/mail";
import { sendMessageToDiscord } from "~/lib/discord-bot/discord-bot";
import { TRPCError } from "@trpc/server";
import { env } from "~/env";
import { APP_CONFIG } from "~/config/app.config";

// Add this function to verify the reCAPTCHA token
async function verifyRecaptcha(token: string) {
  const secretKey = env.RECAPTCHA_SECRET_KEY;
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  const response = await fetch(verifyUrl, { method: "POST" });
  const data = await response.json();

  return data.success;
}

export const contactRouter = createTRPCRouter({
  sendMessage: publicProcedure
    .input(ContactSchema.extend({ recaptchaToken: z.string() }))
    .mutation(async ({ input }) => {
      const { name, email, subject, message, recaptchaToken } = input;

      // Verify reCAPTCHA token
      const isHuman = await verifyRecaptcha(recaptchaToken);
      if (!isHuman) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "reCAPTCHA verification failed",
        });
      }

      try {
        if (APP_CONFIG.contactEnableDiscord) {
          if (!env.CONTACT_DISCORD_WEBHOOK_URL) {
            throw new Error("Discord webhook URL is not set");
          }
          // Send via discord
          await sendMessageToDiscord({
            webhookUrl: env.CONTACT_DISCORD_WEBHOOK_URL,
            content: `**Name:** ${name}\n**Email:** ${email}\n**Subject:** ${subject}\n**Message:** ${message}`
          })
        }
      }
      catch (error) {
        console.error("Error sending message to discord", error)
        throw new Error("Error sending message to discord")
      }
      try {
        if (APP_CONFIG.contactEnableEmail) {
          if (!APP_CONFIG.contactEmail) {
            throw new Error("Email is not set");
          }
          // Send via email
          await sendMail({
            to: [APP_CONFIG.contactEmail],
            subject: subject,
            html: message,
          })
        }
      }
      catch (error) {
        console.error("Error sending message to email", error)
        throw new Error("Error sending message to email")
      }
    }),
})