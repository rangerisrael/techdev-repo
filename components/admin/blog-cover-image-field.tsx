"use client";

import { useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface UploadImageResult {
  url?: string;
  error?: string;
}

export function BlogCoverImageField({
  defaultValue,
  uploadAction,
}: {
  defaultValue?: string | null;
  uploadAction: (formData: FormData) => Promise<UploadImageResult>;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadAction(formData);

      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.url) {
        setUrl(result.url);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor="coverImageUrl">Cover image</Label>
      <div className="flex gap-2">
        <Input
          id="coverImageUrl"
          name="coverImageUrl"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://… or upload a file"
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => fileInputRef.current?.click()}
        >
          {isPending ? "Uploading…" : "Upload"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Paste a URL or upload an image (PNG/JPEG/WebP/GIF/AVIF, up to 5MB) — stored in Supabase
        Storage. Leave blank to use the decorative placeholder banner.
      </p>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- previewing an arbitrary host
        <img
          src={url}
          alt=""
          className="mt-2 h-32 w-full rounded-lg border border-border object-cover"
        />
      ) : null}
    </div>
  );
}
