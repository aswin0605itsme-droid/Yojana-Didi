import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import schemeData from "@/data/scheme.json";

// Prevent Vercel 10s timeout on regional language classification
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { questionId, userSpeech, lang = "ta" } = await req.json();

    const question = schemeData.questions.find((q) => q.id === questionId);
    if (!question) {
      return NextResponse.json({ optionId: null, confirmedText: "" });
    }

    const { classifyAnswerLocally } = await import("@/app/lib/nluClassifier");
    const localMatch = classifyAnswerLocally(questionId, userSpeech, lang);
    if (localMatch.optionId) {
      return NextResponse.json(localMatch);
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ optionId: null, confirmedText: "" });
    }

    const ai = new GoogleGenAI({ apiKey });
    const allowedOptionIds = question.options.map((o) => o.id);

    const prompt = `
You are a strict classifier for a rural Indian women's government scheme assistant.
The question asked was: "${question.speech.en}" (or in Tamil: "${question.speech.ta}")
Allowed option IDs: ${JSON.stringify(allowedOptionIds)}

User spoken answer (in Tamil, Tanglish, or English): "${userSpeech}"

TASK: Classify which allowed option ID best matches the user's intent.
Rules:
- You must ONLY select from: ${JSON.stringify(allowedOptionIds)}
- If no match, return null.
- Output JSON strictly matching: { "optionId": string | null }
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            optionId: {
              type: "STRING",
              nullable: true
            }
          },
          required: ["optionId"]
        },
        temperature: 0.1
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    const matchedOpt = question.options.find((o) => o.id === parsed.optionId);

    return NextResponse.json({
      optionId: parsed.optionId || null,
      confirmedText: matchedOpt ? ((matchedOpt.label as any)[lang] || matchedOpt.label.en) : ""
    });
  } catch (error) {
    console.warn("[Classifier] Gemini classification error:", error);
    return NextResponse.json({ optionId: null, confirmedText: "" });
  }
}
