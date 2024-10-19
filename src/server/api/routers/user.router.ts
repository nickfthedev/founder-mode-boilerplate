import { UpdateProfileSchema } from "~/types/user.types";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { sendMail } from "~/lib/mail";
import { env } from "~/env";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";

const userRouter = createTRPCRouter({
  /*
  Update Profile
  */
  updateProfile: protectedProcedure.input(UpdateProfileSchema).mutation(async ({ input, ctx }) => {
    const acceptedMarketing = input.acceptedMarketing ?? false
    // Update Newsletter
    try {
      await ctx.db.newsletter.upsert({
        where: {
          email: ctx.session.user.email ?? "",
        },
        update: {
          acceptedMarketing: acceptedMarketing,
        },
        create: {
          email: ctx.session.user.email ?? "",
          acceptedMarketing: acceptedMarketing,
        }
      })
    } catch (error) {
      console.error("Error updating newsletter", error)
    }
    // Update User
    try {
      await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
          username: input.username,
          bio: input.bio !== "" ? input.bio : null,
          location: input.location !== "" ? input.location : null,
          website: input.website !== "" ? input.website : null,
          public: input.public,
          twitter: input.twitter !== "" ? input.twitter : null,
          instagram: input.instagram !== "" ? input.instagram : null,
          facebook: input.facebook !== "" ? input.facebook : null,
          linkedin: input.linkedin !== "" ? input.linkedin : null,
          youtube: input.youtube !== "" ? input.youtube : null,
          tiktok: input.tiktok !== "" ? input.tiktok : null,
          github: input.github !== "" ? input.github : null,
          discord: input.discord !== "" ? input.discord : null,
          twitch: input.twitch !== "" ? input.twitch : null,
        }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[] | undefined;
          if (target?.includes('email')) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: "Email already exists. Please sign in.",
            });
          }
          if (target?.includes('username')) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: "Username already exists. Please choose another one.",
            });
          }
        }
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: "An unexpected error occurred.",
      });
    }
    return { success: true };
  }),
  /*
   * Sign out from newsletter
   * Make sure to add the newsletter/signout route to newsletter
   */
  signOutFromNewsletter: publicProcedure.input(z.object({ email: z.string() })).mutation(async ({ input, ctx }) => {
    await ctx.db.newsletter.delete({
      where: {
        email: input.email,
      },
    })
    return {
      success: true,
    }
  }),
  /*
   * Sign up for newsletter
   * Make sure to add the newsletter/signup route to newsletter
   */
  signUpForNewsletter: publicProcedure.input(z.object({ email: z.string() })).mutation(async ({ input, ctx }) => {
    const newsletter = await ctx.db.newsletter.create({
      data: {
        email: input.email,
        acceptedMarketing: false,
      },
    })

    // Send confirmation email
    await sendMail({
      to: [input.email],
      subject: "Newsletter Confirmation",
      html: `
      <p>Please confirm your email address by clicking the link below.</p>
      <br/>
      <a href="${env.APP_URL}/newsletter/confirm?email=${input.email}&id=${newsletter.id}">Confirm</a>
      `,
    })

    return {
      success: true,
    }
  }),
  /*
   * Confirm Newsletter Signup
   * Make sure to add the newsletter/confirm route to newsletter
   */
  confirmNewsletterSignup: publicProcedure.input(z.object({ email: z.string(), id: z.string() })).mutation(async ({ input, ctx }) => {
    await ctx.db.newsletter.update({
      where: {
        email: input.email,
        id: parseInt(input.id),
      },
      data: {
        acceptedMarketing: true,
      },
    })
  }),
})

export { userRouter }

