"use client";

import React from "react";
import { useSiteSettings } from "@/lib/firebase";
import { DEFAULT_SITE_SETTINGS } from "@/types/shewimy";

export function ProcessJourney() {
  const { settings } = useSiteSettings();

  const badge = settings.processBadge || DEFAULT_SITE_SETTINGS.processBadge;
  const headline = settings.processHeadline || DEFAULT_SITE_SETTINGS.processHeadline;
  const subheadline = settings.processSubheadline || DEFAULT_SITE_SETTINGS.processSubheadline;
  const steps = settings.processSteps && settings.processSteps.length > 0
    ? settings.processSteps
    : DEFAULT_SITE_SETTINGS.processSteps;

  return (
    <section
      className="w-full bg-surface-container-low py-16 lg:py-24 relative overflow-hidden"
      id="journey-section"
    >
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="text-xs sm:text-sm text-secondary font-semibold uppercase tracking-wider">
            {badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary font-readex">
            {headline}
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            {subheadline}
          </p>
        </div>

        {/* Timeline Steps Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Connecting Track Line (Desktop Only) */}
          <div
            className="hidden lg:block absolute top-11 inset-x-14 h-[2px] bg-secondary-container/40 z-0 pointer-events-none"
            aria-hidden="true"
          />

          {steps.map((item) => (
            <div
              key={item.step}
              className="relative z-10 bg-surface-container-lowest p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-outline-variant/10"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-primary text-secondary-fixed flex items-center justify-center text-sm sm:text-base font-bold mb-4 shadow-sm font-readex">
                {item.step}
              </div>
              <h3 className="text-base text-primary mb-2 font-bold font-readex">
                {item.title}
              </h3>
              <p className="text-xs sm:text-[13px] text-on-surface-variant leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
