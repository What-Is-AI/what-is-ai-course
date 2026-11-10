"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  LibraryContinue,
  LibraryFrame,
  LibraryLine,
  LibraryTitle,
} from "@/components/lesson3/LibraryFrame";
import { useLesson3Copy } from "@/lib/useLesson3Copy";

type Props = {
  onContinue: () => void;
};

function ScaleCompare() {
  const { t } = useLesson3Copy();
  const sparseDots = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: (i % 10) * 11 + 5.5,
        y: Math.floor(i / 10) * 11 + 5.5,
      })),
    [],
  );

  return (
    <div className="mt-5 overflow-hidden rounded-sm border border-[rgba(26,35,48,0.14)] bg-[#0a0c10] px-4 py-5 sm:px-8 sm:py-6">
      <div className="grid gap-6 md:grid-cols-2 md:gap-10">
        <div className="flex flex-col items-center text-center">
          <p className="font-[family-name:var(--font-figtree)] text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#9aa3ad]">
            {t("lesson3.sameBrain.intro.modelA")}
          </p>
          <div className="mt-4 flex h-[7.5rem] w-[7.5rem] items-center justify-center sm:h-[9rem] sm:w-[9rem]">
            <svg viewBox="0 0 110 110" className="h-full w-full" aria-hidden>
              {sparseDots.map((dot, i) => (
                <motion.circle
                  key={dot.id}
                  cx={dot.x}
                  cy={dot.y}
                  r={3.4}
                  fill="#3b82f6"
                  initial={{ opacity: 0, scale: 0.35 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: Math.min(i * 0.01, 0.6),
                    duration: 0.25,
                    ease: "easeOut",
                  }}
                  style={{ transformOrigin: `${dot.x}px ${dot.y}px` }}
                />
              ))}
            </svg>
          </div>
          <p className="mt-4 text-sm text-[#c5cbd2] sm:text-base">
            <span className="text-lg font-semibold text-white sm:text-xl">
              100
            </span>
            {" "}
            {t("lesson3.sameBrain.intro.modelACaption")}
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <p className="font-[family-name:var(--font-figtree)] text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#9aa3ad]">
            {t("lesson3.sameBrain.intro.modelB")}
          </p>
          <div className="mt-4 flex h-[7.5rem] w-[7.5rem] items-center justify-center sm:h-[9rem] sm:w-[9rem]">
            <motion.div
              className="h-full w-full rounded-md"
              style={{ background: "#1e40af" }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden
            />
          </div>
          <p className="mt-4 text-sm text-[#c5cbd2] sm:text-base">
            <span className="text-lg font-semibold text-white sm:text-xl">
              10,000,000
            </span>
            {" "}
            {t("lesson3.sameBrain.intro.modelBCaption")}
          </p>
        </div>
      </div>
    </div>
  );
}

