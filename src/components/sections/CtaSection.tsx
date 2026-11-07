"use client";

import React from "react";

interface CtaSectionProps {
  onOpenConsultation?: () => void;
}

export function CtaSection({ onOpenConsultation }: CtaSectionProps) {
  return (
    <section className="w-full bg-primary py-16 lg:py-20 text-inverse-on-surface relative overflow-hidden">
      {/* Architectural glow decoration */}
      <div
        className="absolute -right-20 top-1/2 -translate-y-1/2 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1380px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="bg-primary-container p-8 lg:p-14 rounded-2xl shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10 border border-outline-variant/10">
          <div className="space-y-4 max-w-2xl text-center lg:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-secondary/20 text-secondary-fixed font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[16px]">support_agent</span>
              <span>استشارة معمارية مجانية</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-primary font-readex">
              جاهز لتصميم مطبخ أحلامك؟
            </h2>
            <p className="font-body-lg text-body-lg text-on-primary-container leading-relaxed">
              احصل على استشارة هندسية ومعاينة ثلاثية الأبعاد 3D مجاناً لمساحتك بمساعدة نخبة مهندسي التصميم المعماري في مطابخ الشويمي.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto shrink-0">
            <button
              type="button"
              onClick={onOpenConsultation}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#1F5E4B] hover:bg-[#164638] text-white font-label-lg text-label-lg py-4 px-8 rounded shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer active:translate-y-0"
            >
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              <span>احجز معاينتك المجانية الآن</span>
            </button>
            <a
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1eb956] text-white font-label-lg text-label-lg py-4 px-6 rounded transition-colors shadow-md"
              href="https://wa.me/201002345678?text=مرحباً%20أود%20الاستفسار%20عن%20حجز%20معاينة%20وتصميم%20مطبخ"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
              <span>محادثة واتساب مباشرة</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
