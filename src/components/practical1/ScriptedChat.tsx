"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";

import { useT } from "@/i18n/LocaleProvider";

type Props = {
  prompt: string;
  note: string;
  sendLabel: string;
  onSend: () => void;
  sent?: boolean;
  /** Visible product label inside the mock chat chrome */
  productLabel?: string;
  children?: ReactNode;
};

/** Scripted Gemini-like chat: types a prompt, then shows user chip + assistant turn. */
export function ScriptedChat({
  prompt,
  note,
  sendLabel,
  onSend,
  sent = false,
  productLabel = "Gemini",
  children,
}: Props) {
  const t = useT();
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(reduceMotion ? prompt : "");
  const done = visible.length >= prompt.length;
  const emptyLabel = t("practical1.chrome.scriptedChat.empty");
  const exampleLabel = t("practical1.chrome.scriptedChat.example");

  useEffect(() => {
    if (reduceMotion) {
      setVisible(prompt);
      return;
    }
    setVisible("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setVisible(prompt.slice(0, i));
      if (i >= prompt.length) window.clearInterval(id);
    }, 28);
    return () => window.clearInterval(id);
  }, [prompt, reduceMotion]);

  return (
    <div className="connected-gemini mt-4 w-full max-w-4xl">
      <p className="connected-composer-note">{note}</p>

      <div
        className={`connected-gemini-window${sent ? " is-sent" : ""}`}
        role="region"
        aria-label={`${productLabel} example chat`}
      >
        <header className="connected-gemini-chrome">
          <span className="connected-gemini-spark" aria-hidden>
            ✦
          </span>
          <span className="connected-gemini-product">{productLabel}</span>
          <span className="connected-gemini-example">{exampleLabel}</span>
        </header>

        <div className="connected-gemini-thread">
          {sent ? (
            <>
              <div className="connected-gemini-user-row">
                <p className="connected-gemini-user-chip">{prompt}</p>
              </div>
              <div className="connected-gemini-assistant">
                <span className="connected-gemini-spark connected-gemini-spark-lg" aria-hidden>
                  ✦
                </span>
                <div className="connected-gemini-assistant-body">{children}</div>
              </div>
            </>
          ) : (
            <p className="connected-gemini-empty">{emptyLabel}</p>
          )}
        </div>

        <div className="connected-gemini-composer">
          <p className="connected-gemini-draft" aria-live="polite">
            {visible}
            {!done ? <span className="connected-gemini-caret" aria-hidden /> : null}
          </p>
          <button
            type="button"
            className="connected-gemini-send"
            onClick={onSend}
            disabled={!done || sent}
            aria-label={sendLabel}
          >
            <ArrowUp className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
