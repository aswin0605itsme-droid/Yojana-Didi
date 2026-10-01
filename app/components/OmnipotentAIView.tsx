"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  MapPin,
  Globe,
  FileText,
  Navigation,
  ExternalLink,
  Volume2,
  Mic,
  MicOff,
  Send,
  Loader2,
  CheckCircle2,
  PhoneCall,
  Train,
  Bus,
  Activity,
  Calendar,
  User,
  Bot
} from "lucide-react";
import { parseOmniIntent, OmniQueryResult } from "../lib/omniHandler";
import { detectLanguageFromText } from "../lib/languages";
import { playAudioBeep } from "../lib/audioCue";

interface UserCondition {
  work: string;
  setup: string;
  capital: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "vani";
  text: string;
  data?: {
    type?: string;
    title?: string;
    website_url?: string | null;
    website_label?: string | null;
    map_query?: string | null;
    phone_hotline?: string | null;
    highlights?: string[] | null;
    documents?: string[] | null;
    language?: string;
    timingInfo?: string | null;
  };
}

interface OmnipotentAIViewProps {
  userCondition: UserCondition;
  scheme: any;
  lang: string;
  isSpeaking: boolean;
  isListening?: boolean;
  interimText?: string;
  lastSpokenQuery?: string;
  onSpeakText: (text: string, targetLang?: string) => void;
  onStartListening?: () => void;
  onStopListening?: () => void;
}

