import type { Metadata } from "next";
import { WhenItGoesLookingComingSoon } from "@/components/when-it-goes-looking/ComingSoon";
import { pageMetadata } from "@/lib/seo";

/**
 * Stub for the next practical after Just Because It Can.
 * Real lesson will replace this page at the same URL.
 */
export const metadata: Metadata = pageMetadata("lessons/when-it-goes-looking");

export default function WhenItGoesLookingPage() {
  return <WhenItGoesLookingComingSoon />;
}
