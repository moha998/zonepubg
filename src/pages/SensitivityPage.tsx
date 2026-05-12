import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Smartphone, Loader2, Zap, Crosshair, Target, ChevronDown, Shield, Settings2, Pencil, CheckCircle2, Plus, Copy, Eye, EyeOff, RefreshCw, Star, Send, Activity } from 'lucide-react';
import Markdown from 'react-markdown';
import { Weapon, Device } from "../types";
import { useSensitivity } from "../hooks/useSensitivity";
import { SensitivityCard } from "../components/SensitivityCard";
import OptimizedImage from "../components/OptimizedImage";

interface SensitivityPageProps {
  SubtleAdBanner: React.ComponentType<any>;
  isAdmin: boolean;
  currentWeapons: Weapon[];
  handleCopy: (text: string) => void;
  copied: boolean;
  user: any;
  handleLogin: () => void;
  showNotification: (msg: string, type: 'success' | 'error' | 'info') => void;
  onToggleVisibility: (collectionName: string, id: string, currentStatus: boolean) => void;
  sensitivityCategory: "devices" | "players";
  setSensitivityCategory: (cat: "devices" | "players") => void;
  currentDevices: any[];
  currentPlayers: any[];
  setSelectedDevice: (device: any) => void;
  selectedDevice: any;
}

