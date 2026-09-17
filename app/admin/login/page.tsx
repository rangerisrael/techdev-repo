"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <form
        action={formAction}
        className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-card p-6"
      >
        <div className="space-y-1">
          <h1 className="text-lg font-semibold">Admin login</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to edit the portfolio content.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
          />
        </div>

        {state.error ? (
          <p className="text-sm text-destructive">{state.error}</p>
        ) : null}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
