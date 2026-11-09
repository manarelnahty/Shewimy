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
  requestedService: "kitchen_3d" | "dressing_inspection" | "full_home_decor" | "other" | string;
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

  // 1. Hero Section & Architectural Decoration
  heroHeadline: string;
  heroHighlight?: string;
  heroSubheadline: string;
  heroBadgeText: string;
  heroExperienceYears: number;
  heroBgImage: string;
  heroShowcaseImage: string;
  heroShowcaseTag: string;
  heroShowcaseTitle: string;
  heroShowcaseFeature: string;
  heroShowcaseWarranty: string;
  heroCtaPrimaryText: string;
  heroCtaSecondaryText: string;
  heroStats: {
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
  };

  // 2. Trust Bar
  trustBarItems: {
    title: string;
    desc: string;
  }[];

  // 3. Portfolio Section
  portfolioBadge: string;
  portfolioHeadline: string;
  portfolioSubheadline: string;
  portfolioCtaText: string;

  // 4. Process Journey
  processBadge: string;
  processHeadline: string;
  processSubheadline: string;
  processSteps: {
    step: string;
    title: string;
    desc: string;
  }[];

  // 5. Consultation & Booking CTA
  ctaBadge: string;
  ctaHeadline: string;
  ctaSubheadline: string;
  ctaPrimaryBtnText: string;
  ctaWhatsappBtnText: string;
  ctaBgImage?: string;

  // 6. Social Links
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };

  // 7. Security & Super Admin Authentication (DRD Section 8)
  adminEmail?: string;
}

export interface AdminAccount {
  uid: string;
  email: string;
  displayName: string;
  role: "super_admin" | "admin" | "editor";
  updatedAt: string;
  passwordUpdatedAt?: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyName: "الشويمي للمطابخ والديكورات الحديثة",
  phonePrimary: "01005557109",
  emailPrimary: "info@shewimy.com",
  defaultWarrantyYears: 15,

  // 1. Hero Section & Architectural Decoration
  heroHeadline: "فخامة معمارية تُصنع بحرفية استثنائية لمنزلك",
  heroHighlight: "إتقان هندسي وضمان ١٥ سنة حقيقي",
  heroSubheadline: "نحوّل المساحات إلى لوحات فنية حية عبر خامات أوروبية معتمدة 100%، وتقنيات PUR الألمانية المقاومة للمياه والحرارة، وتصميمات 3D تفاعلية قبل خط الإنتاج.",
  heroBadgeText: "خبرة 24 عاماً • ضمان 15 سنة حقيقي",
  heroExperienceYears: 24,
  heroBgImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
  heroShowcaseImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85",
  heroShowcaseTag: "تصميم حصري 2026",
  heroShowcaseTitle: "طراز بولاك ألترا مودرن مع ماكينات تشطيب PUR",
  heroShowcaseFeature: "ميكانزم بلوم نمساوي أصلي",
  heroShowcaseWarranty: "ضمان 15 سنة",
  heroCtaPrimaryText: "صمم مطبخك الآن",
  heroCtaSecondaryText: "تصفح سابقة أعمالنا",
  heroStats: {
    stat1Value: "+3,500",
    stat1Label: "مطبخ منفّذ",
    stat2Value: "3 فروع",
    stat2Label: "بمنطقة الدلتا",
    stat3Value: "100%",
    stat3Label: "خامات أوروبية",
  },

  // 2. Trust Bar
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

  // 3. Portfolio Section
  portfolioBadge: "معرض الإبداعات المعمارية",
  portfolioHeadline: "أحدث إبداعاتنا المنفذة بمصانع الشويمي",
  portfolioSubheadline: "استكشف تشكيلات المطابخ والدريسينج روم والأثاث الراقي التي نفذناها بدقة وإتقان في فلل وقصور عملاء الشويمي.",
  portfolioCtaText: "استعراض كتالوج المنتجات والأسعار كاملة",

  // 4. Process Journey
  processBadge: "منهجية العمل المتكاملة",
  processHeadline: "رحلة تصنيع مطبخك من الفكرة إلى الواقع",
  processSubheadline: "نتبع بروتوكولاً هندسياً صارماً في كافة المراحل لضمان دقة التنفيذ وخلو المنتج النهائي من أي عيوب صناعية.",
  processSteps: [
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
  ],

  // 5. Consultation & Booking CTA
  ctaBadge: "استشارة معمارية مجانية",
  ctaHeadline: "جاهز لتصميم مطبخ أحلامك؟",
  ctaSubheadline: "احصل على استشارة هندسية ومعاينة ثلاثية الأبعاد 3D مجاناً لمساحتك بمساعدة نخبة مهندسي التصميم المعماري في مطابخ الشويمي.",
  ctaPrimaryBtnText: "احجز معاينتك المجانية الآن",
  ctaWhatsappBtnText: "محادثة واتساب مباشرة",
  ctaBgImage: "",

  // 6. Social Links
  socialLinks: {
    facebook: "https://facebook.com/shewimy",
    instagram: "https://instagram.com/shewimy",
  },

  // 7. Security & Admin Authentication
  adminEmail: "admin@shewimy.com",
};
