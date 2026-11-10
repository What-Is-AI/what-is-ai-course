"use client";

import { useLesson7StepCopy } from "@/lib/useLesson7Copy";

type Props = {
  className?: string;
  /** Override default caption from copy. */
  children?: React.ReactNode;
};

/**
 * Persistent label wherever a 2-D song layout appears.
 * Script: "our drawing, not inside the model"
 */
export function DrawingCaption({ className = "", children }: Props) {
  const steps = useLesson7StepCopy();
  return (
    <p className={`lr-drawing-caption ${className}`.trim()} role="note">
      {children ?? steps.drawingCaption}
    </p>
  );
}
