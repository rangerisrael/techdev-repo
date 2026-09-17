"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/auth/dal";
import { getContactMessageRepository } from "@/lib/db/repositories";

export async function markMessageRead(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  const read = formData.get("read") === "true";

  await getContactMessageRepository().setRead(id, read);

  revalidatePath("/admin/messages");
}

export async function deleteMessage(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = Number(formData.get("id"));

  await getContactMessageRepository().delete(id);

  revalidatePath("/admin/messages");
}
