"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState, type ReactNode } from "react";
import { usePractical1Copy } from "@/lib/usePractical1Copy";

export type ConnectedSorterItem = { id: string; label: string; detail?: string };
export type ConnectedSorterBucket = { id: string; label: string };

type Props = {
  items: readonly ConnectedSorterItem[];
  buckets: readonly ConnectedSorterBucket[];
  placements: Record<string, string>;
  onPlace: (itemId: string, bucketId: string) => void;
  onUnplace?: (itemId: string) => void;
  counterLabel?: (n: number, total: number) => string;
  showDetail?: boolean;
  doneFooter?: ReactNode;
};

export function ConnectedTapSorter({
  items,
  buckets,
  placements,
  onPlace,
  onUnplace,
  counterLabel,
  showDetail = true,
  doneFooter,
}: Props) {
  const { t } = usePractical1Copy();
  const remaining = useMemo(
    () => items.filter((item) => !placements[item.id]),
    [items, placements],
  );
  const [activeId, setActiveId] = useState(remaining[0]?.id ?? "");
  const [detailOpen, setDetailOpen] = useState(false);
  const current =
    items.find((item) => item.id === activeId && !placements[item.id]) ??
    remaining[0];
  const done = remaining.length === 0;
  const index = items.length - remaining.length + 1;

  function place(bucketId: string) {
    if (!current) return;
    onPlace(current.id, bucketId);
    setDetailOpen(false);
    const next = remaining.find((item) => item.id !== current.id);
    setActiveId(next?.id ?? "");
  }

  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col gap-3 md:gap-5">
        <AnimatePresence mode="wait">
          {!done && current ? (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="connected-door p-4 sm:p-7"
            >
              <p className="connected-plaque">
                {counterLabel
                  ? counterLabel(index, items.length)
                  : t("practical1.sort.round1.counter", { n: index })}
              </p>
              <p className="connected-title mt-3 text-[clamp(1.2rem,3vw,1.65rem)]">
                {current.label}
              </p>
              {showDetail && current.detail ? (
                <button
                  type="button"
                  className="connected-link-btn mt-4"
                  onClick={() => setDetailOpen((v) => !v)}
                  aria-expanded={detailOpen}
                >
                  {t("practical1.sort.round1.whatIs")}
                </button>
              ) : null}
              {detailOpen && current.detail ? (
                <p className="connected-body mt-3">{current.detail}</p>
              ) : null}
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="connected-door p-4 sm:p-6"
            >
              <p className="connected-title text-[clamp(1.2rem,3vw,1.65rem)]">
                {t("practical1.sort.round1.doneTitle")}
              </p>
              {doneFooter ? (
                <div className="mt-4 space-y-1">{doneFooter}</div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {!done && current ? (
          <div
            className="grid grid-cols-3 gap-2"
            role="group"
            aria-label={current.label}
          >
            {buckets.map((bucket) => (
              <button
                key={bucket.id}
                type="button"
                className={`connected-bucket connected-bucket-${bucket.id}`}
                onClick={() => place(bucket.id)}
              >
                <span className="connected-bucket-icon" aria-hidden />
                <span>{bucket.label}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
        {buckets.map((bucket) => {
          const placed = items.filter(
            (item) => placements[item.id] === bucket.id,
          );
          return (
            <section
              key={bucket.id}
              className={`connected-door p-3 connected-bucket-panel-${bucket.id}`}
              aria-label={`${bucket.label}: ${placed.length}`}
            >
              <p className="connected-plaque">
                {bucket.label}
                <span className="ml-2 normal-case tracking-normal opacity-70">
                  {placed.length}
                </span>
              </p>
              <ul className="mt-2 flex flex-col gap-1.5">
                {placed.map((item) => (
                  <li key={item.id}>
                    {onUnplace ? (
                      <button
                        type="button"
                        className="connected-chip w-full text-left"
                        onClick={() => {
                          onUnplace(item.id);
                          setActiveId(item.id);
                        }}
                      >
                        {item.label}
                      </button>
                    ) : (
                      <span className="text-sm text-[color:var(--connected-ink-soft)]">
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
