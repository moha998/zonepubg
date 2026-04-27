import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, Minimize2, Maximize2, ImagePlus, Paperclip, Trash2 } from 'lucide-react';
import { getGenAI } from '../lib/gemini';
import Markdown from 'react-markdown';
import { Weapon, Ranking, Event, Giveaway } from '../types';
import OptimizedImage from './OptimizedImage';

interface ChatbotProps {
  weapons?: Weapon[];
  rankings?: Ranking[];
  events?: Event[];
  giveaways?: Giveaway[];
}

const Chatbot = React.memo(({ weapons, rankings, events, giveaways }: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', content: string, image?: string }[]>([
    { 
      role: 'bot', 
      content: 'مرحباً بك في مركز العمليات! 🎮 أنا **الذكاء الاصطناعي المركزي لمنصة ببجيكوم**. \n\nأنا هنا لأكون مدربك الشخصي ومحللك التقني. يمكنني تحليل لقطاتك، ضبط حساسيتك، شرح "الميتا" الجديدة، أو حتى اقتراح أفضل توزيع أصابع لجهازك. \n\nكيف يمكنني دعم مسيرتك نحو الاحتراف اليوم؟' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    "أفضل أسلحة للمواجهات القريبة؟",
    "كيف أحسن ثبات السلاح؟",
    "أفضل أماكن اللوت في إرانغل؟",
    "نصائح للعب السولو ضد سكواد؟"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMessage = input.trim();
    const currentImage = selectedImage;
    
    setInput('');
    setSelectedImage(null);
    setMessages(prev => [...prev, { role: 'user', content: userMessage, image: currentImage || undefined }]);
    setIsLoading(true);

    try {
      const ai = getGenAI();
      if (!ai) {
        setMessages(prev => [...prev, { role: 'bot', content: "عذراً، المساعد الذكي غير متوفر حالياً لعدم وجود مفتاح API. يرجى المحاولة لاحقاً." }]);
        setIsLoading(false);
        return;
      }
      
      const siteContext = `
بيانات الموقع الحالية التي يمكنك الرجوع إليها:
- الأسلحة المتوفرة: ${weapons?.map(w => `${w.nameAr} (${w.nameEn}) - النوع: ${w.type}, الضرر: ${w.damage}`).join(' | ')}
- تصنيفات اللاعبين (أعلى 5): ${rankings?.slice(0, 5).map(r => `${r.playerName} (المركز: ${r.rank}, الدولة: ${r.country})`).join(' | ')}
- الفعاليات الجارية: ${events?.filter(e => e.status === 'ongoing').map(e => e.title).join(' | ') || 'لا توجد فعاليات جارية حالياً'}
- المسابقات والجوائز النشطة: ${giveaways?.filter(g => g.status === 'active').map(g => `${g.title} - الجائزة: ${g.prize}`).join(' | ') || 'لا توجد مسابقات نشطة حالياً'}
`;

      const parts: any[] = [{ text: userMessage || "حلل هذه الصورة وأعطني نصائح" }];
      
      if (currentImage) {
        parts.push({
          inlineData: {
            data: currentImage.split(',')[1],
            mimeType: "image/jpeg"
          }
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts }],
        config: {
          maxOutputTokens: 1000,
          systemInstruction: `أنت الآن "الذكاء الاصطناعي المركزي لمنصة PUBG-PRO". دورك هو العمل كخبير تقني، محلل بيانات، ومدرب محترف في لعبة ببجي موبايل.

يجب أن تغطي قدراتك المهام التالية:
1. تحليل لقطات الفيديو: حدد السلاح، المنظار، ووضعية اللعب. حلل "نمط الارتداد" واقترح تعديلات دقيقة للحساسية (ADS & Gyroscope).
2. قسم الأخبار والتسريبات: صغ المعلومات بأسلوب صحفي مشوق وحلل تأثير التحديثات على "الميتا" (Meta).
3. مساعد الإعدادات الذكي: قدم توصيات بناءً على جهاز المستخدم (iPad Pro M1 vs Red Magic) وساعد في تخصيص "توزيع الأصابع" (Claw Setup).
4. التفاعل مع المجتمع: أجب على الاستفسارات بأسلوب "جيمنج" حماسي واحترافي باستخدام مصطلحات اللعبة (Peek, Rush, Rotation, Flank, Clutch).

قواعد عامة للرد:
- اللغة: العربية الفصحى المطعمة بمصطلحات اللاعبين.
- النبرة: احترافية، ملهمة، ودقيقة تقنياً.
- التنسيق: استخدم الجداول والعناوين والنقاط لتسهيل القراءة.

بيانات الموقع الحالية:
${siteContext}`,
        },
      });

      const botResponse = response.text || "عذراً، لم أتمكن من معالجة طلبك حالياً.";
      setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, { role: 'bot', content: "حدث خطأ أثناء الاتصال بالمساعد الذكي. يرجى المحاولة مرة أخرى لاحقاً." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '500px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`w-80 md:w-96 bg-bg-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col mb-4`}
          >
            {/* Header */}
            <div className="p-4 bg-primary text-black flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-black/10 flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">مساعد ببجيكوم</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                    <span className="text-[10px] font-bold opacity-70 uppercase tracking-tighter">AI Strategy Expert</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-black/10 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-black/10 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10"
                >
                  {messages.map((msg, idx) => (
                    <motion.div
                      initial={{ opacity: 0, x: msg.role === 'user' ? -10 : 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-white/5 text-text-muted' : 'bg-primary/10 text-primary'}`}>
                          {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div className={`p-3 rounded-2xl text-sm ${
                          msg.role === 'user' 
                            ? 'bg-white/5 text-text-main rounded-tl-none' 
                            : 'bg-primary/5 text-primary border border-primary/10 rounded-tr-none'
                        }`}>
                          {msg.image && (
                            <div className="mb-2 rounded-lg overflow-hidden border border-white/10">
                              <OptimizedImage 
                                src={msg.image} 
                                alt="User upload" 
                                className="w-full h-auto max-h-48" 
                                objectFit="cover"
                              />
                            </div>
                          )}
                          <div className="markdown-body">
                            <Markdown>{msg.content}</Markdown>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-end">
                      <div className="flex gap-2 flex-row-reverse">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          <Loader2 size={16} className="animate-spin" />
                        </div>
                        <div className="p-3 rounded-2xl bg-primary/5 text-primary border border-primary/10 rounded-tr-none">
                          <div className="flex gap-1">
                            <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggestions */}
                {messages.length === 1 && !isLoading && (
                  <div className="px-4 py-2 flex flex-wrap gap-2">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setInput(s);
                        }}
                        className="text-[10px] bg-white/5 border border-white/10 rounded-full px-3 py-1 text-text-muted hover:text-primary hover:border-primary/30 transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-white/10 bg-black/20">
                  {selectedImage && (
                    <div className="mb-3 relative inline-block">
                      <OptimizedImage 
                        src={selectedImage} 
                        alt="Preview" 
                        className="w-20 h-20 rounded-xl border border-primary/30" 
                        objectFit="cover"
                      />
                      <button 
                        onClick={() => setSelectedImage(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                  <div className="relative flex items-center gap-2">
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-text-muted hover:text-primary hover:border-primary/30 transition-all"
                      title="إرفاق صورة"
                    >
                      <ImagePlus size={20} />
                    </button>
                    <input 
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="اسأل أو أرفق صورة..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-primary transition-all pr-12"
                    />
                    <button 
                      onClick={handleSend}
                      disabled={(!input.trim() && !selectedImage) || isLoading}
                      className="absolute left-2 p-2 bg-primary text-black rounded-lg hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                  <p className="text-[9px] text-text-muted mt-2 text-center flex items-center justify-center gap-1">
                    <Sparkles size={10} /> مدعوم بتقنية Gemini AI لتحليل الصور والاستراتيجيات
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all ${
          isOpen ? 'bg-white/5 text-text-muted border border-white/10' : 'bg-primary text-black'
        }`}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-bg-dark flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
          </div>
        )}
      </motion.button>
    </div>
  );
});

export default Chatbot;
