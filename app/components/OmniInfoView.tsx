"use client";

import React from "react";
import { MapPin, Globe, ExternalLink, Navigation, Volume2, Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import { DidiAvatar } from "./DidiAvatar";

interface OmniInfoViewProps {
  type: "location" | "website" | "fact";
  title: string;
  spokenText: string;
  mapQuery?: string;
  websiteUrl?: string;
  websiteLabel?: string;
  lang: "ta" | "en";
  isSpeaking: boolean;
  onRepeatSpeech: () => void;
  onFindMyScheme: () => void;
  onStartAgain: () => void;
}

export function OmniInfoView({
  type,
  title,
  spokenText,
  mapQuery,
  websiteUrl,
  websiteLabel,
  lang,
  isSpeaking,
  onRepeatSpeech,
  onFindMyScheme,
  onStartAgain
}: OmniInfoViewProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-between max-w-xl w-full mx-auto px-4 py-4 space-y-4 animate-in fade-in duration-500">
      {/* Top Sister Avatar with talking animation */}
      <div className="flex flex-col items-center">
        <DidiAvatar
          isSpeaking={isSpeaking}
          isListening={false}
          size="md"
          showStatusBadge={false}
        />
        <div className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>VANI Omnipresent Guide</span>
        </div>
      </div>

      {/* Spoken Response Card (Tappable to re-hear) */}
      <button
        onClick={onRepeatSpeech}
        className="w-full p-4 rounded-2xl bg-white border-2 border-amber-300 shadow-md text-left flex items-start justify-between gap-3 hover:border-amber-500 transition-all active:scale-98"
      >
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-sm">
            {type === "location"
              ? lang === "ta"
                ? "இருப்பிடம் & வழிகாட்டுதல்"
                : "Location & Navigation"
              : lang === "ta"
              ? "அரசு தகவல் & இணையதளம்"
              : "Official Portal & Info"}
          </span>
          <p className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
            &ldquo;{spokenText}&rdquo;
          </p>
        </div>
        <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-1">
          <Volume2 className="w-4 h-4" />
        </div>
      </button>

      {/* Main Content Area: Map OR Official Website */}
      <div className="w-full bg-white border-2 border-amber-200 rounded-3xl p-4 sm:p-5 shadow-lg space-y-4 text-left">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
          {type === "location" ? (
            <MapPin className="w-6 h-6 text-orange-600" />
          ) : (
            <Globe className="w-6 h-6 text-amber-600" />
          )}
          <h2 className="text-lg font-black text-amber-950">{title}</h2>
        </div>

        {/* 1. If Location Query: Embedded Google Map & Direct Directions */}
        {mapQuery && (
          <div className="space-y-3">
            <div className="w-full h-56 rounded-2xl overflow-hidden border-2 border-orange-300 shadow-inner bg-stone-100">
              <iframe
                title="Google Map Location"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
              />
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:opacity-95 text-white font-bold text-sm shadow-md active:scale-98 transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>
                {lang === "ta"
                  ? `கூகிள் மேப்பில் வழியைப் பார்க்க: ${mapQuery}`
                  : `Get Directions on Google Maps: ${mapQuery}`}
              </span>
            </a>
          </div>
        )}

        {/* 2. If Website Query: 1-Click Official Portal Redirect */}
        {websiteUrl && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 space-y-2">
              <div className="text-xs font-semibold text-stone-600">
                {lang === "ta"
                  ? "மத்திய / மாநில அரசின் அதிகாரப்பூர்வ தளம். பாதுகாப்பானது."
                  : "Verified Central / State Government Portal. Safe & direct."}
              </div>
              <div className="text-sm font-bold text-amber-950 break-all">
                {websiteLabel || websiteUrl}
              </div>
            </div>

            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:opacity-95 text-white font-bold text-sm shadow-md active:scale-98 transition-all"
            >
              <Globe className="w-4 h-4" />
              <span>
                {lang === "ta" ? "அதிகாரப்பூர்வ தளத்தை திறக்கவும்" : "Visit Official Website"}
              </span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>

      {/* Bottom Action Buttons */}
      <div className="w-full flex flex-col sm:flex-row items-center gap-2 pt-2">
        <button
          onClick={onFindMyScheme}
          className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-stone-900 to-stone-800 text-white font-bold text-xs sm:text-sm shadow-md hover:bg-stone-700 active:scale-95 transition-all"
        >
          <span>{lang === "ta" ? "எனக்கான திட்டத்தைத் தேர்ந்தெடுக்க" : "Find My Government Scheme"}</span>
          <ArrowRight className="w-4 h-4 text-amber-300" />
        </button>

        <button
          onClick={onStartAgain}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-3 rounded-full bg-white border border-stone-300 text-stone-700 font-bold text-xs sm:text-sm shadow-2xs hover:bg-stone-50 active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{lang === "ta" ? "மீண்டும் தொடங்கு" : "Start Again"}</span>
        </button>
      </div>
    </div>
  );
}
