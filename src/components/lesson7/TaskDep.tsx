"use client";

import { useEffect, useMemo, useState } from "react";
import { SongBoard } from "@/components/lesson7/SongBoard";
import {
  ListeningRoomContinue,
  ListeningRoomFrame,
  ListeningRoomLine,
  ListeningRoomTitle,
} from "@/components/lesson7/ListeningRoomFrame";
import { useLesson7Audio } from "@/components/lesson7/useLesson7Audio";
import {
  useLesson7Chrome,
  useLesson7StepCopy,
} from "@/lib/useLesson7Copy";

type Props = {
  onContinue: () => void;
  gateOpen: boolean;
  onGate: () => void;
  reducedMotion: boolean;
};

type TaskId = "sweat" | "sleep" | "instrument";

const TASK_IDS: TaskId[] = ["sweat", "sleep", "instrument"];

/**
 * Step 7 – task dependence: same songs, different useful info.
 * Roles: Choose (task chips) · Exhibit (SongBoard + reveal) · Advance (left, first viewport).
 */
export function TaskDep({
  onContinue,
  gateOpen,
  onGate,
  reducedMotion,
}: Props) {
  const steps = useLesson7StepCopy();
  const copy = steps.taskDep;
  const chrome = useLesson7Chrome();
  const ui = chrome.taskDep ?? {};
  const { bundle } = useLesson7Audio();
  const [open, setOpen] = useState<Partial<Record<TaskId, boolean>>>({});
  const [active, setActive] = useState<TaskId>("sweat");

  const openedSweat = Boolean(open.sweat);
  const openedSleep = Boolean(open.sleep);
  const gateReady = openedSweat && openedSleep;

  useEffect(() => {
    if (gateReady) onGate();
  }, [gateReady, onGate]);

  const clips = useMemo(() => {
    if (!bundle) return [];
    const fromRole = bundle.clips.filter((c) => c.roles.includes("task-view"));
    return fromRole.length >= 8 ? fromRole : bundle.clips.slice(0, 16);
  }, [bundle]);

  const points = useMemo(() => {
    if (!bundle) return [];
    const layout = bundle.layoutsByTask[active] ?? bundle.layoutDefault;
    const ids = new Set(clips.map((c) => c.id));
    return layout.filter((p) => ids.has(p.id));
  }, [bundle, active, clips]);

  const activeTitle = ui[active] ?? active;

  const selectTask = (id: TaskId) => {
    setOpen((prev) => ({ ...prev, [id]: true }));
    setActive(id);
  };

  return (
    <ListeningRoomFrame>
      <div className="lr-step-grid lr-task-grid">
        <div className="lr-task-choose">
          <ListeningRoomTitle plaque={copy.plaque} compact>
            {copy.title}
          </ListeningRoomTitle>
          <ListeningRoomLine compact>{copy.bridge}</ListeningRoomLine>

          <p className="lr-helper lr-task-helper" id="task-dep-helper">
            {copy.helper}
          </p>

          <div
            className="lr-task-chips"
            role="list"
            aria-labelledby="task-dep-helper"
          >
            {TASK_IDS.map((id) => {
              const isOpen = Boolean(open[id]);
              const isActive = active === id;
              const mattersKey = `${id}Matters` as const;
              return (
                <div key={id} className="lr-task-chip-wrap" role="listitem">
                  <button
                    type="button"
                    className={`lr-task-chip${isOpen ? " is-open" : ""}${isActive ? " is-active" : ""}`}
                    aria-pressed={isActive}
                    aria-expanded={isOpen}
                    onClick={() => selectTask(id)}
                  >
                    <span className="lr-task-chip-label">{ui[id]}</span>
                    <span className="lr-task-chip-cue" aria-hidden />
                  </button>
                  {isOpen ? (
                    <p
                      className={`lr-task-matters${isActive ? " is-active" : ""}`}
                      aria-live={isActive ? "polite" : undefined}
                    >
                      {ui[mattersKey]}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>

          {gateReady ? (
            <div className="lr-task-advance">
              <h3 className="lr-reveal-title">{copy.revealTitle}</h3>
              <ListeningRoomLine compact>{copy.revealBody1}</ListeningRoomLine>
              <ListeningRoomContinue
                label={copy.cta}
                onClick={onContinue}
                disabled={!gateOpen}
                className="mt-4"
              />
            </div>
          ) : null}
        </div>

        <aside className="lr-task-aside">
          <SongBoard
            clips={clips}
            points={points}
            reducedMotion={reducedMotion}
            summary={(ui.layoutSummary ?? "Layout: {title} task – our drawing.").replace(
              "{title}",
              activeTitle,
            )}
            className="lr-task-board"
          />
          {gateReady ? (
            <div className="lr-task-reveal">
              <ListeningRoomLine compact>{copy.revealBody2}</ListeningRoomLine>
              <p className="lr-task-aside-note">{copy.clarification}</p>
              <p className="lr-task-aside-note">{copy.foundationNod}</p>
            </div>
          ) : null}
        </aside>
      </div>
    </ListeningRoomFrame>
  );
}
