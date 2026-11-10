export const LESSONS = [
  {
    id: "1",
    number: 1,
    title: "What counts as AI?",
    shortTitle: "What counts as AI?",
    mystery: "Is ChatGPT the whole story – or just one chapter?",
    href: "/lessons/1",
  },
  {
    id: "2",
    number: 2,
    title: "The Day AI Stopped Following Rules",
    shortTitle: "Rules vs Learning",
    mystery: "Why can’t we just write the rules?",
    href: "/lessons/2",
  },
  {
    id: "3",
    number: 3,
    title: "Why Data Changed Everything",
    shortTitle: "Why Data Changed Everything",
    mystery:
      "If computers could learn in the 1980s… why did AI explode only recently?",
    href: "/lessons/3",
  },
  {
    id: "4",
    number: 4,
    title: "How Does a Machine Actually Learn?",
    shortTitle: "How Machines Learn",
    mystery:
      "If nobody writes the rules, what actually changes while a machine is learning?",
    href: "/lessons/4",
  },
  {
    id: "5",
    number: 5,
    title: "Neural Networks",
    shortTitle: "Inside the machine that learns",
    mystery:
      "How can a collection of simple units learn something as complicated as recognizing a face?",
    href: "/lessons/5",
  },
  {
    id: "6",
    number: 6,
    title: "Deep Learning",
    shortTitle: "Deep Learning",
    mystery:
      "What becomes possible when a neural network can build on its own earlier representations?",
    href: "/lessons/6",
  },
  {
    id: "7",
    number: 7,
    title: "From Features to Representations",
    shortTitle: "Where features come from",
    mystery: "What information actually matters?",
    href: "/lessons/7",
  },
  {
    id: "8",
    number: 8,
    title: "Transformers",
    shortTitle: "Transformers",
    mystery: "What if each word could look directly at the words it needs?",
    href: "/lessons/8",
  },
  {
    id: "working-with-llms",
    number: null,
    title: "Working With LLMs",
    shortTitle: "Working With LLMs",
    mystery:
      "Why do experienced AI users get dramatically better results from the same model?",
    href: "/lessons/working-with-llms",
  },
  {
    id: "delegate-real-work",
    number: null,
    title: "The First Job You Hand Off",
    shortTitle: "Delegate real work",
    mystery:
      "What changes the first time AI does the work instead of just answering questions?",
    href: "/lessons/delegate-real-work",
  },
  {
    id: "just-because-it-can",
    number: null,
    title: "Just Because It Can",
    shortTitle: "Just Because It Can",
    mystery:
      "When you connect AI to your real data, who decides what it's allowed to touch?",
    href: "/lessons/just-because-it-can",
  },
] as const;

export type LessonMeta = (typeof LESSONS)[number];

/** Lessons shown in public nav, homepage, and /lessons index.
 *  This is the public information architecture — never include admin,
 *  analytics, drafts, or unpublished stubs here. */
export const VISIBLE_LESSONS = LESSONS.filter(
  (lesson) => !("hidden" in lesson && lesson.hidden),
);

export function isLessonHidden(id: string): boolean {
  const lesson = LESSONS.find((item) => item.id === id);
  return Boolean(lesson && "hidden" in lesson && lesson.hidden);
}

/** Message-catalog prefix for a lesson (`lesson1`, `workingWithLlms`, …). */
export function lessonCopyPrefix(lesson: LessonMeta): string {
  if (lesson.id === "working-with-llms") return "workingWithLlms";
  if (lesson.id === "delegate-real-work") return "delegateRealWork";
  if (lesson.id === "just-because-it-can") return "practical1";
  if (lesson.number != null) return `lesson${lesson.number}`;
  return "common";
}

/** Unnumbered visible items (Practice track), as opposed to Lesson 1–N. */
export function isPracticeLesson(lesson: LessonMeta): boolean {
  return lesson.number == null;
}

export function lessonCollapsedMark(lesson: LessonMeta): string {
  if (lesson.number != null) return String(lesson.number);
  if (lesson.id === "working-with-llms") return "practice1";
  if (lesson.id === "delegate-real-work") return "practice2";
  if (lesson.id === "just-because-it-can") return "practice3";
  return "placeholder";
}

/** Eyebrow label for sidebar / home cards (CSS uppercases it). */
export function lessonBadge(lesson: LessonMeta): string {
  if (lesson.number != null) return `Lesson ${lesson.number}`;
  if (lesson.id === "working-with-llms") return "Practice 1";
  if (lesson.id === "delegate-real-work") return "Practice 2 · Claude";
  if (lesson.id === "just-because-it-can") return "Practice 3 · Gemini";
  return "Lesson";
}
