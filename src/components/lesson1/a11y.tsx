"use client";

import { useEffect, useRef } from "react";

/** Polite (or assertive) screen-reader announcement. */
export function LiveRegion({
  message,
  assertive = false,
}: {
  message: string;
  assertive?: boolean;
}) {
  return (
    <p
      className="sr-only"
      aria-live={assertive ? "assertive" : "polite"}
      aria-atomic="true"
    >
      {message}
    </p>
  );
}

/** Move focus to a heading when the screen (or key) mounts/changes. */
export function useFocusHeading(key?: string | number) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      ref.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [key]);

  return ref;
}
