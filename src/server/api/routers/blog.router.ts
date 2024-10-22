import { canEditBlogPost, NewBlogPostSchema, UpdateBlogPostSchema } from "~/types/blog.types";
import { createTRPCRouter, protectedProcedure, adminProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { canPostBlogPosts, canPostBlogPostAsPageOwner } from "~/types/blog.types";
import { getLocale } from "next-intl/server";

export const blogRouter = createTRPCRouter({
  /**
   * Function to get all blog posts
   */
  getBlogPosts: publicProcedure.input(z.object({ limit: z.number().optional() }).optional()).query(async ({ input, ctx }) => {
    const blogPosts = await ctx.db.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      take: input?.limit,
    });
    return blogPosts;
  }),
  /**
   * Function to get published blog posts
   */
  getPublishedBlogPosts: publicProcedure.input(z.object({ limit: z.number().optional() }).optional()).query(async ({ input, ctx }) => {
    const blogPosts = await ctx.db.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: input?.limit,
    });
    return blogPosts;
  }),
  /**
   * Function to get page owner blog posts
   */
  getPageOwnerBlogPostsFromCurrentLocale: publicProcedure.input(z.object({ limit: z.number().optional() }).optional()).query(async ({ input, ctx }) => {
    const locale = await getLocale();
    const blogPosts = await ctx.db.blogPost.findMany({
      where: { asPageOwner: true, published: true, language: locale },
      orderBy: { createdAt: "desc" },
      take: input?.limit,
    });
    return blogPosts;
  }),
  /**
   * Function to get user's own blog posts
   */
  getUserSelfBlogPosts: protectedProcedure.query(async ({ ctx }) => {
    const blogPosts = await ctx.db.blogPost.findMany({
      where: { createdById: ctx.session?.user.id },
      orderBy: { createdAt: "desc" },
    });
    return blogPosts;
  }),
  /**
   * Function to get all blog posts from users from the current locale
   */
  getUsersBlogPostsFromCurrentLocale: publicProcedure.input(z.object({ limit: z.number().optional() }).optional()).query(async ({ input, ctx }) => {
    const locale = await getLocale();
    const blogPosts = await ctx.db.blogPost.findMany({
      where: { asPageOwner: false, published: true, language: locale },
      orderBy: { createdAt: "desc" },
      take: input?.limit,
    });
    return blogPosts;
  }),
  /**
   * Function to get all blog posts from a user by userId
   */
  getUserBlogPostsByUserId: publicProcedure.input(z.object({ userId: z.string(), limit: z.number().optional() }).optional()).query(async ({ input, ctx }) => {
    const blogPosts = await ctx.db.blogPost.findMany({
      where: { createdById: input?.userId, published: true },
      orderBy: { createdAt: "desc" },
      take: input?.limit,
      include: {
        createdBy: true,
      }
    });
    return blogPosts;
  }),
  getPublishedBlogPostsByUserId: publicProcedure.input(z.object({ userId: z.string(), limit: z.number().optional() }).optional()).query(async ({ input, ctx }) => {
    const blogPosts = await ctx.db.blogPost.findMany({
      where: { createdById: input?.userId, published: true },
      orderBy: { createdAt: "desc" },
      take: input?.limit,
    });
    return blogPosts;
  }),
  /** 
   * Function to get a blog post by slug
   */
  getBlogPostBySlug: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const blogPost = await ctx.db.blogPost.findUnique({
      where: { slug: input },
      include: {
        createdBy: true,
      }
    });
    return blogPost;
  }),
  /**
   * Function to create a new blog post
   */
  createBlogPost: protectedProcedure.input(NewBlogPostSchema).mutation(async ({ input, ctx }) => {
    const { title, content, keywords, asPageOwner, language } = input;
    if (
      !(canPostBlogPosts({ user: ctx.session.user }) ||
        canPostBlogPostAsPageOwner({ user: ctx.session.user }))
    ) {
      throw new Error("You are not allowed to post blog posts");
    }
    if (asPageOwner && !canPostBlogPostAsPageOwner({ user: ctx.session.user })) {
      throw new Error("You are not allowed to post blog posts as page owner");
    }

    const slug = slugify(title);
    const blogPost = await ctx.db.blogPost.create({
      data: {
        title,
        content,
        slug,
        keywords,
        createdById: ctx.session.user.id,
        asPageOwner,
        language,
      },
    });
    return blogPost;
  }),
  /**
   * Function to update a blog post
   */
  updateBlogPost: protectedProcedure.input(UpdateBlogPostSchema).mutation(async ({ input, ctx }) => {
    const { title, content, slug, published, keywords, asPageOwner, language } = input;
    const post = await ctx.db.blogPost.findUnique({
      where: { slug },
    });
    if (!post) {
      throw new Error("Blog post not found");
    }
    if (!canEditBlogPost({ user: ctx.session?.user, post })) {
      throw new Error("You are not allowed to edit this blog post");
    }
    const updatedBlogPost = await ctx.db.blogPost.update({
      where: { slug },
      data: { title, content, published, keywords, asPageOwner, language },
    });
    return updatedBlogPost;
  }),
  /**
   * Function to toggle the published status of a blog post
   */
  togglePublished: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
    const post = await ctx.db.blogPost.findUnique({
      where: { slug: input },
    });
    if (!post) {
      throw new Error("Blog post not found");
    }
    // Check if user is allowed to edit the post
    if (!canEditBlogPost({ user: ctx.session?.user, post })) {
      throw new Error("You are not allowed to toggle the published status of this blog post");
    }
    const updatedBlogPost = await ctx.db.blogPost.update({
      where: { slug: input },
      data: { published: !post.published },
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
