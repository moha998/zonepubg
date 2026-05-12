import OptimizedImage from '../components/OptimizedImage';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Newspaper, RefreshCw, Flame, Wrench, Calendar, ExternalLink, Target, MessageSquare, Loader2, Send, MessageSquareOff, Trash2, X, Eye, EyeOff, ChevronLeft, Share2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useGlobalContext } from '../context/GlobalContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, setDoc, doc, deleteDoc, updateDoc, increment, serverTimestamp, orderBy, onSnapshot } from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom';

// Types
interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  url: string;
  image?: string;
  category: string;
  strategic_note?: string;
  isHidden?: boolean;
}

interface NewsComment {
  id: string;
  newsId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  content: string;
  createdAt: any;
}

// Inline Spinner Component (extracted)
function InlineSpinner({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-slate-400 font-bold text-sm animate-pulse">{message}</p>
    </div>
  );
}

// GameImage Component (mocked from App.tsx or use standard img)
function GameImage({ src, alt, className }: { src: string, alt: string, className?: string }) {
  return <img src={src} alt={alt} className={className} />;
}


interface NewsPageProps {
  SubtleAdBanner: React.FC;
  news: NewsItem[];
  isAdmin: boolean;
  onDelete: (id: string) => void;
  onToggleVisibility: (collectionName: string, id: string, currentStatus: boolean) => void;
  loading: boolean;
}

