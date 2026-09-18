"use client";

import { useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { UploadImageResult } from "./blog-cover-image-field";

export function BlogBodyField({
  defaultValue,
  uploadAction,
}: {
  defaultValue?: string;
  uploadAction: (formData: FormData) => Promise<UploadImageResult>;
}) {
  const [body, setBody] = useState(defaultValue ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
        insertAtCursor(`![${file.name.replace(/\.[^.]+$/, "")}](${result.url})`);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
  }

  function insertAtCursor(snippet: string, selectWithin?: string): void {
    const textarea = textareaRef.current;
    if (!textarea) {
      setBody((current) => `${current}${current ? "\n\n" : ""}${snippet}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = body.slice(0, start);
    const after = body.slice(end);
    const needsLeadingBreak = before.length > 0 && !before.endsWith("\n\n");
    const needsTrailingBreak = after.length > 0 && !after.startsWith("\n\n");
    const insert = `${needsLeadingBreak ? "\n\n" : ""}${snippet}${needsTrailingBreak ? "\n\n" : ""}`;
    const next = `${before}${insert}${after}`;
    const insertOffset = before.length + (needsLeadingBreak ? 2 : 0);

    setBody(next);
    requestAnimationFrame(() => {
      textarea.focus();
      if (selectWithin) {
        const selectionStart = insertOffset + snippet.indexOf(selectWithin);
        textarea.setSelectionRange(selectionStart, selectionStart + selectWithin.length);
      } else {
        const cursor = before.length + insert.length;
        textarea.setSelectionRange(cursor, cursor);
      }
    });
  }

  function handleInsertCodeBlock(): void {
    const placeholder = "your code here";
    insertAtCursor(`\`\`\`tsx\n${placeholder}\n\`\`\``, placeholder);
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor="body">Body</Label>
        <div className="flex gap-1.5">
          <Button type="button" variant="outline" size="sm" onClick={handleInsertCodeBlock}>
            Code block
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => fileInputRef.current?.click()}
          >
            {isPending ? "Uploading…" : "Insert image"}
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Paragraphs are separated by a blank line. &ldquo;Insert image&rdquo; uploads to Supabase
        Storage and drops in{" "}
        <code className="rounded bg-muted px-1 py-0.5">![alt text](url)</code> at the cursor.
        &ldquo;Code block&rdquo; drops in a fenced snippet — write it as{" "}
        <code className="rounded bg-muted px-1 py-0.5">```tsx optional/filename.tsx</code>{" "}
        followed by the code and a closing <code className="rounded bg-muted px-1 py-0.5">```</code>
        ; it renders highlighted like VSCode.
      </p>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      <Textarea
        ref={textareaRef}
        id="body"
        name="body"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        required
        rows={14}
        placeholder={"First paragraph.\n\nSecond paragraph."}
      />
    </div>
  );
}
