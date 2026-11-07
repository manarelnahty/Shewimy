import React from "react";

export function Branches() {
  const branches = [
    {
      badge: "صالة عرض رئيسية",
      icon: "storefront",
      title: "فرع المنصورة",
      address: "شارع المشاية السفلية، أمام حديقة شجر الدر",
      phone: "+20 100 234 5678",
      phoneTel: "+201002345678",
      hours: "يومياً من 11 صباحاً حتى 11 مساءً",
      mapUrl: "https://maps.google.com/?q=Mansoura,Egypt",
    },
    {
      badge: "صالة عرض متكاملة",
      icon: "storefront",
      title: "فرع المحلة الكبرى",
      address: "شارع البحر الرئيسي، برج النخبة",
      phone: "+20 101 876 5432",
      phoneTel: "+201018765432",
      hours: "يومياً من 11 صباحاً حتى 11 مساءً",
      mapUrl: "https://maps.google.com/?q=El+Mahalla+El+Kubra,Egypt",
    },
    {
      badge: "المصنع الرئيسي والمعرض",
      icon: "factory",
      title: "فرع سمنود والمجمع الصناعي",
      address: "طريق سمنود الرئيسي، بجوار المجمع الصناعي",
      phone: "+20 102 345 6789",
      phoneTel: "+201023456789",
      hours: "يومياً من 10 صباحاً حتى 10 مساءً",
      mapUrl: "https://maps.google.com/?q=Samanoud,Egypt",
    },
  ];

  return (
    <section className="w-full bg-surface py-20 lg:py-28" id="branches-section">
      <div className="max-w-[1380px] mx-auto px-6 lg:px-12 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
          <div>
            <span className="font-label-md text-label-md text-secondary font-semibold uppercase tracking-wider block mb-2">
              شبكة معارضنا
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary font-bold font-readex">
              زوروا معارضنا
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-xl">
              يسعدنا استقبالكم في أقرب فرع لمعاينة الخامات وتصاميم المطابخ على الطبيعة مع مهندسينا المختصين.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-secondary font-label-lg text-label-lg">
            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
            <span>مفتوح طوال أيام الأسبوع</span>
          </div>
        </div>

        {/* 3 Branch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {branches.map((b, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 border border-outline-variant/10"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm bg-secondary-container/30 text-on-secondary-container px-3 py-1 rounded font-semibold">
                    {b.badge}
                  </span>
                  <span className="material-symbols-outlined text-secondary text-[24px]">
                    {b.icon}
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold font-readex">
                  {b.title}
                </h3>
                <div className="space-y-2.5 pt-2 font-body-sm text-body-sm text-on-surface-variant">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5 shrink-0">
                      location_on
                    </span>
                    <span>{b.address}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">
                      call
                    </span>
                    <span className="font-semibold text-primary" dir="ltr">
                      {b.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">
                      schedule
                    </span>
                    <span>{b.hours}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <a
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white font-label-md text-label-md py-2.5 px-4 rounded transition-colors duration-200"
                  href={`tel:${b.phoneTel}`}
                >
                  <span className="material-symbols-outlined text-[18px]">phone</span>
                  <span>اتصل الآن</span>
                </a>
                <a
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md py-2.5 px-4 rounded transition-colors duration-200"
                  href={b.mapUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="material-symbols-outlined text-[18px]">map</span>
                  <span>الاتجاهات</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
