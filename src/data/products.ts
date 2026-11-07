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
    priceNote: "يبدأ من لمساحة قياسية",
    description:
      "تصميم مينيمالي معاصر يجمع بين ألواح البولاك التركية المقاومة للبصمات مع جزيرة رخامية ضخمة ومفصلات Blum النمساوية الذكية.",
    specs: ["بولاك مطفي تركي", "رخام كلكتا إيطالي", "بلوم سوفت كلوز", "شاسيه كونتر أرو"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBZPi3rNDLqy4PubhaFsY0GXjPOjvVzOgqKuRgPTQWqadFBkULDj0RBFBqXIDIgUbF8D98lS88Acqk_0UjzJMJ89X107_xdCZSbQt7Y9xZ-_Z94RmBAMU7JqCwk_iazTG1vytPQbdwDdwHzZJeVgGf5GftCquoevscR6RbVO4eRWZ-twqWF-u4rNjgONOmgQb2MgcEdHwjf6pZPoIu0eFea5Iaz8K_DZuz_Uo03or4",
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
    priceNote: "يبدأ من لمساحة فيلا كاملة",
    description:
      "مزيج درامي فاخر بين الأسطح الفحمية المطفية وبانوهات خشب الجوز المفرغة رأسياً مع رخام شلالي ممتد للأرضية وإضاءة خطية LED مخفية.",
    specs: ["أسود كربوني مطفي", "قشرة جوز طبيعي", "رخام شلال Waterfall", "إضاءة Smart Warm"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDrl2yP2VykpkKgYshjhQR3-WMJ1OxkC7THuF66GdkzQ_WTifViLlIT1bYTXlS0ok5Dgwwo6y_KFYS5HwntgOGpxd_4bwIm--kXwgBS7BwSFmzN6kdbiSKguU0ItSmnOg7i5rUDGLiqOyqH6uAzne6DdVRccaGIVOwzP8C85pEnm8Og31MXnV1ImHOL-ONZkQLg1S5fX75BadtAB16XRABhzPyINbLmiKuDI1fL4rI",
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
    priceNote: "سعر النموذج المتكامل",
    description:
      "فخامة القصور الملكية بلمسة نيوكلاسيك متطورة، أخشاب أرو روماني مجفف بدهانات أوف وايت مطعمة بمقابض نحاسية أصلية.",
    specs: ["أرو روماني صلب", "دهانات بولي يوريثان", "زجاج بلجيكي عاكس", "تجميع زوايا ليزر"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBa96KSolSwP2PgM4Qi4gcQFboWFmuDaKMyrMLHRh35kAzny8VoX1mOVjJb3hunzSQOJ8I00tw0-hX_GTsJYxTRnarsdWO3EjXswEDtAR62fy3m-DGA_qHpJYK6mxLoOdgwoVyiLNEIcbWIQ29YGGZ0uvqHBlj4I3T-NdmAktdNddCEOvW2YqiDySzdL4HwKAwBHaZt3j5UwM6TY7Dut3IeLY-AC1A6-fWxc4ZxNxE",
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
    priceNote: "سعر الجدارية التخزينية المدمجة",
    description:
      "غرفة ملابس ذكية مجهزة بأبواب زجاج فاميه عازلة للأتربة مع إضاءة عمودية مخفية وأدراج مغطاة بالمخمل الإيطالي للإكسسوارات.",
    specs: ["بروفايل أسود أنودايزد", "زجاج فاميه سيكوريت", "مستشعرات إضاءة", "تقسيمات ذكية"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzW__PHhPL-efDNiLvz2AkFUDWfBrnU2eeOBZAaB0M73R0_Llx8vMxdvKdzvxVrOYKjs3l8rdb9ceaM0K9zHYY5xeOqNgdA5n5mfpjMI8B7vZ2Q_ldxREcj5ehcIs2JCy2l7NhJ94nJtZuKCDl9PGzNIvVVk8FPGF2LTb0vX3pxSj2MraeixnCvnhYB8YDjGQ2MYKaCVhKTDzkPB7fOt6K9K981Nwri8-2VaEc11w",
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
    priceNote: "سعر الوحدة والتجليد بالكامل",
    description:
      "بانوهات خشبية مفرغة من خشب الجوز المختار بدقة مع وحدة معلقة عائمة، ولزق PUR المقاوم للحرارة وإضاءة مخفية بتناغم معماري.",
    specs: ["خشب جوز طبيعي", "لزق PUR ألماني", "إضاءة Smart Strip", "شاسيه عائم خفي"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUGpQOh5mrAnXoviGtgqbn7sMWGZvClvvaMmNHIdw5d52oY65iwMKqhcY8ma-Xx1T6nOK0DoYVOXRk1xjkSumjn-Cw3P-vkK_bWFbNDaQif9QM16n2rps16pUGcI73tTmQmuALQ8fSlfzqTyIblE5aP0dXCA1PtJmJkmjm-HzUBPU91eL9Acc8zZz-jplAzGwJMVVTBjzL_KnHSvhbId6IbEI6sjhVRwg7VbnReJI",
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
    priceNote: "سعر الطاولة لـ 8 مقاعد",
    description:
      "طاولة سفرة مصنعة من ألواح خشب البلوط الطبيعي الصلب المعالج بتشطيب مط مقاوم للحرارة مع قواعد هندسية من النحاس المصقول.",
    specs: ["بلوط أوروبي صلب", "قواعد نحاس مطلي", "أبعاد 240 × 110 سم", "دهان مقاوم للحرارة"],
    imageUrl:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80",
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
    priceNote: "سعر الموديل 4 أمتار طولية",
    description:
      "خزانة ملابس حديثة بأبواب سحب انسيابية هيدروليكية وتقسيمات داخلية متعددة تناسب المساحات المدمجة مع إضاءة مستشعرات ذكية.",
    specs: ["سكة سحب إيطالية", "ألواح بولاك بيج مطفي", "أدراج مخملية", "مرايا عاكسة"],
    imageUrl:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    warrantyYears: 15,
  },
];
