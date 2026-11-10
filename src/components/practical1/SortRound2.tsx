"use client";

import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  MuseumStickyNote,
  type StickyNoteData,
} from "@/components/lesson1/MuseumStickyNote";
import {
  ConnectedContinue,
  ConnectedFrame,
  ConnectedLine,
  ConnectedTitle,
} from "@/components/practical1/ConnectedOfficeFrame";
import {
  DECIDING_QUESTION_IDS,
  GATE_ANSWERS,
  GATE_QUESTION_IDS,
  gutMatchesGate,
  round2AutoResolvedIds,
  round2ReopenIds,
  type GateQuestionId,
  type GateVerdictId,
  type GutBucketId,
  type SortCardId,
  type TransferChoiceId,
} from "@/lib/practical1-data";
import { usePractical1Copy } from "@/lib/usePractical1Copy";

type Phase = "meet" | "resort" | "score" | "transfer";

type Props = {
  gutPlacements: Record<SortCardId, GutBucketId>;
  onContinue: () => void;
};

type GateQ = { id: string; title: string; body: string };

function questionNum(id: GateQuestionId): number {
  return GATE_QUESTION_IDS.indexOf(id) + 1;
}

function GateQuestionChip({
  q,
  pinned,
  onPin,
  openAria,
  bringToFrontAria,
  pinHint,
}: {
  q: GateQ;
  pinned: boolean;
  onPin: () => void;
  openAria: string;
  bringToFrontAria: string;
  pinHint: string;
}) {
  const n = questionNum(q.id as GateQuestionId);
  return (
    <button
      type="button"
      className={`connected-gate-chip${pinned ? " is-pinned" : ""}`}
      aria-pressed={pinned}
      aria-label={pinned ? bringToFrontAria : openAria}
      onClick={onPin}
    >
      <span className="connected-gate-chip-label">Q{n}</span>
      <span className="connected-gate-chip-tip" role="tooltip">
        <span className="connected-gate-chip-tip-title">{q.title}</span>
        <span className="connected-gate-chip-tip-body">{q.body}</span>
        <span className="connected-gate-chip-tip-hint">{pinHint}</span>
      </span>
    </button>
  );
}

function DecidingRefs({
  decidingKey,
  questions,
  pinnedIds,
  onPin,
  openAria,
  bringToFrontAria,
  pinHint,
  allPassLabel,
}: {
  decidingKey: string;
  questions: GateQ[];
  pinnedIds: Set<string>;
  onPin: (id: GateQuestionId) => void;
  openAria: (n: number) => string;
  bringToFrontAria: (n: number) => string;
  pinHint: string;
  allPassLabel: string;
}) {
  const ids = DECIDING_QUESTION_IDS[decidingKey] ?? [];
  if (ids.length === 0) return null;

  return (
    <span className="connected-deciding-refs">
      {ids.map((id, i) => {
        const q = questions.find((item) => item.id === id);
        if (!q) return null;
        const n = questionNum(id);
        return (
          <span key={id} className="connected-deciding-refs-item">
            {i > 0 ? (
              <span className="connected-deciding-joiner" aria-hidden>
                {decidingKey === "all" ? "–" : "+"}
              </span>
            ) : null}
            <GateQuestionChip
              q={q}
              pinned={pinnedIds.has(id)}
              onPin={() => onPin(id)}
              openAria={openAria(n)}
              bringToFrontAria={bringToFrontAria(n)}
              pinHint={pinHint}
            />
          </span>
        );
      })}
      {decidingKey === "all" ? (
        <span className="connected-deciding-suffix">{allPassLabel}</span>
      ) : null}
    </span>
  );
}

