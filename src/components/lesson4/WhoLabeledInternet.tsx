"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  FacilityContinue,
  FacilityFrame,
  FacilityLine,
  FacilityTitle,
} from "@/components/lesson4/FacilityFrame";
import { useLesson4Copy } from "@/lib/useLesson4Copy";
import { saveLocal } from "@/lib/storage";

type Phase = "catch" | "play" | "reveal";

type Props = {
  onContinue: () => void;
};

export function WhoLabeledInternet({ onContinue }: Props) {
  const { t, labelChoices, nextWordRounds } = useLesson4Copy();
  const [phase, setPhase] = useState<Phase>("catch");
  const [bet, setBet] = useState<string | null>(null);
  const [roundIndex, setRoundIndex] = useState(0);
  const [guess, setGuess] = useState<string | null>(null);

  const round = nextWordRounds[roundIndex];
  const revealedWord = guess !== null;
  const nailed = guess === round.answer;
  const playDone =
    roundIndex >= nextWordRounds.length - 1 && revealedWord;
  const guessLabel =
    round.options.find((option) => option.id === guess)?.label ?? guess;

  function pickBet(id: string) {
    setBet(id);
    saveLocal("lesson4-label-bet", id);
  }

  function pickWord(word: string) {
    if (guess) return;
    setGuess(word);
  }

  function nextRound() {
    if (roundIndex >= nextWordRounds.length - 1) {
      setPhase("reveal");
      return;
    }
    setRoundIndex((i) => i + 1);
    setGuess(null);
  }

  const betChoice = labelChoices.find((c) => c.id === bet);

  return (
    <FacilityFrame>
      <AnimatePresence mode="wait">
        {phase === "catch" ? (
          <motion.div
            key="catch"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <FacilityTitle plaque={t("lesson4.labeled.catch.plaque")}>
              {t("lesson4.labeled.catch.title")}
            </FacilityTitle>
            <FacilityLine>{t("lesson4.labeled.catch.subhead")}</FacilityLine>
            <p className="facility-line mt-5 font-semibold text-[var(--fac-ink)]">
              {t("lesson4.labeled.catch.question")}
            </p>

            <p className="facility-choice-cue mt-6">
              {t("lesson4.shared.chooseOne")}
            </p>
            <div
              className="mt-3 grid max-w-2xl gap-3"
              role="radiogroup"
              aria-label={t("lesson4.labeled.catch.aria")}
            >
              {labelChoices.map((option, i) => {
                const selected = bet === option.id;
                const dimmed = bet !== null && !selected;
                const mark = String.fromCharCode(65 + i);
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => pickBet(option.id)}
                    className={`facility-choice facility-choice-marked${
                      !bet ? " facility-choice-invite" : ""
                    }${selected ? " is-selected" : ""}${dimmed ? " is-dimmed" : ""}`}
                  >
                    <span className="facility-choice-mark" aria-hidden>
                      {mark}
                    </span>
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>

            {bet ? (
              <>
                <p className="mt-5 text-sm text-[var(--fac-ink-soft)]">
                  {t("lesson4.labeled.catch.noted")}
                </p>
                <FacilityContinue
                  label={t("lesson4.labeled.catch.cta")}
                  onClick={() => setPhase("play")}
                />
              </>
            ) : null}
          </motion.div>
        ) : null}

        {phase === "play" ? (
          <motion.div
            key={`play-${round.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <FacilityTitle
              plaque={t("lesson4.labeled.play.plaque", {
                index: roundIndex + 1,
                total: nextWordRounds.length,
              })}
            >
              {t("lesson4.labeled.play.title")}
            </FacilityTitle>
            <FacilityLine>{t("lesson4.labeled.play.subhead")}</FacilityLine>

            <div className="facility-monitor mt-8 max-w-2xl px-5 py-6 sm:px-7">
              <p className="text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
                {round.prompt.replace(
                  "___",
                  revealedWord ? round.answerLabel : "___",
                )}
              </p>

              {!revealedWord ? (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {round.options.map((word) => (
                    <button
                      key={word.id}
                      type="button"
                      onClick={() => pickWord(word.id)}
                      className="facility-choice text-center"
                    >
                      {word.label}
                    </button>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                  aria-live="polite"
                >
                  <p className="text-sm font-semibold text-[var(--fac-accent)]">
                    {nailed
                      ? t("lesson4.labeled.play.authorRight", {
                          answer: round.answerLabel,
                        })
                      : round.ambiguous
                        ? t("lesson4.labeled.play.authorAmbiguous", {
                            answer: round.answerLabel,
                          })
                        : t("lesson4.labeled.play.authorOff", {
                            answer: round.answerLabel,
                          })}
                  </p>
                  {round.ambiguous && !nailed ? (
                    <p className="mt-2 text-sm text-[var(--fac-ink-soft)]">
                      {t("lesson4.labeled.play.closeMiss", {
                        guess: guessLabel ?? "",
                      })}
                    </p>
                  ) : null}
                </motion.div>
              )}
            </div>

            {revealedWord ? (
              <FacilityContinue
                label={
                  playDone
                    ? t("lesson4.labeled.play.seePoint")
                    : t("lesson4.labeled.play.next")
                }
                onClick={nextRound}
              />
            ) : null}
          </motion.div>
        ) : null}

        {phase === "reveal" ? (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FacilityTitle plaque={t("lesson4.labeled.reveal.plaque")}>
              {t("lesson4.labeled.reveal.title")}
            </FacilityTitle>
            <FacilityLine>{t("lesson4.labeled.reveal.subhead")}</FacilityLine>

            {betChoice ? (
              <div className="facility-panel mt-6 max-w-2xl px-5 py-4">
                <p className="facility-eyebrow mb-2">
                  {t("lesson4.labeled.reveal.earlierBet")}
                </p>
                <p className="text-sm text-[var(--fac-ink-soft)]">
                  {betChoice.correct
                    ? t("lesson4.labeled.reveal.youSaidHeld", {
                        label: betChoice.label,
                      })
                    : t("lesson4.labeled.reveal.youSaidMissed", {
                        label: betChoice.label,
                      })}
                </p>
              </div>
            ) : null}

            <div className="facility-panel mt-6 max-w-2xl space-y-3 px-5 py-5">
              <p className="text-sm leading-relaxed text-[var(--fac-ink-soft)]">
                <span className="font-semibold text-[var(--fac-ink)]">
                  {t("lesson4.labeled.reveal.cats")}
                </span>{" "}
                {t("lesson4.labeled.reveal.catsBody")}
              </p>
              <p className="text-sm leading-relaxed text-[var(--fac-ink-soft)]">
                <span className="font-semibold text-[var(--fac-ink)]">
                  {t("lesson4.labeled.reveal.language")}
                </span>{" "}
                {t("lesson4.labeled.reveal.languageBody")}
              </p>
              <p className="text-sm font-semibold text-[var(--fac-accent)]">
                {t("lesson4.labeled.reveal.sameLoop")}
              </p>
            </div>

            <p className="facility-title mt-8 max-w-3xl text-[clamp(1.25rem,3vw,1.75rem)]">
              {t("lesson4.labeled.reveal.punchline")}
            </p>
            <FacilityContinue onClick={onContinue} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </FacilityFrame>
  );
}
