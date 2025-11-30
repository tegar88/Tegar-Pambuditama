import { GoogleGenAI, Type } from "@google/genai";
import { KamiSection, AnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini
// Note: In a real production environment, this should probably be proxied through a backend 
// to protect the API key, but for this client-side demo we use the env variable directly.
const ai = new GoogleGenAI({ apiKey });

export const generateSectionSuggestion = async (
  targetSection: KamiSection,
  allSections: KamiSection[],
  userPrompt?: string
): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");

  const contextStr = allSections
    .filter(s => s.id !== targetSection.id && s.content.trim().length > 0)
    .map(s => `${s.title}: ${s.content}`)
    .join('\n\n');

  const prompt = `
    You are a strategic consultant expert in the KAMI framework (Konteks, Analisis, Metode, Impak).
    
    Current Context from other sections:
    ${contextStr || "No other sections filled yet."}

    Task: Provide a detailed, bulleted suggestion for the "${targetSection.title}" (${targetSection.description}) section.
    
    User specific focus: ${userPrompt || "General best practices based on available context."}
    
    Keep it concise, actionable, and professional. Return raw text with markdown formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate suggestion.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export const analyzeCanvas = async (sections: KamiSection[]): Promise<AnalysisResult> => {
  if (!apiKey) throw new Error("API Key not found");

  const canvasContent = sections.map(s => `[${s.title}]: ${s.content}`).join('\n\n');

  const prompt = `
    Analyze this strategic canvas based on the KAMI framework.
    
    Canvas Content:
    ${canvasContent}

    Provide a structured JSON response with a score (0-100), a short summary, list of strengths, list of weaknesses, and actionable suggestions for improvement.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "summary", "strengths", "weaknesses", "suggestions"]
        }
      }
    });
    
    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
