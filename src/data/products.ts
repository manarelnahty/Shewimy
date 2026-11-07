export type BranchKey = "mansoura" | "samanoud_mahalla";

export interface Product {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  category: "kitchens" | "dressing" | "furniture" | "cladding";
  categoryLabel: string;
  style: "modern" | "classic" | "neoclassic" | "ultramodern";
  styleLabel: string;
  material: "polylac" | "hpl" | "natural_walnut" | "massive_oak" | "fume_glass";
  materialLabel: string;
  badgePrimary: string;
  badgeSecondary: string;
  branches: BranchKey[];
  price: number;
  priceDisplay: string;
  priceNote: string;
  description: string;
  specs: string[];
  imageUrl: string;
  gallery: string[];
  dimensions?: string;
  hardware?: string;
  finish?: string;
  chassis?: string;
  leadTime?: string;
  featured: boolean;
  warrantyYears: number;
}

export const BRANCH_CONTACTS: Record<
  BranchKey,
  {
    name: string;
    shortName: string;
    city: string;
    phones: string[];
    whatsapp: string;
  }
> = {
  mansoura: {
    name: "فرع المنصورة",
    shortName: "المنصورة",
    city: "المنصورة",
    phones: ["01005557109", "01012623138"],
    whatsapp: "201005557109",
  },
  samanoud_mahalla: {
    name: "فرع سمنود والمحلة",
    shortName: "سمنود والمحلة",
    city: "سمنود والمحلة الكبرى",
    phones: ["01287153339", "01098199288"],
    whatsapp: "201287153339",
  },
};

