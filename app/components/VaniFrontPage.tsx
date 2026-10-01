"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Send, Volume2, Sparkles, ShieldAlert, Globe2 } from "lucide-react";
import { FrontAvatar, AvatarState } from "./FrontAvatar";
import { useAudioAnalyser } from "../hooks/useAudioAnalyser";
import { detectLanguageFromText } from "../lib/languages";
import { speak } from "../../src/lib/ai";

interface VaniFrontPageProps {
  onLanguageIdentifiedAndQuery: (detectedLang: string, query?: string) => void;
  onStartConsultation?: () => void;
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

export function VaniFrontPage({
  onLanguageIdentifiedAndQuery,
  onStartConsultation
}: VaniFrontPageProps) {
  const [avatarState, setAvatarState] = useState<AvatarState>("waving");
  const [typedText, setTypedText] = useState("");
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [userTranscriptBubble, setUserTranscriptBubble] = useState<string | null>(null);

  // Focus & Glow highlighting states
  const [isMicGlowing, setIsMicGlowing] = useState(true);
  const [isTextBoxGlowing, setIsTextBoxGlowing] = useState(false);
  const [isMicAvailable, setIsMicAvailable] = useState(true);
  const [showAllowPermissionDialog, setShowAllowPermissionDialog] = useState(false);

  // Audio & Hardware Analyser Hook
  const {
    mouthOpenness,
    playAudioWithAnalyser,
    startSyntheticMouthLoop,
    stopAudio,
    getAudioContext
  } = useAudioAnalyser();

  const hasAudioUnlockedRef = useRef(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechRecognitionRef = useRef<any>(null);

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
    const glowCycle = setInterval(() => {
      setIsMicGlowing((prev) => !prev);
      setIsTextBoxGlowing((prev) => !prev);
    }, 2200);
    return () => clearInterval(glowCycle);
  }, []);

  // Universal Input Handler: Analyzes language from input and routes to Omnipresent AI
  const handleUniversalInput = (rawInput: string) => {
    const input = rawInput.trim();
    if (!input) return;

    stopAudio();
    setUserTranscriptBubble(input);

    // 1. Detect language from speech or typing
    const detected = detectLanguageFromText(input) || "ta";

    // 2. Route directly to Omnipotent AI with query and detected language!
    onLanguageIdentifiedAndQuery(detected, input);
  };

  // Start Voice Recording with mic permission notice
  const startVoiceRecording = async () => {
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
        const transcript = userTranscriptBubble || "அரசு திட்டம் மற்றும் உதவி வேண்டும்";
        handleUniversalInput(transcript);
      };

      // Trigger Web Speech API for real-time speech text
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = "ta-IN";
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
      className="relative w-full max-w-full sm:max-w-[420px] min-h-[100dvh] mx-auto bg-[#FFFBF5] text-[#1C1917] flex flex-col justify-between px-3.5 py-2.5 sm:px-4 sm:py-3 select-none overflow-hidden font-sans shadow-xl border-x border-amber-200/50 box-border"
    >
      {/* --- TOP: AVATAR & MULTI-SCRIPT GREETING BUBBLE --- */}
      <header className="w-full flex flex-col items-center pt-0.5 space-y-2">
        {/* Multilingual Marquee Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-300 shadow-2xs">
          <Globe2 className="w-3.5 h-3.5 text-orange-600 animate-spin [animation-duration:12s]" />
          <span className="text-[11px] font-black tracking-wider text-amber-950 uppercase">
            VANI • NARI ASSISTANT
          </span>
          <span className="text-xs">✨</span>
        </div>

        {/* Avatar & Speech Bubble Row */}
        <div className="w-full flex items-start gap-2 justify-center">
          {/* Animated Vector Avatar */}
          <div className="shrink-0 transition-transform duration-300">
            <FrontAvatar
              state={avatarState}
              mouthOpenness={mouthOpenness}
              size="md"
            />
          </div>

          {/* Multilingual Speech Bubble (Language Neutral on Load) */}
          <div className="flex-1 min-w-0 relative">
            <div className="relative bg-white border-2 border-amber-300 rounded-2xl p-3 shadow-xs text-left transition-all duration-300">
              {/* Speech tail */}
              <div className="absolute top-5 -left-2 w-2.5 h-2.5 bg-white border-b-2 border-l-2 border-amber-300 transform rotate-45" />

              {/* Rotating Multilingual Greeting Line */}
              <div className="flex items-center gap-1.5 text-[10px] font-black text-amber-800 uppercase tracking-wider mb-1">
                <span className="px-1.5 py-0.5 rounded-md bg-amber-100 border border-amber-200">
                  {currentGreeting.label}
                </span>
                <span>Language Detection</span>
              </div>

