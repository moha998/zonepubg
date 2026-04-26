import OptimizedImage from '../components/OptimizedImage';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, RefreshCw, Flame, Wrench, Calendar, ExternalLink, Target, MessageSquare, Loader2, Send, MessageSquareOff, Trash2, X } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, setDoc, doc, deleteDoc, updateDoc, increment, serverTimestamp, orderBy, onSnapshot } from 'firebase/firestore';

// Types
interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  url: string;
  category: string;
  strategic_note?: string;
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


export default function NewsPage({ SubtleAdBanner }: { SubtleAdBanner: React.FC }) {
  const { user, userProfile, isAdmin, competitionSettings, showNotification } = useGlobalContext();
  
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsFilter, setNewsFilter] = useState("all");
  
  const [comments, setComments] = useState<NewsComment[]>([]);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoadingNews(true);
    try {
      const { fetchPubgNews } = await import("../services/geminiService");
      const data = await fetchPubgNews();
      setNews(data);
    } catch(err) {
      console.error(err);
      showNotification("فشل جلب الأخبار", "error");
    } finally {
      setLoadingNews(false);
    }
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
          disabled={loadingNews}
          className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all disabled:opacity-50"
        >
          <RefreshCw
            className={loadingNews ? "animate-spin text-primary" : "text-primary"}
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

      {loadingNews ? (
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
                className="pro-card overflow-hidden group border-white/5"
              >
                <div className="p-6">
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
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white line-clamp-2">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm mb-4 line-clamp-3">{item.summary}</p>
                  
                  <button 
                    onClick={() => setSelectedArticle(item)}
                    className="text-primary text-xs font-bold hover:underline mb-6 flex items-center gap-1"
                  >
                    اقرأ المزيد 
                    <ExternalLink size={12} />
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
                  onClick={() => setSelectedArticle(null)}
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

              <div className="p-5 border-t border-white/5 bg-[#0a0a0a] flex justify-between items-center relative z-10">
                <a
                  href={selectedArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl hover:bg-white/5 border-white/10 text-slate-300 hover:text-white transition-all text-sm font-bold border"
                >
                  <ExternalLink size={16} />
                  <span>المصدر الأصلي</span>
                </a>
                
                <button
                  onClick={() => setSelectedArticle(null)}
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
