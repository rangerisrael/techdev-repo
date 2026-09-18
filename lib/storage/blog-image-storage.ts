import "server-only";

import { getStorageClient } from "./client";

const BUCKET = "blog-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"]);

let bucketEnsured = false;

/**
 * Creates the bucket on first use so there's no manual Supabase dashboard
 * setup step. Public, since blog images are meant to be visible on the
 * live site. Cheap to call repeatedly — after the first real creation,
 * every later call short-circuits on `bucketEnsured` without a network
 * round-trip.
 */
async function ensureBucket(): Promise<void> {
  if (bucketEnsured) return;

  const { error } = await getStorageClient().storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: MAX_FILE_SIZE,
  });

  if (error && !/already exists/i.test(error.message)) {
    throw error;
  }
  bucketEnsured = true;
}

export interface UploadedBlogImage {
  url: string;
  path: string;
}

/** Uploads an admin-provided image to Supabase Storage and returns its public URL. */
export async function uploadBlogImage(file: File): Promise<UploadedBlogImage> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Unsupported file type — use PNG, JPEG, WebP, GIF, or AVIF.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image is too large — keep it under 5MB.");
  }

  await ensureBucket();

  const extension = file.name.split(".").pop() || "bin";
  const path = `${crypto.randomUUID()}.${extension}`;

  const client = getStorageClient();
  const { error } = await client.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    throw error;
  }

  const { data } = client.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}