export const productsData: Product[] = [
  {
    id: "prod-1",
    code: "SHW-204",
    name: "مطبخ بولاك رمادي مات - ميكانزم بلوم",
    subtitle: "تشكيلة 2026 الحصرية",
    category: "kitchens",
    categoryLabel: "مطابخ حديثة",
    style: "modern",
    styleLabel: "مودرن حديث",
    material: "polylac",
    materialLabel: "بولاك تركي",
    badgePrimary: "مطابخ مودرن",
    badgeSecondary: "ضمان 15 سنة",
    branches: ["mansoura", "samanoud_mahalla"], // متوفر بكلا الفرعين
    price: 95000,
    priceDisplay: "95,000 ج.م",
    priceNote: "يبدأ من لمساحة قياسية متكاملة",
    description:
      "تصميم مينيمالي معاصر يجمع بين ألواح البولاك التركية المقاومة للبصمات مع جزيرة رخامية ضخمة ومفصلات Blum النمساوية الذكية.",
    specs: ["بولاك مطفي تركي", "رخام كلكتا إيطالي", "بلوم سوفت كلوز", "شاسيه كونتر أرو"],
    imageUrl:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBAQBoMgePU5EkpY28MeJBMbBHzHwXdqSNsN5essXjxlYVDCyd2BbkCnoHsr-4pWz6HHbJ5_bpbf4Rq6km7CklupE5540gB_t7FiSH7jgphV5hSbglerw8oDdGAEBxHtP8R6Pe9wD4YK31Kr0-IxLVdkbqZJBqARxE6mpvfwL6D-D0tnnZaCvslyiq0oJNtwknKybkF6_lwl0biBCFkkbmXhPvxbDX__JPkFAppS0",
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
    ],
    dimensions: "مساحة قياسية 4.0م × 3.2م مع جزيرة وسطية 2.2م × 1.1م (قابلة للتفصيل)",
    hardware: "مفصلات ومجاري أدراج Blum النمساوية الأصلية بتقنية Blumotion الهيدروليكية",
    finish: "سوبر مات ناعم مضاد لآثار البصمات ومقاوم للخدش والحرارة بنسبة 100%",
    chassis: "كونتر جودوود مستورد ومكبوس HPL ألماني عازل تام للمياه والرطوبة والحشرات",
    leadTime: "من 25 إلى 35 يوم عمل شامل التصميم والمعاينة والتصنيع والتركيب الفندقي",
    featured: true,
    warrantyYears: 15,
  },
  {
    id: "prod-2",
    code: "SHW-310",
    name: "مطبخ فيلا المعادي - أسود كربوني وبانوهات",
    subtitle: "تنفيذ فيلات مخصص",
    category: "kitchens",
    categoryLabel: "مطابخ حديثة",
    style: "ultramodern",
    styleLabel: "ألترا مودرن",
    material: "natural_walnut",
    materialLabel: "خشب جوز طبيعي أمريكي",
    badgePrimary: "ألترا مودرن",
    badgeSecondary: "خشب جوز طبيعي",
    branches: ["mansoura"], // متوفر بفرع المنصورة فقط
    price: 135000,
    priceDisplay: "135,000 ج.م",
    priceNote: "يبدأ من لمساحة فيلا كاملة مع شلال رخام",
    description:
      "مزيج درامي فاخر بين الأسطح الفحمية المطفية وبانوهات خشب الجوز المفرغة رأسياً مع رخام شلالي ممتد للأرضية وإضاءة خطية LED مخفية.",
    specs: ["أسود كربوني مطفي", "قشرة جوز طبيعي", "رخام شلال Waterfall", "إضاءة Smart Warm"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDrl2yP2VykpkKgYshjhQR3-WMJ1OxkC7THuF66GdkzQ_WTifViLlIT1bYTXlS0ok5Dgwwo6y_KFYS5HwntgOGpxd_4bwIm--kXwgBS7BwSFmzN6kdbiSKguU0ItSmnOg7i5rUDGLiqOyqH6uAzne6DdVRccaGIVOwzP8C85pEnm8Og31MXnV1ImHOL-ONZkQLg1S5fX75BadtAB16XRABhzPyINbLmiKuDI1fL4rI",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDrl2yP2VykpkKgYshjhQR3-WMJ1OxkC7THuF66GdkzQ_WTifViLlIT1bYTXlS0ok5Dgwwo6y_KFYS5HwntgOGpxd_4bwIm--kXwgBS7BwSFmzN6kdbiSKguU0ItSmnOg7i5rUDGLiqOyqH6uAzne6DdVRccaGIVOwzP8C85pEnm8Og31MXnV1ImHOL-ONZkQLg1S5fX75BadtAB16XRABhzPyINbLmiKuDI1fL4rI",
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
    ],
    dimensions: "مساحة 5.2م × 3.6م مع جزيرة شلال Waterfall طول 3 أمتار",
    hardware: "ميكانيزم هيدروليك بلوم تيب-أون (فتح باللمس) + إغلاق ناعم سوفت كلوز",
    finish: "بانوهات خشب جوز أمريكي طبيعي معالجة بزيوت أوروبية ضد البقع",
    chassis: "شاسيه كونتر أرو أوروبي مكبوس ألماني شديد المتانة",
    leadTime: "من 30 إلى 40 يوم عمل لتنفيذ تفاصيل النجارة المخصصة",
    featured: true,
    warrantyYears: 15,
  },
  {
    id: "prod-3",
    code: "CLS-402",
    name: "مطبخ خشب طبيعي أرو أبيض نيوكلاسيك",
    subtitle: "تصاميم كلاسيك فاخرة",
    category: "kitchens",
    categoryLabel: "مطابخ كلاسيك ونيوكلاسيك",
    style: "neoclassic",
    styleLabel: "نيو كلاسيك",
    material: "massive_oak",
    materialLabel: "خشب أرو ماسيف طبيعي",
    badgePrimary: "مطابخ كلاسيك",
    badgeSecondary: "خشب أرو ماسيف",
    branches: ["samanoud_mahalla"], // متوفر بفرع سمنود والمحلة فقط
    price: 160000,
    priceDisplay: "160,000 ج.م",
    priceNote: "سعر النموذج المتكامل للأخشاب الطبيعية",
    description:
      "فخامة القصور الملكية بلمسة نيوكلاسيك متطورة، أخشاب أرو روماني مجفف بدهانات أوف وايت مطعمة بمقابض نحاسية أصلية.",
    specs: ["أرو روماني صلب", "دهانات بولي يوريثان", "زجاج بلجيكي عاكس", "تجميع زوايا ليزر"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBa96KSolSwP2PgM4Qi4gcQFboWFmuDaKMyrMLHRh35kAzny8VoX1mOVjJb3hunzSQOJ8I00tw0-hX_GTsJYxTRnarsdWO3EjXswEDtAR62fy3m-DGA_qHpJYK6mxLoOdgwoVyiLNEIcbWIQ29YGGZ0uvqHBlj4I3T-NdmAktdNddCEOvW2YqiDySzdL4HwKAwBHaZt3j5UwM6TY7Dut3IeLY-AC1A6-fWxc4ZxNxE",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBa96KSolSwP2PgM4Qi4gcQFboWFmuDaKMyrMLHRh35kAzny8VoX1mOVjJb3hunzSQOJ8I00tw0-hX_GTsJYxTRnarsdWO3EjXswEDtAR62fy3m-DGA_qHpJYK6mxLoOdgwoVyiLNEIcbWIQ29YGGZ0uvqHBlj4I3T-NdmAktdNddCEOvW2YqiDySzdL4HwKAwBHaZt3j5UwM6TY7Dut3IeLY-AC1A6-fWxc4ZxNxE",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
    ],
    dimensions: "مساحة 4.5م × 3.5م مع دولاب بيلت إن وبوفيه زجاجي",
    hardware: "مفصلات بلوم نمساوي مخفية + مقابض نحاس أثري معتق",
    finish: "دهانات بولي يوريثان إيطالي ناصعة الأوف وايت لا تتغير مع الزمن",
    chassis: "خشب أرو ماسيف روماني طبيعي 100% مجفف في أفران حرارية",
    leadTime: "من 35 إلى 45 يوم عمل لدقة الصنعة والحفر النيوكلاسيكي",
    featured: true,
    warrantyYears: 15,
  },
  {
    id: "prod-4",
    code: "WIC-550",
    name: "دريسينج روم زجاج فاميه وبروفايل إيطالي",
    subtitle: "حلول التخزين الذكية",
    category: "dressing",
    categoryLabel: "دريسينج روم",
    style: "modern",
    styleLabel: "مودرن حديث",
    material: "fume_glass",
    materialLabel: "زجاج فاميه وبروفايل إيطالي",
    badgePrimary: "دريسينج روم",
    badgeSecondary: "زجاج فاميه إيطالي",
    branches: ["mansoura", "samanoud_mahalla"], // متوفر بكلا الفرعين
    price: 88000,
    priceDisplay: "88,000 ج.م",
    priceNote: "سعر الجدارية التخزينية المدمجة مع الإضاءة",
    description:
      "غرفة ملابس ذكية مجهزة بأبواب زجاج فاميه عازلة للأتربة مع إضاءة عمودية مخفية وأدراج مغطاة بالمخمل الإيطالي للإكسسوارات.",
    specs: ["بروفايل أسود أنودايزد", "زجاج فاميه سيكوريت", "مستشعرات إضاءة", "تقسيمات ذكية"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzW__PHhPL-efDNiLvz2AkFUDWfBrnU2eeOBZAaB0M73R0_Llx8vMxdvKdzvxVrOYKjs3l8rdb9ceaM0K9zHYY5xeOqNgdA5n5mfpjMI8B7vZ2Q_ldxREcj5ehcIs2JCy2l7NhJ94nJtZuKCDl9PGzNIvVVk8FPGF2LTb0vX3pxSj2MraeixnCvnhYB8YDjGQ2MYKaCVhKTDzkPB7fOt6K9K981Nwri8-2VaEc11w",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzW__PHhPL-efDNiLvz2AkFUDWfBrnU2eeOBZAaB0M73R0_Llx8vMxdvKdzvxVrOYKjs3l8rdb9ceaM0K9zHYY5xeOqNgdA5n5mfpjMI8B7vZ2Q_ldxREcj5ehcIs2JCy2l7NhJ94nJtZuKCDl9PGzNIvVVk8FPGF2LTb0vX3pxSj2MraeixnCvnhYB8YDjGQ2MYKaCVhKTDzkPB7fOt6K9K981Nwri8-2VaEc11w",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBXN8DNG20jjInUk91vYG81tR2cOfrwX5NLF9ZCXxGGbh4NE_CnBHjxZpWkkAQq17HX5IV1fTWM4ynOvSep-YZW_a1fFPTeXjSglO9o63ruFo8rfBzUlrNBrveUfZcCXVbop4slPnEhnEvx0uKKhxgJHqg2hk2vRpAEFSVFCJ_muomayXwIDXpZKzZOIa3RaMOYgEtS9jX7s92FCGkfX-68ULmt7xKliLcfru_mnsg",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    ],
    dimensions: "جدارية 3.6م ارتفاع 2.7م عمق 60 سم مع جزيرة ساعات ومجوهرات",
    hardware: "بروفايل ألومنيوم إيطالي أسود غير لامع مع ميكانيزم سوفت كلوز صامت",
    finish: "زجاج بلجيكي فاميه سيكوريت عازل للأتربة مع أرضيات مخملية فاخرة",
    chassis: "خشب كونتر أوروبي مغلف ميلامين قماش أنيق",
    leadTime: "من 20 إلى 30 يوم عمل",
    featured: true,
    warrantyYears: 15,
  },
  {
    id: "prod-5",
    code: "DEC-108",
    name: "تجليد حوائط ووحدة تلفزيون جدارية",
    subtitle: "حلول المعيشة والريسبشن",
    category: "cladding",
    categoryLabel: "تجاليد خشبية",
    style: "modern",
    styleLabel: "مودرن حديث",
    material: "natural_walnut",
    materialLabel: "خشب جوز طبيعي أمريكي",
    badgePrimary: "ديكورات وتجاليد",
    badgeSecondary: "تفصيل حسب المقاس",
    branches: ["mansoura"], // متوفر بفرع المنصورة فقط
    price: 72000,
    priceDisplay: "72,000 ج.م",
    priceNote: "سعر الوحدة والتجليد بالكامل شامل الإضاءة",
    description:
      "بانوهات خشبية مفرغة من خشب الجوز المختار بدقة مع وحدة معلقة عائمة، ولزق PUR المقاوم للحرارة وإضاءة مخفية بتناغم معماري.",
    specs: ["خشب جوز طبيعي", "لزق PUR ألماني", "إضاءة Smart Strip", "شاسيه عائم خفي"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUGpQOh5mrAnXoviGtgqbn7sMWGZvClvvaMmNHIdw5d52oY65iwMKqhcY8ma-Xx1T6nOK0DoYVOXRk1xjkSumjn-Cw3P-vkK_bWFbNDaQif9QM16n2rps16pUGcI73tTmQmuALQ8fSlfzqTyIblE5aP0dXCA1PtJmJkmjm-HzUBPU91eL9Acc8zZz-jplAzGwJMVVTBjzL_KnHSvhbId6IbEI6sjhVRwg7VbnReJI",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUGpQOh5mrAnXoviGtgqbn7sMWGZvClvvaMmNHIdw5d52oY65iwMKqhcY8ma-Xx1T6nOK0DoYVOXRk1xjkSumjn-Cw3P-vkK_bWFbNDaQif9QM16n2rps16pUGcI73tTmQmuALQ8fSlfzqTyIblE5aP0dXCA1PtJmJkmjm-HzUBPU91eL9Acc8zZz-jplAzGwJMVVTBjzL_KnHSvhbId6IbEI6sjhVRwg7VbnReJI",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    ],
    dimensions: "عرض 3.8م ارتفاع كامل السقف 2.8م مع وحدة كونسول 2.4م",
    hardware: "حوامل إيطالية معلقة مخفية تتحمل حتى 150 كجم",
    finish: "شرائح خشب جوز طبيعي مجفف مدهونة بدهانات أكريليك صديقة للبيئة",
    chassis: "عزل صوتي خلفي وفوم مضاد للاهتزازات",
    leadTime: "من 15 إلى 25 يوم عمل",
    featured: false,
    warrantyYears: 15,
  },
  {
    id: "prod-6",
    code: "MOD-612",
    name: "مطبخ شاتوه - مات رمادي مع جزيرة عائمة",
    subtitle: "تصاميم مودرن مدمجة",
    category: "kitchens",
    categoryLabel: "مطابخ حديثة",
    style: "modern",
    styleLabel: "مودرن حديث",
    material: "hpl",
    materialLabel: "HPL ألماني",
    badgePrimary: "مطابخ حديثة",
    badgeSecondary: "HPL ألماني",
    branches: ["samanoud_mahalla"], // متوفر بفرع سمنود والمحلة فقط
    price: 110000,
    priceDisplay: "110,000 ج.م",
    priceNote: "يبدأ من لمساحات المطابخ المفتوحة",
    description:
      "تصميم عملي بأسطح HPL المقاومة للخدوش ودرجات الحرارة العالية مع جزيرة ممتدة ومكان مدمج للأجهزة الكهربائية الحديثة.",
    specs: ["HPL ألماني", "سطح كوارتز مضاد للبقع", "مقبض Gola مدمج", "ضمان 15 سنة"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBAQBoMgePU5EkpY28MeJBMbBHzHwXdqSNsN5essXjxlYVDCyd2BbkCnoHsr-4pWz6HHbJ5_bpbf4Rq6km7CklupE5540gB_t7FiSH7jgphV5hSbglerw8oDdGAEBxHtP8R6Pe9wD4YK31Kr0-IxLVdkbqZJBqARxE6mpvfwL6D-D0tnnZaCvslyiq0oJNtwknKybkF6_lwl0biBCFkkbmXhPvxbDX__JPkFAppS0",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBAQBoMgePU5EkpY28MeJBMbBHzHwXdqSNsN5essXjxlYVDCyd2BbkCnoHsr-4pWz6HHbJ5_bpbf4Rq6km7CklupE5540gB_t7FiSH7jgphV5hSbglerw8oDdGAEBxHtP8R6Pe9wD4YK31Kr0-IxLVdkbqZJBqARxE6mpvfwL6D-D0tnnZaCvslyiq0oJNtwknKybkF6_lwl0biBCFkkbmXhPvxbDX__JPkFAppS0",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    ],
    dimensions: "مساحة 4.2م × 3.0م مع جزيرة طاولة طعام متصلة 2.4م",
    hardware: "نظام المقابض المدمجة جولا Gola إيطالي أنودايزد أسود",
    finish: "أسطح HPL ألماني مضاد للبكتيريا والحرارة حتى 180 درجة مئوية",
    chassis: "كونتر جودوود معزول بنظام كبس ليزر إيطالي",
    leadTime: "من 25 إلى 35 يوم عمل",
    featured: false,
    warrantyYears: 15,
  },
  {
    id: "prod-7",
    code: "FUR-715",
    name: "طاولة طعام رويال خشب بلوط وأرجل نحاس",
    subtitle: "أثاث منزلي مخصص",
    category: "furniture",
    categoryLabel: "أثاث منزلي مخصص",
    style: "modern",
    styleLabel: "مودرن حديث",
    material: "massive_oak",
    materialLabel: "خشب أرو ماسيف طبيعي",
    badgePrimary: "أثاث مخصص",
    badgeSecondary: "بلوط أوروبي صلب",
    branches: ["mansoura", "samanoud_mahalla"], // متوفر بكلا الفرعين
    price: 68000,
    priceDisplay: "68,000 ج.م",
    priceNote: "سعر الطاولة لـ 8 مقاعد بدون الكراسي",
    description:
      "طاولة سفرة مصنعة من ألواح خشب البلوط الطبيعي الصلب المعالج بتشطيب مط مقاوم للحرارة مع قواعد هندسية من النحاس المصقول.",
    specs: ["بلوط أوروبي صلب", "قواعد نحاس مطلي", "أبعاد 240 × 110 سم", "دهان مقاوم للحرارة"],
    imageUrl:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    ],
    dimensions: "الطول 240 سم × العرض 110 سم × الارتفاع 76 سم (سمك السطح 5 سم صلب)",
    hardware: "قواعد تثبيت نحاسية متينة ومقاومة للأكسدة",
    finish: "ورنيش مات أوروبي مقاوم للماء والبقع والحرارة",
    chassis: "خشب بلوط أوروبي صلب 100%",
    leadTime: "من 15 إلى 20 يوم عمل",
    featured: false,
    warrantyYears: 10,
  },
  {
    id: "prod-8",
    code: "WIC-820",
    name: "خزانة ملابس ماستر مدمجة بأبواب سحب",
    subtitle: "دواليب ملابس ماستر",
    category: "dressing",
    categoryLabel: "دريسينج روم",
    style: "modern",
    styleLabel: "مودرن حديث",
    material: "polylac",
    materialLabel: "بولاك تركي",
    badgePrimary: "خزائن ماستر",
    badgeSecondary: "ضمان 15 سنة",
    branches: ["mansoura", "samanoud_mahalla"], // متوفر بكلا الفرعين
    price: 76000,
    priceDisplay: "76,000 ج.م",
    priceNote: "سعر الموديل 4 أمتار طولية كامل التجهيزات",
    description:
      "خزانة ملابس حديثة بأبواب سحب انسيابية هيدروليكية وتقسيمات داخلية متعددة تناسب المساحات المدمجة مع إضاءة مستشعرات ذكية.",
    specs: ["سكة سحب إيطالية", "ألواح بولاك بيج مطفي", "أدراج مخملية", "مرايا عاكسة"],
    imageUrl:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzW__PHhPL-efDNiLvz2AkFUDWfBrnU2eeOBZAaB0M73R0_Llx8vMxdvKdzvxVrOYKjs3l8rdb9ceaM0K9zHYY5xeOqNgdA5n5mfpjMI8B7vZ2Q_ldxREcj5ehcIs2JCy2l7NhJ94nJtZuKCDl9PGzNIvVVk8FPGF2LTb0vX3pxSj2MraeixnCvnhYB8YDjGQ2MYKaCVhKTDzkPB7fOt6K9K981Nwri8-2VaEc11w",
    ],
    dimensions: "عرض 4.0م × ارتفاع 2.7م × عمق 65 سم بأبواب سحب إيطالية",
    hardware: "أنظمة سحب هيدروليكية إيطالية ثقيلة تتحمل حتى 100 كجم للضلفة",
    finish: "بولاك تركي بيج مطفي مدمج مع مرايا عاكسة بلجيكية",
    chassis: "كونتر جودوود مكبوس ميلامين داخلي بيج أنيق",
    leadTime: "من 20 إلى 25 يوم عمل",
    featured: false,
    warrantyYears: 15,
  },
];
