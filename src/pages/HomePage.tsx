import React from 'react';
import { motion } from 'motion/react';
import { 
  Newspaper, 
  ChevronLeft, 
  Star, 
  Trophy, 
  Megaphone, 
  Zap, 
  Gift, 
  Tag, 
  ExternalLink, 
  ChevronRight, 
  Crosshair, 
  Smartphone 
} from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';


import TopBanners from '../components/TopBanners';

interface HomePageProps {
  news: any[];
  loadingNews: boolean;
  clips: any[];
  ads: any[];
  rankings: any[];
  competitionSettings: any[];
  isAdmin: boolean;
  setActiveTab: (tab: string) => void;
  SubtleAdBanner: React.FC;
  TournamentFlashBanner: React.FC<{ settings: any[] }>;
  OfficialGlobalTournaments: React.FC<{ isHidden: boolean }>;
}

export default function HomePage({
  news,
  loadingNews,
  clips,
  ads,
  rankings,
  competitionSettings,
  isAdmin,
  setActiveTab,
  SubtleAdBanner,
  TournamentFlashBanner,
  OfficialGlobalTournaments
}: HomePageProps) {
  return (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-16 md:space-y-24 py-6 md:py-12"
    >
      <TopBanners rankings={rankings} ads={ads} isAdmin={isAdmin} competitionSettings={competitionSettings} />

      <section className="relative overflow-hidden mx-4 sm:mx-0 rounded-3xl bg-[#0A0C10] border border-white/5 shadow-2xl flex flex-col justify-center min-h-[400px] md:min-h-[500px]">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full h-full"
          >
            <img
              src="/logo.png"
              alt="PUBG Decor"
              className="w-full h-full object-cover opacity-[0.15] mix-blend-screen mix-blend-luminosity"
              style={{ objectPosition: 'center 20%' }}
            />
          </motion.div>
        </div>

        <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-l from-[#0A0C10] via-[#0A0C10]/80 to-transparent" />
        <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-t from-[#0A0C10] via-transparent to-[#0A0C10]/50" />
        
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ 
              y: [0, -30, 0], 
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ 
              y: [0, 40, 0], 
              opacity: [0.1, 0.2, 0.1],
              scale: [1, 1.3, 1] 
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[140px]"
          />
        </div>

        <div className="relative z-10 w-full px-6 md:px-20 py-12 md:py-16">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-primary/20 text-primary text-[10px] md:text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md shadow-lg shadow-primary/10"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              المنصة رقم #1 للاعبي ببجي
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-7xl font-black leading-[1.1] mb-6 drop-shadow-2xl"
            >
              احترف اللعبة <br />{" "}
              <span className="gold-shimmer block mt-2">بأفضل الإعدادات</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base md:text-xl text-slate-300 mb-10 leading-relaxed max-w-xl bg-black/20 p-4 rounded-2xl backdrop-blur-sm border border-white/5"
            >
              كل ما تحتاجه للارتقاء بمستواك في ببجي موبايل:
              <br />
              <span className="text-primary/90 font-bold">إعدادات حساسية</span> • <span className="text-primary/90 font-bold">أخبار وتسريبات</span> • <span className="text-primary/90 font-bold">مقارنة أسلحة</span>
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                animate={{
                  boxShadow: ["0px 0px 0px rgba(255,179,71,0)", "0px 0px 30px rgba(255,179,71,0.3)", "0px 0px 0px rgba(255,179,71,0)"]
                }}
                transition={{ boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
                onClick={() => setActiveTab("sensitivity")}
                className="relative overflow-hidden group bg-primary text-black font-black px-10 py-5 rounded-2xl text-lg md:text-xl w-full md:w-auto transition-colors shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  ابدأ الآن
                </span>
              </motion.button>
            </motion.div>
          </div>
        </div>

        <div className="relative z-10 px-6 md:px-20 pb-4">
          <SubtleAdBanner />
        </div>
      </section>

      {!loadingNews && news && news.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Newspaper className="text-primary" size={24} />
              آخر الأخبار والفعاليات
            </h3>
            <button 
              onClick={() => setActiveTab("news")}
              className="text-sm font-bold text-primary hover:text-white flex items-center gap-1 transition-colors"
            >
              عرض الكل <ChevronLeft size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {news.slice(0, 3).map((item) => (
              <motion.div 
                key={item.id}
                whileHover={{ y: -5 }}
                onClick={() => setActiveTab("news")}
                className="pro-card p-5 cursor-pointer flex flex-col justify-between min-h-[160px] group border border-white/5 hover:border-primary/30 transition-all shadow-lg hover:shadow-primary/10 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-[40px] group-hover:bg-primary/20 transition-all opacity-0 group-hover:opacity-100" />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                      item.category === "leaks"
                        ? "bg-purple-600/20 text-purple-400"
                        : item.category === "updates"
                        ? "bg-red-500/20 text-red-400"
                        : item.category === "events"
                        ? "bg-orange-400/20 text-orange-400"
                        : "bg-primary/20 text-primary"
                    }`}>
                      {item.category === 'leaks' ? 'تسريبات' : item.category === 'updates' ? 'تحديثات' : item.category === 'events' ? 'فعاليات' : 'أخبار'}
                    </span>
                    <span className="text-xs text-slate-500">{item.date}</span>
                  </div>
                  <h4 className="font-bold text-base line-clamp-2 leading-relaxed mb-2 text-white group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {item.content}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <TournamentFlashBanner settings={competitionSettings} />

      <OfficialGlobalTournaments isHidden={(competitionSettings.find(s => s.id === 'global')?.isTournamentsHidden || false) && !isAdmin} />

      {clips.some((c) => c.isWinner) && (
        <section className="relative overflow-hidden rounded-3xl bg-[#0A0C10] border border-primary/20 p-6 md:p-12 text-center shadow-2xl shadow-primary/5 premium-glow">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
          <div className="relative z-10 space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full btn-gold shadow-xl shadow-primary/40"
            >
              <Star size={20} fill="currentColor" />
              <span className="text-black">نجم الجولة</span>
              <Star size={20} fill="currentColor" />
            </motion.div>

            <div className="flex flex-col items-center gap-6">
              {clips
                .filter((c) => c.isWinner)
                .map((winner) => (
                  <div
                    key={winner.id}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full border-4 border-primary p-1 shadow-lg shadow-primary/20">
                        <OptimizedImage
                          src={
                            winner.userPhoto ||
                            `https://ui-avatars.com/api/?name=${winner.userName}&background=F2A900&color=000`
                          }
                          alt={winner.userName}
                          className="w-full h-full rounded-full"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-primary text-black p-1.5 rounded-lg shadow-lg">
                        <Trophy size={16} />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-3xl font-black text-white tracking-tight mb-1 gold-shimmer">
                        {winner.userName}
                      </h3>
                      <p className="text-primary font-bold text-sm uppercase tracking-widest">
                        Star of the Round
                      </p>
                    </div>

                    <div className="max-w-2xl w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                      <iframe
                        src={
                          winner.videoUrl.includes("youtube.com") ||
                          winner.videoUrl.includes("youtu.be")
                            ? winner.videoUrl
                                .replace("watch?v=", "embed/")
                                .replace("watch?v=", "embed/")
                                .replace(
                                  "youtu.be/",
                                  "youtube.com/embed/"
                                )
                            : winner.videoUrl
                        }
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>

                    <p className="text-text-muted italic text-lg">
                      "{winner.title}"
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {ads.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center justify-between px-4 md:px-0">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(242,169,0,0.5)]" />
              <h2 className="text-xl md:text-2xl font-black tracking-tight">
                عروض وخدمات مميزة
              </h2>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                إعلان ممول
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6 px-4 md:px-0">
            {ads.map((ad, i) => (
              <motion.a
                key={ad.id}
                href={ad.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative md:overflow-hidden rounded-3xl bg-bg-card border border-white/5 p-8 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5"
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500 shadow-inner">
                      {ad.icon === "Megaphone" ? (
                        <Megaphone size={28} />
                      ) : ad.icon === "Zap" ? (
                        <Zap size={28} />
                      ) : ad.icon === "Gift" ? (
                        <Gift size={28} />
                      ) : (
                        <Tag size={28} />
                      )}
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 text-slate-500 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                      <ExternalLink size={18} />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                    {ad.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 min-h-[40px]">
                    {ad.description ||
                      "اضغط لمشاهدة التفاصيل والاستفادة من العرض الحصري المقدم لمجتمعنا."}
                  </p>

                  <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      اكتشف الآن
                    </span>
                    <ChevronRight
                      size={16}
                      className="text-primary translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all"
                    />
                  </div>
                </div>

                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-all duration-700" />
              </motion.a>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-8">
        <div className="flex items-center gap-3 px-4 md:px-0">
          <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(242,169,0,0.5)]" />
          <h2 className="text-xl md:text-2xl font-black tracking-tight">لماذا ببجيكوم؟</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-0">
          {[
            {
              title: "حساسية مخصصة",
              desc: "إعدادات دقيقة لكل جهاز (iPhone, iPad, Samsung) لضمان أفضل أداء.",
              icon: <Smartphone className="text-primary" size={28} />,
            },
            {
              title: "أخبار فورية",
              desc: "تغطية شاملة لكل الفعاليات، الأطوار الجديدة، وعروض الشدات الرسمية.",
              icon: <Newspaper className="text-primary" size={28} />,
            },
            {
              title: "أكواد المحترفين",
              desc: "انسخ أكواد حساسية أفضل اللاعبين العالميين بضغطة واحدة.",
              icon: <Crosshair className="text-primary" size={28} />,
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 pro-card hover:translate-y-[-4px]"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-12 border-y border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          { label: "جهاز مدعوم", value: "50+" },
          { label: "لاعب محترف", value: "20+" },
          { label: "تحديث يومي", value: "100%" },
          { label: "مستخدم نشط", value: "10K+" },
        ].map((stat, i) => (
          <div key={i}>
            <p className="text-4xl font-bold text-primary mb-1">
              {stat.value}
            </p>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      <SubtleAdBanner />

      <section className="text-center py-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          جاهز لتصبح محترفاً؟
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto mb-10 text-lg">
          انضم إلى آلاف اللاعبين الذين طوروا مستواهم باستخدام إعداداتنا.
          كل ما تحتاجه في مكان واحد.
        </p>
        <button
          onClick={() => setActiveTab("sensitivity")}
          className="px-10 py-4 bg-gold-gradient text-black rounded-xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-primary/30 premium-glow"
        >
          ابدأ رحلة الاحتراف الآن
        </button>
      </section>
    </motion.div>
  );
}
