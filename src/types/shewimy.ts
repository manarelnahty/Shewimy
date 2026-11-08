import { Timestamp } from "firebase/firestore";

/**
 * ============================================================================
 * Official Technical Specification | Firebase Firestore & Next.js 14+
 * Data Requirements Document (DRD) - Al Shewimy Kitchens & Decor
 * ============================================================================
 */

// Section 2: Taxonomy & Main Sections
export type MainSection =
  | "kitchens"
  | "dressing_rooms"
  | "furniture"
  | "decor"
  | "windows";

export const MAIN_SECTIONS_INFO: Record<
  MainSection,
  {
    key: MainSection;
    labelAr: string;
    sharePercent: string;
    subCategories: string[];
    materials: string[];
    features: string[];
  }
> = {
  kitchens: {
    key: "kitchens",
    labelAr: "المطابخ الحديثة والميكانزم",
    sharePercent: "60%",
    subCategories: [
      "بولاك مودرن",
      "نيو كلاسيك خشب أرو",
      "عصري HPL",
      "ألمنيوم حديث / كلادينج",
      "مطابخ آيلاند (Island)",
    ],
    materials: [
      "شاسيه كونتر أوروبي",
      "لزق ألماني PUR مقاوم للمياه والحرارة",
      "رخام كلكتا",
      "بولي لاك",
      "المينيت",
    ],
    features: [
      "ميكانزم إيطالي",
      "مفصلات ومجاري هيدروليك بلوم",
      "سلال تخزين ذكية",
      "إضاءة ليد مخفية",
    ],
  },
  dressing_rooms: {
    key: "dressing_rooms",
    labelAr: "الدريسينج ووحدات التخزين",
    sharePercent: "15%",
    subCategories: [
      "غرف ملابس متكاملة (Walk-in)",
      "دواليب زجاج بروفايل إيطالي",
      "وحدات تخزين مدمجة للمساحات المحدودة",
    ],
    materials: [
      "خشب إم دي إف مستورد عالي الكثافة",
      "قشرة أرو طبيعي",
      "زجاج فاميه سيكوريت عاكس",
      "ألمنيوم أسود",
    ],
    features: [
      "سنسور إضاءة أوتوماتيكي عند الفتح",
      "رفوف ساعات وإكسسوارات مبطنة مخمل",
      "علاقات هيدروليك",
    ],
  },
  furniture: {
    key: "furniture",
    labelAr: "الأثاث المنزلي الراقي",
    sharePercent: "10%",
    subCategories: [
      "غرف نوم رئيسية",
      "غرف سفرة مودرن",
      "طاولات طعام خشب طبيعي",
      "صالونات وأنتريهات نيو كلاسيك",
    ],
    materials: [
      "خشب زان أحمر روماني مجفف",
      "أقمشة مستوردة معالجة",
      "دهانات أستر وبولي يوريثان إيطالية بمصانعنا",
    ],
    features: [
      "تنجيد إسفنج كثافة 36 سوبر سوفت",
      "أرجل ستانلس تيتانيوم مقاوم للخدش",
      "حفر ليزر دقيق",
    ],
  },
  decor: {
    key: "decor",
    labelAr: "الديكورات وتجاليد الحوائط",
    sharePercent: "10%",
    subCategories: [
      "بانوهات بديل خشب ورخام",
      "وحدات تلفزيون جدارية (TV Units)",
      "بارتشن خشب فواصل صالات",
    ],
    materials: [
      "ألواح خشبية مفرزة CNC",
      "دهانات دوكو فرن بمصنع التلوين الخاص",
      "تجاليد جدارية معالجة",
    ],
    features: [
      "إضاءة ليد بروفايل مدمجة",
      "فتحات تمرير أسلاك شاشات مخفية",
      "أرفف طائرة غير مرئية التثبيت",
    ],
  },
  windows: {
    key: "windows",
    labelAr: "الشبابيك والقطاعات",
    sharePercent: "5%",
    subCategories: [
      "شبابيك بي في سي (UPVC)",
      "قطاعات ألمنيوم عازل",
      "شبابيك خشب شتر مدمج",
    ],
    materials: [
      "قطاعات عازلة للصوت والحرارة",
      "زجاج دبل معالج",
      "إكسسوارات غلق محكمة",
    ],
    features: [
      "مقاومة للأتربة والرطوبة",
      "فتح قلاب وجرار مزدوج",
      "سلك ناموسية مدمج فايبر جلاس",
    ],
  },
};

