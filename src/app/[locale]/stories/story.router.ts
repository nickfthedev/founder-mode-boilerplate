import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { canGenerateNewStories, CreateStorySchema } from "./stories.types";
import { TRPCError } from "@trpc/server";

export const storyRouter = createTRPCRouter({
  createStory: protectedProcedure.input(CreateStorySchema).mutation(async ({ ctx, input }) => {
    if (!canGenerateNewStories(ctx.session.user)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to generate new stories",
      });
    }

    console.log(input);
  }),
});
