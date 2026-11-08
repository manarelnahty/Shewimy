import { ShowroomBranch, BranchId } from "@/types/shewimy";

export interface BranchExtended extends ShowroomBranch {
  badge: string;
  regionServed: string;
}

export const SHOWROOM_BRANCHES: Record<BranchId, BranchExtended> = {
  mansoura: {
    id: "mansoura",
    name: "فرع المنصورة (صالة عرض رئيسية)",
    address: "شارع أحمد ماهر - عمارة بنده 2 - بجوار المقاولون العرب",
    phones: ["01005557109", "01012623138"],
    whatsappNumber: "201005557109",
    googleMapsUrl: "https://maps.google.com/?q=Mansoura,Ahmed+Maher,Egypt",
    workingHours: "يوميًا 11 صباحًا - 11 مساءً",
    badge: "صالة عرض رئيسية",
    regionServed: "توجيه عملاء مدينة المنصورة وضواحيها",
  },
  mahalla: {
    id: "mahalla",
    name: "فرع المحلة الكبرى (صالة عرض معتمدة)",
    address: "شارع سعد محمد سعد - أمام بيم ماركت",
    phones: ["01287153339", "01098199288"],
    whatsappNumber: "201287153339",
    googleMapsUrl: "https://maps.google.com/?q=El+Mahalla+El+Kubra,Saad+Mohamed+Saad,Egypt",
    workingHours: "يوميًا 11 صباحًا - 11 مساءً",
    badge: "صالة عرض معتمدة",
    regionServed: "توجيه عملاء المحلة وزفتى وكفر الشيخ",
  },
  samanoud: {
    id: "samanoud",
    name: "فرع سمنود والمجمع الصناعي (صالة عرض ومصانع الشركة)",
    address: "أمام البوسطة الجديدة بجوار عيون الكوبري",
    phones: ["01287153339", "01098199288"],
    whatsappNumber: "201287153339",
    googleMapsUrl: "https://maps.google.com/?q=Samanoud,Industrial+Complex,Egypt",
    workingHours: "يوميًا 10 صباحًا - 10 مساءً",
    badge: "صالة عرض ومصانع الشركة",
    regionServed: "زيارات المصنع، الاستشارات الهندسية، وطلبات المشاريع الكبرى",
  },
};

export const BRANCHES_LIST: BranchExtended[] = [
  SHOWROOM_BRANCHES.mansoura,
  SHOWROOM_BRANCHES.mahalla,
  SHOWROOM_BRANCHES.samanoud,
];
