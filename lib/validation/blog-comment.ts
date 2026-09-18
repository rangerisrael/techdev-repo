import { z } from "zod";

const MAX_MESSAGE_LENGTH = 2000;

/**
 * Single source of truth for the blog comment form, shared by the client
 * (react-hook-form's zodResolver) and the server action (safeParse, since
 * Server Actions are POST endpoints reachable directly).
 */
export const blogCommentSchema = z.object({
  authorName: z
    .string()
    .trim()
    .min(2, { error: "Enter your name." })
    .max(80, { error: "Keep it under 80 characters." }),
  message: z
    .string()
    .trim()
    .min(2, { error: "Say something." })
    .max(MAX_MESSAGE_LENGTH, {
      error: `Keep it under ${MAX_MESSAGE_LENGTH} characters.`,
    }),
});

export type BlogCommentFormInput = z.infer<typeof blogCommentSchema>;

export type BlogCommentFieldErrors = Partial<Record<keyof BlogCommentFormInput, string>>;
