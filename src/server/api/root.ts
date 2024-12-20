import { blogRouter } from "~/server/api/routers/blog.router";
import { pageRouter } from "~/server/api/routers/page.router";
import { userRouter } from "~/server/api/routers/user.router";
import { stripeRouter } from "~/server/api/routers/stripe.router";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { contactRouter } from "./routers/contact.router";
import { storyRouter } from "~/app/[locale]/stories/story.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  page: pageRouter,
  blog: blogRouter,
  user: userRouter,
  stripe: stripeRouter,
  contact: contactRouter,
  story: storyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
