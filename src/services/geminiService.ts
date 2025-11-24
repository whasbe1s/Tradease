import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using gemini-2.5-flash for speed and efficiency
const MODEL_NAME = 'gemini-2.5-flash';

import { z } from 'zod';

const LinkSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const enrichLinkData = async (url: string, userTitle?: string): Promise<{ title: string; description: string; tags: string[] }> => {
  try {
    const prompt = `
      Analyze this URL: ${url}.
      ${userTitle ? `User provided title: "${userTitle}"` : ''}
      
      Task:
      1. Identify a clean, concise title if the user didn't provide a good one.
      2. Write a very short, punchy description (max 15 words) in a "tech-minimalist" tone.
      3. Generate 3-5 relevant, single-word tags (lowercase).
      
      Return a valid JSON object with the keys: "title", "description", "tags".
      Do not wrap the output in markdown code blocks. Just return the raw JSON string.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    let text = response.text;
    if (!text) throw new Error("No response from AI");

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    } else {
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    const rawData = JSON.parse(text);
    const data = LinkSchema.parse(rawData);

    return {
      title: data.title || userTitle || url,
      description: data.description || "No description available.",
      tags: data.tags || ["uncategorized"],
    };
  } catch (error) {
    console.error("AI Enrichment Error:", error);
    return {
      title: userTitle || url,
      description: "Auto-enrichment failed.",
      tags: ["manual"],
    };
  }
};

export const suggestSearch = async (query: string, links: any[]): Promise<string> => {
  return "";
}