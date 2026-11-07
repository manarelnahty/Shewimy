import React from "react";
import {
  Store,
  Factory,
  MapPin,
  Phone,
  Clock,
  Calendar,
  MessageCircle,
  Navigation,
} from "lucide-react";

export function Branches() {
  const branches = [
    {
      badge: "صالة العرض الرئيسية",
      icon: <Store className="w-5 h-5 text-secondary" />,
      title: "فرع المنصورة",
      address: "شارع المشاية السفلية، أمام حديقة شجر الدر - المنصورة",
      phones: [
        { display: "01005557109", tel: "+201005557109", wa: "201005557109" },
        { display: "01012623138", tel: "+201012623138", wa: "201012623138" },
      ],
      hours: "يومياً من 11:00 صباحاً حتى 11:00 مساءً",
      mapUrl: "https://maps.google.com/?q=Mansoura,Egypt",
    },
    {
      badge: "المصنع والمعرض المتكامل",
      icon: <Factory className="w-5 h-5 text-secondary" />,
      title: "فرع سمنود والمحلة الكبرى",
      address: "طريق سمنود الرئيسي، بجوار المجمع الصناعي - يخدم المحلة وسمنود",
      phones: [
        { display: "01287153339", tel: "+201287153339", wa: "201287153339" },
        { display: "01098199288", tel: "+201098199288", wa: "201098199288" },
      ],
      hours: "يومياً من 10:00 صباحاً حتى 10:00 مساءً",
      mapUrl: "https://maps.google.com/?q=Samanoud,Egypt",
    },
  ];

  return (
    <section className="w-full bg-surface py-16 lg:py-24" id="branches-section">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span>شبكة معارض ومصانع الشويمي</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary font-readex">
              زوروا معارضنا وتعرفوا على خاماتنا
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-2 max-w-xl leading-relaxed">
              يسعدنا استقبالكم في أقرب فرع لمعاينة أحدث تصاميم المطابخ والدريسينج روم على الطبيعة، ومناقشة مقايسة مساحتكم مع نخبة من مهندسينا المعماريين.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-secondary text-xs sm:text-sm font-semibold bg-white px-3.5 py-1.5 rounded-xl border border-charcoal/10 shadow-2xs">
            <Calendar className="w-4 h-4 text-secondary" />
            <span>مفتوح طوال أيام الأسبوع</span>
          </div>
        </div>

        {/* 2 Focused Luxury Branch Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {branches.map((b, idx) => (
            <article
              key={idx}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-charcoal/10 hover:border-secondary/30 space-y-6"
            >
              <div className="space-y-5">
                {/* Card Top / Header */}
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    <span>{b.badge}</span>
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shadow-2xs border border-charcoal/5">
                    {b.icon}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl text-primary font-bold font-readex">
                    {b.title}
                  </h3>
                </div>

                {/* Info Blocks: Address & Hours */}
                <div className="space-y-2.5">
                  {/* Address */}
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/70 border border-outline-variant/10">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-secondary shrink-0 shadow-2xs border border-charcoal/5 mt-0.5">
                      <MapPin className="w-4 h-4 text-secondary" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-charcoal/50 block">العنوان</span>
                      <p className="text-xs sm:text-sm text-charcoal font-medium leading-relaxed">
                        {b.address}
                      </p>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low/70 border border-outline-variant/10">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-secondary shrink-0 shadow-2xs border border-charcoal/5">
                      <Clock className="w-4 h-4 text-secondary" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-charcoal/50 block">مواعيد العمل</span>
                      <p className="text-xs sm:text-sm text-charcoal font-medium">
                        {b.hours}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direct Phone Numbers List (Zero Emojis, Pure SVG & Clean Layout) */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold text-charcoal/60 uppercase tracking-wider block">
                    أرقام التواصل المباشرة
                  </span>
                  <div className="space-y-2">
                    {b.phones.map((p, pIdx) => (
                      <div
                        key={pIdx}
                        className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-surface-container-low/50 hover:bg-surface-container-low border border-outline-variant/15 transition-colors gap-3"
                      >
                        {/* Phone number with vector SVG icon */}
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-primary shrink-0 shadow-2xs border border-charcoal/5">
                            <Phone className="w-3.5 h-3.5 text-secondary" />
                          </div>
                          <a
                            href={`tel:${p.tel}`}
                            dir="ltr"
                            className="font-mono text-xs sm:text-sm font-bold text-primary hover:text-secondary transition-colors tracking-wide"
                          >
                            {p.display}
                          </a>
                        </div>

                        {/* Action buttons for this number */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <a
                            href={`tel:${p.tel}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-charcoal/80 hover:text-primary hover:bg-charcoal/5 border border-charcoal/10 text-[11px] font-semibold transition-colors shadow-2xs"
                          >
                            <Phone className="w-3 h-3 text-charcoal/60" />
                            <span>اتصال</span>
                          </a>
                          <a
                            href={`https://wa.me/${p.wa}?text=${encodeURIComponent(
                              `السلام عليكم مطابخ الشويمي، أود الاستفسار عن تصاميم ومقايسات ${b.title}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white transition-colors text-[11px] font-semibold shadow-2xs"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>واتساب</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 border-t border-charcoal/10 mt-2">
                <a
                  className="inline-flex items-center justify-center gap-2 bg-[#1F5E4B] hover:bg-[#164638] text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
                  href={`https://wa.me/${b.phones[0].wa}?text=${encodeURIComponent(
                    `السلام عليكم مطابخ الشويمي، أود حجز موعد زيارة ومعاينة في ${b.title}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 shrink-0 text-white" />
                  <span>واتساب الفرع</span>
                </a>

                <a
                  className="inline-flex items-center justify-center gap-2 bg-surface-container-high/60 hover:bg-surface-container-high text-primary hover:text-secondary text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl border border-charcoal/10 transition-all duration-200"
                  href={b.mapUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Navigation className="w-4 h-4 shrink-0 text-secondary" />
                  <span>الموقع على الخريطة</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
