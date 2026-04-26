import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Trophy,
  Star,
  Target,
  Crown,
  Megaphone,
  ArrowUpRight,
  Edit,
} from "lucide-react";
import { Ranking, Ad } from "../types";
import { doc, setDoc, deleteDoc, db } from "../firebase";

interface TopBannersProps {
  rankings: Ranking[];
  ads: Ad[];
  isAdmin?: boolean;
  competitionSettings?: any[];
}

export default function TopBanners({
  rankings,
  ads,
  isAdmin,
  competitionSettings,
}: TopBannersProps) {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const globalSetting = competitionSettings?.find((s) => s.id === "global");
  const isAdsEnabled = globalSetting?.isAdsTickerEnabled;

  const topRankings =
    rankings && rankings.length > 0
      ? [...rankings].sort((a, b) => a.rank - b.rank).slice(0, 3)
      : ([
          {
            id: "1",
            rank: 1,
            playerName: "مجهول",
            country: "السعودية",
            stats: "ملك الكيلات",
            updatedAt: new Date(),
          },
          {
            id: "2",
            rank: 2,
            playerName: "مجهول",
            country: "الإمارات",
            stats: "بطل القنص",
            updatedAt: new Date(),
          },
          {
            id: "3",
            rank: 3,
            playerName: "مجهول",
            country: "الكويت",
            stats: "تكتيك عالي",
            updatedAt: new Date(),
          },
        ] as Ranking[]);

  const handleEditPlayer = async (player: Ranking, rank: number) => {
    const newName = window.prompt(
      `أدخل اسم اللاعب للمركز ${rank}:`,
      player.playerName !== "مجهول" ? player.playerName : "",
    );
    if (newName === null) return;

    const newStats = window.prompt(
      `أدخل إحصائية وصفية (مثل ملك الكيلات):`,
      player.stats || "",
    );
    if (newStats === null) return;

    try {
      await setDoc(doc(db, "rankings", rank.toString()), {
        id: rank.toString(),
        rank: rank,
        playerName: newName || "مجهول",
        country: "الشرق الأوسط",
        stats: newStats || "",
        updatedAt: new Date(),
      });
      alert("تم التحديث بنجاح!");
    } catch (e) {
      alert("حدث خطأ أثناء التحديث");
    }
  };

  const handleToggleAds = async () => {
    try {
      await setDoc(
        doc(db, "competitionSettings", "global"),
        {
          isAdsTickerEnabled: !isAdsEnabled,
          updatedAt: new Date(),
        },
        { merge: true },
      );
      alert(
        !isAdsEnabled ? "تم تفعيل شريط الإعلانات" : "تم إخفاء شريط الإعلانات",
      );
    } catch (e) {
      alert("حدث خطأ أثناء تغيير حالة الشريط");
    }
  };

  const handleEditAd = async () => {
    const action = window.prompt(
      "اختر الإجراء: \n1 - إضافة إعلان جديد\n2 - حذف إعلان حالي\n(أدخل الرقم)",
    );
    if (action === "1") {
      const title = window.prompt("نص الإعلان أو الرابط:");
      if (!title) return;
      const url = window.prompt("رابط الإعلان (اختياري - اترك فارغ إذا لا يوجد):");

      const newAd = {
        id: Date.now().toString(),
        title,
        description: "",
        url: url || "",
        icon: "Megaphone",
        createdAt: new Date(),
        authorId: "admin",
      };

      try {
        await setDoc(doc(db, "ads", newAd.id), newAd);
        alert("تمت إضافة الإعلان!");
      } catch (e) {
        alert("حدث خطأ أثناء الإضافة");
      }
    } else if (action === "2") {
      if (!ads || ads.length === 0) {
        alert("لا يوجد إعلانات للحذف");
        return;
      }
      const adList = ads.map((a, i) => `${i + 1} - ${a.title}`).join("\n");
      const adIndexStr = window.prompt(
        `أدخل رقم الإعلان المراد حذفه:\n${adList}`,
      );
      if (!adIndexStr) return;
      const index = parseInt(adIndexStr) - 1;
      if (index >= 0 && index < ads.length) {
        try {
          await deleteDoc(doc(db, "ads", ads[index].id));
          alert("تم حذف الإعلان!");
        } catch (e) {
          alert("حدث خطأ أثناء الحذف");
        }
      }
    }
  };

  return (
    <div className="w-full mb-8 space-y-4 pt-2">
      {/* Real-time Rankings Marquee Block */}
      <div className="relative overflow-hidden bg-primary/10 border border-primary/20 rounded-2xl flex items-center h-12 shadow-[0_4px_15px_rgba(212,175,55,0.1)] group">
        <div className="absolute right-0 h-full bg-gradient-to-l from-black via-black/80 to-transparent w-32 z-10 pointer-events-none flex items-center pr-4">
           <div className="flex items-center gap-2 bg-black px-3 py-1 rounded-full border border-primary/30">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-black text-primary truncate max-w-[150px]">
              متصدرين سيرفر الشرق الاوسط
            </span>
          </div>
        </div>
        <div className="absolute left-0 h-full bg-gradient-to-r from-black via-black/80 to-transparent w-24 z-10 pointer-events-none" />

        <motion.div
           className="flex whitespace-nowrap items-center pr-64 pl-10"
          animate={{ x: ["100%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        >
          <div className="flex items-center gap-8">
            {topRankings.map((player) => (
              <div key={player.rank} className="flex items-center gap-2">
                <Crown
                  size={16}
                  className={
                    player.rank === 1 ? "text-primary" : "text-slate-400"
                  }
                />
                <strong
                  className={`font-black ${player.rank === 1 ? "text-primary" : "text-white"}`}
                >
                  المركز {player.rank}:
                </strong>
                <span className="text-white font-bold">
                  {player.playerName}
                </span>
                <span className="text-primary/70 text-sm">
                  ({player.stats || "بطل الإقليم"})
                </span>

                {isAdmin && (
                  <button
                    onClick={() => handleEditPlayer(player, player.rank)}
                    className="ml-2 text-primary hover:text-white transition-colors"
                    title="تعديل"
                  >
                    <Edit size={12} />
                  </button>
                )}
                <span className="mx-4 text-slate-700">|</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Admin Controls for Ads */}
      {isAdmin && (
        <div className="flex items-center justify-end gap-3 text-sm">
          <button
            onClick={handleToggleAds}
            className={`px-4 py-1.5 rounded-lg font-bold border transition-colors ${isAdsEnabled ? 'bg-primary/20 text-primary border-primary/30 hover:bg-primary/30' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}
          >
            {isAdsEnabled ? 'إخفاء شريط الإعلانات' : 'تفعيل شريط الإعلانات'}
          </button>
          <button
             onClick={handleEditAd}
             className="px-4 py-1.5 rounded-lg font-bold border bg-white/5 text-white border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <Edit size={14} />
            إدارة نصوص الإعلانات
          </button>
        </div>
      )}

      {/* Ads Ticker Block */}
      {(isAdsEnabled || isAdmin) && (
        <div className={`relative overflow-hidden border rounded-xl flex items-center h-10 group ${isAdsEnabled ? 'bg-[#111] border-white/10' : 'bg-red-500/10 border-red-500/20 opacity-70'}`}>
          {!isAdsEnabled && isAdmin && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30 pointer-events-none">
              <span className="text-xs text-red-400 font-bold">الشريط مخفي عن الزوار</span>
            </div>
          )}
          <div className="absolute right-0 h-full bg-gradient-to-l from-black via-black/80 to-transparent w-24 z-10 pointer-events-none flex items-center pr-3">
             <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-slate-400">
               <Megaphone size={14} />
               <span className="text-xs font-bold">إعلانات</span>
             </div>
          </div>
          <div className="absolute left-0 h-full bg-gradient-to-r from-black via-black/80 to-transparent w-24 z-10 pointer-events-none" />

          {ads && ads.length > 0 ? (
            <motion.div
              className="flex whitespace-nowrap items-center pr-32 pl-10"
              animate={{ x: ["50%", "-100%"] }}
              transition={{ repeat: Infinity, duration: Math.max(15, ads.length * 5), ease: "linear" }}
            >
              <div className="flex items-center gap-16">
                {ads.map((ad, idx) => (
                  <div key={ad.id} className="flex items-center gap-2">
                    {ad.url ? (
                      <a href={ad.url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors font-bold text-sm">
                        {ad.title}
                      </a>
                    ) : (
                      <span className="text-white font-bold text-sm">{ad.title}</span>
                    )}
                    <span className="mx-4 text-slate-600 select-none">•</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
             <div className="text-xs text-slate-500 pr-32">لا يوجد إعلانات مضافة حالياً.</div>
          )}
        </div>
      )}
    </div>
  );
}
