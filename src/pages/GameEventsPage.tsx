import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Info, Clock, AlertCircle, Zap, Flame, Shield, Compass, Sparkles, Trophy, Target, Star, Gift, Package, Activity } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';

function CountdownTimer({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60)
        });
      } else {
        setTimeLeft(null);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) return null;

  return (
    <div className="flex gap-2">
      <div className="bg-bg-dark/50 px-2 py-1 rounded text-xs">
        <span className="text-primary font-bold">{timeLeft.days}</span> يوم
      </div>
      <div className="bg-bg-dark/50 px-2 py-1 rounded text-xs">
        <span className="text-primary font-bold">{timeLeft.hours}</span> ساعة
      </div>
    </div>
  );
}


export default function GameEventsPage(props: any) {
  const { gameEvents, getTimeRemaining } = props;
  return (
<motion.div
              key="game-events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto space-y-12"
            >
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-4xl font-black gold-shimmer">
                  فعاليات اللعبة
                </h2>
                <p className="text-slate-500 max-w-2xl mx-auto">
                  تابع أحدث فعاليات الصناديق والرويال باس في ببجي موبايل مع
                  التوقيت الدقيق لانتهاء كل فعالية.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "الرويال باس - الموسم الحالي",
                    desc: "الموسم الجديد من الرويال باس مع مكافآت أسطورية وحصرية.",
                    endDate: "2026-05-20T00:00:00Z",
                    icon: <Zap className="text-yellow-500" size={32} />,
                    color: "from-yellow-500/20 to-transparent",
                    borderColor: "border-yellow-500/20",
                    category: "الموسم",
                  },
                  {
                    title: "مود: مدينة المستقبل (Cyber City)",
                    desc: "استكشف خريطة إرانغل بحلتها الجديدة مع تقنيات المستقبل والمركبات الطائرة.",
                    endDate: "2026-06-15T00:00:00Z",
                    icon: <Flame className="text-orange-500" size={32} />,
                    color: "from-orange-500/20 to-transparent",
                    borderColor: "border-orange-500/20",
                    category: "مود خاص",
                  },
                  {
                    title: "مترو رويال (Metro Royale)",
                    desc: "الموسم الجديد من مترو رويال مع أسلحة ومعدات جديدة كلياً.",
                    endDate: "2026-05-30T00:00:00Z",
                    icon: <Shield className="text-slate-400" size={32} />,
                    color: "from-slate-400/20 to-transparent",
                    borderColor: "border-slate-400/20",
                    category: "مود دائم",
                  },
                  {
                    title: "عالم العجائب (WOW)",
                    desc: "خرائط وتحديات جديدة من تصميم اللاعبين مع مكافآت أسبوعية.",
                    endDate: "2026-12-31T00:00:00Z",
                    icon: <Compass className="text-indigo-500" size={32} />,
                    color: "from-indigo-500/20 to-transparent",
                    borderColor: "border-indigo-500/20",
                    category: "مود إبداعي",
                  },
                  {
                    title: "تعاون: سيارات Lamborghini",
                    desc: "احصل على أسرع وأفخم سيارات لامبورغيني الآن في ساحة المعركة.",
                    endDate: "2026-04-30T00:00:00Z",
                    icon: <Sparkles className="text-cyan-500" size={32} />,
                    color: "from-cyan-500/20 to-transparent",
                    borderColor: "border-cyan-500/20",
                    category: "تعاون",
                  },
                  {
                    title: "الصندوق المميز (Premium Crate)",
                    desc: "أقوى البدلات والأسلحة القابلة للتطوير متوفرة الآن في الصندوق المميز.",
                    endDate: "2026-04-25T00:00:00Z",
                    icon: <Trophy className="text-purple-500" size={32} />,
                    color: "from-purple-500/20 to-transparent",
                    borderColor: "border-purple-500/20",
                    category: "صناديق",
                  },
                  {
                    title: "عجلة الحظ: M416 Glacier",
                    desc: "فرصة الحصول على سلاح M416 الثلجي الأسطوري وتطويره للمستوى الأقصى.",
                    endDate: "2026-05-05T00:00:00Z",
                    icon: <Target className="text-blue-400" size={32} />,
                    color: "from-blue-400/20 to-transparent",
                    borderColor: "border-blue-400/20",
                    category: "عجلة الحظ",
                  },
                  {
                    title: "الصندوق الكلاسيكي (Classic Crate)",
                    desc: "مجموعة من العناصر الكلاسيكية النادرة التي يبحث عنها الجميع.",
                    endDate: "2026-05-10T00:00:00Z",
                    icon: <Star className="text-blue-500" size={32} />,
                    color: "from-blue-500/20 to-transparent",
                    borderColor: "border-blue-500/20",
                    category: "صناديق",
                  },
                  {
                    title: "فعالية: هدايا الربيع",
                    desc: "سجل دخول يومياً للحصول على قسائم صناديق وعناصر تجميلية مجانية.",
                    endDate: "2026-04-20T00:00:00Z",
                    icon: <Gift className="text-pink-500" size={32} />,
                    color: "from-pink-500/20 to-transparent",
                    borderColor: "border-pink-500/20",
                    category: "فعالية",
                  },
                  {
                    title: "صندوق الإمداد (Supply Crate)",
                    desc: "عناصر متنوعة ومفيدة لتجهيز شخصيتك بأفضل المظاهر.",
                    endDate: "2026-04-18T00:00:00Z",
                    icon: <Package className="text-green-500" size={32} />,
                    color: "from-green-500/20 to-transparent",
                    borderColor: "border-green-500/20",
                    category: "صناديق",
                  },
                  {
                    title: "محطة الـ UC (UC Station)",
                    desc: "احصل على مكافآت إضافية تصل إلى 200% عند شحن الـ UC خلال فترة الفعالية.",
                    endDate: "2026-04-15T00:00:00Z",
                    icon: <Activity className="text-yellow-400" size={32} />,
                    color: "from-yellow-400/20 to-transparent",
                    borderColor: "border-yellow-400/20",
                    category: "شحن",
                  },
                ].map((event, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`pro-card p-6 bg-gradient-to-br ${event.color} ${event.borderColor} border relative overflow-hidden group flex flex-col h-full`}
                  >
                    <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                      {event.icon}
                    </div>

                    <div className="flex-1 space-y-4 relative z-10">
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                          {event.icon}
                        </div>
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-400">
                          {event.category}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-black leading-tight">
                          {event.title}
                        </h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          {event.desc}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 relative z-10">
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2">
                        الوقت المتبقي للانتهاء
                      </p>
                      <CountdownTimer endDate={event.endDate} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
  );
}
