"use client";

import { useLesson7Chrome } from "@/lib/useLesson7Copy";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Optional desk plaque above the surface. */
  plaque?: string;
};

/**
 * Listening desk – simple paper surface for auditioning tracks.
 * Not a mixing console; the room itself is the interface.
 */
export function ListeningDesk({ children, className = "", plaque }: Props) {
  const chrome = useLesson7Chrome();
  const label = chrome.arrive?.listeningDesk ?? "Listening desk";

  return (
    <section className={`lr-desk ${className}`.trim()} aria-label={label}>
      {plaque ? <p className="lr-desk-plaque">{plaque}</p> : null}
      <div className="lr-desk-surface">{children}</div>
    </section>
  );
}
