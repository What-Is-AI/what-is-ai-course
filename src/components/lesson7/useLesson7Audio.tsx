"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ClipRecord, Lesson7AudioBundle } from "@/lib/lesson7-audio";
import { loadLesson7AudioBundle, clipsWithRole } from "@/lib/lesson7-load-audio";

type AudioState = {
  bundle: Lesson7AudioBundle | null;
  loading: boolean;
  error: string | null;
  playingId: string | null;
  setPlayingId: (id: string | null) => void;
  clipsFor: (role: string) => ClipRecord[];
  clipById: (id: string) => ClipRecord | undefined;
};

const Lesson7AudioContext = createContext<AudioState | null>(null);

export function Lesson7AudioProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [bundle, setBundle] = useState<Lesson7AudioBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadLesson7AudioBundle()
      .then((data) => {
        if (!cancelled) {
          setBundle(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load audio");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const clipsFor = useCallback(
    (role: string) => (bundle ? clipsWithRole(bundle, role) : []),
    [bundle],
  );

  const clipById = useCallback(
    (id: string) => bundle?.clips.find((c) => c.id === id),
    [bundle],
  );

  const value = useMemo(
    () => ({
      bundle,
      loading,
      error,
      playingId,
      setPlayingId,
      clipsFor,
      clipById,
    }),
    [bundle, loading, error, playingId, clipsFor, clipById],
  );

  return (
    <Lesson7AudioContext.Provider value={value}>
      {children}
    </Lesson7AudioContext.Provider>
  );
}

export function useLesson7Audio(): AudioState {
  const ctx = useContext(Lesson7AudioContext);
  if (!ctx) {
    throw new Error("useLesson7Audio must be used within Lesson7AudioProvider");
  }
  return ctx;
}
