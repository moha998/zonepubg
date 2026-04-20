import { Device, Character, Giveaway, Poll, Attachment, Weapon } from "./types";

export const GIVEAWAYS: Giveaway[] = [];

export const POLLS: Poll[] = [];

export const WEAPONS: Weapon[] = [
  // Assault Rifles (AR)
  {
    id: "m416",
    nameEn: "M416",
    nameAr: "إم 416",
    type: "AR",
    damage: 41,
    recoil: 32,
    speed: 78,
    range: 56,
    image: "",
    bestAttachments: {
      muzzle: "compensator",
      grip: "vertical-grip",
      magazine: "ext-quickdraw",
      stock: "tactical-stock",
      scope: "scope-6x",
    },
  },
  {
    id: "akm",
    nameEn: "AKM",
    nameAr: "إيه كي إم",
    type: "AR",
    damage: 47,
    recoil: 62,
    speed: 61,
    range: 60,
    image: "",
    bestAttachments: {
      muzzle: "compensator",
      magazine: "ext-quickdraw",
      scope: "red-dot",
    },
  },
  {
    id: "scar-l",
    nameEn: "SCAR-L",
    nameAr: "سكار ليت",
    type: "AR",
    damage: 41,
    recoil: 35,
    speed: 71,
    range: 55,
    image: "",
    bestAttachments: {
      muzzle: "compensator",
      grip: "angled-grip",
      magazine: "ext-quickdraw",
      scope: "scope-4x",
    },
  },
  {
    id: "m16a4",
    nameEn: "M16A4",
    nameAr: "إم 16 أيه 4",
    type: "AR",
    damage: 43,
    recoil: 40,
    speed: 65,
    range: 62,
    image: "",
  },
  {
    id: "aug",
    nameEn: "AUG",
    nameAr: "أوج",
    type: "AR",
    damage: 41,
    recoil: 30,
    speed: 80,
    range: 58,
    image: "",
    bestAttachments: {
      muzzle: "compensator",
      grip: "vertical-grip",
      magazine: "ext-quickdraw",
      scope: "scope-4x",
    },
  },
  {
    id: "groza",
    nameEn: "Groza",
    nameAr: "غروزا",
    type: "AR",
    damage: 47,
    recoil: 55,
    speed: 85,
    range: 55,
    image: "",
    bestAttachments: {
      muzzle: "suppressor",
      magazine: "ext-quickdraw",
      scope: "red-dot",
    },
  },
  {
    id: "beryl-m762",
    nameEn: "Beryl M762",
    nameAr: "بيريل إم 762",
    type: "AR",
    damage: 44,
    recoil: 68,
    speed: 75,
    range: 58,
    image: "",
    bestAttachments: {
      muzzle: "compensator",
      grip: "vertical-grip",
      magazine: "ext-quickdraw",
      scope: "scope-6x",
    },
  },
  {
    id: "g36c",
    nameEn: "G36C",
    nameAr: "جي 36 سي",
    type: "AR",
    damage: 41,
    recoil: 34,
    speed: 70,
    range: 55,
    image: "",
  },
  {
    id: "mk47",
    nameEn: "Mk47 Mutant",
    nameAr: "إم كي 47 ميوتنت",
    type: "AR",
    damage: 49,
    recoil: 52,
    speed: 60,
    range: 65,
    image: "",
  },
  {
    id: "qbz",
    nameEn: "QBZ",
    nameAr: "كيو بي زد",
    type: "AR",
    damage: 41,
    recoil: 33,
    speed: 72,
    range: 55,
    image: "",
  },
  {
    id: "famas",
    nameEn: "FAMAS",
    nameAr: "فاماس",
    type: "AR",
    damage: 38,
    recoil: 38,
    speed: 90,
    range: 45,
    image: "",
  },
  {
    id: "honey-badger",
    nameEn: "Honey Badger",
    nameAr: "هاني بادجر",
    type: "AR",
    damage: 43,
    recoil: 50,
    speed: 72,
    range: 50,
    image: "",
  },

  // Sniper Rifles
  {
    id: "awm",
    nameEn: "AWM",
    nameAr: "أي دبليو إم",
    type: "Sniper",
    damage: 100,
    recoil: 85,
    speed: 10,
    range: 100,
    image: "",
    bestAttachments: {
      muzzle: "suppressor",
      magazine: "ext-quickdraw",
      scope: "scope-8x",
    },
  },
  {
    id: "m24",
    nameEn: "M24",
    nameAr: "إم 24",
    type: "Sniper",
    damage: 79,
    recoil: 75,
    speed: 15,
    range: 92,
    image: "",
    bestAttachments: {
      muzzle: "suppressor",
      magazine: "ext-quickdraw",
      scope: "scope-8x",
    },
  },
  {
    id: "kar98k",
    nameEn: "Kar98k",
    nameAr: "كار 98 كي",
    type: "Sniper",
    damage: 75,
    recoil: 70,
    speed: 12,
    range: 88,
    image: "",
    bestAttachments: {
      scope: "scope-8x",
    },
  },
  {
    id: "win94",
    nameEn: "Win94",
    nameAr: "وين 94",
    type: "Sniper",
    damage: 66,
    recoil: 60,
    speed: 20,
    range: 70,
    image: "",
  },
  {
    id: "mosin-nagant",
    nameEn: "Mosin-Nagant",
    nameAr: "موزين ناغانت",
    type: "Sniper",
    damage: 75,
    recoil: 70,
    speed: 12,
    range: 88,
    image: "",
  },
  {
    id: "amr",
    nameEn: "AMR",
    nameAr: "إيه إم آر",
    type: "Sniper",
    damage: 110,
    recoil: 95,
    speed: 8,
    range: 100,
    image: "",
  },

  // DMR
  {
    id: "sks",
    nameEn: "SKS",
    nameAr: "إس كي إس",
    type: "DMR",
    damage: 53,
    recoil: 55,
    speed: 40,
    range: 72,
    image: "",
    bestAttachments: {
      muzzle: "compensator",
      grip: "vertical-grip",
      magazine: "ext-quickdraw",
      scope: "scope-6x",
    },
  },
  {
    id: "mini14",
    nameEn: "Mini14",
    nameAr: "ميني 14",
    type: "DMR",
    damage: 46,
    recoil: 30,
    speed: 55,
    range: 78,
    image: "",
    bestAttachments: {
      muzzle: "compensator",
      magazine: "ext-quickdraw",
      scope: "scope-6x",
    },
  },
  {
    id: "mk14",
    nameEn: "Mk14",
    nameAr: "إم كي 14",
    type: "DMR",
    damage: 61,
    recoil: 80,
    speed: 70,
    range: 80,
    image: "",
    bestAttachments: {
      muzzle: "compensator",
      grip: "vertical-grip",
      magazine: "ext-quickdraw",
      scope: "scope-6x",
    },
  },
  {
    id: "slr",
    nameEn: "SLR",
    nameAr: "إس إل آر",
    type: "DMR",
    damage: 58,
    recoil: 65,
    speed: 45,
    range: 75,
    image: "",
    bestAttachments: {
      muzzle: "compensator",
      magazine: "ext-quickdraw",
      scope: "scope-6x",
    },
  },
  {
    id: "vss",
    nameEn: "VSS",
    nameAr: "في إس إس",
    type: "DMR",
    damage: 41,
    recoil: 25,
    speed: 65,
    range: 35,
    image: "",
  },
  {
    id: "qbu",
    nameEn: "QBU",
    nameAr: "كيو بي يو",
    type: "DMR",
    damage: 48,
    recoil: 35,
    speed: 50,
    range: 75,
    image: "",
  },
  {
    id: "mk12",
    nameEn: "Mk12",
    nameAr: "إم كي 12",
    type: "DMR",
    damage: 48,
    recoil: 32,
    speed: 52,
    range: 76,
    image: "",
  },

  // SMG
  {
    id: "uzi",
    nameEn: "UZI",
    nameAr: "يوزي",
    type: "SMG",
    damage: 26,
    recoil: 20,
    speed: 95,
    range: 20,
    image: "",
  },
  {
    id: "ump45",
    nameEn: "UMP45",
    nameAr: "يو إم بي 45",
    type: "SMG",
    damage: 41,
    recoil: 28,
    speed: 70,
    range: 30,
    image: "",
    bestAttachments: {
      muzzle: "suppressor",
      grip: "vertical-grip",
      magazine: "ext-quickdraw",
      scope: "scope-3x",
    },
  },
  {
    id: "vector",
    nameEn: "Vector",
    nameAr: "فيكتور",
    type: "SMG",
    damage: 31,
    recoil: 22,
    speed: 92,
    range: 25,
    image: "",
    bestAttachments: {
      muzzle: "compensator",
      grip: "vertical-grip",
      magazine: "ext-quickdraw",
      stock: "tactical-stock",
      scope: "red-dot",
    },
  },
  {
    id: "thompson",
    nameEn: "Thompson",
    nameAr: "تومسون",
    type: "SMG",
    damage: 40,
    recoil: 35,
    speed: 68,
    range: 28,
    image: "",
  },
  {
    id: "bizon",
    nameEn: "PP-19 Bizon",
    nameAr: "بيزون",
    type: "SMG",
    damage: 35,
    recoil: 25,
    speed: 75,
    range: 32,
    image: "",
  },
  {
    id: "mp5k",
    nameEn: "MP5K",
    nameAr: "إم بي 5 كي",
    type: "SMG",
    damage: 33,
    recoil: 24,
    speed: 85,
    range: 30,
    image: "",
  },
  {
    id: "p90",
    nameEn: "P90",
    nameAr: "بي 90",
    type: "SMG",
    damage: 30,
    recoil: 25,
    speed: 90,
    range: 35,
    image: "",
  },

  // Shotguns
  {
    id: "s12k",
    nameEn: "S12K",
    nameAr: "إس 12 كي",
    type: "Shotgun",
    damage: 90,
    recoil: 70,
    speed: 40,
    range: 12,
    image: "",
  },
  {
    id: "s686",
    nameEn: "S686",
    nameAr: "إس 686 (دبل)",
    type: "Shotgun",
    damage: 98,
    recoil: 50,
    speed: 20,
    range: 10,
    image: "",
  },
  {
    id: "s1897",
    nameEn: "S1897",
    nameAr: "إس 1897 (بمب آكشن)",
    type: "Shotgun",
    damage: 95,
    recoil: 60,
    speed: 15,
    range: 12,
    image: "",
  },
  {
    id: "dbs",
    nameEn: "DBS",
    nameAr: "دي بي إس",
    type: "Shotgun",
    damage: 95,
    recoil: 60,
    speed: 35,
    range: 15,
    image: "",
  },
  {
    id: "m1014",
    nameEn: "M1014",
    nameAr: "إم 1014",
    type: "Shotgun",
    damage: 92,
    recoil: 65,
    speed: 30,
    range: 14,
    image: "",
  },

  // LMG
  {
    id: "dp28",
    nameEn: "DP-28",
    nameAr: "دي بي 28 (الطاسة)",
    type: "LMG",
    damage: 51,
    recoil: 45,
    speed: 48,
    range: 55,
    image: "",
  },
  {
    id: "m249",
    nameEn: "M249",
    nameAr: "إم 249 (البي كي سي)",
    type: "LMG",
    damage: 45,
    recoil: 55,
    speed: 82,
    range: 50,
    image: "",
  },
  {
    id: "mg3",
    nameEn: "MG3",
    nameAr: "إم جي 3",
    type: "LMG",
    damage: 40,
    recoil: 50,
    speed: 99,
    range: 45,
    image: "",
  },
];