export function OmnipotentAIView({
  userCondition,
  scheme,
  lang,
  isSpeaking,
  isListening = false,
  interimText = "",
  lastSpokenQuery = "",
  onSpeakText,
  onStartListening,
  onStopListening
}: OmnipotentAIViewProps) {
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const hasSpokenWelcomeRef = useRef(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const schemeName = (scheme?.name as any)?.[lang] || scheme?.name?.en || "Government Scheme";
  const schemeTagline = (scheme?.tagline as any)?.[lang] || scheme?.tagline?.en || "";

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  // Initial welcome greeting
  useEffect(() => {
    if (!hasSpokenWelcomeRef.current) {
      hasSpokenWelcomeRef.current = true;
      const initialGreeting =
        lang === "ta"
          ? `வணக்கம் சகோதரி! அரசு திட்டங்கள், அதிகாரப்பூர்வ இணையதளம், மருத்துவமனை 108, ரயில் புக்கிங், பேருந்து நேரம் அல்லது ஏதேனும் சந்தேகங்களை கேட்கலாம்.`
          : lang === "hi"
          ? `नमस्ते बहन! सरकारी योजनाएं, वेबसाइट लिंक, अस्पताल, ट्रेन बुकिंग, बस समय या कोई भी सवाल मुझसे पूछ सकते हैं।`
          : `Hello sister! Ask me about government schemes, official websites, hospital 108, train bookings, bus timings, or any doubts.`;

      const welcomeMsg: ChatMessage = {
        id: "msg-welcome",
        sender: "vani",
        text: initialGreeting,
        data: {
          type: "general",
          title: lang === "ta" ? "வாணி வழிகாட்டி" : "VANI Guide",
          language: lang
        }
      };

      setMessages([welcomeMsg]);
      onSpeakText(initialGreeting, lang);
    }
  }, [lang, onSpeakText]);

  // React to user spoken speech recognized by useVoice
  const lastProcessedSpeechRef = useRef("");
  useEffect(() => {
    if (lastSpokenQuery && lastSpokenQuery.trim() && lastSpokenQuery !== lastProcessedSpeechRef.current) {
      lastProcessedSpeechRef.current = lastSpokenQuery;
      handleQuery(lastSpokenQuery);
    }
  }, [lastSpokenQuery]);

  // Handle any user query (typed, chip-tapped, or spoken)
  const handleQuery = async (query: string) => {
    if (!query.trim() || isProcessing) return;

    playAudioBeep("chime");
    const userQueryText = query.trim();

    // 1. Immediately append User Message to chat
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userQueryText
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    const detectedLang = detectLanguageFromText(userQueryText) || lang || "ta";

    try {
      // Send query to live Gemini 3.5 Flash Lite API
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userQueryText,
          language: detectedLang,
          userCondition: {
            work: userCondition.work,
            setup: userCondition.setup,
            capital: userCondition.capital,
            recommendedScheme: schemeName
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const spoken = data.spoken_response || data.text || "விவரங்கள் இதோ.";
        const respLang = data.language || detectedLang;

        const vaniMsg: ChatMessage = {
          id: `vani-${Date.now()}`,
          sender: "vani",
          text: spoken,
          data: {
            type: data.type || data.ui_mode || "general",
            title: data.title || (respLang === "ta" ? "வாணி தகவல்" : "VANI Assistance"),
            website_url: data.website_url || null,
            website_label: data.website_label || null,
            map_query: data.map_query || null,
            phone_hotline: data.phone_hotline || null,
            highlights: data.highlights || data.documents || null,
            language: respLang
          }
        };

        setMessages((prev) => [...prev, vaniMsg]);
        onSpeakText(spoken, respLang);
      } else {
        // Fallback using local omniHandler if network issue
        const omni = parseOmniIntent(userQueryText, detectedLang);
        const vaniMsg: ChatMessage = {
          id: `vani-${Date.now()}`,
          sender: "vani",
          text: omni.spokenText,
          data: {
            type: omni.type,
            title: omni.title,
            website_url: omni.websiteUrl || null,
            website_label: omni.websiteLabel || null,
            map_query: omni.mapQuery || null,
            phone_hotline: omni.phoneHotline || null,
            highlights: omni.documents || null,
            language: detectedLang
          }
        };
        setMessages((prev) => [...prev, vaniMsg]);
        onSpeakText(omni.spokenText, detectedLang);
      }
    } catch (err) {
      console.error("[OmniAI] Error processing query:", err);
      const omni = parseOmniIntent(userQueryText, detectedLang);
      const vaniMsg: ChatMessage = {
        id: `vani-${Date.now()}`,
        sender: "vani",
        text: omni.spokenText,
        data: {
          type: omni.type,
          title: omni.title,
          website_url: omni.websiteUrl || null,
          website_label: omni.websiteLabel || null,
          map_query: omni.mapQuery || null,
          phone_hotline: omni.phoneHotline || null,
          language: detectedLang
        }
      };
      setMessages((prev) => [...prev, vaniMsg]);
      onSpeakText(omni.spokenText, detectedLang);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const q = inputText.trim();
    setInputText("");
    handleQuery(q);
  };

  return (
    <div className="flex-1 flex flex-col justify-between max-w-xl w-full mx-auto px-2 sm:px-4 py-2 animate-in fade-in duration-300 h-full">
      {/* MAIN OMNIPOTENT CONTAINER */}
      <div className="w-full flex-1 flex flex-col bg-white border-2 border-emerald-400 rounded-3xl p-3 sm:p-4 shadow-xl space-y-3 min-h-[520px]">
        {/* CARD HEADER: Emerald icon + Title + Subtitle */}
        <div className="flex items-center justify-between gap-3 pb-2 border-b border-emerald-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-yellow-500 flex items-center justify-center text-white shadow-md shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse text-yellow-200" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-black text-emerald-950 truncate leading-tight">
                {lang === "ta"
                  ? "வாணி ஜெமினி உதவியாளர்"
                  : lang === "hi"
                  ? "वाणी जेमिनी सहायक"
                  : "VANI Gemini Assistant"}
              </h2>
              <p className="text-[11px] font-bold text-emerald-800">
                {lang === "ta"
                  ? "திட்டம் • மருத்துவமனை • ரயில் • பேருந்து • மேப்"
                  : "Schemes • Hospitals • Trains • Buses • Maps"}
              </p>
            </div>
          </div>

          <div className="px-2.5 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-[10px] font-black text-emerald-900 shrink-0">
            Omnipresent AI
          </div>
        </div>

        {/* 5 COMPREHENSIVE QUICK ACTION PILLS */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {/* 1. Hospital & 108 */}
          <button
            type="button"
            onClick={() => handleQuery(lang === "ta" ? "அரசு மருத்துவமனை மற்றும் 108 அவசர சிகிச்சை" : "Government Hospital and 108 emergency")}
            className="px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-950 active:scale-95 transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
          >
            <Activity className="w-3 h-3 text-rose-600 shrink-0" />
            <span>{lang === "ta" ? "மருத்துவமனை & 108" : "Hospital & 108"}</span>
          </button>

          {/* 2. Train Booking & Station */}
          <button
            type="button"
            onClick={() => handleQuery(lang === "ta" ? "ரயில் புக்கிங் ஐஆர்சிடிசி மற்றும் ரயில்வே ஸ்டேஷன்" : "IRCTC train ticket booking and railway station")}
            className="px-2.5 py-1 rounded-full text-[11px] font-black bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-950 active:scale-95 transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
          >
            <Train className="w-3 h-3 text-sky-700 shrink-0" />
            <span>{lang === "ta" ? "ரயில் புக்கிங் & ஸ்டேஷன்" : "Train & Station"}</span>
          </button>

          {/* 3. Bus Stops & Timings */}
          <button
            type="button"
            onClick={() => handleQuery(lang === "ta" ? "அரசு பேருந்து நிலையம் மற்றும் பேருந்து நேரம்" : "Government bus stand and bus timings")}
            className="px-2.5 py-1 rounded-full text-[11px] font-black bg-teal-50 hover:bg-teal-100 border border-teal-300 text-teal-950 active:scale-95 transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
          >
            <Bus className="w-3 h-3 text-teal-700 shrink-0" />
            <span>{lang === "ta" ? "பேருந்து நேரம்" : "Bus Timings"}</span>
          </button>

          {/* 4. Nearest Bank & Locations */}
          <button
            type="button"
            onClick={() => handleQuery(lang === "ta" ? "அருகிலுள்ள அரசு வங்கி எங்கே உள்ளது?" : "Nearest government bank branch location")}
            className="px-2.5 py-1 rounded-full text-[11px] font-black bg-yellow-50 hover:bg-yellow-100 border border-yellow-400 text-emerald-950 active:scale-95 transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
          >
            <MapPin className="w-3 h-3 text-yellow-700 shrink-0" />
            <span>{lang === "ta" ? "அருகிலுள்ள வங்கி" : "Nearest Bank"}</span>
          </button>

          {/* 5. Official Website Portal */}
          <button
            type="button"
            onClick={() => handleQuery(lang === "ta" ? "அதிகாரப்பூர்வ அரசு இணையதள முகவரி" : "Official government scheme portal")}
            className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 hover:bg-emerald-100 border border-emerald-400 text-emerald-950 active:scale-95 transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
          >
            <Globe className="w-3 h-3 text-emerald-700 shrink-0" />
            <span>{lang === "ta" ? "அரசு தளம்" : "Official Portal"}</span>
          </button>
        </div>

        {/* CHAT MESSAGES SCROLL STREAM */}
        <div className="flex-1 overflow-y-auto max-h-[380px] sm:max-h-[420px] space-y-3 pr-1 py-1 scroll-smooth">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} animate-in fade-in duration-200`}
            >
              {/* Sender Tag */}
              <div className="flex items-center gap-1 mb-1 text-[11px] font-bold text-stone-500 px-1">
                {msg.sender === "user" ? (
                  <>
                    <span>{lang === "ta" ? "நீங்கள்" : "You"}</span>
                    <User className="w-3 h-3 text-emerald-700" />
                  </>
                ) : (
                  <>
                    <Bot className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="text-emerald-900 font-extrabold">வாணி (VANI)</span>
                  </>
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-3.5 shadow-sm text-sm ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-semibold rounded-tr-xs"
                    : "bg-emerald-50/70 border-2 border-emerald-300 text-emerald-950 font-bold rounded-tl-xs space-y-2.5"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="leading-relaxed flex-1 whitespace-pre-wrap">{msg.text}</p>
                  {msg.sender === "vani" && (
                    <button
                      type="button"
                      onClick={() => onSpeakText(msg.text, msg.data?.language || lang)}
                      className="p-1.5 rounded-full hover:bg-emerald-200/60 text-emerald-800 shrink-0 active:scale-90 transition-all cursor-pointer"
                      title="Hear again / மீண்டும் கேள்"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* RICH ACTION CARDS FOR VANI RESPONSES */}
                {msg.data && (
                  <div className="space-y-2 pt-1">
                    {/* A. EMERGENCY CALL BUTTON (108, 139) */}
                    {msg.data.phone_hotline && (
                      <div className="flex items-center justify-between p-2 rounded-xl bg-rose-50 border border-rose-300 text-rose-950">
                        <div className="flex items-center gap-1.5 text-xs font-black">
                          <Activity className="w-4 h-4 text-rose-600 animate-pulse" />
                          <span>{lang === "ta" ? "அவசர உதவி எண்:" : "Emergency Helpline:"}</span>
                        </div>
                        <a
                          href={`tel:${msg.data.phone_hotline}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-xs active:scale-95 transition-all"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>{msg.data.phone_hotline} அழைக்க</span>
                        </a>
                      </div>
                    )}

                    {/* B. OFFICIAL GOVERNMENT WEBSITE BUTTON */}
                    {msg.data.website_url && (
                      <a
                        href={msg.data.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-yellow-600 hover:opacity-95 text-white font-bold text-xs shadow-xs active:scale-98 transition-all"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Globe className="w-4 h-4 shrink-0 text-yellow-200" />
                          <span className="truncate">{msg.data.website_label || msg.data.website_url}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 shrink-0" />
                      </a>
                    )}

                    {/* C. HIGHLIGHTS & KEY DOCUMENTS */}
                    {msg.data.highlights && msg.data.highlights.length > 0 && (
                      <div className="space-y-1 p-2 rounded-xl bg-white border border-emerald-200 text-xs font-semibold text-emerald-950">
                        <div className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                          {lang === "ta" ? "முக்கிய தகவல்கள்:" : "Key Highlights:"}
                        </div>
                        {msg.data.highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* D. LIVE GOOGLE MAPS EMBED */}
                    {msg.data.map_query && (
                      <div className="space-y-1.5 pt-1">
                        <div className="w-full h-36 rounded-xl overflow-hidden border border-emerald-400 shadow-inner bg-emerald-50">
                          <iframe
                            title="Location Map"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(
                              msg.data.map_query
                            )}&output=embed`}
                          />
                        </div>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            msg.data.map_query
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-black text-xs transition-all"
                        >
                          <Navigation className="w-3.5 h-3.5 text-emerald-700" />
                          <span>
                            {lang === "ta"
                              ? `கூகிள் மேப்பில் பார்க்க: ${msg.data.map_query}`
                              : `Open in Google Maps: ${msg.data.map_query}`}
                          </span>
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* VANI IS THINKING / PROCESSING INDICATOR */}
          {isProcessing && (
            <div className="flex flex-col items-start animate-in fade-in">
              <div className="flex items-center gap-1 mb-1 text-[11px] font-bold text-stone-500 px-1">
                <Bot className="w-3.5 h-3.5 text-emerald-700 animate-spin" />
                <span className="text-emerald-900 font-extrabold">வாணி (VANI)</span>
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-xs bg-emerald-100/70 border-2 border-emerald-300 text-emerald-900 flex items-center gap-2 font-bold text-xs shadow-xs">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                <span>
                  {lang === "ta"
                    ? "வாணி பதிலளிக்கிறாள்..."
                    : lang === "hi"
                    ? "वाणी सोच रही है..."
                    : "VANI is preparing your answer..."}
                </span>
                <span className="flex gap-1 ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"></span>
                </span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* BOTTOM INPUT BAR: MIC & OUTLINED TEXT BOX */}
        <div className="pt-1.5 flex items-center gap-2">
          {/* Rounded Emerald & Gold Mic Button */}
          {onStartListening && (
            <button
              type="button"
              onClick={isListening ? onStopListening : onStartListening}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-95 shadow-md shrink-0 cursor-pointer ${
                isListening
                  ? "bg-rose-600 text-white animate-pulse ring-4 ring-rose-300"
                  : "bg-gradient-to-tr from-emerald-600 via-teal-600 to-yellow-500 text-white hover:opacity-95 border-2 border-yellow-300"
              }`}
              title={isListening ? "Listening..." : "Tap to Speak"}
            >
              {isListening ? (
                <MicOff className="w-6 h-6 animate-bounce" />
              ) : (
                <Mic className="w-6 h-6 text-white" />
              )}
            </button>
          )}

          {/* High-contrast Outlined Text Input Box with Send Button */}
          <form onSubmit={handleFormSubmit} className="flex-1 relative flex items-center min-w-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                lang === "ta"
                  ? "திட்டம், மருத்துவமனை, ரயில், பேருந்து நேரம் கேளுங்கள்..."
                  : lang === "hi"
                  ? "योजना, अस्पताल, ट्रेन, बस समय या सवाल पूछें..."
                  : "Ask schemes, hospital, train, bus timings, doubts..."
              }
              className="w-full py-3 pl-4 pr-11 text-xs sm:text-sm text-emerald-950 placeholder:text-stone-400 bg-white border-2 border-emerald-400 focus:border-emerald-600 focus:ring-2 focus:ring-yellow-400 rounded-full focus:outline-hidden font-medium shadow-2xs"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isProcessing}
              className="absolute right-1 p-2 rounded-full bg-gradient-to-tr from-emerald-600 to-yellow-500 hover:from-emerald-700 hover:to-yellow-600 text-white disabled:opacity-30 transition-all cursor-pointer shadow-xs"
              aria-label="Send"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </button>
          </form>
        </div>

        {/* Live Speech Recognition Feedback */}
        {isListening && interimText && (
          <div className="text-xs font-bold text-emerald-950 bg-yellow-100 border border-yellow-400 rounded-xl px-3 py-1.5 text-center animate-in fade-in">
            &ldquo;{interimText}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
}
