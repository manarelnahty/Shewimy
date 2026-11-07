import React from "react";

export function TrustBar() {
  const cards = [
    {
      icon: "verified_user",
      title: "ضمان 15 سنة",
      desc: "ضمان حقيقي شامل الخامات والإكسسوارات والمفصلات دون أي شروط خفية.",
    },
    {
      icon: "precision_manufacturing",
      title: "مصانعنا الخاصة - أول يد",
      desc: "إنتاج مباشر بدون وسطاء بأفضل سعر تصنيع وجودة تفصيلية مضمونة ومطابقة للمواصفات.",
    },
    {
      icon: "water_drop",
      title: "ماكينات إيطالي ولزق ألماني",
      desc: "تقنيات PUR الألمانية المقاومة للمياه والحرارة بالكامل لحماية حواف الخشب لسنوات.",
    },
    {
      icon: "view_in_ar",
      title: "تصميم هندسي 3D",
      desc: "معاينة واقعية لمطبخك وتوزيع مثلث الحركة الذكي قبل بدء خط التصنيع الفعلي.",
    },
  ];

  return (
    <section className="w-full bg-surface-container-low py-12">
      <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
            >
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary mb-4">
                <span className="material-symbols-outlined text-[26px]">{card.icon}</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-2 font-bold font-readex">
                  {card.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
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
