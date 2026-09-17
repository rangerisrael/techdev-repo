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

function formTags(formData: FormData): string[] {
  return formString(formData, "tags")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export async function createStackLayer(formData: FormData): Promise<void> {
  await requireAdminSession();
  const repo = getPortfolioAdminRepository();
  const existing = await repo.listStackLayers();

  await repo.createStackLayer({
    layer: formString(formData, "layer"),
    title: formString(formData, "title"),
    tags: formTags(formData),
    wide: formData.get("wide") === "on",
    position: existing.length,
  });

  revalidatePath("/admin/stack-layers");
  revalidatePath("/");
}

export async function updateStackLayer(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = Number(formData.get("id"));

  await getPortfolioAdminRepository().updateStackLayer(id, {
    layer: formString(formData, "layer"),
    title: formString(formData, "title"),
    tags: formTags(formData),
    wide: formData.get("wide") === "on",
    position: formPosition(formData, 0),
  });

  revalidatePath("/admin/stack-layers");
  revalidatePath("/");
}

export async function deleteStackLayer(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = Number(formData.get("id"));

  await getPortfolioAdminRepository().deleteStackLayer(id);

  revalidatePath("/admin/stack-layers");
  revalidatePath("/");
}
