import { supabase } from '../lib/supabaseClient';
import { z } from 'zod';
import { EconomicEvent } from "../types";

const LinkSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Helper to invoke the edge function
const invokeAiAnalysis = async (type: string, data: any) => {
  const { data: result, error } = await supabase.functions.invoke('ai-analysis', {
    body: { type, data }
  });

  if (error) {
    console.error(`AI Analysis Error (${type}):`, error);
    throw new Error(`AI Analysis failed: ${error.message}`);
  }

  return result.result;
};

export const enrichLinkData = async (url: string, userTitle?: string, options?: { skipTags?: boolean }): Promise<{ title: string; description: string; tags: string[] }> => {
  try {
    const resultText = await invokeAiAnalysis('enrich_link', {
      url,
      userTitle,
      skipTags: options?.skipTags
    });

    let text = resultText;
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

export const analyzeChart = async (imageBase64: string, context?: string): Promise<string> => {
  try {
    const result = await invokeAiAnalysis('chart', {
      image: imageBase64,
      context
    });
    return result || "Failed to analyze chart.";
  } catch (error) {
    console.error("Chart Analysis Error:", error);
    throw error;
  }
};

export const analyzeSentiment = async (text: string): Promise<string> => {
  try {
    const result = await invokeAiAnalysis('sentiment', {
      text
    });
    return result || "Failed to analyze sentiment.";
  } catch (error) {
    console.error("Sentiment Analysis Error:", error);
    throw error;
  }
};

export const parseEconomicEvents = async (htmlContent: string): Promise<EconomicEvent[]> => {
  try {
    console.log("Raw HTML Length:", htmlContent.length);
    // Clean up HTML to focus on the calendar table
    // ForexFactory events are usually in a table with class "calendar__table"
    let cleanContent = htmlContent;

    // Try to extract just the calendar table first
    const tableMatch = htmlContent.match(/<table[^>]*class="[^"]*calendar__table[^"]*"[^>]*>[\s\S]*?<\/table>/i);
    if (tableMatch) {
      cleanContent = tableMatch[0];
      console.log("Found Calendar Table!");
    } else {
      // Fallback: Remove scripts, styles, and comments
      cleanContent = htmlContent
        .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "")
        .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, "")
        .replace(/<!--[\s\S]*?-->/gm, "")
        .replace(/\s+/g, " ");
    }

    // Limit length but keep enough for the table
    cleanContent = cleanContent.substring(0, 40000);

    console.log("Cleaned Content Preview:", cleanContent.substring(0, 500));

    const resultText = await invokeAiAnalysis('parse_calendar', {
      htmlContent: cleanContent
    });

    let text = resultText;
    if (!text) throw new Error("No response from AI");

    console.log("AI Raw Response:", text);

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      text = jsonMatch[0];
    } else {
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    const rawEvents = JSON.parse(text);
    console.log("Parsed Events:", rawEvents);

    // Map to EconomicEvent type
    return rawEvents.map((e: any, index: number) => ({
      id: `ai-event-${Date.now()}-${index}`,
      date: new Date().toISOString().split('T')[0], // Assume today for now
      time: e.time || "00:00",
      currency: e.currency || "USD",
      event: e.event || "Unknown Event",
      impact: (e.impact?.toLowerCase() as 'high' | 'medium' | 'low') || 'low',
      forecast: e.forecast || "-",
      previous: e.previous || "-"
    }));

  } catch (error) {
    console.error("AI Calendar Parse Error:", error);
    return [];
  }
};

export const analyzeMarketOutlook = async (eventsText: string): Promise<string> => {
  try {
    const result = await invokeAiAnalysis('market_outlook', {
      eventsText
    });
    return result || "Failed to generate market outlook.";
  } catch (error) {
    throw error;
  }
};
