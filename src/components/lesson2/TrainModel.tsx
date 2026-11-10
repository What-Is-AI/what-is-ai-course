"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import {
  LabContinue,
  LabFrame,
  LabLine,
  LabTitle,
} from "@/components/lesson2/LabFrame";
import { RichText } from "@/i18n/RichText";
import { useLesson2Copy } from "@/lib/useLesson2Copy";
import { useT } from "@/i18n/LocaleProvider";

type Props = {
  onContinue: () => void;
};

type Phase =
  | "compare"
  | "label"
  | "train"
  | "test"
  | "done"
  | "trap"
  | "trap-result"
  | "trap-reveal";

type WorkflowStep = "label" | "train" | "test";
type WorkflowStatus = "done" | "current" | "later";

function workflowStatuses(
  active: WorkflowStep,
): Record<WorkflowStep, WorkflowStatus> {
  const order: WorkflowStep[] = ["label", "train", "test"];
  const activeIndex = order.indexOf(active);
  return {
    label: activeIndex > 0 ? "done" : activeIndex === 0 ? "current" : "later",
    train: activeIndex > 1 ? "done" : activeIndex === 1 ? "current" : "later",
    test: activeIndex > 2 ? "done" : activeIndex === 2 ? "current" : "later",
  };
}

function WorkflowStrip({ active }: { active: WorkflowStep }) {
  const t = useT();
  const statuses = workflowStatuses(active);
  const steps: { id: WorkflowStep }[] = [
    { id: "label" },
    { id: "train" },
    { id: "test" },
  ];

  return (
    <ol className="lab-workflow" aria-label={t("lesson2.train.workflow.aria")}>
      {steps.map((step, i) => {
        const status = statuses[step.id];
        const statusLabel =
          status === "current"
            ? t("lesson2.train.workflow.now")
            : t(`lesson2.train.workflow.${status}`);
        return (
          <li key={step.id} className="lab-workflow-item">
            {i > 0 ? (
              <span className="lab-workflow-arrow" aria-hidden>
                →
              </span>
            ) : null}
            <span
              className={`lab-workflow-step is-${status}`}
              aria-current={status === "current" ? "step" : undefined}
            >
              <span className="lab-workflow-mark" aria-hidden>
                {status === "done" ? "✓" : i + 1}
              </span>
              <span className="lab-workflow-copy">
                <span className="lab-workflow-name">
                  {t(`lesson2.train.workflow.${step.id}`)}
                </span>
                <span className="lab-workflow-status">{statusLabel}</span>
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function TrainPhoto({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-[3/2] w-full overflow-hidden bg-[var(--lab-crt)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 55vw, 520px"
        priority
      />
    </div>
  );
}

function LabelChoices({
  onCat,
  onDog,
  beside = false,
}: {
  onCat: () => void;
  onDog: () => void;
  beside?: boolean;
}) {
  const t = useT();
  return (
    <div className="lab-choose">
      <p className="lab-choose-cue" id="lab-label-prompt">
        {t("lesson2.shared.chooseOne")}
      </p>
      <div
        className={
          beside
            ? "lab-choose-options lab-choose-options-beside"
            : "lab-choose-options"
        }
        role="group"
        aria-labelledby="lab-label-prompt"
      >
        <button
          type="button"
          onClick={onCat}
          className="lab-choose-opt lab-choose-opt-invite"
          aria-label={t("lesson2.train.label.labelCat")}
        >
          <span className="lab-choose-mark" aria-hidden>
            A
          </span>
          <span className="lab-choose-label">{t("lesson2.train.label.cat")}</span>
        </button>
        <button
          type="button"
          onClick={onDog}
          className="lab-choose-opt lab-choose-opt-invite"
          aria-label={t("lesson2.train.label.labelDog")}
        >
          <span className="lab-choose-mark" aria-hidden>
            B
          </span>
          <span className="lab-choose-label">{t("lesson2.train.label.dog")}</span>
        </button>
      </div>
    </div>
  );
}

export function TrainModel({ onContinue }: Props) {
  const { t, samples, testImage, trapImage, animalLabel } = useLesson2Copy();
  const [phase, setPhase] = useState<Phase>("compare");
  const [index, setIndex] = useState(0);
  const [labels, setLabels] = useState<Record<string, "cat" | "dog">>({});
  const [training, setTraining] = useState(0);
  const [guess, setGuess] = useState<"cat" | "dog" | null>(null);

  const sample = samples[index];
  const labeledCount = Object.keys(labels).length;
  const allLabeled = labeledCount >= samples.length;

  function label(choice: "cat" | "dog") {
    if (!sample) return;
    const next = { ...labels, [sample.id]: choice };
    setLabels(next);
    if (index < samples.length - 1) {
      setIndex((i) => i + 1);
    }
  }

  function startTrain() {
    setPhase("train");
    setTraining(0);
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      setTraining(n);
      if (n >= 100) {
        clearInterval(id);
        setTimeout(() => setPhase("test"), 350);
      }
    }, 18);
  }

  return (
    <LabFrame>
      {phase === "compare" ? (
        <>
          <LabTitle plaque={t("lesson2.train.compare.plaque")}>
            {t("lesson2.train.compare.title")}
          </LabTitle>
          <LabLine>{t("lesson2.train.compare.subhead")}</LabLine>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="lab-crt px-5 py-6">
              <p className="relative z-10 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--lab-phosphor-dim)]">
                {t("lesson2.train.compare.ruleBased")}
              </p>
              <pre className="relative z-10 mt-4 overflow-x-auto text-sm leading-relaxed">
                {t("lesson2.train.compare.code")}
              </pre>
            </div>
            <div className="lab-panel border-[var(--lab-phosphor)]/25 px-5 py-6">
              <p className="lab-eyebrow">{t("lesson2.train.compare.mlEyebrow")}</p>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft whitespace-pre-line">
                {t("lesson2.train.compare.mlBody")}
              </p>
            </div>
          </div>
          <LabContinue
            label={t("lesson2.train.compare.cta")}
            onClick={() => setPhase("label")}
          />
        </>
      ) : null}

      {phase === "label" ? (
        <>
          <LabTitle plaque={t("lesson2.train.label.plaque")}>
            {t("lesson2.train.label.title")}
          </LabTitle>
          {!allLabeled ? (
            <>
              <LabLine>{t("lesson2.train.label.subhead")}</LabLine>
              <WorkflowStrip active="label" />
              <p className="mt-3 text-sm font-medium text-[var(--lab-phosphor-dim)]">
                {t("lesson2.train.label.progress", {
                  count: labeledCount,
                  total: samples.length,
                })}
              </p>
              {sample ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={sample.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="lab-panel mt-4 max-w-4xl overflow-hidden p-4 sm:p-5"
                  >
                    <div className="grid gap-4 sm:grid-cols-[minmax(0,1.45fr)_minmax(9.5rem,0.7fr)] sm:items-center sm:gap-6">
                      <div className="min-w-0">
                        <p className="lab-eyebrow">
                          {t("lesson2.train.label.photo", { n: index + 1 })}
                        </p>
                        <TrainPhoto
                          src={sample.image}
                          alt={sample.hint}
                          className="mt-3 border border-[var(--lab-line)]"
                        />
                      </div>
                      <div className="sm:pt-5">
                        <LabelChoices
                          beside
                          onCat={() => label("cat")}
                          onDog={() => label("dog")}
                        />
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : null}
            </>
          ) : (
            <>
              <LabLine>{t("lesson2.train.label.after")}</LabLine>
              <WorkflowStrip active="train" />
              <LabContinue
                label={t("lesson2.train.label.cta")}
                onClick={startTrain}
              />
            </>
          )}
        </>
      ) : null}

      {phase === "train" ? (
        <>
          <LabTitle plaque={t("lesson2.train.trainPhase.plaque")}>
            {t("lesson2.train.trainPhase.title")}
          </LabTitle>
          <WorkflowStrip active="train" />
          <div className="lab-crt mt-6 max-w-md px-5 py-6">
            <div className="relative z-10 h-2 overflow-hidden bg-black/40">
              <motion.div
                className="h-full bg-[var(--lab-phosphor)]"
                initial={false}
                animate={{ width: `${training}%` }}
              />
            </div>
            <p className="relative z-10 mt-4 text-sm text-[var(--lab-phosphor-dim)]">
              {t("lesson2.train.trainPhase.status")}
              <span className="lab-blink">_</span>
            </p>
          </div>
        </>
      ) : null}

      {phase === "test" || phase === "done" ? (
        <>
          <LabTitle plaque={t("lesson2.train.test.plaque")}>
            {t("lesson2.train.test.title")}
          </LabTitle>
          <WorkflowStrip active="test" />
          <div className="lab-panel mt-4 max-w-4xl overflow-hidden p-4 sm:p-5">
            <div
              className={
                phase === "done"
                  ? "grid gap-5 sm:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] sm:items-start sm:gap-6"
                  : "grid gap-4 sm:grid-cols-[minmax(0,1.45fr)_minmax(9.5rem,0.7fr)] sm:items-center sm:gap-6"
              }
            >
              <div className="min-w-0">
                <TrainPhoto
                  src={testImage.image}
                  alt={testImage.hint}
                  className="border border-[var(--lab-line)]"
                />
              </div>
              <div className={phase === "done" ? "sm:pt-1" : ""}>
                {phase === "test" ? (
                  <LabelChoices
                    beside
                    onCat={() => {
                      setGuess("cat");
                      setPhase("done");
                    }}
                    onDog={() => {
                      setGuess("dog");
                      setPhase("done");
                    }}
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="lab-eyebrow">
                      {t("lesson2.train.test.predictionEyebrow")}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-[var(--lab-phosphor)]">
                      {t("lesson2.train.test.prediction", {
                        confidence: testImage.confidence,
                      })}
                    </p>
                    <p className="mt-3 text-sm text-ink-soft">
                      {t("lesson2.train.test.youGuessed", {
                        guess: guess ? animalLabel(guess) : "",
                      })}
                    </p>
                    <p className="mt-3 text-sm text-ink-soft">
                      <RichText text={t("lesson2.train.test.whyNot100")} />
                    </p>
                    <LabContinue
                      label={t("lesson2.train.test.cta")}
                      onClick={() => setPhase("trap")}
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}

      {phase === "trap" || phase === "trap-result" ? (
        <>
          <LabTitle plaque={t("lesson2.train.trap.plaque")}>
            {t("lesson2.train.trap.title")}
          </LabTitle>
          {phase === "trap" ? (
            <LabLine>{t("lesson2.train.trap.setup")}</LabLine>
          ) : null}
          <div className="lab-panel mt-6 max-w-4xl overflow-hidden p-4 sm:p-5">
            <div
              className={
                phase === "trap-result"
                  ? "grid gap-5 sm:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] sm:items-start sm:gap-6"
                  : "grid gap-4 sm:grid-cols-[minmax(0,1.45fr)_minmax(9.5rem,0.7fr)] sm:items-center sm:gap-6"
              }
            >
              <div className="min-w-0">
                <TrainPhoto
                  src={trapImage.image}
                  alt={trapImage.alt}
                  className="border border-[var(--lab-line)]"
                />
              </div>
              <div className={phase === "trap-result" ? "sm:pt-1" : ""}>
                {phase === "trap" ? (
                  <LabelChoices
                    beside
                    onCat={() => setPhase("trap-result")}
                    onDog={() => setPhase("trap-result")}
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="lab-eyebrow">
                      {t("lesson2.train.test.predictionEyebrow")}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-[var(--lab-warn)]">
                      {t("lesson2.train.trap.prediction", {
                        confidence: trapImage.confidence,
                      })}
                    </p>
                    <p className="mt-3 text-sm font-medium text-ink">
                      {t("lesson2.train.trap.reaction")}
                    </p>
                    <LabContinue
                      label={t("lesson2.train.trap.whyCta")}
                      onClick={() => setPhase("trap-reveal")}
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}

      {phase === "trap-reveal" ? (
        <>
          <LabTitle plaque={t("lesson2.train.trap.plaque")}>
            {t("lesson2.train.trap.revealTitle")}
          </LabTitle>
          <div className="mt-6 max-w-2xl space-y-4">
            <LabLine>{t("lesson2.train.trap.body1")}</LabLine>
            <p className="lab-line">
              <RichText text={t("lesson2.train.trap.body2")} />
            </p>
            <p className="lab-line font-medium text-ink">
              <RichText text={t("lesson2.train.trap.punchline")} />
            </p>
            <LabLine>{t("lesson2.train.trap.close")}</LabLine>
          </div>
          <LabContinue onClick={onContinue} />
        </>
      ) : null}
    </LabFrame>
  );
}
