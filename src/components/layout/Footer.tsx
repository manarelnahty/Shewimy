import React from "react";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { Compass, MapPin, Phone, Mail, Clock, ShieldCheck } from "lucide-react";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-charcoal text-alabaster border-t border-charcoal/20 pt-16 pb-10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-alabaster/10">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-bronze text-white flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold font-readex text-alabaster">
                  الشويحي
                </span>
                <span className="text-xs text-bronze font-medium">
                  للأثاث والأعمال الخشبية المعمارية
                </span>
              </div>
            </div>
            <p className="text-sm text-alabaster/70 leading-relaxed">
              رواد صناعة الأثاث الفاخر والأعمال الخشبية المعمارية في مصر. نجمع بين عراقة الحرفية المصرية ودقة التصميم الحديث لابتكار مساحات تعيش لأجيال.
            </p>
            <div className="flex items-center gap-2 text-xs text-bronze pt-2">
              <ShieldCheck className="w-4 h-4 text-bronze shrink-0" />
              <span>معتمدون في تنفيذ القصور، الفيلات والمشاريع التجارية</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-base font-semibold text-alabaster font-readex mb-4 border-r-2 border-bronze pr-2">
              روابط سريعة
            </h3>
            <ul className="space-y-2.5 text-sm text-alabaster/70">
              <li>
                <a href="#hero" className="hover:text-bronze transition-colors">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-bronze transition-colors">
                  مجموعات الأثاث والمشاريع
                </a>
              </li>
              <li>
                <a href="#branches" className="hover:text-bronze transition-colors">
                  فروعنا ومعارضنا
                </a>
              </li>
              <li>
                <a href="#trust" className="hover:text-bronze transition-colors">
                  لماذا تختار الشويحي
                </a>
              </li>
              <li>
                <Link href="#" className="hover:text-bronze transition-colors">
                  كتالوج الأعمال الحصرية (PDF)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Branches Quick Info */}
          <div>
            <h3 className="text-base font-semibold text-alabaster font-readex mb-4 border-r-2 border-bronze pr-2">
              المعارض والمصنع
            </h3>
            <ul className="space-y-3 text-sm text-alabaster/70">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-bronze shrink-0 mt-1" />
                <span>المعرض الرئيسي: القاهرة - التجمع الخامس، شارع التسعين الشمالي</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-bronze shrink-0 mt-1" />
                <span>معرض الجيزة: المهندسين، شارع لبنان</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-bronze shrink-0 mt-1" />
                <span>المجمع الصناعي: المنطقة الصناعية - مدينة العبور</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Support */}
          <div>
            <h3 className="text-base font-semibold text-alabaster font-readex mb-4 border-r-2 border-bronze pr-2">
              خدمة العملاء والاستشارات
            </h3>
            <ul className="space-y-3 text-sm text-alabaster/70">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-bronze shrink-0" />
                <span dir="ltr">+20 (2) 2345-6789</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-bronze shrink-0" />
                <span>info@shewimy.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-bronze shrink-0" />
                <span>يومياً: 10:00 صباحاً – 10:00 مساءً</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-alabaster/50 gap-4">
          <p>© {currentYear} شركة الشويحي للأثاث والتصميم الداخلي. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-bronze transition-colors">
              سياسة الخصوصية
            </Link>
            <Link href="#" className="hover:text-bronze transition-colors">
              الشروط والأحكام
            </Link>
            <Link href="#" className="hover:text-bronze transition-colors">
              شهادات الجودة والضمان
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
