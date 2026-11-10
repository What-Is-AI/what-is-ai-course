"use client";

import { useState } from "react";
import {
  ConnectedContinue,
  ConnectedFrame,
  ConnectedTitle,
} from "@/components/practical1/ConnectedOfficeFrame";
import { usePractical1Copy } from "@/lib/usePractical1Copy";

type Task = 1 | 2 | 3;
type Props = { onContinue: () => void };

export function BuildIt({ onContinue }: Props) {
  const { t } = usePractical1Copy();
  const [task, setTask] = useState<Task>(1);
  const [ran1, setRan1] = useState(false);
  const [ran2, setRan2] = useState(false);
  const [choice, setChoice] = useState<"leave" | "include" | null>(null);
  const [confirm, setConfirm] = useState<"ask" | "done" | null>(null);

  if (task === 1) {
    return (
      <ConnectedFrame>
        <ConnectedTitle plaque={t("practical1.build.task1.label")}>
          {t("practical1.build.task1.prompt")}
        </ConnectedTitle>
        {!ran1 ? (
          <ConnectedContinue
            label={t("practical1.build.task1.run")}
            onClick={() => setRan1(true)}
          />
        ) : (
          <div className="mt-6 max-w-2xl space-y-4">
            <ul className="connected-door list-disc space-y-2 px-6 py-4">
              <li>{t("practical1.build.task1.result1")}</li>
              <li>{t("practical1.build.task1.result2")}</li>
              <li>{t("practical1.build.task1.result3")}</li>
            </ul>
            <p className="font-semibold text-[color:var(--connected-access)]">
              {t("practical1.build.task1.gate")}
            </p>
            <ConnectedContinue
              label={t("practical1.build.task1.cta")}
              onClick={() => setTask(2)}
            />
          </div>
        )}
      </ConnectedFrame>
    );
  }

  if (task === 2) {
    return (
      <ConnectedFrame>
        <ConnectedTitle plaque={t("practical1.build.task2.label")}>
          {t("practical1.build.task2.prompt")}
        </ConnectedTitle>

        {choice == null ? (
          <div className="mt-6 max-w-2xl space-y-4">
            <p className="connected-body">
              {t("practical1.build.task2.choicePrompt")}
            </p>
            <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2">
              <button
                type="button"
                className="connected-door connected-choice-btn p-4 text-left is-selected"
                onClick={() => {
                  setChoice("leave");
                  setRan2(true);
                }}
              >
                {t("practical1.build.task2.leaveOut")}
              </button>
              <button
                type="button"
                className="connected-door connected-choice-btn p-4 text-left"
                onClick={() => {
                  setChoice("include");
                  setRan2(true);
                }}
              >
                {t("practical1.build.task2.includeIt")}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 max-w-2xl space-y-4">
            {choice === "include" ? (
              <p className="connected-body font-semibold text-[color:var(--connected-boundary)]">
                {t("practical1.build.task2.stop")}
              </p>
            ) : null}
            {ran2 ? (
              <>
                <div className="connected-door p-5">
                  <p className="connected-body">
                    {t("practical1.build.task2.result")}
                  </p>
                </div>
                <p className="font-semibold text-[color:var(--connected-access)]">
                  {t("practical1.build.task2.gate")}
                </p>
                <ConnectedContinue
                  label={t("practical1.build.task2.cta")}
                  onClick={() => setTask(3)}
                />
              </>
            ) : null}
          </div>
        )}
      </ConnectedFrame>
    );
  }

  return (
    <ConnectedFrame>
      <ConnectedTitle plaque={t("practical1.build.task3.label")}>
        {t("practical1.build.task3.prompt")}
      </ConnectedTitle>

      {confirm == null ? (
        <ConnectedContinue
          label={t("practical1.build.task1.run")}
          onClick={() => setConfirm("ask")}
        />
      ) : confirm === "ask" ? (
        <div className="connected-door connected-confirm mt-6 max-w-2xl p-5">
          <p className="connected-body font-semibold">
            {t("practical1.build.task3.confirm")}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              className="connected-btn"
              onClick={() => setConfirm("done")}
            >
              {t("practical1.build.task3.confirmBtn")}
            </button>
            <button
              type="button"
              className="connected-btn-secondary"
              onClick={() => setConfirm(null)}
            >
              {t("practical1.build.task3.cancelBtn")}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 max-w-2xl space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="connected-toast">{t("practical1.build.task3.sent")}</span>
            <span className="connected-toast">{t("practical1.build.task3.logged")}</span>
          </div>
          <p className="font-semibold text-[color:var(--connected-access)]">
            {t("practical1.build.task3.gate")}
          </p>
          <ConnectedContinue
            label={t("practical1.build.task3.cta")}
            onClick={onContinue}
          />
        </div>
      )}
    </ConnectedFrame>
  );
}
