"use client";

import { useActionState } from "react";

import { loginAdmin, type LoginState } from "@/app/the-other-door/actions";

const initial: LoginState = {};

export function OtherDoorLoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, initial);

  return (
    <form action={action} className="admin-panel mx-auto w-full max-w-md p-8">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
        The other door
        <span className="mt-1 block text-lg font-bold tracking-[0.06em] text-ink-soft">
          IF YOU KNOW YOU KNOW
        </span>
      </h1>

      <label className="mt-8 block">
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-label="Password"
          className="admin-input"
        />
      </label>

      {state.error ? (
        <p className="mt-4 text-sm font-medium text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="btn-primary mt-6 w-full">
        {pending ? "Opening…" : "Open"}
      </button>
    </form>
  );
}
