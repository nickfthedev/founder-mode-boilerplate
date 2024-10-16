import { UpdateProfileSchema } from "~/types/user.types";
import { createTRPCRouter, protectedProcedure } from "../trpc";


const userRouter = createTRPCRouter({
  updateProfile: protectedProcedure.input(UpdateProfileSchema)
    .mutation(async ({ input, ctx }) => {
      const acceptedMarketing = input.acceptedMarketing ?? false
      console.log("acceptedMarketing", acceptedMarketing)
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