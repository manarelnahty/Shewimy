export interface Product {
  id: string;
  code: string;
  name: string;
  category: "kitchens" | "dressing" | "furniture" | "cladding";
  categoryLabel: string;
  style: "modern" | "classic" | "neoclassic" | "ultramodern";
  styleLabel: string;
  material: "polylac" | "hpl" | "natural_walnut" | "massive_oak" | "fume_glass";
  materialLabel: string;
  price: number;
  priceDisplay: string;
  priceNote: string;
  description: string;
  specs: string[];
  imageUrl: string;
  featured: boolean;
  warrantyYears: number;
}

export const productsData: Product[] = [
  {
    id: "prod-1",
    code: "SHW-204",
    name: "مطبخ بولاك رمادي مات - ميكانزم بلوم",
    category: "kitchens",
    categoryLabel: "مطابخ حديثة",
    style: "modern",
    styleLabel: "مودرن حديث",
    material: "polylac",
    materialLabel: "بولاك تركي",
    price: 95000,
    priceDisplay: "95,000 ج.م",
    priceNote: "يبدأ من لمساحة قياسية",
    description:
      "تصميم مينيمالي معاصر يجمع بين ألواح البولاك التركية المقاومة للبصمات مع جزيرة رخامية ضخمة ومفصلات Blum النمساوية الذكية.",
    specs: ["بولاك مطفي تركي أصلي", "رخام كلكتا إيطالي", "مفصلات بلوم سوفت كلوز", "شاسيه كونتر أرو أوروبي"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida/ALJJyrB-cn6e3CTiwpiuMqoMYYXQln2zMesgMiJYxP8QQFnZdOu93Qda2U-DeOcB0U9xMlqcH5R98Q1xuYLRnxPlCN5c6Qa2H5zhu63TIIBRBd9uceFOGT-iJVbWZ7xrbZ1o-ljJuRgPAa3hc7jQxx_bnSoDxYOLnFGVa9VK3H3bLzxX8dh3ytD5ZAN9P_-8OBhki1qiUMR-e1HsH7pXRnU1eG41EMNeiJ_I3aIZLdP6e5bE",
    featured: true,
    warrantyYears: 15,
  },
  {
    id: "prod-2",
    code: "SHW-310",
    name: "مطبخ فيلا المعادي - أسود كربوني وبانوهات خشبية",
    category: "kitchens",
    categoryLabel: "مطابخ حديثة",
    style: "ultramodern",
    styleLabel: "ألترا مودرن",
    material: "natural_walnut",
    materialLabel: "خشب جوز طبيعي أمريكي",
    price: 135000,
    priceDisplay: "135,000 ج.م",
    priceNote: "يبدأ من لمساحة فيلا كاملة",
    description:
      "مزيج درامي فاخر بين الأسطح الفحمية المطفية وبانوهات خشب الجوز المفرغة رأسياً مع رخام شلالي ممتد للأرضية وإضاءة خطية LED مخفية.",
    specs: ["أسود كربوني فائق المط", "قشرة جوز أمريكي ماسيف", "رخام شلال Waterfall", "إضاءة Smart Warm LED"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida/ALJJyrAKyPyjTC9yvPtYYyuI9vlW9aXVLsLq_Y9aMAEslfXERVID594M9Hco0kpfJqCUiaCt3NpylseURj6qc56yqP6zZfBRV9ifemQJnyPLKnqisYrqPbdTx8MG5AvQpLGQNQjrxNWvKDh3h4YpM3E96H5rcwGR_3y4OX1YO4WlIge3Qntiy7Fa4yQ1zvOPxFhNJfs4VT_IJG8EKePY1gQK-5BvhzjneW3SX9Q4bp3juyCi",
    featured: true,
    warrantyYears: 15,
  },
  {
    id: "prod-3",
    code: "CLS-402",
    name: "مطبخ خشب طبيعي أرو أبيض نيوكلاسيك",
    category: "kitchens",
    categoryLabel: "مطابخ كلاسيك ونيوكلاسيك",
    style: "neoclassic",
    styleLabel: "نيو كلاسيك",
    material: "massive_oak",
    materialLabel: "خشب أرو ماسيف طبيعي",
    price: 160000,
    priceDisplay: "160,000 ج.م",
    priceNote: "سعر النموذج المتكامل",
    description:
      "فخامة القصور الملكية بلمسة نيوكلاسيك متطورة، أخشاب أرو روماني مجفف بدهانات أوف وايت مطعمة بمقابض نحاسية أصلية.",
    specs: ["أرو روماني صلب 100%", "دهانات بولي يوريثان إيطالي", "زجاج بلجيكي عاكس", "تجميع زوايا ليزر"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBa96KSolSwP2PgM4Qi4gcQFboWFmuDaKMyrMLHRh35kAzny8VoX1mOVjJb3hunzSQOJ8I00tw0-hX_GTsJYxTRnarsdWO3EjXswEDtAR62fy3m-DGA_qHpJYK6mxLoOdgwoVyiLNEIcbWIQ29YGGZ0uvqHBlj4I3T-NdmAktdNddCEOvW2YqiDySzdL4HwKAwBHaZt3j5UwM6TY7Dut3IeLY-AC1A6-fWxc4ZxNxE",
    featured: true,
    warrantyYears: 15,
  },
  {
    id: "prod-4",
    code: "WIC-550",
    name: "دريسينج روم زجاج فاميه وبروفايل إيطالي",
    category: "dressing",
    categoryLabel: "دريسينج روم",
    style: "modern",
    styleLabel: "مودرن حديث",
    material: "fume_glass",
    materialLabel: "زجاج فاميه وبروفايل إيطالي",
    price: 88000,
    priceDisplay: "88,000 ج.م",
    priceNote: "سعر الجدارية التخزينية المدمجة",
    description:
      "غرفة ملابس ذكية مجهزة بأبواب زجاج فاميه عازلة للأتربة مع إضاءة عمودية مخفية وأدراج مغطاة بالمخمل الإيطالي للإكسسوارات.",
    specs: ["بروفايل ألومنيوم أسود أنودايزد", "زجاج فاميه سيكوريت", "مستشعرات حركة للإضاءة", "تقسيمات ذكية للساعات والمجوهرات"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzW__PHhPL-efDNiLvz2AkFUDWfBrnU2eeOBZAaB0M73R0_Llx8vMxdvKdzvxVrOYKjs3l8rdb9ceaM0K9zHYY5xeOqNgdA5n5mfpjMI8B7vZ2Q_ldxREcj5ehcIs2JCy2l7NhJ94nJtZuKCDl9PGzNIvVVk8FPGF2LTb0vX3pxSj2MraeixnCvnhYB8YDjGQ2MYKaCVhKTDzkPB7fOt6K9K981Nwri8-2VaEc11w",
    featured: true,
    warrantyYears: 15,
  },
  {
    id: "prod-5",
    code: "DEC-108",
    name: "تجليد حوائط ووحدة تلفزيون جدارية خشب جوز",
    category: "cladding",
    categoryLabel: "تجاليد خشبية",
    style: "modern",
    styleLabel: "مودرن حديث",
    material: "natural_walnut",
    materialLabel: "خشب جوز طبيعي أمريكي",
    price: 72000,
    priceDisplay: "72,000 ج.م",
    priceNote: "سعر الوحدة والتجليد بالكامل",
    description:
      "تجليد جداري معماري متكامل يدمج شرائح الخشب المضلع مع وحدة شاشة معلقة وأرفف رخامية عائمة بنظام إخفاء الأسلاك بالكامل.",
    specs: ["شرائح خشب جوز معالجة", "عزل صوتي خلفي مدمج", "إضاءة LED بروفايل دافئة", "حوامل إيطالية مخفية"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUGpQOh5mrAnXoviGtgqbn7sMWGZvClvvaMmNHIdw5d52oY65iwMKqhcY8ma-Xx1T6nOK0DoYVOXRk1xjkSumjn-Cw3P-vkK_bWFbNDaQif9QM16n2rps16pUGcI73tTmQmuALQ8fSlfzqTyIblE5aP0dXCA1PtJmJkmjm-HzUBPU91eL9Acc8zZz-jplAzGwJMVVTBjzL_KnHSvhbId6IbEI6sjhVRwg7VbnReJI",
    featured: false,
    warrantyYears: 15,
  },
  {
    id: "prod-6",
    code: "MOD-612",
    name: "مطبخ شاتوه - مات رمادي مع جزيرة عائمة",
    category: "kitchens",
    categoryLabel: "مطابخ حديثة",
    style: "modern",
    styleLabel: "مودرن حديث",
    material: "hpl",
    materialLabel: "HPL ألماني",
    price: 110000,
    priceDisplay: "110,000 ج.م",
    priceNote: "يبدأ من لمساحات المطابخ المفتوحة",
    description:
      "تصميم عملي بأسطح HPL المقاومة للخدوش ودرجات الحرارة العالية مع جزيرة ممتدة ومكان مدمج للأجهزة الكهربائية الحديثة.",
    specs: ["HPL ألماني مضاد للبكتيريا", "سطح كوارتز مضاد للبقع", "مقبض Gola مدمج إيطالي", "ضمان 15 سنة شامل"],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBAQBoMgePU5EkpY28MeJBMbBHzHwXdqSNsN5essXjxlYVDCyd2BbkCnoHsr-4pWz6HHbJ5_bpbf4Rq6km7CklupE5540gB_t7FiSH7jgphV5hSbglerw8oDdGAEBxHtP8R6Pe9wD4YK31Kr0-IxLVdkbqZJBqARxE6mpvfwL6D-D0tnnZaCvslyiq0oJNtwknKybkF6_lwl0biBCFkkbmXhPvxbDX__JPkFAppS0",
    featured: false,
    warrantyYears: 15,
  },
  {
    id: "prod-7",
    code: "FUR-715",
    name: "طاولة طعام رويال خشب بلوط وأرجل نحاس",
    category: "furniture",
    categoryLabel: "أثاث منزلي مخصص",
    style: "modern",
    styleLabel: "مودرن حديث",
    material: "massive_oak",
    materialLabel: "خشب أرو ماسيف طبيعي",
    price: 68000,
    priceDisplay: "68,000 ج.م",
    priceNote: "سعر الطاولة لـ 8 مقاعد",
    description:
      "طاولة سفرة مصنعة من ألواح خشب البلوط الطبيعي الصلب المعالج بتشطيب مط مقاوم للحرارة مع قواعد هندسية من النحاس المصقول.",
    specs: ["بلوط أوروبي صلب", "قواعد نحاس مطلي كهربائياً", "أبعاد 240 × 110 سم", "دهان مقاوم للماء والحرارة"],
    imageUrl:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    warrantyYears: 10,
  },
  {
    id: "prod-8",
    code: "WIC-820",
    name: "خزانة ملابس ماستر مدمجة بأبواب سحب هيدروليك",
    category: "dressing",
    categoryLabel: "دريسينج روم",
    style: "modern",
    styleLabel: "مودرن حديث",
    material: "polylac",
    materialLabel: "بولاك تركي",
    price: 76000,
    priceDisplay: "76,000 ج.م",
    priceNote: "سعر الموديل 4 أمتار طولية",
    description:
      "خزانة ملابس حديثة بأبواب سحب انسيابية هيدروليكية وتقسيمات داخلية متعددة تناسب المساحات المدمجة مع إضاءة مستشعرات ذكية.",
    specs: ["سكة سحب إيطالية ثقيلة", "ألواح بولاك بيج مطفي", "أدراج مخملية مدمجة", "مرايا عاكسة مدمجة"],
    imageUrl:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    warrantyYears: 15,
  },
];
