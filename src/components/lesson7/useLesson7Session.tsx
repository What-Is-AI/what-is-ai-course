"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_THRESHOLD,
  SLIDER_FEATURES,
  type FeatureOptionId,
  type SliderFeatureId,
} from "@/lib/lesson7-data";
import type { LogisticModel } from "@/lib/lesson7-train";

export type LearnerJudgment = "belongs" | "doesnt";

export type LayoutPoint = { id: string; x: number; y: number };

type SessionState = {
  playlistIds: string[];
  togglePlaylist: (id: string) => void;
  setPlaylistIds: (ids: string[]) => void;

  features: FeatureOptionId[];
  toggleFeature: (id: FeatureOptionId) => void;

  thresholds: Partial<Record<SliderFeatureId, number>>;
  setThreshold: (id: SliderFeatureId, value: number) => void;
  ensureThresholds: () => void;
  activeSliderIds: SliderFeatureId[];

  judgments: Record<string, LearnerJudgment>;
  setJudgment: (clipId: string, value: LearnerJudgment) => void;
  clearJudgments: () => void;

  /** Step 4 train labels (belongs / doesn't). */
  trainLabels: Record<string, LearnerJudgment>;
  setTrainLabel: (clipId: string, value: LearnerJudgment) => void;

  trainedModel: LogisticModel | null;
  setTrainedModel: (model: LogisticModel | null) => void;
  layoutAfter: LayoutPoint[];
  setLayoutAfter: (points: LayoutPoint[]) => void;
  hasTrained: boolean;
  setHasTrained: (v: boolean) => void;
};

const Lesson7SessionContext = createContext<SessionState | null>(null);

function isSliderFeature(id: FeatureOptionId): id is SliderFeatureId {
  return (SLIDER_FEATURES as readonly string[]).includes(id);
}

export function Lesson7SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [playlistIds, setPlaylistIds] = useState<string[]>([]);
  const [features, setFeatures] = useState<FeatureOptionId[]>([]);
  const [thresholds, setThresholds] = useState<
    Partial<Record<SliderFeatureId, number>>
  >({});
  const [judgments, setJudgments] = useState<Record<string, LearnerJudgment>>(
    {},
  );
  const [trainLabels, setTrainLabels] = useState<
    Record<string, LearnerJudgment>
  >({});
  const [trainedModel, setTrainedModel] = useState<LogisticModel | null>(null);
  const [layoutAfter, setLayoutAfter] = useState<LayoutPoint[]>([]);
  const [hasTrained, setHasTrained] = useState(false);

  const togglePlaylist = useCallback((id: string) => {
    setPlaylistIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const toggleFeature = useCallback((id: FeatureOptionId) => {
    setFeatures((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const activeSliderIds = useMemo(() => {
    const picked = features.filter(isSliderFeature);
    return picked.length > 0 ? picked : [...SLIDER_FEATURES];
  }, [features]);

  const ensureThresholds = useCallback(() => {
    setThresholds((prev) => {
      const next = { ...prev };
      const ids =
        features.filter(isSliderFeature).length > 0
          ? features.filter(isSliderFeature)
          : [...SLIDER_FEATURES];
      for (const id of ids) {
        if (next[id] == null) next[id] = DEFAULT_THRESHOLD;
      }
      for (const key of Object.keys(next) as SliderFeatureId[]) {
        if (!ids.includes(key)) delete next[key];
      }
      return next;
    });
  }, [features]);

  const setThreshold = useCallback((id: SliderFeatureId, value: number) => {
    setThresholds((prev) => ({ ...prev, [id]: value }));
  }, []);

  const setJudgment = useCallback((clipId: string, value: LearnerJudgment) => {
    setJudgments((prev) => ({ ...prev, [clipId]: value }));
  }, []);

  const clearJudgments = useCallback(() => setJudgments({}), []);

  const setTrainLabel = useCallback((clipId: string, value: LearnerJudgment) => {
    setTrainLabels((prev) => ({ ...prev, [clipId]: value }));
  }, []);

  const value = useMemo(
    () => ({
      playlistIds,
      togglePlaylist,
      setPlaylistIds,
      features,
      toggleFeature,
      thresholds,
      setThreshold,
      ensureThresholds,
      activeSliderIds,
      judgments,
      setJudgment,
      clearJudgments,
      trainLabels,
      setTrainLabel,
      trainedModel,
      setTrainedModel,
      layoutAfter,
      setLayoutAfter,
      hasTrained,
      setHasTrained,
    }),
    [
      playlistIds,
      togglePlaylist,
      features,
      toggleFeature,
      thresholds,
      setThreshold,
      ensureThresholds,
      activeSliderIds,
      judgments,
      setJudgment,
      clearJudgments,
      trainLabels,
      setTrainLabel,
      trainedModel,
      layoutAfter,
      hasTrained,
    ],
  );

  return (
    <Lesson7SessionContext.Provider value={value}>
      {children}
    </Lesson7SessionContext.Provider>
  );
}

export function useLesson7Session(): SessionState {
  const ctx = useContext(Lesson7SessionContext);
  if (!ctx) {
    throw new Error("useLesson7Session must be used within Lesson7SessionProvider");
  }
  return ctx;
}
