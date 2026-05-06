import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  ChevronDown, 
  Crosshair, 
  Settings2, 
  Pencil, 
  Trash2, 
  Trophy, 
  Activity, 
  Target,
  Cross, 
  Map, 
  Video,
  Eye,
  EyeOff
} from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';
import { Character, Weapon, Attachment } from '../types';

interface CharactersPageProps {
  currentCharacters: Character[];
  currentWeapons: Weapon[];
  currentAttachments: Attachment[];
  isAdmin: boolean;
  deleteItem: (collectionName: string, id: string) => void;
  setEditingContentData: (data: any) => void;
  setIsEditingCharacter: (id: string | null) => void;
  setIsEditingWeapon: (id: string | null) => void;
  setIsEditingAttachment: (id: string | null) => void;
  setIsAddingContent: (type: any) => void;
  groupedWeapons: Record<string, Weapon[]>;
  categoryNames: Record<string, string>;
  attachmentTypes: Record<string, string>;
  onToggleVisibility: (collectionName: string, id: string, currentStatus: boolean) => void;
}

export default function CharactersPage({
  currentCharacters,
  currentWeapons,
  currentAttachments,
  isAdmin,
  deleteItem,
  setEditingContentData,
  setIsEditingCharacter,
  setIsEditingWeapon,
  setIsEditingAttachment,
  setIsAddingContent,
  groupedWeapons,
  categoryNames,
  attachmentTypes,
  onToggleVisibility,
}: CharactersPageProps) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('tab') as "characters" | "weapons" | "attachments" | null;
  const [featuresCategory, setFeaturesCategory] = useState<"characters" | "weapons" | "attachments">(initialCategory || "characters");

  useEffect(() => {
    if (initialCategory && ["characters", "weapons", "attachments"].includes(initialCategory)) {
      setFeaturesCategory(initialCategory);
    }
  }, [initialCategory]);
  
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>(
    currentCharacters[0]?.id || ""
  );
  const [isCharacterDropdownOpen, setIsCharacterDropdownOpen] = useState(false);

  const [selectedWeaponId, setSelectedWeaponId] = useState<string>(
    currentWeapons[0]?.id || ""
  );
  const [isWeaponDropdownOpen, setIsWeaponDropdownOpen] = useState(false);

  const [selectedAttachmentType, setSelectedAttachmentType] = useState<string>("muzzle");
  const [isAttachmentDropdownOpen, setIsAttachmentDropdownOpen] = useState(false);

  const getTypeLabel = (type: string) => categoryNames[type] || type;

  return (
    <motion.div
      key="features"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto space-y-12"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Users className="text-primary" size={32} /> المميزات والخصائص
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          دليل شامل لقدرات الشخصيات الفريدة وخصائص قطع الأسلحة التي
          تساعدك في تحسين أدائك في الميدان.
        </p>
      </div>

      <div className="flex justify-center mb-8 bg-black/40 p-1 rounded-2xl w-fit mx-auto border border-white/5">
        <button
          onClick={() => setFeaturesCategory("characters")}
          className={`px-8 py-3 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${
            featuresCategory === "characters" ? "bg-primary text-black" : "text-white hover:bg-white/5"
          }`}
        >
          <Users size={18} /> الشخصيات
        </button>
        <button
          onClick={() => setFeaturesCategory("weapons")}
          className={`px-8 py-3 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${
            featuresCategory === "weapons" ? "bg-primary text-black" : "text-white hover:bg-white/5"
          }`}
        >
          <Crosshair size={18} /> الأسلحة
        </button>
        <button
          onClick={() => setFeaturesCategory("attachments")}
          className={`px-8 py-3 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${
            featuresCategory === "attachments" ? "bg-primary text-black" : "text-white hover:bg-white/5"
          }`}
        >
          <Settings2 size={18} /> القطع
        </button>
      </div>

      {featuresCategory === "characters" ? (
        <div className="space-y-12">
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-bold text-slate-500 mb-3 text-center uppercase tracking-widest">
              اختر الشخصية
            </label>
            <div
              className="relative"
              onMouseLeave={() => setIsCharacterDropdownOpen(false)}
            >
              <button
                onMouseEnter={() => setIsCharacterDropdownOpen(true)}
                onClick={() => setIsCharacterDropdownOpen(!isCharacterDropdownOpen)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold flex items-center justify-between hover:border-primary transition-all cursor-pointer"
              >
                <ChevronDown
                  size={24}
                  className={`text-slate-500 transition-transform duration-300 ${
                    isCharacterDropdownOpen ? "rotate-180" : ""
                  }`}
                />
                <span>
                  {currentCharacters.find(c => c.id === selectedCharacterId)?.arabicName || "اختر الشخصية"}
                </span>
              </button>

              <AnimatePresence>
                {isCharacterDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="md:absolute relative mt-2 md:top-full left-0 right-0 bg-slate-900 border border-white/10 rounded-xl shadow-2xl md:z-20 md:overflow-hidden py-2 md:max-h-[300px] md:overflow-y-auto custom-scrollbar"
                  >
                    {currentCharacters.map((char) => (
                      <button
                        key={char.id}
                        onClick={() => {
                          setSelectedCharacterId(char.id);
                          setIsCharacterDropdownOpen(false);
                        }}
                        className={`w-full px-6 py-3 text-right font-bold transition-all flex items-center justify-end gap-3 ${
                          selectedCharacterId === char.id
                            ? "bg-primary/10 text-primary"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {char.arabicName} ({char.name})
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex justify-center">
            {currentCharacters.filter(c => c.id === selectedCharacterId).map(char => (
                <motion.div
                  key={char.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="pro-card overflow-hidden group border-white/5 max-w-md w-full"
                >
                  <div className="relative h-64 overflow-hidden">
                    <OptimizedImage
                      src={char.image}
                      alt={char.arabicName}
                      className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => onToggleVisibility("characters", char.id, char.isHidden || false)}
                            className={`p-2 rounded-lg bg-black/50 transition-all backdrop-blur-md z-10 ${char.isHidden ? 'text-red-500 hover:text-white hover:bg-red-500' : 'text-primary hover:bg-primary hover:text-black'}`}
                            title={char.isHidden ? "إظهار" : "إخفاء"}
                          >
                            {char.isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          <button
                            onClick={() => {
                              setEditingContentData(char);
                              setIsEditingCharacter(char.id);
                              setIsAddingContent("character");
                            }}
                            className="p-2 rounded-lg bg-black/50 text-primary hover:bg-primary hover:text-black transition-all backdrop-blur-md z-10"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => deleteItem("characters", char.id)}
                            className="p-2 rounded-lg bg-black/50 text-red-500 hover:bg-red-500 hover:text-white transition-all backdrop-blur-md z-10"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                    <div className="absolute bottom-4 right-4 left-4 flex justify-between items-end">
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {char.arabicName}
                        </h3>
                        <span className="text-xs text-primary font-bold uppercase tracking-widest">
                          {char.name}
                        </span>
                      </div>
                      <div className="bg-primary text-black px-3 py-1 rounded-lg font-bold text-sm shadow-lg">
                        MAX: +{char.levelMaxBonus}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                      <Trophy size={18} />
                      <span className="font-bold text-sm">
                        {char.ability}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {char.description}
                    </p>
                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        Special Ability
                      </span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              i <= 4 ? "bg-primary" : "bg-white/10"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </div>
        </div>
      ) : featuresCategory === "weapons" ? (
        <div className="space-y-12">
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-bold text-slate-500 mb-3 text-center uppercase tracking-widest">
              اختر السلاح
            </label>
            <div
              className="relative"
              onMouseLeave={() => setIsWeaponDropdownOpen(!isWeaponDropdownOpen)}
            >
              <button
                onMouseEnter={() => setIsWeaponDropdownOpen(true)}
                onClick={() => setIsWeaponDropdownOpen(!isWeaponDropdownOpen)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold flex items-center justify-between hover:border-primary transition-all cursor-pointer"
              >
                <ChevronDown
                  size={24}
                  className={`text-slate-500 transition-transform duration-300 ${
                    isWeaponDropdownOpen ? "rotate-180" : ""
                  }`}
                />
                <span>
                  {currentWeapons.find(w => w.id === selectedWeaponId)?.nameAr || "اختر السلاح"}
                </span>
              </button>

              <AnimatePresence>
                {isWeaponDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="md:absolute relative mt-2 md:top-full left-0 right-0 bg-slate-900 border border-white/10 rounded-xl shadow-2xl md:z-20 md:overflow-hidden py-2 md:max-h-[300px] md:overflow-y-auto custom-scrollbar"
                  >
                    {Object.entries(groupedWeapons).map(([type, wpns]) => (
                        <div key={type}>
                          <div className="px-6 py-2 text-[10px] uppercase font-bold tracking-widest text-primary bg-white/5 border-y border-white/5 text-right">
                            {categoryNames[type] || type}
                          </div>
                          {wpns.map((wpn) => (
                            <button
                              key={wpn.id}
                              onClick={() => {
                                setSelectedWeaponId(wpn.id);
                                setIsWeaponDropdownOpen(false);
                              }}
                              className={`w-full px-6 py-3 text-right font-bold transition-all flex items-center justify-end gap-3 ${
                                selectedWeaponId === wpn.id
                                  ? "bg-primary/10 text-primary"
                                  : "text-slate-400 hover:bg-white/5 hover:text-white"
                              }`}
                            >
                              {wpn.nameAr} ({wpn.nameEn})
                              <Crosshair size={14} className="text-slate-600" />
                            </button>
                          ))}
                        </div>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex justify-center">
            {currentWeapons.filter(w => w.id === selectedWeaponId).map(weapon => (
                <motion.div
                  key={weapon.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="pro-card p-8 bg-black/40 border-white/5 w-full max-w-4xl"
                >
                  <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-8 relative">
                     {isAdmin && (
                        <div className="absolute top-0 right-0 flex gap-2">
                          <button
                            onClick={() => onToggleVisibility("weapons", weapon.id, weapon.isHidden || false)}
                            className={`p-2 rounded-lg bg-white/5 transition-all ${weapon.isHidden ? 'text-red-500 hover:bg-red-500 hover:text-white' : 'text-primary hover:bg-primary hover:text-black'}`}
                            title={weapon.isHidden ? "إظهار" : "إخفاء"}
                          >
                            {weapon.isHidden ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                          <button
                            onClick={() => {
                              setEditingContentData(weapon);
                              setIsEditingWeapon(weapon.id);
                              setIsAddingContent("weapon");
                            }}
                            className="p-2 rounded-lg bg-white/5 text-slate-400 hover:bg-primary hover:text-black transition-all"
                            title="تعديل السلاح"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => deleteItem("weapons", weapon.id)}
                            className="p-2 rounded-lg bg-white/5 text-slate-400 hover:bg-red-500 hover:text-white transition-all"
                            title="حذف السلاح"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="px-3 py-1 bg-white/5 text-slate-300 rounded-lg text-xs font-bold font-mono border border-white/10 uppercase tracking-widest">
                          {getTypeLabel(weapon.type)}
                        </div>
                        {weapon.type === "AR" || weapon.type === "LMG" ? (
                          <div className="px-2 py-1 bg-red-500/20 text-red-400 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                            <Activity size={10} /> رشاشة
                          </div>
                        ) : weapon.type === "Sniper" ? (
                          <div className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                            <Target size={10} /> قنص
                          </div>
                        ) : null}
                      </div>
                      <h3 className="text-3xl font-bold mb-2">
                        {weapon.nameAr}
                      </h3>
                      <p className="text-slate-400 font-bold uppercase tracking-widest">
                        {weapon.nameEn}
                      </p>
                    </div>
                    <div className="w-24 h-24 bg-white/5 rounded-2xl flex items-center justify-center p-4 border border-white/10 flex-shrink-0">
                      <OptimizedImage
                        src={weapon.image}
                        alt={weapon.nameEn}
                        className="w-full h-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        الضرر
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold">
                          {weapon.damage}
                        </span>
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${weapon.damage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        الارتداد
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold">
                          {weapon.recoil}
                        </span>
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${weapon.recoil}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        السرعة
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold">
                          {weapon.speed}
                        </span>
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${weapon.speed}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        المدى
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold">
                          {weapon.range}
                        </span>
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${weapon.range}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Attachments Section */}
          <div className="max-w-md mx-auto mb-8">
            <label className="block text-sm font-bold text-slate-500 mb-3 text-center uppercase tracking-widest">
              اختر نوع القطعة
            </label>
            <div
              className="relative border-b-0"
              onMouseLeave={() => setIsAttachmentDropdownOpen(false)}
            >
              <button
                onMouseEnter={() => setIsAttachmentDropdownOpen(true)}
                onClick={() => setIsAttachmentDropdownOpen(!isAttachmentDropdownOpen)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold flex items-center justify-between hover:border-primary transition-all cursor-pointer"
              >
                <ChevronDown
                  size={24}
                  className={`text-slate-500 transition-transform duration-300 ${
                    isAttachmentDropdownOpen ? "rotate-180" : ""
                  }`}
                />
                <span>
                  {attachmentTypes[selectedAttachmentType as keyof typeof attachmentTypes] || "اختر القطعة"}
                </span>
              </button>

              <AnimatePresence>
                {isAttachmentDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="md:absolute relative mt-2 md:top-full left-0 right-0 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden py-2 max-h-[300px] overflow-y-auto custom-scrollbar"
                  >
                    {Object.entries(attachmentTypes).map(([type, label]) => (
                      <button
                        key={type}
                        onClick={() => {
                          setSelectedAttachmentType(type);
                          setIsAttachmentDropdownOpen(false);
                        }}
                        className={`w-full px-6 py-3 text-right font-bold transition-all flex items-center justify-end gap-3 ${
                          selectedAttachmentType === type
                            ? "bg-primary/10 text-primary"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {label}
                        <Settings2 size={14} className="text-slate-600" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <AnimatePresence mode="popLayout">
               {currentAttachments
                 .filter((att) => att.type === selectedAttachmentType)
                 .map((attachment) => (
                 <motion.div
                   layout
                   key={attachment.id}
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   className="pro-card p-6 flex flex-col items-center text-center group border-white/5 bg-black/20"
                 >
                   <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center p-4 mb-4 group-hover:bg-primary/5 transition-colors border border-white/10 relative">
                     {isAdmin && (
                        <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => {
                                  setEditingContentData(attachment);
                                  setIsEditingAttachment(attachment.id);
                                  setIsAddingContent("attachment");
                                }}
                                className="p-1.5 rounded bg-black/80 text-primary hover:bg-primary hover:text-black transition-all border border-primary/20"
                                title="تعديل"
                            >
                                <Pencil size={12} />
                            </button>
                            <button
                                onClick={() => deleteItem("attachments", attachment.id)}
                                className="p-1.5 rounded bg-black/80 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                title="حذف"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                     )}
                     {attachment.image ? (
                       <OptimizedImage
                         src={attachment.image}
                         alt={attachment.name}
                         className="w-full h-full group-hover:scale-110 transition-transform duration-300"
                       />
                     ) : (
                       <Settings2 className="text-slate-600" size={32} />
                     )}
                   </div>
                   <h4 className="font-bold mb-2">{attachment.name}</h4>
                   <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">
                     {attachment.type}
                   </p>
                   <p className="text-sm text-slate-400 flex-1 flex items-center">
                     {attachment.effect}
                   </p>
                   <div className="mt-4 w-full bg-white/5 py-2 px-3 rounded-lg flex items-center justify-between border border-white/5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Type</span>
                      <span className="text-xs font-bold text-primary">{attachmentTypes[attachment.type as keyof typeof attachmentTypes] || attachment.type}</span>
                   </div>
                 </motion.div>
               ))}
               {currentAttachments.filter((att) => att.type === selectedAttachmentType).length === 0 && (
                 <div className="col-span-full py-12 text-center">
                   <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                     <Settings2 className="text-slate-600" size={24} />
                   </div>
                   <p className="text-slate-500 font-bold">لا توجد قطع قنص أو مرفقات في هذا القسم حاليا</p>
                 </div>
               )}
             </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
}
