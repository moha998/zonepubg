import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Gift, Infinity as InfinityIcon, LogIn, ExternalLink, Calendar, Users, Trophy, User, Lock, Timer, Zap, Trash2, Plus, BarChart3, CheckCircle2, Loader2 } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';

// Mock values for UI
const POLLS = [];

export default function GiveawaysPage(props: any) {
  const { 
    activeGiveaway, 
    isJoiningGiveaway, 
    handleJoinGiveaway, 
    hasJoinedGiveaway, 
    previousGiveaways, 
    getGiveawayStatus, 
    user, 
    handleLogin,
    isAdmin,
    isCompetitionActive,
    giveaways,
    showNotification,
    deleteItem,
    addGiveaway,
    getIconComponent,
    templates,
    setShowAddTemplateModal
  } = props;
  
  const [giveawayPlayerName, setGiveawayPlayerName] = useState("");
  const [giveawayPlayerId, setGiveawayPlayerId] = useState("");
  const [isSubmittingEntry, setIsSubmittingEntry] = useState(false);
  const [newGiveaway, setNewGiveaway] = useState<any>({});
  const [showAddGiveawayModal, setShowAddGiveawayModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState<any>({});

  const handlePickWinner = async () => {};
  const giveawayWinners: any[] = [];
  const handleSubmitGiveawayEntry = async () => {
    setIsSubmittingEntry(true);
    setTimeout(() => setIsSubmittingEntry(false), 1000);
  };

  const SubtleAdBanner = () => null;

  return (
<motion.div
              key="giveaways"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto space-y-16"
            >
              {/* Monthly Royal Pass Giveaway Section */}
              {!isCompetitionActive("royal-pass") && !isAdmin ? (
                <div className="pro-card p-12 bg-bg-card/50 border-white/5 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-slate-700 mb-6">
                    <Lock size={40} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-500 mb-2">
                    المسابقة مغلقة حالياً
                  </h2>
                  <p className="text-slate-600 max-w-md">
                    ترقبوا السحب القادم قريباً. سيتم الإعلان عن الموعد الجديد
                    عبر قنواتنا الرسمية.
                  </p>
                </div>
              ) : (
                <section className="pro-card p-8 bg-gradient-to-br from-bg-card via-primary/5 to-bg-card border-primary/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                  <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
                    {/* Left: Form */}
                    <div className="flex-1 w-full space-y-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                          <Gift size={28} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">
                            سحب الرويال باس الشهري
                          </h2>
                          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                            Monthly Royal Pass Giveaway
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-slate-400 leading-relaxed">
                        سجل الآن للحصول على فرصة للفوز بالرويال باس لهذا الشهر
                        مجاناً! سيتم اختيار الفائز عشوائياً من بين المشاركين.
                      </p>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                              الاسم في اللعبة
                            </label>
                            <input
                              type="text"
                              value={giveawayPlayerName}
                              onChange={(e) =>
                                setGiveawayPlayerName(e.target.value)
                              }
                              placeholder="مثال: PUBG_PRO_1"
                              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                              ID اللاعب
                            </label>
                            <input
                              type="text"
                              value={giveawayPlayerId}
                              onChange={(e) =>
                                setGiveawayPlayerId(e.target.value)
                              }
                              placeholder="مثال: 5123456789"
                              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                            />
                          </div>
                        </div>

                        <button
                          onClick={handleSubmitGiveawayEntry}
                          disabled={isSubmittingEntry || !user}
                          className="w-full py-4 bg-primary text-black rounded-xl font-bold hover:bg-white transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isSubmittingEntry ? (
                            <Loader2 size={20} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={20} />
                          )}
                          {user
                            ? "تأكيد المشاركة في السحب"
                            : "يرجى تسجيل الدخول للمشاركة"}
                        </button>

                        {isAdmin && (
                          <button
                            onClick={handlePickWinner}
                            className="w-full py-2 border border-primary/30 text-primary rounded-xl text-xs font-bold hover:bg-primary/10 transition-all mt-2"
                          >
                            سحب فائز جديد (للمسؤول فقط)
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Right: Last Winner Display */}
                    <div className="w-full md:w-80 flex flex-col items-center justify-center">
                      <div className="pro-card p-8 bg-gradient-to-b from-yellow-400/20 to-transparent border-yellow-500/30 flex flex-col items-center text-center relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-yellow-200/5 to-yellow-400/10 opacity-50 animate-pulse-slow" />

                        <Trophy
                          className="text-yellow-500 mb-4 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                          size={48}
                        />
                        <h3 className="text-sm font-black text-yellow-500 uppercase tracking-[0.2em] mb-6">
                          الفائز الأخير
                        </h3>

                        {giveawayWinners.length > 0 ? (
                          <div className="relative z-10">
                            <p className="text-2xl font-black text-white mb-2 tracking-tight uppercase">
                              {giveawayWinners[0].playerName}
                            </p>
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-yellow-500/80 uppercase tracking-widest">
                                {giveawayWinners[0].prize}
                              </span>
                              <span className="text-[9px] text-slate-500 font-bold">
                                التاريخ: {giveawayWinners[0].date}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 font-bold italic">
                            في انتظار السحب القادم...
                          </p>
                        )}

                        <div className="mt-8 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow" />
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            Verified Winner
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}
              <div className="space-y-12 mb-16">
                {!isAdmin ? (
                  <div className="pro-card p-8 border-dashed border-2 border-white/5 flex flex-col items-center justify-center text-center">
                    <Lock className="text-slate-700 mb-4" size={32} />
                    <h3 className="text-lg font-bold text-slate-500 mb-4">
                      لوحة تحكم المسؤول
                    </h3>
                    <button
                      onClick={handleLogin}
                      className="bg-white/5 hover:bg-primary hover:text-black px-6 py-2 rounded-xl text-xs font-bold transition-all border border-white/10"
                    >
                      تسجيل الدخول كمسؤول لرؤية القوالب
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <button
                        onClick={() => setShowAddGiveawayModal(true)}
                        className="p-6 pro-card border-primary/20 bg-primary/5 flex flex-col items-center gap-3 hover:bg-primary/10 transition-colors group"
                      >
                        <Plus
                          className="text-primary group-hover:scale-110 transition-transform"
                          size={24}
                        />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          إضافة سحب
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          showNotification(
                            "بدء عملية سحب الفائز عشوائياً",
                            "info"
                          )
                        }
                        className="p-6 pro-card border-primary/20 bg-primary/5 flex flex-col items-center gap-3 hover:bg-primary/10 transition-colors group"
                      >
                        <Trophy
                          className="text-primary group-hover:scale-110 transition-transform"
                          size={24}
                        />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          سحب الفائز
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          showNotification(
                            "اختر سحب من القائمة أدناه لحذفه",
                            "info"
                          )
                        }
                        className="p-6 pro-card border-red-500/20 bg-red-500/5 flex flex-col items-center gap-3 hover:bg-red-500/10 transition-colors group"
                      >
                        <Trash2
                          className="text-red-500 group-hover:scale-110 transition-transform"
                          size={24}
                        />
                        <span className="text-xs font-bold uppercase tracking-wider text-red-500">
                          حذف سحب
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          showNotification(
                            "سيتم فتح نافذة إضافة تصويت جديد",
                            "info"
                          )
                        }
                        className="p-6 pro-card border-primary/20 bg-primary/5 flex flex-col items-center gap-3 hover:bg-primary/10 transition-colors group"
                      >
                        <BarChart3
                          className="text-primary group-hover:scale-110 transition-transform"
                          size={24}
                        />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          إضافة تصويت
                        </span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {templates
                        .filter((t) => t.type === "giveaway")
                        .map((tmpl) => (
                          <div key={tmpl.id} className="relative group">
                            <button
                              onClick={() => {
                                setNewGiveaway({
                                  title: tmpl.label,
                                  prize: tmpl.desc,
                                  image: "",
                                });
                                setShowAddGiveawayModal(true);
                              }}
                              className="w-full pro-card p-6 border-white/5 bg-white/2 hover:border-primary/30 hover:bg-primary/5 transition-all flex flex-col items-center text-center"
                            >
                              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-black transition-all mb-4">
                                {getIconComponent(tmpl.icon)}
                              </div>
                              <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">
                                {tmpl.label}
                              </h4>
                              <p className="text-[10px] text-slate-500">
                                {tmpl.desc}
                              </p>
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => deleteItem("templates", tmpl.id)}
                                className="absolute top-2 right-2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setNewTemplate({
                              ...newTemplate,
                              type: "giveaway",
                            });
                            setShowAddTemplateModal(true);
                          }}
                          className="pro-card p-6 border-dashed border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all flex flex-col items-center justify-center text-center group"
                        >
                          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all mb-4">
                            <Plus size={24} />
                          </div>
                          <h4 className="font-bold text-sm text-primary">
                            إضافة قالب
                          </h4>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Giveaways Section */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Gift className="text-primary" size={32} /> السحوبات الحالية
                  </h2>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                    Active Giveaways
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {giveaways.length > 0 ? (
                    giveaways.map((giveaway) => (
                      <motion.div
                        key={giveaway.id}
                        whileHover={{ scale: 1.02 }}
                        className="pro-card overflow-hidden group"
                      >
                        <div className="relative h-48">
                          <OptimizedImage
                            src={giveaway.image}
                            alt={giveaway.title}
                            className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent" />
                          <div
                            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              giveaway.status === "active"
                                ? "bg-primary text-black"
                                : "bg-slate-500 text-white"
                            }`}
                          >
                            {giveaway.status === "active" ? "نشط" : "منتهي"}
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-2">
                            {giveaway.title}
                          </h3>
                          <div className="flex items-center justify-between text-sm mb-6">
                            <div className="flex items-center gap-2 text-slate-400">
                              <Timer size={16} />
                              <span>ينتهي في: {giveaway.endDate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-primary">
                              <Users size={16} />
                              <span>{giveaway.participants} مشارك</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                showNotification(
                                  "تم تسجيل مشاركتك بنجاح! سيتم الإعلان عن الفائز في تاريخ الانتهاء.",
                                  "success"
                                )
                              }
                              className="flex-1 bg-primary text-black font-bold py-3 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2"
                            >
                              <Zap size={18} /> دخول السحب الآن
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() =>
                                  deleteItem("giveaways", giveaway.id)
                                }
                                className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                              >
                                <Trash2 size={20} />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-20 pro-card border-dashed border-2 border-white/5 flex flex-col items-center justify-center text-center">
                      <Gift className="text-slate-700 mb-4" size={48} />
                      <h3 className="text-xl font-bold text-slate-500 mb-2">
                        لا توجد سحوبات حالياً
                      </h3>
                      <p className="text-slate-600 text-sm">
                        ترقبوا السحوبات القادمة والجوائز القيمة قريباً!
                      </p>
                    </div>
                  )}

                  {isAdmin && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={addGiveaway}
                      className="p-8 pro-card border-dashed border-2 border-primary/30 bg-primary/5 flex flex-col items-center justify-center gap-4 cursor-pointer group min-h-[300px]"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-lg group-hover:bg-white transition-colors">
                        <Plus size={24} />
                      </div>
                      <div className="text-center">
                        <h4 className="font-bold text-primary">
                          إضافة سحب جديد
                        </h4>
                        <p className="text-[10px] text-primary/60 mt-1 uppercase font-bold">
                          Admin Only
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </section>

              {/* Voting Section */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold flex items-center gap-3">
                    <BarChart3 className="text-primary" size={32} /> تصويت
                    المجتمع
                  </h2>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                    Community Polls
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {POLLS.length > 0 ? (
                    POLLS.map((poll) => (
                      <div key={poll.id} className="pro-card p-8">
                        <h3 className="text-xl font-bold mb-6 text-center">
                          {poll.question}
                        </h3>
                        <div className="space-y-4">
                          {poll.options.map((option) => {
                            const percentage = Math.round(
                              (option.votes / poll.totalVotes) * 100
                            );
                            return (
                              <div key={option.id} className="space-y-2">
                                <div className="flex justify-between text-sm font-bold">
                                  <span>{option.text}</span>
                                  <span className="text-primary">
                                    {percentage}%
                                  </span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    className="h-full bg-primary"
                                  />
                                </div>
                                <button
                                  onClick={() =>
                                    showNotification(
                                      "شكراً لتصويتك!",
                                      "success"
                                    )
                                  }
                                  className="w-full py-2 text-[10px] text-slate-500 hover:text-primary font-bold uppercase tracking-widest transition-colors"
                                >
                                  تصويت
                                </button>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          <span>إجمالي الأصوات: {poll.totalVotes}</span>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 size={12} className="text-primary" />
                            <span>التصويت متاح</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-20 pro-card border-dashed border-2 border-white/5 flex flex-col items-center justify-center text-center">
                      <BarChart3 className="text-slate-700 mb-4" size={48} />
                      <h3 className="text-xl font-bold text-slate-500 mb-2">
                        لا توجد استطلاعات رأي
                      </h3>
                      <p className="text-slate-600 text-sm">
                        شاركنا رأيك في الاستطلاعات القادمة لتطوير اللعبة!
                      </p>
                    </div>
                  )}

                  {isAdmin && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        showNotification(
                          "ميزة إضافة التصويت ستتوفر قريباً",
                          "info"
                        )
                      }
                      className="p-8 pro-card border-dashed border-2 border-primary/30 bg-primary/5 flex flex-col items-center justify-center gap-4 cursor-pointer group min-h-[300px]"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-lg group-hover:bg-white transition-colors">
                        <Plus size={24} />
                      </div>
                      <div className="text-center">
                        <h4 className="font-bold text-primary">
                          إضافة تصويت جديد
                        </h4>
                        <p className="text-[10px] text-primary/60 mt-1 uppercase font-bold">
                          Admin Only
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </section>

              <SubtleAdBanner />
            </motion.div>
  );
}
