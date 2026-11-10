"use client";

import { useMessageBranch } from "@/i18n/useMessageBranch";
import en from "../../messages/lesson6/en.json";

export type Lesson6StepCopy = typeof en.lesson6.steps;

const EMPTY_CHROME: Record<string, Record<string, string>> = {};
const EMPTY_DATA: Record<string, unknown> = {};

export function useLesson6StepCopy(): Lesson6StepCopy {
  return useMessageBranch("lesson6.steps", en.lesson6.steps);
}

export function useLesson6Chrome() {
  return useMessageBranch("lesson6.chrome", EMPTY_CHROME);
}

export function useLesson6DataCopy() {
  return useMessageBranch("lesson6.data", EMPTY_DATA);
}
