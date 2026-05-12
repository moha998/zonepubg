import { Type } from "@google/genai";
import { Ranking } from "../types";
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

export async function fetchLatestRankings(): Promise<Partial<Ranking>[]> {
  try {
    const ai = getGenAI();
    if (!ai) {
      return getFallbackRankings();
    }
    const result = await withRetry(() => ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{
        role: "user",
        parts: [{
          text: `أعطني قائمة بأفضل 3 لاعبين ببجي موبايل (PUBG Mobile) في العالم أو سيرفر الشرق الأوسط حالياً بناءً على آخر الإحصائيات والبطولات.
          
          يجب أن تتضمن المعلومات:
          1. اسم اللاعب.
          2. الدولة.
          3. إحصائية مميزة (مثل ملك الكيلات).
          4. الترتيب (rank) من 1 إلى 3.
          
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
              playerName: { type: Type.STRING },
              country: { type: Type.STRING },
              stats: { type: Type.STRING },
              rank: { type: Type.NUMBER }
            },
            required: ['playerName', 'country', 'stats', 'rank']
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
        console.error("JSON Parse Error in fetchLatestRankings:", parseError, "Raw text:", text);
      }
    }
  } catch (error) {
    console.error("Error fetching rankings:", error);
  }
  
  return getFallbackRankings();
}

function getFallbackRankings(): Partial<Ranking>[] {
  return [
    { rank: 1, playerName: 'مجهول', country: 'السعودية', stats: 'ملك الكيلات' },
    { rank: 2, playerName: 'مجهول', country: 'الإمارات', stats: 'بطل القنص' },
    { rank: 3, playerName: 'مجهول', country: 'الكويت', stats: 'تكتيك عالي' }
  ];
}