export const getWeaponSmartAnalysis = (weapon: Weapon) => {
  const { nameAr, type, damage, recoil, speed, range } = weapon;

  let closeRange = "";
  let longRange = "";

  if (type === "SMG") {
    closeRange = `يتفوق ${nameAr} في المواجهات القريبة بسبب سرعة الإطلاق العالية وسهولة التحكم وثباته الجيد.`;
    longRange = `أداء ${nameAr} في المواجهات البعيدة محدود نسبيًا، ويُفضّل استخدامه في المسافات القريبة إلى المتوسطة.`;
  } else if (type === "Shotgun") {
    closeRange = `يُعد ${nameAr} من أقوى الخيارات في المواجهات القريبة بفضل الضرر العالي جدًا وقدرته على الحسم السريع.`;
    longRange = `أداء ${nameAr} ضعيف في المواجهات البعيدة لأن فعاليته تنخفض بشكل كبير مع زيادة المسافة.`;
  } else if (type === "Sniper") {
    closeRange = `لا يُعد ${nameAr} الخيار الأفضل في المواجهات القريبة بسبب بطء الإطلاق واعتماده على الدقة.`;
    longRange = `يتميز ${nameAr} في المواجهات البعيدة بفضل الضرر العالي والمدى الفعال وقدرته على الحسم من مسافات طويلة.`;
  } else if (type === "DMR") {
    if (recoil <= 35 && range >= 75) {
      closeRange = `يقدم ${nameAr} أداءً مقبولًا في المواجهات القريبة عند الاستخدام السريع، لكنه ليس الخيار الأمثل أمام الأسلحة السريعة.`;
      longRange = `يُعد ${nameAr} خيارًا ممتازًا للمواجهات البعيدة بسبب الثبات الجيد والمدى الفعال العالي.`;
    } else {
      closeRange = `أداء ${nameAr} في المواجهات القريبة متوسط ويعتمد على دقة اللاعب وسرعة التصويب.`;
      longRange = `يتميز ${nameAr} في المواجهات البعيدة بفضل قوته الجيدة، لكنه يحتاج إلى تحكم أفضل بسبب الارتداد الأعلى.`;
    }
  } else if (type === "LMG") {
    if (speed >= 80) {
      closeRange = `يتفوق ${nameAr} في المواجهات القريبة إلى المتوسطة بفضل كثافة النيران وسعة الذخيرة العالية.`;
    } else {
      closeRange = `يقدم ${nameAr} أداءً قويًا في المواجهات القريبة والمتوسطة بفضل الضرر الجيد وسعة المخزن.`;
    }
    if (recoil <= 45 && range >= 55) {
      longRange = `يقدم ${nameAr} أداءً جيدًا في المواجهات البعيدة نسبيًا عند التحكم بالارتداد بشكل مناسب.`;
    } else {
      longRange = `أداء ${nameAr} في المواجهات البعيدة متوسط، لأن الارتداد العالي يقلل من دقته مع المسافات الطويلة.`;
    }
  } else if (type === "AR") {
    if (damage >= 45 && recoil >= 55) {
      closeRange = `يتفوق ${nameAr} في المواجهات القريبة بسبب الضرر العالي وقدرته على إسقاط الخصم بسرعة.`;
      longRange = `أداء ${nameAr} في المواجهات البعيدة أضعف نسبيًا بسبب الارتداد المرتفع، لذلك يحتاج إلى تحكم جيد للاستفادة منه.`;
    } else if (recoil <= 35 && range >= 55 && speed >= 70) {
      closeRange = `يقدم ${nameAr} أداءً ممتازًا في المواجهات القريبة بفضل توازنه بين السرعة والثبات وسهولة التحكم.`;
      longRange = `يُعد ${nameAr} من الخيارات الممتازة للمواجهات البعيدة بسبب ثبات الارتداد وسهولة التحكم والمدى الجيد.`;
    } else {
      closeRange = `يقدم ${nameAr} أداءً جيدًا في المواجهات القريبة والمتوسطة حسب أسلوب اللعب والتحكم.`;
      longRange = `أداء ${nameAr} في المواجهات البعيدة متوسط ويعتمد على دقة اللاعب وقدرته على التحكم بالارتداد.`;
    }
  } else {
    closeRange = `يقدم ${nameAr} أداءً متغيرًا في المواجهات القريبة حسب خصائصه وطريقة استخدامه.`;
    longRange = `أداء ${nameAr} في المواجهات البعيدة يعتمد على مدى السلاح وثباته وخصائصه العامة.`;
  }

  return {
    closeRange,
    longRange,
  };
};