export default function NewsPage({ 
  SubtleAdBanner, 
  news, 
  isAdmin: overallIsAdmin, 
  onDelete, 
  onToggleVisibility, 
  loading: overallLoading 
}: NewsPageProps) {
  const { user, userProfile, isAdmin, competitionSettings, showNotification } = useGlobalContext();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [newsFilter, setNewsFilter] = useState("all");
  
  const [comments, setComments] = useState<NewsComment[]>([]);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [isRendering, setIsRendering] = useState<string | null>(null);

  const handleCreateVideo = async (item: NewsItem) => {
    setIsRendering(item.id);
    try {
      // 1. Generate catchy title using Gemini on frontend
      const apiKey = process.env.GEMINI_API_KEY;
      let smartText = item.title;

      if (apiKey) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: `اختصر الخبر التالي ليكون عنوان تيك توك جذاب ومثير (بدون هاشتاقات، باللغة العربية): ${item.title}`
          });
          if (response.text) {
            smartText = response.text.trim().replace(/["']/g, '');
            console.log('Frontend Gemini generated catchy title:', smartText);
          }
        } catch (geminiError) {
          console.error('Gemini error on frontend, falling back to original title:', geminiError);
        }
      }

      // 2. Call backend for Creatomate render
      const response = await fetch('/api/tiktok/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          smartText,
          newsImage: item.image 
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'فشل في إنشاء الفيديو');
      
      if (data.url) {
        showNotification("تم بناء الفيديو بنجاح! سيتم فتحه الآن لتقوم بمشاركته.", "success");
        setTimeout(() => {
          window.open(data.url, '_blank');
        }, 1500);
      } else {
        showNotification("جاري معالجة الفيديو في الخلفية. قد يستغرق ذلك دقيقة.", "success");
      }
    } catch (error: any) {
      console.error(error);
      showNotification(error.message || "حدث خطأ أثناء إنتاج الفيديو", "error");
    } finally {
      setIsRendering(null);
    }
  };

  // Handle direct link to article via URL /news?id=ARTICLE_ID
  useEffect(() => {
    const articleId = searchParams.get('id');
    if (articleId && news.length > 0) {
      const article = news.find(n => n.id === articleId);
      if (article) {
        setSelectedArticle(article);
      }
    }
  }, [searchParams, news]);

  // We rely on news passed from props which is already filtered/updated in App.tsx
  const loadNews = () => {
    // This could trigger a refresh from App.tsx via a prop if needed, 
    // but for now we'll just handle it locally or via site refresh
    window.location.reload();
  };

  // Setup comments listener for selected news
  useEffect(() => {
    if (!selectedNewsId) {
      setComments([]);
      return;
    }
    const q = query(
      collection(db, "comments"),
      where("newsId", "==", selectedNewsId),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsComment)));
    }, (err) => {
      console.error("Comments error:", err);
    });
    return () => unsub();
  }, [selectedNewsId]);

  const handleAddComment = async (newsId: string) => {
    if (!user) {
      showNotification("يرجى تسجيل الدخول للتعليق", "error");
      return;
    }
    if (!newComment.trim()) return;
    setIsSubmittingComment(true);
    try {
      const comment: Omit<NewsComment, "id"> = {
        newsId,
        userId: user.uid,
        userName: userProfile?.displayName || "لاعب ببجي",
        userPhoto: userProfile?.photoURL || "",
        content: newComment,
        createdAt: new Date().toISOString(),
      };
      const newDocRef = doc(collection(db, "comments"));
      await setDoc(newDocRef, comment);
      
      try {
        await updateDoc(doc(db, "siteStats", "global"), {
          totalParticipations: increment(1),
          updatedAt: serverTimestamp()
        });
      } catch (statsErr) {}

      setNewComment("");
      showNotification("تمت إضافة تعليقك", "success");
    } catch (error) {
      console.error(error);
      showNotification("حدث خطأ أثناء إضافة التعليق", "error");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!isAdmin) return;
    try {
      await deleteDoc(doc(db, "comments", id));
      showNotification("تم حذف التعليق", "success");
    } catch (error) {
      console.error(error);
      showNotification("فشل حذف التعليق", "error");
    }
  };

  const handleLogin = () => {
    //
  };

  const sanitizeUrl = (url: string | undefined | null) => {
    const OFFICIAL_SITE = 'https://www.pubgmobile.com';
    const FALLBACK = `${OFFICIAL_SITE}/en-US/news.shtml`;
    
    if (!url || typeof url !== 'string' || url.trim() === '' || url === '#' || url.trim() === 'undefined' || url.trim() === 'null') {
      return FALLBACK;
    }
    
    let trimmedUrl = url.trim();
    
    // Handle relative paths
    if (trimmedUrl.startsWith('/')) {
      return `${OFFICIAL_SITE}${trimmedUrl}`;
    }

    if (trimmedUrl.startsWith('http')) return trimmedUrl;
    if (trimmedUrl.startsWith('//')) return `https:${trimmedUrl}`;
    
    // If it looks like a domain names (has a dot) but no protocol
    if (trimmedUrl.includes('.')) {
      return `https://${trimmedUrl}`;
    }

    return FALLBACK;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-8"
      dir="rtl"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Newspaper className="text-primary" size={28} /> آخر الأخبار والفعاليات
          </h2>
          <p className="text-slate-400 mt-2">
            تحديثات مباشرة من الموقع الرسمي لببجي موبايل
          </p>
        </div>
        <button
          onClick={loadNews}
          disabled={overallLoading}
          className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all disabled:opacity-50"
        >
          <RefreshCw
            className={overallLoading ? "animate-spin text-primary" : "text-primary"}
            size={20}
          />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: "all", label: "الكل" },
          { id: "news", label: "أخبار" },
          { id: "updates", label: "تحديثات وصيانة", special: "updates" },
          { id: "leaks", label: "التسريبات", special: "leaks" },
          { id: "uc", label: "عروض UC" },
          { id: "event", label: "فعاليات" },
          { id: "mode", label: "أطوار" },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setNewsFilter(filter.id)}
            className={`px-5 py-2 rounded-xl border text-xs font-bold transition-all ${
              newsFilter === filter.id
                ? filter.special === "leaks"
                  ? "bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/20"
                  : filter.special === "updates"
                  ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20"
                  : "btn-gold shadow-md"
                : filter.special === "leaks"
                ? "bg-purple-400/5 border-purple-400/20 text-purple-400 hover:bg-purple-400/10"
                : filter.special === "updates"
                ? "bg-blue-400/5 border-blue-400/20 text-blue-400 hover:bg-blue-400/10"
                : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
            }`}
          >
            {filter.id === "leaks" && <Flame size={14} className={`inline-block ml-1 ${newsFilter === "leaks" ? "animate-pulse" : ""}`} />}
            {filter.id === "updates" && <Wrench size={14} className={`inline-block ml-1 ${newsFilter === "updates" ? "animate-bounce" : ""}`} />}
            {filter.label}
          </button>
        ))}
      </div>

      {overallLoading ? (
        <InlineSpinner message="جاري جلب آخر التحديثات..." />
      ) : (
        <div className="grid gap-6">
          {news
            .filter((item) => newsFilter === "all" || item.category === newsFilter)
            .map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="pro-card overflow-hidden group border-white/5 flex flex-col md:flex-row gap-0"
              >
                {item.image && (
                  <div 
                    onClick={() => setSelectedArticle(item)}
                    className="w-full md:w-[280px] h-[200px] md:h-auto overflow-hidden shrink-0 relative cursor-pointer"
                  >
                    <OptimizedImage
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pubg-card via-transparent to-transparent md:bg-gradient-to-l" />
                  </div>
                )}
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                      {item.category === "leaks" ? (
                        <span className="text-[10px] font-bold text-purple-400 bg-purple-400/10 px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 border border-purple-400/20">
                          <Flame size={10} className="animate-pulse" /> تسريب: {item.date}
                        </span>
                      ) : item.category === "updates" ? (
                        <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 border border-blue-400/20">
                          <Wrench size={10} className="animate-bounce" /> تحديث/صيانة: {item.date}
                        </span>
                      ) : (
                        item.category !== "news" && (
                          <span className="text-[10px] font-bold text-orange-400 bg-orange-400/10 px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                            <Calendar size={10} /> تاريخ الانتهاء: {item.date}
                          </span>
                        )
                      )}
                    </div>
                    <div className="flex gap-2">
                       {overallIsAdmin && (
                        <button
                          onClick={() => onToggleVisibility("news", item.id, item.isHidden || false)}
                          className={`p-2 rounded-lg bg-white/5 transition-colors ${item.isHidden ? "text-red-500 hover:bg-red-500 hover:text-white" : "text-primary hover:bg-primary hover:text-black"}`}
                          title={item.isHidden ? "إظهار" : "إخفاء"}
                        >
                          {item.isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      )}
                      {overallIsAdmin && (
                         <button
                           onClick={() => onDelete(item.id)}
                           className="p-2 rounded-lg bg-white/5 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all"
                           title="حذف"
                         >
                           <Trash2 size={16} />
                         </button>
                      )}
                      {isAdmin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCreateVideo(item);
                          }}
                          disabled={isRendering === item.id}
                          className={`p-2 rounded-lg bg-white/5 transition-all ${
                            isRendering === item.id 
                              ? "text-primary animate-pulse" 
                              : "text-slate-400 hover:text-[#ff0050] hover:bg-[#ff0050]/10"
                          }`}
                          title="مشاركة على تيك توك"
                        >
                          {isRendering === item.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.47-.88-.64-1.55-1.51-1.92-2.52-.02 2.41.01 4.82-.01 7.23-.01 1.76-.32 3.53-1.07 5.12-.66 1.41-1.74 2.65-3.13 3.39-1.5.8-3.23 1.15-4.92 1.01-1.89-.15-3.75-.95-5.12-2.27-1.43-1.38-2.31-3.32-2.45-5.3-.17-2.38.65-4.82 2.27-6.57 1.54-1.66 3.82-2.61 6.08-2.53.01 1.43.01 2.87.01 4.31-.83-.1-1.69.07-2.42.5-.66.39-1.16 1.05-1.33 1.8-.19 1.13.23 2.37 1.1 3.12.82.72 2.01.95 3.04.62 1.14-.37 1.95-1.4 2.1-2.58.07-1.39.04-2.79.05-4.18 0-4.07-.01-8.13.01-12.2z"/>
                            </svg>
                          )}
                        </button>
                      )}
                      <a
                        href={sanitizeUrl(item.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                  <h3 
                    onClick={() => setSelectedArticle(item)}
                    className="text-xl font-bold mb-2 text-white line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                  >
                    {item.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-sm mb-4 line-clamp-3">{item.summary}</p>
                  
                  <button 
                    onClick={() => setSelectedArticle(item)}
                    className="text-primary text-xs font-bold hover:underline mb-6 flex items-center gap-1"
                  >
                    اقرأ المزيد 
                    <ChevronLeft size={12} />
                  </button>

                  {item.strategic_note && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-6 hidden">
                      <div className="flex items-center gap-2 text-red-400 mb-2">
                        <Target size={18} />
                        <span className="font-bold">تحليل الميتا (Meta Analysis)</span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">{item.strategic_note}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <button
                      onClick={() => setSelectedNewsId(selectedNewsId === item.id ? null : item.id)}
                      className={`flex items-center gap-2 text-xs font-bold transition-all ${
                        selectedNewsId === item.id ? "text-primary" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <MessageSquare size={16} />
                      <span>التعليقات ({selectedNewsId === item.id ? comments.length : "عرض"})</span>
                    </button>
                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                      {item.category === "leaks"
                        ? "تسريبات"
                        : item.category === "uc"
                        ? "شدات"
                        : item.category === "event"
                        ? "فعالية"
                        : item.category === "mode"
                        ? "طور جديد"
                        : "أخبار"}
                    </span>
                  </div>

                  {/* Comments Section */}
                  <AnimatePresence>
                    {selectedNewsId === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-6 pt-6 border-t border-white/5 space-y-6 overflow-hidden"
                      >
                        {competitionSettings.find(s => s.id === 'global')?.isCommentsEnabled !== false ? (
                          <>
                            {user ? (
                              <div className="flex gap-4">
                                <OptimizedImage
                                  src={
                                    user.photoURL ||
                                    `https://ui-avatars.com/api/?name=${user.displayName || "User"}&background=random`
                                  }
                                  alt="User"
                                  className="w-8 h-8 rounded-full border border-white/10"
                                />
                                <div className="flex-1 relative">
                                  <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="اكتب تعليقك هنا..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none pr-12"
                                    rows={2}
                                  />
                                  <button
                                    onClick={() => handleAddComment(item.id)}
                                    disabled={isSubmittingComment || !newComment.trim()}
                                    className="absolute left-3 bottom-3 text-primary hover:text-white transition-colors disabled:opacity-50"
                                  >
                                    {isSubmittingComment ? (
                                      <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                      <Send size={18} />
                                    )}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 bg-white/5 rounded-xl text-center">
                                <p className="text-xs text-slate-500 mb-3">يجب تسجيل الدخول للمشاركة في النقاش</p>
                                <button
                                  onClick={handleLogin}
                                  className="text-xs font-bold text-primary hover:underline"
                                >
                                  تسجيل الدخول الآن
                                </button>
                              </div>
                            )}

                            <div className="space-y-4 md:max-h-[400px] md:overflow-y-auto pr-2 custom-scrollbar">
                              {comments.length > 0 ? (
                                comments.map((comment) => (
                                  <div key={comment.id} className="flex gap-3 group">
                                    <OptimizedImage
                                      src={
                                        comment.userPhoto ||
                                        `https://ui-avatars.com/api/?name=${comment.userName}&background=random`
                                      }
                                      alt={comment.userName}
                                      className="w-8 h-8 rounded-full border border-white/10 shrink-0"
                                    />
                                    <div className="flex-1 space-y-1">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-white">{comment.userName}</span>
                                        <div className="flex items-center gap-2">
                                          <span className="text-[9px] text-slate-600">
                                            {typeof comment.createdAt === 'string' ? new Date(comment.createdAt).toLocaleString("ar-EG") : comment.createdAt?.toDate ? new Date(comment.createdAt.toDate()).toLocaleString("ar-EG") : "الآن"}
                                          </span>
                                          {isAdmin && (
                                            <button
                                              onClick={() => handleDeleteComment(comment.id)}
                                              className="p-1 text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                              <Trash2 size={12} />
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                      <p className="text-sm text-slate-400 leading-relaxed">{comment.content}</p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-8">
                                  <MessageSquare size={32} className="text-slate-800 mx-auto mb-2" />
                                  <p className="text-xs text-slate-600">لا توجد تعليقات بعد. كن أول من يعلق!</p>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10">
                            <MessageSquareOff size={40} className="mx-auto text-slate-600 mb-4" />
                            <p className="text-slate-400 font-bold">تم تعطيل التعليقات حالياً</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
        </div>
      )}
      <SubtleAdBanner />

      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#121212] border border-[#D4AF37]/20 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8),_0_0_20px_rgba(212,175,55,0.15)] overflow-hidden flex flex-col max-h-[85vh] z-10"
            >
              <div className="p-6 border-b border-white/5 flex items-start justify-between bg-white/5 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none" />
                <div className="relative z-10 pr-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-[10px] font-bold text-primary bg-[#D4AF37]/10 px-2.5 py-1 rounded-md uppercase tracking-wider border border-[#D4AF37]/20">
                      {selectedArticle.category === "leaks" ? "تسريبات" : selectedArticle.category === "updates" ? "تحديث/صيانة" : "أخبار"}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-2.5 py-1 rounded-md uppercase tracking-wider border border-white/10">
                      {selectedArticle.date}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white leading-tight">{selectedArticle.title}</h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedArticle(null);
                    setSearchParams({});
                  }}
                  className="p-2 text-slate-400 hover:text-white bg-black/20 rounded-xl hover:bg-black/40 border border-white/5 transition-all shrink-0 relative z-10"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar relative">
                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#121212] to-transparent pointer-events-none z-10" />
                
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 leading-relaxed text-[15px] whitespace-pre-wrap mb-8">
                    {selectedArticle.summary}
                  </p>
                </div>

                {selectedArticle.strategic_note && (
                  <div className="p-5 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 rounded-xl mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="flex items-center gap-2 text-[#D4AF37] mb-3 relative z-10">
                      <Target size={20} />
                      <span className="font-bold text-lg">تحليل الميتا (Meta Analysis)</span>
                    </div>
                    <p className="text-[15px] text-slate-200 leading-relaxed relative z-10 font-medium">{selectedArticle.strategic_note}</p>
                  </div>
                )}
                
                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#121212] to-transparent pointer-events-none z-10" />
              </div>

              <div className="p-5 border-t border-white/5 bg-[#0a0a0a] flex flex-wrap gap-3 justify-between items-center relative z-10">
                <div className="flex gap-3">
                  <a
                    href={sanitizeUrl(selectedArticle.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl hover:bg-white/5 border-white/10 text-slate-300 hover:text-white transition-all text-sm font-bold border"
                  >
                    <ExternalLink size={16} />
                    <span>المصدر الأصلي</span>
                  </a>

                  {isAdmin && (
                    <button
                      onClick={() => handleCreateVideo(selectedArticle)}
                      disabled={isRendering === selectedArticle.id}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all text-sm font-bold ${
                        isRendering === selectedArticle.id
                          ? "bg-primary/20 border-primary/50 text-primary animate-pulse cursor-wait"
                          : "bg-[#ff0050]/10 border-[#ff0050]/20 text-[#ff0050] hover:bg-[#ff0050] hover:text-white hover:border-[#ff0050]"
                      }`}
                    >
                      {isRendering === selectedArticle.id ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>جاري الإنتاج...</span>
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.47-.88-.64-1.55-1.51-1.92-2.52-.02 2.41.01 4.82-.01 7.23-.01 1.76-.32 3.53-1.07 5.12-.66 1.41-1.74 2.65-3.13 3.39-1.5.8-3.23 1.15-4.92 1.01-1.89-.15-3.75-.95-5.12-2.27-1.43-1.38-2.31-3.32-2.45-5.3-.17-2.38.65-4.82 2.27-6.57 1.54-1.66 3.82-2.61 6.08-2.53.01 1.43.01 2.87.01 4.31-.83-.1-1.69.07-2.42.5-.66.39-1.16 1.05-1.33 1.8-.19 1.13.23 2.37 1.1 3.12.82.72 2.01.95 3.04.62 1.14-.37 1.95-1.4 2.1-2.58.07-1.39.04-2.79.05-4.18 0-4.07-.01-8.13.01-12.2z"/>
                          </svg>
                          <span>إنتاج فيديو تيك توك</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                
                <button
                  onClick={() => {
                    setSelectedArticle(null);
                    setSearchParams({});
                  }}
                  className="px-8 py-2.5 rounded-xl bg-primary text-black font-bold text-sm shadow-[0_0_15px_rgba(242,169,0,0.3)] hover:scale-105 transition-all"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
