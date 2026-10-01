"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  Sparkles,
  ShieldAlert,
  Globe2,
  Check,
  X,
  Loader2
} from "lucide-react";
import { FrontAvatar, AvatarState } from "./FrontAvatar";
import { useAudioAnalyser } from "../hooks/useAudioAnalyser";
import { SUPPORTED_LANGUAGES, detectLanguageFromText } from "../lib/languages";

interface VaniFrontPageProps {
  onLanguageIdentifiedAndQuery: (detectedLang: string, query?: string) => void;
  onStartConsultation?: () => void;
  currentLang?: string;
  onSelectLang?: (lang: string) => void;
}

// Multilingual Greetings Rotating Ticker
const MULTI_GREETINGS = [
  { text: "வணக்கம்! இங்கே பேசுங்கள் அல்லது தட்டச்சு செய்க", lang: "ta", label: "தமிழ்" },
  { text: "नमस्ते! यहाँ बोलें या अपनी भाषा में लिखें", lang: "hi", label: "हिंदी" },
  { text: "Speak here or type in any language", lang: "en", label: "English" },
  { text: "నమస్తే! ఇక్కడ మాట్లాడండి లేదా టైప్ చేయండి", lang: "te", label: "తెలుగు" },
  { text: "ನಮಸ್ಕಾರ! ಇಲ್ಲಿ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ", lang: "kn", label: "ಕನ್ನಡ" },
  { text: "നമസ്കാരം! ഇവിടെ സംസാരിക്കുക അല്ലെങ്കിൽ ടൈപ്പ് ചെയ്യുക", lang: "ml", label: "മലയാളം" },
  { text: "নমস্কার! এখানে কথা বলুন বা টাইপ করুন", lang: "bn", label: "বাংলা" }
];

// Spoken scripts per language for "Read Whole Page"
const FRONT_PAGE_READ_TEXTS: Record<
  string,
  { bubble: string; mic: string; textbox: string }
> = {
  ta: {
    bubble: "வணக்கம்! நான் வாணி. மகளிர் மற்றும் ஊரக மக்களுக்கான அரசு வழிகாட்டி.",
    mic: "பேசி பதிலளிக்க, நடுவில் உள்ள பெரிய மைக்ரோஃபோன் பொத்தானை ஒருமுறை தொடவும்.",
    textbox: "அல்லது உங்கள் சந்தேகங்களை கீழே உள்ள கட்டத்தில் தட்டச்சு செய்து அனுப்பலாம்."
  },
  hi: {
    bubble: "नमस्ते! मैं वाणी हूँ। बहनों और ग्रामीणों के लिए सरकारी योजना सहायक।",
    mic: "बोलकर बात करने के लिए बीच में बड़े माइक बटन को एक बार दबाएँ।",
    textbox: "या नीचे दिए गए बॉक्स में लिखकर अपना सवाल पूछ सकते हैं।"
  },
  te: {
    bubble: "నమస్తే! నేను వాణిని. మహిళలు మరియు గ్రామీణ ప్రజలకు ప్రభుత్వ సహాయకురాలిని.",
    mic: "మాట్లాడటానికి మధ్యలోని పెద్ద మైక్రోఫోన్ బటన్‌ను నొక్కండి.",
    textbox: "లేదా క్రింది బాక్స్‌లో టైప్ చేసి మీ ప్రశ్నను పంపవచ్చు."
  },
  kn: {
    bubble: "ನಮಸ್ಕಾರ! ನಾನು ವಾಣಿ. ಮಹಿಳೆಯರು ಮತ್ತು ಗ್ರಾಮೀಣ ಜನರಿಗಾಗಿ ಸರ್ಕಾರಿ ಮಾರ್ಗದರ್ಶಿ.",
    mic: "ಮಾತನಾಡಲು ಮಧ್ಯದಲ್ಲಿರುವ ದೊಡ್ಡ ಮೈಕ್ರೊಫೋನ್ ಬಟನ್ ಸ್ಪರ್ಶಿಸಿ.",
    textbox: "ಅಥವಾ ಕೆಳಗಿನ ಬಾಕ್ಸ್‌ನಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕಳುಹಿಸಬಹುದು."
  },
  ml: {
    bubble: "നമസ്കാരം! ഞാൻ വാണി. സ്ത്രീകൾക്കും ഗ്രാമീണർക്കുമായുള്ള സർക്കാർ സഹായി.",
    mic: "സംസാരിക്കാൻ നടുവിലുള്ള വലിയ മൈക്രോഫോൺ ബട്ടൺ അമർത്തുക.",
    textbox: "അല്ലെങ്കിൽ താഴെയുള്ള ബോക്സിൽ ടൈപ്പ് ചെയ്ത് അയക്കാം."
  },
  bn: {
    bubble: "নমস্কার! আমি বাণী। গ্রামীণ নারী ও সাধারণ মানুষের সরকারি সহায়িকা।",
    mic: "মুখে কথা বলতে মাঝের বড় মাইক বোতামে চাপ দিন।",
    textbox: "অথবা নিচের বক্সে লিখে প্রশ্ন পাঠাতে পারেন।"
  },
  en: {
    bubble: "Hello! I am VANI, your trusted government scheme and welfare guide.",
    mic: "To speak, tap the giant microphone button in the center.",
    textbox: "Or you can type your doubts in the highlighted box below."
  }
};