export const ATTACHMENTS: Attachment[] = [
  {
    id: "compensator",
    name: "Compensator",
    arabicName: "المعوض (Compensator)",
    type: "muzzle",
    effect: "تقليل الارتداد الأفقي والرأسي",
    description:
      "أفضل قطعة لتقليل الارتداد بشكل كبير، خاصة عند إطلاق النار بشكل مستمر (Spray).",
    image: "",
  },
  {
    id: "suppressor",
    name: "Suppressor",
    arabicName: "كاتم الصوت (Suppressor)",
    type: "muzzle",
    effect: "إخفاء وميض السلاح وتقليل الصوت",
    description:
      "يقلل من ضوضاء السلاح ويخفي الوميض، مما يجعل من الصعب على الأعداء تحديد موقعك.",
    image: "",
  },
  {
    id: "vertical-grip",
    name: "Vertical Foregrip",
    arabicName: "المقبض الرأسي (Vertical Grip)",
    type: "grip",
    effect: "تقليل الارتداد الرأسي بنسبة 15%",
    description:
      "مثالي للأسلحة ذات الارتداد الرأسي العالي مثل M416 و Beryl M762.",
    image: "",
  },
  {
    id: "angled-grip",
    name: "Angled Foregrip",
    arabicName: "المقبض المائل (Angled Grip)",
    type: "grip",
    effect: "تقليل الارتداد الأفقي وزيادة سرعة الـ ADS",
    description:
      "يساعد في التحكم في اهتزاز السلاح يميناً ويساراً ويسرع من عملية فتح السكوب.",
    image: "",
  },
  {
    id: "ext-quickdraw",
    name: "Extended Quickdraw Mag",
    arabicName: "مخزن ذخيرة موسع وسريع",
    type: "magazine",
    effect: "زيادة سعة الذخيرة وتقليل وقت إعادة التلقيم",
    description:
      "القطعة الأهم في المواجهات المباشرة، تمنحك طلقات أكثر ووقت تلقيم أقل.",
    image: "",
  },
  {
    id: "tactical-stock",
    name: "Tactical Stock",
    arabicName: "المسند التكتيكي (Stock)",
    type: "stock",
    effect: "تحسين ثبات السلاح وتقليل الاهتزاز",
    description:
      "قطعة أساسية لسلاح M416، تقلل من وقت استعادة السلاح لوضعه الطبيعي بعد الإطلاق.",
    image: "",
  },
  {
    id: "scope-4x",
    name: "4x ACOG Scope",
    arabicName: "منظار 4x (Scope)",
    type: "scope",
    effect: "تكبير 4 مرات مع علامات تصويب دقيقة",
    description:
      "السكوب الأكثر توازناً للمسافات المتوسطة، يوفر رؤية واضحة وتحكم جيد.",
    image: "",
  },
  {
    id: "scope-6x",
    name: "6x Scope",
    arabicName: "منظار 6x (Scope)",
    type: "scope",
    effect: "تكبير قابل للتعديل من 3x إلى 6x",
    description:
      "المفضل للاعبي الـ M416، يمكن تقليله لـ 3x لثبات خارق في الرش من مسافات بعيدة.",
    image: "",
  },
  {
    id: "red-dot",
    name: "Red Dot Sight",
    arabicName: "نقطة التصويب الحمراء (Red Dot)",
    type: "scope",
    effect: "تحسين دقة التصويب القريب",
    description: "يوفر نقطة تصويب واضحة للمواجهات القريبة والمتوسطة.",
    image: "",
  },
];

