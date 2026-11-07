import React from "react";
import { ShieldCheck, Cpu, Droplets, Box } from "lucide-react";

export function TrustBar() {
  const cards = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-secondary" />,
      title: "ضمان 15 سنة",
      desc: "ضمان حقيقي شامل الخامات والإكسسوارات والمفصلات دون أي شروط خفية.",
    },
    {
      icon: <Cpu className="w-5 h-5 text-secondary" />,
      title: "مصانعنا الخاصة - أول يد",
      desc: "إنتاج مباشر بدون وسطاء بأفضل سعر تصنيع وجودة تفصيلية مضمونة ومطابقة للمواصفات.",
    },
    {
      icon: <Droplets className="w-5 h-5 text-secondary" />,
      title: "ماكينات إيطالي ولزق ألماني",
      desc: "تقنيات PUR الألمانية المقاومة للمياه والحرارة بالكامل لحماية حواف الخشب لسنوات.",
    },
    {
      icon: <Box className="w-5 h-5 text-secondary" />,
      title: "تصميم هندسي 3D",
      desc: "معاينة واقعية لمطبخك وتوزيع مثلث الحركة الذكي قبل بدء خط التصنيع الفعلي.",
    },
  ];

  return (
    <section className="w-full bg-surface-container-low py-10 sm:py-12">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between border border-outline-variant/10"
            >
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary mb-3.5">
                {card.icon}
              </div>
              <div>
                <h3 className="text-base sm:text-lg text-primary mb-1.5 font-bold font-readex">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-on-surface-variant leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
