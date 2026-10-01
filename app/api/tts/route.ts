import { NextRequest, NextResponse } from "next/server";

function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1) {
  const header = Buffer.alloc(44);
  const dataSize = pcmBuffer.length;
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * numChannels * 2, 28);
  header.writeUInt16LE(numChannels * 2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);
  return Buffer.concat([header, pcmBuffer]);
}

const LANG_NAMES: Record<string, string> = {
  ta: "Tamil (தமிழ்)",
  hi: "Hindi (हिंदी)",
  te: "Telugu (తెలుగు)",
  kn: "Kannada (ಕನ್ನಡ)",
  ml: "Malayalam (മലയാളം)",
  bn: "Bengali (বাংলা)",
  mr: "Marathi (मराठी)",
  gu: "Gujarati (ગુજરાતી)",
  en: "Indian English"
};

export async function POST(req: NextRequest) {
  try {
    const { text, lang = "ta" } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const cleanText = text.replace(/[*#_`]/g, "").replace(/\s+/g, " ").trim();

    // 1. Robust Regional Indian Language Determination
    let ttsLang = "ta";
    if (lang === "hi" || /[\u0900-\u097F]/.test(cleanText)) {
      ttsLang = "hi";
    } else if (lang === "te" || /[\u0C00-\u0C7F]/.test(cleanText)) {
      ttsLang = "te";
    } else if (lang === "kn" || /[\u0C80-\u0CFF]/.test(cleanText)) {
      ttsLang = "kn";
    } else if (lang === "ml" || /[\u0D00-\u0D7F]/.test(cleanText)) {
      ttsLang = "ml";
    } else if (lang === "bn" || /[\u0980-\u09FF]/.test(cleanText)) {
      ttsLang = "bn";
    } else if (lang === "mr") {
      ttsLang = "mr";
    } else if (lang === "gu" || /[\u0A80-\u0AFF]/.test(cleanText)) {
      ttsLang = "gu";
    } else if (lang === "en") {
      ttsLang = "en";
    } else if (lang === "ta" || /[\u0B80-\u0BFF]/.test(cleanText)) {
      ttsLang = "ta";
    }

    // 2. Try High-Quality Native Regional Google TTS (Sub-300ms latency, native regional accents)
    try {
      // Split into safe chunks if text is long for "Read Whole Page"
      const chunks = cleanText.match(/[^.!?।\n]+[.!?।\n]*/g) || [cleanText];
      const audioBuffers: Buffer[] = [];

      for (const chunk of chunks.slice(0, 4)) {
        const trimmedChunk = chunk.trim();
        if (!trimmedChunk) continue;

        const gUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${ttsLang}&client=tw-ob&q=${encodeURIComponent(
          trimmedChunk.substring(0, 180)
        )}`;

        const gRes = await fetch(gUrl, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
          signal: AbortSignal.timeout(3500)
        });

        if (gRes.ok) {
          const buf = Buffer.from(await gRes.arrayBuffer());
          if (buf.length > 200) {
            audioBuffers.push(buf);
          }
        }
      }

      if (audioBuffers.length > 0) {
        const fullMp3 = Buffer.concat(audioBuffers);
        const audioUrl = `data:audio/mpeg;base64,${fullMp3.toString("base64")}`;
        return NextResponse.json({
          audioUrl,
          format: "mp3",
          source: "google_tts",
          lang: ttsLang
        });
      }
    } catch (_) {
      // Fall through to Gemini TTS
    }

    // 3. Try Live Gemini 2.5 Flash TTS endpoint with Native Language Instruction
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (apiKey) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
        const langName = LANG_NAMES[ttsLang] || "Tamil (தமிழ்)";

        const response = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(6500),
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are VANI, a helpful older sister. Read this text aloud in natural native ${langName} with warm, clear pronunciation: ${cleanText}`
                  }
                ]
              }
            ],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: "Aoede" }
                }
              }
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const inlineData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData;

          if (inlineData?.data) {
            const pcmBuffer = Buffer.from(inlineData.data, "base64");
            let sampleRate = 24000;
            if (inlineData.mimeType && inlineData.mimeType.includes("rate=")) {
              const match = inlineData.mimeType.match(/rate=(\d+)/);
              if (match) sampleRate = parseInt(match[1], 10);
            }

            const wavBuffer = pcmToWav(pcmBuffer, sampleRate, 1);
            const audioUrl = `data:audio/wav;base64,${wavBuffer.toString("base64")}`;

            return NextResponse.json({
              audioUrl,
              sampleRate,
              format: "wav",
              source: "gemini_tts",
              lang: ttsLang
            });
          }
        }
      } catch (_) {}
    }

    return NextResponse.json({ error: "TTS generation failed" }, { status: 500 });
  } catch (error: any) {
    console.error("[TTS Route Exception]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
