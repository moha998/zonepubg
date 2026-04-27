import React from 'react';
import { motion } from 'motion/react';
import { 
  Newspaper, 
  ChevronLeft, 
  FileText,
  Copy,
  Calendar,
  LayoutGrid,
  Code,
  Settings,
  Crosshair,
  Gift,
  GitCompare,
  Calculator,
  Video,
  Box,
  Megaphone
} from 'lucide-react';
import Hero from '../components/Hero';

interface HomePageProps {
  news: any[];
  loadingNews: boolean;
  clips: any[];
  ads: any[];
  rankings: any[];
  competitionSettings: any[];
  isAdmin: boolean;
  onSyncRankings?: () => Promise<void>;
  setActiveTab: (tab: string) => void;
  SubtleAdBanner: React.FC;
  TournamentFlashBanner: React.FC<{ settings: any[] }>;
  OfficialGlobalTournaments: React.FC<{ isHidden: boolean }>;
  onToggleVisibility?: (collection: string, id: string, current: boolean) => void;
}

export default function HomePage({
  news,
  loadingNews,
  setActiveTab,
}: HomePageProps) {
  
  // Dummy data for visual matching
  const updates = [
    { title: "تحديث ببجي 3.2", desc: "إضافة مركبة جديدة وخريطة مُعادلة", time: "منذ 2 ساعة", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop" },
    { title: "عودة طور الزومبي", desc: "طور الزومبي يعود من جديد بتحديث 3.2", time: "منذ 5 ساعات", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop" },
    { title: "تحسينات على الأسلحة", desc: "تعديلات جديدة على بعض الأسلحة", time: "منذ 1 يوم", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop" },
  ];

  const sensitivityCodes = [
    { title: "كود حساسية قريب", code: "7266-9881-4021-1996-284" },
    { title: "كود حساسية بعيد", code: "7231-7763-6481-1643-830" },
    { title: "كود جيروسكوب", code: "7496-6507-2969-4585-731" },
    { title: "كود 4 أصابع", code: "7075-5121-5892-1338-186" },
  ];

  const fallbackNews = [
    { title: "تسريبات الموسم القادم A10", desc: "معلومات جديدة عن الموسم القادم A10 في ببجي موبايل", badge: "تسريبات", badgeColor: "bg-yellow-500", time: "منذ 3 ساعات", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&auto=format&fit=crop" },
    { title: "تفاصيل تحديث ببجي 3.2", desc: "كل تفاصيل التحديث الجديد 3.2 والتغيرات القادمة", badge: "تحديثات", badgeColor: "bg-blue-500", time: "منذ 8 ساعات", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&auto=format&fit=crop" },
    { title: "فعالية صندوق الإمداد", desc: "احصل على جوائز رائعة من فعالية صندوق الإمداد الجديدة", badge: "فعاليات", badgeColor: "bg-green-500", time: "منذ 1 يوم", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&auto=format&fit=crop" },
    { title: "أفضل إعدادات 4 أصابع", desc: "دليل شامل لإعدادات 4 أصابع للمحترفين", badge: "مقالات", badgeColor: "bg-purple-500", time: "منذ 1 يوم", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&auto=format&fit=crop" },
  ];

  // Map provided news if exists, otherwise fallback
  const displayNews = !loadingNews && news && news.length > 0 ? news.slice(0, 4) : fallbackNews;

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-[1360px] mx-auto w-full px-[16px] md:px-[32px] lg:px-[72px] mt-6 mb-20 md:mb-10 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] gap-[24px] flex flex-col"
    >
      {/* Main Content Area */}
      <div className="flex flex-col w-full min-w-0">
        
        {/* Hero Section */}
        <section className="relative w-full h-auto lg:min-h-[360px] min-h-[420px] rounded-[14px] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#070707]/80 to-transparent z-[1]" />
          <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop" alt="PUBG Background" className="absolute inset-0 w-full h-full object-cover object-left opacity-70" />
          
          <div className="relative z-10 w-full px-6 md:px-10 flex flex-col justify-center h-full text-right py-8">
            <h1 className="text-[34px] lg:text-[48px] font-[900] text-white leading-[1.25]">
              كل ما يخص ببجي
              <br />
              <span className="text-primary">في مكان واحد</span>
            </h1>
            <p className="text-[15px] lg:text-[18px] text-[#D4D4D8] leading-[1.9] max-w-[620px] mt-4 font-medium">
              أخبار وتحديثات ببجي موبايل أول بأول، أكواد الحساسية، إعدادات اللاعبين المحترفين، وخصائص الأسلحة.
            </p>
            <div className="flex flex-wrap gap-[12px] mt-6">
              <button onClick={() => setActiveTab("news")} className="flex items-center justify-center gap-2 h-[44px] px-[28px] font-bold text-black bg-primary rounded-[8px] hover:bg-primary-hover transition text-[15px]">
                استعرض الأخبار
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => setActiveTab("sensitivity")} className="flex items-center gap-2 h-[44px] px-[28px] font-bold text-white bg-white/5 border border-white/10 rounded-[8px] hover:bg-white/10 transition text-[15px]">
                أكواد الحساسية
              </button>
            </div>
          </div>
        </section>

        {/* News Section */}
        <section className="mt-10 w-full">
          <div className="flex items-center gap-[10px] mb-6">
            <div className="w-[4px] h-[18px] bg-primary rounded-sm" />
            <h2 className="text-[24px] font-[900] text-white">أحدث الأخبار</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
             {displayNews.map((item, idx) => (
               <div key={idx} onClick={() => setActiveTab("news")} className="w-full h-[290px] bg-[#141414] border border-white/10 rounded-[10px] overflow-hidden hover:border-primary/50 transition cursor-pointer group flex flex-col relative">
                 <div className="h-[150px] w-full relative overflow-hidden shrink-0">
                    <img src={item.img || item.imageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&auto=format&fit=crop"} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <span className={`absolute top-[12px] right-[12px] h-[28px] px-[12px] flex items-center justify-center text-white text-[12px] font-[700] rounded-[6px] shadow-md ${item.badgeColor || (idx === 0 ? "bg-primary text-black" : idx === 1 ? "bg-blue-500" : idx === 2 ? "bg-green-500" : "bg-purple-500")}`}>
                      {item.badge || item.category || "مقالات"}
                    </span>
                 </div>
                 <div className="p-[14px] flex flex-col flex-1">
                    <h3 className="text-white font-[800] text-[16px] leading-[1.4] line-clamp-2">{item.title}</h3>
                    <p className="text-[#D4D4D8] text-[12px] mt-1.5 leading-[1.7] line-clamp-2 flex-1">{item.desc || item.content?.substring(0, 50) + "..."}</p>
                    <div className="flex items-center gap-1.5 mt-2 text-[#A1A1AA] text-[12px]">
                       منذ {item.time || item.date || "1 يوم"} <Calendar size={14} /> 
                    </div>
                 </div>
               </div>
             ))}
          </div>
        </section>

        {/* Sections Grid */}
        <section className="mt-[32px] w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-[14px]">
             <div onClick={() => setActiveTab("news")} className="h-[76px] bg-[#141414] border border-white/10 rounded-[10px] py-[16px] px-[20px] flex items-center gap-[14px] hover:border-primary/50 transition cursor-pointer group">
               <div className="text-primary"><Newspaper size={30} strokeWidth={1.5}/></div>
               <div>
                 <h4 className="text-white font-[800] text-[17px] leading-tight">الأخبار</h4>
                 <p className="text-[#A1A1AA] text-[12px] mt-0.5">جميع أخبار ببجي</p>
               </div>
             </div>
             
             <div onClick={() => setActiveTab("sensitivity")} className="h-[76px] bg-[#141414] border border-white/10 rounded-[10px] py-[16px] px-[20px] flex items-center gap-[14px] hover:border-primary/50 transition cursor-pointer group">
               <div className="text-primary"><Settings size={30} strokeWidth={1.5}/></div>
               <div>
                 <h4 className="text-white font-[800] text-[17px] leading-tight">الحساسية</h4>
                 <p className="text-[#A1A1AA] text-[12px] mt-0.5">أكواد المحترفين</p>
               </div>
             </div>
             
             <div onClick={() => setActiveTab("characters")} className="h-[76px] bg-[#141414] border border-white/10 rounded-[10px] py-[16px] px-[20px] flex items-center gap-[14px] hover:border-primary/50 transition cursor-pointer group">
               <div className="text-primary"><Crosshair size={30} strokeWidth={1.5}/></div>
               <div>
                 <h4 className="text-white font-[800] text-[17px] leading-tight">الشخصيات</h4>
                 <p className="text-[#A1A1AA] text-[12px] mt-0.5">وتفاصيلها</p>
               </div>
             </div>

             <div onClick={() => setActiveTab("compare")} className="h-[76px] bg-[#141414] border border-white/10 rounded-[10px] py-[16px] px-[20px] flex items-center gap-[14px] hover:border-primary/50 transition cursor-pointer group">
               <div className="text-primary"><GitCompare size={30} strokeWidth={1.5}/></div>
               <div>
                 <h4 className="text-white font-[800] text-[17px] leading-tight">المقارنة</h4>
                 <p className="text-[#A1A1AA] text-[12px] mt-0.5">بين الأسلحة</p>
               </div>
             </div>

             <div onClick={() => setActiveTab("events")} className="h-[76px] bg-[#141414] border border-white/10 rounded-[10px] py-[16px] px-[20px] flex items-center gap-[14px] hover:border-primary/50 transition cursor-pointer group">
               <div className="text-primary"><Calendar size={30} strokeWidth={1.5}/></div>
               <div>
                 <h4 className="text-white font-[800] text-[17px] leading-tight">الفعاليات</h4>
                 <p className="text-[#A1A1AA] text-[12px] mt-0.5">جميع الفعاليات</p>
               </div>
             </div>

             <div onClick={() => setActiveTab("giveaways")} className="h-[76px] bg-[#141414] border border-white/10 rounded-[10px] py-[16px] px-[20px] flex items-center gap-[14px] hover:border-primary/50 transition cursor-pointer group">
               <div className="text-primary"><Gift size={30} strokeWidth={1.5}/></div>
               <div>
                 <h4 className="text-white font-[800] text-[17px] leading-tight">السحوبات</h4>
                 <p className="text-[#A1A1AA] text-[12px] mt-0.5">احصل على جوائز</p>
               </div>
             </div>

             <div onClick={() => setActiveTab("calculator")} className="h-[76px] bg-[#141414] border border-white/10 rounded-[10px] py-[16px] px-[20px] flex items-center gap-[14px] hover:border-primary/50 transition cursor-pointer group">
               <div className="text-primary"><Calculator size={30} strokeWidth={1.5}/></div>
               <div>
                 <h4 className="text-white font-[800] text-[17px] leading-tight">التقييم</h4>
                 <p className="text-[#A1A1AA] text-[12px] mt-0.5">حاسبة الكونكر</p>
               </div>
             </div>

             <div onClick={() => setActiveTab("rate")} className="h-[76px] bg-[#141414] border border-white/10 rounded-[10px] py-[16px] px-[20px] flex items-center gap-[14px] hover:border-primary/50 transition cursor-pointer group">
               <div className="text-primary"><Video size={30} strokeWidth={1.5}/></div>
               <div>
                 <h4 className="text-white font-[800] text-[17px] leading-tight">اللقطات</h4>
                 <p className="text-[#A1A1AA] text-[12px] mt-0.5">لقطات احترافية</p>
               </div>
             </div>

             <div onClick={() => setActiveTab("loadouts")} className="h-[76px] bg-[#141414] border border-white/10 rounded-[10px] py-[16px] px-[20px] flex items-center gap-[14px] hover:border-primary/50 transition cursor-pointer group">
               <div className="text-primary"><Box size={30} strokeWidth={1.5}/></div>
               <div>
                 <h4 className="text-white font-[800] text-[17px] leading-tight">العتاد</h4>
                 <p className="text-[#A1A1AA] text-[12px] mt-0.5">أفضل القطع</p>
               </div>
             </div>

             <div onClick={() => setActiveTab("ads")} className="h-[76px] bg-[#141414] border border-white/10 rounded-[10px] py-[16px] px-[20px] flex items-center gap-[14px] hover:border-primary/50 transition cursor-pointer group">
               <div className="text-primary"><Megaphone size={30} strokeWidth={1.5}/></div>
               <div>
                 <h4 className="text-white font-[800] text-[17px] leading-tight">الإعلانات</h4>
                 <p className="text-[#A1A1AA] text-[12px] mt-0.5">مجالس المجتمع</p>
               </div>
             </div>
          </div>
        </section>

      </div>

      {/* Sidebar Area */}
      <aside className="w-full lg:w-[340px] flex flex-col mx-auto flex-shrink-0">
        
        {/* Latest Updates Card */}
        <div className="w-full bg-[#111315] border border-white/10 rounded-[14px] p-[18px] mb-[18px]">
          <div className="flex items-center gap-[10px] mb-5">
            <div className="w-[4px] h-[18px] bg-primary rounded-sm" />
            <h2 className="text-[20px] font-[800] text-white">آخر التحديثات</h2>
          </div>
          <div className="flex flex-col">
            {updates.map((item, idx) => (
              <div key={idx} className="h-[86px] flex gap-[12px] p-[10px] border-b border-white/10 last:border-0 hover:bg-white/5 transition rounded-lg cursor-pointer" onClick={() => setActiveTab("news")}>
                <img src={item.img} alt={item.title} className="w-[98px] h-[66px] object-cover rounded-[8px]" />
                <div className="flex flex-col justify-center flex-1">
                   <h3 className="text-white font-[800] text-[14px] line-clamp-2 leading-tight mb-1">{item.title}</h3>
                   <p className="text-[#A1A1AA] text-[12px]">{item.time}</p>
                </div>
              </div>
            ))}
            <button onClick={() => setActiveTab("news")} className="w-full h-[36px] mt-3 rounded-[7px] bg-white/5 hover:bg-white/10 text-[#D4D4D8] font-bold transition text-sm flex items-center justify-center">
              عرض جميع التحديثات
            </button>
          </div>
        </div>

        {/* Sensitivity Codes Card */}
        <div className="w-full bg-[#111315] border border-white/10 rounded-[14px] p-[18px] mb-[18px]">
          <div className="flex items-center gap-[10px] mb-5">
            <div className="w-[4px] h-[18px] bg-primary rounded-sm" />
            <h2 className="text-[20px] font-[800] text-white">أكواد الحساسية</h2>
          </div>
          <div className="flex flex-col gap-[10px]">
            {sensitivityCodes.map((item, idx) => (
              <div key={idx} className="flex items-center gap-[12px] p-[10px] bg-black/20 border border-white/10 rounded-lg group hover:border-primary/30 transition">
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                  <FileText size={20}/>
                </div>
                <div className="flex-1 flex flex-col">
                  <h4 className="text-white font-[800] text-[14px]">{item.title}</h4>
                  <p className="text-[#A1A1AA] text-[12px] font-mono mt-0.5">{item.code}</p>
                </div>
                <button className="w-8 h-8 rounded bg-white/5 hover:bg-primary hover:text-black text-gray-400 transition flex items-center justify-center">
                  <Copy size={14}/>
                </button>
              </div>
            ))}
            <button onClick={() => setActiveTab("sensitivity")} className="w-full h-[36px] mt-2 rounded-[7px] bg-white/5 hover:bg-white/10 text-[#D4D4D8] font-bold transition text-sm flex items-center justify-center">
              عرض جميع الأكواد
            </button>
          </div>
        </div>

        {/* Ad Space Placeholder or other content could go here */}

      </aside>

    </motion.div>
  );
}

