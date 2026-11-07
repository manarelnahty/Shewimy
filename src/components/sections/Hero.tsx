import React from "react";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import { ArrowLeft, Sparkles, Award, Shield, CheckCircle2 } from "lucide-react";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32 bg-gradient-to-b from-alabaster via-alabaster/50 to-alabaster-200/40"
    >
      {/* Decorative ambient background glows */}
      <div
        className="absolute top-0 right-1/4 -z-10 w-96 h-96 rounded-full bg-bronze/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 left-10 -z-10 w-80 h-80 rounded-full bg-emerald/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-right">
            {/* Tag / Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bronze/10 border border-bronze/20 text-bronze text-xs sm:text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-bronze" />
              <span>إتقان حرفي وأخشاب طبيعية فاخرة منذ أكثر من 30 عاماً</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-charcoal leading-[1.2] tracking-tight font-readex">
              نصيغ الخشب الطبيعي{" "}
              <span className="text-bronze underline decoration-bronze/30 underline-offset-8">
                تحفاً معمارية
              </span>{" "}
              تدوم لأجيال
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg lg:text-xl text-charcoal/80 leading-relaxed max-w-2xl font-normal">
              في الشويحي، نبتكر أثاثاً منزلياً ومكتبياً وتجاليد خشبية مخصصة بأعلى معايير الجودة الأوروبية.
              كل قطعة تحكي قصة أناقة فريدة مصممة خصيصاً لمساحتك وذوقك الرفيع.
            </p>

            {/* Key benefits quick badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs sm:text-sm text-charcoal/90 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald shrink-0" />
                <span>أخشاب زان وأرو وجوز مستورد</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald shrink-0" />
                <span>ضمان شامل يصل إلى 10 سنوات</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald shrink-0" />
                <span>تصميم ثلاثي الأبعاد قبل التنفيذ</span>
              </div>
            </div>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="emerald"
                  size="lg"
                  className="w-full sm:w-auto text-base"
                  icon={<ArrowLeft className="w-5 h-5" />}
                  iconPosition="end"
                >
                  احجز استشارة تصميم مجانية
                </Button>
              </a>

              <a href="#portfolio">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-base border-charcoal/30 hover:border-bronze hover:text-bronze"
                >
                  استكشف سابقة الأعمال
                </Button>
              </a>
            </div>
          </div>

          {/* Hero Image / Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl bg-gradient-to-tr from-charcoal via-charcoal-700 to-charcoal-900 p-3 sm:p-4 shadow-2xl border border-charcoal/10">
              {/* Inner preview card */}
              <div className="rounded-xl overflow-hidden bg-charcoal-900 border border-white/10 relative aspect-[4/5] flex flex-col justify-between p-6 sm:p-8 text-alabaster">
                {/* Top overlay badge */}
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 rounded-md bg-bronze/90 text-white text-xs font-semibold tracking-wide">
                    مشروع مميز
                  </span>
                  <div className="text-left text-xs text-alabaster/60 font-mono">
                    #DRD-2026-08
                  </div>
                </div>

                {/* Decorative Architectural Visualization Graphic */}
                <div className="my-auto text-center space-y-4 py-8">
                  <div className="inline-block p-4 rounded-full bg-bronze/20 border border-bronze/40">
                    <Sparkles className="w-10 h-10 text-bronze animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold font-readex text-alabaster">
                    جناح صالون ملكي وأعمال أرو ماسيف
                  </h3>
                  <p className="text-sm text-alabaster/70 max-w-xs mx-auto leading-relaxed">
                    تنفيذ خاص لأحد القصور بالتجمع الخامس يجمع بين تجليد الجدران المطعّم بالنحاس وأطقم الجلوس الفاخرة
                  </p>
                </div>

                {/* Bottom micro metrics */}
                <div className="pt-4 border-t border-alabaster/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-alabaster/50 block">نوع الخشب</span>
                    <span className="font-semibold text-bronze">أرو أمريكي مجفف 100%</span>
                  </div>
                  <div className="text-left">
                    <span className="text-alabaster/50 block">مدة التنفيذ</span>
                    <span className="font-semibold text-emerald-100">4 أسابيع تسليم نهائي</span>
                  </div>
                </div>
              </div>

              {/* Floating review card */}
              <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center gap-3 bg-alabaster p-4 rounded-xl shadow-xl border border-charcoal/10">
                <div className="w-10 h-10 rounded-lg bg-emerald/10 text-emerald flex items-center justify-center font-bold">
                  ★ 4.9
                </div>
                <div>
                  <div className="text-xs font-bold text-charcoal">تقييم العملاء</div>
                  <div className="text-[11px] text-charcoal/60">+1,500 مشروع سكني وتجاري</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
