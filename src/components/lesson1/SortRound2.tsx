"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  FileDown,
  Fingerprint,
  Headphones,
  Mic,
  type LucideIcon,
  QrCode,
  ScanText,
  Search,
  ShieldCheck,
  Sigma,
  SpellCheck2,
  BotMessageSquare,
  Video,
} from "lucide-react";
import { useMemo, useState } from "react";
import { LiveRegion } from "@/components/lesson1/a11y";
import {
  MuseumContinue,
  MuseumFrame,
  MuseumLine,
  MuseumTitle,
} from "@/components/lesson1/MuseumFrame";
import { MuseumWhatIs } from "@/components/lesson1/MuseumWhatIs";
import { StatusLabel } from "@/components/lesson1/StatusLabel";
import {
  type Domain,
  type Origin,
  type TwoAxisPlacement,
} from "@/lib/lesson1-data";
import { useLesson1Copy } from "@/lib/useLesson1Copy";
import { useTrackChoice } from "@/lib/analytics/useTrackChoice";
import { QStep, qid } from "@/lib/analytics/questionIds";
import { RichText } from "@/i18n/RichText";

type Props = {
  onContinue: (placements: Record<string, TwoAxisPlacement>) => void;
};

const OBJECT_ICONS: Record<string, LucideIcon> = {
  qr: QrCode,
  captcha: ShieldCheck,
  search: Search,
  ocr: ScanText,
  grammar: SpellCheck2,
  siri: Mic,
  fingerprint: Fingerprint,
  "excel-formula": Sigma,
  "excel-copilot": BotMessageSquare,
  lens: Camera,
  compression: FileDown,
  noise: Headphones,
  deepfake: Video,
};

function ObjectMark({ id }: { id: string }) {
  const Icon = OBJECT_ICONS[id] ?? Search;
  return (
    <Icon
      className="museum-r2-object-icon"
      size={44}
      strokeWidth={1.75}
      absoluteStrokeWidth
      aria-hidden
    />
  );
}

