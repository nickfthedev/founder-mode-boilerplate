import { z } from "zod";


export const NewBlogPostSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters long" }),
  keywords: z.array(z.string()),
})

export const UpdateBlogPostSchema = NewBlogPostSchema.extend({
  slug: z.string(),
  published: z.boolean(),
  keywords: z.array(z.string()),
});