              <p className="text-xs sm:text-sm font-bold text-[#1C1917] leading-relaxed break-words animate-in fade-in duration-300">
                &ldquo;{currentGreeting.text}&rdquo;
              </p>

              {/* Action Callout */}
              <div className="mt-2 pt-1 border-t border-amber-100 flex items-center justify-between text-[10px] font-bold text-amber-900">
                <span>🎙️ Speak or type anything</span>
                <span className="text-orange-600">Auto-detects language ➔</span>
              </div>
            </div>

            {/* Transient User Speech Bubble */}
            {userTranscriptBubble && avatarState === "listening" && (
              <div className="mt-1.5 p-2 rounded-xl bg-orange-100 border border-orange-300 text-[11px] font-black text-orange-950 text-right animate-in fade-in">
                &ldquo;{userTranscriptBubble}&rdquo;
              </div>
            )}
          </div>
        </div>

        {/* Mic Permission Banner */}
        {showAllowPermissionDialog && (
          <div className="w-full p-2 rounded-xl bg-amber-100/90 border border-amber-400 flex items-center gap-2 animate-in zoom-in-95">
            <ShieldAlert className="w-4 h-4 text-orange-600 shrink-0 animate-bounce" />
            <span className="text-[11px] font-black text-amber-950">
              Please tap &ldquo;Allow&rdquo; in the permission box to speak.
            </span>
          </div>
        )}
      </header>

      {/* --- MIDDLE: GIANT 160PX ROUND MIC WITH 'SPEAK HERE' ANIMATION --- */}
      <section className="relative w-full my-auto flex flex-col items-center justify-center py-2">
        <div className="relative flex flex-col items-center justify-center">
          {/* Animated Pulsing Soundwave Rings */}
          <div className="absolute w-[205px] h-[205px] rounded-full border-4 border-orange-400/30 animate-slow-pulse-ring pointer-events-none" />
          <div className="absolute w-[185px] h-[185px] rounded-full bg-amber-400/20 animate-pulse pointer-events-none" />

          {/* Visual 'SPEAK HERE' Floating Invitation Badge */}
          <div className="absolute -top-7 z-30 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white text-[11px] font-black shadow-md border border-white animate-bounce flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-spin [animation-duration:4s]" />
            <span>SPEAK HERE • இங்கே பேசுங்கள்</span>
          </div>

          {/* 160px Round Mic Button */}
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
                  : isMicGlowing
                  ? "bg-gradient-to-tr from-amber-500 via-orange-600 to-rose-600 border-yellow-200 text-white animate-highlight-glow scale-105"
                  : "bg-gradient-to-tr from-amber-500 via-orange-600 to-rose-600 border-yellow-200 text-white hover:scale-102"
              }`}
              aria-label={avatarState === "listening" ? "Stop listening" : "Tap to Speak"}
            >
              {avatarState === "listening" ? (
                <MicOff className="w-14 h-14 animate-bounce" />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Mic className="w-14 h-14 text-white" />
                  <span className="text-[11px] font-black uppercase tracking-wider mt-1 text-yellow-100">
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
            <div className="w-full border-t border-amber-300" />
          </div>
          <span className="relative z-10 px-3.5 py-0.5 bg-[#FFFBF5] text-[11px] font-black tracking-wide text-amber-950 rounded-full border border-amber-300">
            🎙️ Speak or ⌨️ Type in Any Language
          </span>
        </div>

        {/* 56px+ Tall Text Input in HIGHLIGHTED OUTLINE with Large Send Button */}
        <form
          onSubmit={handleTextSubmit}
          className={`relative w-full rounded-2xl transition-all duration-300 ${
            isTextBoxGlowing
              ? "animate-highlight-glow ring-4 ring-amber-400"
              : "ring-3 ring-amber-400 hover:ring-amber-500 focus-within:ring-orange-500"
          }`}
        >
          <div className="relative flex items-center min-h-[56px] bg-white rounded-2xl border-2 border-orange-500 shadow-md overflow-hidden">
            {/* Multilingual Text Input Box */}
            <input
              type="text"
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              placeholder="Speak or type (Tamil, Tanglish, Hindi, English...)"
              className="flex-1 h-full min-h-[56px] py-2 pl-3.5 pr-13 text-sm sm:text-base font-medium text-[#1C1917] placeholder:text-stone-400 bg-transparent focus:outline-hidden"
            />

            {/* Large Send Button */}
            <button
              type="submit"
              disabled={!typedText.trim() || avatarState === "thinking"}
              className="absolute right-1.5 w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-orange-600 text-white flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer"
              aria-label="Send"
            >
              <Send className="w-5 h-5 translate-x-0.5" />
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
}