export function SortRound2({ onContinue }: Props) {
  const { t, round2, domains, origins, domainLabel, originLabel } =
    useLesson1Copy();
  const trackChoice = useTrackChoice();
  const [index, setIndex] = useState(0);
  const [domain, setDomain] = useState<Domain | null>(null);
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [placements, setPlacements] = useState<Record<string, TwoAxisPlacement>>(
    {},
  );
  const [showFeedback, setShowFeedback] = useState(false);
  const [announce, setAnnounce] = useState("");

  const finished = index >= round2.length;
  const current = round2[index];
  const domainDone = domain !== null;
  const originDone = origin !== null;
  const canCommit = domainDone && originDone;
  const checkLabel = !domainDone
    ? t("lesson1.round2.pickDomain")
    : !originDone
      ? t("lesson1.round2.pickOrigin")
      : t("lesson1.round2.check");
  const checkReady = canCommit && !showFeedback;

  const score = useMemo(() => {
    let aligned = 0;
    for (const item of round2) {
      const p = placements[item.id];
      if (!p) continue;
      if (p.domain === item.domain && p.origin === item.origin) aligned += 1;
    }
    return aligned;
  }, [placements, round2]);

  const progressAnnounce =
    !finished && current
      ? t("lesson1.round2.objectOf", {
          index: index + 1,
          total: round2.length,
          label: current.label,
        })
      : "";

  function commit() {
    if (!current || !domain || !origin || showFeedback) return;
    setPlacements((prev) => ({
      ...prev,
      [current.id]: { domain, origin },
    }));
    trackChoice({
      questionId: qid(QStep.sortR2, current.id),
      selectedOptionId: `${domain}:${origin}`,
      isCorrect: domain === current.domain && origin === current.origin,
    });
    setShowFeedback(true);
    const domainMatch = domain === current.domain;
    const originMatch = origin === current.origin;
    setAnnounce(
      t("lesson1.round2.announce", {
        label: current.label,
        domain: domainLabel(current.domain),
        domainDiff: domainMatch ? "" : t("lesson1.round2.differentChoice"),
        origin: originLabel(current.origin),
        originDiff: originMatch ? "" : t("lesson1.round2.differentChoice"),
        note: current.note ?? "",
      }),
    );
  }

  function next() {
    setDomain(null);
    setOrigin(null);
    setShowFeedback(false);
    setAnnounce("");
    setIndex((prev) => prev + 1);
  }

  if (finished) {
    return (
      <MuseumFrame>
        <p className="museum-eyebrow mb-2">{t("lesson1.round2.eyebrow")}</p>
        <MuseumTitle plaque={t("lesson1.round2.score.plaque")} focusKey="score">
          {t("lesson1.round2.score.title", {
            score,
            total: round2.length,
          })}
        </MuseumTitle>
        <MuseumLine>{t("lesson1.round2.score.sub")}</MuseumLine>

        <ul className="museum-r2-score-grid">
          {round2.map((item, i) => {
            const p = placements[item.id];
            const ok =
              p?.domain === item.domain && p?.origin === item.origin;
            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 * i }}
                className="museum-r2-score-row"
              >
                <span className="museum-r2-score-label">{item.label}</span>
                <span
                  className="museum-r2-score-status"
                  style={{
                    color: ok ? "var(--museum-ok)" : "var(--museum-warn)",
                  }}
                >
                  <StatusLabel kind={ok ? "aligned" : "rethink"} />
                  {t("lesson1.round2.score.correctAnswer", {
                    domain: domainLabel(item.domain),
                    origin: originLabel(item.origin),
                  })}
                </span>
              </motion.li>
            );
          })}
        </ul>

        <MuseumContinue
          label={t("lesson1.round2.score.cta")}
          onClick={() => onContinue(placements)}
        />
      </MuseumFrame>
    );
  }

  const placement = placements[current.id];
  const domainOk = placement?.domain === current.domain;
  const originOk = placement?.origin === current.origin;

  return (
    <MuseumFrame>
      <LiveRegion message={progressAnnounce} />
      <LiveRegion message={announce} />

      <p className="museum-eyebrow mb-2">{t("lesson1.round2.eyebrow")}</p>
      <MuseumTitle>{t("lesson1.round2.title")}</MuseumTitle>
      <div className="museum-r2-lede">
        <p>
          <span className="museum-r2-step museum-r2-step-domain" aria-hidden>
            1
          </span>
          <span>
            <RichText text={t("lesson1.round2.ledeDomain")} />
          </span>
        </p>
        <p>
          <span className="museum-r2-step museum-r2-step-origin" aria-hidden>
            2
          </span>
          <span>
            <RichText text={t("lesson1.round2.ledeOrigin")} />
          </span>
        </p>
      </div>

      <div className="museum-r2-subject">
        <p className="museum-eyebrow museum-r2-object-count" aria-hidden="true">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(round2.length).padStart(2, "0")}
        </p>
        <div className="museum-r2-object">
          <ObjectMark id={current.id} />
          <p className="museum-r2-object-name">{current.label}</p>
          {current.whatIs ? (
            <MuseumWhatIs label={current.label} text={current.whatIs} />
          ) : (
            <span className="museum-r2-object-spacer" aria-hidden />
          )}
        </div>
      </div>

      <div className="museum-r2-axes">
        <fieldset
          className={`museum-r2-card museum-r2-card-domain${!domainDone && !showFeedback ? " is-active" : ""}${domainDone ? " is-done" : ""}`}
          disabled={showFeedback}
        >
          <legend className="sr-only">{t("lesson1.round2.domainLegend")}</legend>
          <div className="museum-r2-card-head">
            <span
              className={`museum-r2-step museum-r2-step-domain${domainDone ? " is-complete" : ""}`}
              aria-hidden
            >
              {domainDone ? "✓" : "1"}
            </span>
            <span className="museum-r2-card-title">
              {t("lesson1.round2.domainLegend")}
            </span>
            {!domainDone && !showFeedback ? (
              <span className="museum-r2-card-cue">
                {t("lesson1.shared.chooseOne")}
              </span>
            ) : null}
          </div>
          <div
            className="museum-r2-options"
            role="group"
            aria-label={t("lesson1.round2.domainGroupAria")}
          >
            {domains.map((d) => {
              const selected = domain === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDomain(d.id)}
                  aria-pressed={selected}
                  className={`museum-r2-opt museum-r2-opt-domain${selected ? " is-selected" : ""}`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset
          className={`museum-r2-card museum-r2-card-origin${domainDone && !originDone && !showFeedback ? " is-active" : ""}${!domainDone && !showFeedback ? " is-waiting" : ""}${originDone ? " is-done" : ""}`}
          disabled={showFeedback || !domainDone}
        >
          <legend className="sr-only">{t("lesson1.round2.originLegend")}</legend>
          <div className="museum-r2-card-head">
            <span
              className={`museum-r2-step museum-r2-step-origin${originDone ? " is-complete" : ""}`}
              aria-hidden
            >
              {originDone ? "✓" : "2"}
            </span>
            <span className="museum-r2-card-title">
              {t("lesson1.round2.originLegend")}
            </span>
            {domainDone && !originDone && !showFeedback ? (
              <span className="museum-r2-card-cue">
                {t("lesson1.shared.chooseOne")}
              </span>
            ) : !domainDone && !showFeedback ? (
              <span className="museum-r2-card-cue museum-r2-card-cue-wait">
                {t("lesson1.round2.nextCue")}
              </span>
            ) : null}
          </div>
          <div
            className="museum-r2-options museum-r2-options-origin"
            role="group"
            aria-label={t("lesson1.round2.originGroupAria")}
          >
            {origins.map((o) => {
              const selected = origin === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setOrigin(o.id)}
                  aria-pressed={selected}
                  className={`museum-r2-opt museum-r2-opt-origin${selected ? " is-selected" : ""}`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <AnimatePresence mode="wait">
        {showFeedback ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="museum-r2-result"
          >
            <div className="museum-r2-result-badges">
              <span
                className={`museum-r2-result-badge${domainOk ? " is-ok" : " is-miss"}`}
              >
                {domainLabel(current.domain)}
                <span className="sr-only">
                  {domainOk
                    ? t("lesson1.round2.matchedSr")
                    : t("lesson1.round2.missedSr")}
                </span>
              </span>
              <span
                className={`museum-r2-result-badge${originOk ? " is-ok" : " is-miss"}`}
              >
                {originLabel(current.origin)}
                <span className="sr-only">
                  {originOk
                    ? t("lesson1.round2.matchedSr")
                    : t("lesson1.round2.missedSr")}
                </span>
              </span>
            </div>
            {current.note ? (
              <p className="museum-r2-result-note">{current.note}</p>
            ) : null}
            <button
              type="button"
              className="museum-btn museum-r2-next"
              onClick={next}
            >
              {index === round2.length - 1
                ? t("lesson1.round2.seeScore")
                : t("lesson1.round2.nextObject")}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="check"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="museum-r2-check"
          >
            <MuseumContinue
              label={checkLabel}
              disabled={!canCommit}
              secondary={!checkReady}
              onClick={commit}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </MuseumFrame>
  );
}
