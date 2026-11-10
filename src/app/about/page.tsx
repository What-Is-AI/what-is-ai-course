import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { aboutPageJsonLd } from "@/lib/seo-json-ld";

export const metadata: Metadata = pageMetadata("about");

export default function Page() {
  return (
    <>
      {aboutPageJsonLd().map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <AboutPage />
    </>
  );
}
