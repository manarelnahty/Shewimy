import { MainSection, BranchId } from "@/types/shewimy";
import { SHOWROOM_BRANCHES, BranchExtended } from "./branches";

export type BranchKey = "mansoura" | "mahalla" | "samanoud" | "samanoud_mahalla";

export interface Product {
  id: string;
  code: string;
  name: string;
  title?: string;
  slug: string;
  subtitle: string;
  category: "kitchens" | "dressing" | "furniture" | "cladding" | "dressing_rooms" | "decor" | "windows";
  mainSection: MainSection;
  categoryLabel: string;
  subCategory: string;
  style: "modern" | "classic" | "neoclassic" | "ultramodern";
  styleLabel: string;
  material: "polylac" | "hpl" | "natural_walnut" | "massive_oak" | "fume_glass" | "upvc" | "cnc_wood";
  materialLabel: string;
  materials: string[];
  features?: string[];
  badgePrimary: string;
  badgeSecondary: string;
  branches: ("mansoura" | "mahalla" | "samanoud")[];
  price: number;
  basePrice?: number | null;
  pricingMode: "whatsapp_quote" | "per_meter" | "fixed_price";
  status: "published" | "draft" | "archived";
  priceDisplay: string;
  priceNote: string;
  description: string;
  specs: string[];
  imageUrl: string;
  coverImage?: string;
  gallery: string[];
  galleryImages?: string[];
  dimensions?: string;
  hardware?: string;
  finish?: string;
  chassis?: string;
  leadTime?: string;
  featured: boolean;
  isFeatured?: boolean;
  warrantyYears: number;
}

export const BRANCH_CONTACTS: Record<
  string,
  {
    name: string;
    shortName: string;
    city: string;
    phones: string[];
    whatsapp: string;
    address: string;
    hours: string;
    mapUrl: string;
  }
> = {
  mansoura: {
    name: SHOWROOM_BRANCHES.mansoura.name,
    shortName: "المنصورة",
    city: "المنصورة",
    phones: SHOWROOM_BRANCHES.mansoura.phones,
    whatsapp: SHOWROOM_BRANCHES.mansoura.whatsappNumber,
    address: SHOWROOM_BRANCHES.mansoura.address,
    hours: SHOWROOM_BRANCHES.mansoura.workingHours,
    mapUrl: SHOWROOM_BRANCHES.mansoura.googleMapsUrl,
  },
  mahalla: {
    name: SHOWROOM_BRANCHES.mahalla.name,
    shortName: "المحلة الكبرى",
    city: "المحلة الكبرى",
    phones: SHOWROOM_BRANCHES.mahalla.phones,
    whatsapp: SHOWROOM_BRANCHES.mahalla.whatsappNumber,
    address: SHOWROOM_BRANCHES.mahalla.address,
    hours: SHOWROOM_BRANCHES.mahalla.workingHours,
    mapUrl: SHOWROOM_BRANCHES.mahalla.googleMapsUrl,
  },
  samanoud: {
    name: SHOWROOM_BRANCHES.samanoud.name,
    shortName: "سمنود والمجمع الصناعي",
    city: "سمنود",
    phones: SHOWROOM_BRANCHES.samanoud.phones,
    whatsapp: SHOWROOM_BRANCHES.samanoud.whatsappNumber,
    address: SHOWROOM_BRANCHES.samanoud.address,
    hours: SHOWROOM_BRANCHES.samanoud.workingHours,
    mapUrl: SHOWROOM_BRANCHES.samanoud.googleMapsUrl,
  },
  // Backward compatibility alias
  samanoud_mahalla: {
    name: SHOWROOM_BRANCHES.mahalla.name,
    shortName: "المحلة وسمنود",
    city: "المحلة وسمنود",
    phones: SHOWROOM_BRANCHES.mahalla.phones,
    whatsapp: SHOWROOM_BRANCHES.mahalla.whatsappNumber,
    address: SHOWROOM_BRANCHES.mahalla.address,
    hours: SHOWROOM_BRANCHES.mahalla.workingHours,
    mapUrl: SHOWROOM_BRANCHES.mahalla.googleMapsUrl,
  },
};

