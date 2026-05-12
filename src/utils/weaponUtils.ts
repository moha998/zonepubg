export function calculateTTK(weapon: any): string {
  if (!weapon || !weapon.damage) return "0.00";
  // Base health is 100. Level 2 vest reduces damage by 40% (multiplier 0.6)
  const vestMultiplier = 0.6;
  const effectiveDamage = weapon.damage * vestMultiplier;
  const shotsToKill = Math.ceil(100 / effectiveDamage);

  // speed in constants is 0-100, let's map it to a realistic fire rate (RPM)
  // Most ARs are between 600-800 RPM.
  // RPM = 500 + (speed * 4)
  const speed = typeof weapon.speed === "number" ? weapon.speed : Number(String(weapon.speed).replace(/[^0-9.]/g, ""));
  const rpm = 500 + (speed || 50) * 4;
  const fireRatePerSecond = rpm / 60;
  const timeBetweenShots = 1 / fireRatePerSecond;

  // TTK = (Shots to kill - 1) * Time between shots
  const ttk = (shotsToKill - 1) * timeBetweenShots;
  return ttk.toFixed(3);
}

export function getWeaponValue(weapon: any, keys: string[], defaultValue: number) {
  for (const key of keys) {
    if (weapon?.[key] !== undefined) {
      const val = Number(String(weapon[key]).replace(/[^0-9.]/g, ""));
      return isNaN(val) ? defaultValue : val;
    }
  }
  return defaultValue;
}

export function getWeaponLabel(weapon: any, defaultName: string) {
  if (!weapon) return defaultName;
  return weapon.nameAr || weapon.nameEn || defaultName;
}

export const getWeaponProTip = (weapon: any): string => {
  if (!weapon) return "";
  
  if (weapon.type === "AR") {
    return `نصيحة الخبراء: يُفضل بيك (Peek) سريع واستخدام دمج الجيروسكوب لتقليل الارتداد الأفقي للـ ${weapon.nameEn}.`;
  } else if (weapon.type === "Sniper") {
    return `نصيحة الخبراء: سرعة رصاصة الـ ${weapon.nameEn} تتطلب منك التصويب قليلاً أعلى الهدف (Bullet Drop) في المسافات التي تتجاوز 250 متراً.`;
  } else if (weapon.type === "SMG") {
    return `نصيحة الخبراء: الـ ${weapon.nameEn} مدمر في الالتحامات (Hip-fire) فلا تضيع الوقت بفتح السكوب داخل الغرف.`;
  } else if (weapon.type === "Shotgun") {
    return `نصيحة الخبراء: حافظ على مسافة مترين إلى ثلاثة أمتار واضرب في منتصف الصدر لضمان دخول كل شظايا ${weapon.nameEn} في الخصم.`;
  } else if (weapon.type === "LMG") {
    return `نصيحة الخبراء: الانبطاح (Prone) أو الجلوس (Crouch) يقلل ارتداد ${weapon.nameEn} بنسبة تصل لـ 50%، مما يجعله مثالياً لتفجير السيارات.`;
  } else if (weapon.type === "DMR") {
    return `نصيحة الخبراء: اضبط فترة زمنية قصيرة جداً (نصف ثانية) بين الطقات بـ ${weapon.nameEn} ليتعافى الارتداد تلقائياً بدلاً من الإطلاق السريع العشوائي.`;
  }
  
  return `نصيحة الخبراء: تدرب في ساحة التجمع (Cheer Park) لمعرفة سلوك الارتداد الخاص بـ ${weapon.nameEn} قبل استخدامه في التقييم.`;
};

export function getTypeLabel(type: string): string {
  const map: Record<string, string> = {
    AR: "رشاش هجومي",
    SMG: "رشاش صغير",
    Sniper: "قنص",
    DMR: "رامية دقيقة",
    LMG: "رشاش ثقيل",
    Shotgun: "رمحة صيد",
  };
  return map[type] || type;
}

