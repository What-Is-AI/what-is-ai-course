"use client";

import { useState } from "react";
import {
  ConnectedContinue,
  ConnectedFrame,
  ConnectedLine,
  ConnectedTitle,
} from "@/components/practical1/ConnectedOfficeFrame";
import { ConnectedTapSorter } from "@/components/practical1/ConnectedTapSorter";
import {
  SORT_CARD_IDS,
  type GutBucketId,
  type SortCardId,
} from "@/lib/practical1-data";
import { usePractical1Copy } from "@/lib/usePractical1Copy";

type Props = {
  onContinue: (placements: Record<SortCardId, GutBucketId>) => void;
};

export function SortRound1({ onContinue }: Props) {
  const { t, gutBuckets, sortCards } = usePractical1Copy();
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const done = SORT_CARD_IDS.every((id) => placements[id]);

  const items = sortCards.map((c) => ({
    id: c.id,
    label: c.title,
    detail: c.detail,
  }));

  return (
    <ConnectedFrame>
      <ConnectedTitle plaque={t("practical1.sort.round1.plaque")}>
        {t("practical1.sort.round1.title")}
      </ConnectedTitle>
      <ConnectedLine>{t("practical1.sort.round1.subhead")}</ConnectedLine>

      <div className="mt-8">
        <ConnectedTapSorter
          items={items}
          buckets={gutBuckets}
          placements={placements}
          onPlace={(itemId, bucketId) =>
            setPlacements((prev) => ({ ...prev, [itemId]: bucketId }))
          }
          onUnplace={(itemId) =>
            setPlacements((prev) => {
              const next = { ...prev };
              delete next[itemId];
              return next;
            })
          }
          doneFooter={
            done ? (
              <>
                <p className="connected-body">
                  {t("practical1.sort.round1.doneSubhead")}
                </p>
                <ConnectedContinue
                  className="mt-4"
                  label={t("practical1.sort.round1.cta")}
                  onClick={() =>
                    onContinue(placements as Record<SortCardId, GutBucketId>)
                  }
                />
              </>
            ) : null
          }
        />
      </div>
    </ConnectedFrame>
  );
}
