"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/auth/dal";
import { getPortfolioAdminRepository } from "@/lib/db/repositories";

function formString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function formPosition(formData: FormData, fallback: number): number {
  const value = Number(formData.get("position"));
  return Number.isFinite(value) ? value : fallback;
}

export async function createNavLink(formData: FormData): Promise<void> {
  await requireAdminSession();
  const repo = getPortfolioAdminRepository();
  const existing = await repo.listNavLinks();

  await repo.createNavLink({
    label: formString(formData, "label"),
    href: formString(formData, "href"),
    position: existing.length,
  });

  revalidatePath("/admin/nav-links");
  revalidatePath("/");
}

export async function updateNavLink(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = Number(formData.get("id"));

  await getPortfolioAdminRepository().updateNavLink(id, {
    label: formString(formData, "label"),
    href: formString(formData, "href"),
    position: formPosition(formData, 0),
  });

  revalidatePath("/admin/nav-links");
  revalidatePath("/");
}

export async function deleteNavLink(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = Number(formData.get("id"));

  await getPortfolioAdminRepository().deleteNavLink(id);

  revalidatePath("/admin/nav-links");
  revalidatePath("/");
}
