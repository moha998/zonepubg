import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Crosshair, ChevronDown, Star, Zap, Target, Activity, Shield, Eye } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';
import { Weapon, Attachment, WeaponRating } from '../types';

interface LoadoutsPageProps {
  currentWeapons: Weapon[];
  currentAttachments: Attachment[];
  weaponRatings: WeaponRating[];
  categoryNames: Record<string, string>;
  getWeaponProTip: (weapon: Weapon) => string;
  setSelectedWeaponToRate: (weapon: Weapon) => void;
  setIsRatingModalOpen: (isOpen: boolean) => void;
  SubtleAdBanner: React.FC;
}

export default function LoadoutsPage({
  currentWeapons,
  currentAttachments,
  weaponRatings,
  categoryNames,
  getWeaponProTip,
  setSelectedWeaponToRate,
  setIsRatingModalOpen,
  SubtleAdBanner,
}: LoadoutsPageProps) {
  const loadoutWeapons = currentWeapons.filter((w) => w.bestAttachments);
  const groupedLoadoutWeapons = loadoutWeapons.reduce((acc, weapon) => {
    const type = weapon.type || "Other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(weapon);
    return acc;
  }, {} as Record<string, Weapon[]>);

  const initialSelectedLoadout = loadoutWeapons[0]?.id || "";
  const [selectedLoadoutWeaponId, setSelectedLoadoutWeaponId] = useState<string>(initialSelectedLoadout);

  return (
    <motion.div
      key="loadouts"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto space-y-12"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Crosshair className="text-primary" size={32} /> أفضل تركيبات الأسلحة
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          دليل شامل لأفضل القطع والمرفقات لكل سلاح في ببجي موبايل لضمان
          أقل ارتداد وأعلى دقة.
        </p>
      </div>

      <div className="space-y-12">
        <div className="max-w-md mx-auto">
          <label className="block text-sm font-bold text-slate-500 mb-3 text-center uppercase tracking-widest">
            اختر السلاح
          </label>
          <div className="relative">
            <select
              value={selectedLoadoutWeaponId}
              onChange={(e) => setSelectedLoadoutWeaponId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold appearance-none focus:outline-none focus:border-primary transition-all cursor-pointer text-right"
            >
              {Object.entries(groupedLoadoutWeapons).map(([type, weapons]) => (
                <optgroup
                  key={type}
                  label={categoryNames[type] || type}
                  className="bg-slate-900 text-primary font-bold"
                >
                  {weapons.map((weapon) => (
                    <option
                      key={weapon.id}
                      value={weapon.id}
                      className="bg-slate-900 text-white font-normal"
                    >
                      {weapon.nameAr} ({weapon.nameEn})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <ChevronDown size={24} />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          {currentWeapons
            .filter((w) => w.id === selectedLoadoutWeaponId)
            .map((weapon) => (
              <motion.div
                key={weapon.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="pro-card p-6 border-white/5 bg-white/2 hover:border-primary/30 transition-all group max-w-md w-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                      {weapon.image ? (
                        <OptimizedImage
                          src={weapon.image}
                          alt={weapon.nameEn}
                          className="w-14 h-14 group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <Zap size={28} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {weapon.nameAr}
                      </h3>
                      <span className="text-xs text-primary font-bold uppercase tracking-widest">
                        {weapon.nameEn} • {weapon.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={14} fill="currentColor" />
                      <span className="text-sm font-black">
                        {(() => {
                          const ratings = weaponRatings.filter(
                            (r) => r.weaponId === weapon.id
                          );
                          if (ratings.length === 0) return "0.0";
                          const avg =
                            ratings.reduce((acc, curr) => acc + curr.rating, 0) /
                            ratings.length;
                          return avg.toFixed(1);
                        })()}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold">
                      (
                      {
                        weaponRatings.filter((r) => r.weaponId === weapon.id)
                          .length
                      }{" "}
                      تقييم)
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">
                    القطع الموصى بها:
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {weapon.bestAttachments?.muzzle && (
                      <div className="flex flex-col gap-2 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary overflow-hidden shrink-0">
                            {currentAttachments.find(
                              (a) => a.id === weapon.bestAttachments?.muzzle
                            )?.image ? (
                              <OptimizedImage
                                src={
                                  currentAttachments.find(
                                    (a) =>
                                      a.id === weapon.bestAttachments?.muzzle
                                  )?.image || ""
                                }
                                alt="Muzzle"
                                className="w-8 h-8"
                              />
                            ) : (
                              <Target size={16} />
                            )}
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">
                              Muzzle
                            </p>
                            <p className="text-sm font-bold text-white">
                              {currentAttachments.find(
                                (a) => a.id === weapon.bestAttachments?.muzzle
                              )?.arabicName || weapon.bestAttachments.muzzle}
                            </p>
                          </div>
                        </div>
                        {currentAttachments.find(
                          (a) => a.id === weapon.bestAttachments?.muzzle
                        )?.effect && (
                          <p className="text-[10px] text-slate-400 bg-black/20 p-2 rounded-lg leading-relaxed mt-1 border-r-2 border-primary/50 text-right">
                            {
                              currentAttachments.find(
                                (a) => a.id === weapon.bestAttachments?.muzzle
                              )?.effect
                            }
                          </p>
                        )}
                      </div>
                    )}
                    {weapon.bestAttachments?.grip && (
                      <div className="flex flex-col gap-2 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary overflow-hidden shrink-0">
                            {currentAttachments.find(
                              (a) => a.id === weapon.bestAttachments?.grip
                            )?.image ? (
                              <OptimizedImage
                                src={
                                  currentAttachments.find(
                                    (a) => a.id === weapon.bestAttachments?.grip
                                  )?.image || ""
                                }
                                alt="Grip"
                                className="w-8 h-8"
                              />
                            ) : (
                              <Activity size={16} />
                            )}
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">
                              Grip
                            </p>
                            <p className="text-sm font-bold text-white">
                              {currentAttachments.find(
                                (a) => a.id === weapon.bestAttachments?.grip
                              )?.arabicName || weapon.bestAttachments.grip}
                            </p>
                          </div>
                        </div>
                        {currentAttachments.find(
                          (a) => a.id === weapon.bestAttachments?.grip
                        )?.effect && (
                          <p className="text-[10px] text-slate-400 bg-black/20 p-2 rounded-lg leading-relaxed mt-1 border-r-2 border-primary/50 text-right">
                            {
                              currentAttachments.find(
                                (a) => a.id === weapon.bestAttachments?.grip
                              )?.effect
                            }
                          </p>
                        )}
                      </div>
                    )}
                    {weapon.bestAttachments?.magazine && (
                      <div className="flex flex-col gap-2 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary overflow-hidden shrink-0">
                            {currentAttachments.find(
                              (a) => a.id === weapon.bestAttachments?.magazine
                            )?.image ? (
                              <OptimizedImage
                                src={
                                  currentAttachments.find(
                                    (a) =>
                                      a.id === weapon.bestAttachments?.magazine
                                  )?.image || ""
                                }
                                alt="Magazine"
                                className="w-8 h-8"
                              />
                            ) : (
                              <Zap size={16} />
                            )}
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">
                              Magazine
                            </p>
                            <p className="text-sm font-bold text-white">
                              {currentAttachments.find(
                                (a) =>
                                  a.id === weapon.bestAttachments?.magazine
                              )?.arabicName || weapon.bestAttachments.magazine}
                            </p>
                          </div>
                        </div>
                        {currentAttachments.find(
                          (a) => a.id === weapon.bestAttachments?.magazine
                        )?.effect && (
                          <p className="text-[10px] text-slate-400 bg-black/20 p-2 rounded-lg leading-relaxed mt-1 border-r-2 border-primary/50 text-right">
                            {
                              currentAttachments.find(
                                (a) => a.id === weapon.bestAttachments?.magazine
                              )?.effect
                            }
                          </p>
                        )}
                      </div>
                    )}
                    {weapon.bestAttachments?.stock && (
                      <div className="flex flex-col gap-2 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary overflow-hidden shrink-0">
                            {currentAttachments.find(
                              (a) => a.id === weapon.bestAttachments?.stock
                            )?.image ? (
                              <OptimizedImage
                                src={
                                  currentAttachments.find(
                                    (a) =>
                                      a.id === weapon.bestAttachments?.stock
                                  )?.image || ""
                                }
                                alt="Stock"
                                className="w-8 h-8"
                              />
                            ) : (
                              <Shield size={16} />
                            )}
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">
                              Stock
                            </p>
                            <p className="text-sm font-bold text-white">
                              {currentAttachments.find(
                                (a) => a.id === weapon.bestAttachments?.stock
                              )?.arabicName || weapon.bestAttachments.stock}
                            </p>
                          </div>
                        </div>
                        {currentAttachments.find(
                          (a) => a.id === weapon.bestAttachments?.stock
                        )?.effect && (
                          <p className="text-[10px] text-slate-400 bg-black/20 p-2 rounded-lg leading-relaxed mt-1 border-r-2 border-primary/50 text-right">
                            {
                              currentAttachments.find(
                                (a) => a.id === weapon.bestAttachments?.stock
                              )?.effect
                            }
                          </p>
                        )}
                      </div>
                    )}
                    {weapon.bestAttachments?.scope && (
                      <div className="flex flex-col gap-2 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary overflow-hidden shrink-0">
                            {currentAttachments.find(
                              (a) => a.id === weapon.bestAttachments?.scope
                            )?.image ? (
                              <OptimizedImage
                                src={
                                  currentAttachments.find(
                                    (a) =>
                                      a.id === weapon.bestAttachments?.scope
                                  )?.image || ""
                                }
                                alt="Scope"
                                className="w-8 h-8"
                              />
                            ) : (
                              <Eye size={16} />
                            )}
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">
                              Scope
                            </p>
                            <p className="text-sm font-bold text-white">
                              {currentAttachments.find(
                                (a) => a.id === weapon.bestAttachments?.scope
                              )?.arabicName || weapon.bestAttachments.scope}
                            </p>
                          </div>
                        </div>
                        {currentAttachments.find(
                          (a) => a.id === weapon.bestAttachments?.scope
                        )?.effect && (
                          <p className="text-[10px] text-slate-400 bg-black/20 p-2 rounded-lg leading-relaxed mt-1 border-r-2 border-primary/50 text-right">
                            {
                              currentAttachments.find(
                                (a) => a.id === weapon.bestAttachments?.scope
                              )?.effect
                            }
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 shadow-inner">
                  <div className="flex gap-3 items-start">
                    <Zap className="text-primary mt-0.5 shrink-0" size={16} />
                    <p className="text-xs font-bold text-slate-300 leading-relaxed">
                      {getWeaponProTip(weapon as Weapon)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedWeaponToRate(weapon);
                    setIsRatingModalOpen(true);
                  }}
                  className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:bg-primary hover:text-black hover:border-primary transition-all flex items-center justify-center gap-2"
                >
                  <Star size={14} />
                  <span>تقييم هذه التشكيلة</span>
                </button>
              </motion.div>
            ))}
        </div>
      </div>

      <SubtleAdBanner />
    </motion.div>
  );
}