export const productsData: Product[] = [
  // 1. kitchens: بولاك مودرن
  {
    id: "prod-1",
    code: "SHW-204",
    name: "مطبخ بولاك رمادي مات - ميكانزم بلوم نمساوي",
    title: "مطبخ بولاك رمادي مات - ميكانزم بلوم نمساوي",
    slug: "pollak-island-italian",
    subtitle: "تشكيلة 2026 الحصرية",
    category: "kitchens",
    mainSection: "kitchens",
    categoryLabel: "مطابخ حديثة",
    subCategory: "بولاك مودرن",
    style: "modern",
    styleLabel: "مودرن حديث",
    material: "polylac",
    materialLabel: "بولي لاك تركي",
    materials: ["بولي لاك", "شاسيه كونتر أوروبي", "لزق ألماني PUR", "رخام كلكتا"],
    features: ["ميكانزم إيطالي", "مفصلات ومجاري هيدروليك بلوم", "سلال تخزين ذكية"],
    badgePrimary: "مطابخ مودرن",
    badgeSecondary: "ضمان 15 سنة",
    branches: ["mansoura", "mahalla", "samanoud"],
    price: 95000,
    basePrice: 95000,
    pricingMode: "whatsapp_quote",
    status: "published",
    priceDisplay: "95,000 ج.م",
    priceNote: "يبدأ من لمساحة قياسية متكاملة",
    description:
      "تصميم مينيمالي معاصر يجمع بين ألواح البولاك التركية المقاومة للبصمات مع جزيرة رخامية ضخمة ومفصلات Blum النمساوية الذكية ولزق PUR الألماني المقاوم للمياه.",
    specs: ["بولاك مطفي تركي", "رخام كلكتا إيطالي", "بلوم سوفت كلوز", "شاسيه كونتر أوروبي"],
    imageUrl:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=1200&q=80",
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    ],
    dimensions: "مساحة قياسية 4.0م × 3.2م مع جزيرة وسطية 2.2م × 1.1م (قابلة للتفصيل)",
    hardware: "مفصلات ومجاري أدراج Blum النمساوية الأصلية بتقنية Blumotion الهيدروليكية",
    finish: "سوبر مات ناعم مضاد لآثار البصمات ومقاوم للخدش والحرارة بنسبة 100%",
    chassis: "كونتر جودوود أوروبي مكبوس HPL ألماني عازل تام للمياه والرطوبة والحشرات",
    leadTime: "من 25 إلى 35 يوم عمل شامل التصميم والمعاينة والتصنيع والتركيب الفندقي",
    featured: true,
    isFeatured: true,
    warrantyYears: 15,
  },

  // 2. kitchens: مطابخ آيلاند (Island)
  {
    id: "prod-2",
    code: "SHW-310",
    name: "مطبخ فيلا المعادي - أسود كربوني وبانوهات",
    title: "مطبخ فيلا المعادي - أسود كربوني وبانوهات",
    slug: "black-carbon-island-waterfall",
    subtitle: "تنفيذ فيلات مخصص",
    category: "kitchens",
    mainSection: "kitchens",
    categoryLabel: "مطابخ حديثة",
    subCategory: "مطابخ آيلاند (Island)",
    style: "ultramodern",
    styleLabel: "ألترا مودرن",
    material: "natural_walnut",
    materialLabel: "خشب جوز طبيعي أمريكي",
    materials: ["شاسيه كونتر أوروبي", "لزق ألماني PUR", "رخام كلكتا", "المينيت"],
    features: ["ميكانزم إيطالي", "مفصلات ومجاري هيدروليك بلوم", "إضاءة ليد مخفية"],
    badgePrimary: "مطابخ آيلاند",
    badgeSecondary: "ضمان 15 سنة",
    branches: ["mansoura", "mahalla"],
    price: 135000,
    basePrice: 135000,
    pricingMode: "whatsapp_quote",
    status: "published",
    priceDisplay: "135,000 ج.م",
    priceNote: "يبدأ من لمساحة فيلا كاملة مع شلال رخام",
    description:
      "مزيج درامي فاخر بين الأسطح الفحمية المطفية وبانوهات خشب الجوز المفرغة رأسياً مع رخام شلالي ممتد للأرضية وإضاءة خطية LED مخفية.",
    specs: ["أسود كربوني مطفي", "قشرة جوز طبيعي", "رخام شلال Waterfall", "إضاءة Smart Warm"],
    imageUrl:
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=1200&q=80",
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
    ],
    dimensions: "مساحة 5.2م × 3.6م مع جزيرة شلال Waterfall طول 3 أمتار",
    hardware: "ميكانيزم هيدروليك بلوم تيب-أون (فتح باللمس) + إغلاق ناعم سوفت كلوز",
    finish: "بانوهات خشب جوز أمريكي طبيعي معالجة بزيوت أوروبية ضد البقع",
    chassis: "شاسيه كونتر أرو أوروبي مكبوس ألماني شديد المتانة",
    leadTime: "من 30 إلى 40 يوم عمل لتنفيذ تفاصيل النجارة المخصصة",
    featured: true,
    isFeatured: true,
    warrantyYears: 15,
  },

  // 3. kitchens: نيو كلاسيك خشب أرو
  {
    id: "prod-3",
    code: "CLS-402",
    name: "مطبخ خشب طبيعي أرو أبيض نيوكلاسيك",
    title: "مطبخ خشب طبيعي أرو أبيض نيوكلاسيك",
    slug: "classic-oak-white-polyurethane",
    subtitle: "تصاميم كلاسيك فاخرة",
    category: "kitchens",
    mainSection: "kitchens",
    categoryLabel: "مطابخ كلاسيك ونيوكلاسيك",
    subCategory: "نيو كلاسيك خشب أرو",
    style: "neoclassic",
    styleLabel: "نيو كلاسيك",
    material: "massive_oak",
    materialLabel: "خشب أرو ماسيف طبيعي",
    materials: ["خشب زان أحمر روماني مجفف", "شاسيه كونتر أوروبي", "دهانات بولي يوريثان"],
    features: ["ميكانزم إيطالي", "مفصلات ومجاري هيدروليك بلوم", "حفر ليزر دقيق"],
    badgePrimary: "نيو كلاسيك",
    badgeSecondary: "خشب أرو ماسيف",
    branches: ["samanoud", "mahalla"],
    price: 160000,
    basePrice: 160000,
    pricingMode: "whatsapp_quote",
    status: "published",
    priceDisplay: "160,000 ج.م",
    priceNote: "سعر النموذج المتكامل للأخشاب الطبيعية",
    description:
      "فخامة القصور الملكية بلمسة نيوكلاسيك متطورة، أخشاب أرو روماني مجفف بدهانات أوف وايت مطعمة بمقابض نحاسية أصلية.",
    specs: ["أرو روماني صلب", "دهانات بولي يوريثان", "زجاج بلجيكي عاكس", "تجميع زوايا ليزر"],
    imageUrl:
      "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=1200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80",
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=1200&q=80",
    ],
    dimensions: "مساحة 4.5م × 3.5م مع دولاب بيلت إن وبوفيه زجاجي",
    hardware: "مفصلات بلوم نمساوي مخفية + مقابض نحاس أثري معتق",
    finish: "دهانات بولي يوريثان إيطالي ناصعة الأوف وايت لا تتغير مع الزمن",
    chassis: "خشب أرو ماسيف روماني طبيعي 100% مجفف في أفران حرارية",
    leadTime: "من 35 إلى 45 يوم عمل لدقة الصنعة والحفر النيوكلاسيكي",
    featured: true,
    isFeatured: true,
    warrantyYears: 15,
  },

  // 4. dressing_rooms: دواليب زجاج بروفايل إيطالي
  {
    id: "prod-4",
    code: "WIC-550",
    name: "دريسينج روم زجاج فاميه وبروفايل إيطالي",
    title: "دريسينج روم زجاج فاميه وبروفايل إيطالي",
    slug: "fume-glass-walk-in-closet",
    subtitle: "حلول التخزين الذكية",
    category: "dressing_rooms",
    mainSection: "dressing_rooms",
    categoryLabel: "الدريسينج ووحدات التخزين",
    subCategory: "دواليب زجاج بروفايل إيطالي",
    style: "modern",
    styleLabel: "مودرن حديث",
    material: "fume_glass",
    materialLabel: "زجاج فاميه وبروفايل إيطالي",
    materials: [
      "زجاج فاميه سيكوريت عاكس",
      "ألمنيوم أسود",
      "خشب إم دي إف مستورد عالي الكثافة",
      "قشرة أرو طبيعي",
    ],
    features: [
      "سنسور إضاءة أوتوماتيكي عند الفتح",
      "رفوف ساعات وإكسسوارات مبطنة مخمل",
      "علاقات هيدروليك",
    ],
    badgePrimary: "دريسينج روم",
    badgeSecondary: "زجاج فاميه إيطالي",
    branches: ["mansoura", "mahalla", "samanoud"],
    price: 88000,
    basePrice: 88000,
    pricingMode: "whatsapp_quote",
    status: "published",
    priceDisplay: "88,000 ج.م",
    priceNote: "سعر الجدارية التخزينية المدمجة مع الإضاءة",
    description:
      "غرفة ملابس ذكية مجهزة بأبواب زجاج فاميه عازلة للأتربة مع إضاءة عمودية مخفية وأدراج مغطاة بالمخمل الإيطالي للإكسسوارات وسنسورات تشغيل تلقائي.",
    specs: ["بروفايل أسود أنودايزد", "زجاج فاميه سيكوريت", "مستشعرات إضاءة", "تقسيمات مخملية"],
    imageUrl:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    ],
    dimensions: "جدارية 3.6م ارتفاع 2.7م عمق 60 سم مع جزيرة ساعات ومجوهرات",
    hardware: "بروفايل ألومنيوم إيطالي أسود غير لامع مع ميكانيزم سوفت كلوز صامت",
    finish: "زجاج بلجيكي فاميه سيكوريت عازل للأتربة مع أرضيات مخملية فاخرة",
    chassis: "خشب كونتر أوروبي مغلف ميلامين قماش أنيق",
    leadTime: "من 20 إلى 30 يوم عمل",
    featured: true,
    isFeatured: true,
    warrantyYears: 15,
  },

  // 5. decor: بانوهات بديل خشب ورخام + وحدات TV
  {
    id: "prod-5",
    code: "DEC-108",
    name: "تجليد حوائط ووحدة تلفزيون جدارية CNC",
    title: "تجليد حوائط ووحدة تلفزيون جدارية CNC",
    slug: "cnc-tv-wall-cladding",
    subtitle: "حلول المعيشة والريسبشن",
    category: "decor",
    mainSection: "decor",
    categoryLabel: "الديكورات وتجاليد الحوائط",
    subCategory: "وحدات تلفزيون جدارية (TV Units)",
    style: "modern",
    styleLabel: "مودرن حديث",
    material: "cnc_wood",
    materialLabel: "ألواح خشبية CNC ودوكو فرن",
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
    badgePrimary: "ديكورات وتجاليد",
    badgeSecondary: "ضمان 15 سنة",
    branches: ["mansoura", "mahalla"],
    price: 72000,
    basePrice: 72000,
    pricingMode: "whatsapp_quote",
    status: "published",
    priceDisplay: "72,000 ج.م",
    priceNote: "سعر الوحدة والتجليد بالكامل شامل الإضاءة",
    description:
      "بانوهات خشبية مفرغة CNC بدقة متناهية مع وحدة معلقة عائمة، فتحات تمرير أسلاك ذكية مخفية، ولزق PUR المقاوم للحرارة وإضاءة ليد بروفايل مدمجة.",
    specs: ["خشب CNC مفرز", "لزق PUR ألماني", "إضاءة LED بروفايل", "شاسيه عائم خفي"],
    imageUrl:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    ],
    dimensions: "عرض 3.8م ارتفاع كامل السقف 2.8م مع وحدة كونسول 2.4م",
    hardware: "حوامل إيطالية معلقة مخفية تتحمل حتى 150 كجم",
    finish: "شرائح خشب مجفف مدهونة بدهانات دوكو فرن بمصنع الشويمي",
    chassis: "عزل صوتي خلفي وفوم مضاد للاهتزازات",
    leadTime: "من 15 إلى 25 يوم عمل",
    featured: false,
    isFeatured: false,
    warrantyYears: 15,
  },

  // 6. kitchens: عصري HPL
  {
    id: "prod-6",
    code: "MOD-612",
    name: "مطبخ شاتوه - مات رمادي مع جزيرة عائمة HPL",
    title: "مطبخ شاتوه - مات رمادي مع جزيرة عائمة HPL",
    slug: "chateau-grey-hpl-island",
    subtitle: "تصاميم مودرن مدمجة",
    category: "kitchens",
    mainSection: "kitchens",
    categoryLabel: "مطابخ حديثة",
    subCategory: "عصري HPL",
    style: "modern",
    styleLabel: "مودرن حديث",
    material: "hpl",
    materialLabel: "HPL ألماني عالي المتانة",
    materials: ["المينيت", "لزق ألماني PUR مقاوم للمياه والحرارة", "شاسيه كونتر أوروبي"],
    features: ["سلال تخزين ذكية", "مفصلات ومجاري هيدروليك بلوم", "إضاءة ليد مخفية"],
    badgePrimary: "عصري HPL",
    badgeSecondary: "ضمان 15 سنة",
    branches: ["samanoud", "mahalla"],
    price: 110000,
    basePrice: 110000,
    pricingMode: "whatsapp_quote",
    status: "published",
    priceDisplay: "110,000 ج.م",
    priceNote: "يبدأ من لمساحات المطابخ المفتوحة",
    description:
      "تصميم عملي بأسطح HPL المقاومة للخدوش ودرجات الحرارة العالية مع جزيرة ممتدة ومكان مدمج للأجهزة الكهربائية الحديثة ومفصلات سوفت كلوز.",
    specs: ["HPL ألماني", "سطح كوارتز مضاد للبقع", "مقبض Gola مدمج", "شاسيه كونتر أوروبي"],
    imageUrl:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    ],
    dimensions: "مساحة 4.2م × 3.0م مع جزيرة طاولة طعام متصلة 2.4م",
    hardware: "نظام المقابض المدمجة جولا Gola إيطالي أنودايزد أسود",
    finish: "أسطح HPL ألماني مضاد للبكتيريا والحرارة حتى 180 درجة مئوية",
    chassis: "كونتر أوروبي معزول بنظام كبس حراري PUR",
    leadTime: "من 25 إلى 35 يوم عمل",
    featured: false,
    isFeatured: false,
    warrantyYears: 15,
  },

  // 7. furniture: طاولات طعام خشب طبيعي
  {
    id: "prod-7",
    code: "FUR-715",
    name: "طاولة طعام رويال خشب بلوط وأرجل تيتانيوم",
    title: "طاولة طعام رويال خشب بلوط وأرجل تيتانيوم",
    slug: "royal-oak-dining-table",
    subtitle: "أثاث منزلي مخصص",
    category: "furniture",
    mainSection: "furniture",
    categoryLabel: "الأثاث المنزلي الراقي",
    subCategory: "طاولات طعام خشب طبيعي",
    style: "modern",
    styleLabel: "مودرن حديث",
    material: "massive_oak",
    materialLabel: "خشب زان وبلوط روماني طبيعي",
    materials: [
      "خشب زان أحمر روماني مجفف",
      "دهانات أستر وبولي يوريثان إيطالية بمصانعنا",
      "أقمشة مستوردة معالجة",
    ],
    features: [
      "أرجل ستانلس تيتانيوم مقاوم للخدش",
      "تنجيد إسفنج كثافة 36 سوبر سوفت",
      "حفر ليزر دقيق",
    ],
    badgePrimary: "أثاث راقي",
    badgeSecondary: "ضمان 15 سنة",
    branches: ["mansoura", "mahalla", "samanoud"],
    price: 68000,
    basePrice: 68000,
    pricingMode: "whatsapp_quote",
    status: "published",
    priceDisplay: "68,000 ج.م",
    priceNote: "سعر الطاولة لـ 8 مقاعد بدون الكراسي",
    description:
      "طاولة سفرة مصنعة من ألواح خشب البلوط الطبيعي الصلب المجفف بأفران الشركة، معالجة بتشطيب بولي يوريثان إيطالي وأرجل تيتانيوم مقاومة للخدش.",
    specs: ["بلوط صلب مجفف", "قواعد تيتانيوم مطلي", "أبعاد 240 × 110 سم", "دهان مقاوم للحرارة"],
    imageUrl:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80",
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80",
    ],
    dimensions: "الطول 240 سم × العرض 110 سم × الارتفاع 76 سم (سمك السطح 5 سم صلب)",
    hardware: "قواعد تثبيت تيتانيوم متينة ومقاومة للأكسدة",
    finish: "ورنيش مات بولي يوريثان إيطالي مقاوم للماء والبقع والحرارة",
    chassis: "خشب زان وبلوط روماني صلب 100%",
    leadTime: "من 15 إلى 20 يوم عمل",
    featured: false,
    isFeatured: false,
    warrantyYears: 15,
  },

  // 8. windows: شبابيك UPVC عازلة للصوت والحرارة (DRD Section 2 Category 5)
  {
    id: "prod-8",
    code: "WIN-901",
    name: "شبابيك UPVC عازلة للصوت بزجاج دبل جورجيا",
    title: "شبابيك UPVC عازلة للصوت بزجاج دبل جورجيا",
    slug: "upvc-acoustic-double-window",
    subtitle: "قطاعات ألمانية معتمدة",
    category: "windows",
    mainSection: "windows",
    categoryLabel: "الشبابيك والقطاعات",
    subCategory: "شبابيك بي في سي (UPVC)",
    style: "modern",
    styleLabel: "عزل فائق",
    material: "upvc",
    materialLabel: "قطاعات UPVC ألمانية عازلة",
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
    badgePrimary: "شبابيك عازلة",
    badgeSecondary: "ضمان 15 سنة",
    branches: ["mansoura", "mahalla", "samanoud"],
    price: 45000,
    basePrice: 45000,
    pricingMode: "per_meter",
    status: "published",
    priceDisplay: "سعر المتر المربع حسب المقاس",
    priceNote: "شامل التوريد والتركيب والزجاج الدبل المحقون غاز الأرجون",
    description:
      "شبابيك بي في سي (UPVC) ألمانية الصنع عازلة للصوت والحرارة بنسبة 95%، مزودة بزجاج دبل محقون وإكسسوارات غلق ألمانية وسلك ناموسية فايبر جلاس مدمج.",
    specs: ["عزل صوت وحرارة تام", "زجاج دبل محقون أرجون", "كاوتش EPDM ألماني", "سلك فايبر جلاس"],
    imageUrl:
      "https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=1200&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=1200&q=80",
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=1200&q=80",
    ],
    dimensions: "تفصيل حسب مقاسات فتحات المبنى الهندسية بدقة الملليمتر",
    hardware: "إكسسوارات ROTO ألمانية متعددة نقاط الغلق للأمان التام",
    finish: "أبيض أو ألوان خشبية متدرجة مقاومة لأشعة الشمس فوق البنفسجية UV",
    chassis: "حديد تسليح داخلي مجلفن 1.5 مم لمقاومة ضغط الرياح العاتية",
    leadTime: "من 15 إلى 25 يوم عمل",
    featured: true,
    isFeatured: true,
    warrantyYears: 15,
  },
];
