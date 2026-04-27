import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, 
  Brain, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  Zap, 
  Loader2, 
  Upload, 
  X,
  Play,
  ShieldCheck,
  Trophy,
  Target
} from 'lucide-react';
import { Type } from "@google/genai";
import { getGenAI } from '../lib/gemini';

interface AnalysisResult {
  isGameVideo: boolean;
  positives: string[];
  mistakes: string[];
  tips: string[];
  summary: string;
}

export const AIClipAnalyzer: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) { // 20MB limit for demo
        setError('حجم الفيديو كبير جداً. يرجى رفع فيديو أقل من 20 ميجابايت.');
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const analyzeClip = async () => {
    if (!videoFile) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const base64Data = await fileToBase64(videoFile);
      const ai = getGenAI();
      if (!ai) {
        setError('عذراً، خدمة تحليل اللقطات غير متوفرة حالياً لعدم وجود مفتاح API.');
        setIsAnalyzing(false);
        return;
      }
      const model = (ai as any).getGenerativeModel({
        model: "gemini-1.5-flash",
      });
      
      const prompt = `
        Analyze this video clip from the perspective of a professional PUBG Mobile coach.
        
        First, verify if this video is actually gameplay from PUBG Mobile.
        If it is NOT from PUBG Mobile, set isGameVideo to false.
        
        If it IS from PUBG Mobile:
        1. Identify the positive actions taken by the player (e.g., good aim, positioning, movement).
        2. Identify mistakes or areas for improvement (e.g., bad timing, exposed position, missed shots).
        3. Provide actionable tips to improve.
        4. Write a short summary of the overall performance.
        
        All text must be in Arabic.
        Return the response in JSON format with this structure:
        {
          "isGameVideo": boolean,
          "positives": ["string"],
          "mistakes": ["string"],
          "tips": ["string"],
          "summary": "string"
        }
      `;

      const response = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: videoFile.type,
                  data: base64Data
                }
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isGameVideo: { type: Type.BOOLEAN },
              positives: { type: Type.ARRAY, items: { type: Type.STRING } },
              mistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
              tips: { type: Type.ARRAY, items: { type: Type.STRING } },
              summary: { type: Type.STRING }
            },
            required: ["isGameVideo", "positives", "mistakes", "tips", "summary"]
          }
        }
      });

      const data = JSON.parse(response.response.text() || '{}') as AnalysisResult;
      
      if (!data.isGameVideo) {
        setError('عذراً، يبدو أن هذا الفيديو ليس من لعبة PUBG Mobile. يرجى رفع لقطة من اللعبة فقط.');
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError('حدث خطأ أثناء تحليل اللقطة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
          <Brain size={14} />
          <span>مدعوم بالذكاء الاصطناعي</span>
        </div>
        <h2 className="text-3xl font-black">محلل اللقطات الذكي</h2>
        <p className="text-slate-500">ارفع لقطتك وسيقوم الذكاء الاصطناعي بتحليل أدائك وتقديم نصائح احترافية</p>
      </div>

      {!videoFile ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => fileInputRef.current?.click()}
          className="pro-card p-12 border-dashed border-2 border-white/10 hover:border-primary/50 transition-all cursor-pointer group flex flex-col items-center justify-center gap-4"
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/*"
            className="hidden"
          />
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload size={40} className="text-slate-500 group-hover:text-primary" />
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">اضغط لرفع لقطة الفيديو</p>
            <p className="text-sm text-slate-500">MP4, WebM (بحد أقصى 20 ميجابايت)</p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="pro-card overflow-hidden bg-black relative aspect-video flex items-center justify-center">
              <video 
                src={videoPreview!} 
                controls 
                className="w-full h-full object-contain"
              />
              <button 
                onClick={reset}
                className="absolute top-4 right-4 p-2 bg-black/60 rounded-full hover:bg-red-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col justify-center gap-4">
              <div className="p-6 pro-card border-primary/20 bg-primary/5">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <ShieldCheck className="text-primary" size={20} />
                  جاهز للتحليل
                </h3>
                <p className="text-sm text-slate-400">
                  سيقوم الذكاء الاصطناعي بفحص اللقطة، التأكد من أنها من اللعبة، ثم تقديم تقرير مفصل عن أدائك.
                </p>
              </div>

              <button 
                onClick={analyzeClip}
                disabled={isAnalyzing}
                className="w-full py-4 rounded-2xl bg-primary text-black font-black text-lg hover:bg-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    <span>جاري التحليل...</span>
                  </>
                ) : (
                  <>
                    <Zap size={24} fill="currentColor" />
                    <span>ابدأ التحليل الآن</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500"
              >
                <AlertCircle size={20} />
                <p className="font-bold">{error}</p>
              </motion.div>
            )}

            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="pro-card p-8 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-black">
                      <Trophy size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black">ملخص الأداء</h3>
                      <p className="text-slate-400 text-sm">تقييم شامل من المدرب الذكي</p>
                    </div>
                  </div>
                  <p className="text-lg leading-relaxed">{result.summary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Positives */}
                  <div className="pro-card p-6 border-green-500/20 bg-green-500/5">
                    <h4 className="font-black text-green-500 mb-4 flex items-center gap-2">
                      <CheckCircle2 size={18} />
                      الإيجابيات
                    </h4>
                    <ul className="space-y-3">
                      {result.positives.map((item, i) => (
                        <li key={i} className="text-sm flex gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Mistakes */}
                  <div className="pro-card p-6 border-red-500/20 bg-red-500/5">
                    <h4 className="font-black text-red-500 mb-4 flex items-center gap-2">
                      <AlertCircle size={18} />
                      الأخطاء
                    </h4>
                    <ul className="space-y-3">
                      {result.mistakes.map((item, i) => (
                        <li key={i} className="text-sm flex gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tips */}
                  <div className="pro-card p-6 border-yellow-500/20 bg-yellow-500/5">
                    <h4 className="font-black text-yellow-500 mb-4 flex items-center gap-2">
                      <Lightbulb size={18} />
                      نصائح للتحسن
                    </h4>
                    <ul className="space-y-3">
                      {result.tips.map((item, i) => (
                        <li key={i} className="text-sm flex gap-2">
                          <span className="text-yellow-500 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <button 
                    onClick={reset}
                    className="px-8 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-slate-400 font-bold"
                  >
                    تحليل لقطة أخرى
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
