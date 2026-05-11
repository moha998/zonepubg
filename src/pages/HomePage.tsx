import React, { useState, useEffect } from 'react';
import { Download, Monitor, Smartphone, Tablet, ChevronLeft, Map as MapIcon, Crosshair, Shield, Sparkles, FileText, Trophy, Users, Zap, Eye, Clock } from 'lucide-react';
import { NewsItem, Clip, Ad } from '../types';
import OptimizedImage from '../components/OptimizedImage';

const Countdown = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };
    
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex gap-2 text-center" dir="ltr">
      <div className="bg-black/50 rounded p-1 w-10">
        <div className="font-mono font-bold text-pubg-gold text-xs">{timeLeft.days}</div>
        <div className="text-[8px] text-[#888]">Days</div>
      </div>
      <div className="bg-black/50 rounded p-1 w-10">
        <div className="font-mono font-bold text-white text-xs">{timeLeft.hours}</div>
        <div className="text-[8px] text-[#888]">Hrs</div>
      </div>
      <div className="bg-black/50 rounded p-1 w-10">
        <div className="font-mono font-bold text-white text-xs">{timeLeft.minutes}</div>
        <div className="text-[8px] text-[#888]">Min</div>
      </div>
      <div className="bg-black/50 rounded p-1 w-10">
        <div className="font-mono font-bold text-white text-xs">{timeLeft.seconds}</div>
        <div className="text-[8px] text-[#888]">Sec</div>
      </div>
    </div>
  );
};

interface HomePageProps {
  news: NewsItem[];
  loadingNews: boolean;
  clips: Clip[];
  ads: Ad[];
  rankings: any[];
  competitionSettings: any[];
  isAdmin: boolean;
  onSyncRankings: () => void;
  setActiveTab: (tab: string, search?: string) => void;
  SubtleAdBanner: any;
  TournamentFlashBanner: any;
  OfficialGlobalTournaments: any;
  onToggleVisibility: (type: string, id: string, isHidden: boolean) => void;
  devices?: any[];
  players?: any[];
}

const STATIC_MOBILE_SENSITIVITIES = ['6893-6056-4352-8802', '7142-8851-9002-3311', '6900-5122-1400-8812'];
const STATIC_IPAD_SENSITIVITIES = ['6895-6056-1152-9011', '7102-4412-9011-8843', '6901-5022-3114-8002'];
const PC_SENSITIVITIES = ['6800-4105-9200-8012', '7111-2051-9122-8114', '6902-5122-1144-8852'];

