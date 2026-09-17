import { describe, expect, it } from "vitest";

import { contactMessageSchema } from "../contact-message";

const valid = {
  name: "Ada Lovelace",
  email: "ada@gmail.com",
  message: "I'd love to talk about a potential project.",
};

describe("contactMessageSchema", () => {
  it("accepts a well-formed submission and trims whitespace", () => {
    const result = contactMessageSchema.safeParse({
      name: "  Ada Lovelace  ",
      email: "  ada@gmail.com  ",
      message: "  I'd love to talk about a potential project.  ",
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual(valid);
  });

  it("accepts a Gmail address regardless of case", () => {
    const result = contactMessageSchema.safeParse({
      ...valid,
      email: "Ada@GMAIL.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a well-formed email from a non-Gmail domain", () => {
    const result = contactMessageSchema.safeParse({
      ...valid,
      email: "ada@example.com",
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.email?.[0]).toBeTruthy();
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = contactMessageSchema.safeParse({ ...valid, name: "A" });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.name?.[0]).toBeTruthy();
  });

  it("rejects an invalid email address", () => {
    const result = contactMessageSchema.safeParse({
      ...valid,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.email?.[0]).toBeTruthy();
  });

  it("rejects a message under 10 characters", () => {
    const result = contactMessageSchema.safeParse({
      ...valid,
      message: "too short",
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.message?.[0]).toBeTruthy();
  });

  it("rejects a message over 4000 characters", () => {
    const result = contactMessageSchema.safeParse({
      ...valid,
      message: "a".repeat(4001),
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.message?.[0]).toBeTruthy();
  });

  it("reports every invalid field at once", () => {
    const result = contactMessageSchema.safeParse({
      name: "",
      email: "nope",
      message: "short",
    });
    expect(result.success).toBe(false);
    const fieldErrors = result.error?.flatten().fieldErrors;
    expect(fieldErrors?.name?.[0]).toBeTruthy();
    expect(fieldErrors?.email?.[0]).toBeTruthy();
    expect(fieldErrors?.message?.[0]).toBeTruthy();
  });
});
