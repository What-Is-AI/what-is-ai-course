import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { homeJsonLd } from "@/lib/seo-json-ld";

export const metadata: Metadata = pageMetadata("home");

export default function Page() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <HomePage />
    </>
  );
}
