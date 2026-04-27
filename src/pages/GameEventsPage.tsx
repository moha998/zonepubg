import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Zap, Flame, Shield, Sparkles, Trophy, Target, Star, Gift, Package, Activity, Timer, EyeOff, Eye } from 'lucide-react';

function CountdownTimer({ endDate }: { endDate: string }) {
// ... existing countdown logic
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft(null);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) {
    return (
      <div className="flex items-center gap-2 text-red-500 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 w-fit">
        <Clock size={14} />
        <span className="text-xs font-bold">انتهت الفعالية</span>
      </div>
    );
  }

  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-2 w-fit" dir="ltr">
      <Timer size={14} className="text-primary mr-1" />
      <div className="flex items-center gap-1.5 font-mono text-sm xl:text-base font-black text-center tracking-wider">
        {timeLeft.days > 0 && (
          <>
            <div className="bg-[#0A0C10] text-primary border border-primary/20 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(212,175,55,0.15)] min-w-[2.5rem]">
              {pad(timeLeft.days)}<span className="text-[10px] text-slate-500 ml-1 font-sans">d</span>
            </div>
            <span className="text-primary/50 animate-pulse">:</span>
          </>
        )}
        <div className="bg-[#0A0C10] text-white border border-white/10 px-2 py-0.5 rounded min-w-[2.5rem]">
          {pad(timeLeft.hours)}<span className="text-[10px] text-slate-500 ml-1 font-sans">h</span>
        </div>
        <span className="text-primary/50 animate-pulse">:</span>
        <div className="bg-[#0A0C10] text-white border border-white/10 px-2 py-0.5 rounded min-w-[2.5rem]">
          {pad(timeLeft.minutes)}<span className="text-[10px] text-slate-500 ml-1 font-sans">m</span>
        </div>
        <span className="text-primary/50 animate-pulse">:</span>
        <div className="bg-[#0A0C10] text-white border border-white/10 px-2 py-0.5 rounded min-w-[2.5rem]">
          {pad(timeLeft.seconds)}<span className="text-[10px] text-slate-500 ml-1 font-sans">s</span>
        </div>
      </div>
    </div>
  );
}

export default function GameEventsPage(props: any) {
  const { gameEvents, getTimeRemaining, isAdmin, onToggleVisibility } = props;

  const getEventIcon = (category: string) => {
    switch (category) {
      case "الموسم": return <Zap className="text-yellow-500" size={40} strokeWidth={1.5} />;
      case "مود اللعب": return <Flame className="text-orange-500" size={40} strokeWidth={1.5} />;
      case "صناديق": return <Trophy className="text-purple-500" size={40} strokeWidth={1.5} />;
      case "تعاون": return <Sparkles className="text-cyan-500" size={40} strokeWidth={1.5} />;
      default: return <Star className="text-blue-500" size={40} strokeWidth={1.5} />;
    }
  };

  const getEventColors = (category: string) => {
    switch (category) {
      case "الموسم": return { border: "border-yellow-500/20 group-hover:border-yellow-500/50", bg: "from-yellow-500/5" };
      case "مود اللعب": return { border: "border-orange-500/20 group-hover:border-orange-500/50", bg: "from-orange-500/5" };
      case "صناديق": return { border: "border-purple-500/20 group-hover:border-purple-500/50", bg: "from-purple-500/5" };
      case "تعاون": return { border: "border-cyan-500/20 group-hover:border-cyan-500/50", bg: "from-cyan-500/5" };
      default: return { border: "border-blue-500/20 group-hover:border-blue-500/50", bg: "from-blue-500/5" };
    }
  };

  return (
    <motion.div
      key="game-events"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="max-w-7xl mx-auto space-y-12 pb-12"
    >
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#050608] border border-white/5 shadow-2xl p-8 md:p-16 flex flex-col items-center text-center">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-t from-[#050608] via-transparent to-[#050608]/50" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-xl backdrop-blur-md">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="text-xs font-bold text-slate-300 tracking-[0.2em] uppercase">تحديثات حية من اللعبة</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
            فعاليات <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-200 to-primary font-sans pb-2">ببجي موبايل</span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-medium">
            العد التنازلي الدقيق لكل ما هو جديد في عالم ببجي. صناديق، ومودات، وتحديثات السيزون والرويال باس المباشرة.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gameEvents.map((event: any, idx: number) => {
          const colors = getEventColors(event.category || "عام");
          return (
            <motion.div
              key={event.id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className={`group flex flex-col h-full rounded-[2rem] bg-[#0A0C10] border-2 transition-all duration-500 shadow-xl overflow-hidden ${colors.border} hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:-translate-y-2 relative ${event.isHidden ? 'opacity-60 grayscale-[0.5]' : ''}`}
            >
              <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${colors.bg} via-transparent to-transparent opacity-50 pointer-events-none transition-opacity duration-500 group-hover:opacity-100`} />
              
              <div className="p-8 flex flex-col h-full relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner group-hover:scale-110 transition-transform duration-500">
                    {getEventIcon(event.category || "عام")}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300 backdrop-blur-md shadow-xl">
                      {event.category || "فعالية"}
                    </span>
                    {isAdmin && (
                      <button
                        onClick={() => onToggleVisibility("events", event.id, event.isHidden || false)}
                        className={`p-1.5 rounded bg-black/80 transition-all border ${event.isHidden ? 'border-red-500 text-red-500' : 'border-primary text-primary hover:bg-primary hover:text-black'}`}
                        title={event.isHidden ? "إظهار" : "إخفاء"}
                      >
                        {event.isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-8 flex-1">
                  <h3 className="text-xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-l group-hover:from-white group-hover:to-slate-400 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">
                    {event.description || event.desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 mt-auto">
                  <div className="flex flex-col gap-3">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                      الوقت المتبقي لانتهاء الفعالية
                    </p>
                    <CountdownTimer endDate={event.endDate} />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        {gameEvents.length === 0 && !isAdmin && (
           <div className="col-span-full py-20 text-center text-slate-500 font-bold">
              لا توجد فعاليات نشطة حالياً.
           </div>
        )}
      </div>
    </motion.div>
  );
}
