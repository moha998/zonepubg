import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Sparkles, TrendingUp, Search, XCircle, Award, MessageSquare, Plus, Loader2, Link as LinkIcon, AlertCircle, Copy, CheckCircle2, Trash2, Upload, Crosshair, Zap, Target, Trophy, Lightbulb, Sword, Settings, Monitor, Bot, Share2, Activity, Eye, EyeOff } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';

function CircularScore({ value, label, icon: Icon, isGolden }: { value: number, label: string, icon: any, isGolden?: boolean }) {
// ... existing CircularScore
  return (
    <div className={`p-6 bg-black/40 border ${isGolden ? 'border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.2)]' : 'border-white/10'} rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group`}>
      <Icon size={32} />
      <span>{label}: {value}</span>
    </div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  return <span>{value}</span>;
}

export default function RatePage(props: any) {
  const {
      videoUrl, setVideoUrl, isAnalyzing, isAiTyping, currentText, currentType, analysisStep, handleAnalyzeVideo, aiRateLimited, aiQuotaError, clips, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, isAdmin, deleteItem, user, handleLogin, onToggleVisibility
  } = props;
  
  const [newClipTitle, setNewClipTitle] = useState("");
  const [newClipUrl, setNewClipUrl] = useState("");
  const [videoDesc, setVideoDesc] = useState("");
  const [isSubmittingClip, setIsSubmittingClip] = useState(false);
  const handleClipFileChange = (e: any) => {};
  const handleSubmitClip = async () => {};
  const handleShareAnalysis = async (clip: any) => {};

  return (
<motion.div
              key="rate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto space-y-16"
            >
              <div className="best-clip-section">
                <div className="space-y-12">
                  <div className="text-center space-y-4">
                    <h2 className="text-4xl font-black gold-shimmer">
                      حلل مستواك (AI Analysis)
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                      ارفع لقطتك الآن واحصل على تحليل فوري مع نصائح احترافية لتطوير لعبك.
                    </p>
                  </div>

                  <div className="pro-card p-8 bg-bg-card/50 border-white/10">
                    <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                      <div className="flex-1 space-y-6 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">عنوان اللقطة</label>
                            <input
                              type="text"
                              placeholder="مثال: سحب سكواد كامل"
                              value={newClipTitle}
                              onChange={(e) => setNewClipTitle(e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">رابط الفيديو أو رفع ملف</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="YouTube/TikTok Link"
                                value={newClipUrl}
                                onChange={(e) => setNewClipUrl(e.target.value)}
                                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                              />
                              <input
                                type="file"
                                accept="video/*"
                                id="analysis-file-upload"
                                className="hidden"
                                onChange={handleClipFileChange}
                              />
                              <label
                                htmlFor="analysis-file-upload"
                                className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer text-slate-400 hover:text-primary flex items-center justify-center"
                              >
                                <Upload size={20} />
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">وصف اللقطة يساعدنا في التحليل </label>
                          <textarea
                            placeholder="اكتب تفاصيل اللقطة هنا (مثال: كنت أستخدم سلاح M416 مع سكوب 4، واجهت سكواد في منطقة مفتوحة...)"
                            value={videoDesc}
                            onChange={(e) => setVideoDesc(e.target.value)}
                            rows={3}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none resize-none"
                          />
                        </div>
                        
                        <button
                          onClick={handleSubmitClip}
                          disabled={isSubmittingClip}
                          className="w-full py-4 bg-primary text-black rounded-xl font-black hover:bg-white transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                          {isSubmittingClip ? (
                            <Loader2 size={24} className="animate-spin" />
                          ) : (
                            <Sparkles size={24} />
                          )}
                          <span>تحليل اللقطة </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Results Section */}
                  <div className="grid grid-cols-1 gap-8">
                    {[...clips]
                      .filter(c => c.authorId === user?.uid)
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((clip) => (
                        <motion.div
                          key={clip.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="pro-card overflow-hidden border-white/5 bg-bg-card/30"
                        >
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                            <div className="aspect-video bg-black">
                              <iframe
                                src={
                                  clip.videoUrl.includes("youtube.com") ||
                                  clip.videoUrl.includes("youtu.be")
                                    ? clip.videoUrl
                                        .replace("watch?v=", "embed/")
                                        .replace(
                                          "youtu.be/",
                                          "youtube.com/embed/"
                                        )
                                    : clip.videoUrl
                                }
                                className="w-full h-full"
                                allowFullScreen
                              />
                            </div>
                            <div className="p-8 space-y-6">
                              <div className="flex justify-between items-start gap-4 flex-wrap">
                                <h3 className="text-2xl font-black text-white">{clip.title}</h3>
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => handleShareAnalysis(clip)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-primary/20 hover:text-primary transition-colors text-xs font-bold text-slate-300"
                                  >
                                    <Share2 size={14} />
                                    مشاركة التحليل
                                  </button>
                                  <span className="text-[10px] text-slate-500 font-bold">{new Date(clip.createdAt).toLocaleDateString('ar-EG')}</span>
                                </div>
                              </div>

                              {clip.aiAnalysis?.xray_results ? (
                                <div className="space-y-6 p-6 bg-gradient-to-br from-yellow-900/20 to-amber-900/10 border border-yellow-500/30 rounded-2xl relative overflow-hidden" dir="rtl">
                                  <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600"></div>
                                  
                                  <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                                      <Activity className="text-yellow-500" size={24} />
                                    </div>
                                    <h4 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
                                      لوحة التحكم الذهبية (X-Ray Analysis)
                                    </h4>
                                  </div>

                                  {/* X-Ray Stats */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <CircularScore 
                                      value={clip.aiAnalysis.xray_results.recoil_stability_score} 
                                      label="ثبات الارتداد" 
                                      icon={Target} 
                                      isGolden={true} 
                                    />
                                    <CircularScore 
                                      value={clip.aiAnalysis.xray_results.headshot_accuracy_percent} 
                                      label="دقة الهيدشوت" 
                                      icon={Crosshair} 
                                      isGolden={true} 
                                    />
                                    <div className="p-6 bg-black/40 border border-yellow-500/20 rounded-2xl flex flex-col items-center justify-center text-center">
                                      <Zap className="text-yellow-500 mb-4" size={32} />
                                      <span className="text-sm font-bold text-slate-400 mb-2">سرعة الحركة</span>
                                      <span className="text-3xl font-black text-yellow-400 mt-2">{clip.aiAnalysis.xray_results.movement_speed}</span>
                                    </div>
                                  </div>

                                  {/* Golden Dashboard Notes */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                    <div className="p-4 bg-black/40 border border-yellow-500/20 rounded-xl">
                                      <div className="flex items-center gap-2 text-yellow-500 mb-2">
                                        <Trophy size={18} />
                                        <span className="font-bold">التقييم الاحترافي</span>
                                      </div>
                                      <p className="text-sm text-slate-300 leading-relaxed">
                                        {clip.aiAnalysis.golden_dashboard?.pro_evaluation || 'لا يوجد تقييم متاح.'}
                                      </p>
                                    </div>
                                    <div className="p-4 bg-black/40 border border-yellow-500/20 rounded-xl">
                                      <div className="flex items-center gap-2 text-yellow-500 mb-2">
                                        <Lightbulb size={18} />
                                        <span className="font-bold">نصيحة تكتيكية</span>
                                      </div>
                                      <p className="text-sm text-slate-300 leading-relaxed">
                                        {clip.aiAnalysis.golden_dashboard?.tactical_advice || 'لا توجد نصائح متاحة.'}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Combat Strategies Display */}
                                  {clip.aiAnalysis.golden_dashboard?.combat_strategies && clip.aiAnalysis.golden_dashboard.combat_strategies.length > 0 && (
                                    <div className="mt-4 space-y-3">
                                      <div className="flex items-center gap-2 text-primary px-2">
                                        <Sword size={20} />
                                        <span className="font-bold text-lg">استراتيجيات المعركة</span>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {clip.aiAnalysis.golden_dashboard.combat_strategies.map((strategy: any, index: number) => (
                                          <div key={index} className="p-4 bg-black/30 border border-primary/20 rounded-xl hover:border-primary/50 transition-colors">
                                            <div className="flex items-center gap-2 mb-2 text-primary">
                                              <Target size={14} />
                                              <span className="font-bold text-sm">{strategy.scenario}</span>
                                            </div>
                                            <p className="text-xs text-slate-300 mb-3 leading-relaxed border-b border-white/5 pb-3">
                                              {strategy.strategy}
                                            </p>
                                            <div className="flex items-start gap-2 text-[11px] text-yellow-400 bg-yellow-400/5 p-2 rounded-lg">
                                              <Lightbulb size={14} className="shrink-0 mt-0.5" />
                                              {strategy.tip}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {clip.aiAnalysis.strategic_note && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mt-4">
                                      <div className="flex items-center gap-2 text-red-400 mb-2">
                                        <Target size={18} />
                                        <span className="font-bold">التحليل ( Analysis)</span>
                                      </div>
                                      <p className="text-sm text-slate-300 leading-relaxed">
                                        {clip.aiAnalysis.strategic_note}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ) : clip.aiAnalysis?.analysis ? (
                                <div className="space-y-6" dir="rtl">
                                  {/* Analysis Stats */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center">
                                      <span className="text-xs text-slate-400 mb-1">تقييم المحترفين</span>
                                      <span className="text-4xl font-black text-primary drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">{clip.aiAnalysis.analysis?.pro_rating || '-'}</span>
                                    </div>
                                    <CircularScore 
                                      value={clip.aiAnalysis.analysis?.recoil_control || 0} 
                                      label="ثبات الارتداد" 
                                      icon={Target} 
                                    />
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center">
                                      <span className="text-xs text-slate-400 mb-1">سرعة رد الفعل</span>
                                      <span className="text-2xl font-black text-orange-400">
                                        <AnimatedNumber value={clip.aiAnalysis.analysis?.reaction_time_ms || 0} />ms
                                      </span>
                                    </div>
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center">
                                      <span className="text-xs text-slate-400 mb-1">كفاءة الحركة</span>
                                      <span className="text-2xl font-black text-green-400">{clip.aiAnalysis.analysis?.movement_efficiency || '0%'}</span>
                                    </div>
                                  </div>

                                  {/* Technical Fixes */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                                      <div className="flex items-center gap-2 text-primary mb-3">
                                        <Settings size={18} />
                                        <span className="font-bold">تعديل الحساسية</span>
                                      </div>
                                      <p className="text-sm text-slate-300 leading-relaxed">
                                        {clip.aiAnalysis.technical_fix?.sensitivity_delta || 'لا توجد تعديلات مقترحة.'}
                                      </p>
                                    </div>
                                    <div className="p-4 bg-sky-500/5 border border-sky-500/10 rounded-2xl">
                                      <div className="flex items-center gap-2 text-sky-500 mb-3">
                                        <Monitor size={18} />
                                        <span className="font-bold">نصيحة الجرافيكس</span>
                                      </div>
                                      <p className="text-sm text-slate-300 leading-relaxed">
                                        {clip.aiAnalysis.technical_fix?.graphic_settings_advice || 'لا توجد نصائح حالياً.'}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Strategic Note */}
                                  <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
                                    <div className="flex items-center gap-2 text-orange-500 mb-3">
                                      <Target size={18} />
                                      <span className="font-bold">ملاحظة تكتيكية</span>
                                    </div>
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                      {clip.aiAnalysis.strategic_note || 'استمر في التدريب!'}
                                    </p>
                                  </div>

                                  {/* Meta */}
                                  <div className="flex items-center justify-end gap-2 text-[10px] text-slate-500">
                                    <Bot size={12} />
                                    <span>Engine: {clip.aiAnalysis.json_meta?.engine || 'Unknown'}</span>
                                  </div>
                                </div>
                              ) : clip.aiAnalysis ? (
                                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center text-slate-400">
                                  هذا التحليل قديم ولا يدعم لوحة التحكم الذهبية.
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-slate-600">
                                  <Loader2 className="animate-spin mb-4" size={32} />
                                  <p className="font-bold">جاري تحليل اللقطة...</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}

                    {clips.filter(c => c.authorId === user?.uid).length === 0 && (
                      <div className="pro-card p-20 border-dashed border-2 border-white/5 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-700">
                          <Sparkles size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-500 mb-3">لا توجد تحليلات سابقة</h3>
                        <p className="text-slate-600 max-w-md mx-auto">
                          ارفع لقطتك الأولى الآن واحصل على تقرير مفصل لتطوير مستواك.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
  );
}
