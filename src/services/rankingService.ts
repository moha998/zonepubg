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
      model: "gemini-3-flash-preview",
      contents: [{
        role: "user",
        parts: [{
          text: `أعطني قائمة بأفضل 5 لاعبين ببجي موبايل (PUBG Mobile) في العالم حالياً بناءً على آخر الإحصائيات والبطولات الرسمية.
          
          يجب أن تتضمن المعلومات:
          1. اسم اللاعب.
          2. الدولة.
          3. إحصائية مميزة (مثل عدد الكيلات أو اللقب الحالي).
          
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
    { rank: 1, playerName: 'Order', country: 'الصين', stats: 'أفضل لاعب PMGC 2024' },
    { rank: 2, playerName: 'Paraboy', country: 'الصين', stats: 'أعلى عدد كيلات' },
    { rank: 3, playerName: 'Top', country: 'منغوليا', stats: 'بطل العالم' },
    { rank: 4, playerName: 'Zuxxy', country: 'إندونيسيا', stats: 'قائد أسطوري' },
    { rank: 5, playerName: 'Jonathan', country: 'الهند', stats: 'مهارات استثنائية' }
  ];
}
