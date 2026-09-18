"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { slugify } from "@/lib/blog/content";
import { requireAdminSession } from "@/lib/auth/dal";
import { getPortfolioAdminRepository } from "@/lib/db/repositories";
import { uploadBlogImage } from "@/lib/storage/blog-image-storage";

function formString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function formOptionalString(formData: FormData, key: string): string | null {
  const value = formString(formData, key);
  return value === "" ? null : value;
}

function formNumber(formData: FormData, key: string, fallback: number): number {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : fallback;
}

function formTags(formData: FormData): string[] {
  return formString(formData, "tags")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function formPublishedAt(formData: FormData): Date {
  const value = formString(formData, "publishedAt");
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function formImageUrl(formData: FormData, key: string): string | null {
  const value = formString(formData, key);
  return /^https?:\/\//.test(value) ? value : null;
}

export async function createBlogPost(formData: FormData): Promise<void> {
  await requireAdminSession();
  const repo = getPortfolioAdminRepository();

  const title = formString(formData, "title");
  const slug = formString(formData, "slug") || slugify(title);

  await repo.createBlogPost({
    slug,
    title,
    badge: formOptionalString(formData, "badge"),
    authorName: formString(formData, "authorName") || "Israel",
    authorRole: formOptionalString(formData, "authorRole"),
    publishedAt: formPublishedAt(formData),
    tags: formTags(formData),
    summary: formOptionalString(formData, "summary"),
    coverImageUrl: formImageUrl(formData, "coverImageUrl"),
    body: formString(formData, "body"),
    reactions: formNumber(formData, "reactions", 0),
    readTime: formString(formData, "readTime"),
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function updateBlogPost(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  const slug = formString(formData, "slug");

  await getPortfolioAdminRepository().updateBlogPost(id, {
    slug,
    title: formString(formData, "title"),
    badge: formOptionalString(formData, "badge"),
    authorName: formString(formData, "authorName") || "Israel",
    authorRole: formOptionalString(formData, "authorRole"),
    publishedAt: formPublishedAt(formData),
    tags: formTags(formData),
    summary: formOptionalString(formData, "summary"),
    coverImageUrl: formImageUrl(formData, "coverImageUrl"),
    body: formString(formData, "body"),
    reactions: formNumber(formData, "reactions", 0),
    readTime: formString(formData, "readTime"),
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect("/admin/blog");
}

export interface UploadBlogImageResult {
  url?: string;
  error?: string;
}

export async function uploadBlogImageAction(
  formData: FormData
): Promise<UploadBlogImageResult> {
  await requireAdminSession();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image file." };
  }

  try {
    const { url } = await uploadBlogImage(file);
    return { url };
  } catch (error) {
    console.error(
      "[blog-image] upload failed:",
      error instanceof Error ? error.message : error
    );
    return {
      error: error instanceof Error ? error.message : "Upload failed — try again.",
    };
  }
}

export async function deleteBlogPost(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  const slug = formString(formData, "slug");

  await getPortfolioAdminRepository().deleteBlogPost(id);

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
  redirect("/admin/blog");
}