export const CHARACTERS: Character[] = [
  {
    id: "victor",
    name: "Victor",
    arabicName: "فيكتور",
    ability: "تقليل وقت إعادة تلقيم SMG",
    description:
      "خبير في الأسلحة الرشاشة، يقلل من وقت إعادة تلقيم أسلحة الـ SMG بنسبة تصل إلى 10% عند وصوله للمستوى الأقصى.",
    image: "",
    levelMaxBonus: "10%",
  },
  {
    id: "sara",
    name: "Sara",
    arabicName: "سارة",
    ability: "تعزيز متانة المركبات",
    description:
      "خبيرة في آليات المركبات، تقلل من الضرر الذي تتعرض له المركبات أثناء قيادتها أو ركوبها بنسبة تصل إلى 10%.",
    image: "",
    levelMaxBonus: "10%",
  },
  {
    id: "carlo",
    name: "Carlo",
    arabicName: "كارلو",
    ability: "تقليل ضرر السقوط",
    description:
      "يتمتع بمهارات بهلوانية فائقة، مما يقلل من الضرر الناتج عن السقوط من المرتفعات بنسبة تصل إلى 24%.",
    image: "",
    levelMaxBonus: "24%",
  },
  {
    id: "andy",
    name: "Andy",
    arabicName: "أندي",
    ability: "سرعة التعامل مع السلاح",
    description:
      "سيد في فنون الخفة، يزيد من سرعة سحب ووضع الأسلحة (Draw/Holster) بنسبة تصل إلى 16%.",
    image: "",
    levelMaxBonus: "16%",
  },
  {
    id: "riley",
    name: "Riley",
    arabicName: "رايلي",
    ability: "تقليل ضرر الانفجارات",
    description:
      "متخصص في العمليات الدفاعية، يقلل من الضرر الناتج عن الانفجارات (القنابل، الـ RPG) بنسبة تصل إلى 10%.",
    image: "",
    levelMaxBonus: "10%",
  },
  {
    id: "sophia",
    name: "Sophia",
    arabicName: "صوفيا",
    ability: "سرعة استخدام العلاج",
    description:
      "تمتلك مهارات طبية ميدانية، تقلل من الوقت المستغرق لاستخدام أدوات العلاج (الضمادات، الحقائب) بنسبة تصل إلى 10%.",
    image: "",
    levelMaxBonus: "10%",
  },
  {
    id: "lorenzo",
    name: "Lorenzo",
    arabicName: "لورينزو",
    ability: "حماية متانة الدروع",
    description:
      "خبير في الدروع الواقية، يقلل من سرعة استهلاك متانة الدروع (الخوذة والسترة) بنسبة تصل إلى 10%.",
    image: "",
    levelMaxBonus: "10%",
  },
  {
    id: "laith",
    name: "Laith",
    arabicName: "ليث",
    ability: "سرعة الحركة بعد التسلق",
    description:
      "يتميز بخفة الحركة، يزيد من سرعة الحركة لفترة قصيرة بعد تسلق الحواجز أو القفز من النوافذ.",
    image: "",
    levelMaxBonus: "نشط",
  },
  {
    id: "emilia",
    name: "Emilia",
    arabicName: "إميليا",
    ability: "تعزيز متانة المعدات",
    description:
      "مهندسة بارعة، تزيد من متانة الدروع والمعدات التي ترتديها بنسبة تصل إلى 10%.",
    image: "",
    levelMaxBonus: "10%",
  },
];

