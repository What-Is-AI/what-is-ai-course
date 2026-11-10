"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  LibraryContinue,
  LibraryFrame,
  LibraryLine,
  LibraryTitle,
} from "@/components/lesson3/LibraryFrame";
import { RichText } from "@/i18n/RichText";
import { useLesson3Copy } from "@/lib/useLesson3Copy";
import { useTrackChoice } from "@/lib/analytics/useTrackChoice";
import { qid, QStep } from "@/lib/analytics/questionIds";

type Props = {
  onContinue: () => void;
};

export function WhoWouldYouTrust({ onContinue }: Props) {
  const { t, locale, doctors, reasons } = useLesson3Copy();
  const trackChoice = useTrackChoice();
  const [picked, setPicked] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [phase, setPhase] = useState<"pick" | "why" | "machines">("pick");
  const numberLocale = locale === "es" ? "es" : "en";

  return (
    <LibraryFrame>
      <AnimatePresence mode="wait">
        {phase === "pick" ? (
          <motion.div
            key="pick"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-1 flex-col"
          >
            <LibraryTitle plaque={t("lesson3.doctors.plaque")}>
              {t("lesson3.doctors.title")}
            </LibraryTitle>
            <LibraryLine>{t("lesson3.doctors.subhead")}</LibraryLine>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {doctors.map((doctor, i) => {
                const selected = picked === doctor.id;
                const dimmed = picked !== null && !selected;
                return (
                  <button
                    key={doctor.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setPicked(doctor.id)}
                    className={`library-doctor-card library-paper px-5 py-6 text-left ${
                      selected ? "is-selected" : ""
                    } ${dimmed ? "is-dimmed" : ""} ${
                      !picked
                        ? `library-drift${i === 1 ? " library-drift-delayed" : ""}`
                        : ""
                    }`}
                  >
                    <p className="text-xl font-semibold">{doctor.label}</p>
                    <p className="mt-3 text-sm text-ink-soft">
                      {t("lesson3.doctors.hasTreated")}
                    </p>
                    <p className="mt-1 text-3xl font-semibold text-ink">
                      {doctor.patients.toLocaleString(numberLocale)}
                    </p>
                    <p className="text-sm text-mute">
                      {doctor.tagline
                        ? t("lesson3.doctors.patientsWithTagline", {
                            tagline: doctor.tagline,
                          })
                        : t("lesson3.doctors.patients")}
                    </p>
                  </button>
                );
              })}
            </div>

            <LibraryContinue
              label={t("lesson3.doctors.reveal")}
              disabled={!picked}
              onClick={() => {
                if (picked) {
                  trackChoice({
                    questionId: qid(QStep.trust, "doctor"),
                    selectedOptionId: picked,
                  });
                }
                setPhase("why");
              }}
            />
          </motion.div>
        ) : null}

        {phase === "why" ? (
          <motion.div
            key="why"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-1 flex-col"
          >
            <LibraryTitle>{t("lesson3.doctors.whyTitle")}</LibraryTitle>
            <LibraryLine>{t("lesson3.doctors.whySub")}</LibraryLine>
            <p className="library-choice-cue mt-6">
              {t("lesson3.shared.chooseOne")}
            </p>
            <div
              className="mt-3 grid max-w-2xl gap-3 sm:grid-cols-2"
              role="radiogroup"
              aria-label={t("lesson3.doctors.whyAria")}
            >
              {reasons.map((option) => {
                const selected = reason === option.id;
                const dimmed = reason !== null && !selected;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setReason(option.id)}
                    className={`library-choice${
                      !reason ? " library-choice-invite" : ""
                    }${selected ? " is-selected" : ""}${
                      dimmed ? " is-dimmed" : ""
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            <LibraryContinue
              label={t("lesson3.doctors.cta")}
              disabled={!reason}
              onClick={() => {
                if (reason) {
                  trackChoice({
                    questionId: qid(QStep.trust, "reason"),
                    selectedOptionId: reason,
                  });
                }
                setPhase("machines");
              }}
            />
          </motion.div>
        ) : null}

        {phase === "machines" ? (
          <motion.div
            key="machines"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-1 flex-col"
          >
            <LibraryTitle>{t("lesson3.doctors.experienceTitle")}</LibraryTitle>
            <LibraryLine>{t("lesson3.doctors.machinesLine")}</LibraryLine>
            <div className="library-paper mt-6 max-w-xl px-5 py-5">
              <p className="text-base text-ink-soft">
                <RichText text={t("lesson3.doctors.dataName")} />
              </p>
              <p className="mt-4 text-base text-ink-soft">
                {t("lesson3.doctors.pocket")}
              </p>
            </div>
            <LibraryContinue onClick={onContinue} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </LibraryFrame>
  );
}
