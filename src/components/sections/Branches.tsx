"use client";

import React from "react";
import {
  Store,
  Factory,
  MapPin,
  Phone,
  Clock,
  Calendar,
  MessageCircle,
} from "lucide-react";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { useBranches } from "@/lib/firebase";
import { generateWhatsAppLink } from "@/lib/whatsapp";

const EASE_CUBIC = [0.16, 1, 0.3, 1] as const;

export function Branches() {
  const { branches } = useBranches();
  const shouldReduceMotion = useReducedMotion();

  const getBranchIcon = (id: string) => {
    switch (id) {
      case "mansoura":
        return <Store className="w-5 h-5 text-secondary" />;
      case "mahalla":
        return <Store className="w-5 h-5 text-secondary" />;
      case "samanoud":
      default:
        return <Factory className="w-5 h-5 text-secondary" />;
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
      },
    },
  };

  const cardVariants: Variants = {
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
    <section className="w-full bg-surface py-16 lg:py-24" id="branches-section">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span>شبكة معارض ومصانع الشويمي الثلاثة بالدلتا (محدثة سحابياً)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary font-readex">
              زوروا فروعنا وتعرفوا على خاماتنا
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-2 max-w-2xl leading-relaxed">
              يسعدنا استقبالكم في صالات عرض ومصانع الشويمي (المنصورة، المحلة الكبرى، سمنود) لمعاينة أحدث تصاميم المطابخ والدريسينج روم على الطبيعة ومناقشة مقايسة مساحتكم مع نخبة من مهندسينا.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-secondary text-xs sm:text-sm font-semibold bg-white px-3.5 py-1.5 rounded-xl border border-charcoal/10 shadow-2xs">
            <Calendar className="w-4 h-4 text-secondary" />
            <span>مفتوح طوال أيام الأسبوع</span>
          </div>
        </div>

        {/* 3 Focused Branch Cards Grid with Staggered Entrance & Micro-Interactions */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {branches.map((branch) => (
            <motion.article
              key={branch.id}
              variants={cardVariants}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: -5,
                      transition: { duration: 0.25, ease: "easeOut" },
                    }
              }
              className="bg-white p-6 sm:p-7 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-charcoal/10 hover:border-secondary/30 space-y-6"
            >
              <div className="space-y-5">
                {/* Card Top / Header */}
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    <span>{branch.badge}</span>
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shadow-2xs border border-charcoal/5 transition-transform duration-300 group-hover:scale-105">
                    {getBranchIcon(branch.id)}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl text-primary font-bold font-readex">
                    {branch.name}
                  </h3>
                  <p className="text-xs text-charcoal/60 mt-1 font-medium">
                    {branch.regionServed}
                  </p>
                </div>

                {/* Info Blocks: Address & Hours */}
                <div className="space-y-2.5">
                  {/* Address */}
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/70 border border-outline-variant/10">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-secondary shrink-0 shadow-2xs border border-charcoal/5 mt-0.5">
                      <MapPin className="w-4 h-4 text-secondary" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-charcoal/50 block">العنوان</span>
                      <p className="text-xs sm:text-sm text-charcoal font-medium leading-relaxed">
                        {branch.address}
                      </p>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low/70 border border-outline-variant/10">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-secondary shrink-0 shadow-2xs border border-charcoal/5">
                      <Clock className="w-4 h-4 text-secondary" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-charcoal/50 block">مواعيد العمل</span>
                      <p className="text-xs sm:text-sm text-charcoal font-medium">
                        {branch.workingHours}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direct Phone Numbers List with Gentle WhatsApp Pulse */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold text-charcoal/60 uppercase tracking-wider block">
                    أرقام التواصل المباشرة
                  </span>
                  <div className="space-y-2">
                    {branch.phones.map((phone, pIdx) => {
                      const telNumber = phone.startsWith("+") ? phone : `+2${phone}`;
                      const waUrl = generateWhatsAppLink(
                        phone,
                        branch.name
                      );

                      return (
                        <div
                          key={pIdx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low/50 hover:bg-surface-container-low border border-outline-variant/15 transition-colors gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-primary shrink-0 shadow-2xs border border-charcoal/5">
                              <Phone className="w-3.5 h-3.5 text-secondary" />
                            </div>
                            <a
                              href={`tel:${telNumber}`}
                              dir="ltr"
                              className="font-mono text-xs sm:text-sm font-bold text-primary hover:text-secondary transition-colors tracking-wide"
                            >
                              {phone}
                            </a>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <a
                              href={`tel:${telNumber}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-charcoal/80 hover:text-primary hover:bg-charcoal/5 border border-charcoal/10 text-[11px] font-semibold transition-all shadow-2xs hover:-translate-y-0.5 active:translate-y-0"
                            >
                              <Phone className="w-3 h-3 text-charcoal/60" />
                              <span>اتصال</span>
                            </a>
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white transition-all text-[11px] font-semibold shadow-2xs hover:-translate-y-0.5 active:translate-y-0 group/wa"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-[#25D366] group-hover/wa:text-white animate-pulse-subtle shrink-0" />
                              <span>واتساب</span>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
