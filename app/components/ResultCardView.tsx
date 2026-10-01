"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  FileText,
  MapPin,
  MessageCircle,
  Volume2,
  Headphones,
  Printer,
  Sparkles,
  ExternalLink,
  Globe,
  Navigation,
  Mic,
  MicOff,
  Send,
  HelpCircle,
  Loader2
} from "lucide-react";
import { parseOmniIntent } from "../lib/omniHandler";
import { detectLanguageFromText } from "../lib/languages";
import { playAudioBeep } from "../lib/audioCue";

interface StepItem {
  icon: string;
  title: { [lang: string]: string };
  speech: { [lang: string]: string };
  detail: { [lang: string]: string };
}

interface SchemeResult {
  id: string;
  name: { [lang: string]: string };
  tagline: { [lang: string]: string };
  eligible: boolean;
  official_website?: string;
  map_query?: string;
  steps: StepItem[];
}

interface ResultCardViewProps {
  scheme: SchemeResult;
  lang: "ta" | "en";
  isSpeaking: boolean;
  isListening?: boolean;
  interimText?: string;
  onSpeakText: (text: string) => void;
  onHearEverything: () => void;
  onStartListening?: () => void;
  onStopListening?: () => void;
}

export function ResultCardView({
  scheme,
  lang,
  isSpeaking,
  isListening = false,
  interimText = "",
  onSpeakText,
  onHearEverything,
  onStartListening,
  onStopListening
}: ResultCardViewProps) {
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  // Full Gemini Inauguration State on the Last Page
  const [geminiInput, setGeminiInput] = useState("");
  const [isAskingGemini, setIsAskingGemini] = useState(false);
  const [geminiAnswer, setGeminiAnswer] = useState<{
    text: string;
    type?: "text" | "location" | "website";
    mapQuery?: string;
    websiteUrl?: string;
    websiteLabel?: string;
  } | null>(null);

  const schemeName = (scheme.name as any)[lang] || scheme.name.en;
  const schemeTagline = (scheme.tagline as any)[lang] || scheme.tagline.en;

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case "documents":
        return <FileText className="w-8 h-8 text-amber-600 shrink-0" />;
      case "location":
        return <MapPin className="w-8 h-8 text-orange-600 shrink-0" />;
      case "speech":
        return <MessageCircle className="w-8 h-8 text-rose-600 shrink-0" />;
      default:
        return <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />;
    }
  };

  const handleStepTap = (step: StepItem, index: number) => {
    setActiveStepIndex(index);
    const speechText = (step.speech as any)[lang] || step.speech.en;
    onSpeakText(speechText);
  };

  // Full Gemini Omnipresent Handler on the Last Page
  const handleAskGemini = async (queryText: string) => {
    if (!queryText.trim()) return;
    playAudioBeep("chime");
    setIsAskingGemini(true);

    const userLang = detectLanguageFromText(queryText) || lang;

    // 1. Fast local Omnipresent check (0ms for map/location/website)
    const omni = parseOmniIntent(queryText, userLang === "ta" ? "ta" : "en");
    if (omni.type === "location" || omni.type === "website") {
      const resultObj = {
        text: omni.spokenText,
        type: omni.type as "location" | "website",
        mapQuery: omni.mapQuery,
        websiteUrl: omni.websiteUrl,
        websiteLabel: omni.websiteLabel
      };
      setGeminiAnswer(resultObj);
      setIsAskingGemini(false);
      onSpeakText(omni.spokenText);
      return;
    }

    // 2. Call live Gemini API for complex doubts / schemes / queries
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: queryText,
          language: userLang,
          turnCount: 4
        })
      });

      if (res.ok) {
        const data = await res.json();
        const spoken = data.spoken_response || data.text || "விவரங்கள் கீழே கொடுக்கப்பட்டுள்ளன.";
        const resultObj: any = {
          text: spoken,
          type: data.ui_mode || "text"
        };
        if (data.map_query) resultObj.mapQuery = data.map_query;
        if (data.website_url) {
          resultObj.websiteUrl = data.website_url;
          resultObj.websiteLabel = data.website_label || "Official Government Portal";
        }
        setGeminiAnswer(resultObj);
        onSpeakText(spoken);
      } else {
        const fallbackText =
          lang === "ta"
            ? "நீங்கள் அருகில் உள்ள அரசு வங்கி அல்லது சேவை மையத்தை அணுகலாம்."
            : "You can visit the nearest government bank or common service center.";
        setGeminiAnswer({ text: fallbackText, type: "text" });
        onSpeakText(fallbackText);
      }
    } catch (_) {
      const fallbackText =
        lang === "ta"
          ? "உங்கள் கேள்விக்கு அருகில் உள்ள வங்கி அல்லது அரசு மையத்தில் தகவல் பெறலாம்."
          : "Please visit the nearest government bank or service center for assistance.";
      setGeminiAnswer({ text: fallbackText, type: "text" });
      onSpeakText(fallbackText);
    } finally {
      setIsAskingGemini(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!geminiInput.trim()) return;
    const q = geminiInput.trim();
    setGeminiInput("");
    handleAskGemini(q);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-between max-w-xl w-full mx-auto px-4 py-3 space-y-5 animate-in fade-in duration-500">
      {/* Top Replay All Button */}
      <div className="w-full flex items-center justify-between">
        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>{lang === "ta" ? "திட்டம் முடிவானது" : "Scheme Ready"}</span>
        </span>

        {/* Big "Hear Everything" Button */}
        <button
          onClick={onHearEverything}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all"
        >
          <Headphones className="w-4 h-4" />
          <span>{lang === "ta" ? "முழுவதையும் கேளுங்கள்" : "Hear Everything"}</span>
        </button>
      </div>

      {/* Result Card: Scheme Name, Official Portal, Pictorial Steps, and Map */}
      <div
        id="result-card-print"
        className="w-full bg-white border-3 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5 text-left"
      >
        {/* Header: Big Tick + Scheme Name */}
        <div className="flex items-start gap-3.5 border-b border-amber-200/80 pb-4">
          {scheme.eligible ? (
            <div className="p-2 rounded-2xl bg-emerald-100 text-emerald-600 border border-emerald-300 shrink-0 shadow-xs">
              <CheckCircle2 className="w-12 h-12" />
            </div>
          ) : (
            <div className="p-2 rounded-2xl bg-rose-100 text-rose-600 border border-rose-300 shrink-0 shadow-xs">
              <XCircle className="w-12 h-12" />
            </div>
          )}

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-sm">
              {lang === "ta" ? "பரிந்துரைக்கப்பட்ட திட்டம்" : "Recommended Scheme"}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-amber-950 leading-tight">
              {schemeName}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-stone-600">
              {schemeTagline}
            </p>
          </div>
        </div>

        {/* 1. Official Government Website 1-Click Redirect Button */}
        {scheme.official_website && (
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border-2 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <div className="p-2 rounded-xl bg-amber-200 text-amber-900 shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-black uppercase tracking-wider text-amber-950">
                  {lang === "ta" ? "அதிகாரப்பூர்வ அரசு இணையதளம்" : "Official Government Portal"}
                </div>
                <div className="text-xs font-semibold text-stone-600 truncate max-w-[240px]">
                  {scheme.official_website}
                </div>
              </div>
            </div>
            <a
              href={scheme.official_website}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:opacity-95 text-white font-bold text-xs shadow-md active:scale-95 transition-all shrink-0"
            >
              <span>{lang === "ta" ? "நேரடியாக செல்லவும்" : "Open Website"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* 3-4 Pictorial Steps: Each step is tappable to hear again */}
        <div className="space-y-3">
          <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wide flex items-center justify-between">
            <span>{lang === "ta" ? "அடுத்த படிகள் (தட்டவும்)" : "Pictorial Steps (Tap to Hear)"}</span>
            <span className="text-stone-400 font-normal">👆 Tap any step</span>
          </div>

          <div className="space-y-2.5">
            {scheme.steps.map((step, idx) => {
              const title = (step.title as any)[lang] || step.title.en;
              const detail = (step.detail as any)[lang] || step.detail.en;
              const isPlaying = activeStepIndex === idx && isSpeaking;

              return (
                <button
                  key={idx}
                  onClick={() => handleStepTap(step, idx)}
                  className={`w-full flex items-start gap-3.5 p-3.5 rounded-2xl border-2 transition-all text-left shadow-2xs active:scale-98 ${
                    isPlaying
                      ? "bg-amber-100 border-amber-500 ring-2 ring-amber-300"
                      : "bg-stone-50 border-stone-200 hover:border-amber-300 hover:bg-amber-50/50"
                  }`}
                >
                  <div className="mt-0.5">{getStepIcon(step.icon)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-wider text-stone-500">
                        {idx + 1}. {title}
                      </h3>
                      <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                    </div>
                    <p className="text-sm sm:text-base font-bold text-stone-900 mt-0.5 leading-snug">
                      {detail}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Interactive Google Map & Directions */}
        {scheme.map_query && (
          <div className="p-3.5 rounded-2xl bg-orange-50/80 border-2 border-orange-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-bold text-orange-950">
                  {lang === "ta" ? "நேரடி வரைபடம் & வழிகாட்டுதல்" : "Live Map & Directions"}
                </span>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  scheme.map_query
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-700 hover:text-orange-900 underline"
              >
                <span>{lang === "ta" ? "மேப்பில் திறக்க" : "Open Map"}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Embedded Interactive Google Map */}
            <div className="w-full h-44 rounded-xl overflow-hidden border border-orange-300 shadow-inner bg-stone-100">
              <iframe
                title="Google Map Location"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  scheme.map_query
                )}&output=embed`}
              />
            </div>

            {/* Big Directions Button */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                scheme.map_query
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:opacity-95 text-white font-bold text-xs shadow-sm active:scale-98 transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>
                {lang === "ta"
                  ? `கூகிள் மேப்பில் வழியைப் பார்க்க: ${scheme.map_query}`
                  : `Get Directions on Google Maps: ${scheme.map_query}`}
              </span>
            </a>
          </div>
        )}
      </div>

      {/* FULL GEMINI INAUGURATION SECTION ON THE LAST PAGE */}
      <div className="w-full bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 border-3 border-orange-300 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 text-left">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-xs">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-amber-950">
              {lang === "ta" ? "வாணி ஜெமினி உதவியாளர் (Omnipresent AI)" : "VANI Gemini Assistant"}
            </h3>
            <p className="text-xs font-semibold text-stone-600">
              {lang === "ta"
                ? "இணையதள முகவரி, அருகிலுள்ள இடங்கள், அல்லது ஏதேனும் சந்தேகங்களை கேட்கலாம்"
                : "Ask anything: website link, nearest bank/office location, or any doubt"}
            </p>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() =>
              handleAskGemini(
                lang === "ta"
                  ? "அருகிலுள்ள அரசு வங்கி எங்கே?"
                  : "Where is the nearest government bank?"
              )
            }
            className="px-3 py-1.5 rounded-full text-xs font-bold bg-white hover:bg-amber-100/70 border border-amber-300 text-amber-950 active:scale-95 transition-all shadow-2xs flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-orange-600" />
            <span>{lang === "ta" ? "அருகிலுள்ள அரசு வங்கி?" : "Nearest Bank?"}</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleAskGemini(
                lang === "ta"
                  ? "அதிகாரப்பூர்வ அரசு இணையதள இணைப்பு கொடுங்கள்"
                  : "Give official portal link"
              )
            }
            className="px-3 py-1.5 rounded-full text-xs font-bold bg-white hover:bg-amber-100/70 border border-amber-300 text-amber-950 active:scale-95 transition-all shadow-2xs flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5 text-amber-700" />
            <span>{lang === "ta" ? "அதிகாரப்பூர்வ தளம்?" : "Official Website?"}</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleAskGemini(
                lang === "ta"
                  ? "விண்ணப்பிக்க தேவையான முக்கிய ஆவணங்கள் என்ன?"
                  : "What documents are required?"
              )
            }
            className="px-3 py-1.5 rounded-full text-xs font-bold bg-white hover:bg-amber-100/70 border border-amber-300 text-amber-950 active:scale-95 transition-all shadow-2xs flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-rose-600" />
            <span>{lang === "ta" ? "தேவையான ஆவணங்கள்?" : "Required Documents?"}</span>
          </button>
        </div>

        {/* Gemini Answer Display Box */}
        {geminiAnswer && (
          <div className="p-4 rounded-2xl bg-white border-2 border-orange-300 shadow-md space-y-3 animate-in zoom-in-95">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-orange-100 text-orange-700">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-orange-900">
                  {lang === "ta" ? "ஜெமினி பதில்:" : "Gemini Answer:"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onSpeakText(geminiAnswer.text)}
                className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200"
              >
                <Volume2 className="w-3.5 h-3.5 text-orange-600" />
                <span>{lang === "ta" ? "🔊 மீண்டும் கேள்" : "🔊 Hear"}</span>
              </button>
            </div>

            <p className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
              &ldquo;{geminiAnswer.text}&rdquo;
            </p>

            {/* If location requested: Show embedded map */}
            {geminiAnswer.mapQuery && (
              <div className="mt-3 space-y-2">
                <div className="w-full h-44 rounded-xl overflow-hidden border border-orange-300">
                  <iframe
                    title="Gemini Map Location"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      geminiAnswer.mapQuery
                    )}&output=embed`}
                  />
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    geminiAnswer.mapQuery
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{lang === "ta" ? "வரைபடத்தில் வழியைப் பார்க்க" : "View Map Directions"}</span>
                </a>
              </div>
            )}

            {/* If website requested: Show direct 1-click button */}
            {geminiAnswer.websiteUrl && (
              <div className="mt-3">
                <a
                  href={geminiAnswer.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:opacity-95 text-white font-bold text-xs shadow-md"
                >
                  <Globe className="w-4 h-4" />
                  <span>
                    {geminiAnswer.websiteLabel ||
                      (lang === "ta" ? "அதிகாரப்பூர்வ தளத்தை திறக்க" : "Open Official Portal")}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* Input Bar: Speak Button + Text Box */}
        <form onSubmit={handleFormSubmit} className="relative flex items-center gap-2 pt-1">
          {/* Voice Microphone Button */}
          {onStartListening && (
            <button
              type="button"
              onClick={isListening ? onStopListening : onStartListening}
              className={`p-3 rounded-2xl shadow-md border-2 transition-all active:scale-95 ${
                isListening
                  ? "bg-rose-600 border-rose-300 text-white animate-pulse"
                  : "bg-gradient-to-tr from-amber-500 to-orange-600 border-yellow-200 text-white hover:scale-105"
              }`}
              title={isListening ? "Listening..." : "Tap to Speak"}
            >
              {isListening ? (
                <MicOff className="w-5 h-5 animate-bounce" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
          )}

          {/* Text Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={geminiInput}
              onChange={(e) => setGeminiInput(e.target.value)}
              placeholder={
                lang === "ta"
                  ? "சந்தேகங்கள், இணையதளம், இடங்கள் கேளுங்கள்..."
                  : "Ask doubts, website link, locations..."
              }
              className="w-full py-3 pl-4 pr-12 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 bg-white border-2 border-orange-300 focus:border-orange-500 rounded-2xl focus:outline-hidden font-medium shadow-xs"
            />
            <button
              type="submit"
              disabled={!geminiInput.trim() || isAskingGemini}
              className="absolute right-2 top-2 p-2 bg-gradient-to-r from-amber-600 to-orange-500 hover:opacity-90 disabled:opacity-30 text-white rounded-xl transition-all shadow-xs"
              aria-label="Send"
            >
              {isAskingGemini ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>

        {/* Live speech interim feedback */}
        {isListening && interimText && (
          <div className="text-xs font-bold text-orange-950 bg-orange-100 border border-orange-300 rounded-xl px-3 py-1.5 animate-in fade-in">
            &ldquo;{interimText}&rdquo;
          </div>
        )}
      </div>

      {/* Bottom Print / Save Action */}
      <button
        onClick={() => {
          if (typeof window !== "undefined") window.print();
        }}
        className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-white text-stone-900 border border-stone-300 hover:bg-stone-50 shadow-sm transition-all"
      >
        <Printer className="w-4 h-4 text-stone-700" />
        <span>{lang === "ta" ? "பக்கத்தை அச்சிடுக / PDF" : "Print / Save PDF"}</span>
      </button>
    </div>
  );
}
