"use client";

import type { ReactNode } from "react";
import { AboutConstellation } from "@/components/about/AboutConstellation";
import { MusicCredits } from "@/components/lesson7/MusicCredits";
import { CourseFrame } from "@/components/lesson/CourseFrame";
import { RichText } from "@/i18n/RichText";
import { useT } from "@/i18n/LocaleProvider";

function ExtLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export function AboutPage() {
  const t = useT();

  const essays = [
    {
      title: t("about.how.start.title"),
      body: [t("about.how.start.body")],
    },
    {
      title: t("about.how.using.title"),
      body: [t("about.how.using.body")],
    },
    {
      title: t("about.how.patterns.title"),
      body: [t("about.how.patterns.body1"), t("about.how.patterns.body2")],
    },
  ];

  return (
    <CourseFrame>
      <div className="about-world min-h-screen">
        <article className="mx-auto flex w-full max-w-5xl flex-col px-5 pb-20 pt-16 sm:px-8 sm:pb-28 lg:pt-14">
          <header className="about-hero">
            <p className="about-kicker">{t("about.eyebrow")}</p>
            <h1 className="about-serif about-hero-title">{t("about.title")}</h1>
            <div className="about-hero-blurb">
              <RichText as="p" className="about-hero-intro" text={t("about.intro")} />
              <p className="about-colophon">
                {t("about.who.before")}{" "}
                <ExtLink href="https://www.proaiassistant.com">
                  {t("about.who.proAi")}
                </ExtLink>
                {t("about.who.mid")}{" "}
                <ExtLink href="https://www.malaga-ai.community">
                  {t("about.who.malagaAi")}
                </ExtLink>
                {t("about.who.after")}
              </p>
            </div>
            <div className="about-hero-aside">
              <AboutConstellation />
              <p className="about-serif about-hero-lead">{t("about.lead")}</p>
            </div>
          </header>

          <section className="about-essays" aria-labelledby="about-how">
            <h2 id="about-how" className="about-essays-label">
              {t("about.how.title")}
            </h2>
            {essays.map((essay) => (
              <article key={essay.title} className="about-essay">
                <h3 className="about-serif">{essay.title}</h3>
                {essay.body.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </article>
            ))}
          </section>

          <MusicCredits
            className="about-music-credits"
            variant="full"
            copy={{
              title: t("about.music.title"),
              body: t("about.music.body"),
              artistLine: t("about.music.artistLine"),
              licenseLabel: t("about.music.licenseLabel"),
            }}
          />
        </article>
      </div>
    </CourseFrame>
  );
}
