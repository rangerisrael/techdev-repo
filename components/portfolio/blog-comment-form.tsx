"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  blogCommentSchema,
  type BlogCommentFormInput,
} from "@/lib/validation/blog-comment";

import { submitBlogComment } from "./blog-engagement-actions";

export function BlogCommentForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<BlogCommentFormInput>({
    resolver: zodResolver(blogCommentSchema),
  });

  function onSubmit(data: BlogCommentFormInput) {
    setFormError(null);

    startTransition(async () => {
      const result = await submitBlogComment(slug, data, honeypot);

      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          if (message) {
            setError(field as keyof BlogCommentFormInput, { message });
          }
        }
        return;
      }

      if (result.formError) {
        setFormError(result.formError);
        return;
      }

      reset();
      setSuccess(true);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
      {/* Honeypot: hidden from sighted users and off the tab order; bots that fill every field trip it. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="comment-company">Company</label>
        <input
          id="comment-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="comment-author">Name</Label>
        <Input id="comment-author" {...register("authorName")} />
        {errors.authorName ? (
          <p className="text-xs text-destructive">{errors.authorName.message}</p>
        ) : null}
      </div>

      <div className="space-y-1">
        <Label htmlFor="comment-message">Comment</Label>
        <Textarea id="comment-message" rows={3} {...register("message")} />
        {errors.message ? (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        ) : null}
      </div>

      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
      {success ? (
        <p role="status" className="text-sm text-muted-foreground">
          Comment posted.
        </p>
      ) : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Posting…" : "Post comment"}
      </Button>
    </form>
  );
}
