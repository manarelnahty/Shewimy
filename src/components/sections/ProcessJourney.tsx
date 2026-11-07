import React from "react";

export function ProcessJourney() {
  const steps = [
    {
      step: "01",
      title: "تصميم هندسي 3D",
      desc: "رفع المقاسات بدقة ليزر وإعداد مخطط ثلاثي الأبعاد واقعي وتوزيع عملي لمثلث الحركة يناسب مساحتك بدقة.",
    },
    {
      step: "02",
      title: "تصنيع بماكينات إيطالية",
      desc: "تقطيع ولصق بحواف PUR الألمانية بمصانعنا، ودهانات متطورة مقاومة للخدش والرطوبة وحرارة الاستخدام اليومي.",
    },
    {
      step: "03",
      title: "التوريد والتركيب المحترف",
      desc: "فريق فني متخصص لتثبيت المطبخ بدقة متناهية، ومراجعة موازين الليزر ونظافة تامة للمكان عقب الانتهاء.",
    },
    {
      step: "04",
      title: "شهادة ضمان 15 سنة",
      desc: "تسليم وثيقة الضمان المعتمدة مع خدمة ما بعد البيع ومتابعة صيانة دورية مجانية للمفصلات والأسطح.",
    },
  ];

  return (
    <section
      className="w-full bg-surface-container-low py-20 lg:py-28 relative overflow-hidden"
      id="journey-section"
    >
      <div className="max-w-[1380px] mx-auto px-6 lg:px-12 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-label-md text-label-md text-secondary font-semibold uppercase tracking-wider">
            منهجية العمل المتكاملة
          </span>
          <h2 className="font-headline-lg text-headline-lg text-primary font-bold font-readex">
            رحلة تصنيع مطبخك من الفكرة إلى الواقع
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            نتبع بروتوكولاً هندسياً صارماً في كافة المراحل لضمان دقة التنفيذ وخلو المنتج النهائي من أي عيوب صناعية.
          </p>
        </div>

        {/* Timeline Steps Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Connecting Track Line (Desktop Only) */}
          <div
            className="hidden lg:block absolute top-12 inset-x-16 h-[2px] bg-secondary-container/40 z-0 pointer-events-none"
            aria-hidden="true"
          />

          {steps.map((item) => (
            <div
              key={item.step}
              className="relative z-10 bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-outline-variant/10"
            >
              <div className="w-14 h-14 rounded-full bg-primary text-secondary-fixed flex items-center justify-center font-display text-headline-sm font-bold mb-6 shadow-sm font-readex">
                {item.step}
              </div>
              <h3 className="font-title text-title text-primary mb-2 font-bold font-readex">
                {item.title}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
