import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { VANI_SYSTEM_PROMPT, DIDI_RESPONSE_SCHEMA } from "@/app/lib/didiPrompt";
import { parseOmniIntent } from "@/app/lib/omniHandler";
import { detectLanguageFromText } from "@/app/lib/languages";

// Fix 1: maxDuration = 60s prevents Vercel 10s timeout on Node.js runtime
// Edge runtime is deprecated in Next.js 16. Use nodejs + maxDuration instead.
export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Fix 3: Sanitize known government portal URLs from model hallucinations
function sanitizeUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl) return null;
  const urlMatch = String(rawUrl).match(/https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s,]*)?/);
  if (!urlMatch) return null;
  let cleanUrl = urlMatch[0];
  // Normalize common government portals
  if (cleanUrl.includes("mudra")) return "https://www.mudra.org.in/";
  if (cleanUrl.includes("vishwakarma")) return "https://pmvishwakarma.gov.in/";
  if (cleanUrl.includes("svanidhi")) return "https://pmsvanidhi.mohua.gov.in/";
  if (cleanUrl.includes("irctc")) return "https://www.irctc.co.in/";
  if (cleanUrl.includes("pmjay") || cleanUrl.includes("ayushman")) return "https://pmjay.gov.in/";
  if (cleanUrl.includes("tnstc")) return "https://www.tnstc.in/";
  if (cleanUrl.includes("uidai")) return "https://uidai.gov.in/";
  if (cleanUrl.includes("nrlm")) return "https://nrlm.gov.in/";
  if (cleanUrl.includes("pmkisan")) return "https://pmkisan.gov.in/";
  if (cleanUrl.includes("myscheme")) return "https://www.myscheme.gov.in/";
  if (cleanUrl.includes("tnpds")) return "https://www.tnpds.gov.in/";
  return cleanUrl;
}

// Quick local JSON fallback from omniHandler
function omniToJson(message: string, lang: string) {
  const omni = parseOmniIntent(message, lang);
  return {
    spoken_response: omni.spokenText,
    language: lang,
    type: omni.type,
    ui_mode: omni.type,
    title: omni.title,
    website_url: omni.websiteUrl || null,
    website_label: omni.websiteLabel || null,
    map_query: omni.mapQuery || null,
    phone_hotline: omni.phoneHotline || null,
    highlights: omni.documents || null
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message = "", history = [], language = "ta", userCondition } = body;

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const detectedLang = detectLanguageFromText(message) || language || "ta";

    // No API key → fast local handler
    if (!apiKey) {
      return Response.json(omniToJson(message, detectedLang));
    }

    // Fix 3: Handle simple greetings naturally before calling the AI
    const cleanMsg = (message || "").trim().toLowerCase();
    const isGreeting = /^(vanakkam|vanakam|vanakham|வணக்கம்|namaste|namaskar|hello|hi|hey|நமஸ்தே|नमस्ते|हेलो)[\s!.]*$/i.test(cleanMsg);

    try {
      const ai = new GoogleGenAI({ apiKey });

      // Build conversation history
      const formattedHistory = history.map((turn: { role: string; content: string }) => ({
        role: turn.role === "assistant" ? "model" : "user",
        parts: [{ text: turn.content }]
      }));

      const contextAddon = userCondition
        ? `\n[User Background: Work=${userCondition.work || "general"}, Setup=${userCondition.setup || "individual"}, Capital=${userCondition.capital || "under_50k"}]`
        : "";

      // Fix 3: If user just greets, tell the AI to greet warmly without data-dumping
      const greetingDirective = isGreeting
        ? `\n- IMPORTANT: The user has simply greeted you. Greet them WARMLY and lovingly in their language and ask how you can help today. Do NOT provide scheme data or official links for a simple greeting.`
        : `\n- Answer the user's specific question with helpful, accurate information.`;

      const userPrompt = `[System Directives:
- Selected/Detected User Language: ${detectedLang}.
- RESPOND in the SAME language and script as the user's query (${detectedLang}).
- If Tamil or Tanglish, reply in fluent, easy-to-understand Tamil script.${greetingDirective}
- If the question is about schemes/benefits, include the relevant official website_url.
- If the question is about a location/bank/hospital/station, include map_query.
- If emergency/helpline is relevant, include phone_hotline (108 for ambulance, 139 for railway).]
${contextAddon}

User Message: ${message || "வணக்கம்"}`;

      // Fix 2: Use generateContentStream for real-time streaming to beat Vercel timeout
      // Collect streamed chunks into full response text
      let responseText = "";
      const modelsToTry = ["gemini-3.5-flash-lite", "gemini-3.8-flash"];
      let lastErr: any = null;

      for (const modelName of modelsToTry) {
        try {
          const stream = await ai.models.generateContentStream({
            model: modelName,
            contents: [
              ...formattedHistory,
              { role: "user", parts: [{ text: userPrompt }] }
            ],
            config: {
              systemInstruction: VANI_SYSTEM_PROMPT,
              responseMimeType: "application/json",
              responseSchema: DIDI_RESPONSE_SCHEMA,
              temperature: 0.4
            }
          });

          // Collect all streamed chunks
          for await (const chunk of stream) {
            responseText += chunk.text || "";
          }

          responseText = responseText.trim();
          if (responseText) break;
        } catch (err: any) {
          lastErr = err;
          responseText = "";
          console.warn(`[VANI] Model ${modelName} stream failed, trying next:`, err?.message || err);
        }
      }

      if (!responseText && lastErr) {
        throw lastErr;
      }

      // Parse the collected JSON response
      let parsedData: any;
      try {
        parsedData = JSON.parse(responseText);
      } catch {
        const cleaned = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
        parsedData = JSON.parse(cleaned);
      }

      // Ensure language and UI fields
      if (!parsedData.language) parsedData.language = detectedLang;
      if (!parsedData.ui_mode && parsedData.type) parsedData.ui_mode = parsedData.type;

      // Sanitize URL
      parsedData.website_url = sanitizeUrl(parsedData.website_url);

      return Response.json(parsedData);
    } catch (apiError) {
      console.error("[VANI] Gemini API Error, falling back to omniHandler:", apiError);
      return Response.json(omniToJson(message, detectedLang));
    }
  } catch (error) {
    console.error("[VANI] Request fatal error:", error);
    return Response.json({
      spoken_response: "வணக்கம் சகோதரி, உங்கள் கேள்விக்குரிய தகவல்களை அருகில் உள்ள அரசு அலுவலகம் அல்லது சேவை மையத்தில் பெறலாம்.",
      language: "ta",
      type: "general",
      ui_mode: "general",
      title: "தகவல் உதவி"
    });
  }
}
