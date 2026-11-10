"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  MuseumContinue,
  MuseumFrame,
  MuseumTitle,
  Pedestal,
} from "@/components/lesson1/MuseumFrame";
import {
  MuseumStickyNote,
  type StickyNoteData,
} from "@/components/lesson1/MuseumStickyNote";
import { StatusLabel } from "@/components/lesson1/StatusLabel";
import { RichText } from "@/i18n/RichText";
import { type Bucket } from "@/lib/lesson1-data";
import { useLesson1Copy } from "@/lib/useLesson1Copy";

type Props = {
  placements: Record<string, Bucket>;
  onBack?: () => void;
  onContinue: () => void;
};

type Result = "correct" | "wrong" | "skipped";

const DOMAIN_NOTE_ID = "key-domain";
const ORIGIN_NOTE_ID = "key-origin";

function Taxonomy({ options }: { options: readonly string[] }) {
  return (
    <p className="museum-rule-taxonomy">
      {options.map((option, i) => (
        <span key={option}>
          {i > 0 ? (
            <span className="museum-rule-taxonomy-dot" aria-hidden>
              {" "}
              ·{" "}
            </span>
          ) : null}
          <span>{option}</span>
        </span>
      ))}
    </p>
  );
}

function grade(answer: Bucket, placement?: Bucket): Result {
  if (!placement) return "skipped";
  return placement === answer ? "correct" : "wrong";
}

function resultKind(result: Result) {
  if (result === "wrong") return "rethink" as const;
  if (result === "correct") return "aligned" as const;
  return "skipped" as const;
}

function resultColor(result: Result) {
  if (result === "wrong") return "var(--museum-warn)";
  if (result === "correct") return "var(--museum-ok)";
  return "var(--museum-mute)";
}

function PlaqueNote({
  note,
  refs,
}: {
  note: string;
  refs?: { term: string; href: string; tip: string }[];
}) {
  if (!refs?.length) {
    return (
      <p className="museum-line mt-4 max-w-none text-[0.95rem]">{note}</p>
    );
  }

  const nodes: ReactNode[] = [];
  let rest = note;
  refs.forEach((ref, i) => {
    const at = rest.indexOf(ref.term);
    if (at === -1) return;
    if (at > 0) nodes.push(rest.slice(0, at));
    nodes.push(
      <a
        key={`${ref.term}-${i}`}
        href={ref.href}
        target="_blank"
        rel="noreferrer"
        title={ref.tip}
        data-tip={ref.tip}
        className="museum-ref"
      >
        {ref.term}
      </a>,
    );
    rest = rest.slice(at + ref.term.length);
  });
  if (rest) nodes.push(rest);

  return (
    <p className="museum-line mt-4 max-w-none text-[0.95rem]">{nodes}</p>
  );
}

