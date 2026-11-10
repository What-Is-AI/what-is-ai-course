"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useDelegateRealWorkCopy } from "@/lib/useDelegateRealWorkCopy";

export type TapToPlaceItem = {
  id: string;
  label: string;
};

export type TapToPlaceBucket = {
  id: string;
  label: string;
};

export type TapToPlaceSorterProps = {
  items: readonly TapToPlaceItem[];
  buckets: readonly TapToPlaceBucket[];
  placements: Record<string, string>;
  onPlace: (itemId: string, bucketId: string) => void;
  onUnplace?: (itemId: string) => void;
  className?: string;
};

export function TapToPlaceSorter({
  items,
  buckets,
  placements,
  onPlace,
  onUnplace,
  className = "",
}: TapToPlaceSorterProps) {
  const { t } = useDelegateRealWorkCopy();
  const remaining = useMemo(
    () => items.filter((item) => !placements[item.id]),
    [items, placements],
  );
  const [activeId, setActiveId] = useState(remaining[0]?.id ?? "");
  const current =
    items.find((item) => item.id === activeId && !placements[item.id]) ??
    remaining[0];
  const done = remaining.length === 0;

  function place(bucketId: string) {
    if (!current) return;
    onPlace(current.id, bucketId);
    const next = remaining.find((item) => item.id !== current.id);
    setActiveId(next?.id ?? "");
  }

  return (
    <div className={`grid gap-4 md:gap-8 lg:grid-cols-[1.1fr_0.9fr] ${className}`}>
      <div className="flex flex-col gap-3 md:gap-5">
        <AnimatePresence mode="wait">
          {!done && current ? (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="coworker-panel p-4 sm:p-8"
            >
              <p className="coworker-eyebrow">
                {t("delegateRealWork.judgment.sorter.itemOf", {
                  index: items.length - remaining.length + 1,
                  total: items.length,
                })}
              </p>
              <p className="coworker-title mt-4 text-[clamp(1.25rem,3vw,1.75rem)]">
                {current.label}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="coworker-panel p-4 sm:p-8"
            >
              <p className="coworker-title text-[clamp(1.25rem,3vw,1.75rem)]">
                {t("delegateRealWork.judgment.sorter.allSorted")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {!done && current ? (
          <div
            className="grid grid-cols-2 gap-3"
            role="group"
            aria-label={t("delegateRealWork.judgment.sorter.placeAria", {
              item: current.label,
            })}
          >
            {buckets.map((bucket, i) => {
              const mark = String.fromCharCode(65 + i);
              return (
                <button
                  key={bucket.id}
                  type="button"
                  className="coworker-choice coworker-choice-marked coworker-choice-invite"
                  onClick={() => place(bucket.id)}
                  aria-label={t("delegateRealWork.judgment.sorter.placeInAria", {
                    item: current.label,
                    bucket: bucket.label,
                  })}
                >
                  <span className="coworker-choice-mark" aria-hidden>
                    {mark}
                  </span>
                  <span>{bucket.label}</span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
        {buckets.map((bucket) => {
          const placed = items.filter(
            (item) => placements[item.id] === bucket.id,
          );
          return (
            <section
              key={bucket.id}
              aria-label={t("delegateRealWork.judgment.sorter.bucketAria", {
                label: bucket.label,
                count: placed.length,
              })}
              className="coworker-panel p-4"
            >
              <p className="coworker-eyebrow">
                {bucket.label}
                <span className="ml-2 normal-case tracking-normal text-[color:var(--cw-mute)]">
                  {placed.length}
                </span>
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {placed.length === 0 ? (
                  <li className="text-sm text-[color:var(--cw-mute)]">
                    {t("delegateRealWork.judgment.sorter.empty")}
                  </li>
                ) : (
                  placed.map((item) => (
                    <li key={item.id}>
                      {onUnplace ? (
                        <button
                          type="button"
                          className="coworker-chip w-full text-left normal-case tracking-normal"
                          onClick={() => {
                            onUnplace(item.id);
                            setActiveId(item.id);
                          }}
                          aria-label={t(
                            "delegateRealWork.judgment.sorter.returnAria",
                            { item: item.label },
                          )}
                        >
                          {item.label}
                        </button>
                      ) : (
                        <span className="text-sm text-[color:var(--cw-ink-soft)]">
                          {item.label}
                        </span>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
