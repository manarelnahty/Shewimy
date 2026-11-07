import React from "react";
import { Store, Cpu, MapPin, Phone, Clock, Calendar, Map } from "lucide-react";

export function Branches() {
  const branches = [
    {
      badge: "صالة عرض رئيسية",
      icon: <Store className="w-5 h-5 text-secondary" />,
      title: "فرع المنصورة",
      address: "شارع المشاية السفلية، أمام حديقة شجر الدر",
      phone: "+20 100 234 5678",
      phoneTel: "+201002345678",
      hours: "يومياً من 11 صباحاً حتى 11 مساءً",
      mapUrl: "https://maps.google.com/?q=Mansoura,Egypt",
    },
    {
      badge: "صالة عرض متكاملة",
      icon: <Store className="w-5 h-5 text-secondary" />,
      title: "فرع المحلة الكبرى",
      address: "شارع البحر الرئيسي، برج النخبة",
      phone: "+20 101 876 5432",
      phoneTel: "+201018765432",
      hours: "يومياً من 11 صباحاً حتى 11 مساءً",
      mapUrl: "https://maps.google.com/?q=El+Mahalla+El+Kubra,Egypt",
    },
    {
      badge: "المصنع الرئيسي والمعرض",
      icon: <Cpu className="w-5 h-5 text-secondary" />,
      title: "فرع سمنود والمجمع الصناعي",
      address: "طريق سمنود الرئيسي، بجوار المجمع الصناعي",
      phone: "+20 102 345 6789",
      phoneTel: "+201023456789",
      hours: "يومياً من 10 صباحاً حتى 10 مساءً",
      mapUrl: "https://maps.google.com/?q=Samanoud,Egypt",
    },
  ];

  return (
    <section className="w-full bg-surface py-16 lg:py-24" id="branches-section">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-2">
          <div>
            <span className="text-xs sm:text-sm text-secondary font-semibold uppercase tracking-wider block mb-1.5">
              شبكة معارضنا
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary font-readex">
              زوروا معارضنا
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 max-w-xl leading-relaxed">
              يسعدنا استقبالكم في أقرب فرع لمعاينة الخامات وتصاميم المطابخ على الطبيعة مع مهندسينا المختصين.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-secondary text-xs sm:text-sm font-semibold">
            <Calendar className="w-4 h-4" />
            <span>مفتوح طوال أيام الأسبوع</span>
          </div>
        </div>

        {/* 3 Branch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {branches.map((b, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5 border border-outline-variant/10"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] bg-secondary-container/30 text-on-secondary-container px-2.5 py-1 rounded font-semibold">
                    {b.badge}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
                    {b.icon}
                  </div>
                </div>
                <h3 className="text-base sm:text-lg text-primary font-bold font-readex">
                  {b.title}
                </h3>
                <div className="space-y-2 pt-1 text-xs text-on-surface-variant">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                    <span>{b.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <span className="font-semibold text-primary" dir="ltr">
                      {b.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <span>{b.hours}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-3 border-t border-surface-container">
                <a
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs font-semibold py-2 px-3 rounded transition-colors duration-200"
                  href={`tel:${b.phoneTel}`}
                >
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>اتصل الآن</span>
                </a>
                <a
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold py-2 px-3 rounded transition-colors duration-200"
                  href={b.mapUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Map className="w-3.5 h-3.5 shrink-0" />
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