export function Reveal({ placements, onBack, onContinue }: Props) {
  const {
    t,
    round1,
    bucketLabel,
    domainLabel,
    originLabel,
    domainBlurb,
    originBlurb,
    domains,
    origins,
  } = useLesson1Copy();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState<StickyNoteData[]>([]);
  const [topZ, setTopZ] = useState(40);
  const hasPlacements = Object.keys(placements).length > 0;

  const domainOptions = domains.map((d) => d.label);
  const originOptions = origins.map((o) => o.label);

  const domainNoteBody = (
    <>
      <p className="museum-sticky-kicker">{t("lesson1.reveal.domain.question")}</p>
      <p className="museum-sticky-sub">{t("lesson1.reveal.domain.sub")}</p>
      <Taxonomy options={domainOptions} />
      <p>{t("lesson1.reveal.domain.body")}</p>
    </>
  );

  const originNoteBody = (
    <>
      <p className="museum-sticky-kicker">{t("lesson1.reveal.origin.question")}</p>
      <p className="museum-sticky-sub">{t("lesson1.reveal.origin.sub")}</p>
      <Taxonomy options={originOptions} />
    </>
  );

  const results = useMemo(
    () =>
      round1.map((item) => ({
        item,
        result: grade(item.answer, placements[item.id]),
      })),
    [placements, round1],
  );

  const selected = selectedId
    ? (results.find((r) => r.item.id === selectedId) ?? null)
    : null;

  const focusNote = useCallback((id: string) => {
    setTopZ((z) => {
      const next = z + 1;
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, zIndex: next } : n)),
      );
      return next;
    });
  }, []);

  const openNote = useCallback((id: string, title: string, body: ReactNode) => {
    setTopZ((z) => {
      const nextZ = z + 1;
      setNotes((prev) => {
        const existing = prev.find((n) => n.id === id);
        if (existing) {
          const x = Math.min(
            Math.max(8, existing.x),
            Math.max(8, window.innerWidth - existing.width - 8),
          );
          const y = Math.min(
            Math.max(8, existing.y),
            Math.max(8, window.innerHeight - existing.height - 8),
          );
          return prev.map((n) =>
            n.id === id ? { ...n, x, y, zIndex: nextZ } : n,
          );
        }
        const offset = prev.length * 28;
        const x = Math.min(48 + offset, window.innerWidth - 320);
        const y = Math.min(96 + offset, window.innerHeight - 220);
        return [
          ...prev,
          {
            id,
            title,
            body,
            x,
            y,
            width: 320,
            height: id === DOMAIN_NOTE_ID ? 340 : 220,
            zIndex: nextZ,
          },
        ];
      });
      return nextZ;
    });
  }, []);

  const closeNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const dragNote = useCallback((id: string, x: number, y: number) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, x, y } : n)));
  }, []);

  const resizeNote = useCallback(
    (id: string, width: number, height: number, x: number, y: number) => {
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, width, height, x, y } : n)),
      );
    },
    [],
  );

  const domainOpen = notes.some((n) => n.id === DOMAIN_NOTE_ID);
  const originOpen = notes.some((n) => n.id === ORIGIN_NOTE_ID);

  if (!hasPlacements) {
    return (
      <MuseumFrame>
        <section className="museum-zone-learn max-w-2xl">
          <MuseumTitle plaque={t("lesson1.reveal.locked.plaque")}>
            {t("lesson1.reveal.locked.title")}
          </MuseumTitle>
          <div className="museum-line -mt-4 space-y-3">
            <p>{t("lesson1.reveal.locked.body1")}</p>
            <p>{t("lesson1.reveal.locked.body2")}</p>
          </div>
          <div className="mt-2 flex flex-wrap gap-3">
            {onBack ? (
              <MuseumContinue
                label={t("lesson1.reveal.locked.back")}
                onClick={onBack}
                secondary
              />
            ) : null}
            <MuseumContinue
              label={t("lesson1.reveal.locked.skip")}
              onClick={onContinue}
            />
          </div>
        </section>
      </MuseumFrame>
    );
  }

  return (
    <MuseumFrame>
      <section className="museum-zone-learn">
        <div className="grid gap-5 md:gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <div>
            <MuseumTitle plaque={t("lesson1.reveal.plaque")}>
              {t("lesson1.reveal.title")}
            </MuseumTitle>
            <div className="museum-line -mt-4 space-y-6">
              <p className="museum-rule-lede">{t("lesson1.reveal.lede")}</p>

              <div className="museum-rule-list">
                <button
                  type="button"
                  className={`museum-rule museum-rule-pin${domainOpen ? " is-pinned" : ""}`}
                  aria-pressed={domainOpen}
                  aria-label={
                    domainOpen
                      ? t("lesson1.reveal.domain.bringToFrontAria")
                      : t("lesson1.reveal.domain.openAria")
                  }
                  onClick={() =>
                    openNote(
                      DOMAIN_NOTE_ID,
                      t("lesson1.reveal.domain.title"),
                      domainNoteBody,
                    )
                  }
                >
                  <span className="museum-rule-card">
                    <span className="museum-rule-card-top">
                      <span className="museum-rule-num">01</span>
                      <span className="museum-rule-pin-icon" aria-hidden>
                        <svg viewBox="0 0 24 24" width="15" height="15">
                          <path
                            d="M8 4h8l-1.2 7.2A3.2 3.2 0 0 1 12 14a3.2 3.2 0 0 1-2.8-2.8L8 4z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 14v6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    </span>
                    <span className="museum-rule-name">
                      {t("lesson1.reveal.domain.name")}
                    </span>
                    <span className="museum-rule-q">
                      {t("lesson1.reveal.domain.question")}
                    </span>
                    <span className="museum-rule-sub">
                      {t("lesson1.reveal.domain.sub")}
                    </span>
                    <Taxonomy options={domainOptions} />
                  </span>
                </button>

                <button
                  type="button"
                  className={`museum-rule museum-rule-pin${originOpen ? " is-pinned" : ""}`}
                  aria-pressed={originOpen}
                  aria-label={
                    originOpen
                      ? t("lesson1.reveal.origin.bringToFrontAria")
                      : t("lesson1.reveal.origin.openAria")
                  }
                  onClick={() =>
                    openNote(
                      ORIGIN_NOTE_ID,
                      t("lesson1.reveal.origin.title"),
                      originNoteBody,
                    )
                  }
                >
                  <span className="museum-rule-card">
                    <span className="museum-rule-card-top">
                      <span className="museum-rule-num">02</span>
                      <span className="museum-rule-pin-icon" aria-hidden>
                        <svg viewBox="0 0 24 24" width="15" height="15">
                          <path
                            d="M8 4h8l-1.2 7.2A3.2 3.2 0 0 1 12 14a3.2 3.2 0 0 1-2.8-2.8L8 4z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 14v6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    </span>
                    <span className="museum-rule-name">
                      {t("lesson1.reveal.origin.name")}
                    </span>
                    <span className="museum-rule-q">
                      {t("lesson1.reveal.origin.question")}
                    </span>
                    <span className="museum-rule-sub">
                      {t("lesson1.reveal.origin.sub")}
                    </span>
                    <Taxonomy options={originOptions} />
                  </span>
                </button>
              </div>

              <div className="museum-rule-insight">
                <p className="museum-rule-insight-label">
                  {t("lesson1.reveal.insightLabel")}
                </p>
                <p className="museum-rule-insight-body">
                  <RichText text={t("lesson1.reveal.insightBody")} />
                </p>
              </div>
            </div>
          </div>

          <aside className="museum-instinct-note w-full lg:mt-14">
            <p className="museum-instinct-note-label">
              {t("lesson1.reveal.instinctLabel")}
            </p>
            <p className="museum-instinct-note-body">
              {t("lesson1.reveal.instinctBody")}
            </p>
          </aside>
        </div>
      </section>

      <section className="museum-zone-explore">
        <div className="mb-8 max-w-2xl">
          <h2 className="museum-zone-title">{t("lesson1.reveal.reviewTitle")}</h2>
          <p className="museum-line mt-2 max-w-none">
            {t("lesson1.reveal.reviewSub")}
          </p>
        </div>

        <div className="museum-results">
          <motion.div
            className="museum-results-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            <ul className="museum-results-table">
              {results.map(({ item, result }) => {
                const open = selectedId === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedId((prev) =>
                          prev === item.id ? null : item.id,
                        )
                      }
                      className={`museum-row museum-results-row${open ? " museum-row-active" : ""}`}
                    >
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: resultColor(result) }}
                      />
                      <span className="museum-item min-w-0 flex-1">
                        {item.label}
                      </span>
                      <span
                        className="museum-status shrink-0"
                        style={{ color: resultColor(result) }}
                      >
                        <StatusLabel kind={resultKind(result)} />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          <aside className="museum-results-detail">
            <div className="museum-panel museum-results-panel">
              <p className="museum-detail-label">
                {selected
                  ? t("lesson1.reveal.detailLabel")
                  : t("lesson1.reveal.selectObject")}
              </p>
              <AnimatePresence mode="wait">
                {!selected ? (
                  <motion.p
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="museum-results-empty"
                  >
                    {t("lesson1.reveal.emptyDetail")}
                  </motion.p>
                ) : (
                  <motion.div
                    key={selected.item.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="museum-results-body"
                  >
                    <p
                      className="museum-status"
                      style={{ color: resultColor(selected.result) }}
                    >
                      <StatusLabel kind={resultKind(selected.result)} />
                    </p>
                    <p className="museum-results-title">{selected.item.label}</p>

                    <div className="museum-results-badges">
                      <span className="museum-badge">
                        {domainLabel(selected.item.domain)}
                      </span>
                      <span className="museum-badge">
                        {originLabel(selected.item.origin)}
                      </span>
                    </div>

                    <dl className="museum-results-meta">
                      <div>
                        <dt className="museum-detail-label">
                          {t("lesson1.reveal.domain.name")}
                        </dt>
                        <dd className="museum-detail-term">
                          {domainBlurb(selected.item.domain)}
                        </dd>
                      </div>
                      <div>
                        <dt className="museum-detail-label">
                          {t("lesson1.reveal.origin.name")}
                        </dt>
                        <dd className="museum-detail-term">
                          {originBlurb(selected.item.origin)}
                        </dd>
                      </div>
                      <div className="museum-results-you">
                        <dt className="museum-detail-label">
                          {t("lesson1.reveal.youSaid")}
                        </dt>
                        <dd
                          className="museum-item text-right"
                          style={{
                            color:
                              selected.result === "wrong"
                                ? "var(--museum-warn)"
                                : undefined,
                          }}
                        >
                          {bucketLabel(placements[selected.item.id])}
                        </dd>
                      </div>
                    </dl>

                    {selected.item.note ? (
                      <PlaqueNote
                        note={selected.item.note}
                        refs={selected.item.refs}
                      />
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </aside>
        </div>
      </section>

      <section className="museum-zone-learn mt-10">
        <Pedestal float>
          <div className="px-6 py-8 sm:px-8">
            <p className="museum-eyebrow">{t("lesson1.reveal.vanishing.eyebrow")}</p>
            <p className="museum-wordmark mt-3">
              {t("lesson1.reveal.vanishing.wordmark")}
            </p>
            <div className="museum-line mt-4 max-w-2xl space-y-3">
              <RichText as="p" text={t("lesson1.reveal.vanishing.p1")} />
              <p>{t("lesson1.reveal.vanishing.p2")}</p>
              <p>{t("lesson1.reveal.vanishing.p3")}</p>
            </div>
          </div>
        </Pedestal>
      </section>

      <MuseumContinue
        label={t("lesson1.reveal.cta")}
        onClick={onContinue}
      />

      {notes.map((note) => (
        <MuseumStickyNote
          key={note.id}
          note={note}
          onClose={closeNote}
          onFocus={focusNote}
          onDragStop={dragNote}
          onResizeStop={resizeNote}
        />
      ))}
    </MuseumFrame>
  );
}
