"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  contactMessageSchema,
  type ContactMessageInput,
} from "@/lib/validation/contact-message";

import { submitContactMessage } from "./contact-actions";

export function ContactForm() {
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
  } = useForm<ContactMessageInput>({
    resolver: zodResolver(contactMessageSchema),
  });

  function onSubmit(data: ContactMessageInput) {
    setFormError(null);

    startTransition(async () => {
      const result = await submitContactMessage(data, honeypot);

      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          if (message) {
            setError(field as keyof ContactMessageInput, { message });
          }
        }
        return;
      }

      if (result.formError) {
        setFormError(result.formError);
        return;
      }

      setSuccess(true);
      reset();
    });
  }

  if (success) {
    return (
      <p
        role="status"
        className="rounded-lg border border-border bg-card p-4 text-sm text-foreground"
      >
        Thanks — I&apos;ll get back to you soon.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-3"
    >
      {/* Honeypot: hidden from sighted users and off the tab order; bots that fill every field trip it. Kept as plain state rather than react-hook-form/zod, since it's not real form data. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="contact-name">Name</Label>
          <Input id="contact-name" {...register("name")} />
          {errors.name ? (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          ) : null}
        </div>
        <div className="space-y-1">
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" type="email" {...register("email")} />
          {errors.email ? (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea id="contact-message" rows={4} {...register("message")} />
        {errors.message ? (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        ) : null}
      </div>

      {formError ? (
        <p className="text-sm text-destructive">{formError}</p>
      ) : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
