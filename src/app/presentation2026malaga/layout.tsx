import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What is AI — Presentation",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function PresentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
