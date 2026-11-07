"use client";

import React from "react";
import Image from "next/image";
import { BadgeCheck, Sparkles, Eye, Compass } from "lucide-react";

interface HeroProps {
  onOpenConsultation?: () => void;
}

export function Hero({ onOpenConsultation }: HeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-primary pt-24 pb-14 lg:pb-20 text-inverse-on-surface">
      {/* Ambient architectural background lighting & subtle textures */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transform duration-1000 ease-out"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDDtrfwYXyPdVW7vkQLkOwT_qpKjlPvUpcxPaZ569OKPjrShBbB6i3X_kTs4GHSITMpoPO-qdDdgMeqRF4l6psC2Drc5SodNA-HFVJ45AcUqhf0fKUBZcyWpLFTE_FMWNFfh4Kd8BBgUdOyNkZcdrJ0V6rF98v0cIRn6d-4UV6JreLJu1a4B8KR8u2JrLuUZ2JmVuH_6ORbFfp4iu_lgDLHo_wxidqvZMlZT0YBJvI')",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/60" />
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
                خبرة ٢٤ عاماً • ضمان ١٥ سنة حقيقي
              </span>
              <BadgeCheck className="w-4 h-4 text-secondary-fixed shrink-0" />
            </div>

            {/* Bold Arabic Headline - Refined, Balanced Architectural Scale */}
            <h1 className="text-2xl sm:text-3xl lg:text-[38px] xl:text-[42px] font-bold tracking-tight text-on-primary leading-[1.3] text-balance font-readex">
              مطابخ فاخرة تُصنع بحرفية استثنائية لمنزلك العصري
            </h1>

            {/* Editorial Subtitle */}
            <p className="text-sm sm:text-base text-on-primary-container max-w-xl leading-relaxed">
              من التصميم الهندسي ثلاثي الأبعاد إلى التصنيع بماكينات إيطالية بمصانعنا الخاصة، نبتكر مساحات تجمع بين الرقي والعملية بأعلى معايير الجودة العالمية.
            </p>

            {/* CTAs Side-by-Side */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onOpenConsultation}
                className="inline-flex items-center gap-2.5 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs sm:text-sm font-semibold py-2.5 sm:py-3 px-6 sm:px-7 rounded shadow-[0_8px_20px_rgba(31,94,75,0.35)] transition-all transform hover:-translate-y-0.5 cursor-pointer active:translate-y-0"
              >
                <Sparkles className="w-4 h-4 shrink-0 text-white" />
                <span>صمم مطبخك الآن</span>
              </button>

              <a
                href="#portfolio-section"
                className="inline-flex items-center gap-2.5 bg-surface-container-high/10 hover:bg-surface-container-high/20 text-on-primary text-xs sm:text-sm font-semibold py-2.5 sm:py-3 px-5 sm:px-6 rounded shadow-sm transition-all hover:text-secondary-fixed cursor-pointer"
              >
                <Eye className="w-4 h-4 shrink-0 text-on-primary" />
                <span>تصفح أعمالنا</span>
              </a>
            </div>

            {/* Quick Stat Pills */}
            <div className="pt-4 grid grid-cols-3 gap-3 max-w-md">
              <div className="p-2.5 sm:p-3 rounded-lg bg-surface-container-high/10 backdrop-blur-sm shadow-sm text-center border border-white/5">
                <p className="text-lg sm:text-xl font-bold text-secondary-fixed font-readex">
                  +3,500
                </p>
                <p className="text-[11px] sm:text-xs text-on-primary-container mt-0.5">
                  مطبخ منفّذ
                </p>
              </div>
              <div className="p-2.5 sm:p-3 rounded-lg bg-surface-container-high/10 backdrop-blur-sm shadow-sm text-center border border-white/5">
                <p className="text-lg sm:text-xl font-bold text-secondary-fixed font-readex">
                  3 فروع
                </p>
                <p className="text-[11px] sm:text-xs text-on-primary-container mt-0.5">
                  بمنطقة الدلتا
                </p>
              </div>
              <div className="p-2.5 sm:p-3 rounded-lg bg-surface-container-high/10 backdrop-blur-sm shadow-sm text-center border border-white/5">
                <p className="text-lg sm:text-xl font-bold text-secondary-fixed font-readex">
                  100%
                </p>
                <p className="text-[11px] sm:text-xs text-on-primary-container mt-0.5">
                  خامات أوروبية
                </p>
              </div>
            </div>
          </div>

          {/* Hero Focal Showcase Card (5 Cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-xl overflow-hidden shadow-2xl bg-primary-container group border border-white/10">
              <div className="relative w-full h-[340px] sm:h-[390px]">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZPi3rNDLqy4PubhaFsY0GXjPOjvVzOgqKuRgPTQWqadFBkULDj0RBFBqXIDIgUbF8D98lS88Acqk_0UjzJMJ89X107_xdCZSbQt7Y9xZ-_Z94RmBAMU7JqCwk_iazTG1vytPQbdwDdwHzZJeVgGf5GftCquoevscR6RbVO4eRWZ-twqWF-u4rNjgONOmgQb2MgcEdHwjf6pZPoIu0eFea5Iaz8K_DZuz_Uo03or4"
                  alt="مطبخ مودرن فخم مدمج مع جزيرة رخامية وأجهزة إيطالية"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-90 pointer-events-none" />

              {/* Architectural Tag Card */}
              <div className="absolute bottom-4 inset-x-4 p-3.5 rounded-lg bg-primary-container/90 backdrop-blur-md shadow-lg flex items-center justify-between border border-white/5">
                <div>
                  <span className="text-[11px] font-medium text-secondary-fixed block">
                    الخامات المعتمدة
                  </span>
                  <span className="text-xs sm:text-sm text-on-primary font-bold font-readex">
                    جوز أمريكي طبيعي مع بورسلين كلكتا
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-secondary/30 flex items-center justify-center text-secondary-fixed shrink-0">
                  <Compass className="w-4 h-4 text-secondary-fixed" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
