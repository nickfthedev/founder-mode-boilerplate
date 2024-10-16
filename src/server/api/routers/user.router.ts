import { UpdateProfileSchema } from "~/types/user.types";
import { createTRPCRouter, protectedProcedure } from "../trpc";


const userRouter = createTRPCRouter({
  updateProfile: protectedProcedure.input(UpdateProfileSchema)
    .mutation(async ({ input, ctx }) => {
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
      } catch (error: any) {
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
      } catch (error: any) {
        if (error?.message.includes("duplicate key value")) {
          if (error?.message.includes("user_email_unique")) {
            return {
              error: "Email already exists. Please sign in.",
            }
          }
          if (error?.message.includes("user_username_unique")) {
            return {
              error: "Username already exists. Please choose another one.",
            }
          }
        }

        return {
          error: error?.message,
        }
      }
    }),
})

export { userRouter }