export function getTypeScenario(type: string): { closeWeight: number; longWeight: number; note: string } {
  switch (type) {
    case "Shotgun": return { closeWeight: 1.0, longWeight: 0.0, note: "فعال حصرًا في المسافات القصيرة جداً" };
    case "SMG":     return { closeWeight: 0.9, longWeight: 0.1, note: "متخصص للمواجهات القريبة والمتوسطة" };
    case "Sniper":  return { closeWeight: 0.0, longWeight: 1.0, note: "متخصص للمواجهات البعيدة جداً" };
    case "DMR":     return { closeWeight: 0.3, longWeight: 0.7, note: "أفضل في المتوسطة إلى البعيدة" };
    case "LMG":     return { closeWeight: 0.5, longWeight: 0.5, note: "متوازن بين المسافات" };
    default:        return { closeWeight: 0.6, longWeight: 0.4, note: "متوازن لجميع المسافات" }; // AR
  }
}

export interface ComparisonAdvice {
  closeRange: string;
  longRange: string;
  tabletAdvice: string;
  mobileAdvice: string;
  source: string;
  updatedAt: string;
  proTip?: string;
  ipad?: string;
  phone?: string;
}

export function buildComparisonAdvice(
  weapon1: any,
  weapon2: any,
  distance: number
): ComparisonAdvice {
  if (!weapon1 || !weapon2) {
    return {
      closeRange: "اختر سلاحين لعرض تحليل المواجهات القريبة.",
      longRange: "اختر سلاحين لعرض تحليل المواجهات البعيدة.",
      tabletAdvice: "سيتم عرض نصائح التابلت بعد اختيار السلاحين.",
      mobileAdvice: "سيتم عرض نصائح الجوال بعد اختيار السلاحين.",
      source: "Local Weapon Data",
      updatedAt: new Date().toLocaleString("ar-SA"),
    };
  }

  const n1  = getWeaponLabel(weapon1, "السلاح 1");
  const n2  = getWeaponLabel(weapon2, "السلاح 2");
  const id1 = (weapon1?.id || "").toLowerCase();
  const id2 = (weapon2?.id || "").toLowerCase();

  const db1 = {
    damage: getWeaponValue(weapon1, ["damage"], 40),
    recoil: getWeaponValue(weapon1, ["recoil"], 50),
    speed:  getWeaponValue(weapon1, ["speed"],  50),
    range:  getWeaponValue(weapon1, ["range"],  50),
    type:   weapon1?.type ?? "AR",
  };
  const db2 = {
    damage: getWeaponValue(weapon2, ["damage"], 40),
    recoil: getWeaponValue(weapon2, ["recoil"], 50),
    speed:  getWeaponValue(weapon2, ["speed"],  50),
    range:  getWeaponValue(weapon2, ["range"],  50),
    type:   weapon2?.type ?? "AR",
  };

  const d1 = db1.damage;  const d2 = db2.damage;
  const r1 = db1.recoil;  const r2 = db2.recoil;
  const s1 = db1.speed;   const s2 = db2.speed;
  const g1 = db1.range;   const g2 = db2.range;
  const t1 = db1.type;    const t2 = db2.type;
  
  const stab1 = 100 - r1; const stab2 = 100 - r2;

  const type1Label = getTypeLabel(t1);
  const type2Label = getTypeLabel(t2);
  const sc1 = getTypeScenario(t1);
  const sc2 = getTypeScenario(t2);

  const rawClose1 = d1 * 0.35 + s1 * 0.40 + stab1 * 0.25;
  const rawClose2 = d2 * 0.35 + s2 * 0.40 + stab2 * 0.25;
  const rawLong1  = d1 * 0.35 + stab1 * 0.35 + g1 * 0.30;
  const rawLong2  = d2 * 0.35 + stab2 * 0.35 + g2 * 0.30;

  const closeScore1 = rawClose1 * sc1.closeWeight + rawLong1 * (1 - sc1.closeWeight) * 0.2;
  const closeScore2 = rawClose2 * sc2.closeWeight + rawLong2 * (1 - sc2.closeWeight) * 0.2;
  const longScore1  = rawLong1  * sc1.longWeight  + rawClose1 * (1 - sc1.longWeight)  * 0.2;
  const longScore2  = rawLong2  * sc2.longWeight  + rawClose2 * (1 - sc2.longWeight)  * 0.2;

  const closeWin = closeScore1 > closeScore2 + 3 ? 1 : closeScore2 > closeScore1 + 3 ? 2 : 0;
  const longWin  = longScore1  > longScore2  + 3 ? 1 : longScore2  > longScore1  + 3 ? 2 : 0;

  const buildClose = (wi: 1 | 2): string => {
    const [wn, ln]              = wi === 1 ? [n1, n2]             : [n2, n1];
    const [wd, wr, ws, wg, wt]  = wi === 1 ? [d1, r1, s1, g1, t1] : [d2, r2, s2, g2, t2];
    const [ld, lr, ls, lg, lt]  = wi === 1 ? [d2, r2, s2, g2, t2] : [d1, r1, s1, g1, t1];
    const reasons: string[] = [];

    if (wt === "Shotgun" && lt !== "Shotgun") {
      reasons.push(`كونه رمحة صيد (ضرر ${wd}/100) يجعله الأفتك في المسافات القصيرة جداً — طلقة أو اثنتان كافيتان للإسقاط`);
    } else if (lt === "Sniper" && wt !== "Sniper") {
      reasons.push(`لأن ${ln} (قنص) بطيء الإطلاق (${ls}/100) مما يجعله في وضع ضعيف في الاشتباكات السريعة القريبة`);
    } else if (wt === "SMG" && (lt === "AR" || lt === "LMG")) {
      reasons.push(`كونه رشاشاً صغيراً بسرعة إطلاق عالية (${ws}/100) وارتداد منخفض (${wr}/100) مما يجعله مثالياً للاشتباكات السريعة`);
    } else {
      const dmgDiff = wd - ld;
      const spdDiff = ws - ls;
      const rcDiff  = lr - wr; 

      if (Math.abs(dmgDiff) >= 5) {
        if (dmgDiff > 0) reasons.push(`ضرره أعلى بفارق ${dmgDiff} نقطة (${wd} مقابل ${ld}) مما يقلل عدد الطلقات اللازمة للإسقاط`);
        else reasons.push(`رغم ضرره الأقل (${wd} مقابل ${ld})، يعوّض ذلك بسرعة إطلاق وثبات أعلى`);
      }
      if (spdDiff >= 6) {
        reasons.push(`سرعة إطلاقه أعلى بفارق ${spdDiff} نقطة (${ws} مقابل ${ls}) مما يزيد كثافة الرش ويقلل زمن الحسم`);
      }
      if (rcDiff >= 6) {
        reasons.push(`ارتداده أقل بفارق ${rcDiff} نقطة (${wr} مقابل ${lr}) مما يجعل السحب أسهل وأدق في الاشتباكات السريعة`);
      } else if (rcDiff <= -6) {
        reasons.push(`رغم ارتداده الأعلى (${wr} مقابل ${lr})، يتفوق بفضل مزيجه القوي من الضرر والسرعة`);
      }
    }

    const summary = reasons.length > 0
      ? reasons.join("، ")
      : `توازنه الأفضل في المواجهات القريبة (ضرر ${wd} | سرعة ${ws} | ارتداد ${wr})`;
    return `في المواجهات القريبة، ${wn} (${getTypeLabel(wt)}) يتفوق على ${ln} (${getTypeLabel(lt)}): ${summary}.`;
  };

  const buildLong = (wi: 1 | 2): string => {
    const [wn, ln]              = wi === 1 ? [n1, n2]             : [n2, n1];
    const [wd, wr, ws, wg, wt]  = wi === 1 ? [d1, r1, s1, g1, t1] : [d2, r2, s2, g2, t2];
    const [ld, lr, ls, lg, lt]  = wi === 1 ? [d2, r2, s2, g2, t2] : [d1, r1, s1, g1, t1];
    const reasons: string[] = [];

    if (wt === "Sniper" && lt !== "Sniper") {
      reasons.push(`كونه سلاح قنص (ضرر ${wd}/100 | مدى ${wg}/100) يجعله الخيار الأمثل على المسافات الطويلة — طلقة واحدة كافية للإسقاط في أغلب الأحيان`);
    } else if (lt === "Shotgun" && wt !== "Shotgun") {
      reasons.push(`لأن ${ln} (رمحة صيد) فعاليته تنعدم تقريباً على المسافات البعيدة (مدى ${lg}/100)`);
    } else if (wt === "DMR" && (lt === "AR" || lt === "SMG")) {
      reasons.push(`كونه رامية دقيقة (ضرر ${wd}/100 | مدى ${wg}/100) متخصصة للمسافات المتوسطة والبعيدة`);
    } else {
      const rngDiff = wg - lg;
      const rcDiff  = lr - wr; 
      const dmgDiff = wd - ld;

      if (rngDiff >= 5) {
        reasons.push(`مداه الفعال أكبر بفارق ${rngDiff} نقطة (${wg} مقابل ${lg}) مما يحافظ على فعالية الطلقات على المسافات البعيدة`);
      }
      if (rcDiff >= 6) {
        reasons.push(`ارتداده أقل بفارق ${rcDiff} نقطة (${wr} مقابل ${lr}) مما يجعل التربيل والرش على البعد أكثر دقة`);
      } else if (rcDiff <= -6) {
        reasons.push(`رغم ارتداده الأعلى (${wr} مقابل ${lr})، يتفوق بفضل ضرره ومداه الأكبر`);
      }
      if (Math.abs(dmgDiff) >= 5) {
        if (dmgDiff > 0) reasons.push(`ضرره أعلى (${wd} مقابل ${ld}) مما يقلل عدد الطلقات اللازمة لإسقاط الخصم من بعيد`);
      }
    }

    const summary = reasons.length > 0
      ? reasons.join("، ")
      : `تفوقه في الثبات (${stab1 > stab2 && wi === 1 ? stab1 : stab2}/100) والمدى (${wg}/100)`;
    return `في المواجهات البعيدة، ${wn} (${getTypeLabel(wt)}) يتفوق على ${ln} (${getTypeLabel(lt)}): ${summary}.`;
  };

  let closeRange: string;
  let longRange: string;

  if (closeWin === 1)      closeRange = buildClose(1);
  else if (closeWin === 2) closeRange = buildClose(2);
  else closeRange = `في المواجهات القريبة، ${n1} (${type1Label}) و${n2} (${type2Label}) متقاربان جداً — ${n1}: ضرر ${d1} | سرعة ${s1} | ارتداد ${r1} ، ${n2}: ضرر ${d2} | سرعة ${s2} | ارتداد ${r2}. الفارق يعتمد على أسلوب اللاعب وسرعة ردة فعله.`;

  if (longWin === 1)       longRange = buildLong(1);
  else if (longWin === 2)  longRange = buildLong(2);
  else longRange = `في المواجهات البعيدة، ${n1} (${type1Label}) و${n2} (${type2Label}) متقاربان — ${n1}: مدى ${g1} | ثبات ${stab1} | ضرر ${d1} ، ${n2}: مدى ${g2} | ثبات ${stab2} | ضرر ${d2}. الأفضلية تعتمد على السكوب والحساسية المستخدمة.`;

  if (distance <= 20) {
    closeRange += ` (المسافة ${distance}م — اشتباك مباشر جداً: الأولوية لسرعة الحسم والطلقة الأولى.)`;
  } else if (distance <= 50) {
    closeRange += ` (المسافة ${distance}م — متوسطة قريبة: كلا السلاحين فعالان، اختر بحسب أسلوبك.)`;
  } else if (distance <= 100) {
    longRange += ` (المسافة ${distance}م — متوسطة بعيدة: الثبات والمدى يصبحان أهم من سرعة الإطلاق.)`;
  } else {
    longRange += ` (المسافة ${distance}م — بعيدة جداً: الثبات والمدى الفعال هما العاملان الحاسمان.)`;
  }

  const recoilWinner = r1 < r2 ? n1 : r2 < r1 ? n2 : "السلاحان";
  const recoilLoser  = r1 < r2 ? n2 : r2 < r1 ? n1 : null;
  const minR = Math.min(r1, r2);
  const maxR = Math.max(r1, r2);
  const recoilGap = maxR - minR;

  const tabletAdvice = r1 === r2
    ? `على التابلت، ${n1} و${n2} متساويان في الارتداد (${r1}/100 لكليهما). يفضّل ضبط حساسية الكاميرا وADS بشكل متوازن للاستفادة من مساحة الشاشة الأكبر.`
    : `على التابلت، ${recoilWinner} أسهل في السحب والتحكم (ارتداد ${minR}/100) مقارنةً بـ${recoilLoser} (ارتداد ${maxR}/100) — الفارق ${recoilGap} نقطة. يمكنك رفع حساسية الجيروسكوب مع ${recoilWinner} للاستفادة من شاشة التابلت الواسعة.`;

  const mobileAdvice = r1 === r2
    ? `على الجوال، ${n1} و${n2} متساويان في الارتداد (${r1}/100 لكليهما). يفضّل تجربة حساسية مستقرة دون مبالغة في الرفع.`
    : `على الجوال، ${recoilWinner} (ارتداد ${minR}/100) أنسب وأسهل في التحكم بفارق ${recoilGap} نقطة. إذا استخدمت ${recoilLoser} (ارتداد ${maxR}/100) فقلل الحساسية قليلًا لتعويض الاهتزاز الأعلى أثناء الرش.`;

  let proTip = "نصيحة الخبراء: ركز دائماً على توظيف فئة السلاح في مكانها الصحيح، واتخذ السواتر الجيدة.";
  
  if (t1 === t2) {
    proTip = `نصيحة الخبراء: بما أن السلاحين من نفس الفئة (${type1Label})، يُفضّل تزويد السلاح ذي الارتداد الأقل (${recoilWinner}) بمنظار عالي (مثلاً 4x أو 6x) للمواجهات المتوسطة والبعيدة، وترك الآخر للمواجهات القريبة بمنظار نقطة حمراء (Red Dot).`;
  } else if (
    (t1 === "Sniper" && ["AR", "SMG"].includes(t2)) || 
    (t2 === "Sniper" && ["AR", "SMG"].includes(t1))
  ) {
    const sniperW = t1 === "Sniper" ? n1 : n2;
    const autoW = t1 === "Sniper" ? n2 : n1;
    proTip = `نصيحة الخبراء: تشكيلة قوية! احتفظ بـ ${autoW} للتمشيط والاقتحامات السريعة، واستخدم ${sniperW} مع منظار 8x للصيد الدقيق عن بُعد لاقتناص الأعداء بطلقة واحدة.`;
  } else if (
    (t1 === "Shotgun" && ["AR", "SMG", "LMG"].includes(t2)) || 
    (t2 === "Shotgun" && ["AR", "SMG", "LMG"].includes(t1))
  ) {
    const sg = t1 === "Shotgun" ? n1 : n2;
    const other = t1 === "Shotgun" ? n2 : n1;
    proTip = `نصيحة الخبراء: اجعل ${sg} سلاحك السري داخل المباني والأزقة الضيقة للإسقاط الفوري، بينما تعتمد على ${other} للمسافات المفتوحة التي تتخطى 15 متراً.`;
  }
  
  const ipadAdvice =
    r1 > r2
      ? `لمستخدمي الـ iPad: الـ ${n2} أفضل للتحكم بسبب مساحة الشاشة الكبيرة التي تساعد في سحب الارتداد، لكن الـ ${n1} يحتاج حساسية جيروسكوب عالية.`
      : `لمستخدمي الـ iPad: الـ ${n1} هو الخيار الأمثل للثبات على المسافات البعيدة بفضل شاشة الآيباد الواسعة.`;

  const phoneAdvice =
    r1 < r2
      ? `لمستخدمي الهواتف: الـ ${n1} أسهل بكثير في التحكم (Spray) نظراً لصغر مساحة السحب على الشاشة مقارنة بالـ ${n2}.`
      : `لمستخدمي الهواتف: الـ ${n2} يتطلب مهارة عالية في التحكم بالارتداد، ننصح باستخدام مقبض رأسي (Vertical Grip).`;


  return {
    closeRange,
    longRange,
    tabletAdvice,
    mobileAdvice,
    proTip,
    ipad: ipadAdvice,
    phone: phoneAdvice,
    source: "بيانات constants.ts الحقيقية",
    updatedAt: new Date().toLocaleString("ar-SA"),
  };
}
