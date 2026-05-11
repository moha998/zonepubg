import { GoogleGenAI } from "@google/genai";

let genAI: GoogleGenAI | null = null;

export function getGenAI(): GoogleGenAI | null {
  if (!genAI) {
    // Try to find the API key in various possible locations
    // process.env.GEMINI_API_KEY is the primary source in this environment
    const apiKey = (process.env.GEMINI_API_KEY) || 
                   import.meta.env.VITE_GEMINI_API_KEY ||
                   (window as any).VITE_GEMINI_API_KEY ||
                   (window as any).GEMINI_API_KEY;
    
    if (!apiKey || typeof apiKey !== 'string' || apiKey.length < 10 || apiKey.includes('YOUR_API_KEY')) {
      return null;
    }
    
    try {
      const trimmedKey = apiKey.trim();
      if (trimmedKey) {
        genAI = new GoogleGenAI({ apiKey: trimmedKey });
      }
    } catch (error: any) {
      // Only log as error if it's not the expected "missing key" error
      if (error?.message?.includes('API Key must be set')) {
        console.warn("Gemini AI initialization skipped: API Key is missing or invalid.");
      } else {
        console.error("Error initializing Gemini AI:", error);
      }
      return null;
    }
  }
  return genAI;
}
