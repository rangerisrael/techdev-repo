import { describe, expect, it } from "vitest";
import { deriveTagCloud, parseBodyBlock, splitParagraphs } from "../content";

describe("splitParagraphs", () => {
  it("splits plain text on blank lines", () => {
    expect(splitParagraphs("First.\n\nSecond.\n\nThird.")).toEqual([
      "First.",
      "Second.",
      "Third.",
    ]);
  });

  it("keeps a fenced code block intact even when the code has blank lines", () => {
    const body = [
      "Before.",
      "",
      "```ts",
      "function a() {}",
      "",
      "function b() {}",
      "```",
      "",
      "After.",
    ].join("\n");

    expect(splitParagraphs(body)).toEqual([
      "Before.",
      "```ts\nfunction a() {}\n\nfunction b() {}\n```",
      "After.",
    ]);
  });
});

describe("parseBodyBlock", () => {
  it("parses plain text", () => {
    expect(parseBodyBlock("Just text.")).toEqual({ type: "text", text: "Just text." });
  });

  it("parses an image paragraph", () => {
    expect(parseBodyBlock("![a diagram](https://example.com/x.png)")).toEqual({
      type: "image",
      alt: "a diagram",
      src: "https://example.com/x.png",
    });
  });

  it("ignores non-http(s) image URLs, falling back to text", () => {
    const paragraph = "![x](javascript:alert(1))";
    expect(parseBodyBlock(paragraph)).toEqual({ type: "text", text: paragraph });
  });

  it("parses a fenced code block with a language", () => {
    expect(parseBodyBlock("```tsx\nconst a = 1;\n```")).toEqual({
      type: "code",
      language: "tsx",
      label: undefined,
      code: "const a = 1;",
    });
  });

  it("parses a fenced code block with a language and a label", () => {
    expect(parseBodyBlock("```tsx app/[locale]/page.tsx\nconst a = 1;\n```")).toEqual({
      type: "code",
      language: "tsx",
      label: "app/[locale]/page.tsx",
      code: "const a = 1;",
    });
  });

  it("defaults to the \"text\" language for a bare fence", () => {
    expect(parseBodyBlock("```\nplain\n```")).toEqual({
      type: "code",
      language: "text",
      label: undefined,
      code: "plain",
    });
  });
});

describe("deriveTagCloud", () => {
  it("ranks tags by how many posts use them, most-used first", () => {
    const posts = [
      { tags: ["nodejs", "postgres"] },
      { tags: ["nodejs", "aws"] },
      { tags: ["nodejs"] },
      { tags: ["postgres"] },
    ];

    expect(deriveTagCloud(posts)).toEqual([
      { tag: "nodejs", count: 3 },
      { tag: "postgres", count: 2 },
      { tag: "aws", count: 1 },
    ]);
  });

  it("breaks ties alphabetically for a stable order", () => {
    const posts = [{ tags: ["zeta", "alpha"] }, { tags: ["zeta", "alpha"] }];

    expect(deriveTagCloud(posts)).toEqual([
      { tag: "alpha", count: 2 },
      { tag: "zeta", count: 2 },
    ]);
  });

  it("respects the limit after ranking", () => {
    const posts = [{ tags: ["a", "b", "c"] }];

    expect(deriveTagCloud(posts, 2)).toHaveLength(2);
  });

  it("returns every tag ever created when no limit is given", () => {
    const posts = Array.from({ length: 20 }, (_, i) => ({ tags: [`tag-${i}`] }));

    expect(deriveTagCloud(posts)).toHaveLength(20);
  });
});