export function SameBrain({ onContinue }: Props) {
  const { t, hardImages } = useLesson3Copy();
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<"a" | "b" | null>(null);
  const [bWins, setBWins] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const image = hardImages[index];
  const finished = index >= hardImages.length;

  if (phase === "intro") {
    return (
      <LibraryFrame>
        <LibraryTitle plaque={t("lesson3.sameBrain.intro.plaque")}>
          {t("lesson3.sameBrain.intro.title")}
        </LibraryTitle>
        <LibraryLine>{t("lesson3.sameBrain.intro.subhead")}</LibraryLine>
        <ScaleCompare />
        <LibraryContinue
          label={t("lesson3.sameBrain.intro.cta")}
          onClick={() => setPhase("play")}
        />
      </LibraryFrame>
    );
  }

  if (finished || phase === "done") {
    return (
      <LibraryFrame>
        <LibraryTitle plaque={t("lesson3.sameBrain.done.plaque")}>
          {t("lesson3.sameBrain.done.title")}
        </LibraryTitle>
        <div className="max-w-2xl space-y-4">
          <LibraryLine>
            {t("lesson3.sameBrain.done.body1", {
              bWins,
              total: hardImages.length,
            })}
          </LibraryLine>
          <LibraryLine>{t("lesson3.sameBrain.done.body2")}</LibraryLine>
          <LibraryLine>{t("lesson3.sameBrain.done.body3")}</LibraryLine>
        </div>
        <LibraryContinue onClick={onContinue} />
      </LibraryFrame>
    );
  }

  const options = [
    {
      id: "a" as const,
      mark: "A",
      label: t("lesson3.sameBrain.play.optionA"),
    },
    { id: "b" as const, mark: "B", label: t("lesson3.sameBrain.play.optionB") },
  ] as const;

  return (
    <LibraryFrame>
      <LibraryTitle
        compact
        plaque={t("lesson3.sameBrain.play.plaque", {
          index: index + 1,
          total: hardImages.length,
        })}
      >
        {t("lesson3.sameBrain.play.title")}
      </LibraryTitle>
      <LibraryLine compact>{t("lesson3.sameBrain.play.subhead")}</LibraryLine>

      <div className="library-page mt-4 grid w-full overflow-hidden lg:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)]">
        <div className="flex max-h-[13rem] items-center justify-center bg-[rgba(26,35,48,0.04)] p-3 lg:max-h-none lg:min-h-full">
          {image.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={image.id}
              src={image.image}
              alt={image.label}
              className="max-h-[12rem] w-full object-contain lg:max-h-[18rem]"
            />
          ) : (
            <p className="px-6 text-center font-[family-name:var(--font-library)] text-2xl tracking-tight text-ink">
              {image.label}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2.5 px-5 py-4 sm:px-6 sm:py-5">
          <p className="library-eyebrow">{image.label}</p>
          <p className="library-choice-cue">{t("lesson3.shared.chooseOne")}</p>
          <div
            className="flex flex-col gap-2.5"
            role="radiogroup"
            aria-label={t("lesson3.sameBrain.play.chooseAria")}
          >
            {options.map((option) => {
              const isBest = image.betterModel === option.id;
              const isPicked = picked === option.id;
              let stateClass = "";
              if (!revealed) {
                stateClass = !picked
                  ? " library-choice-invite"
                  : isPicked
                    ? " is-selected"
                    : " is-dimmed";
              } else if (image.betterModel === "neither") {
                stateClass = isPicked ? " is-miss" : " is-dimmed";
              } else if (isBest) {
                stateClass = " is-correct";
              } else if (isPicked) {
                stateClass = " is-miss";
              } else {
                stateClass = " is-dimmed";
              }

              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={isPicked}
                  disabled={revealed}
                  onClick={() => setPicked(option.id)}
                  className={`library-choice library-choice-marked library-choice-compact text-left${stateClass}`}
                >
                  <span className="library-choice-mark" aria-hidden>
                    {option.mark}
                  </span>
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {revealed ? (
              <motion.div
                key="note"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-1 border-t border-[var(--lib-paper-edge)] pt-3"
              >
                <p className="text-sm leading-snug text-ink-soft sm:text-[0.95rem] sm:leading-relaxed">
                  {image.note}
                </p>
                <LibraryContinue
                  className="mt-4"
                  label={
                    index === hardImages.length - 1
                      ? t("lesson3.sameBrain.play.seePoint")
                      : t("lesson3.sameBrain.play.next")
                  }
                  onClick={() => {
                    if (picked === "b") setBWins((n) => n + 1);
                    setPicked(null);
                    setRevealed(false);
                    if (index === hardImages.length - 1) setPhase("done");
                    else setIndex((i) => i + 1);
                  }}
                />
              </motion.div>
            ) : (
              <LibraryContinue
                key="reveal"
                className="mt-3"
                label={t("lesson3.sameBrain.play.reveal")}
                disabled={!picked}
                onClick={() => setRevealed(true)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </LibraryFrame>
  );
}
