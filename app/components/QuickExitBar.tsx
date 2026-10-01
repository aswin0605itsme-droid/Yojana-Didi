"use client";

import React, { useState } from "react";
import { RotateCcw, Globe, Volume2, Loader2, Check, X } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "../lib/languages";

interface QuickExitBarProps {
  lang: string;
  onSelectLang: (langCode: string) => void;
  onStartAgain: () => void;
  onReadPageOutLoud: () => void;
  isReadingPage?: boolean;
  isLoadingSpeech?: boolean;
  showStartOver?: boolean;
  isFrontPage?: boolean;
}

export function QuickExitBar({
  lang,
  onSelectLang,
  onStartAgain,
  onReadPageOutLoud,
  isReadingPage = false,
  isLoadingSpeech = false,
  showStartOver = true,
  isFrontPage = false
}: QuickExitBarProps) {
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  const activeLangConfig = SUPPORTED_LANGUAGES[lang] || SUPPORTED_LANGUAGES["ta"] || SUPPORTED_LANGUAGES["en"];

  const handleChooseLang = (code: string) => {
    onSelectLang(code);
    setIsLangModalOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
        {/* 1. All-Language Picker Button */}
        <button
          type="button"
          onClick={() => setIsLangModalOpen(true)}
          className={`flex items-center gap-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300 active:scale-95 transition-all text-xs font-bold text-amber-950 shadow-2xs ${
            isFrontPage ? "p-2" : "px-3 py-1.5"
          }`}
          title="Change Language"
        >
          <Globe className="w-4 h-4 text-amber-700" />
          {!isFrontPage && (
            <>
              <span>{activeLangConfig.nativeName}</span>
              <span className="text-[10px] text-stone-400">▼</span>
            </>
          )}
        </button>

        {/* Center / Action: Read Page Out Loud Button with visual glow (hidden on pure visual front page) */}
        {!isFrontPage ? (
          <button
            type="button"
            onClick={onReadPageOutLoud}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-black text-xs transition-all active:scale-95 shadow-sm border ${
              isLoadingSpeech
                ? "bg-amber-100 border-amber-400 text-amber-950 animate-pulse"
                : isReadingPage
                ? "bg-gradient-to-r from-amber-500 to-orange-500 border-amber-600 text-white animate-pulse ring-2 ring-orange-300"
                : "bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border-amber-300 text-amber-950"
            }`}
            title={activeLangConfig.ui.readPageOutLoud || "Read Page Out Loud"}
          >
            {isLoadingSpeech ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
                <span>{lang === "ta" ? "குரல் தயாராகிறது..." : "Preparing Speech..."}</span>
              </>
            ) : isReadingPage ? (
              <>
                <Volume2 className="w-4 h-4 text-white animate-bounce" />
                <span>{activeLangConfig.ui.readingPage || "Reading..."}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-orange-600" />
                <span>{activeLangConfig.ui.readPageOutLoud || "🔊 Read Out Loud"}</span>
              </>
            )}
          </button>
        ) : (
          <div className="flex-1" />
        )}

        {/* 3. Restart / Reset Session Button */}
        {showStartOver ? (
          <button
            type="button"
            onClick={onStartAgain}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-300 active:scale-95 transition-all text-xs font-semibold text-stone-700 shadow-2xs"
            title="Start Over"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden sm:inline">
              {lang === "ta" ? "மீண்டும்" : lang === "hi" ? "शुरू से" : "Start Over"}
            </span>
          </button>
        ) : (
          <div className="w-16" />
        )}
      </header>

      {/* Language Selection Modal (All 9 Major Languages) */}
      {isLangModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border-2 border-amber-300 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-black text-amber-950">
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
                const isSelected = code === lang;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleChooseLang(code)}
                    className={`p-3 rounded-2xl border-2 text-left flex items-center justify-between transition-all active:scale-95 ${
                      isSelected
                        ? "bg-amber-100 border-amber-500 font-black text-amber-950 shadow-xs"
                        : "bg-stone-50 border-stone-200 hover:border-amber-300 text-stone-800"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">{config.nativeName}</div>
                      <div className="text-[10px] text-stone-500">{config.name}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-700" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
