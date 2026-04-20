import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { motion } from 'motion/react';

interface ConquerorCalculatorProps {
  SubtleAdBanner: React.FC;
}

const ConquerorCalculator: React.FC<ConquerorCalculatorProps> = ({ SubtleAdBanner }) => {
  const [calcPoints, setCalcPoints] = useState<number>(4200);
  const [calcRank, setCalcRank] = useState<number>(10000);

  return (
    <motion.div
      key="calculator"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
          <Trophy size={12} />
          حاسبة الطريق إلى الكونكر
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          احسب نقاطك المتبقية للكونكر
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          أدخل نقاطك الحالية وترتيبك لنخبرك كم تحتاج للوصول إلى تقييم
          "الغازي" (Conqueror) بناءً على متوسط التقييمات الحالية.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Inputs */}
        <div className="pro-card p-8 space-y-6">
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
              النقاط الحالية
            </label>
            <div className="relative">
              <input
                type="number"
                value={calcPoints}
                onChange={(e) => setCalcPoints(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-all text-white font-bold text-lg"
                placeholder="مثال: 4200"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold text-xs uppercase tracking-widest pointer-events-none">
                PTS
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
              الترتيب الحالي (حسب السيرفر)
            </label>
            <div className="relative">
              <input
                type="number"
                value={calcRank}
                onChange={(e) => setCalcRank(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-all text-white font-bold text-lg"
                placeholder="مثال: 10000"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold text-xs uppercase tracking-widest pointer-events-none">
                RANK
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="pro-card p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />

          <div className="relative z-10 space-y-8 text-center">
            <div>
              <p className="text-slate-400 font-bold mb-2">النقاط المتبقية</p>
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">
                {Math.max(0, 6200 - calcPoints)}
              </div>
              <p className="text-primary text-sm font-bold mt-2">
                نقطة للوصول للهدف
              </p>
            </div>

            <div className="p-4 bg-black/40 rounded-2xl border border-primary/20 backdrop-blur-sm">
              <p className="text-sm font-bold text-slate-300">
                حالتك الحالية:{" "}
                <span className="text-white">
                  {calcPoints >= 6200
                    ? "أنت جاهز للكونكر!"
                    : calcPoints >= 4200
                    ? "أنت في التاج.. استمر!"
                    : "تحتاج للمزيد من التركيز اللعب"}
                </span>
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-slate-400">التقدم نحو الهدف</span>
                <span className="text-primary">
                  {Math.min(
                    100,
                    Math.round((calcPoints / 6200) * 100)
                  )}
                  %
                </span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(
                      100,
                      (calcPoints / 6200) * 100
                    )}%`,
                  }}
                  className="h-full bg-gradient-to-r from-primary/50 to-primary shadow-[0_0_15px_rgba(255,184,0,0.3)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                  الهدف المقدر
                </p>
                <p className="text-lg font-bold text-white">6200</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                  الترتيب المطلوب
                </p>
                <p className="text-lg font-bold text-white">Top 500</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SubtleAdBanner />
    </motion.div>
  );
};

export default ConquerorCalculator;
