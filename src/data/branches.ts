import { ShowroomBranch, BranchId } from "@/types/shewimy";
import branchesJson from "./branches.json";

export interface BranchExtended extends ShowroomBranch {
  badge: string;
  regionServed: string;
}

const DEFAULT_MANSOURA: BranchExtended = {
  id: "mansoura",
  name: "فرع المنصورة (صالة عرض رئيسية)",
  address: "شارع أحمد ماهر - عمارة بنده 2 - بجوار المقاولون العرب",
  phones: ["01005557109", "01012623138"],
  whatsappNumber: "201005557109",
  googleMapsUrl: "https://maps.google.com/?q=Mansoura,Ahmed+Maher,Egypt",
  workingHours: "يوميًا 11 صباحًا - 11 مساءً",
  badge: "صالة عرض رئيسية",
  regionServed: "توجيه عملاء مدينة المنصورة وضواحيها",
};

const DEFAULT_MAHALLA: BranchExtended = {
  id: "mahalla",
  name: "فرع المحلة الكبرى (صالة عرض معتمدة)",
  address: "شارع سعد محمد سعد - أمام بيم ماركت",
  phones: ["01287153339", "01098199288"],
  whatsappNumber: "201287153339",
  googleMapsUrl: "https://maps.google.com/?q=El+Mahalla+El+Kubra,Saad+Mohamed+Saad,Egypt",
  workingHours: "يوميًا 11 صباحًا - 11 مساءً",
  badge: "صالة عرض معتمدة",
  regionServed: "توجيه عملاء المحلة وزفتى وكفر الشيخ",
};

const DEFAULT_SAMANOUD: BranchExtended = {
  id: "samanoud",
  name: "فرع سمنود والمجمع الصناعي (صالة عرض ومصانع الشركة)",
  address: "أمام البوسطة الجديدة بجوار عيون الكوبري",
  phones: ["01287153339", "01098199288"],
  whatsappNumber: "201287153339",
  googleMapsUrl: "https://maps.google.com/?q=Samanoud,Industrial+Complex,Egypt",
  workingHours: "يوميًا 10 صباحًا - 10 مساءً",
  badge: "صالة عرض ومصانع الشركة",
  regionServed: "زيارات المصنع، الاستشارات الهندسية، وطلبات المشاريع الكبرى",
};

export const BRANCHES_LIST: BranchExtended[] =
  Array.isArray(branchesJson) && branchesJson.length > 0
    ? (branchesJson as BranchExtended[])
    : [DEFAULT_MANSOURA, DEFAULT_MAHALLA, DEFAULT_SAMANOUD];

export const SHOWROOM_BRANCHES: Record<BranchId, BranchExtended> = {
  mansoura: (BRANCHES_LIST.find((b) => b.id === "mansoura") as BranchExtended) || DEFAULT_MANSOURA,
  mahalla: (BRANCHES_LIST.find((b) => b.id === "mahalla") as BranchExtended) || DEFAULT_MAHALLA,
  samanoud: (BRANCHES_LIST.find((b) => b.id === "samanoud") as BranchExtended) || DEFAULT_SAMANOUD,
};
