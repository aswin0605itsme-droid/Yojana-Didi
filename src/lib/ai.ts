/**
 * VANI AI Layer: Abstraction for Transcribe, Reply, and Speak.
 * Starts with resilient offline/canned mock capabilities and seamlessly
 * connects to live Gemini 2.5 Flash endpoints via server routes.
 */

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AIReplyResult {
  text: string;
  englishCaption?: string;
  detectedLang?: string;
}

// Canned domain replies for rural women's empowerment schemes
const CANNED_REPLIES: Record<string, { text: string; en: string }[]> = {
  ta: [
    {
      text: "தையல் மற்றும் சிறு தொழில் தொடங்க பிரதமர் முத்ரா கடன் திட்டம் சிறந்தது. ₹50,000 வரை பிணையம் இல்லாமல் நிதி உதவி பெறலாம்.",
      en: "PM Mudra Scheme is best to start tailoring and small business. You can get up to ₹50,000 collateral-free."
    },
    {
      text: "சுய உதவிக்குழு (SHG) மூலம் பெண்களுக்கு சிறப்பு மானியத்துடன் கூடிய சுலப தவணை கடன்கள் வழங்கப்படுகின்றன.",
      en: "Easy installment loans with special subsidies are provided to women through Self Help Groups (SHG)."
    },
    {
      text: "விண்ணப்பிக்க ஆதார் அட்டை, வங்கி பாஸ்புக் மற்றும் 2 புகைப்படங்கள் போதுமானது. அருகில் உள்ள அரசு வங்கியில் விண்ணப்பிக்கலாம்.",
      en: "Aadhaar card, bank passbook and 2 photos are sufficient to apply at any nearby government bank."
    }
  ],
  hi: [
    {
      text: "सिलाई और छोटे काम के लिए प्रधानमंत्री मुद्रा योजना सबसे अच्छी है। बिना किसी गारंटी के ₹50,000 तक की सहायता मिलती है।",
      en: "PM Mudra scheme is best for tailoring and micro business. Up to ₹50,000 without collateral."
    },
    {
      text: "स्वयं सहायता समूह (SHG) से जुड़कर बहनें सरकारी अनुदान और कम ब्याज पर ऋण प्राप्त कर सकती हैं।",
      en: "By joining SHG, sisters can get government subsidies and low-interest loans."
    }
  ],
  en: [
    {
      text: "Pradhan Mantri Mudra Yojana offers up to ₹50,000 collateral-free loan for tailoring and women entrepreneurs.",
      en: "Pradhan Mantri Mudra Yojana offers up to ₹50,000 collateral-free loan for tailoring and women entrepreneurs."
    },
    {
      text: "You can apply at your nearest public sector bank with your Aadhaar Card, Bank Passbook, and 2 passport photos.",
      en: "You can apply at your nearest public sector bank with your Aadhaar Card, Bank Passbook, and 2 passport photos."
    }
  ]
};

/**
 * 1. Transcribe audioBlob -> text
 */
export async function transcribe(audioBlob?: Blob): Promise<string> {
  // If no blob or offline mock mode
  if (!audioBlob || audioBlob.size === 0) {
    return "தையல் தொழில் தொடங்க கடன் வேண்டும்";
  }

  try {
    // If backend transcribe route exists, call it with audio/webm
    const formData = new FormData();
    formData.append("audio", audioBlob);

    const res = await fetch("/api/transcribe", {
      method: "POST",
      body: formData
    });

    if (res.ok) {
      const data = await res.json();
      return data.text || "தையல் தொழில் தொடங்க கடன் வேண்டும்";
    }
  } catch (_) {
    // Fall back to mock
  }

  return "தையல் தொழில் தொடங்க கடன் வேண்டும்";
}

/**
 * 2. Reply to conversation history using Gemini API or offline mocks
 */
export async function reply(
  history: ChatMessage[],
  lang: string = "ta"
): Promise<AIReplyResult> {
  const latestMessage = history[history.length - 1]?.content || "";

  // Call server-side Gemini 2.5 Flash endpoint
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: latestMessage,
        history,
        language: lang,
        turnCount: history.length
      })
    });

    if (res.ok) {
      const data = await res.json();
      const text = data.spoken_response || data.text || "";
      if (text) {
        return {
          text,
          englishCaption: data.english_caption || data.action_card_details?.what_to_say || undefined,
          detectedLang: data.language || lang
        };
      }
    }
  } catch (err) {
    console.warn("[VANI AI] Chat API error, falling back to mock reply:", err);
  }

  // Canned fallback reply based on language and keywords
  const pool = CANNED_REPLIES[lang] || CANNED_REPLIES["ta"] || CANNED_REPLIES["en"];
  const pick = pool[Math.floor(Math.random() * pool.length)];

  return {
    text: pick.text,
    englishCaption: pick.en,
    detectedLang: lang
  };
}

/**
 * 3. Speak text in the specified language -> returns audio base64 or audio element
 */
export async function speak(
  text: string,
  lang: string = "ta"
): Promise<{ audioUrl?: string; source: "api" | "synthesis" }> {
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.audioUrl) {
        return {
          audioUrl: data.audioUrl,
          source: "api"
        };
      }
    }
  } catch (err) {
    console.warn("[VANI AI] TTS API error, falling back to browser synthesis:", err);
  }

  return {
    source: "synthesis"
  };
}
