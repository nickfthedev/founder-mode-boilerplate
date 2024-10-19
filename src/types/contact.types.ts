
import { z } from "zod"

export const ContactSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
  email: z.string().email(),
  subject: z.string().min(3, { message: "Subject must be at least 3 characters long" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters long" }),
})