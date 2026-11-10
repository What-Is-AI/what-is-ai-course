import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { ConditionalGoogleAnalytics } from "@/components/ConditionalGoogleAnalytics";
import { GaConsentBanner } from "@/components/GaConsentBanner";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { rootMetadata } from "@/lib/seo";
import {
  figtree,
  ibmPlexMono,
  instrumentSerif,
  inter,
  jetbrainsMono,
  literata,
  plusJakarta,
  roboto,
  sourceSans,
  sourceSerif,
  spaceGrotesk,
  syne,
} from "@/fonts";
import "./globals.css";

export const metadata: Metadata = rootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${inter.variable} ${figtree.variable} ${instrumentSerif.variable} ${ibmPlexMono.variable} ${literata.variable} ${spaceGrotesk.variable} ${plusJakarta.variable} ${sourceSans.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} ${roboto.variable} h-full`}
      style={{
        ...syne.style,
        ...inter.style,
        ...figtree.style,
        ...instrumentSerif.style,
        ...ibmPlexMono.style,
        ...literata.style,
        ...spaceGrotesk.style,
        ...plusJakarta.style,
        ...sourceSans.style,
        ...sourceSerif.style,
        ...jetbrainsMono.style,
        ...roboto.style,
      }}
    >
      <body className="relative min-h-full antialiased">
        <LocaleProvider>
          <AnalyticsProvider>{children}</AnalyticsProvider>
          <GaConsentBanner />
        </LocaleProvider>
        <Analytics />
        <ConditionalGoogleAnalytics />
      </body>
    </html>
  );
}
