import { z } from "zod";

const MAX_MESSAGE_LENGTH = 4000;

/**
 * Single source of truth for contact-form validation, shared by the
 * client (react-hook-form's zodResolver, for instant field feedback) and
 * the server action (safeParse, since Server Actions are POST endpoints
 * reachable directly and must never trust client-side validation alone).
 */
export const contactMessageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Enter your name." }),
  email: z
    .string()
    .trim()
    .email({ error: "Enter a valid email address." }),
  message: z
    .string()
    .trim()
    .min(10, { error: "Say a little more — at least 10 characters." })
    .max(MAX_MESSAGE_LENGTH, {
      error: `Keep it under ${MAX_MESSAGE_LENGTH} characters.`,
    }),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

export type ContactMessageFieldErrors = Partial<
  Record<keyof ContactMessageInput, string>
>;