export const DEVICES: Device[] = [
  // Apple - iPhones
  {
    id: "iphone-17-pro-max",
    name: "iPhone 17 Pro Max",
    brand: "Apple",
    code: "7153-3826-4935-9281-117",
    settings: {
      camera: { noScope: 125, redDot: 62, scope2x: 38, scope3x: 28, scope4x: 18, scope6x: 15, scope8x: 13 },
      ads:    { noScope: 125, redDot: 62, scope2x: 38, scope3x: 28, scope4x: 18, scope6x: 15, scope8x: 13 },
      gyroscope: { noScope: 400, redDot: 400, scope2x: 300, scope3x: 280, scope4x: 230, scope6x: 160, scope8x: 110 },
    },
  },
  {
    id: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    brand: "Apple",
    code: "7153-3826-4935-9281-116",
    settings: {
      camera: { noScope: 122, redDot: 61, scope2x: 37, scope3x: 27, scope4x: 17, scope6x: 14, scope8x: 12 },
      ads:    { noScope: 122, redDot: 61, scope2x: 37, scope3x: 27, scope4x: 17, scope6x: 14, scope8x: 12 },
      gyroscope: { noScope: 380, redDot: 380, scope2x: 280, scope3x: 260, scope4x: 210, scope6x: 150, scope8x: 100 },
    },
  },
  {
    id: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    code: "7153-3826-4935-9281-101",
    screenSize: "6.7",
    useGyroscope: true,
    playStyle: "Rusher",
    settings: {
      camera: { noScope: 120, redDot: 60, scope2x: 36, scope3x: 27, scope4x: 17, scope6x: 14, scope8x: 12 },
      ads:    { noScope: 120, redDot: 60, scope2x: 36, scope3x: 27, scope4x: 17, scope6x: 14, scope8x: 12 },
      gyroscope: { noScope: 350, redDot: 350, scope2x: 260, scope3x: 240, scope4x: 190, scope6x: 130, scope8x: 90 },
    },
  },
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    brand: "Apple",
    code: "7153-3826-4935-9281-151",
    settings: {
      camera: { noScope: 118, redDot: 58, scope2x: 34, scope3x: 26, scope4x: 16, scope6x: 13, scope8x: 11 },
      ads:    { noScope: 118, redDot: 58, scope2x: 34, scope3x: 26, scope4x: 16, scope6x: 13, scope8x: 11 },
      gyroscope: { noScope: 340, redDot: 340, scope2x: 250, scope3x: 230, scope4x: 180, scope6x: 120, scope8x: 85 },
    },
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    brand: "Apple",
    code: "7153-3826-4935-9281-150",
    settings: {
      camera: { noScope: 115, redDot: 55, scope2x: 32, scope3x: 24, scope4x: 15, scope6x: 12, scope8x: 10 },
      ads:    { noScope: 115, redDot: 55, scope2x: 32, scope3x: 24, scope4x: 15, scope6x: 12, scope8x: 10 },
      gyroscope: { noScope: 320, redDot: 320, scope2x: 240, scope3x: 220, scope4x: 170, scope6x: 110, scope8x: 80 },
    },
  },
  {
    id: "iphone-14-pro-max",
    name: "iPhone 14 Pro Max",
    brand: "Apple",
    code: "7153-3826-4935-9281-114",
    settings: {
      camera: { noScope: 118, redDot: 58, scope2x: 34, scope3x: 26, scope4x: 16, scope6x: 13, scope8x: 11 },
      ads:    { noScope: 118, redDot: 58, scope2x: 34, scope3x: 26, scope4x: 16, scope6x: 13, scope8x: 11 },
      gyroscope: { noScope: 290, redDot: 290, scope2x: 240, scope3x: 210, scope4x: 170, scope6x: 110, scope8x: 75 },
    },
  },
  {
    id: "iphone-14",
    name: "iPhone 14",
    brand: "Apple",
    code: "7153-3826-4935-9281-140",
    settings: {
      camera: { noScope: 112, redDot: 52, scope2x: 30, scope3x: 22, scope4x: 14, scope6x: 11, scope8x: 9 },
      ads:    { noScope: 112, redDot: 52, scope2x: 30, scope3x: 22, scope4x: 14, scope6x: 11, scope8x: 9 },
      gyroscope: { noScope: 280, redDot: 280, scope2x: 230, scope3x: 200, scope4x: 160, scope6x: 100, scope8x: 70 },
    },
  },
  {
    id: "iphone-13-pro-max",
    name: "iPhone 13 Pro Max",
    brand: "Apple",
    code: "7153-3826-4935-9281-113",
    settings: {
      camera: { noScope: 115, redDot: 55, scope2x: 32, scope3x: 24, scope4x: 15, scope6x: 12, scope8x: 10 },
      ads:    { noScope: 115, redDot: 55, scope2x: 32, scope3x: 24, scope4x: 15, scope6x: 12, scope8x: 10 },
      gyroscope: { noScope: 280, redDot: 280, scope2x: 230, scope3x: 200, scope4x: 160, scope6x: 100, scope8x: 70 },
    },
  },
  {
    id: "iphone-13",
    name: "iPhone 13",
    brand: "Apple",
    code: "7153-3826-4935-9281-130",
    settings: {
      camera: { noScope: 110, redDot: 50, scope2x: 30, scope3x: 22, scope4x: 14, scope6x: 11, scope8x: 9 },
      ads:    { noScope: 110, redDot: 50, scope2x: 30, scope3x: 22, scope4x: 14, scope6x: 11, scope8x: 9 },
      gyroscope: { noScope: 270, redDot: 270, scope2x: 220, scope3x: 190, scope4x: 150, scope6x: 90, scope8x: 65 },
    },
  },
  {
    id: "iphone-12-pro-max",
    name: "iPhone 12 Pro Max",
    brand: "Apple",
    code: "7153-3826-4935-9281-112",
    settings: {
      camera: { noScope: 112, redDot: 52, scope2x: 30, scope3x: 22, scope4x: 14, scope6x: 11, scope8x: 9 },
      ads:    { noScope: 112, redDot: 52, scope2x: 30, scope3x: 22, scope4x: 14, scope6x: 11, scope8x: 9 },
      gyroscope: { noScope: 270, redDot: 270, scope2x: 220, scope3x: 190, scope4x: 150, scope6x: 90, scope8x: 65 },
    },
  },
  {
    id: "iphone-11-pro-max",
    name: "iPhone 11 Pro Max",
    brand: "Apple",
    code: "7153-3826-4935-9281-111",
    settings: {
      camera: { noScope: 108, redDot: 48, scope2x: 28, scope3x: 20, scope4x: 12, scope6x: 10, scope8x: 8 },
      ads:    { noScope: 108, redDot: 48, scope2x: 28, scope3x: 20, scope4x: 12, scope6x: 10, scope8x: 8 },
      gyroscope: { noScope: 250, redDot: 250, scope2x: 200, scope3x: 180, scope4x: 140, scope6x: 80, scope8x: 60 },
    },
  },
  // Apple - iPads
  {
    id: "ipad-pro-m4",
    name: "iPad Pro M4 (13-inch)",
    brand: "Apple",
    code: "7153-3826-4935-9281-120",
    settings: {
      camera: { noScope: 105, redDot: 52, scope2x: 32, scope3x: 24, scope4x: 16, scope6x: 14, scope8x: 12 },
      ads:    { noScope: 105, redDot: 52, scope2x: 32, scope3x: 24, scope4x: 16, scope6x: 14, scope8x: 12 },
      gyroscope: { noScope: 350, redDot: 350, scope2x: 280, scope3x: 240, scope4x: 190, scope6x: 130, scope8x: 90 },
    },
  },
  {
    id: "ipad-pro-11-m4",
    name: "iPad Pro 11-inch (M4)",
    brand: "Apple",
    code: "7153-3826-4935-9281-124",
    settings: {
      camera: { noScope: 108, redDot: 54, scope2x: 34, scope3x: 26, scope4x: 18, scope6x: 16, scope8x: 14 },
      ads:    { noScope: 108, redDot: 54, scope2x: 34, scope3x: 26, scope4x: 18, scope6x: 16, scope8x: 14 },
      gyroscope: { noScope: 360, redDot: 360, scope2x: 290, scope3x: 250, scope4x: 200, scope6x: 140, scope8x: 100 },
    },
  },
  {
    id: "ipad-pro-m2",
    name: "iPad Pro M2 (12.9-inch)",
    brand: "Apple",
    code: "7153-3826-4935-9281-102",
    screenSize: "11.0",
    useGyroscope: false,
    playStyle: "Sniper",
    settings: {
      camera: { noScope: 100, redDot: 50, scope2x: 30, scope3x: 22, scope4x: 14, scope6x: 12, scope8x: 10 },
      ads:    { noScope: 100, redDot: 50, scope2x: 30, scope3x: 22, scope4x: 14, scope6x: 12, scope8x: 10 },
      gyroscope: { noScope: 280, redDot: 280, scope2x: 230, scope3x: 200, scope4x: 160, scope6x: 100, scope8x: 70 },
    },
  },
  {
    id: "ipad-pro-11-m2",
    name: "iPad Pro 11-inch (M2)",
    brand: "Apple",
    code: "7153-3826-4935-9281-125",
    settings: {
      camera: { noScope: 103, redDot: 52, scope2x: 32, scope3x: 24, scope4x: 16, scope6x: 14, scope8x: 12 },
      ads:    { noScope: 103, redDot: 52, scope2x: 32, scope3x: 24, scope4x: 16, scope6x: 14, scope8x: 12 },
      gyroscope: { noScope: 290, redDot: 290, scope2x: 240, scope3x: 210, scope4x: 170, scope6x: 110, scope8x: 80 },
    },
  },
  {
    id: "ipad-pro-11-m1",
    name: "iPad Pro 11-inch (M1)",
    brand: "Apple",
    code: "7153-3826-4935-9281-126",
    settings: {
      camera: { noScope: 105, redDot: 53, scope2x: 33, scope3x: 25, scope4x: 17, scope6x: 15, scope8x: 13 },
      ads:    { noScope: 105, redDot: 53, scope2x: 33, scope3x: 25, scope4x: 17, scope6x: 15, scope8x: 13 },
      gyroscope: { noScope: 300, redDot: 300, scope2x: 250, scope3x: 220, scope4x: 180, scope6x: 120, scope8x: 90 },
    },
  },
  {
    id: "ipad-air-m2",
    name: "iPad Air M2",
    brand: "Apple",
    code: "7153-3826-4935-9281-121",
    screenSize: "6.1",
    useGyroscope: true,
    playStyle: "Rusher",
    settings: {
      camera: { noScope: 102, redDot: 51, scope2x: 31, scope3x: 23, scope4x: 15, scope6x: 13, scope8x: 11 },
      ads:    { noScope: 102, redDot: 51, scope2x: 31, scope3x: 23, scope4x: 15, scope6x: 13, scope8x: 11 },
      gyroscope: { noScope: 285, redDot: 285, scope2x: 235, scope3x: 205, scope4x: 165, scope6x: 105, scope8x: 75 },
    },
  },
  {
    id: "ipad-air-5",
    name: "iPad Air (5th Gen)",
    brand: "Apple",
    code: "7153-3826-4935-9281-127",
    settings: {
      camera: { noScope: 100, redDot: 50, scope2x: 30, scope3x: 22, scope4x: 14, scope6x: 12, scope8x: 10 },
      ads:    { noScope: 100, redDot: 50, scope2x: 30, scope3x: 22, scope4x: 14, scope6x: 12, scope8x: 10 },
      gyroscope: { noScope: 280, redDot: 280, scope2x: 230, scope3x: 200, scope4x: 160, scope6x: 100, scope8x: 70 },
    },
  },
  {
    id: "ipad-10",
    name: "iPad (10th Gen)",
    brand: "Apple",
    code: "7153-3826-4935-9281-128",
    settings: {
      camera: { noScope: 95, redDot: 48, scope2x: 28, scope3x: 20, scope4x: 12, scope6x: 10, scope8x: 8 },
      ads:    { noScope: 95, redDot: 48, scope2x: 28, scope3x: 20, scope4x: 12, scope6x: 10, scope8x: 8 },
      gyroscope: { noScope: 260, redDot: 260, scope2x: 210, scope3x: 180, scope4x: 140, scope6x: 90, scope8x: 65 },
    },
  },
  {
    id: "ipad-mini-6",
    name: "iPad Mini 6",
    brand: "Apple",
    code: "7153-3826-4935-9281-122",
    settings: {
      camera: { noScope: 110, redDot: 55, scope2x: 33, scope3x: 25, scope4x: 17, scope6x: 15, scope8x: 13 },
      ads:    { noScope: 110, redDot: 55, scope2x: 33, scope3x: 25, scope4x: 17, scope6x: 15, scope8x: 13 },
      gyroscope: { noScope: 300, redDot: 300, scope2x: 250, scope3x: 220, scope4x: 180, scope6x: 120, scope8x: 85 },
    },
  },
  // Samsung
  {
    id: "samsung-s24-ultra",
    name: "Samsung S24 Ultra",
    brand: "Samsung",
    code: "7153-3826-4935-9281-103",
    screenSize: "6.8",
    useGyroscope: true,
    playStyle: "Rusher",
    settings: {
      camera: { noScope: 115, redDot: 55, scope2x: 33, scope3x: 25, scope4x: 15, scope6x: 13, scope8x: 11 },
      ads:    { noScope: 115, redDot: 55, scope2x: 33, scope3x: 25, scope4x: 15, scope6x: 13, scope8x: 11 },
      gyroscope: { noScope: 400, redDot: 400, scope2x: 320, scope3x: 280, scope4x: 230, scope6x: 160, scope8x: 110 },
    },
  },
  {
    id: "samsung-s23-ultra",
    name: "Samsung S23 Ultra",
    brand: "Samsung",
    code: "7153-3826-4935-9281-123",
    settings: {
      camera: { noScope: 112, redDot: 52, scope2x: 31, scope3x: 23, scope4x: 14, scope6x: 12, scope8x: 10 },
      ads:    { noScope: 112, redDot: 52, scope2x: 31, scope3x: 23, scope4x: 14, scope6x: 12, scope8x: 10 },
      gyroscope: { noScope: 310, redDot: 310, scope2x: 260, scope3x: 230, scope4x: 190, scope6x: 130, scope8x: 85 },
    },
  },
  {
    id: "samsung-z-fold-5",
    name: "Samsung Z Fold 5",
    brand: "Samsung",
    code: "7153-3826-4935-9281-124",
    settings: {
      camera: { noScope: 108, redDot: 50, scope2x: 30, scope3x: 22, scope4x: 14, scope6x: 12, scope8x: 10 },
      ads:    { noScope: 108, redDot: 50, scope2x: 30, scope3x: 22, scope4x: 14, scope6x: 12, scope8x: 10 },
      gyroscope: { noScope: 290, redDot: 290, scope2x: 240, scope3x: 210, scope4x: 170, scope6x: 110, scope8x: 80 },
    },
  },
  // RedMagic
  {
    id: "redmagic-9-pro",
    name: "Red Magic 9 Pro",
    brand: "RedMagic",
    code: "7153-3826-4935-9281-104",
    settings: {
      camera: { noScope: 130, redDot: 65, scope2x: 40, scope3x: 30, scope4x: 20, scope6x: 16, scope8x: 14 },
      ads:    { noScope: 130, redDot: 65, scope2x: 40, scope3x: 30, scope4x: 20, scope6x: 16, scope8x: 14 },
      gyroscope: { noScope: 400, redDot: 400, scope2x: 380, scope3x: 320, scope4x: 280, scope6x: 200, scope8x: 140 },
    },
  },
  {
    id: "redmagic-8-pro",
    name: "Red Magic 8 Pro",
    brand: "RedMagic",
    code: "7153-3826-4935-9281-125",
    settings: {
      camera: { noScope: 125, redDot: 62, scope2x: 38, scope3x: 28, scope4x: 18, scope6x: 15, scope8x: 13 },
      ads:    { noScope: 125, redDot: 62, scope2x: 38, scope3x: 28, scope4x: 18, scope6x: 15, scope8x: 13 },
      gyroscope: { noScope: 380, redDot: 380, scope2x: 330, scope3x: 280, scope4x: 230, scope6x: 160, scope8x: 110 },
    },
  },
  // Redmi
  {
    id: "redmi-note-13-pro",
    name: "Redmi Note 13 Pro",
    brand: "Redmi",
    code: "7153-3826-4935-9281-105",
    settings: {
      camera: { noScope: 110, redDot: 50, scope2x: 30, scope3x: 22, scope4x: 14, scope6x: 12, scope8x: 10 },
      ads:    { noScope: 110, redDot: 50, scope2x: 30, scope3x: 22, scope4x: 14, scope6x: 12, scope8x: 10 },
      gyroscope: { noScope: 300, redDot: 300, scope2x: 250, scope3x: 220, scope4x: 180, scope6x: 120, scope8x: 80 },
    },
  },
  {
    id: "redmi-k70-pro",
    name: "Redmi K70 Pro",
    brand: "Redmi",
    code: "7153-3826-4935-9281-126",
    settings: {
      camera: { noScope: 115, redDot: 55, scope2x: 33, scope3x: 25, scope4x: 15, scope6x: 13, scope8x: 11 },
      ads:    { noScope: 115, redDot: 55, scope2x: 33, scope3x: 25, scope4x: 15, scope6x: 13, scope8x: 11 },
      gyroscope: { noScope: 320, redDot: 320, scope2x: 270, scope3x: 240, scope4x: 200, scope6x: 140, scope8x: 90 },
    },
  },
];

