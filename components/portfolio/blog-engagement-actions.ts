"use server";

import { revalidatePath } from "next/cache";

import { getBlogEngagementRepository } from "@/lib/db/repositories";
import type { BlogComment } from "@/lib/types/portfolio";
import {
  blogCommentSchema,
  type BlogCommentFieldErrors,
} from "@/lib/validation/blog-comment";

export interface BlogCommentActionResult {
  success?: boolean;
  comment?: BlogComment;
  fieldErrors?: BlogCommentFieldErrors;
  formError?: string;
}

/**
 * Handles the public comment form on a blog post. Called directly from the
 * client (react-hook-form's handleSubmit), so — same as the contact
 * form — the input is re-validated server-side, never trusted as-is.
 */
export async function submitBlogComment(
  slug: string,
  input: unknown,
  honeypot: string
): Promise<BlogCommentActionResult> {
  // Honeypot: a field hidden from real users via CSS. Bots that fill in
  // every input trip it; we pretend to succeed so they don't retry.
  if (honeypot.trim().length > 0) {
    return { success: true };
  }

  const parsed = blogCommentSchema.safeParse(input);
  if (!parsed.success) {
    const flattened = parsed.error.flatten().fieldErrors;
    return {
      fieldErrors: {
        authorName: flattened.authorName?.[0],
        message: flattened.message?.[0],
      },
    };
  }

  try {
    const comment = await getBlogEngagementRepository().addComment(slug, parsed.data);
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/blog");
    return { success: true, comment };
  } catch (error) {
    console.error(
      "[blog-comment] failed to save comment:",
      error instanceof Error ? error.message : error
    );
    return { formError: "Something went wrong posting that — try again." };
  }
}

export async function reactToBlogPost(
  slug: string
): Promise<{ reactions?: number; error?: string }> {
  try {
    const reactions = await getBlogEngagementRepository().incrementReactions(slug);
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/blog");
    return { reactions };
  } catch (error) {
    console.error(
      "[blog-reaction] failed to record reaction:",
      error instanceof Error ? error.message : error
    );
    return { error: "Couldn't save that — try again." };
  }
}
