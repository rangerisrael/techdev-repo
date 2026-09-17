"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { verifyAdminPassword } from "@/lib/auth/password";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_MS,
} from "@/lib/auth/session";

export interface LoginState {
  error?: string;
}

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  let valid: boolean;
  try {
    valid = password.length > 0 && verifyAdminPassword(password);
  } catch (error) {
    console.error(
      "[admin-auth] login attempted before admin auth was configured:",
      error instanceof Error ? error.message : error
    );
    return { error: "Admin login isn't configured yet." };
  }

  if (!valid) {
    return { error: "Incorrect password." };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
  });

  redirect("/admin");
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/admin/login");
}