export const PRO_PLAYERS: Device[] = [
  {
    id: "texen",
    name: "تكسن (Texen)",
    brand: "Pro Player",
    code: "7372-5069-7023-3882-723",
    image: "",
    screenSize: "6.7",
    useGyroscope: true,
    playStyle: "Rusher",
    settings: {
      camera: { noScope: 120, redDot: 60, scope2x: 36, scope3x: 27, scope4x: 17, scope6x: 14, scope8x: 12 },
      ads:    { noScope: 120, redDot: 60, scope2x: 36, scope3x: 27, scope4x: 17, scope6x: 14, scope8x: 12 },
      gyroscope: { noScope: 400, redDot: 400, scope2x: 350, scope3x: 300, scope4x: 250, scope6x: 200, scope8x: 150 },
    },
  },
  {
    id: "mohaisen",
    name: "محيسن (Mohaisen)",
    brand: "Pro Player",
    code: "7153-3826-4935-9281-339",
    image: "",
    screenSize: "6.7",
    useGyroscope: true,
    playStyle: "Sniper",
    settings: {
      camera: { noScope: 115, redDot: 55, scope2x: 33, scope3x: 25, scope4x: 15, scope6x: 13, scope8x: 11 },
      ads:    { noScope: 115, redDot: 55, scope2x: 33, scope3x: 25, scope4x: 15, scope6x: 13, scope8x: 11 },
      gyroscope: { noScope: 400, redDot: 400, scope2x: 320, scope3x: 280, scope4x: 220, scope6x: 160, scope8x: 100 },
    },
  },
  {
    id: "mohemeed",
    name: "محيميد (Mohemeed)",
    brand: "Pro Player",
    code: "7290-7521-2244-6725-783",
    image: "",
    settings: {
      camera: { noScope: 110, redDot: 50, scope2x: 30, scope3x: 22, scope4x: 14, scope6x: 12, scope8x: 10 },
      ads:    { noScope: 110, redDot: 50, scope2x: 30, scope3x: 22, scope4x: 14, scope6x: 12, scope8x: 10 },
      gyroscope: { noScope: 350, redDot: 350, scope2x: 300, scope3x: 250, scope4x: 200, scope6x: 150, scope8x: 90 },
    },
  },
  {
    id: "rara",
    name: "رارا (Rara)",
    brand: "Pro Player",
    code: "7372-5069-7023-3882-725",
    image: "",
    settings: {
      camera: { noScope: 120, redDot: 60, scope2x: 35, scope3x: 25, scope4x: 18, scope6x: 14, scope8x: 12 },
      ads:    { noScope: 120, redDot: 60, scope2x: 35, scope3x: 25, scope4x: 18, scope6x: 14, scope8x: 12 },
      gyroscope: { noScope: 300, redDot: 300, scope2x: 280, scope3x: 230, scope4x: 190, scope6x: 130, scope8x: 90 },
    },
  },
];