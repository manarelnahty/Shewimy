"use client";

import React from "react";
import Image from "next/image";
import { BadgeCheck, Eye, Compass } from "lucide-react";
import { useBranches, useSiteSettings } from "@/lib/firebase";
import { DEFAULT_SITE_SETTINGS } from "@/types/shewimy";
import { isValidImageUrl } from "@/lib/image";

interface HeroProps {
  onOpenConsultation?: () => void;
}

export function Hero({ onOpenConsultation }: HeroProps) {
  const { branches } = useBranches();
  const { settings } = useSiteSettings();

  const expYears = settings.heroExperienceYears || DEFAULT_SITE_SETTINGS.heroExperienceYears;
  const warranty = settings.defaultWarrantyYears || DEFAULT_SITE_SETTINGS.defaultWarrantyYears;
  const headline = settings.heroHeadline || DEFAULT_SITE_SETTINGS.heroHeadline;
  const subheadline = settings.heroSubheadline || DEFAULT_SITE_SETTINGS.heroSubheadline;
  const badgeText = settings.heroBadgeText || `خبرة ${expYears} عاماً • ضمان ${warranty} سنة حقيقي`;
  const rawBg = settings.heroBgImage;
  const heroBgImage = isValidImageUrl(rawBg) ? rawBg : DEFAULT_SITE_SETTINGS.heroBgImage;
  const rawShowcase = settings.heroShowcaseImage;
  const heroShowcaseImage = isValidImageUrl(rawShowcase) ? rawShowcase : DEFAULT_SITE_SETTINGS.heroShowcaseImage;
  const heroShowcaseTag = settings.heroShowcaseTag || DEFAULT_SITE_SETTINGS.heroShowcaseTag;
  const heroShowcaseTitle = settings.heroShowcaseTitle || DEFAULT_SITE_SETTINGS.heroShowcaseTitle;
  const heroShowcaseFeature = settings.heroShowcaseFeature || DEFAULT_SITE_SETTINGS.heroShowcaseFeature;
  const heroShowcaseWarranty = settings.heroShowcaseWarranty || `ضمان ${warranty} سنة`;
  const ctaPrimary = settings.heroCtaPrimaryText || DEFAULT_SITE_SETTINGS.heroCtaPrimaryText;
  const ctaSecondary = settings.heroCtaSecondaryText || DEFAULT_SITE_SETTINGS.heroCtaSecondaryText;

  const stats = settings.heroStats || DEFAULT_SITE_SETTINGS.heroStats;

  return (
    <section className="relative w-full overflow-hidden bg-primary pt-24 sm:pt-28 pb-14 lg:pb-20 text-inverse-on-surface">
      {/* Ambient architectural background lighting & customizable decoration texture */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {heroBgImage && (
          <Image
            src={heroBgImage}
            alt="Hero Architectural Decor"
            fill
            sizes="100vw"
            className="object-cover opacity-35 scale-105 transform duration-1000 ease-out"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/75 to-primary/50" />
        <div className="absolute -top-32 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text & CTAs (7 Cols) */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface-container-high/10 backdrop-blur-md border border-white/5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
              <span className="text-xs sm:text-sm font-medium text-secondary-fixed">
                {badgeText}
              </span>
              <BadgeCheck className="w-4 h-4 text-secondary-fixed shrink-0" />
            </div>

            {/* Bold Arabic Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-[38px] xl:text-[42px] font-bold tracking-tight text-on-primary leading-[1.3] text-balance font-readex">
              {headline}
            </h1>

            {/* Editorial Subtitle */}
            <p className="text-sm sm:text-base text-gray-300 max-w-xl leading-relaxed">
              {subheadline}
            </p>

            {/* CTAs Side-by-Side */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onOpenConsultation}
                className="inline-flex items-center justify-center bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs sm:text-sm font-semibold py-2.5 sm:py-3 px-6 sm:px-7 rounded shadow-[0_8px_20px_rgba(31,94,75,0.35)] transition-all transform hover:-translate-y-0.5 cursor-pointer active:translate-y-0"
              >
                <span>{ctaPrimary}</span>
              </button>

              <a
                href="#portfolio-section"
                className="inline-flex items-center gap-2.5 bg-surface-container-high/10 hover:bg-surface-container-high/20 text-on-primary text-xs sm:text-sm font-semibold py-2.5 sm:py-3 px-5 sm:px-6 rounded shadow-sm transition-all hover:text-secondary-fixed cursor-pointer"
              >
                <Eye className="w-4 h-4 shrink-0 text-on-primary" />
                <span>{ctaSecondary}</span>
              </a>
            </div>

            {/* Quick Stat Pills */}
            <div className="pt-4 grid grid-cols-3 gap-3 max-w-md">
              <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg p-3.5 shadow-sm text-center">
                <p className="text-lg sm:text-xl font-bold text-[#ffdcc3] font-readex">
                  {stats.stat1Value || "+3,500"}
                </p>
                <p className="text-[11px] sm:text-xs text-gray-300 mt-0.5">
                  {stats.stat1Label || "مطبخ منفّذ"}
                </p>
              </div>

              <a
                href="#branches-section"
                className="bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm rounded-lg p-3.5 shadow-sm text-center block transition-colors"
              >
                <p className="text-lg sm:text-xl font-bold text-[#ffdcc3] font-readex">
                  {branches.length > 0 ? `${branches.length} فروع` : stats.stat2Value || "3 فروع"}
                </p>
                <p className="text-[11px] sm:text-xs text-gray-300 mt-0.5">
                  {stats.stat2Label || "بمنطقة الدلتا"}
                </p>
              </a>

              <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg p-3.5 shadow-sm text-center">
                <p className="text-lg sm:text-xl font-bold text-[#ffdcc3] font-readex">
                  {stats.stat3Value || "100%"}
                </p>
                <p className="text-[11px] sm:text-xs text-gray-300 mt-0.5">
                  {stats.stat3Label || "خامات أوروبية"}
                </p>
              </div>
            </div>
          </div>

          {/* Hero Focal Showcase Card (5 Cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-xl overflow-hidden shadow-2xl bg-primary-container group border border-white/10">
              <div className="relative w-full h-[340px] sm:h-[390px]">
                <Image
                  src={heroShowcaseImage}
                  alt={heroShowcaseTitle}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-90 pointer-events-none" />

              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-on-primary">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-secondary-container" />
                  <span className="text-[11px] font-semibold text-secondary-fixed uppercase tracking-wider">
                    {heroShowcaseTag}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white font-readex leading-snug">
                  {heroShowcaseTitle}
                </h3>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-300 border-t border-white/15 pt-3">
                  <span className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-secondary-fixed" />
                    {heroShowcaseFeature}
                  </span>
                  <span className="text-secondary-fixed font-medium">
                    {heroShowcaseWarranty}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
