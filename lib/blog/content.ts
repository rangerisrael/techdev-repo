const FENCE_LINE_PATTERN = /^```/;

/**
 * Splits a blog post's stored body (blank-line-separated) into paragraphs
 * for rendering. Fenced code blocks (` ``` `...` ``` `) are kept intact as
 * a single segment even when the code itself contains blank lines — only
 * blank lines outside a fence count as paragraph breaks.
 */
export function splitParagraphs(body: string): string[] {
  const segments: string[] = [];
  let buffer: string[] = [];
  let inFence = false;

  const flush = () => {
    const text = buffer.join("\n").trim();
    if (text) segments.push(text);
    buffer = [];
  };

  for (const line of body.split(/\r?\n/)) {
    if (FENCE_LINE_PATTERN.test(line.trim())) {
      if (!inFence) flush();
      buffer.push(line);
      inFence = !inFence;
      if (!inFence) flush();
      continue;
    }

    if (!inFence && line.trim() === "") {
      flush();
    } else {
      buffer.push(line);
    }
  }
  flush();

  return segments;
}

export interface BodyImageBlock {
  type: "image";
  src: string;
  alt: string;
}

export interface BodyCodeBlock {
  type: "code";
  language: string;
  label?: string;
  code: string;
}

export interface BodyTextBlock {
  type: "text";
  text: string;
}

export type BodyBlock = BodyImageBlock | BodyCodeBlock | BodyTextBlock;

const IMAGE_PARAGRAPH_PATTERN = /^!\[([^\]]*)\]\((https?:\/\/\S+)\)$/;
const CODE_FENCE_PATTERN = /^```([^\n]*)\r?\n([\s\S]*?)\r?\n```$/;

/**
 * A segment can be one of three things the otherwise-plain-text `body`
 * field understands: a fenced code block (` ```lang optional-label ` on
 * its own line, closed by a matching ` ``` `), a lone `![alt](https://...)`
 * image, or plain text. Only http(s) image URLs are accepted, so a stray
 * `javascript:` URL renders as plain text instead of an image tag.
 */
export function parseBodyBlock(segment: string): BodyBlock {
  const codeMatch = segment.match(CODE_FENCE_PATTERN);
  if (codeMatch) {
    const [language, ...labelParts] = codeMatch[1].trim().split(/\s+/);
    const label = labelParts.join(" ").trim();
    return {
      type: "code",
      language: language || "text",
      label: label || undefined,
      code: codeMatch[2],
    };
  }

  const imageMatch = segment.match(IMAGE_PARAGRAPH_PATTERN);
  if (imageMatch) {
    return { type: "image", alt: imageMatch[1], src: imageMatch[2] };
  }

  return { type: "text", text: segment };
}

/** Formats a post's timestamp the way the blog UI displays dates (e.g. "Sep 16"). */
export function formatPostDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

/** Derives a URL-safe slug from a title: lowercase, hyphenated, alphanumeric only. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface TagCount {
  tag: string;
  count: number;
}

/**
 * Every tag used across all posts, ranked by how many posts actually use
 * it (not just insertion order) — derived from posts so the admin never
 * edits it separately. Ties break alphabetically for a stable order. Pass
 * `limit` to cap the list; omit it to get every tag that's been created.
 */
export function deriveTagCloud(posts: { tags: string[] }[], limit?: number): TagCount[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  const ranked = Array.from(counts, ([tag, count]) => ({ tag, count })).sort(
    (a, b) => b.count - a.count || a.tag.localeCompare(b.tag)
  );
  return limit === undefined ? ranked : ranked.slice(0, limit);
}

/** "Active discussions" sidebar, derived from the most-commented posts. */
export function deriveTopDiscussions<T extends { slug: string; title: string; comments: number }>(
  posts: T[],
  limit = 3
): { title: string; comments: number; href: string }[] {
  return [...posts]
    .sort((a, b) => b.comments - a.comments)
    .slice(0, limit)
    .map((post) => ({ title: post.title, comments: post.comments, href: `/blog/${post.slug}` }));
}
