import React from "react";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/common/Button";
import type { Branch } from "@/types/schema";
import { MapPin, Phone, Clock, Navigation, Building2 } from "lucide-react";

const initialBranches: Branch[] = [
  {
    id: "branch-new-cairo",
    name: "New Cairo Flagship Showroom",
    nameAr: "المعرض الرئيسي - التجمع الخامس",
    type: "flagship_showroom",
    city: "Cairo",
    cityAr: "القاهرة الجديدة",
    address: "North 90th Street, Sector 1, New Cairo",
    addressAr: "شارع التسعين الشمالي، القطاع التجاري الأول، بجوار داون تاون مول",
    phones: ["+20 10 1234 5671", "+20 2 2811 0000"],
    workingHours: {
      days: "Saturday - Thursday",
      daysAr: "السبت – الخميس",
      hours: "10:00 AM - 10:00 PM",
      hoursAr: "10:00 ص – 10:00 م (الجمعة: 2:00 م – 10:00 م)",
    },
    googleMapsUrl: "https://maps.google.com",
    isActive: true,
    isPrimary: true,
  },
  {
    id: "branch-mohandessin",
    name: "Mohandessin Design Studio",
    nameAr: "استوديو التصميم - المهندسين",
    type: "design_studio",
    city: "Giza",
    cityAr: "الجيزة",
    address: "Lebanon Street, Mohandessin",
    addressAr: "شارع لبنان الرئيسي، متفرع من ميدان لبنان، المهندسين",
    phones: ["+20 10 1234 5672", "+20 2 3760 0000"],
    workingHours: {
      days: "Saturday - Thursday",
      daysAr: "السبت – الخميس",
      hours: "11:00 AM - 09:00 PM",
      hoursAr: "11:00 ص – 09:00 م",
    },
    googleMapsUrl: "https://maps.google.com",
    isActive: true,
    isPrimary: false,
  },
  {
    id: "branch-factory",
    name: "Obour Industrial Manufacturing Complex",
    nameAr: "المجمع الصناعي ومصنع الأخشاب - العبور",
    type: "factory_workshop",
    city: "Qalyubia",
    cityAr: "مدينة العبور",
    address: "1st Industrial Zone, Block 13000, Obour City",
    addressAr: "المنطقة الصناعية الأولى، قطعة 13000، مدينة العبور",
    phones: ["+20 10 1234 5673", "+20 2 4480 0000"],
    workingHours: {
      days: "Saturday - Thursday",
      daysAr: "السبت – الخميس",
      hours: "08:00 AM - 05:00 PM",
      hoursAr: "08:00 ص – 05:00 م (مخصص للزيارات الهندسية المسبقة)",
    },
    googleMapsUrl: "https://maps.google.com",
    isActive: true,
    isPrimary: false,
  },
];

export function Branches() {
  return (
    <section id="branches" className="py-20 sm:py-28 bg-alabaster-200/50 border-t border-charcoal/10">
      <Container>
        <SectionHeading
          eyebrow="فروعنا وشبكة المعارض"
          title="نرحب بزيارتكم في صالات العرض واستوديوهات التصميم"
          subtitle="تفضل بزيارة أقرب معرض لتلمس خامات الأخشاب الطبيعية، وتطلع على تشكيلات الأقمشة والدهانات برفقة مستشارينا المعماريين."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {initialBranches.map((branch) => (
            <div
              key={branch.id}
              className={`rounded-2xl p-6 sm:p-8 bg-white border transition-all duration-300 flex flex-col justify-between ${
                branch.isPrimary
                  ? "border-bronze shadow-lg relative ring-1 ring-bronze/30"
                  : "border-charcoal/10 hover:border-bronze/40 hover:shadow-md"
              }`}
            >
              <div>
                {branch.isPrimary && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-bronze/10 text-bronze border border-bronze/20 mb-4">
                    المقر الرئيسي وصالة العرض المركزية
                  </span>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-charcoal text-alabaster">
                    <Building2 className="w-5 h-5 text-bronze" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-charcoal font-readex">
                      {branch.nameAr}
                    </h3>
                    <span className="text-xs text-charcoal/60">{branch.cityAr}</span>
                  </div>
                </div>

                {/* Details list */}
                <div className="space-y-3.5 text-xs sm:text-sm text-charcoal/80 mt-6 pt-6 border-t border-charcoal/10">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-bronze shrink-0 mt-0.5" />
                    <span>{branch.addressAr}</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-bronze shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-charcoal">{branch.workingHours.daysAr}</span>
                      <span className="text-charcoal/60">{branch.workingHours.hoursAr}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-bronze shrink-0 mt-0.5" />
                    <div className="space-y-0.5" dir="ltr">
                      {branch.phones.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${phone.replace(/\s+/g, "")}`}
                          className="block hover:text-bronze transition-colors"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-8 pt-5 border-t border-charcoal/10 flex items-center gap-3">
                <a
                  href={`tel:${branch.phones[0].replace(/\s+/g, "")}`}
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    اتصال بالفرع
                  </Button>
                </a>
                <a
                  href={branch.googleMapsUrl ?? "https://maps.google.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button
                    variant="emerald"
                    size="sm"
                    className="w-full text-xs"
                    icon={<Navigation className="w-3.5 h-3.5" />}
                  >
                    اتجاهات الموقع
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
