"use client";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Optional small page mark (e.g. “passage”). Exhibit only. */
  mark?: string;
};

/**
 * The living page surface — warm paper, no chatbot chrome.
 * Exhibit container; put Choose / Operate controls inside or beside.
 */
export function PaperPage({ children, className = "", mark }: Props) {
  return (
    <div className={`rr-page ${className}`.trim()}>
      {mark ? <p className="rr-page-mark">{mark}</p> : null}
      {children}
    </div>
  );
}
