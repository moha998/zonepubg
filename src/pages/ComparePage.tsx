import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Timer, Zap, Compass, Sparkles, Info, Tablet, Smartphone, BarChart3, Plus } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { buildComparisonAdvice, calculateTTK } from '../utils/weaponUtils';

interface ComparePageProps {
  currentWeapons: any[];
  groupedWeapons: Record<string, any[]>;
  categoryNames: Record<string, string>;
  getWeaponSmartAnalysis: (weapon: any) => any;
  SmartWeaponCard: React.FC<any>;
  isAdmin: boolean;
  setShowAddWeaponModal: (show: boolean) => void;
  SubtleAdBanner: React.FC;
}

export default function ComparePage({
  currentWeapons,
  groupedWeapons,
  categoryNames,
  getWeaponSmartAnalysis,
  SmartWeaponCard,
  isAdmin,
  setShowAddWeaponModal,
  SubtleAdBanner
}: ComparePageProps) {
  const [selectedWeapon1, setSelectedWeapon1] = useState<any | null>(null);
  const [selectedWeapon2, setSelectedWeapon2] = useState<any | null>(null);
  const [distance, setDistance] = useState<number>(50);

  useEffect(() => {
    if (currentWeapons && currentWeapons.length >= 2) {
      if (!selectedWeapon1) setSelectedWeapon1(currentWeapons[0]);
      if (!selectedWeapon2) setSelectedWeapon2(currentWeapons[1]);
    }
  }, [currentWeapons]);

  const comparisonAdvice = selectedWeapon1 && selectedWeapon2 ? buildComparisonAdvice(selectedWeapon1, selectedWeapon2, distance) : null;

  const comparisonAdviceSmart = selectedWeapon1 && comparisonAdvice
    ? {
        ...getWeaponSmartAnalysis(selectedWeapon1),
        ipad: comparisonAdvice.ipad ?? "",
        phone: comparisonAdvice.phone ?? "",
      }
    : null;

  return (
    <motion.div
      key="compare"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
      dir="rtl"
    >
      {/* Header & Distance Slider */}
      <div className="text-center space-y-8 max-w-3xl mx-auto">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-black gold-shimmer">
            مقارنة الأسلحة الذكية
          </h2>
          <p className="text-slate-400 text-lg">
            حلل الأداء، احسب الضرر، وتفوق في كل مواجهة
          </p>
        </div>

        <div className="pro-card p-8 bg-gradient-to-b from-white/5 to-transparent border-primary/20">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Target size={14} className="text-primary" /> مسافة الاشتباك
            </span>
            <span className="text-2xl font-black text-primary">
              {distance} متر
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="400"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
            <span>قريب جداً (5m)</span>
            <span>متوسط (200m)</span>
            <span>بعيد جداً (400m)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Selection & Stats */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weapon 1 Select */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                السلاح الأول
              </label>
              <select
                value={selectedWeapon1?.id || ""}
                onChange={(e) =>
                  setSelectedWeapon1(
                    currentWeapons.find((w) => w.id === e.target.value) || null
                  )
                }
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-primary transition-all cursor-pointer relative z-10"
              >
                <option value="" disabled>
                  اختر سلاحاً...
                </option>
                {Object.entries(groupedWeapons).map(([type, weapons]) => (
                  <optgroup
                    key={type}
                    label={categoryNames[type] || type}
                    className="bg-slate-900 text-primary font-bold"
                  >
                    {weapons.map((w) => (
                      <option
                        key={w.id}
                        value={w.id}
                        className="bg-slate-900 text-white font-normal"
                      >
                        {w.nameAr} ({w.nameEn})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <SmartWeaponCard
                weapon={selectedWeapon1}
                distance={distance}
                index={1}
              />
            </div>

            {/* Weapon 2 Select */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                السلاح الثاني
              </label>
              <select
                value={selectedWeapon2?.id || ""}
                onChange={(e) =>
                  setSelectedWeapon2(
                    currentWeapons.find((w) => w.id === e.target.value) || null
                  )
                }
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-primary transition-all cursor-pointer relative z-10"
              >
                <option value="" disabled>
                  اختر سلاحاً...
                </option>
                {Object.entries(groupedWeapons).map(([type, weapons]) => (
                  <optgroup
                    key={type}
                    label={categoryNames[type] || type}
                    className="bg-slate-900 text-primary font-bold"
                  >
                    {weapons.map((w) => (
                      <option
                        key={w.id}
                        value={w.id}
                        className="bg-slate-900 text-white font-normal"
                      >
                        {w.nameAr} ({w.nameEn})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <SmartWeaponCard
                weapon={selectedWeapon2}
                distance={distance}
                index={2}
              />
            </div>
          </div>

          {/* TTK Calculation */}
          <div className="pro-card p-8 bg-gradient-to-br from-bg-card to-red-500/5 border-red-500/20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
                <Timer size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">وقت القتل (TTK)</h3>
                <p className="text-xs text-slate-500">
                  ضد درع مستوى 2 (100 HP + 100 Armor)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {selectedWeapon1?.nameAr || "السلاح 1"}
                </div>
                <div className="text-4xl font-black text-primary">
                  {calculateTTK(selectedWeapon1)}s
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(1 - Number(calculateTTK(selectedWeapon1))) * 100}%` }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {selectedWeapon2?.nameAr || "السلاح 2"}
                </div>
                <div className="text-4xl font-black text-orange-500">
                  {calculateTTK(selectedWeapon2)}s
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(1 - Number(calculateTTK(selectedWeapon2))) * 100}%` }}
                    className="h-full bg-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis & Advice */}
        <div className="space-y-8">
          <div className="pro-card p-8 space-y-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Zap className="text-primary" size={20} /> تحليل المواجهات الذكي
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-1 h-full bg-red-500/20 group-hover:bg-red-500 transition-colors" />
                <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                  <Target size={18} className="text-red-500" />
                  <span>المواجهات القريبة</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                {comparisonAdvice?.closeRange}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-1 h-full bg-blue-500/20 group-hover:bg-blue-500 transition-colors" />
                <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                  <Compass size={18} className="text-blue-500" />
                  <span>المواجهات البعيدة</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {comparisonAdvice?.longRange}
                </p>
              </div>
            </div>

            {comparisonAdvice?.proTip && (
              <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 flex gap-4 items-start shadow-xl shadow-primary/5">
                <div className="p-3 rounded-xl bg-primary/20 text-primary animate-pulse">
                  <Sparkles size={24} />
                </div>
                <div>
                  <span className="text-xs font-black text-primary uppercase tracking-widest block mb-1">
                    نصيحة الخبراء والمحترفين
                  </span>
                  <p className="text-sm font-bold text-slate-300 leading-relaxed">
                    {comparisonAdvice.proTip}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Info size={16} /> نصائح الأجهزة بناءً على الارتداد
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-4 items-start">
                  <div className="p-3 rounded-xl bg-blue-500/20 text-blue-500">
                    <Tablet size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest block mb-1">
                      مستخدمي iPad
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {comparisonAdviceSmart?.ipad}
                    </p>
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/10 flex gap-4 items-start">
                  <div className="p-3 rounded-xl bg-purple-500/20 text-purple-500">
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest block mb-1">
                      مستخدمي الهواتف
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {comparisonAdviceSmart?.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="pro-card p-8 h-[450px] flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0" />
            <h3 className="text-xl font-bold mb-8 text-center flex items-center justify-center gap-2">
              <BarChart3 className="text-primary" size={20} /> التحليل الرسومي المتقدم
            </h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={[
                    { subject: "الضرر", A: selectedWeapon1?.damage || 0, B: selectedWeapon2?.damage || 0, fullMark: 100 },
                    { subject: "الارتداد", A: selectedWeapon1?.recoil || 0, B: selectedWeapon2?.recoil || 0, fullMark: 100 },
                    { subject: "السرعة", A: selectedWeapon1?.speed || 0, B: selectedWeapon2?.speed || 0, fullMark: 100 },
                    { subject: "المدى", A: selectedWeapon1?.range || 0, B: selectedWeapon2?.range || 0, fullMark: 100 },
                  ]}
                >
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name={selectedWeapon1?.nameAr || "سلاح 1"} dataKey="A" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.5} />
                  <Radar name={selectedWeapon2?.nameAr || "سلاح 2"} dataKey="B" stroke="#f97316" fill="#f97316" fillOpacity={0.5} />
                  <Legend />
                  <RechartsTooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px" }} itemStyle={{ color: "#fff" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="flex justify-center pt-12">
          <button
            onClick={() => setShowAddWeaponModal(true)}
            className="flex items-center gap-2 px-8 py-4 bg-primary text-black rounded-2xl font-black hover:bg-white transition-all shadow-xl shadow-primary/20"
          >
            <Plus size={20} /> إضافة سلاح جديد لقاعدة البيانات
          </button>
        </div>
      )}

      <SubtleAdBanner />
    </motion.div>
  );
}