export function SortRound2({ gutPlacements, onContinue }: Props) {
  const {
    t,
    gateQuestions,
    gateVerdicts,
    sortCard,
    transferChoices,
    gutBucketLabel,
  } = usePractical1Copy();
  const [phase, setPhase] = useState<Phase>("meet");
  const [gateReveal, setGateReveal] = useState(0);
  const reopen = useMemo(
    () => round2ReopenIds(gutPlacements),
    [gutPlacements],
  );
  const autoResolved = useMemo(
    () => round2AutoResolvedIds(gutPlacements),
    [gutPlacements],
  );
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<"ok" | "bad" | null>(null);
  const [transfer, setTransfer] = useState<TransferChoiceId | null>(null);
  const [transferMiss, setTransferMiss] = useState(false);
  const [notes, setNotes] = useState<StickyNoteData[]>([]);
  const [topZ, setTopZ] = useState(40);

  const currentId = reopen[index] as SortCardId | undefined;
  const current = currentId ? sortCard(currentId) : null;
  const movedCount = useMemo(() => {
    let n = 0;
    for (const id of Object.keys(gutPlacements) as SortCardId[]) {
      const gut = gutPlacements[id];
      if (!gutMatchesGate(gut, GATE_ANSWERS[id].verdict)) n += 1;
    }
    return n;
  }, [gutPlacements]);

  const pinnedIds = useMemo(
    () => new Set(notes.map((n) => n.id)),
    [notes],
  );

  const focusNote = useCallback((id: string) => {
    setTopZ((z) => {
      const next = z + 1;
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, zIndex: next } : n)),
      );
      return next;
    });
  }, []);

  const openNote = useCallback(
    (id: GateQuestionId, title: string, body: ReactNode) => {
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
          const x = Math.min(48 + offset, window.innerWidth - 300);
          const y = Math.min(112 + offset, window.innerHeight - 220);
          return [
            ...prev,
            {
              id,
              title,
              body,
              x,
              y,
              width: 300,
              height: 220,
              zIndex: nextZ,
            },
          ];
        });
        return nextZ;
      });
    },
    [],
  );

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

  const pinQuestion = useCallback(
    (id: GateQuestionId) => {
      const q = gateQuestions.find((item) => item.id === id);
      if (!q) return;
      const n = questionNum(id);
      openNote(
        id,
        t("practical1.gate.resort.noteTitle", { n }),
        <>
          <p className="museum-sticky-kicker">{q.title}</p>
          <p className="museum-sticky-sub">{q.body}</p>
        </>,
      );
    },
    [gateQuestions, openNote, t],
  );

  function setPhaseAndClearNotes(next: Phase) {
    setNotes([]);
    setPhase(next);
  }

  function pickVerdict(verdict: GateVerdictId) {
    if (!currentId) return;
    const correct = GATE_ANSWERS[currentId].verdict;
    setFeedback(verdict === correct ? "ok" : "bad");
  }

  function advanceCard() {
    setFeedback(null);
    if (index >= reopen.length - 1) {
      setPhaseAndClearNotes("score");
      return;
    }
    setIndex((i) => i + 1);
  }

  const stickyLayer =
    phase === "resort"
      ? notes.map((note) => {
          const n = questionNum(note.id as GateQuestionId);
          return (
            <MuseumStickyNote
              key={note.id}
              note={note}
              onClose={closeNote}
              onFocus={focusNote}
              onDragStop={dragNote}
              onResizeStop={resizeNote}
              closeAriaLabel={t("practical1.gate.resort.closeNoteAria", { n })}
            />
          );
        })
      : null;

  if (phase === "meet") {
    return (
      <ConnectedFrame>
        <ConnectedTitle plaque={t("practical1.gate.meet.plaque")}>
          {t("practical1.gate.meet.title")}
        </ConnectedTitle>
        <ConnectedLine>{t("practical1.gate.meet.subhead")}</ConnectedLine>

        <ol className="connected-gate mt-8 max-w-2xl">
          {gateQuestions.slice(0, gateReveal + 1).map((q, i) => (
            <li key={q.id} className="connected-gate-lock is-open">
              <span className="connected-gate-num">{i + 1}</span>
              <div>
                <p className="font-semibold">{q.title}</p>
                <p className="connected-body mt-1 text-sm">{q.body}</p>
              </div>
            </li>
          ))}
        </ol>

        {gateReveal < gateQuestions.length - 1 ? (
          <ConnectedContinue
            label={t("practical1.shared.continue")}
            onClick={() => setGateReveal((n) => n + 1)}
          />
        ) : (
          <div className="mt-6 max-w-2xl">
            <p className="font-semibold text-[color:var(--connected-access)]">
              {t("practical1.gate.meet.onlyIf")}
            </p>
            <ConnectedContinue
              label={t("practical1.gate.meet.cta")}
              onClick={() => setPhase("resort")}
            />
          </div>
        )}
      </ConnectedFrame>
    );
  }

  if (phase === "resort" && current && currentId) {
    const answer = GATE_ANSWERS[currentId];
    const showAuto =
      autoResolved.length > 0 && index === 0 && feedback == null;
    return (
      <ConnectedFrame>
        <ConnectedTitle plaque={t("practical1.gate.resort.plaque")}>
          {t("practical1.gate.resort.title")}
        </ConnectedTitle>
        <ConnectedLine>{t("practical1.gate.resort.subhead")}</ConnectedLine>
        <p className="connected-plaque mt-3">
          {t("practical1.gate.resort.approvedNote")}
        </p>

        <div className="connected-door mt-6 max-w-2xl p-5">
          <p className="connected-plaque">
            {t("practical1.gate.resort.counter", {
              n: index + 1,
              total: reopen.length,
            })}
          </p>
          <p className="connected-title mt-2 text-[clamp(1.2rem,3vw,1.55rem)]">
            {current.title}
          </p>
          <p className="connected-body mt-2 text-sm">{current.detail}</p>
          <p className="mt-3 text-sm text-[color:var(--connected-ink-soft)]">
            Gut: {gutBucketLabel(gutPlacements[currentId])}
          </p>
        </div>

        {feedback == null ? (
          <div className="mt-5 grid max-w-2xl grid-cols-3 gap-2">
            {gateVerdicts.map((v) => (
              <button
                key={v.id}
                type="button"
                className={`connected-bucket connected-bucket-${v.id}`}
                onClick={() => pickVerdict(v.id as GateVerdictId)}
              >
                <span className="connected-bucket-icon" aria-hidden />
                <span>{v.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-6 max-w-2xl space-y-3">
            <p
              className={
                feedback === "ok"
                  ? "font-semibold text-[color:var(--connected-access)]"
                  : "font-semibold text-[color:var(--connected-boundary)]"
              }
            >
              {feedback === "ok"
                ? t("practical1.shared.feedback.matches")
                : t("practical1.shared.feedback.rethink")}
            </p>
            <p className="connected-body connected-deciding-line">
              <DecidingRefs
                decidingKey={answer.decidingKey}
                questions={gateQuestions}
                pinnedIds={pinnedIds}
                onPin={pinQuestion}
                openAria={(n) => t("practical1.gate.resort.openAria", { n })}
                bringToFrontAria={(n) =>
                  t("practical1.gate.resort.bringToFrontAria", { n })
                }
                pinHint={t("practical1.gate.resort.pinHint")}
                allPassLabel={t("practical1.gate.resort.allPass")}
              />
              <span className="connected-deciding-plain">
                {" "}
                – {current.plainLine}
              </span>
            </p>
            {feedback === "bad" ? (
              <p className="connected-body text-sm">
                Expected:{" "}
                {gateVerdicts.find((v) => v.id === answer.verdict)?.label}
              </p>
            ) : null}
            <ConnectedContinue
              label={
                index >= reopen.length - 1
                  ? t("practical1.gate.resort.seeSort")
                  : t("practical1.gate.resort.next")
              }
              onClick={advanceCard}
            />
          </div>
        )}

        <details className="connected-aside mt-8 max-w-2xl">
          <summary className="connected-aside-summary">
            {t("practical1.gate.resort.refsToggle")}
          </summary>
          <p className="connected-gate-refs-hint">
            {t("practical1.gate.resort.refsHint")}
          </p>
          <div className="connected-gate-chips" role="group">
            {gateQuestions.map((q) => {
              const n = questionNum(q.id as GateQuestionId);
              return (
                <GateQuestionChip
                  key={q.id}
                  q={q}
                  pinned={pinnedIds.has(q.id)}
                  onPin={() => pinQuestion(q.id as GateQuestionId)}
                  openAria={t("practical1.gate.resort.openAria", { n })}
                  bringToFrontAria={t(
                    "practical1.gate.resort.bringToFrontAria",
                    { n },
                  )}
                  pinHint={t("practical1.gate.resort.pinHint")}
                />
              );
            })}
          </div>
        </details>

        {showAuto ? (
          <details className="connected-aside mt-3 max-w-2xl">
            <summary className="connected-aside-summary">
              {t("practical1.gate.resort.autoToggle", {
                n: autoResolved.length,
              })}
            </summary>
            <ul className="connected-auto-strip">
              {autoResolved.map((id) => (
                <li key={id}>
                  <strong>{sortCard(id)?.title}</strong> –{" "}
                  {t("practical1.gate.resort.autoLine")}{" "}
                  {sortCard(id)?.plainLine}
                </li>
              ))}
            </ul>
          </details>
        ) : null}

        {stickyLayer}
      </ConnectedFrame>
    );
  }

  if (phase === "score") {
    return (
      <ConnectedFrame>
        <ConnectedTitle plaque={t("practical1.gate.score.plaque")}>
          {t("practical1.gate.score.title", { n: movedCount })}
        </ConnectedTitle>
        <ConnectedLine>{t("practical1.gate.score.subhead")}</ConnectedLine>
        <ConnectedContinue
          label={t("practical1.gate.score.cta")}
          onClick={() => setPhase("transfer")}
        />
      </ConnectedFrame>
    );
  }

  return (
    <ConnectedFrame>
      <ConnectedTitle plaque={t("practical1.gate.transfer.plaque")}>
        {t("practical1.gate.transfer.question")}
      </ConnectedTitle>
      <ConnectedLine>{t("practical1.gate.transfer.setup")}</ConnectedLine>

      <div className="mt-8 grid max-w-2xl gap-3" role="radiogroup">
        {transferChoices.map((c) => (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={transfer === c.id}
            className={`connected-door connected-choice-btn p-4 text-left${
              transfer === c.id ? " is-selected" : ""
            }`}
            onClick={() => {
              setTransfer(c.id as TransferChoiceId);
              setTransferMiss(c.id === "yes_opened");
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {transfer === "yes_opened" && transferMiss ? (
        <p className="connected-body mt-6 max-w-2xl" role="status">
          {t("practical1.gate.transfer.miss")}
        </p>
      ) : null}
      {transfer === "no_tells_nothing" ? (
        <p className="connected-body mt-6 max-w-2xl font-semibold text-[color:var(--connected-access)]">
          {t("practical1.gate.transfer.hit")}
        </p>
      ) : null}

      {transfer === "no_tells_nothing" ||
      (transfer === "yes_opened" && !transferMiss) ? (
        <ConnectedContinue
          label={t("practical1.gate.transfer.cta")}
          onClick={onContinue}
        />
      ) : transfer === "yes_opened" ? (
        <ConnectedContinue
          label={t("practical1.shared.continue")}
          onClick={() => {
            setTransfer(null);
            setTransferMiss(false);
          }}
        />
      ) : null}
    </ConnectedFrame>
  );
}
