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

export async function createStatusItem(formData: FormData): Promise<void> {
  await requireAdminSession();
  const repo = getPortfolioAdminRepository();
  const existing = await repo.listStatusItems();

  await repo.createStatusItem({
    label: formString(formData, "label"),
    value: formString(formData, "value"),
    position: formPosition(formData, existing.length),
  });

  revalidatePath("/admin/status-items");
  revalidatePath("/");
  redirect("/admin/status-items");
}

export async function updateStatusItem(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = Number(formData.get("id"));

  await getPortfolioAdminRepository().updateStatusItem(id, {
    label: formString(formData, "label"),
    value: formString(formData, "value"),
    position: formPosition(formData, 0),
  });

  revalidatePath("/admin/status-items");
  revalidatePath("/");
  redirect("/admin/status-items");
}

export async function deleteStatusItem(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = Number(formData.get("id"));

  await getPortfolioAdminRepository().deleteStatusItem(id);

  revalidatePath("/admin/status-items");
  revalidatePath("/");
  redirect("/admin/status-items");
}