export function VaniFrontPage({
  onLanguageIdentifiedAndQuery,
  onStartConsultation,
  currentLang = "ta",
  onSelectLang
}: VaniFrontPageProps) {
  const [activeLang, setActiveLang] = useState(currentLang);
  const [avatarState, setAvatarState] = useState<AvatarState>("waving");
  const [typedText, setTypedText] = useState("");
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [userTranscriptBubble, setUserTranscriptBubble] = useState<string | null>(null);

  // Focus & Glow highlighting states
  const [isMicGlowing, setIsMicGlowing] = useState(true);
  const [isTextBoxGlowing, setIsTextBoxGlowing] = useState(false);
  const [isMicAvailable, setIsMicAvailable] = useState(true);
  const [showAllowPermissionDialog, setShowAllowPermissionDialog] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  // "Read Whole Page" states
  const [isReadingPage, setIsReadingPage] = useState(false);
  const [isLoadingSpeech, setIsLoadingSpeech] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<"bubble" | "mic" | "textbox" | null>(null);
  const readingCancelledRef = useRef(false);

  // Audio & Hardware Analyser Hook
  const {
    mouthOpenness,
    playAudioWithAnalyser,
    stopAudio,
    getAudioContext
  } = useAudioAnalyser();

  const hasAudioUnlockedRef = useRef(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechRecognitionRef = useRef<any>(null);

  // Sync external lang if changed
  useEffect(() => {
    setActiveLang(currentLang);
  }, [currentLang]);

  // Rotate multilingual greeting ticker every 2.8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % MULTI_GREETINGS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const currentGreeting = MULTI_GREETINGS[greetingIndex];

  // Alternating highlight glow between mic and text box
  useEffect(() => {
    if (isReadingPage) return; // Pause ambient cycle when read-page sequence is active
    const glowCycle = setInterval(() => {
      setIsMicGlowing((prev) => !prev);
      setIsTextBoxGlowing((prev) => !prev);
    }, 2200);
    return () => clearInterval(glowCycle);
  }, [isReadingPage]);

  // Universal Input Handler: Analyzes language from input and routes to Omnipotent AI
  const handleUniversalInput = (rawInput: string) => {
    const input = rawInput.trim();
    if (!input) return;

    stopReading();
    stopAudio();
    setUserTranscriptBubble(input);

    // 1. Detect language from speech or typing
    const detected = detectLanguageFromText(input) || activeLang || "ta";

    // 2. Route directly to Omnipotent AI with query and detected language!
    onLanguageIdentifiedAndQuery(detected, input);
  };

  // Helper: Play speech via /api/tts with AnalyserNode and callback
  const speakText = async (text: string, langCode: string): Promise<void> => {
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang: langCode })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioUrl) {
          setAvatarState("speaking");
          await new Promise<void>((resolve) => {
            playAudioWithAnalyser(data.audioUrl, () => {
              setAvatarState("idle");
              resolve();
            });
          });
          return;
        }
      }
    } catch (err) {
      console.warn("[VaniFrontPage] TTS fetch failed, using fallback delay:", err);
    }

    // Fallback timing if offline or blocked
    await new Promise((r) => setTimeout(r, 2200));
  };

  // Stop "Read Whole Page" sequence
  const stopReading = () => {
    readingCancelledRef.current = true;
    stopAudio();
    setIsReadingPage(false);
    setIsLoadingSpeech(false);
    setHighlightedElement(null);
    setAvatarState("idle");
  };

  // Dedicated "Read Whole Page" with real-time emerald/yellow text highlighting
  const handleReadWholePage = async () => {
    if (!hasAudioUnlockedRef.current) {
      hasAudioUnlockedRef.current = true;
      try {
        getAudioContext();
      } catch (_) {}
    }

    if (isReadingPage) {
      stopReading();
      return;
    }

    stopAudio();
    readingCancelledRef.current = false;
    setIsReadingPage(true);
    setIsLoadingSpeech(true);

    const script =
      FRONT_PAGE_READ_TEXTS[activeLang] ||
      FRONT_PAGE_READ_TEXTS["ta"] ||
      FRONT_PAGE_READ_TEXTS["en"];

    const items: { key: "bubble" | "mic" | "textbox"; text: string }[] = [
      { key: "bubble", text: script.bubble },
      { key: "mic", text: script.mic },
      { key: "textbox", text: script.textbox }
    ];

    setIsLoadingSpeech(false);

    for (const item of items) {
      if (readingCancelledRef.current) break;
      setHighlightedElement(item.key);
      await speakText(item.text, activeLang);
    }

    setHighlightedElement(null);
    setIsReadingPage(false);
    setAvatarState("idle");
  };

  // Start Voice Recording with mic permission notice
  const startVoiceRecording = async () => {
    stopReading();
    stopAudio();

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setIsMicAvailable(false);
      return;
    }

    try {
      setShowAllowPermissionDialog(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setShowAllowPermissionDialog(false);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const transcript = userTranscriptBubble || (activeLang === "ta" ? "அரசு திட்டம் மற்றும் உதவி வேண்டும்" : "I need government scheme assistance");
        handleUniversalInput(transcript);
      };

      // Trigger Web Speech API for real-time speech text
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        const speechCode =
          SUPPORTED_LANGUAGES[activeLang]?.speechLang || "ta-IN";
        recognition.lang = speechCode;
        recognition.interimResults = true;
        recognition.continuous = false;

        recognition.onresult = (event: any) => {
          const current = event.results[0][0].transcript;
          setUserTranscriptBubble(current);
        };

        recognition.onend = () => {
          stopVoiceRecording();
        };

        speechRecognitionRef.current = recognition;
        recognition.start();
      }

      mediaRecorder.start();
      setAvatarState("listening");
    } catch (err: any) {
      setShowAllowPermissionDialog(false);
      setIsMicAvailable(false);
      console.warn("[VANI] Mic permission unavailable:", err);
    }
  };

  // Stop Voice Recording
  const stopVoiceRecording = () => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (_) {}
      speechRecognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  // Toggle Mic button tap
  const handleMicTap = () => {
    if (!hasAudioUnlockedRef.current) {
      hasAudioUnlockedRef.current = true;
      try {
        getAudioContext();
      } catch (_) {}
    }

    if (avatarState === "listening") {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  // Handle form text submit
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedText.trim()) return;

    if (!hasAudioUnlockedRef.current) {
      hasAudioUnlockedRef.current = true;
      try {
        getAudioContext();
      } catch (_) {}
    }

    const query = typedText.trim();
    setTypedText("");
    handleUniversalInput(query);
  };

  const activeLangConfig =
    SUPPORTED_LANGUAGES[activeLang] || SUPPORTED_LANGUAGES["ta"] || SUPPORTED_LANGUAGES["en"];

  return (
    <div
      onClick={() => {
        if (!hasAudioUnlockedRef.current) {
          hasAudioUnlockedRef.current = true;
          try {
            getAudioContext();
          } catch (_) {}
        }
      }}
      className="relative w-full max-w-[390px] min-h-[100dvh] mx-auto bg-gradient-to-b from-emerald-50/60 via-amber-50/30 to-emerald-100/40 text-emerald-950 flex flex-col justify-between px-3 py-2 sm:px-4 sm:py-3 select-none overflow-x-hidden font-sans shadow-2xl border-x border-emerald-300/50 box-border"
    >
      {/* --- TOP: PROMINENT READ WHOLE PAGE & AVATAR GREETING --- */}
      <header className="w-full flex flex-col items-center pt-0.5 space-y-2">
        {/* Top Header Action Bar: Language Badge + Prominent "Read Whole Page" Button */}
        <div className="w-full flex items-center justify-between gap-2">
          {/* Multilingual Selector Badge */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLangModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-400/80 shadow-2xs text-xs font-black text-emerald-950 active:scale-95 transition-all cursor-pointer shrink-0"
            title="Choose Language"
          >
            <Globe2 className="w-3.5 h-3.5 text-emerald-700 animate-spin [animation-duration:14s]" />
            <span>{activeLangConfig.nativeName}</span>
            <span className="text-[10px] text-emerald-700">▼</span>
          </button>

          {/* PROMINENT "🔊 READ WHOLE PAGE" BUTTON */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleReadWholePage();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all active:scale-95 shadow-md border cursor-pointer shrink-0 ${
              isLoadingSpeech
                ? "bg-yellow-100 border-yellow-400 text-yellow-950 animate-pulse"
                : isReadingPage
                ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-yellow-500 text-white border-yellow-300 animate-pulse ring-4 ring-yellow-400/80"
                : "bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 border-yellow-400 text-yellow-300 hover:text-white"
            }`}
            title="Read whole page in your language"
          >
            {isLoadingSpeech ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                <span>தயாராகிறது...</span>
              </>
            ) : isReadingPage ? (
              <>
                <Volume2 className="w-4 h-4 text-white animate-bounce" />
                <span>வாசிக்கிறது...</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-yellow-300" />
                <span>
                  {activeLang === "ta"
                    ? "🔊 வாசிக்கவும்"
                    : activeLang === "hi"
                    ? "🔊 पेज सुनें"
                    : "🔊 Read Page"}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Avatar & Speech Bubble Row */}
        <div className="w-full flex items-start gap-2.5 justify-center pt-1">
          {/* Animated Vector Avatar in Emerald Green & Gold Saree */}
          <div className="shrink-0 transition-transform duration-300">
            <FrontAvatar
              state={avatarState}
              mouthOpenness={mouthOpenness}
              size="md"
            />
          </div>

          {/* Multilingual Speech Bubble with Real-Time Highlighting */}
          <div className="flex-1 min-w-0 relative">
            <div
              className={`relative rounded-2xl p-3 text-left transition-all duration-300 shadow-md ${
                highlightedElement === "bubble"
                  ? "bg-yellow-100 border-3 border-emerald-600 ring-4 ring-yellow-400 scale-[1.03] shadow-xl"
                  : "bg-white border-2 border-emerald-500 shadow-sm"
              }`}
            >
              {/* Speech tail */}
              <div
                className={`absolute top-5 -left-2 w-2.5 h-2.5 border-b-2 border-l-2 transform rotate-45 transition-colors duration-300 ${
                  highlightedElement === "bubble"
                    ? "bg-yellow-100 border-emerald-600"
                    : "bg-white border-emerald-500"
                }`}
              />

              {/* Rotating Multilingual Greeting Line */}
              <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-900 uppercase tracking-wider mb-1">
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-950 font-bold">
                  {currentGreeting.label}
                </span>
                <span>Language Detection</span>
              </div>

              <p className="text-xs sm:text-sm font-bold text-emerald-950 leading-relaxed break-words animate-in fade-in duration-300">
                &ldquo;{currentGreeting.text}&rdquo;
              </p>

              {/* Action Callout */}
              <div className="mt-2 pt-1 border-t border-emerald-100 flex items-center justify-between gap-1 text-[9px] font-bold text-emerald-900">
                <span className="truncate">🎙️ Speak or type</span>
                <span className="text-emerald-700 font-black shrink-0">Auto-detects ➔</span>
              </div>
            </div>

            {/* Transient User Speech Bubble */}
            {userTranscriptBubble && avatarState === "listening" && (
              <div className="mt-1.5 p-2 rounded-xl bg-yellow-100 border border-yellow-400 text-[11px] font-black text-emerald-950 text-right animate-in fade-in">
                &ldquo;{userTranscriptBubble}&rdquo;
              </div>
            )}
          </div>
        </div>

        {/* Mic Permission Banner */}
        {showAllowPermissionDialog && (
          <div className="w-full p-2 rounded-xl bg-yellow-100 border border-yellow-400 flex items-center gap-2 animate-in zoom-in-95">
            <ShieldAlert className="w-4 h-4 text-emerald-700 shrink-0 animate-bounce" />
            <span className="text-[11px] font-black text-emerald-950">
              Please tap &ldquo;Allow&rdquo; in the permission box to speak.
            </span>
          </div>
        )}
      </header>

      {/* --- MIDDLE: GIANT 160PX ROUND MIC IN EMERALD GREEN & GOLDEN YELLOW --- */}
      <section className="relative w-full my-auto flex flex-col items-center justify-center py-2">
        <div className="relative flex flex-col items-center justify-center">
          {/* Golden Yellow & Emerald Pulsing Soundwave Rings */}
          <div className="absolute w-[215px] h-[215px] rounded-full border-4 border-yellow-400/40 animate-slow-pulse-ring pointer-events-none" />
          <div className="absolute w-[188px] h-[188px] rounded-full bg-emerald-400/20 animate-emerald-pulse-ring pointer-events-none" />

          {/* Visual 'SPEAK HERE' Floating Invitation Badge in Emerald & Gold */}
          <div className="absolute -top-7 z-30 px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-700 via-teal-700 to-yellow-600 text-white text-[11px] font-black shadow-lg border-2 border-yellow-300 animate-bounce flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-200 animate-spin [animation-duration:4s]" />
            <span>SPEAK HERE • இங்கே பேசுங்கள்</span>
          </div>

          {/* Giant 160px Round Mic Button */}
          {isMicAvailable ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleMicTap();
              }}
              className={`relative z-20 w-[160px] h-[160px] rounded-full flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 border-4 shadow-2xl cursor-pointer ${
                avatarState === "listening"
                  ? "bg-rose-600 border-white text-white animate-pulse ring-8 ring-rose-300"
                  : highlightedElement === "mic"
                  ? "bg-gradient-to-tr from-emerald-600 via-teal-600 to-yellow-500 border-yellow-300 text-white ring-8 ring-yellow-400 scale-110 shadow-2xl"
                  : isMicGlowing
                  ? "bg-gradient-to-tr from-emerald-600 via-teal-600 to-yellow-500 border-yellow-300 text-white animate-highlight-glow scale-105"
                  : "bg-gradient-to-tr from-emerald-600 via-teal-600 to-yellow-500 border-yellow-300 text-white hover:scale-102"
              }`}
              aria-label={avatarState === "listening" ? "Stop listening" : "Tap to Speak"}
            >
              {avatarState === "listening" ? (
                <MicOff className="w-14 h-14 animate-bounce" />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Mic className="w-14 h-14 text-white" />
                  <span className="text-[11px] font-black uppercase tracking-wider mt-1 text-yellow-200">
                    TAP TO SPEAK
                  </span>
                </div>
              )}
            </button>
          ) : (
            <div className="w-[160px] h-[160px] rounded-full bg-stone-200 border-4 border-stone-300 flex flex-col items-center justify-center text-stone-500 p-4 text-center">
              <MicOff className="w-10 h-10 mb-1" />
              <span className="text-[11px] font-bold">Use Text Box Below</span>
            </div>
          )}
        </div>
      </section>

      {/* --- BOTTOM: DIVIDER & 56PX+ TEXT BOX IN HIGHLIGHTED OUTLINE --- */}
      <footer className="w-full pb-1 space-y-2">
        {/* High-Contrast Script Divider */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-emerald-300" />
          </div>
          <span className="relative z-10 px-3 py-0.5 bg-[#F7FCF8] text-[10px] font-black tracking-wide text-emerald-950 rounded-full border border-emerald-300 truncate max-w-[270px]">
            🎙️ Speak or ⌨️ Type in Any Language
          </span>
        </div>

        {/* 56px+ Tall Text Input in HIGHLIGHTED OUTLINE (Emerald Border & Golden Yellow Glow) */}
        <form
          onSubmit={handleTextSubmit}
          className={`relative w-full rounded-2xl transition-all duration-300 ${
            highlightedElement === "textbox"
              ? "ring-4 ring-yellow-400 scale-[1.02] shadow-2xl"
              : isTextBoxGlowing
              ? "animate-highlight-glow ring-4 ring-yellow-400"
              : "ring-3 ring-yellow-400 hover:ring-yellow-500 focus-within:ring-emerald-600"
          }`}
        >
          <div className="relative flex items-center min-h-[56px] bg-white rounded-2xl border-2 border-emerald-600 shadow-md overflow-hidden">
            {/* Multilingual Text Input Box */}
            <input
              type="text"
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              placeholder="Speak or type (Tamil, Hindi, English...)"
              className="w-full min-w-0 flex-1 h-full min-h-[56px] py-2 pl-3.5 pr-13 text-sm font-semibold text-emerald-950 placeholder:text-stone-400 bg-transparent focus:outline-hidden"
            />

            {/* Large Send Button in Emerald & Gold */}
            <button
              type="submit"
              disabled={!typedText.trim() || avatarState === "thinking"}
              className="absolute right-1.5 w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-yellow-500 text-white flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm cursor-pointer"
              aria-label="Send"
            >
              <Send className="w-5 h-5 translate-x-0.5" />
            </button>
          </div>
        </form>
      </footer>

      {/* Language Selection Modal (All 9 Major Languages) */}
      {isLangModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border-2 border-emerald-400 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-black text-emerald-950">
                  Select Language / மொழியைத் தேர்வு செய்க
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLangModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
              {Object.entries(SUPPORTED_LANGUAGES).map(([code, config]) => {
                const isSelected = code === activeLang;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      setActiveLang(code);
                      if (onSelectLang) onSelectLang(code);
                      setIsLangModalOpen(false);
                    }}
                    className={`p-3 rounded-2xl border-2 text-left flex items-center justify-between transition-all active:scale-95 ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-600 text-emerald-950 font-black shadow-xs ring-2 ring-emerald-300"
                        : "bg-white border-stone-200 hover:border-emerald-400 text-stone-800"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">{config.nativeName}</div>
                      <div className="text-[11px] text-stone-500">{config.name}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
