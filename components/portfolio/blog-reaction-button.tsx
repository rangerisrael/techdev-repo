"use client";

import { Heart } from "lucide-react";
import { useState, useSyncExternalStore, useTransition } from "react";

import { Button } from "@/components/ui/button";

import { reactToBlogPost } from "./blog-engagement-actions";

function storageKey(slug: string): string {
  return `blog-reacted:${slug}`;
}

/**
 * No actual external updates to subscribe to — this browser's reaction flag
 * only ever changes from inside this component (see `handleClick`), which
 * already re-renders via `setJustReacted`. The subscription exists purely
 * so `useSyncExternalStore` can read `localStorage` without the SSR/client
 * hydration mismatch a plain `useState(() => localStorage...)` would cause,
 * and without the `setState`-in-`useEffect` anti-pattern that would trigger.
 */
function subscribe(): () => void {
  return () => {};
}

function getServerReacted(): boolean {
  return false;
}

export function BlogReactionButton({
  slug,
  initialReactions,
}: {
  slug: string;
  initialReactions: number;
}) {
  const [reactions, setReactions] = useState(initialReactions);
  const [justReacted, setJustReacted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const alreadyReacted = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return window.localStorage.getItem(storageKey(slug)) === "1";
      } catch {
        return false;
      }
    },
    getServerReacted
  );
  const reacted = justReacted || alreadyReacted;

  function handleClick() {
    if (reacted || isPending) return;

    startTransition(async () => {
      const result = await reactToBlogPost(slug);
      if (result.error || result.reactions === undefined) return;

      setReactions(result.reactions);
      setJustReacted(true);
      try {
        window.localStorage.setItem(storageKey(slug), "1");
      } catch {
        // Non-critical: worst case, this browser can react again next visit.
      }
    });
  }

  return (
    <Button
      type="button"
      variant={reacted ? "secondary" : "outline"}
      size="sm"
      onClick={handleClick}
      disabled={isPending || reacted}
      aria-pressed={reacted}
      className="gap-1.5"
    >
      <Heart className={reacted ? "fill-current" : undefined} aria-hidden />
      {reactions} {reacted ? "reacted" : "reactions"}
    </Button>
  );
}
