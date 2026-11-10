/**
 * Load the Lesson 7 offline audio bundle (static JSON).
 */

import type { Lesson7AudioBundle } from "@/lib/lesson7-audio";
import { LESSON7_AUDIO_PATHS } from "@/lib/lesson7-audio";

export async function loadLesson7AudioBundle(): Promise<Lesson7AudioBundle> {
  const res = await fetch(LESSON7_AUDIO_PATHS.bundle);
  if (!res.ok) {
    throw new Error(
      `Lesson 7 audio bundle missing (${res.status}). Run scripts/lesson7/build_audio_assets.py`,
    );
  }
  return (await res.json()) as Lesson7AudioBundle;
}

export function clipsWithRole(
  bundle: Lesson7AudioBundle,
  role: string,
) {
  return bundle.clips.filter((c) => c.roles.includes(role as never));
}
