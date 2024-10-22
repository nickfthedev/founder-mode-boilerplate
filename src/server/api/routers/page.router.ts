import { NewPageSchema, UpdatePageSchema, canCreatePages, canSeePage } from "~/types/page.types";
import { createTRPCRouter, protectedProcedure, adminProcedure, publicProcedure } from "../trpc";
import { z } from "zod";

export const pageRouter = createTRPCRouter({
  /**
   * Function to get all pages
   */
  getAllPages: publicProcedure.input(z.object({ limit: z.number().optional() }).optional()).query(async ({ input, ctx }) => {
    const pages = await ctx.db.page.findMany({
      orderBy: { createdAt: "desc" },
      take: input?.limit,
    });
    return pages;
  }),
  /**
   * Function to get published pages
   */
  getPublishedPages: publicProcedure.input(z.object({ limit: z.number().optional() }).optional()).query(async ({ input, ctx }) => {
    const pages = await ctx.db.page.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: input?.limit,
    });
    return pages;
  }),
  /** 
   * Function to get a page by slug
   */
  getPageBySlug: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const page = await ctx.db.page.findUnique({
      where: { slug: input },
    });
    return page;
  }),
  /**
   * Function to create a new page
   */
  createPage: protectedProcedure.input(NewPageSchema).mutation(async ({ input, ctx }) => {
    const { title, content, keywords, language } = input;
    if (!canCreatePages({ user: ctx.session.user })) {
      throw new Error("You are not allowed to create pages");
    }

    const slug = slugify(title);
    const page = await ctx.db.page.create({
      data: {
        title,
        content,
        slug,
        keywords,
        language,
        createdById: ctx.session.user.id,
      },
    });
    return page;
  }),
  /**
   * Function to update a page
   */
  updatePage: protectedProcedure.input(UpdatePageSchema).mutation(async ({ input, ctx }) => {
    const { id, title, content, slug, published, keywords, language } = input;
    const page = await ctx.db.page.findUnique({
      where: { id },
    });
    if (!page) {
      throw new Error("Page not found");
    }
    if (!canCreatePages({ user: ctx.session?.user })) {
      throw new Error("You are not allowed to edit this page");
    }
    const updatedPage = await ctx.db.page.update({
      where: { id: page.id },
      data: { title, content, published, keywords, language, slug },
    });
    return updatedPage;
  }),
  /**
   * Function to toggle the published status of a page
   */
  togglePublished: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
    const page = await ctx.db.page.findUnique({
      where: { slug: input },
    });
    if (!page) {
      throw new Error("Page not found");
    }
    // Check if user is allowed to edit the post
    if (!canCreatePages({ user: ctx.session?.user })) {
      throw new Error("You are not allowed to toggle the published status of this page");
    }
    const updatedPage = await ctx.db.page.update({
      where: { id: page.id },
      data: { published: !page.published },
    });
    return updatedPage;
  }),
});

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars (except spaces and hyphens)
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/--+/g, '-')     // Replace multiple hyphens with single hyphen
    .trim();                  // Trim leading/trailing spaces and hyphens
}
