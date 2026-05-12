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
      model: "gemini-2.0-flash-exp",
      contents: [{
        role: "user",
        parts: [{
          text: `أنت الآن "الذكاء الاصطناعي المركزي لمنصة ZONE PUBG". دورك هو العمل كخبير تقني، محلل بيانات، ومدرب محترف في لعبة ببجي موبايل.
          
          أعطني آخر 8 أخبار وفعاليات وتحديثات وصيانة مجدولة وعروض شدات (UC) وأطوار جديدة وتسريبات للموسم القادم للعبة ببجي موبايل بتاريخ اليوم ${today}.
          
          هام جداً: يجب أن يكون حقل "url" رابطاً حقيقياً ومباشراً للخبر من موقع pubgmobile.com أو esports.pubgmobile.com. إذا لم يتوفر رابط محدد، استخدم "https://www.pubgmobile.com/en-US/news.shtml".
          
          يجب أن تشمل النتائج:
          1. قسماً خاصاً بـ "التحديثات وساعات الصيانة المجدولة".
          2. تحليل تأثير التحديثات الجديدة على "الميتا" (Meta) الخاصة باللعبة.
          3. قسم الأخبار والتسريبات (News & Leaks Section).
          
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
              image: { type: Type.STRING, description: "Detailed English prompt for generating a realistic PUBG Mobile news image" },
              category: { 
                type: Type.STRING,
                enum: ['news', 'uc', 'event', 'mode', 'leaks', 'updates']
              },
              strategic_note: { type: Type.STRING }
            },
            required: ['id', 'title', 'date', 'summary', 'url', 'category', 'image']
          }
        }
      }
    }));

    const text = result.text;
    if (text) {
      try {
        const cleanedJson = text.replace(/```json\n?|```/g, '').trim();
        const parsed = JSON.parse(cleanedJson);
        return parsed.map((item: any) => {
          let url = item.url;
          const OFFICIAL_SITE = 'https://www.pubgmobile.com';
          const FALLBACK = `${OFFICIAL_SITE}/en-US/news.shtml`;
          
          if (!url || typeof url !== 'string' || url.trim() === '' || url.trim() === '#' || url.trim() === 'undefined' || url.trim() === 'null') {
            url = FALLBACK;
          } else {
            const trimmedUrl = url.trim();
            if (trimmedUrl.startsWith('/')) {
              url = `${OFFICIAL_SITE}${trimmedUrl}`;
            } else if (!trimmedUrl.startsWith('http')) {
              url = `https://${trimmedUrl}`;
            } else {
              url = trimmedUrl;
            }
          }
          
          return {
            ...item,
            url,
            image: `https://image.pollinations.ai/prompt/${encodeURIComponent(item.image + " PUBG Mobile official game screenshot realistic 4k")}?width=800&height=450&nologo=true`
          };
        });
      } catch (parseError) {
        console.error("JSON Parse Error in fetchPubgNews:", parseError, "Raw text:", text);
      }
    }
  } catch (error) {
    console.warn("Feedback about news:", error?.message || error);
  }
  
  return getFallbackNews();
}

export async function fetchPubgRankings(): Promise<any[]> {
  try {
    const ai = getGenAI();
    if (!ai) return getFallbackRankings();
    
    const result = await withRetry(() => ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{
        role: "user",
        parts: [{
          text: `أنت الآن "محلل البيانات الرسمي لمنصة ZONE PUBG".
          أعطني قائمة بأفضل 10 لاعبين متصدرين (Leaderboard) في لعبة ببجي موبايل (إقليم الشرق الأوسط أو العالم) بناءً على آخر الإحصائيات المتوفرة.
          
          يجب أن تتضمن كل خانة:
          - رتبة اللاعب (Rank) من 1 إلى 10.
          - اسم اللاعب (Player Name).
          - الدولة (Country).
          - الإحصائية الرئيسية (Stats): عدد الكيلات (K/D), نسبة الفوز، أو اللقب (مثل: قاهر، ملك القنص).
          
          أرجع النتيجة بتنسيق JSON كقائمة من الكائنات.`
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
              rank: { type: Type.NUMBER },
              playerName: { type: Type.STRING },
              country: { type: Type.STRING },
              stats: { type: Type.STRING }
            },
            required: ['rank', 'playerName', 'country', 'stats']
          }
        }
      }
    }));

    const text = result.text;
    if (text) {
      const cleanedJson = text.replace(/```json\n?|```/g, '').trim();
      return JSON.parse(cleanedJson);
    }
  } catch (error) {
    console.warn("Feedback about rankings:", error?.message || error);
  }
  return getFallbackRankings();
}

