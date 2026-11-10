"use client";

import { useMemo } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { useMessageBranch } from "@/i18n/useMessageBranch";
import { getMessageNode } from "@/i18n/translate";
import en from "../../messages/lesson8/en.json";
import {
  tokenizePassage,
  type AttentionLink,
  type ChallengeQuestion,
  type LookupDrawer,
  type NextTokenRound,
  type TelephoneChain,
  type WordToken,
} from "@/lib/lesson8-data";

export type Lesson8StepCopy = typeof en.lesson8.steps;

export function useLesson8StepCopy(): Lesson8StepCopy {
  return useMessageBranch("lesson8.steps", en.lesson8.steps);
}

const EMPTY_CHROME: Record<string, Record<string, string>> = {};

export function useLesson8Chrome(): Record<string, Record<string, string>> {
  return useMessageBranch("lesson8.chrome", EMPTY_CHROME);
}

type Lesson8DataMessages = {
  illustrativeNumbersNote: string;
  canonicalSentence: string;
  telephoneShort: TelephoneChain;
  telephoneLong: TelephoneChain;
  lookupQuery: string;
  lookupDrawers: LookupDrawer[];
  orderOriginal: string;
  orderShuffled: string;
  hideContextSentence: string;
  hideFutureWord: string;
  nextTokenRounds: Array<{
    id: string;
    context: string;
    candidates: NextTokenRound["candidates"];
  }>;
  challengeQuestions: ChallengeQuestion[];
};

