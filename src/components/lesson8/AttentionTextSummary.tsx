"use client";

import { useLesson8Chrome } from "@/lib/useLesson8Copy";
import type { AttentionLink, WordToken } from "@/lib/lesson8-data";

type Props = {
  words: readonly WordToken[];
  links: readonly AttentionLink[];
  /** When set, only list links involving this word (default focus rule). */
  focusWordId?: string | null;
  className?: string;
};

function fillTemplate(
  template: string,
  vars: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] == null ? `{${key}}` : vars[key],
  );
}

/**
 * Text equivalent of an attention view — ranked targets with numeric strength.
 * Required alongside line thickness (script / a11y).
 */
export function AttentionTextSummary({
  words,
  links,
  focusWordId = null,
  className = "",
}: Props) {
  const chrome = useLesson8Chrome();
  const ui = chrome.attention ?? {};

  const byId = new Map(words.map((w) => [w.id, w.text]));
  const visible = links
    .filter((link) => {
      if (!focusWordId) return true;
      return link.fromId === focusWordId || link.toId === focusWordId;
    })
    .slice()
    .sort((a, b) => b.strength - a.strength);

  if (visible.length === 0) return null;

  const focusLabel = focusWordId
    ? (byId.get(focusWordId) ?? focusWordId)
    : null;

  const strengthBand = (strength: number): string => {
    if (strength >= 0.66) return ui.strong ?? "strong";
    if (strength >= 0.33) return ui.medium ?? "medium";
    return ui.weak ?? "weak";
  };

  const parts = visible.map((link) => {
    const otherId =
      focusWordId && link.fromId === focusWordId ? link.toId : link.fromId;
    const other =
      focusWordId != null
        ? (byId.get(otherId) ?? otherId)
        : `${byId.get(link.fromId) ?? link.fromId} → ${byId.get(link.toId) ?? link.toId}`;
    const n = link.strength.toFixed(2);
    return `${other} (${strengthBand(link.strength)}, ${n})`;
  });

  const joined = parts.join("; ");
  const summary = focusLabel
    ? fillTemplate(ui.attendsMostTo ?? "{label} attends most to: {parts}.", {
        label: focusLabel,
        parts: joined,
      })
    : fillTemplate(ui.connections ?? "Connections: {parts}.", {
        parts: joined,
      });

  return (
    <p className={`rr-attention-summary ${className}`.trim()} role="status">
      {summary}
    </p>
  );
}
