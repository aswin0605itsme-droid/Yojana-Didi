import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { YOJANA_DIDI_SYSTEM_PROMPT, DIDI_RESPONSE_SCHEMA } from "@/app/lib/didiPrompt";
import { simulateYojanaDidiResponse } from "@/app/lib/schemes";
import { detectLanguageFromText } from "@/app/lib/languages";
import { YojanaDidiResponse } from "@/app/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [], turnCount = 1, language = "hi" } = body;

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // Detect language from user input or use selected language
    const detectedLang = detectLanguageFromText(message) || language || "hi";

    // Fast Omnipresent Intent Check (0ms latency for Locations, Websites, Portals)
    const { parseOmniIntent } = await import("@/app/lib/omniHandler");
    const omni = parseOmniIntent(message, detectedLang === "ta" ? "ta" : "en");
    if (omni.type === "location" || omni.type === "website") {
      return NextResponse.json({
        spoken_response: omni.spokenText,
        ui_mode: omni.type,
        language: detectedLang,
        map_query: omni.mapQuery || null,
        website_url: omni.websiteUrl || null,
        website_label: omni.websiteLabel || null,
        action_card_details: {
          scheme_name: omni.title,
          documents_needed: ["Aadhaar Card", "Bank Passbook"],
          where_to_go: omni.mapQuery || "",
          what_to_say: "I am visiting for government scheme assistance."
        }
      });
    }

    // If no API key configured or offline testing, use our multilingual conversational simulator
    if (!apiKey) {
      console.log(`[Yojana Didi] Running in Multilingual Simulator Mode (${detectedLang}, Turn ${turnCount})`);
      const fallbackResponse = simulateYojanaDidiResponse(message, turnCount, detectedLang);
      return NextResponse.json(fallbackResponse);
    }

    // Call live Gemini 3.8 Flash model
    try {
      const ai = new GoogleGenAI({ apiKey });

      // Build context
      const formattedHistory = history.map((turn: { role: string; content: string }) => ({
        role: turn.role === "assistant" ? "model" : "user",
        parts: [{ text: turn.content }]
      }));

      // Add user's latest message with turn count & multilingual guidance
      const promptWithTurn = `
[System Context: This is Turn #${turnCount} of the interaction. 
Selected or detected user language: ${detectedLang}.
CRITICAL LANGUAGE DIRECTIVE: Detect the user's language and respond naturally in the SAME language and script (e.g., Hindi, English, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, etc.). Return the detected 2-letter language code in the "language" field.
${turnCount >= 3 ? "CRITICAL ACTION DIRECTIVE: You have reached 3-4 questions. You MUST now stop asking questions and set ui_mode to 'action_card' with complete action_card_details." : "Ask exactly ONE simple question with no jargon."}]

User message: ${message || "Namaste"}
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          ...formattedHistory,
          {
            role: "user",
            parts: [{ text: promptWithTurn }]
          }
        ],
        config: {
          systemInstruction: YOJANA_DIDI_SYSTEM_PROMPT,
          responseMimeType: "application/json",
          responseSchema: DIDI_RESPONSE_SCHEMA,
          temperature: 0.6
        }
      });

      const responseText = response.text?.trim() || "";
      let parsedData: YojanaDidiResponse;

      try {
        parsedData = JSON.parse(responseText);
      } catch (err) {
        console.warn("[Yojana Didi] JSON parse failed on raw output, cleaning up markdown wrapper if any", err);
        const cleaned = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
        parsedData = JSON.parse(cleaned);
      }

      if (!parsedData.language) {
        parsedData.language = detectedLang;
      }

      // Safeguard: If turnCount >= 4 and model didn't set action_card, enforce action card
      if (turnCount >= 4 && parsedData.ui_mode !== "action_card") {
        const fallback = simulateYojanaDidiResponse(message, 4, parsedData.language || detectedLang);
        parsedData.ui_mode = "action_card";
        parsedData.action_card_details = fallback.action_card_details;
        parsedData.spoken_response = fallback.spoken_response;
      }

      return NextResponse.json(parsedData);
    } catch (apiError) {
      console.error("[Yojana Didi] Gemini API Error, falling back to simulator:", apiError);
      const fallbackResponse = simulateYojanaDidiResponse(message, turnCount, detectedLang);
      return NextResponse.json(fallbackResponse);
    }
  } catch (error) {
    console.error("[Yojana Didi] Request error:", error);
    return NextResponse.json(
      {
        spoken_response: "Maaf kijiye behen, thoda sa network ka chakkar aa gaya hai. Kya aap dobara bol sakti hain?",
        ui_mode: "interview",
        language: "hi",
        action_card_details: {
          scheme_name: null,
          documents_needed: [],
          where_to_go: "",
          what_to_say: ""
        }
      },
      { status: 200 }
    );
  }
}
