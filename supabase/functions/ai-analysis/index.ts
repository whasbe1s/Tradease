import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { GoogleGenAI } from 'npm:@google/genai';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const apiKey = Deno.env.get('GEMINI_API_KEY');
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not set');
        }

        const ai = new GoogleGenAI({ apiKey });

        // Basic auth check - in a real app, we'd verify the JWT from the Authorization header
        // const authHeader = req.headers.get('Authorization');
        // if (!authHeader) {
        //   return new Response('Unauthorized', { status: 401, headers: corsHeaders });
        // }

        const { type, data } = await req.json();

        // Simple rate limiting could go here (e.g. using a counter in DB or Redis)

        let result;
        const model = ai.getGenerativeModel({ model: "gemini-pro" });
        const visionModel = ai.getGenerativeModel({ model: "gemini-pro-vision" });

        if (type === 'chart') {
            if (!data.image) {
                throw new Error('Image data is required for chart analysis');
            }

            const prompt = data.context
                ? `Analyze this trading chart. Context: ${data.context}. Identify the trend, key levels, and potential setup.`
                : "Analyze this trading chart. Identify the trend, key levels, and potential setup.";

            const imageParts = [
                {
                    inlineData: {
                        data: data.image,
                        mimeType: "image/png",
                    },
                },
            ];

            const generatedContent = await visionModel.generateContent([prompt, ...imageParts]);
            const response = await generatedContent.response;
            result = response.text();

        } else if (type === 'sentiment') {
            const prompt = `Analyze the sentiment of the following text related to financial markets: "${data.text}". Provide a brief summary and a sentiment score (Bullish, Bearish, or Neutral).`;
            const generatedContent = await model.generateContent(prompt);
            const response = await generatedContent.response;
            result = response.text();
        } else if (type === 'enrich_link') {
            const prompt = `
          Analyze this URL: ${data.url}.
          ${data.userTitle ? `User provided title: "${data.userTitle}"` : ''}
          
          Task:
          1. Identify a clean, concise title if the user didn't provide a good one.
          2. Write a very short, punchy description (max 15 words) in a "tech-minimalist" tone.
          ${data.skipTags ? '3. Return an empty array for tags.' : '3. Generate 3-5 relevant, single-word tags (lowercase).'}
          
          Return a valid JSON object with the keys: "title", "description", "tags".
          Do not wrap the output in markdown code blocks. Just return the raw JSON string.
        `;
            const generatedContent = await model.generateContent(prompt);
            const response = await generatedContent.response;
            result = response.text();
        } else if (type === 'parse_calendar') {
            const prompt = `
            Analyze this HTML content from ForexFactory's economic calendar.
            Extract the economic events from the table rows.
            
            HTML Content (truncated):
            ${data.htmlContent}

            Task:
            1. Look for table rows (<tr class="calendar__row">).
            2. Extract data from these columns:
               - Time (class="calendar__time")
               - Currency (class="calendar__currency")
               - Event Name (class="calendar__event")
               - Impact (class="calendar__impact" -> look for title="High Impact" etc, or class span)
               - Forecast (class="calendar__forecast")
               - Previous (class="calendar__previous")
            3. If specific values are missing, use "-" or make a reasonable inference.
            4. Format the output as a JSON array of objects.

            Output JSON Format:
            [
                {
                    "time": "HH:MM",
                    "currency": "USD",
                    "event": "Event Name",
                    "impact": "high|medium|low",
                    "forecast": "0.5%",
                    "previous": "0.4%"
                }
            ]

            Return ONLY the raw JSON array. No markdown.
        `;
            const generatedContent = await model.generateContent(prompt);
            const response = await generatedContent.response;
            result = response.text();
        } else if (type === 'market_outlook') {
            const prompt = `
                You are a professional Forex Analyst.
                Analyze the following economic events for today (USD pairs focus):
                
                ${data.eventsText}

                Provide a concise, 3-sentence market outlook. 
                1. What is the key event to watch?
                2. What is the expected volatility?
                3. What is the bias (Bullish/Bearish/Neutral) if any?
                
                Keep it professional, direct, and under 50 words. No disclaimers.
            `;
            const generatedContent = await model.generateContent(prompt);
            const response = await generatedContent.response;
            result = response.text();
        } else {
            throw new Error(`Unknown analysis type: ${type}`);
        }

        return new Response(JSON.stringify({ result }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