// Section 4: Branches Identifiers
export type BranchId = "mansoura" | "mahalla" | "samanoud";

// Section 3: Collection `items`
export interface ShewimyProduct {
  id: string;
  title: string;
  slug: string;
  mainSection: MainSection;
  subCategory: string;
  materials: string[];
  coverImage: string;
  galleryImages: string[];
  warrantyYears: number; // default: 15
  isFeatured: boolean;
  status: "published" | "draft" | "archived";
  pricingMode: "whatsapp_quote" | "per_meter" | "fixed_price";
  basePrice?: number | null;
  createdAt: Timestamp;
}

// Section 4: Collection `branches`
export interface ShowroomBranch {
  id: BranchId;
  name: string;
  address: string;
  phones: string[];
  whatsappNumber: string;
  googleMapsUrl: string;
  workingHours: string;
}

// Section 6: Collection `inspection_requests`
export interface InspectionRequest {
  id?: string;
  clientName: string;
  phoneNumber: string;
  selectedBranch: BranchId;
  requestedService: "kitchen_3d" | "dressing_inspection" | "full_home_decor";
  customerNotes?: string;
  status: "new" | "contacted" | "visit_scheduled" | "deal_closed";
  createdAt: any;
}

// Collection `site_settings` - Dynamic Site Content
export interface SiteSettings {
  id?: string;
  companyName: string;
  phonePrimary: string;
  emailPrimary: string;
  defaultWarrantyYears: number;
  heroHeadline: string;
  heroHighlight: string;
  heroSubheadline: string;
  heroExperienceYears: number;
  trustBarItems: {
    title: string;
    desc: string;
  }[];
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyName: "الشويمي للمطابخ والديكورات الحديثة",
  phonePrimary: "01005557109",
  emailPrimary: "info@shewimy.com",
  defaultWarrantyYears: 15,
  heroHeadline: "فخامة معمارية تُصنع بحرفية",
  heroHighlight: "إتقان هندسي وضمان ١٥ سنة حقيقي",
  heroSubheadline: "نحوّل المساحات إلى لوحات فنية حية عبر خامات أوروبية معتمدة 100%، وتقنيات PUR الألمانية المقاومة للمياه والحرارة، وتصميمات 3D تفاعلية قبل خط الإنتاج.",
  heroExperienceYears: 24,
  trustBarItems: [
    {
      title: "ضمان 15 سنة",
      desc: "ضمان حقيقي شامل الخامات والإكسسوارات والمفصلات دون أي شروط خفية.",
    },
    {
      title: "مصانعنا الخاصة - أول يد",
      desc: "إنتاج مباشر بدون وسطاء بأفضل سعر تصنيع وجودة تفصيلية مضمونة ومطابقة للمواصفات.",
    },
    {
      title: "ماكينات إيطالي ولزق ألماني",
      desc: "تقنيات PUR الألمانية المقاومة للمياه والحرارة بالكامل لحماية حواف الخشب لسنوات.",
    },
    {
      title: "تصميم هندسي 3D",
      desc: "معاينة واقعية لمطبخك وتوزيع مثلث الحركة الذكي قبل بدء خط التصنيع الفعلي.",
    },
  ],
  socialLinks: {
    facebook: "https://facebook.com/shewimy",
    instagram: "https://instagram.com/shewimy",
  },
};

