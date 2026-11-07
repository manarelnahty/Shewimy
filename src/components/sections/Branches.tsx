import React from "react";
import { Store, Cpu, MapPin, Phone, Clock, Calendar, Map, MessageCircle } from "lucide-react";

export function Branches() {
  const branches = [
    {
      badge: "صالة عرض رئيسية",
      icon: <Store className="w-5 h-5 text-secondary" />,
      title: "فرع المنصورة",
      address: "شارع المشاية السفلية، أمام حديقة شجر الدر",
      phones: [
        { display: "01005557109", tel: "+201005557109", wa: "201005557109" },
        { display: "01012623138", tel: "+201012623138", wa: "201012623138" },
      ],
      hours: "يومياً من 11 صباحاً حتى 11 مساءً",
      mapUrl: "https://maps.google.com/?q=Mansoura,Egypt",
    },
    {
      badge: "المصنع والمعرض المتكامل",
      icon: <Cpu className="w-5 h-5 text-secondary" />,
      title: "فرع سمنود والمحلة",
      address: "طريق سمنود الرئيسي، بجوار المجمع الصناعي - يخدم المحلة وسمنود",
      phones: [
        { display: "01287153339", tel: "+201287153339", wa: "201287153339" },
        { display: "01098199288", tel: "+201098199288", wa: "201098199288" },
      ],
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
              شبكة معارضنا وفروعنا
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary font-readex">
              زوروا معارض الشويمي
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

        {/* 2 Focused Branch Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {branches.map((b, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest p-6 sm:p-7 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 border border-outline-variant/15"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-secondary-container/30 text-on-secondary-container px-3 py-1 rounded-full font-semibold">
                    {b.badge}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center">
                    {b.icon}
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl text-primary font-bold font-readex">
                  {b.title}
                </h3>

                <div className="space-y-3 pt-1 text-xs sm:text-sm text-on-surface-variant">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span>{b.address}</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <div className="space-y-1" dir="ltr">
                      {b.phones.map((p, pIdx) => (
                        <div key={pIdx} className="flex items-center gap-3">
                          <a
                            href={`tel:${p.tel}`}
                            className="font-bold text-primary hover:text-secondary transition-colors"
                          >
                            📞 {p.display}
                          </a>
                          <a
                            href={`https://wa.me/${p.wa}?text=مرحباً%20أود%20الاستفسار%20عن%20مطابخ%20الشويمي`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-[#128C7E] hover:underline flex items-center gap-1 font-semibold"
                          >
                            <MessageCircle className="w-3 h-3" />
                            واتساب
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-secondary shrink-0" />
                    <span>{b.hours}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-surface-container">
                <a
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200"
                  href={`tel:${b.phones[0].tel}`}
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>اتصال بالفرع</span>
                </a>

                <a
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366] text-[#128C7E] hover:text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200"
                  href={`https://wa.me/${b.phones[0].wa}?text=مرحباً%20أود%20الاستفسار%20عن%20مطابخ%20الشويمي`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>واتساب الفرع</span>
                </a>

                <a
                  className="inline-flex items-center justify-center p-2.5 bg-surface-container hover:bg-surface-container-high text-primary text-xs rounded-xl transition-colors duration-200"
                  href={b.mapUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                  aria-label="الاتجاهات على الخريطة"
                >
                  <Map className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
