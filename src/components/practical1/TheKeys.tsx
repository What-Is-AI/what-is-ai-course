"use client";

import { useState } from "react";
import {
  ConnectedContinue,
  ConnectedFrame,
  ConnectedLine,
  ConnectedTitle,
} from "@/components/practical1/ConnectedOfficeFrame";
import { ScriptedChat } from "@/components/practical1/ScriptedChat";
import {
  ACCESS_SCOPE_IDS,
  type AccessScopeId,
} from "@/lib/practical1-data";
import { usePractical1Copy } from "@/lib/usePractical1Copy";
import { saveLocal } from "@/lib/storage";

type Phase = "arrive" | "consent" | "reach";

type Props = {
  onContinue: () => void;
};

export function TheKeys({ onContinue }: Props) {
  const { t, accessScopes } = usePractical1Copy();
  const [phase, setPhase] = useState<Phase>("arrive");
  const [mode, setMode] = useState<"all" | "choose" | null>(null);
  const [scopes, setScopes] = useState<Record<AccessScopeId, boolean>>({
    email: false,
    files: false,
    calendar: false,
    invoices: false,
  });
  const [nudge, setNudge] = useState(false);
  const [showResult, setShowResult] = useState(false);

  function grantAll() {
    const granted = {
      email: true,
      files: true,
      calendar: true,
      invoices: true,
    };
    setScopes(granted);
    saveLocal("practical-1-grants", granted);
    setPhase("reach");
  }

  function tryContinueChoose() {
    if (!scopes.email) {
      setNudge(true);
      return;
    }
    saveLocal("practical-1-grants", scopes);
    setPhase("reach");
  }

  function toggleScope(id: AccessScopeId) {
    setScopes((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (id === "email" && next.email) setNudge(false);
      return next;
    });
  }

  if (phase === "arrive") {
    return (
      <ConnectedFrame>
        <ConnectedTitle plaque={t("practical1.keys.arrive.plaque")}>
          {t("practical1.keys.arrive.title")}
        </ConnectedTitle>
        <ConnectedLine>{t("practical1.keys.arrive.subhead")}</ConnectedLine>
        <ConnectedContinue
          label={t("practical1.keys.arrive.cta")}
          onClick={() => setPhase("consent")}
        />
      </ConnectedFrame>
    );
  }

  if (phase === "consent") {
    return (
      <ConnectedFrame>
        <ConnectedTitle>{t("practical1.keys.consent.title")}</ConnectedTitle>
        <ConnectedLine>{t("practical1.keys.consent.body1")}</ConnectedLine>
        <p className="connected-body mt-2 max-w-3xl">
          {t("practical1.keys.consent.body2")}
        </p>

        <div
          className="connected-consent-row mt-6"
          role="group"
          aria-labelledby="connected-consent-example"
        >
          <aside
            id="connected-consent-example"
            className="connected-example-rail"
          >
            {t("practical1.keys.consent.exampleTag")}
          </aside>

          <div className="connected-consent-main">
            {mode == null ? (
              <>
                <p className="connected-choice-cue">
                  {t("practical1.shared.chooseOne")}
                </p>
                <div
                  className="mt-3 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2"
                  role="radiogroup"
                  aria-label={t("practical1.keys.consent.title")}
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={false}
                    className="connected-door connected-choice-btn connected-choice-invite p-4 text-left"
                    onClick={grantAll}
                  >
                    <span className="connected-choice-mark" aria-hidden>
                      A
                    </span>
                    <span>
                      <span className="font-semibold">
                        {t("practical1.keys.consent.allowEverything")}
                      </span>
                      <span className="mt-2 block text-sm text-[color:var(--connected-ink-soft)]">
                        {t("practical1.keys.consent.allowEverythingNote")}
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={false}
                    className="connected-door connected-choice-btn connected-choice-invite p-4 text-left"
                    onClick={() => setMode("choose")}
                  >
                    <span className="connected-choice-mark" aria-hidden>
                      B
                    </span>
                    <span>
                      <span className="font-semibold">
                        {t("practical1.keys.consent.chooseWhat")}
                      </span>
                      <span className="mt-2 block text-sm text-[color:var(--connected-ink-soft)]">
                        {t("practical1.keys.consent.chooseWhatNote")}
                      </span>
                    </span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="connected-choice-cue">
                  {t("practical1.keys.consent.chooseWhat")}
                </p>
                <div className="connected-scope-grid mt-3">
                  {accessScopes.map((scope) => (
                    <label
                      key={scope.id}
                      className={`connected-scope-row${
                        nudge && scope.id === "email" && !scopes.email
                          ? " is-nudge"
                          : ""
                      }${scopes[scope.id] ? " is-on" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={scopes[scope.id]}
                        onChange={() => toggleScope(scope.id)}
                      />
                      <span>
                        <span className="font-semibold">{scope.label}</span>
                        <span className="mt-0.5 block text-sm text-[color:var(--connected-ink-soft)]">
                          {scope.note}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
                {nudge ? (
                  <p className="connected-nudge mt-3" role="status">
                    {t("practical1.keys.consent.emailNudge")}
                  </p>
                ) : null}
                <ConnectedContinue
                  label={t("practical1.keys.consent.continueChoose")}
                  onClick={tryContinueChoose}
                  disabled={!scopes.email}
                />
              </>
            )}
          </div>
        </div>
      </ConnectedFrame>
    );
  }

  return (
    <ConnectedFrame>
      <ConnectedTitle plaque={t("practical1.keys.reach.plaque")}>
        {t("practical1.keys.reach.title")}
      </ConnectedTitle>
      <div
        className="mt-4 flex flex-wrap gap-2"
        aria-label={t("practical1.chrome.grantedAccess")}
      >
        {ACCESS_SCOPE_IDS.filter((id) => scopes[id]).map((id) => (
          <span key={id} className="connected-key-chip is-on">
            {t(`practical1.keys.scopes.${id}.label`)}
          </span>
        ))}
      </div>

      <ScriptedChat
        prompt={t("practical1.keys.reach.prompt")}
        note={t("practical1.keys.reach.note")}
        sendLabel={t("practical1.keys.reach.send")}
        sent={showResult}
        onSend={() => setShowResult(true)}
      >
        <h3 className="connected-reply-title">
          {t("practical1.keys.reach.replyTitle")}
        </h3>
        <p className="connected-body">
          {t("practical1.keys.reach.replyIntro")}
        </p>
        <ul className="connected-reply-list">
          {(["deadline", "contract", "bug"] as const).map((id) => (
            <li key={id}>
              <strong>
                {t(`practical1.keys.reach.bullets.${id}.topic`)}:
              </strong>{" "}
              {t(`practical1.keys.reach.bullets.${id}.detail`)}
            </li>
          ))}
        </ul>
        <p className="connected-body mt-3 text-sm">
          {t("practical1.keys.reach.replyNote")}
        </p>
      </ScriptedChat>

      {showResult ? (
        <div className="mt-4 w-full max-w-4xl">
          <p className="font-semibold text-[color:var(--connected-access)]">
            {t("practical1.keys.reach.beat")}
          </p>
          <ConnectedContinue
            className="mt-4"
            label={t("practical1.keys.reach.cta")}
            onClick={onContinue}
          />
        </div>
      ) : null}
    </ConnectedFrame>
  );
}
