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

export async function POST(req: NextRequest) {
  try {
    const { text, lang = "ta" } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const cleanText = text.replace(/[*#_`]/g, "").trim();
    const isTamil = /[\u0B80-\u0BFF]/.test(cleanText) || lang === "ta";
    const ttsLang = isTamil ? "ta" : "en";

    // 1. Try ultra-fast Google Cloud/Translate TTS (100ms latency, native Tamil/English speech)
    try {
      const gUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${ttsLang}&client=tw-ob&q=${encodeURIComponent(
        cleanText.substring(0, 300)
      )}`;
      const gRes = await fetch(gUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
        signal: AbortSignal.timeout(3000)
      });

      if (gRes.ok) {
        const mp3Buffer = Buffer.from(await gRes.arrayBuffer());
        if (mp3Buffer.length > 500) {
          const audioUrl = `data:audio/mpeg;base64,${mp3Buffer.toString("base64")}`;
          return NextResponse.json({
            audioUrl,
            format: "mp3",
            source: "google_tts"
          });
        }
      }
    } catch (_) {
      // Fall through to Gemini TTS
    }

    // 2. Call Gemini 2.5 Flash TTS endpoint with user's Gemini API Key
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (apiKey) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
        const response = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(6000),
          body: JSON.stringify({
            contents: [{ parts: [{ text: cleanText }] }],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: "Kore" }
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
              source: "gemini_tts"
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
