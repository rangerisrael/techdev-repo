import "server-only";

import { desc, eq } from "drizzle-orm";

import { type Database, getDb } from "../client";
import { contactMessagesTable } from "../schema";
import type { ContactMessageRepository } from "./contact-message-repository";
import type { ContactMessageInput } from "@/lib/validation/contact-message";

export class DrizzleContactMessageRepository
  implements ContactMessageRepository
{
  constructor(private readonly db: Database = getDb()) {}

  async create(input: ContactMessageInput): Promise<void> {
    await this.db.insert(contactMessagesTable).values(input);
  }

  async list() {
    return this.db
      .select()
      .from(contactMessagesTable)
      .orderBy(desc(contactMessagesTable.createdAt));
  }

  async setRead(id: number, read: boolean): Promise<void> {
    await this.db
      .update(contactMessagesTable)
      .set({ read })
      .where(eq(contactMessagesTable.id, id));
  }

  async delete(id: number): Promise<void> {
    await this.db
      .delete(contactMessagesTable)
      .where(eq(contactMessagesTable.id, id));
  }
}
