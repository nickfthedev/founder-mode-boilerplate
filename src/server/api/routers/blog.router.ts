import { NewBlogPostSchema, UpdateBlogPostSchema } from "~/types/blog.types";
import { createTRPCRouter, adminProcedure, publicProcedure } from "../trpc";
import { z } from "zod";

export const blogRouter = createTRPCRouter({
  getBlogPosts: publicProcedure.query(async ({ ctx }) => {
    const blogPosts = await ctx.db.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
    return blogPosts;
  }),
  getPublishedBlogPosts: publicProcedure
    .input(z.number().optional())
    .query(async ({ input, ctx }) => {
      const blogPosts = await ctx.db.blogPost.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: input,
      });
      return blogPosts;
    }),
  getBlogPostBySlug: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const blogPost = await ctx.db.blogPost.findUnique({
      where: { slug: input },
    });
    return blogPost;
  }),
  createBlogPost: adminProcedure
    .input(NewBlogPostSchema)
    .mutation(async ({ input, ctx }) => {
      const { title, content, keywords } = input;
      const slug = slugify(title);
      const blogPost = await ctx.db.blogPost.create({
        data: { title, content, slug, keywords, createdById: ctx.session.user.id },
      });
      return blogPost;
    }),
  updateBlogPost: adminProcedure.input(UpdateBlogPostSchema).mutation(async ({ input, ctx }) => {
    const { title, content, slug, published, keywords } = input;
    const updatedBlogPost = await ctx.db.blogPost.update({
      where: { slug },
      data: { title, content, published, keywords },
    });
    return updatedBlogPost;
  }),
  togglePublished: adminProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
    const blogPost = await ctx.db.blogPost.findUnique({
      where: { slug: input },
    });
    if (!blogPost) {
      throw new Error("Blog post not found");
    }
    const updatedBlogPost = await ctx.db.blogPost.update({
      where: { slug: input },
      data: { published: !blogPost.published },
    });
    return updatedBlogPost;
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
