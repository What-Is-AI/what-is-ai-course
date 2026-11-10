"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { useAnalyticsContext } from "@/lib/analytics/context";
import { isAnalyticsConfigured } from "@/lib/analytics/config";
import { getOrCreateUserId } from "@/lib/analytics/identity";
import {
  submitFeedback,
  validateFeedbackMessage,
  type FeedbackKind,
} from "@/lib/analytics/feedback";
import { LESSONS } from "@/lib/lessons";
import { useT } from "@/i18n/LocaleProvider";

type Props = {
  open: boolean;
  onClose: () => void;
  collapsed?: boolean;
};

function resolveLessonId(pathname: string | null): string | null {
  if (!pathname) return null;
  return LESSONS.find((lesson) => pathname.startsWith(lesson.href))?.id ?? null;
}

export function FeedbackDialog({ open, onClose, collapsed = false }: Props) {
  const t = useT();
  const pathname = usePathname();
  const { userId: contextUserId } = useAnalyticsContext();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [kind, setKind] = useState<FeedbackKind>("feedback");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const reset = () => {
    setKind("feedback");
    setMessage("");
    setError(null);
    setSent(false);
    setSubmitting(false);
  };

  const handleClose = () => {
    onClose();
    window.setTimeout(reset, 200);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const validationError = validateFeedbackMessage(message);
    if (validationError) {
      setError(t("nav.feedback.tooShort", { min: 3 }));
      return;
    }

    const userId = contextUserId ?? getOrCreateUserId();
    if (!userId) {
      setError(t("nav.feedback.sendFailed"));
      return;
    }

    setSubmitting(true);

    try {
      await submitFeedback({
        userId,
        kind,
        message,
        pagePath: pathname,
        lessonId: resolveLessonId(pathname),
      });
      setSent(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("not available")) {
        setError(t("nav.feedback.unavailable"));
      } else if (msg.includes("wait a moment")) {
        setError(t("nav.feedback.cooldown"));
      } else {
        setError(t("nav.feedback.sendFailed"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAnalyticsConfigured()) return null;

  return (
    <dialog
      ref={dialogRef}
      className="feedback-dialog"
      aria-labelledby="feedback-dialog-title"
      onClose={handleClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) handleClose();
      }}
    >
      <div className="feedback-dialog-panel">
        <header className="feedback-dialog-header">
          <div>
            <p className="feedback-dialog-kicker">{t("nav.feedback.kicker")}</p>
            <h2 id="feedback-dialog-title" className="feedback-dialog-title">
              {collapsed
                ? t("nav.feedback.titleShort")
                : t("nav.feedback.title")}
            </h2>
          </div>
          <button
            type="button"
            className="feedback-dialog-close"
            onClick={handleClose}
            aria-label={t("nav.feedback.closeAria")}
          >
            ×
          </button>
        </header>

        {sent ? (
          <div className="feedback-dialog-body">
            <p className="feedback-dialog-success">{t("nav.feedback.thanks")}</p>
            <p className="feedback-dialog-note">{t("nav.feedback.note")}</p>
            <button type="button" className="btn-primary mt-6" onClick={handleClose}>
              {t("nav.feedback.close")}
            </button>
          </div>
        ) : (
          <form className="feedback-dialog-body" onSubmit={handleSubmit}>
            <fieldset className="feedback-kind-fieldset">
              <legend className="feedback-kind-legend">{t("nav.feedback.type")}</legend>
              <label className="feedback-kind-option">
                <input
                  type="radio"
                  name="feedback-kind"
                  value="feedback"
                  checked={kind === "feedback"}
                  onChange={() => setKind("feedback")}
                />
                <span>{t("nav.feedback.kindFeedback")}</span>
              </label>
              <label className="feedback-kind-option">
                <input
                  type="radio"
                  name="feedback-kind"
                  value="request"
                  checked={kind === "request"}
                  onChange={() => setKind("request")}
                />
                <span>{t("nav.feedback.kindRequest")}</span>
              </label>
            </fieldset>

            <label className="feedback-message-label" htmlFor="feedback-message">
              {t("nav.feedback.messageLabel")}
            </label>
            <textarea
              id="feedback-message"
              className="feedback-message-input"
              rows={5}
              maxLength={2000}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={
                kind === "request"
                  ? t("nav.feedback.placeholderRequest")
                  : t("nav.feedback.placeholderFeedback")
              }
              required
            />

            {error ? <p className="feedback-dialog-error">{error}</p> : null}

            <div className="feedback-dialog-actions">
              <button
                type="button"
                className="feedback-dialog-secondary"
                onClick={handleClose}
                disabled={submitting}
              >
                {t("nav.feedback.cancel")}
              </button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? t("nav.feedback.sending") : t("nav.feedback.send")}
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}

export function FeedbackTrigger({
  collapsed = false,
}: {
  collapsed?: boolean;
}) {
  const t = useT();
  const [open, setOpen] = useState(false);

  if (!isAnalyticsConfigured()) return null;

  return (
    <>
      <button
        type="button"
        className={`feedback-trigger${collapsed ? " feedback-trigger-collapsed" : ""}`}
        onClick={() => setOpen(true)}
        title={t("nav.feedback.trigger")}
      >
        {collapsed ? "✎" : t("nav.feedback.trigger")}
      </button>
      <FeedbackDialog open={open} onClose={() => setOpen(false)} collapsed={collapsed} />
    </>
  );
}
