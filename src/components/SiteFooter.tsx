"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useT } from "@/i18n/LocaleProvider";
import {
  LICENSE_CODE_URL,
  LICENSE_CONTENT_URL,
  SITE_REPO_URL,
} from "@/lib/seo";

function ExtLink({
  href,
  children,
  className,
  title,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      title={title}
    >
      {children}
    </a>
  );
}

export function SiteFooter() {
  const t = useT();
  const year = new Date().getFullYear();
  const proAi = t("about.who.proAi");
  const malagaAi = t("about.who.malagaAi");
  const warranty = t("common.footerWarrantyNote");

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-credits">
          <div className="site-footer-credit-group">
            <p className="site-footer-label">{t("common.footerCreatedBy")}</p>
            <ExtLink
              href="https://www.proaiassistant.com"
              className="site-footer-brand"
            >
              <span className="site-footer-brand-mark-slot" aria-hidden>
                <Image
                  src="/Logo/paa-logo.png"
                  alt=""
                  width={120}
                  height={107}
                  className="site-footer-brand-mark site-footer-brand-mark-paa-desktop"
                />
                <Image
                  src="/Logo/paa-logo-mobile.png"
                  alt=""
                  width={112}
                  height={112}
                  className="site-footer-brand-mark site-footer-brand-mark-paa-mobile"
                />
              </span>
              <span className="site-footer-brand-name">{proAi}</span>
            </ExtLink>
          </div>

          <div className="site-footer-credit-group">
            <p className="site-footer-label">{t("common.footerSupportedBy")}</p>
            <ExtLink
              href="https://www.malaga-ai.community"
              className="site-footer-brand"
            >
              <span className="site-footer-brand-mark-slot" aria-hidden>
                <img
                  src="/Logo/malaga-ai-mark.svg"
                  alt=""
                  width={120}
                  height={120}
                  className="site-footer-brand-mark site-footer-brand-mark-malaga"
                />
              </span>
              <span className="site-footer-brand-name site-footer-brand-name-malaga">
                {malagaAi}
              </span>
            </ExtLink>
          </div>
        </div>

        <div className="site-footer-legal">
          <p className="site-footer-legal-line">
            {t("common.copyright", { year })}
          </p>
          <p className="site-footer-legal-line site-footer-legal-licenses">
            <ExtLink href={LICENSE_CODE_URL}>
              {t("common.footerCodeLicense")}
            </ExtLink>
            <span aria-hidden className="site-footer-legal-sep">
              ·
            </span>
            <ExtLink href={LICENSE_CONTENT_URL}>
              {t("common.footerLessonsLicense")}
            </ExtLink>
            {SITE_REPO_URL ? (
              <>
                <span aria-hidden className="site-footer-legal-sep">
                  ·
                </span>
                <ExtLink href={SITE_REPO_URL}>
                  {t("common.footerSource")}
                </ExtLink>
              </>
            ) : null}
          </p>
          <p className="site-footer-legal-line site-footer-warranty">
            {warranty}
          </p>
        </div>
      </div>
    </footer>
  );
}
