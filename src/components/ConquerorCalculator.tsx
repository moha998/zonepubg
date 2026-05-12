import React, { useState } from 'react';
import { Trophy, ChevronLeft, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

interface ConquerorCalculatorProps {
  SubtleAdBanner: React.FC;
}

const ConquerorCalculator: React.FC<ConquerorCalculatorProps> = ({ SubtleAdBanner }) => {
  const [calcPoints, setCalcPoints] = useState<number>(4200);
  const [calcRank, setCalcRank] = useState<number>(10000);
  const [targetRankId, setTargetRankId] = useState<string>("conqueror");

  const ranks = [
    { id: "ace", name: "الورقة الرابحة (Ace)", targetPoints: 4200, pointsStr: "4200", color: "text-orange-400" },
    { id: "ace_master", name: "المتفوق (Ace Master)", targetPoints: 4700, pointsStr: "4700", color: "text-pink-400" },
    { id: "ace_dominator", name: "متفوق بارع (Dominator)", targetPoints: 5200, pointsStr: "5200", color: "text-red-500" },
    { id: "conqueror", name: "الغازي (Conqueror)", targetPoints: 6200, pointsStr: "Top 500", color: "text-yellow-400", extra: "5200+" }
  ];

  const currentTarget = ranks.find(r => r.id === targetRankId) || ranks[3];
  const targetEstimate = currentTarget.targetPoints;

  const getRankStatusMessage = (points: number, target: number) => {
    if (points >= target) return "أنت قد تجاوزت أو وصلت إلى هدفك الحالي بطل!";
    if (points >= 5200) return "أنت متفوق بارع.. الطريق القصير للكونكر!";
    if (points >= 4700) return "أنت متفوق.. استمر في الصعود!";
    if (points >= 4200) return "أنت في الورقة الرابحة.. بداية الطريق للقمة!";
    return "تحتاج للمزيد من التركيز.. طريقك بدأ للتو!";
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
     if(e.target.value === '0') e.target.value = '';
  }

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
          احسب نقاطك المتبقية لـ {currentTarget.name}
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          أدخل نقاطك الحالية وترتيبك لنخبرك كم تحتاج للوصول إلى هدفك المحدد.
        </p>
      </div>

      {/* Ranks Guide */}
      <div className="pro-card p-6 mb-8">
        <h3 className="text-lg font-bold mb-6 text-center text-white">مستويات التقييم المتقدمة (من الورقة الرابحة إلى الكونكر)</h3>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {ranks.map((rank, idx) => (
            <React.Fragment key={rank.name}>
              <div 
                onClick={() => setTargetRankId(rank.id)}
                className={`flex border p-4 rounded-xl items-center flex-1 w-full justify-center text-center cursor-pointer transition-all ${
                  targetRankId === rank.id 
                    ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(255,184,0,0.2)]" 
                    : "bg-black/20 border-white/5 hover:border-white/20"
                }`}
              >
                <div>
                  <h4 className={`font-bold text-sm mb-1 ${rank.color}`}>{rank.name}</h4>
                  <p className="text-xs text-white font-bold">{rank.pointsStr} نقطة</p>
                  {rank.extra && <p className="text-[10px] text-slate-400 mt-1">{rank.extra}</p>}
                </div>
              </div>
              {idx < ranks.length - 1 && (
                <div className="hidden md:block">
                  <ChevronLeft className="text-slate-500" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Inputs */}
        <div className="pro-card p-8 space-y-6">
          <style dangerouslySetInnerHTML={{__html: `
            input[type="number"]::-webkit-inner-spin-button, 
            input[type="number"]::-webkit-outer-spin-button { 
              -webkit-appearance: none; 
              margin: 0; 
            }
            input[type="number"] {
              -moz-appearance: textfield; 
            }
          `}} />
          
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
              النقاط الحالية
            </label>
            <div className="relative">
              <input
                type="number"
                value={calcPoints || ''}
                onFocus={handleFocus}
                onChange={(e) => setCalcPoints(Number(e.target.value) || 0)}
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
              الهدف المطلوب
            </label>
            <div className="relative">
              <select
                value={targetRankId}
                onChange={(e) => setTargetRankId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-all text-white font-bold text-base appearance-none cursor-pointer"
                dir="rtl"
              >
                {ranks.map(r => (
                  <option key={r.id} value={r.id} className="bg-[#0A0C10] text-white">
                    {r.name}
                  </option>
                ))}
              </select>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown size={18} />
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
                value={calcRank || ''}
                onFocus={handleFocus}
                onChange={(e) => setCalcRank(Number(e.target.value) || 0)}
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
              <p className="text-slate-400 font-bold mb-2">النقاط المتبقية لـ {currentTarget.name}</p>
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">
                {Math.max(0, targetEstimate - calcPoints)}
              </div>
              <p className="text-primary text-sm font-bold mt-2">
                نقطة للوصول للهدف
              </p>
            </div>

            <div className="p-4 bg-black/40 rounded-2xl border border-primary/20 backdrop-blur-sm">
              <p className="text-sm font-bold text-slate-300">
                حالتك الحالية:{" "}
                <span className="text-white">
                  {getRankStatusMessage(calcPoints, targetEstimate)}
                </span>
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-slate-400">التقدم نحو الهدف {currentTarget.name}</span>
                <span className="text-primary">
                  {Math.min(
                    100,
                    Math.round((calcPoints / targetEstimate) * 100)
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
                      (calcPoints / targetEstimate) * 100
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
                <p className="text-lg font-bold text-white">{targetEstimate}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                  الترتيب المطلوب
                </p>
                <p className="text-lg font-bold text-white">{currentTarget.id === 'conqueror' ? 'Top 500' : 'حسب النقاط'}</p>
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