export default function SensitivityPage({
  SubtleAdBanner,
  isAdmin,
  currentWeapons,
  handleCopy,
  copied,
  user,
  handleLogin,
  showNotification,
  onToggleVisibility,
  sensitivityCategory,
  setSensitivityCategory,
  currentDevices,
  currentPlayers,
  setSelectedDevice,
  selectedDevice
}: SensitivityPageProps) {
  const { dbDevices, dbPlayers, sensitivityRatings, updateDevice, updatePlayer, addDevice, addPlayer } = useSensitivity();

  const [smartDeviceSearch, setSmartDeviceSearch] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSensitivityResponse, setAiSensitivityResponse] = useState<string | null>(null);
  
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState("");
  
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [editCode, setEditCode] = useState("");

  const [ratingValue, setRatingValue] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);


  const currentList = sensitivityCategory === "devices" ? currentDevices : currentPlayers;

  const handleToggleHide = () => {
    if (!selectedDevice) return;
    const collectionName = sensitivityCategory === "devices" ? "devices" : "players";
    onToggleVisibility(collectionName, selectedDevice.id, selectedDevice.isHidden || false);
  };

  const handleSmartSensitivitySearch = async () => {
    if (!smartDeviceSearch.trim()) return;
    setIsAiLoading(true);
    try {
      const { getGenAI } = await import("../lib/gemini");
      const ai = getGenAI();
      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [{ role: "user", parts: [{ text: `احسب حساسية الجهاز: ${smartDeviceSearch}` }]}]
      });
      setAiSensitivityResponse(result.text || "");
    } catch (error) {
      console.error(error);
      showNotification("حدث خطأ أثناء الاتصال بالذكاء الاصطناعي", "error");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleUpdateDevice = async (field: keyof Device, value: any) => {
    if (!isAdmin || !selectedDevice) return;
    try {
      if (sensitivityCategory === "devices") {
        await updateDevice(selectedDevice.id, { [field]: value });
      } else {
        await updatePlayer(selectedDevice.id, { [field]: value });
      }
      setSelectedDevice((prev: any) => ({ ...prev, [field]: value }));
      showNotification("تم التحديث", "success");
      setIsEditingName(false);
      setIsEditingCode(false);
    } catch(err) {
      showNotification("حدث خطأ", "error");
    }
  };

  const handleUpdateSetting = async (category: string, field: string, value: number) => {
    if (!isAdmin || !selectedDevice) return;
    try {
      const updatedSettings = {
        ...selectedDevice.settings,
        [category]: {
          ...selectedDevice.settings[category],
          [field]: value
        }
      };
      if (sensitivityCategory === "devices") {
        await updateDevice(selectedDevice.id, { settings: updatedSettings });
      } else {
        await updatePlayer(selectedDevice.id, { settings: updatedSettings });
      }
      setSelectedDevice((prev: any) => ({ ...prev, settings: updatedSettings }));
      showNotification(`تم تحديث ${field} إلى ${value}`, "success");
    } catch(err) {
      showNotification("فشل التحديث", "error");
    }
  };

  const handleRateSensitivity = async (deviceId: string) => {
    if (!user) {
      handleLogin();
      return;
    }
    if (ratingValue === 0) {
      showNotification("يرجى اختيار عدد النجوم أولاً", "error");
      return;
    }
    setIsSubmittingRating(true);
    try {
      const { db, addDoc, collection, serverTimestamp } = await import("../firebase");
      await addDoc(collection(db, "sensitivityRatings"), {
        deviceId,
        userId: user.uid,
        userName: user.displayName || user.email?.split("@")[0] || "مجهول",
        userPhoto: user.photoURL || "",
        rating: ratingValue,
        comment: ratingComment,
        createdAt: serverTimestamp(),
      });
      showNotification("تم إرسال تقييمك بنجاح! شكراً لك", "success");
      setRatingValue(0);
      setRatingComment("");
    } catch (error) {
      showNotification("حدث خطأ أثناء إرسال التقييم", "error");
    } finally {
      setIsSubmittingRating(false);
    }
  };

  if (!selectedDevice) return null;

  return (
    <motion.div
      key="sensitivity"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Smart AI Search Bar */}
      <section className="pro-card p-8 bg-gradient-to-br from-bg-card to-primary/5 border-primary/20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
            <Sparkles size={12} />
            مستشار الحساسية الذكي
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            ابحث عن أفضل حساسية لجهازك
          </h2>
          <p className="text-text-muted text-sm mb-8">
            أدخل نوع جهازك وسيقوم الذكاء الاصطناعي بتحليل مواصفاته
            وتقديم أفضل أرقام لك.
          </p>

          <div className="relative flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={smartDeviceSearch}
                onChange={(e) => setSmartDeviceSearch(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSmartSensitivitySearch()
                }
                placeholder="مثال: iPhone 15 Pro Max أو Samsung S24 Ultra..."
                className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-all pr-12"
              />
              <Smartphone
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={20}
              />
            </div>
            <button
              onClick={handleSmartSensitivitySearch}
              disabled={!smartDeviceSearch.trim() || isAiLoading}
              className="px-8 py-4 bg-primary text-black rounded-xl font-bold hover:bg-white transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAiLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Zap size={20} />
              )}
              تحليل الحساسية
            </button>
          </div>

          <SubtleAdBanner />

          <AnimatePresence>
            {aiSensitivityResponse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-black/40 border border-primary/20 rounded-2xl text-right"
              >
                <div className="flex items-center gap-2 text-primary mb-4 border-b border-primary/10 pb-2">
                  <Sparkles size={18} />
                  <span className="font-bold">
                    توصية الذكاء الاصطناعي لـ {smartDeviceSearch}
                  </span>
                </div>
                <div className="markdown-body text-sm text-slate-300">
                  <Markdown>{aiSensitivityResponse}</Markdown>
                </div>
                <button
                  onClick={() => setAiSensitivityResponse(null)}
                  className="mt-6 text-[10px] text-slate-500 hover:text-white transition-colors uppercase font-bold tracking-widest"
                >
                  إغلاق النتيجة
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar: Device/Player Selection */}
        <div className="lg:col-span-4 space-y-6">
          <div className="pro-card p-6 space-y-6">
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
              <button
                onClick={() => {
                  setSensitivityCategory("devices");
                  setSelectedDevice(currentDevices[0]);
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  sensitivityCategory === "devices"
                    ? "btn-gold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                الأجهزة
              </button>
              <button
                onClick={() => {
                  setSensitivityCategory("players");
                  setSelectedDevice(currentPlayers[0]);
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  sensitivityCategory === "players"
                    ? "btn-gold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                أفضل اللاعبين
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  {sensitivityCategory === "devices" ? (
                    <Smartphone size={14} />
                  ) : (
                    <Crosshair size={14} />
                  )}
                  {sensitivityCategory === "devices"
                    ? "اختر الجهاز"
                    : "اختر اللاعب"}
                </label>
                <div className="relative">
                  <select
                    value={selectedDevice?.id}
                    onChange={(e) => {
                      const device = currentList.find(
                        (d) => d.id === e.target.value
                      );
                      if (device) setSelectedDevice(device);
                    }}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-primary transition-all cursor-pointer"
                  >
                    {currentList.map((item: any) => (
                      <option
                        key={item.id}
                        value={item.id}
                        className="bg-bg-dark"
                      >
                        {item.name}{" "}
                        {sensitivityCategory === "players"
                          ? "(محترف)"
                          : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute left-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-500 pointer-events-none"
                    size={24}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Target size={14} /> اختر السلاح
                </label>
                <div className="relative">
                  <select
                    value={selectedWeapon?.id || ""}
                    onChange={(e) => {
                      const weapon = currentWeapons.find(
                        (w) => w.id === e.target.value
                      );
                      if (weapon) setSelectedWeapon(weapon);
                      else setSelectedWeapon(null);
                    }}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-primary transition-all cursor-pointer"
                  >
                    <option value="" className="bg-bg-dark">
                      بدون سلاح محدد
                    </option>
                    {currentWeapons.map((weapon: any) => (
                      <option
                        key={weapon.id}
                        value={weapon.id}
                        className="bg-bg-dark"
                      >
                        {weapon.nameAr} ({weapon.nameEn})
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute left-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-500 pointer-events-none"
                    size={24}
                  />
                </div>
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={() => {
                  // Admin add handled externally or can pass a prop for showAddDeviceModal
                }}
                className="w-full py-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-2 font-bold text-sm"
              >
                <Plus size={16} />
                {sensitivityCategory === "devices"
                  ? "إضافة جهاز جديد"
                  : "إضافة لاعب جديد"}
              </button>
            )}
          </div>

            <div className="p-6 pro-card bg-primary/5 border-primary/10">
              <h3 className="font-bold mb-2 flex items-center gap-2 text-primary">
                <Shield size={18} /> نصيحة احترافية
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                الحساسية تختلف من لاعب لآخر بنسبة بسيطة. ابدأ بهذه الإعدادات ثم قم
                بتعديلها تدريجياً في ساحة التدريب لتناسب أسلوب لعبك.
              </p>
              <div className="mt-4 pt-4 border-t border-primary/5 flex items-start gap-2">
                <Activity size={14} className="text-primary mt-0.5 shrink-0" />
                <p className="text-[10px] text-slate-500 leading-normal italic">
                  ملاحظة: دقة الحساسية تعتمد على حجم الشاشة، سرعة استجابة اللمس، وما إذا كنت تستخدم واقي شاشة. الأكواد يتم تحديثها دورياً لضمان فعاليتها.
                </p>
              </div>
            </div>
        </div>

        {/* Main Content: Sensitivity Details */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between p-6 pro-card">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                {selectedDevice.image ? (
                  <OptimizedImage
                    src={selectedDevice.image}
                    alt={selectedDevice.name}
                    className="w-full h-full"
                  />
                ) : selectedWeapon ? (
                  <Target className="text-primary" size={24} />
                ) : (
                  <Settings2 className="text-primary" size={24} />
                )}
              </div>
              <div>
                {isEditingName && isAdmin ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white font-bold outline-none focus:border-primary/50 transition-all w-full max-w-md"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          handleUpdateDevice("name", editName);
                        if (e.key === "Escape") setIsEditingName(false);
                      }}
                    />
                    <button
                      onClick={() =>
                        handleUpdateDevice("name", editName)
                      }
                      className="p-2.5 bg-primary text-black rounded-xl hover:scale-105 transition-transform"
                      title="حفظ"
                    >
                      <CheckCircle2 size={20} />
                    </button>
                    <button
                      onClick={() => setIsEditingName(false)}
                      className="p-2.5 bg-white/5 text-slate-400 rounded-xl hover:bg-white/10 transition-colors"
                      title="إلغاء"
                    >
                      <Plus className="rotate-45" size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold">
                      {selectedDevice.name}
                      {selectedWeapon && (
                        <span className="text-primary mr-2">
                          / {selectedWeapon.nameAr}
                        </span>
                      )}
                    </h2>
                    <div className="flex items-center gap-2 px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/20 text-[10px] text-green-500 font-bold">
                      <CheckCircle2 size={10} />
                      يعمل حالياً
                    </div>
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditName(selectedDevice.name);
                            setIsEditingName(true);
                          }}
                          className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-primary transition-all group/edit"
                          title="تعديل الاسم"
                        >
                          <Pencil
                            size={18}
                            className="group-hover/edit:scale-110 transition-transform"
                          />
                        </button>
                        <button
                          onClick={handleToggleHide}
                          className={`p-2 hover:bg-white/5 rounded-lg transition-all ${selectedDevice.isHidden ? 'text-red-500 hover:text-white hover:bg-red-500' : 'text-slate-500 hover:text-primary'}`}
                          title={selectedDevice.isHidden ? "إظهار" : "إخفاء"}
                        >
                          {selectedDevice.isHidden ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-slate-400 text-sm">
                  {selectedWeapon
                    ? `إعدادات الحساسية الموصى بها لسلاح ${selectedWeapon.nameAr}`
                    : "إعدادات الحساسية العامة الموصى بها"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {selectedDevice.playStyle && (
                <div className="px-3 py-1 rounded-lg bg-primary/10 text-[10px] font-bold text-primary uppercase tracking-widest border border-primary/20">
                  {selectedDevice.playStyle === "Rusher"
                    ? "مقتحم"
                    : "قناص"}
                </div>
              )}
              {selectedDevice.useGyroscope !== undefined && (
                <div
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                    selectedDevice.useGyroscope
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : "bg-red-500/10 text-red-500 border-red-500/20"
                  }`}
                >
                  {selectedDevice.useGyroscope
                    ? "جيروسكوب ON"
                    : "جيروسكوب OFF"}
                </div>
              )}
              {selectedDevice.screenSize && (
                <div className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-white/10">
                  {selectedDevice.screenSize}"
                </div>
              )}
              {selectedWeapon && (
                <div className="px-3 py-1 rounded-lg bg-primary/10 text-[10px] font-bold text-primary uppercase tracking-widest border border-primary/20">
                  {selectedWeapon.type}
                </div>
              )}
              <div className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-white/10">
                ID: {selectedDevice.id}
              </div>
            </div>
          </div>

          {selectedWeapon && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 pro-card bg-black/20 border border-white/5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Activity size={18} className="text-primary" /> خصائص
                  السلاح المختار
                </h3>
                <span className="text-xs text-slate-500">
                  {selectedWeapon.nameEn}
                </span>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 h-32 bg-white/5 rounded-2xl flex items-center justify-center p-4 border border-white/5 group">
                  <OptimizedImage
                    src={selectedWeapon.image}
                    alt={selectedWeapon.nameEn}
                    className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">
                      الضرر
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500"
                          style={{ width: `${selectedWeapon.damage}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold">
                        {selectedWeapon.damage}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">
                      الارتداد
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500"
                          style={{ width: `${selectedWeapon.recoil}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold">
                        {selectedWeapon.recoil}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">
                      السرعة
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${selectedWeapon.speed}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold">
                        {selectedWeapon.speed}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">
                      المدى
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${selectedWeapon.range}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold">
                        {selectedWeapon.range}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {selectedDevice.code && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 pro-card bg-bg-card flex flex-col md:flex-row items-center justify-between gap-6"
            >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary text-black flex items-center justify-center shadow-lg shadow-primary/30">
                      <Zap size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">
                        كود الحساسية (Code)
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-slate-400 text-sm">
                          انسخ الكود واستخدمه مباشرة في اللعبة
                        </p>
                        <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-300">
                          تحديث: اليوم
                        </span>
                      </div>
                    </div>
                  </div>
              <div className="flex items-center gap-3 bg-black/20 px-6 py-3 rounded-xl border border-white/5 font-bold text-xl text-primary relative">
                {isEditingCode && isAdmin ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={editCode}
                      onChange={(e) => setEditCode(e.target.value)}
                      className="bg-transparent border-b border-primary text-primary font-bold text-center outline-none w-48"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          handleUpdateDevice("code", editCode);
                        if (e.key === "Escape") setIsEditingCode(false);
                      }}
                    />
                    <button
                      onClick={() =>
                        handleUpdateDevice("code", editCode)
                      }
                      className="p-1 text-primary hover:bg-primary/10 rounded"
                      title="حفظ"
                    >
                      <CheckCircle2 size={20} />
                    </button>
                    <button
                      onClick={() => setIsEditingCode(false)}
                      className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                      title="إلغاء"
                    >
                      <Plus className="rotate-45" size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="font-mono">
                      {selectedDevice.code}
                    </span>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setEditCode(selectedDevice.code || "");
                          setIsEditingCode(true);
                        }}
                        className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-primary transition-all group/edit"
                        title="تعديل الكود"
                      >
                        <Pencil
                          size={16}
                          className="group-hover/edit:scale-110 transition-transform"
                        />
                      </button>
                    )}
                  </div>
                )}
                {!isEditingCode && (
                  <button
                    onClick={() =>
                      handleCopy(selectedDevice.code || "")
                    }
                    className="mr-4 p-2 hover:bg-white/5 rounded-lg transition-all text-slate-500 hover:text-white"
                    title="نسخ الكود"
                  >
                    <Copy size={20} />
                  </button>
                )}
                <AnimatePresence>
                  {copied && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-xl"
                    >
                      تم النسخ!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Camera Sensitivity */}
            <SensitivityCard
              title="حساسية الكاميرا"
              icon={<Eye className="text-primary" size={20} />}
              data={selectedDevice.settings.camera}
              isAdmin={isAdmin}
              onUpdate={(field, val) =>
                handleUpdateSetting("camera", field, val)
              }
            />

            {/* ADS Sensitivity */}
            <SensitivityCard
              title="حساسية ADS (إطلاق النار)"
              icon={<Crosshair className="text-orange-500" size={20} />}
              data={selectedDevice.settings.ads}
              isAdmin={isAdmin}
              onUpdate={(field, val) =>
                handleUpdateSetting("ads", field, val)
              }
            />

            {/* Gyroscope Sensitivity */}
            <div className="md:col-span-2">
              <SensitivityCard
                title="حساسية الجيروسكوب"
                icon={<RefreshCw className="text-primary" size={20} />}
                data={selectedDevice.settings.gyroscope}
                fullWidth
                isAdmin={isAdmin}
                onUpdate={(field, val) =>
                  handleUpdateSetting("gyroscope", field, val)
                }
              />
            </div>
          </div>

          {/* Ratings & Comments Section */}
          <div className="pro-card p-8 space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Star
                    className="text-yellow-500"
                    size={24}
                    fill="currentColor"
                  />{" "}
                  تقييمات المستخدمين
                </h3>
                <p className="text-slate-400 text-sm">
                  شارك تجربتك مع هذا الكود وساعد الآخرين.
                </p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl font-black text-primary">
                  {(() => {
                    const ratings = sensitivityRatings.filter(
                      (r) => r.deviceId === selectedDevice.id
                    );
                    if (ratings.length === 0) return "0.0";
                    const avg =
                      ratings.reduce((acc, r: any) => acc + r.rating, 0) /
                      ratings.length;
                    return avg.toFixed(1);
                  })()}
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const ratings = sensitivityRatings.filter(
                      (r) => r.deviceId === selectedDevice.id
                    );
                    const avg =
                      ratings.length > 0
                        ? ratings.reduce(
                            (acc, r: any) => acc + r.rating,
                            0
                          ) / ratings.length
                        : 0;
                    return (
                      <Star
                        key={star}
                        size={16}
                        className={
                          star <= Math.round(avg)
                            ? "text-yellow-500"
                            : "text-slate-700"
                        }
                        fill={
                          star <= Math.round(avg)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  {
                    sensitivityRatings.filter(
                      (r) => r.deviceId === selectedDevice.id
                    ).length
                  }{" "}
                  تقييم
                </p>
              </div>
            </div>

            {/* Add Rating Form */}
            <div className="bg-white/2 rounded-2xl p-6 border border-white/5">
              <h4 className="font-bold mb-4 text-sm">
                أضف تقييمك الخاص
              </h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500">
                    التقييم:
                  </span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRatingValue(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={28}
                          className={
                            star <= ratingValue
                              ? "text-yellow-500"
                              : "text-slate-700"
                          }
                          fill={
                            star <= ratingValue
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                    placeholder="اكتب تجربتك مع هذا الكود (اختياري)..."
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all min-h-[100px] resize-none"
                  />
                  <button
                    onClick={() =>
                      handleRateSensitivity(selectedDevice.id)
                    }
                    disabled={isSubmittingRating || ratingValue === 0}
                    className="absolute bottom-4 left-4 btn-gold px-6 py-2 rounded-lg font-bold text-xs disabled:opacity-50"
                  >
                    {isSubmittingRating ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                    إرسال التقييم
                  </button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4 md:max-h-[400px] md:overflow-y-auto pr-2 custom-scrollbar">
              {sensitivityRatings.filter(
                (r) => r.deviceId === selectedDevice.id
              ).length > 0 ? (
                sensitivityRatings
                  .filter((r) => r.deviceId === selectedDevice.id)
                  .map((rating: any) => (
                    <div
                      key={rating.id}
                      className="p-4 bg-white/2 rounded-xl border border-white/5 flex gap-4"
                    >
                      <OptimizedImage
                        src={
                          rating.userPhoto ||
                          `https://ui-avatars.com/api/?name=${rating.userName}`
                        }
                        alt={rating.userName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-bold text-sm">
                              {rating.userName}
                            </h5>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={10}
                                  className={
                                    s <= rating.rating
                                      ? "text-yellow-500"
                                      : "text-slate-800"
                                  }
                                  fill={
                                    s <= rating.rating
                                      ? "currentColor"
                                      : "none"
                                  }
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-600">
                            {rating.createdAt?.toDate
                              ? rating.createdAt
                                  .toDate()
                                  .toLocaleDateString("ar-EG")
                              : "الآن"}
                          </span>
                        </div>
                        {rating.comment && (
                          <p className="text-sm text-slate-400 leading-relaxed">
                            {rating.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="py-12 text-center text-slate-600 italic text-sm">
                  لا توجد تعليقات بعد. كن أول من يشارك تجربته!
                </div>
              )}
            </div>
          </div>
        </div>

        <SubtleAdBanner />
      </div>
    </motion.div>
  );
}
