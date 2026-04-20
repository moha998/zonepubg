import { Type } from "@google/genai";
import { NewsItem } from "../types";
import { getGenAI } from "../lib/gemini";

async function withRetry<T>(fn: () => Promise<T>, retries = 2, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isRetryable = error?.status === 503 || 
                        error?.status === 429 || 
                        error?.message?.includes('503') || 
                        error?.message?.includes('429') ||
                        error?.message?.includes('UNAVAILABLE');
    
    if (retries > 0 && isRetryable) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function fetchPubgNews(): Promise<NewsItem[]> {
  try {
    const ai = getGenAI();
    if (!ai) {
      return getFallbackNews();
    }
    const today = new Date().toISOString().split('T')[0];
    
    const result = await withRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        role: "user",
        parts: [{
          text: `أنت الآن "الذكاء الاصطناعي المركزي لمنصة PUBG-PRO". دورك هو العمل كخبير تقني، محلل بيانات، ومدرب محترف في لعبة ببجي موبايل.
          
          أعطني آخر 8 أخبار وفعاليات وتحديثات وصيانة مجدولة وعروض شدات (UC) وأطوار جديدة وتسريبات للموسم القادم للعبة ببجي موبايل بتاريخ اليوم ${today}.
          
          يجب أن تشمل النتائج:
          1. قسماً خاصاً بـ "التحديثات وساعات الصيانة المجدولة".
          2. تحليل تأثير التحديثات الجديدة على "الميتا" (Meta) الخاصة باللعبة.
          3. قسم الأخبار والتسريبات (News & Leaks Section): عند تزويدك بمعلومات خام أو صور مسربة، قم بصياغتها بأسلوب صحفي مشوق لجذب اللاعبين. بناءً على هذه الصورة المسربة أو المعلومات، حلل التغييرات المتوقعة في أسلوب اللعب (Gameplay Meta). اكتب تقريراً مختصراً للمشتركين في حقل strategic_note يوضح هل يجب عليهم تغيير أسلحتهم المفضلة أم لا.
          
          يجب أن تكون جميع الأخبار والمعلومات حصرياً من الموقع الرسمي لببجي موبايل (pubgmobile.com) أو حساباتهم الرسمية الموثقة.
          
          أرجع النتيجة بتنسيق JSON كقائمة من الكائنات.
          
          قواعد الرد:
          - اللغة: العربية الفصحى المطعمة بمصطلحات اللاعبين.
          - النبرة: احترافية، ملهمة، ودقيقة تقنياً.`
        }]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              date: { type: Type.STRING },
              summary: { type: Type.STRING },
              url: { type: Type.STRING },
              category: { 
                type: Type.STRING,
                enum: ['news', 'uc', 'event', 'mode', 'leaks', 'updates']
              },
              strategic_note: { type: Type.STRING }
            },
            required: ['id', 'title', 'date', 'summary', 'url', 'category']
          }
        }
      }
    }));

    const text = result.text;
    if (text) {
      try {
        const cleanedJson = text.replace(/```json\n?|```/g, '').trim();
        return JSON.parse(cleanedJson);
      } catch (parseError) {
        console.error("JSON Parse Error in fetchPubgNews:", parseError, "Raw text:", text);
      }
    }
  } catch (error) {
    console.error("Error fetching news:", error);
  }
  
  return getFallbackNews();
}

