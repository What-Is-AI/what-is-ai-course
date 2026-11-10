import type { Metadata } from "next";

/**
 * Admin / analytics area — must not appear in search.
 *
 * Indexing: `robots: noindex` (HTML meta) on every route under this layout.
 * Crawling: also Disallow in robots.txt + X-Robots-Tag header (see next.config).
 * These are complementary, not interchangeable — see comments in src/app/robots.ts.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function OtherDoorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
