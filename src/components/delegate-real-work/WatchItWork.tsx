"use client";

import { useCallback, useState } from "react";
import {
  CoworkerContinue,
  CoworkerFrame,
  CoworkerTitle,
} from "@/components/delegate-real-work/CoworkerFrame";
import { PlaybackPlayer } from "@/components/delegate-real-work/PlaybackPlayer";
import { useDelegateRealWorkCopy } from "@/lib/useDelegateRealWorkCopy";

type Props = {
  onContinue: () => void;
};

export function WatchItWork({ onContinue }: Props) {
  const { t } = useDelegateRealWorkCopy();
  const [completed, setCompleted] = useState(false);
  const handleComplete = useCallback(() => setCompleted(true), []);

  return (
    <CoworkerFrame>
      <CoworkerTitle plaque={t("delegateRealWork.watch.plaque")}>
        {t("delegateRealWork.watch.title")}
      </CoworkerTitle>

      <PlaybackPlayer
        className="mt-2 max-w-3xl"
        onComplete={handleComplete}
      />

      {completed ? (
        <div className="mt-8 max-w-2xl space-y-4">
          <p className="coworker-line">{t("delegateRealWork.watch.beatAfter")}</p>
          <CoworkerContinue
            label={t("delegateRealWork.watch.cta")}
            onClick={onContinue}
          />
        </div>
      ) : null}
    </CoworkerFrame>
  );
}