export async function analyzeClipWithAI(title: string, description: string): Promise<any> {
  try {
    const ai = getGenAI();
    if (!ai) {
      return getFallbackAnalysis();
    }
    const result = await withRetry(() => ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{
        role: "user",
        parts: [{
          text: `أنت المحرك الاستراتيجي والتقني لمنصة ZONE PUBG.
          لقد قام أحد اللاعبين برفع لقطة أو صورة مسربة بعنوان: "${title}" ووصف: "${description}".
          
          قم بإجراء فحص شامل (X-Ray Analysis). استخرج بيانات الارتداد، وسرعة الحركة، ومدى دقة التصويب على الرأس.
          بناءً على هذا المقطع، قم بتوسيع نطاق تحليلك ليشمل "استراتيجيات المعارك". قدم للمشتركين نصائح تكتيكية دقيقة ومفصلة بناءً على سيناريوهات القتال المختلفة (مثل: المواجهات القريبة CQC، القتال السطحي، القنص والمسافات البعيدة، واستخدام القنابل، والتمركز في الزون). 
          حدد السيناريو الغالب في المقطع وقدم نصائح مخصصة لكيفية التفوق فيه.
          اكتب تقريراً مختصراً للمشتركين في حقل strategic_note يوضح التغييرات المتوقعة في أسلوب اللعب (Gameplay Meta) وهل يجب تغيير الأسلحة.
          
          أجب بتنسيق JSON فقط ليعرض الموقع النتائج في لوحة التحكم الذهبية.
          
          يجب أن يكون مخرجك JSON حصراً بهذا التنسيق:
          {
            "xray_results": {
              "recoil_stability_score": 85,
              "movement_speed": "سريع/متوسط/بطيء",
              "headshot_accuracy_percent": 45
            },
            "golden_dashboard": {
              "pro_rating": "S",
              "pro_evaluation": "تقييمك الاحترافي للقطة",
              "tactical_advice": "نصائح تكتيكية عامة للتحسين",
              "combat_strategies": [
                {
                  "scenario": "اسم السيناريو (مثل: المواجهات القريبة / CQC)",
                  "strategy": "الاستراتيجية المطبقة أو المقترحة للسيطرة على هذا الموقف",
                  "tip": "نصيحة ذهبية قصيرة وحاسمة للسيناريو"
                }
              ]
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
                tactical_advice: { type: Type.STRING },
                combat_strategies: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      scenario: { type: Type.STRING },
                      strategy: { type: Type.STRING },
                      tip: { type: Type.STRING }
                    },
                    required: ["scenario", "strategy", "tip"]
                  }
                }
              },
              required: ["pro_rating", "pro_evaluation", "tactical_advice", "combat_strategies"]
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
      title: 'تحديث ببجي موبايل 3.2: إصدار الميكا المنتظر',
      date: '2024-05-14',
      summary: 'انغمس في عالم من الخيال مع مود الميكا الجديد كلياً. اختبر القوة الفائقة للمحاربين الآليين في ساحات القتال.',
      url: 'https://www.pubgmobile.com',
      image: 'https://image.pollinations.ai/prompt/PUBG%20Mobile%20Version%203.2%20Mecha%20Fusion%20Update%20Official%20Poster?width=800&height=450&nologo=true',
      category: 'mode'
    },
    {
      id: '2',
      title: 'ملاحظات التحديث والميزات الجديدة',
      date: '2024-05-12',
      summary: 'تعرف على التغييرات الجذرية في خرائط اللعبة والأسلحة المعدلة في التحديث الأخير 3.2.',
      url: 'https://www.pubgmobile.com',
      image: 'https://image.pollinations.ai/prompt/PUBG%20Mobile%20Tatical%20Gameplay%20Strategy%20Erangel?width=800&height=450&nologo=true',
      category: 'news'
    },
    {
      id: '3',
      title: 'بطولة كأس المواهب العربية: الجوائز والفرق',
      date: '2024-06-05',
      summary: 'انطلاق أقوى البطولات العربية بجوائز ضخمة. تعرف على كيفية المشاركة وجداول المباريات.',
      url: 'https://esports.pubgmobile.com',
      image: 'https://image.pollinations.ai/prompt/PUBG%20Mobile%20Esports%20Arena%20Arab%20Championship?width=800&height=450&nologo=true',
      category: 'event'
    },
    {
      id: '4',
      title: 'عرض الشدات: اشحن واحصل على 100% إضافي',
      date: '2026-04-01',
      summary: 'لفترة محدودة، احصل على ضعف كمية الشدات عند الشحن من الموقع الرسمي.',
      url: 'https://www.midasbuy.com',
      image: 'https://image.pollinations.ai/prompt/PUBG%20Mobile%20UC%20Currency%20Gold%20Coins?width=800&height=450&nologo=true',
      category: 'uc'
    },
    {
      id: '5',
      title: 'صيانة مجدولة للسيرفرات: تحديث الإصدار 4.2',
      date: '2026-04-10',
      summary: 'سيتم إغلاق السيرفرات للصيانة المجدولة لتطبيق تحديث الإصدار الجديد. يرجى التأكد من ربط حسابك.',
      url: 'https://www.pubgmobile.com',
      image: 'https://image.pollinations.ai/prompt/PUBG%20Mobile%20Server%20Maintenance%20Message?width=800&height=450&nologo=true',
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

function getFallbackRankings(): any[] {
  return [
    { id: '1', rank: 1, playerName: 'Sc0utOP', country: 'India', stats: 'K/D: 8.5' },
    { id: '2', rank: 2, playerName: 'Levinho', country: 'Sweden', stats: 'K/D: 9.2' },
    { id: '3', rank: 3, playerName: 'Jonathan', country: 'India', stats: 'K/D: 7.8' },
    { id: '4', rank: 4, playerName: 'BTR Zuxxy', country: 'Indonesia', stats: 'Champion' },
    { id: '5', rank: 5, playerName: 'Paraboy', country: 'China', stats: 'The God' }
  ];
}
