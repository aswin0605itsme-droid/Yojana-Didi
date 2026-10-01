import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { VANI_SYSTEM_PROMPT, DIDI_RESPONSE_SCHEMA } from "@/app/lib/didiPrompt";
import { parseOmniIntent } from "@/app/lib/omniHandler";
import { detectLanguageFromText } from "@/app/lib/languages";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message = "", history = [], language = "ta", userCondition } = body;

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // Detect language from user input or use selected language
    const detectedLang = detectLanguageFromText(message) || language || "ta";

    // If no API key configured, use fast local omni handler
    if (!apiKey) {
      console.log(`[VANI] No API key; running in local omni handler mode (${detectedLang})`);
      const omni = parseOmniIntent(message, detectedLang);
      return NextResponse.json({
        spoken_response: omni.spokenText,
        language: detectedLang,
        type: omni.type,
        ui_mode: omni.type,
        title: omni.title,
        website_url: omni.websiteUrl || null,
        website_label: omni.websiteLabel || null,
        map_query: omni.mapQuery || null,
        phone_hotline: omni.phoneHotline || null,
        highlights: omni.documents || null
      });
    }

    // Call live Gemini 3.5 Flash Lite (with fallback to gemini-3.8-flash)
    try {
      const ai = new GoogleGenAI({ apiKey });

      // Build context history
      const formattedHistory = history.map((turn: { role: string; content: string }) => ({
        role: turn.role === "assistant" ? "model" : "user",
        parts: [{ text: turn.content }]
      }));

      const contextAddon = userCondition
        ? `\n[User Background Context: Work=${userCondition.work || "general"}, Setup=${userCondition.setup || "individual"}, Capital=${userCondition.capital || "under_50k"}]`
        : "";

      const userPrompt = `
[System Directives:
- Selected/Detected User Language: ${detectedLang}.
- CRITICAL REQUIREMENT: You MUST answer DIRECTLY to the user in the SAME language and script as their query or selected language (${detectedLang}).
- If Tamil or Tanglish, reply in fluent, respectful, natural Tamil script.
- Answer ANY question: schemes, government benefits, hospitals, 108 ambulance, train booking, 139 helpline, bus stands/timings, locations, or general doubts.
- Include accurate official website URLs (e.g. mudra.org.in, pmvishwakarma.gov.in, pmsvanidhi.mohua.gov.in, irctc.co.in, tnstc.in, pmjay.gov.in, myscheme.gov.in) if relevant.
- Include map_query if location/bank/hospital/station is relevant.
- Include phone_hotline if emergency/helpline is relevant.]
${contextAddon}

User Message: ${message || "வணக்கம்"}
`;

      let responseText = "";
      const modelsToTry = ["gemini-3.5-flash-lite", "gemini-3.8-flash"];
      let lastErr: any = null;

      for (const modelName of modelsToTry) {
        try {
          const res = await ai.models.generateContent({
            model: modelName,
            contents: [
              ...formattedHistory,
              {
                role: "user",
                parts: [{ text: userPrompt }]
              }
            ],
            config: {
              systemInstruction: VANI_SYSTEM_PROMPT,
              responseMimeType: "application/json",
              responseSchema: DIDI_RESPONSE_SCHEMA,
              temperature: 0.4
            }
          });
          responseText = res.text?.trim() || "";
          if (responseText) break;
        } catch (err: any) {
          lastErr = err;
          console.warn(`[VANI] Model ${modelName} call failed, trying next:`, err?.message || err);
        }
      }

      if (!responseText && lastErr) {
        throw lastErr;
      }

      let parsedData: any;
      try {
        parsedData = JSON.parse(responseText);
      } catch {
        const cleaned = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
        parsedData = JSON.parse(cleaned);
      }

      if (!parsedData.language) {
        parsedData.language = detectedLang;
      }
      if (!parsedData.ui_mode && parsedData.type) {
        parsedData.ui_mode = parsedData.type;
      }

      // Sanitize website_url
      if (parsedData.website_url) {
        const urlMatch = String(parsedData.website_url).match(/https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s,]*)?/);
        if (urlMatch) {
          let cleanUrl = urlMatch[0];
          // Common government portals normalization
          if (cleanUrl.includes("mudra")) cleanUrl = "https://www.mudra.org.in/";
          else if (cleanUrl.includes("vishwakarma")) cleanUrl = "https://pmvishwakarma.gov.in/";
          else if (cleanUrl.includes("svanidhi")) cleanUrl = "https://pmsvanidhi.mohua.gov.in/";
          else if (cleanUrl.includes("irctc")) cleanUrl = "https://www.irctc.co.in/";
          else if (cleanUrl.includes("pmjay") || cleanUrl.includes("ayushman")) cleanUrl = "https://pmjay.gov.in/";
          else if (cleanUrl.includes("tnstc")) cleanUrl = "https://www.tnstc.in/";
          else if (cleanUrl.includes("uidai")) cleanUrl = "https://uidai.gov.in/";
          parsedData.website_url = cleanUrl;
        } else {
          parsedData.website_url = null;
        }
      }

      return NextResponse.json(parsedData);
    } catch (apiError) {
      console.error("[VANI] Gemini API Error, falling back to omniHandler:", apiError);
      const omni = parseOmniIntent(message, detectedLang);
      return NextResponse.json({
        spoken_response: omni.spokenText,
        language: detectedLang,
        type: omni.type,
        ui_mode: omni.type,
        title: omni.title,
        website_url: omni.websiteUrl || null,
        website_label: omni.websiteLabel || null,
        map_query: omni.mapQuery || null,
        phone_hotline: omni.phoneHotline || null,
        highlights: omni.documents || null
      });
    }
  } catch (error) {
    console.error("[VANI] Request fatal error:", error);
    return NextResponse.json(
      {
        spoken_response: "வணக்கம் சகோதரி, உங்கள் கேள்விக்குரிய தகவல்களை அருகில் உள்ள அரசு அலுவலகம் அல்லது சேவை மையத்தில் பெறலாம்.",
        language: "ta",
        type: "general",
        ui_mode: "general",
        title: "தகவல் உதவி"
      },
      { status: 200 }
    );
  }
}
