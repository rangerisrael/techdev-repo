"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminSession } from "@/lib/auth/dal";
import { getPortfolioAdminRepository } from "@/lib/db/repositories";

function formString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function formPosition(formData: FormData, fallback: number): number {
  const value = Number(formData.get("position"));
  return Number.isFinite(value) ? value : fallback;
}

export async function createContactLink(formData: FormData): Promise<void> {
  await requireAdminSession();
  const repo = getPortfolioAdminRepository();
  const existing = await repo.listContactLinks();

  await repo.createContactLink({
    label: formString(formData, "label"),
    href: formString(formData, "href"),
    position: formPosition(formData, existing.length),
  });

  revalidatePath("/admin/contact-links");
  revalidatePath("/");
  redirect("/admin/contact-links");
}

export async function updateContactLink(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = Number(formData.get("id"));

  await getPortfolioAdminRepository().updateContactLink(id, {
    label: formString(formData, "label"),
    href: formString(formData, "href"),
    position: formPosition(formData, 0),
  });

  revalidatePath("/admin/contact-links");
  revalidatePath("/");
  redirect("/admin/contact-links");
}

export async function deleteContactLink(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = Number(formData.get("id"));

  await getPortfolioAdminRepository().deleteContactLink(id);

  revalidatePath("/admin/contact-links");
  revalidatePath("/");
  redirect("/admin/contact-links");
}
