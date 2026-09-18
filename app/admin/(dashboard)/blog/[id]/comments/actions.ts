"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/auth/dal";
import { getBlogEngagementRepository } from "@/lib/db/repositories";

export async function deleteBlogComment(formData: FormData): Promise<void> {
  await requireAdminSession();

  const commentId = Number(formData.get("commentId"));
  const postId = String(formData.get("postId") ?? "");
  const slug = String(formData.get("slug") ?? "");

  await getBlogEngagementRepository().deleteComment(commentId);

  revalidatePath(`/admin/blog/${postId}/comments`);
  revalidatePath(`/admin/blog/${postId}/edit`);
  if (slug) revalidatePath(`/blog/${slug}`);
  revalidatePath("/blog");
}
