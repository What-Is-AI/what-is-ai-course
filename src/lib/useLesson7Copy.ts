"use client";

import { useMessageBranch } from "@/i18n/useMessageBranch";
import en from "../../messages/lesson7/en.json";

export type Lesson7StepCopy = typeof en.lesson7.steps;

/** Nested chrome: sections hold strings or further nested maps. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Lesson7Chrome = Record<string, any>;

const EMPTY_CHROME: Lesson7Chrome = {};
const EMPTY_DATA: Record<string, unknown> = {};

export function useLesson7StepCopy(): Lesson7StepCopy {
  return useMessageBranch("lesson7.steps", en.lesson7.steps);
}

export function useLesson7Chrome(): Lesson7Chrome {
  return useMessageBranch("lesson7.chrome", EMPTY_CHROME);
}

export function useLesson7DataCopy() {
  return useMessageBranch("lesson7.data", EMPTY_DATA);
}
