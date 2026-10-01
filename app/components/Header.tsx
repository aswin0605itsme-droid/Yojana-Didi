"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, RotateCcw, Sparkles, Globe, Headphones, Home } from "lucide-react";
import { SUPPORTED_LANGUAGES, LanguageConfig } from "../lib/languages";

interface HeaderProps {
  currentLanguage: LanguageConfig;
  onSelectLanguage: (code: string) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onReset: () => void;
  onGoHome?: () => void;
  isReadingPage: boolean;
  onReadPageOutLoud: () => void;
}

export function Header({
  currentLanguage,
  onSelectLanguage,
  isMuted,
  onToggleMute,
  onReset,
  onGoHome,
  isReadingPage,
  onReadPageOutLoud
}: HeaderProps) {
  const [showLangMenu, setShowLangMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-amber-50/95 backdrop-blur-md border-b border-amber-200/80 px-3 sm:px-4 py-2.5 shadow-xs">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
        {/* Brand identity: VANI */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onGoHome}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-amber-600 via-orange-500 to-rose-500 flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-md border-2 border-white shrink-0 hover:scale-105 transition-transform"
            title="Return to Welcome Screen"
          >
            V
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="font-black text-amber-950 text-base sm:text-lg leading-tight tracking-tight truncate">
                VANI
              </h1>
              <span className="text-[10px] font-bold bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1 shrink-0">
                <Sparkles className="w-2.5 h-2.5 text-amber-700" /> Nari Initiatives
              </span>
            </div>
            <p className="text-[11px] text-amber-900/80 font-medium truncate hidden sm:block">
              {currentLanguage.ui.tagline}
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Read Page Out Loud Button */}
          <button
            onClick={onReadPageOutLoud}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs border ${
              isReadingPage
                ? "bg-rose-500 text-white border-rose-600 animate-pulse"
                : "bg-gradient-to-r from-amber-600 to-orange-500 text-white border-amber-600 hover:opacity-90"
            }`}
            title={currentLanguage.ui.readPageOutLoud}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {isReadingPage ? currentLanguage.ui.readingPage : currentLanguage.ui.readPageOutLoud}
            </span>
            <span className="md:hidden">Suno</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold text-amber-950 bg-white border border-amber-300 hover:bg-amber-100/70 transition-all shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5 text-amber-700" />
              <span>{currentLanguage.nativeName}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-1.5 w-48 bg-white border-2 border-amber-300 rounded-2xl shadow-xl p-1 z-50 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800 border-b border-amber-100">
                  Select Language / Dialect
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {Object.values(SUPPORTED_LANGUAGES).map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onSelectLanguage(lang.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold text-left transition-all ${
                        currentLanguage.code === lang.code
                          ? "bg-amber-100 text-amber-950 font-bold"
                          : "hover:bg-amber-50 text-stone-700"
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      <span className="text-[10px] text-stone-500 font-normal">
                        {lang.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Audio toggle */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? "Unmute VANI's voice" : "Mute VANI's voice"}
            className={`p-1.5 sm:p-2 rounded-full border transition-all ${
              isMuted
                ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                : "bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200"
            }`}
            title={isMuted ? "Awaaz chalu karein" : "Awaaz band karein"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Home / Return button */}
          {onGoHome && (
            <button
              onClick={onGoHome}
              aria-label="Home"
              className="p-1.5 sm:p-2 rounded-full text-amber-900 bg-white border border-amber-200 hover:bg-amber-100/70 transition-all shadow-2xs"
              title="Welcome screen"
            >
              <Home className="w-4 h-4" />
            </button>
          )}

          {/* Reset */}
          <button
            onClick={onReset}
            aria-label="Start over"
            className="p-1.5 sm:p-2 rounded-full text-amber-900 bg-white border border-amber-200 hover:bg-amber-100/70 transition-all shadow-2xs"
            title={currentLanguage.ui.newConsultation}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
