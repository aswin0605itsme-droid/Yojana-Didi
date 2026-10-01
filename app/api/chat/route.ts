import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { YOJANA_DIDI_SYSTEM_PROMPT, DIDI_RESPONSE_SCHEMA } from "@/app/lib/didiPrompt";
import { simulateYojanaDidiResponse } from "@/app/lib/schemes";
import { YojanaDidiResponse } from "@/app/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [], turnCount = 1 } = body;

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // If no API key configured or offline testing, use our realistic conversational simulator
    if (!apiKey) {
      console.log(`[Yojana Didi] Running in Offline Simulator Mode (Turn ${turnCount})`);
      const fallbackResponse = simulateYojanaDidiResponse(message, turnCount);
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

      // Add user's latest message with turn count guidance
      const promptWithTurn = `
[System Context: This is Turn #${turnCount} of the interaction. 
${turnCount >= 3 ? "CRITICAL DIRECTIVE: You have reached 3-4 questions. You MUST now stop asking questions and set ui_mode to 'action_card' with complete action_card_details." : "Ask exactly ONE simple question with no jargon."}]

User message: ${message || "Namaste"}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
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

      // Safeguard: If turnCount >= 4 and model didn't set action_card, enforce action card
      if (turnCount >= 4 && parsedData.ui_mode !== "action_card") {
        const fallback = simulateYojanaDidiResponse(message, 4);
        parsedData.ui_mode = "action_card";
        parsedData.action_card_details = fallback.action_card_details;
        parsedData.spoken_response = fallback.spoken_response;
      }

      return NextResponse.json(parsedData);
    } catch (apiError) {
      console.error("[Yojana Didi] Gemini API Error, falling back to simulator:", apiError);
      const fallbackResponse = simulateYojanaDidiResponse(message, turnCount);
      return NextResponse.json(fallbackResponse);
    }
  } catch (error) {
    console.error("[Yojana Didi] Request error:", error);
    return NextResponse.json(
      {
        spoken_response: "Maaf kijiye behen, thoda sa network ka chakkar aa gaya hai. Kya aap dobara bol sakti hain?",
        ui_mode: "interview",
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
