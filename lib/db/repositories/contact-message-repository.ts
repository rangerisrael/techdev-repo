import type { ContactMessageRow } from "@/lib/db/schema";
import type { ContactMessageInput } from "@/lib/validation/contact-message";

/**
 * Visitor-submitted contact messages: written by the public contact form,
 * read/managed by the admin dashboard. Kept as its own repository rather
 * than folded into `PortfolioRepository` or `PortfolioAdminRepository` —
 * it's a different domain (visitor data, not authored site content) with
 * a different access pattern (public create, admin-only read/manage).
 */
export interface ContactMessageRepository {
  create(input: ContactMessageInput): Promise<void>;
  list(): Promise<ContactMessageRow[]>;
  setRead(id: number, read: boolean): Promise<void>;
  delete(id: number): Promise<void>;
}
