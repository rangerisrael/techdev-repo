"use server";

import { getContactMessageRepository } from "@/lib/db/repositories";
import {
  contactMessageSchema,
  type ContactMessageFieldErrors,
} from "@/lib/validation/contact-message";

export interface ContactActionResult {
  success?: boolean;
  fieldErrors?: ContactMessageFieldErrors;
  formError?: string;
}

/**
 * Handles the public contact form. Called directly from the client
 * (react-hook-form's handleSubmit), not through a `<form action>` — but
 * it's still a Server Function reachable via direct POST (see Next.js's
 * Server Actions security guidance), so the input is re-validated with
 * the same zod schema the client used, never trusted as-is.
 */
export async function submitContactMessage(
  input: unknown,
  honeypot: string
): Promise<ContactActionResult> {
  // Honeypot: a field hidden from real users via CSS. Bots that fill in
  // every input trip it; we pretend to succeed so they don't retry.
  if (honeypot.trim().length > 0) {
    return { success: true };
  }

  const parsed = contactMessageSchema.safeParse(input);
  if (!parsed.success) {
    const flattened = parsed.error.flatten().fieldErrors;
    return {
      fieldErrors: {
        name: flattened.name?.[0],
        email: flattened.email?.[0],
        message: flattened.message?.[0],
      },
    };
  }

  try {
    await getContactMessageRepository().create(parsed.data);
  } catch (error) {
    console.error(
      "[contact-form] failed to save message:",
      error instanceof Error ? error.message : error
    );
    return {
      formError:
        "Something went wrong sending that — try emailing directly instead.",
    };
  }

  return { success: true };
}