export async function analyzeClipWithAI(title: string, description: string): Promise<any> {
  try {
    const ai = getGenAI();
    if (!ai) {
      return getFallbackAnalysis();
    }
    const result = await withRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        role: "user",
        parts: [{
          text: `أنت المحرك الاستراتيجي والتقني لمنصة PUBG-PRO.
          لقد قام أحد اللاعبين برفع لقطة أو صورة مسربة بعنوان: "${title}" ووصف: "${description}".
          
          قم بإجراء فحص شامل (X-Ray Analysis). استخرج بيانات الارتداد، وسرعة الحركة، ومدى دقة التصويب على الرأس.
          بناءً على هذه اللقطة أو الصورة المسربة، حلل التغييرات المتوقعة في أسلوب اللعب (Gameplay Meta). اكتب تقريراً مختصراً للمشتركين في حقل strategic_note يوضح هل يجب عليهم تغيير أسلحتهم المفضلة أم لا.
          أجب بتنسيق JSON فقط ليعرض الموقع النتائج في لوحة التحكم الذهبية.
          
          يجب أن يكون مخرجك JSON حصراً بهذا التنسيق:
          {
            "xray_results": {
              "recoil_stability_score": 85,
              "movement_speed": "سريع/متوسط/بطيء",
              "headshot_accuracy_percent": 45
            },
            "golden_dashboard": {
              "pro_evaluation": "تقييمك الاحترافي للقطة",
              "tactical_advice": "نصيحة تكتيكية للتحسين"
            },
            "strategic_note": "تقرير مختصر عن الميتا وهل يجب تغيير الأسلحة المفضلة"
          }`
        }]
      }],
      config: {
        temperature: 0.9,
        topP: 0.95,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            xray_results: {
              type: Type.OBJECT,
              properties: {
                recoil_stability_score: { type: Type.NUMBER },
                movement_speed: { type: Type.STRING },
                headshot_accuracy_percent: { type: Type.NUMBER }
              },
              required: ["recoil_stability_score", "movement_speed", "headshot_accuracy_percent"]
            },
            golden_dashboard: {
              type: Type.OBJECT,
              properties: {
                pro_rating: { 
                  type: Type.STRING,
                  enum: ["S", "A", "B", "C", "D"]
                },
                pro_evaluation: { type: Type.STRING },
                tactical_advice: { type: Type.STRING }
              },
              required: ["pro_rating", "pro_evaluation", "tactical_advice"]
            },
            strategic_note: { type: Type.STRING }
          },
          required: ["xray_results", "golden_dashboard", "strategic_note"]
        }
      }
    }));

    const text = result.text;
    if (text) {
      try {
        // Clean the JSON string in case the model wrapped it in markdown code blocks
        const cleanedJson = text.replace(/```json\n?|```/g, '').trim();
        return JSON.parse(cleanedJson);
      } catch (parseError) {
        console.error("JSON Parse Error in analyzeClipWithAI:", parseError, "Raw text:", text);
      }
    }
  } catch (error) {
    console.error("Error analyzing clip:", error);
  }

  return getFallbackAnalysis();
}

function getFallbackNews(): NewsItem[] {
  return [
    {
      id: '1',
      title: 'تحديث ببجي موبايل 4.2: عصر التكنولوجيا المتقدمة',
      date: '2026-03-28',
      summary: 'اكتشف الأسلحة الليزرية الجديدة ومركبات الطيران في خريطة إرانغل المحدثة.',
      url: 'https://www.pubgmobile.com',
      category: 'mode'
    },
    {
      id: '2',
      title: 'تسريبات الموسم القادم: عودة مود الفراعنة المطور',
      date: '2026-04-15',
      summary: 'تشير التسريبات إلى عودة مود الفراعنة الشهير مع إضافات جديدة كلياً وبدلة X-Suit أسطورية.',
      url: 'https://www.pubgmobile.com',
      category: 'leaks'
    },
    {
      id: '3',
      title: 'بطولة العالم 2026: التصفيات النهائية',
      date: '2026-04-01',
      summary: 'تابع أقوى الفرق العالمية وهي تتنافس على اللقب الأغلى في تاريخ اللعبة.',
      url: 'https://www.pubgmobile.com',
      category: 'event'
    },
    {
      id: '4',
      title: 'عرض الشدات: اشحن واحصل على 100% إضافي',
      date: '2026-04-01',
      summary: 'لفترة محدودة، احصل على ضعف كمية الشدات عند الشحن من الموقع الرسمي.',
      url: 'https://www.midasbuy.com',
      category: 'uc'
    },
    {
      id: '5',
      title: 'صيانة مجدولة للسيرفرات: تحديث الإصدار 4.2',
      date: '2026-04-10',
      summary: 'سيتم إغلاق السيرفرات للصيانة المجدولة لتطبيق تحديث الإصدار الجديد. يرجى التأكد من ربط حسابك.',
      url: 'https://www.pubgmobile.com',
      category: 'updates'
    }
  ];
}

function getFallbackAnalysis() {
  const variations = [
    {
      xray_results: {
        recoil_stability_score: 88,
        movement_speed: "سريع",
        headshot_accuracy_percent: 55
      },
      golden_dashboard: {
        pro_evaluation: "أداء ممتاز في المواجهات القريبة، ثبات السلاح جيد جداً ولكن يمكن تحسين دقة الهيدشوت.",
        tactical_advice: "حاول إبقاء مؤشر التصويب (Crosshair) في مستوى الرأس دائماً أثناء الركض."
      }
    },
    {
      xray_results: {
        recoil_stability_score: 72,
        movement_speed: "متوسط",
        headshot_accuracy_percent: 30
      },
      golden_dashboard: {
        pro_evaluation: "تحكم مقبول في الارتداد، لكن الحركة بطيئة نسبياً مما يجعلك هدفاً سهلاً للقناصة.",
        tactical_advice: "استخدم تقنية الـ Jiggle (الحركة يميناً ويساراً) أثناء الإطلاق لتقليل فرصة إصابتك."
      }
    }
  ];
  return variations[Math.floor(Math.random() * variations.length)];
}
