"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/auth/dal";
import { getPortfolioAdminRepository } from "@/lib/db/repositories";

function formString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function saveSiteConfig(formData: FormData): Promise<void> {
  await requireAdminSession();

  await getPortfolioAdminRepository().upsertSiteConfig({
    brand: formString(formData, "brand"),
    kicker: formString(formData, "kicker"),
    headline: formString(formData, "headline"),
    subheadline: formString(formData, "subheadline"),
    primaryCtaLabel: formString(formData, "primaryCtaLabel"),
    primaryCtaHref: formString(formData, "primaryCtaHref"),
    secondaryCtaLabel: formString(formData, "secondaryCtaLabel"),
    secondaryCtaHref: formString(formData, "secondaryCtaHref"),
    footerNote: formString(formData, "footerNote"),
    contactNote: formString(formData, "contactNote"),
  });

  revalidatePath("/admin/site-config");
  revalidatePath("/");
}
