"use client";

import { useMemo, useState } from "react";
import { TapToPlaceSorter } from "@/components/delegate-real-work/TapToPlaceSorter";
import {
  CoworkerContinue,
  CoworkerFrame,
  CoworkerLine,
  CoworkerTitle,
} from "@/components/delegate-real-work/CoworkerFrame";
import { useDelegateRealWorkCopy } from "@/lib/useDelegateRealWorkCopy";

type Props = {
  onContinue: () => void;
};

export function Judgment({ onContinue }: Props) {
  const { t, judgmentBuckets, judgmentItems, judgmentBucketLabel } =
    useDelegateRealWorkCopy();
  const items = useMemo(
    () =>
      judgmentItems.map((item) => ({
        id: item.id,
        label: item.task,
      })),
    [judgmentItems],
  );
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState(false);

  const done = Object.keys(placements).length === judgmentItems.length;

  return (
    <CoworkerFrame>
      <CoworkerTitle plaque={t("delegateRealWork.judgment.plaque")}>
        {t("delegateRealWork.judgment.title")}
      </CoworkerTitle>
      <CoworkerLine>{t("delegateRealWork.judgment.subhead")}</CoworkerLine>

      <div className="mt-8">
        <TapToPlaceSorter
          items={items}
          buckets={judgmentBuckets}
          placements={placements}
          onPlace={(itemId, bucketId) =>
            setPlacements((prev) => ({ ...prev, [itemId]: bucketId }))
          }
          onUnplace={(itemId) => {
            setPlacements((prev) => {
              const next = { ...prev };
              delete next[itemId];
              return next;
            });
            setRevealed(false);
          }}
        />
      </div>

      {done && !revealed ? (
        <CoworkerContinue
          label={t("delegateRealWork.judgment.checkCta")}
          onClick={() => setRevealed(true)}
        />
      ) : null}

      {revealed ? (
        <div className="mt-8 max-w-3xl space-y-4">
          <ul className="space-y-3">
            {judgmentItems.map((item) => {
              const placed = placements[item.id];
              const correct = placed === item.answer;
              return (
                <li
                  key={item.id}
                  className={`rounded px-4 py-3 text-sm ${
                    correct ? "coworker-verify-ok" : "coworker-verify-off"
                  }`}
                >
                  <p className="font-semibold">
                    <span aria-hidden>{correct ? "✓ " : "✗ "}</span>
                    {item.task}
                  </p>
                  <p className="mt-1 opacity-90">
                    {t("delegateRealWork.judgment.sortLine", {
                      placed: judgmentBucketLabel(placed),
                      answer: judgmentBucketLabel(item.answer),
                    })}
                  </p>
                  <p className="mt-1 opacity-80">{item.note}</p>
                </li>
              );
            })}
          </ul>
          <p className="text-base font-semibold leading-relaxed text-[color:var(--cw-accent)]">
            {t("delegateRealWork.judgment.ruleOfThumb")}
          </p>
          <CoworkerContinue
            label={t("delegateRealWork.judgment.cta")}
            onClick={onContinue}
          />
        </div>
      ) : null}
    </CoworkerFrame>
  );
}
