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

function formTags(formData: FormData): string[] {
  return formString(formData, "tags")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export async function createProject(formData: FormData): Promise<void> {
  await requireAdminSession();
  const repo = getPortfolioAdminRepository();
  const existing = await repo.listProjects();

  await repo.createProject({
    year: formString(formData, "year"),
    category: formString(formData, "category"),
    title: formString(formData, "title"),
    description: formString(formData, "description"),
    tags: formTags(formData),
    position: formPosition(formData, existing.length),
  });

  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function updateProject(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = Number(formData.get("id"));

  await getPortfolioAdminRepository().updateProject(id, {
    year: formString(formData, "year"),
    category: formString(formData, "category"),
    title: formString(formData, "title"),
    description: formString(formData, "description"),
    tags: formTags(formData),
    position: formPosition(formData, 0),
  });

  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = Number(formData.get("id"));

  await getPortfolioAdminRepository().deleteProject(id);

  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}
