"use client";

import { useMemo, useState } from "react";
import {
  ConnectedContinue,
  ConnectedFrame,
  ConnectedLine,
  ConnectedTitle,
} from "@/components/practical1/ConnectedOfficeFrame";
import {
  type GutBucketId,
  type PredictionChoiceId,
  type SortCardId,
} from "@/lib/practical1-data";
import { usePractical1Copy } from "@/lib/usePractical1Copy";

type Phase = "axis" | "press" | "emails" | "name";

type Props = {
  gutPlacements: Record<SortCardId, GutBucketId>;
  predictionId: PredictionChoiceId | null;
  onContinue: () => void;
};

const SENSITIVITY_ORDER: SortCardId[] = [
  "press_release",
  "own_notes",
  "invoices",
  "roadmap",
  "customer_emails",
  "sick_leave",
  "employee_records",
];

export function TheFlip({ gutPlacements, predictionId, onContinue }: Props) {
  const { t, sortCard, gutBucketLabel, predictionLabel } = usePractical1Copy();
  const [phase, setPhase] = useState<Phase>("axis");
  const verdictShort = (bucket: GutBucketId) =>
    t(`practical1.shared.gutBucketsShort.${bucket}`);

  const ordered = useMemo(() => {
    const yes = SENSITIVITY_ORDER.filter(
      (id) => gutPlacements[id] === "yes",
    );
    const mid = SENSITIVITY_ORDER.filter(
      (id) => gutPlacements[id] === "not_sure",
    );
    const no = SENSITIVITY_ORDER.filter((id) => gutPlacements[id] === "no");
    return [...yes, ...mid, ...no];
  }, [gutPlacements]);

  if (phase === "axis") {
    return (
      <ConnectedFrame>
        <ConnectedTitle plaque={t("practical1.flip.axis.plaque")}>
          {t("practical1.flip.axis.title")}
        </ConnectedTitle>
        <ConnectedLine>{t("practical1.flip.axis.subhead")}</ConnectedLine>

        <div
          className="connected-axis-board mt-6"
          role="img"
          aria-label={t("practical1.flip.axis.listAria")}
        >
          <div className="connected-axis" aria-hidden>
            <span>{t("practical1.flip.axis.axisStart")}</span>
            <span className="connected-axis-rule" />
            <span>{t("practical1.flip.axis.axisEnd")}</span>
          </div>

          <ol className="connected-axis-track">
            {ordered.map((id) => {
              const bucket = gutPlacements[id];
              return (
                <li
                  key={id}
                  className={`connected-axis-mark connected-axis-mark-${bucket}`}
                >
                  <span className="connected-axis-mark-title">
                    {sortCard(id)?.title}
                  </span>
                  <span className="connected-axis-mark-verdict">
                    <span className="connected-axis-mark-dot" aria-hidden />
                    {verdictShort(bucket)}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <ul className="sr-only">
          {ordered.map((id, i) => (
            <li key={id}>
              {i + 1}. {sortCard(id)?.title}:{" "}
              {gutBucketLabel(gutPlacements[id])}
            </li>
          ))}
        </ul>

        <ConnectedContinue
          className="mt-5"
          label={t("practical1.flip.axis.cta")}
          onClick={() => setPhase("press")}
        />
      </ConnectedFrame>
    );
  }

  if (phase === "press") {
    return (
      <ConnectedFrame>
        <ConnectedTitle plaque={sortCard("press_release")?.title}>
          {sortCard("press_release")?.title}
        </ConnectedTitle>
        <p className="mt-2">
          <span className="connected-stamp connected-stamp-blocked">
            {t("practical1.flip.press.stamp")}
          </span>
        </p>
        <p className="connected-body mt-4 max-w-2xl">
          {t("practical1.flip.press.reveal")}
        </p>
        <p className="connected-body mt-4 max-w-2xl font-semibold">
          {t("practical1.flip.press.bridge")}
        </p>
        <ConnectedContinue
          className="mt-5"
          label={t("practical1.flip.press.cta")}
          onClick={() => setPhase("emails")}
        />
      </ConnectedFrame>
    );
  }

  if (phase === "emails") {
    return (
      <ConnectedFrame>
        <ConnectedTitle plaque={sortCard("customer_emails")?.title}>
          {sortCard("customer_emails")?.title}
        </ConnectedTitle>
        <p className="mt-2">
          <span className="connected-stamp connected-stamp-cleared">
            {t("practical1.flip.emails.stamp")}
          </span>
        </p>
        <p className="connected-body mt-4 max-w-2xl">
          {t("practical1.flip.emails.reveal")}
        </p>
        <ConnectedContinue
          className="mt-5"
          label={t("practical1.flip.emails.cta")}
          onClick={() => setPhase("name")}
        />
      </ConnectedFrame>
    );
  }

  const guess = predictionId
    ? predictionLabel(predictionId)
    : t("practical1.prediction.choices.not_sure");

  return (
    <ConnectedFrame>
      <ConnectedTitle>{t("practical1.flip.name.title")}</ConnectedTitle>
      <ConnectedLine>{t("practical1.flip.name.subhead")}</ConnectedLine>
      <p className="connected-mystery mt-6 max-w-2xl">
        {t("practical1.flip.name.callback", { guess })}
      </p>
      <ConnectedContinue
        className="mt-5"
        label={t("practical1.flip.name.cta")}
        onClick={onContinue}
      />
    </ConnectedFrame>
  );
}