function normalizeToken(text: string): string {
  return text.replace(/[^\w']/g, "").toLowerCase();
}

function wordIdByNormalized(
  words: readonly WordToken[],
  label: string,
): string {
  return words.find((w) => normalizeToken(w.text) === normalizeToken(label))?.id ?? label;
}

/** Locale-aware Lesson 8 interactive strings + derived word graph. */
export function useLesson8LocaleData() {
  const { locale } = useLocale();

  return useMemo(() => {
    const data =
      getMessageNode<Lesson8DataMessages>(locale, "lesson8.data") ??
      getMessageNode<Lesson8DataMessages>("en", "lesson8.data");
    if (!data) {
      throw new Error("lesson8.data messages missing");
    }

    const canonicalWords = tokenizePassage(data.canonicalSentence);
    const focusNorm = normalizeToken(data.hideFutureWord);
    const canonicalItId =
      canonicalWords.find((w) => normalizeToken(w.text) === focusNorm)?.id ??
      "w7";

    const roleLabel = (role: string) =>
      data.lookupDrawers.find((d) => d.id === role)?.keyLabel ?? role;

    const demoAttentionLinks: AttentionLink[] = [
      {
        fromId: canonicalItId,
        toId: wordIdByNormalized(canonicalWords, roleLabel("animal")),
        strength: 0.82,
      },
      {
        fromId: canonicalItId,
        toId: wordIdByNormalized(canonicalWords, roleLabel("road")),
        strength: 0.41,
      },
      {
        fromId: canonicalItId,
        toId: wordIdByNormalized(canonicalWords, roleLabel("busy")),
        strength: 0.09,
      },
    ];

    const hideContextWords = tokenizePassage(data.hideContextSentence);
    const hideFocusId =
      hideContextWords[hideContextWords.length - 1]?.id ?? "w6";

    // Prefer drawer labels; fall back to common Spanish/English surface forms.
    const wouldntForms = ["wouldn't", "wouldnt", "no"];
    const wouldntId =
      wouldntForms
        .map((f) =>
          hideContextWords.find((w) => normalizeToken(w.text) === normalizeToken(f)),
        )
        .find(Boolean)?.id ?? hideFocusId;

    const hideAttentionLinks: AttentionLink[] = [
      {
        fromId: hideFocusId,
        toId: wordIdByNormalized(hideContextWords, roleLabel("animal")),
        strength: 0.55,
      },
      {
        fromId: hideFocusId,
        toId: wordIdByNormalized(hideContextWords, roleLabel("road")),
        strength: 0.72,
      },
      {
        fromId: hideFocusId,
        toId: wouldntId,
        strength: 0.28,
      },
      {
        fromId: hideFocusId,
        toId: hideFocusId,
        strength: 0.35,
      },
    ];

    const headALinks: AttentionLink[] = [
      {
        fromId: canonicalItId,
        toId: wordIdByNormalized(canonicalWords, roleLabel("animal")),
        strength: 0.88,
      },
      {
        fromId: canonicalItId,
        toId: wordIdByNormalized(canonicalWords, roleLabel("road")),
        strength: 0.22,
      },
    ];

    const headBLinks: AttentionLink[] = [
      {
        fromId: canonicalItId,
        toId: wordIdByNormalized(canonicalWords, roleLabel("road")),
        strength: 0.75,
      },
      {
        fromId: canonicalItId,
        toId: wordIdByNormalized(canonicalWords, roleLabel("busy")),
        strength: 0.48,
      },
      {
        fromId: canonicalItId,
        toId: wordIdByNormalized(canonicalWords, roleLabel("animal")),
        strength: 0.18,
      },
    ];

    const nextTokenRounds: NextTokenRound[] = data.nextTokenRounds.map(
      (round) => {
        const words = tokenizePassage(round.context);
        const focusId = words[words.length - 1]?.id ?? "w0";
        const animal = roleLabel("animal");
        const road = roleLabel("road");
        const attention: AttentionLink[] =
          round.id === "r1"
            ? [
                {
                  fromId: focusId,
                  toId: wordIdByNormalized(words, road),
                  strength: 0.72,
                },
                {
                  fromId: focusId,
                  toId: wordIdByNormalized(words, animal),
                  strength: 0.48,
                },
                {
                  fromId: focusId,
                  toId: wouldntForms
                    .map((f) =>
                      words.find(
                        (w) => normalizeToken(w.text) === normalizeToken(f),
                      ),
                    )
                    .find(Boolean)?.id ?? focusId,
                  strength: 0.22,
                },
                { fromId: focusId, toId: focusId, strength: 0.3 },
              ]
            : [
                {
                  fromId: focusId,
                  toId: wordIdByNormalized(words, animal),
                  strength: 0.8,
                },
                {
                  fromId: focusId,
                  toId: wordIdByNormalized(words, road),
                  strength: 0.35,
                },
                {
                  fromId: focusId,
                  toId:
                    words.find((w) =>
                      ["porque", "because"].includes(normalizeToken(w.text)),
                    )?.id ?? focusId,
                  strength: 0.25,
                },
                { fromId: focusId, toId: focusId, strength: 0.28 },
              ];
        return {
          id: round.id,
          context: round.context,
          attention,
          candidates: round.candidates,
        };
      },
    );

    const paperStepWords = tokenizePassage(
      // Prefer opening lead-in sentence without the because-clause when available
      data.hideContextSentence.replace(/\s+porque\s*$/i, "").replace(/\s+because\s*$/i, "") ||
        data.hideContextSentence,
    );

    return {
      illustrativeNumbersNote: data.illustrativeNumbersNote,
      canonicalSentence: data.canonicalSentence,
      canonicalWords,
      canonicalItId,
      telephoneShort: data.telephoneShort,
      telephoneLong: data.telephoneLong,
      lookupQuery: data.lookupQuery,
      lookupDrawers: data.lookupDrawers,
      orderOriginal: data.orderOriginal,
      orderShuffled: data.orderShuffled,
      hideContextSentence: data.hideContextSentence,
      hideContextWords,
      hideFocusId,
      hideFutureWord: data.hideFutureWord,
      hideAttentionLinks,
      demoAttentionLinks,
      headALinks,
      headBLinks,
      nextTokenRounds,
      challengeQuestions: data.challengeQuestions,
      paperStepWords,
      roleLabel,
    };
  }, [locale]);
}
