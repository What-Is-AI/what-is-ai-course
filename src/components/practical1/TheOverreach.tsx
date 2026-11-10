"use client";

import { useState, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ConnectedContinue,
  ConnectedFrame,
  ConnectedTitle,
} from "@/components/practical1/ConnectedOfficeFrame";
import { ScriptedChat } from "@/components/practical1/ScriptedChat";
import { usePractical1Copy } from "@/lib/usePractical1Copy";

type Phase = "ask" | "land";
type LandBeat = 0 | 1 | 2 | 3;

type Props = {
  onContinue: () => void;
};

const THREAD_MSGS = ["jordan", "sam", "you"] as const;
const CHAIN_STEPS = ["grant", "thread", "note", "customer"] as const;

function LeakedDraft({
  t,
  compact = false,
  flagged = false,
}: {
  t: (key: string) => string;
  compact?: boolean;
  flagged?: boolean;
}) {
  return (
    <div className={`connected-gemini-draft${compact ? " is-compact" : ""}`}>
      <p>{t("practical1.overreach.draft.greeting")}</p>
      <p>{t("practical1.overreach.draft.bodyBefore")}</p>
      {flagged ? (
        <p
          className="connected-leak"
          role="status"
          aria-label={t("practical1.overreach.draft.leakAria")}
        >
          <span className="connected-leak-marker" aria-hidden>
            <AlertTriangle size={16} strokeWidth={2.25} />
          </span>
          <span className="connected-leak-text">
            {t("practical1.overreach.draft.leak")}
          </span>
        </p>
      ) : (
        <p>{t("practical1.overreach.draft.leak")}</p>
      )}
      <p>{t("practical1.overreach.draft.bodyAfter")}</p>
      <p className="whitespace-pre-line">
        {t("practical1.overreach.draft.signoff")}
      </p>
    </div>
  );
}

function LandBeatBlock({
  show,
  className,
  children,
}: {
  show: boolean;
  className?: string;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  if (!show) return null;
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function TheOverreach({ onContinue }: Props) {
  const { t } = usePractical1Copy();
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("ask");
  const [showDraft, setShowDraft] = useState(false);
  const [landBeat, setLandBeat] = useState<LandBeat>(0);

  if (phase === "ask") {
    return (
      <ConnectedFrame>
        <ConnectedTitle plaque={t("practical1.overreach.ask.plaque")}>
          {t("practical1.overreach.ask.title")}
        </ConnectedTitle>

        <aside
          className="connected-thread-peek mt-2 w-full max-w-4xl"
          aria-label={t("practical1.overreach.ask.threadLabel")}
        >
          <div className="connected-thread-peek-head">
            <span className="connected-thread-peek-label">
              {t("practical1.overreach.ask.threadLabel")}
            </span>
            <span className="connected-thread-peek-subject">
              {t("practical1.overreach.ask.threadSubject")}
            </span>
          </div>
          <ul className="connected-thread-peek-list">
            {THREAD_MSGS.map((id) => (
              <li key={id} className="connected-thread-peek-msg">
                <span className="connected-thread-peek-from">
                  {t(`practical1.overreach.ask.thread.${id}.from`)}
                </span>
                <span className="connected-thread-peek-snippet">
                  {t(`practical1.overreach.ask.thread.${id}.snippet`)}
                </span>
              </li>
            ))}
          </ul>
        </aside>

        <ScriptedChat
          prompt={t("practical1.overreach.ask.prompt")}
          note={t("practical1.overreach.ask.note")}
          sendLabel={t("practical1.overreach.ask.send")}
          sent={showDraft}
          onSend={() => setShowDraft(true)}
        >
          <LeakedDraft t={t} />
        </ScriptedChat>
        {showDraft ? (
          <div className="mt-4 w-full max-w-4xl">
            <ConnectedContinue
              className="mt-4"
              label={t("practical1.shared.continue")}
              onClick={() => setPhase("land")}
            />
          </div>
        ) : null}
      </ConnectedFrame>
    );
  }

  return (
    <ConnectedFrame className="connected-mood-sting-local">
      <ConnectedTitle>{t("practical1.overreach.land.title")}</ConnectedTitle>

      <div className="connected-land-layout">
        <aside className="connected-land-artifact">
          <p className="connected-land-artifact-label">
            {t("practical1.overreach.land.artifactLabel")}
          </p>
          <div className="connected-land-draft">
            <LeakedDraft t={t} compact flagged />
          </div>
        </aside>

        <div className="connected-land-beats" aria-live="polite">
          <LandBeatBlock show className="connected-land-beat">
            <p className="connected-land-mechanism">
              {t("practical1.overreach.land.subhead")}
            </p>
          </LandBeatBlock>

          <LandBeatBlock show={landBeat >= 1} className="connected-land-beat">
            <p className="connected-body">
              {t("practical1.overreach.land.callback")}
            </p>
            <ol
              className="connected-land-chain"
              aria-label={t("practical1.chrome.causalChain")}
            >
              {CHAIN_STEPS.map((id, i) => {
                const sting = id === "note" || id === "customer";
                return (
                  <li key={id} className="connected-land-chain-item">
                    <motion.span
                      className={`connected-land-chain-step${
                        sting ? " is-leak" : " is-open"
                      }`}
                      initial={
                        reduceMotion ? false : { opacity: 0.35 }
                      }
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: reduceMotion ? 0 : 0.1 * i,
                        duration: 0.28,
                      }}
                    >
                      {t(`practical1.overreach.land.chain.${id}`)}
                    </motion.span>
                    {i < CHAIN_STEPS.length - 1 ? (
                      <span className="connected-land-chain-arrow" aria-hidden>
                        →
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </LandBeatBlock>

          <LandBeatBlock
            show={landBeat >= 2}
            className="connected-land-beat connected-land-hero"
          >
            <p>{t("practical1.overreach.land.landing")}</p>
          </LandBeatBlock>

          <LandBeatBlock show={landBeat >= 3} className="connected-land-beat">
            <p className="connected-body">
              {t("practical1.overreach.land.whyCantTell")}
            </p>
          </LandBeatBlock>

          {landBeat < 3 ? (
            <ConnectedContinue
              className="mt-5"
              label={t("practical1.shared.continue")}
              onClick={() =>
                setLandBeat((b) => (b + 1) as LandBeat)
              }
            />
          ) : (
            <ConnectedContinue
              className="mt-5"
              label={t("practical1.overreach.land.cta")}
              onClick={onContinue}
            />
          )}
        </div>
      </div>
    </ConnectedFrame>
  );
}
