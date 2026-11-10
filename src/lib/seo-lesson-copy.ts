export type LessonSeoSection = {
  heading: string;
  body: string;
};

export type LessonSeoSpine = {
  /** Search-facing H1 — separate from in-lesson world titles. */
  h1: string;
  lead: string;
  sections: LessonSeoSection[];
};
