import React from "react";
import { Container } from "@/components/common/Container";
import { Trophy, Clock, ShieldCheck, Factory } from "lucide-react";

export function TrustBar() {
  const stats = [
    {
      icon: <Clock className="w-6 h-6 text-bronze" />,
      value: "+30",
      label: "عاماً من الريادة",
      description: "خبرة متوارثة في صياغة الأخشاب الراقية",
    },
    {
      icon: <Trophy className="w-6 h-6 text-bronze" />,
      value: "+1,500",
      label: "مشروع منجز",
      description: "فيلات، قصور ومقرات شركات كبرى",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-bronze" />,
      value: "10 سنوات",
      label: "ضمان حقيقي",
      description: "على جودة وثبات الهياكل الخشبية",
    },
    {
      icon: <Factory className="w-6 h-6 text-bronze" />,
      value: "10,000 م²",
      label: "مجمع التصنيع",
      description: "أحدث خطوط الإنتاج والدهانات المعتمدة",
    },
  ];

  return (
    <section id="trust" className="py-14 bg-charcoal text-alabaster border-y border-charcoal/20">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-white/5 transition-colors duration-200"
            >
              <div className="p-3 rounded-xl bg-charcoal-700/80 mb-3 border border-alabaster/10">
                {stat.icon}
              </div>
              <span className="text-3xl sm:text-4xl font-extrabold text-alabaster font-readex tracking-tight">
                {stat.value}
              </span>
              <span className="text-sm sm:text-base font-semibold text-bronze mt-1">
                {stat.label}
              </span>
              <p className="text-xs text-alabaster/60 mt-1 max-w-[180px]">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