const HomePage = ({
  news,
  setActiveTab,
  devices = [],
  players = [],
}: HomePageProps) => {
  const [sensIndex, setSensIndex] = useState(0);

  // Extract sensitivity codes and names from devices and players.
  // We identify iPads by checking if "ipad" is in the name.
  // We identify PCs by checking if "pc" or "emulator" is in the name or we fallback.
  const dynamicMobile = [...devices, ...players]
    .filter(d => !d.name?.toLowerCase().includes('ipad') && !d.name?.toLowerCase().includes('pc') && !d.name?.toLowerCase().includes('محاكي') && d.code);

  const dynamicIpad = [...devices, ...players]
    .filter(d => d.name?.toLowerCase().includes('ipad') && d.code);

  const dynamicPc = [...devices, ...players]
    .filter(d => (d.name?.toLowerCase().includes('pc') || d.name?.toLowerCase().includes('محاكي') || d.name?.toLowerCase().includes('كمبيوتر')) && d.code);

  // Fallback to static if none found
  const mobileSensitivities = dynamicMobile.length > 0 ? dynamicMobile : STATIC_MOBILE_SENSITIVITIES.map(code => ({ name: 'حساسية الجوال (4 أصابع)', code }));
  const ipadSensitivities = dynamicIpad.length > 0 ? dynamicIpad : STATIC_IPAD_SENSITIVITIES.map(code => ({ name: 'حساسية الآيباد (Gyro)', code }));
  const pcSensitivities = dynamicPc.length > 0 ? dynamicPc : PC_SENSITIVITIES.map(code => ({ name: 'حساسية الماوس للكمبيوتر', code }));

  const currentMobile = mobileSensitivities[sensIndex % mobileSensitivities.length];
  const currentIpad = ipadSensitivities[sensIndex % ipadSensitivities.length];
  const currentPc = pcSensitivities[sensIndex % pcSensitivities.length];

  useEffect(() => {
    const interval = setInterval(() => {
      setSensIndex((prev) => (prev + 1) % 10000);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-pubg-dark text-[#E2E8F0] font-sans selection:bg-pubg-gold selection:text-black" dir="rtl">
      <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">
        
        {/* HERO SECTION */}
        <div className="relative h-[420px] rounded-2xl overflow-hidden mb-10 border border-pubg-border shadow-[0_20px_60px_rgba(0,0,0,0.5)] bg-pubg-card group">
          <OptimizedImage 
            src="https://image.pollinations.ai/prompt/PUBG%20Mobile%20Battle%20Royale%20Erangel%20Cinematic%20Action%20Scene%20high%20detail?width=1280&height=420&nologo=true&seed=123" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            alt="ZONE PUBG HERO"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-black/60 to-black" />
          <div className="relative z-10 h-full flex flex-col justify-center px-10 max-w-2xl">
            <span className="text-pubg-gold text-sm mb-3 font-bold tracking-widest backdrop-blur-sm bg-black/30 w-fit px-3 py-1 rounded-full border border-pubg-border tracking-tighter">المركز الرسمي للمحترفين - ZONE PUBG</span>
            <h1 className="text-4xl md:text-5xl font-black leading-[1.3] mb-6 text-white text-shadow-sm">
              كل الأخبار، الأكواد، <br/> والتحديثات
            </h1>
            <div className="flex gap-4">
              <button onClick={() => setActiveTab('sensitivity')} className="bg-pubg-gold text-black px-8 h-12 rounded-lg font-bold text-base hover:scale-105 transition-transform shadow-[0_0_15px_rgba(214,177,95,0.3)]">
                عرض أحدث الحساسيات
              </button>
              <button onClick={() => setActiveTab('news')} className="bg-pubg-card text-white border border-[#333] px-8 h-12 rounded-lg font-bold text-base hover:bg-[#222] transition-colors">
                قراءة تفاصيل التحديث الجديد
              </button>
            </div>
            
            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              <div className="h-1.5 w-6 bg-pubg-gold rounded-full"></div>
              <div className="h-1.5 w-1.5 bg-[#444] rounded-full"></div>
              <div className="h-1.5 w-1.5 bg-[#444] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* 2-COLUMN LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR (First element in RTL = Right Side) */}
          <div className="w-full lg:w-[320px] shrink-0 space-y-8 order-2 lg:order-1 lg:sticky lg:top-24 h-fit">
            
            {/* QUICK LINKS */}
            <div className="bg-pubg-card border border-pubg-border rounded-2xl p-6">
              <h3 className="text-pubg-gold font-bold mb-5 flex justify-between items-center">
                <span className="text-sm tracking-wider">QUICK LINKS</span>
                <span className="text-lg">أقسام الموقع</span>
              </h3>
              
              <ul className="space-y-4">
                <li onClick={() => setActiveTab('compare')} className="flex items-center gap-3 text-sm text-[#CCCCCC] hover:text-white transition-colors cursor-pointer group">
                  <Crosshair className="w-4 h-4 text-pubg-gold group-hover:scale-110 transition-transform" />
                  <span>مقارنة الأسلحة</span>
                </li>
                <li onClick={() => setActiveTab('calculator')} className="flex items-center gap-3 text-sm text-[#CCCCCC] hover:text-white transition-colors cursor-pointer group">
                  <span className="w-4 flex justify-center"><Trophy className="w-3.5 h-3.5 text-[#555] group-hover:text-pubg-gold transition-colors" /></span>
                  <span>حاسبة (التقييم)</span>
                </li>
                <li onClick={() => setActiveTab('giveaways')} className="flex items-center gap-3 text-sm text-[#CCCCCC] hover:text-white transition-colors cursor-pointer group">
                  <span className="w-4 flex justify-center"><Sparkles className="w-3.5 h-3.5 text-[#555] group-hover:text-pubg-gold transition-colors" /></span>
                  <span>السحوبات –</span>
                </li>
                <li onClick={() => setActiveTab('rate')} className="flex items-center gap-3 text-sm text-[#CCCCCC] hover:text-white transition-colors cursor-pointer group">
                  <span className="w-4 flex justify-center"><Shield className="w-3.5 h-3.5 text-[#555] group-hover:text-pubg-gold transition-colors" /></span>
                  <span>تقييم مستواك</span>
                </li>
              </ul>
            </div>

            {/* NEWS & EXCLUSIVES */}
            <div className="bg-pubg-card border border-pubg-border rounded-2xl p-6">
              <h3 className="text-pubg-gold font-bold mb-5 flex justify-between items-center">
                <span className="text-sm tracking-wider">NEWS & MORE</span>
                <span className="text-lg">استكشف المزيد</span>
              </h3>
              
              <div className="space-y-3">
                <div onClick={() => setActiveTab('news')} className="bg-black/30 border border-white/5 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:border-pubg-border transition-colors group">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-pubg-muted group-hover:text-pubg-gold transition-colors" />
                    <span className="font-bold text-sm">الأخبار والتحديثات</span>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[#666] group-hover:text-pubg-gold transition-colors" />
                </div>
                <div onClick={() => setActiveTab('sensitivity')} className="bg-black/30 border border-white/5 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:border-pubg-border transition-colors group">
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-pubg-muted group-hover:text-pubg-gold transition-colors" />
                    <span className="font-bold text-sm">أكواد الحساسية</span>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[#666] group-hover:text-pubg-gold transition-colors" />
                </div>
                <div onClick={() => setActiveTab('loadouts')} className="bg-black/30 border border-white/5 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:border-pubg-border transition-colors group">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-pubg-muted group-hover:text-pubg-gold transition-colors" />
                    <span className="font-bold text-sm">أفضل العتاد</span>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[#666] group-hover:text-pubg-gold transition-colors" />
                </div>
                <div onClick={() => setActiveTab('characters')} className="bg-black/30 border border-white/5 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:border-pubg-border transition-colors group">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-pubg-muted group-hover:text-pubg-gold transition-colors" />
                    <span className="font-bold text-sm"> خصائص ومزايا </span>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[#666] group-hover:text-pubg-gold transition-colors" />
                </div>
                <div onClick={() => setActiveTab('game-events')} className="bg-black/30 border border-white/5 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:border-pubg-border transition-colors group">
                  <div className="flex items-center gap-3">
                    <MapIcon className="w-4 h-4 text-pubg-muted group-hover:text-pubg-gold transition-colors" />
                    <span className="font-bold text-sm">فعاليات اللعبة الحالية</span>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[#666] group-hover:text-pubg-gold transition-colors" />
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT (Second element in RTL = Left Side) */}
          <div className="flex-1 space-y-12 order-1 lg:order-2 min-w-0">

            {/* SENSITIVITY & CODES */}
            <section>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-pubg-gold text-sm tracking-[0.2em] font-bold mb-1">SENSITIVITY & CODES</h2>
                  <h3 className="text-2xl font-bold text-white">الحساسية والأكواد</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Mobile */}
                <div className="bg-pubg-card border border-pubg-border hover:border-pubg-gold/50 transition-colors rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden group">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-pubg-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Smartphone className="w-10 h-10 text-pubg-muted mb-4 group-hover:text-pubg-gold transition-colors" strokeWidth={1.5} />
                  <h4 className="font-bold text-white mb-2">{currentMobile.name}</h4>
                  <p className="text-sm font-mono mb-5 bg-pubg-code px-3 py-1.5 rounded-md text-pubg-gold">[{currentMobile.code}]</p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(currentMobile.code)}
                    className="w-full bg-pubg-gold text-black font-bold py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity"
                  >
                    نسخ الكود
                  </button>
                </div>

                {/* iPad */}
                <div className="bg-pubg-card border border-pubg-border hover:border-pubg-gold/50 transition-colors rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden group">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-pubg-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Tablet className="w-10 h-10 text-pubg-muted mb-4 group-hover:text-pubg-gold transition-colors" strokeWidth={1.5} />
                  <h4 className="font-bold text-white mb-2">{currentIpad.name}</h4>
                  <p className="text-sm font-mono mb-5 bg-pubg-code px-3 py-1.5 rounded-md text-pubg-gold">[{currentIpad.code}]</p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(currentIpad.code)}
                    className="w-full bg-pubg-gold text-black font-bold py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity"
                  >
                    نسخ الكود
                  </button>
                </div>

                {/* PC */}
                <div className="bg-pubg-card border border-pubg-border hover:border-pubg-gold/50 transition-colors rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden group">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-pubg-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Monitor className="w-10 h-10 text-pubg-muted mb-4 group-hover:text-pubg-gold transition-colors" strokeWidth={1.5} />
                  <h4 className="font-bold text-white mb-2">{currentPc.name}</h4>
                  <p className="text-sm font-mono mb-5 bg-pubg-code px-3 py-1.5 rounded-md text-pubg-gold">[{currentPc.code}]</p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(currentPc.code)}
                    className="w-full bg-pubg-gold text-black font-bold py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity"
                  >
                    نسخ الكود
                  </button>
                </div>
              </div>
            </section>

            {/* GAME EVENTS */}
            <section>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-pubg-gold text-sm tracking-[0.2em] font-bold mb-1">EVENTS & MODES</h2>
                  <h3 className="text-2xl font-bold text-white">فعاليات اللعبة الحالية</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { title: "رويال باس A6", sub: "Royal Pass", targetDate: new Date('2026-05-15T00:00:00Z'), img: "https://image.pollinations.ai/prompt/pubg%20rp%20skin?width=600&height=400&nologo=true&seed=rp1" },
                  { title: "مود الميكا المستقبلي", sub: "Mode", targetDate: new Date('2026-05-10T00:00:00Z'), img: "https://image.pollinations.ai/prompt/pubg%20robot?width=600&height=400&nologo=true&seed=mech1" },
                  { title: "صندوق مميز متخفي", sub: "Crate", targetDate: new Date('2026-05-05T12:00:00Z'), img: "https://image.pollinations.ai/prompt/pubg%20drop?width=600&height=400&nologo=true&seed=drop1" },
                  { title: "بطولة كأس المواهب", sub: "Tournament", targetDate: new Date('2026-05-20T18:00:00Z'), img: "https://image.pollinations.ai/prompt/pubg%20trophy?width=600&height=400&nologo=true&seed=cup1" }
                ].map((item, idx) => {
                  return (
                  <div key={idx} className="bg-pubg-card border border-white/5 rounded-2xl overflow-hidden group hover:border-pubg-gold/40 transition-colors flex flex-col h-[280px]">
                    <div className="relative h-[110px] overflow-hidden">
                      <OptimizedImage src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-pubg-card to-transparent"></div>
                      <div className="absolute top-2 left-2 flex gap-1 items-center bg-black/60 px-2 py-1 rounded text-xs text-white">
                        <Clock className="w-3 h-3 text-pubg-gold" /> صالح لمدة
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="text-center">
                        <div className="text-xs text-pubg-gold font-bold mb-1 tracking-wider uppercase">{item.sub}</div>
                        <h4 className="font-bold text-white text-[15px] leading-tight mb-4">{item.title}</h4>
                      </div>
                      <div className="flex justify-center mt-auto">
                        <Countdown targetDate={item.targetDate} />
                      </div>
                    </div>
                  </div>
                );})}
              </div>
            </section>

            {/* NEWS */}
            <section>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-pubg-gold text-sm tracking-[0.2em] font-bold mb-1">NEWS</h2>
                  <h3 className="text-2xl font-bold text-white">الأخبار والفعاليات</h3>
                </div>
                <button onClick={() => setActiveTab('news')} className="text-xs text-pubg-gold font-bold hover:underline">عرض الكل</button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {(news && news.length > 0 ? news.slice(0, 4) : [
                  { id: '1', title: "تحديث ببجي موبايل 3.2", category: "الإصدار الأخير", date: "جديد", image: "https://image.pollinations.ai/prompt/pubg%20action?width=600&height=400&nologo=true&seed=n1", url: "https://www.pubgmobile.com/ar/news.shtml" },
                  { id: '2', title: "ملاحظات التحديث والميزات الجديدة", category: "التحديثات", date: "جديد", image: "https://image.pollinations.ai/prompt/pubg%20map?width=600&height=400&nologo=true&seed=n2", url: "https://www.pubgmobile.com/ar/news.shtml" },
                  { id: '3', title: "أخبار مجتمع ببجي والبطولات", category: "البطولات", date: "تحديث مستمر", image: "https://image.pollinations.ai/prompt/pubg%20esports?width=600&height=400&nologo=true&seed=n3", url: "https://esports.pubgmobile.com/" },
                  { id: '4', title: "الفعاليات والأحداث الحالية", category: "الأحداث", date: "مستمر", image: "https://image.pollinations.ai/prompt/pubg%20winner?width=600&height=400&nologo=true&seed=n4", url: "https://www.pubgmobile.com/ar/home.shtml" }
                ]).map((item, idx) => (
                  <div 
                    key={item.id || idx} 
                    onClick={() => setActiveTab('news', item.id ? `?id=${item.id}` : undefined)}
                    className="cursor-pointer bg-pubg-card border border-white/5 rounded-2xl overflow-hidden group hover:border-pubg-gold/40 transition-colors flex flex-col h-[280px]"
                  >
                    <div className="relative h-[140px] overflow-hidden">
                      <OptimizedImage src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-pubg-card to-transparent"></div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-xs text-pubg-gold font-bold mb-1 tracking-wide">{item.category || item.sub}</div>
                        <h4 className="font-bold text-white text-lg leading-tight group-hover:text-pubg-gold transition-colors">{item.title}</h4>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xs text-[#777] bg-black/40 px-2 py-1 rounded">{item.date}</span>
                        <span className="text-xs text-white flex items-center gap-1 group-hover:text-pubg-gold">
                          اقرأ المزيد <ChevronLeft className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;


