"use client";

import { createContext, useContext } from "react";

/** When true, CourseFrame skips its footer — page renders SiteFooter after SEO spine. */
const DeferSiteFooterContext = createContext(false);

export function DeferSiteFooter({ children }: { children: React.ReactNode }) {
  return (
    <DeferSiteFooterContext.Provider value={true}>
      {children}
    </DeferSiteFooterContext.Provider>
  );
}

export function useDeferSiteFooter() {
  return useContext(DeferSiteFooterContext);
}
