"use client";

import React from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { useSiteSettings } from "@/lib/firebase";
import { DEFAULT_SITE_SETTINGS } from "@/types/shewimy";

const EASE_CUBIC = [0.16, 1, 0.3, 1] as const;

export function ProcessJourney() {
  const { settings } = useSiteSettings();
  const shouldReduceMotion = useReducedMotion();

  const badge = settings.processBadge || DEFAULT_SITE_SETTINGS.processBadge;
  const headline = settings.processHeadline || DEFAULT_SITE_SETTINGS.processHeadline;
  const subheadline = settings.processSubheadline || DEFAULT_SITE_SETTINGS.processSubheadline;
  const steps =
    settings.processSteps && settings.processSteps.length > 0
      ? settings.processSteps
      : DEFAULT_SITE_SETTINGS.processSteps;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.15,
      },
    },
  };

  const stepVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: EASE_CUBIC,
      },
    },
  };

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
        <div className="relative">
          {/* Connecting Track Line Drawing Smoothly Across Desktop (RTL from Right to Left) */}
          <motion.div
            initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeInOut" }}
            className="hidden lg:block absolute top-11 inset-x-14 h-[2px] bg-secondary-container/40 z-0 pointer-events-none origin-right"
            aria-hidden="true"
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {steps.map((item) => (
              <motion.div
                key={item.step}
                variants={stepVariants}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: -5,
                        transition: { duration: 0.25, ease: "easeOut" },
                      }
                }
                className="group relative bg-surface-container-lowest p-5 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-outline-variant/10 hover:border-secondary/30 cursor-default"
              >
                {/* Dark step number badge with subtle golden glow on hover */}
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-primary text-secondary-fixed flex items-center justify-center text-sm sm:text-base font-bold mb-4 shadow-sm font-readex border border-white/5 transition-all duration-300 ease-out group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,187,132,0.45)] group-hover:border-secondary-container/60">
                  {item.step}
                </div>
                <h3 className="text-base text-primary mb-2 font-bold font-readex transition-colors duration-200 group-hover:text-secondary">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-on-surface-variant leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
