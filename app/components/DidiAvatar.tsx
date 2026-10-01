"use client";

import React from "react";
import { Mic, Volume2, Sparkles } from "lucide-react";
import { LanguageConfig } from "../lib/languages";

interface VaniAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  isLoading?: boolean;
  currentLanguage?: LanguageConfig;
  size?: "sm" | "md" | "lg";
  showStatusBadge?: boolean;
}

export function DidiAvatar({
  isSpeaking,
  isListening,
  isLoading = false,
  currentLanguage,
  size = "md",
  showStatusBadge = true
}: VaniAvatarProps) {
  let statusText = currentLanguage?.ui.speaking || "Speaking";
  let statusBadgeClass = "bg-amber-100/90 text-amber-900 border-amber-300";

  if (isListening) {
    statusText = currentLanguage?.ui.listening || "Listening...";
    statusBadgeClass = "bg-rose-100 text-rose-800 border-rose-300 animate-pulse";
  } else if (isSpeaking) {
    statusText = currentLanguage?.ui.speaking || "Speaking...";
    statusBadgeClass = "bg-orange-100 text-orange-900 border-orange-300 animate-pulse";
  } else if (isLoading) {
    statusText = currentLanguage?.ui.thinking || "Thinking...";
    statusBadgeClass = "bg-amber-200 text-amber-950 border-amber-400 animate-pulse";
  } else {
    statusText = "VANI • Sister Companion";
  }

  // Dimension classes
  const containerSizeClass =
    size === "lg"
      ? "w-28 h-28 sm:w-32 sm:h-32"
      : size === "sm"
      ? "w-14 h-14"
      : "w-24 h-24";

  const svgSizeClass =
    size === "lg"
      ? "w-24 h-24 sm:w-28 sm:h-28"
      : size === "sm"
      ? "w-11 h-11"
      : "w-20 h-20";

  const outerGlowSizeClass =
    size === "lg"
      ? "w-36 h-36 sm:w-40 sm:h-40"
      : size === "sm"
      ? "w-18 h-18"
      : "w-28 h-28";

  return (
    <div className="flex flex-col items-center justify-center py-1 transition-all select-none">
      <div className="relative flex items-center justify-center">
        {/* Animated outer glow rings */}
        {isListening && (
          <div
            className={`absolute ${outerGlowSizeClass} rounded-full bg-rose-400/30 animate-ping pointer-events-none`}
          />
        )}
        {isSpeaking && (
          <>
            <div
              className={`absolute ${outerGlowSizeClass} rounded-full bg-amber-400/30 animate-pulse pointer-events-none scale-110`}
            />
            <div
              className={`absolute ${outerGlowSizeClass} rounded-full border-2 border-orange-400/40 animate-ping pointer-events-none`}
            />
          </>
        )}

        {/* Avatar container */}
        <div
          className={`relative ${containerSizeClass} rounded-full p-1 bg-gradient-to-tr from-amber-600 via-orange-400 to-rose-400 shadow-xl border-3 border-amber-200 transition-all duration-300 ${
            isSpeaking ? "scale-105 animate-gentle-float" : "hover:scale-102"
          }`}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center overflow-hidden">
            {/* VANI warm Sister Companion SVG avatar */}
            <svg
              viewBox="0 0 100 100"
              className={`${svgSizeClass} drop-shadow-sm transition-transform duration-300 transform ${
                isSpeaking ? "animate-girl-head-sway" : ""
              }`}
            >
              {/* Hair / Dupatta background */}
              <circle cx="50" cy="46" r="32" fill="#2d1508" />
              <path
                d="M 18,54 Q 50,15 82,54 Q 85,85 15,85 Z"
                fill="#d97706"
                opacity="0.95"
              />
              {/* Face */}
              <ellipse cx="50" cy="50" rx="22" ry="24" fill="#fcd34d" />

              {/* Hair parting & forehead */}
              <path
                d="M 28,42 Q 50,30 72,42 Q 62,32 50,32 Q 38,32 28,42 Z"
                fill="#1f140e"
              />

              {/* Traditional Gold Jhumkas (Earrings) */}
              <circle cx="26" cy="55" r="2.5" fill="#f59e0b" stroke="#b45309" strokeWidth="0.5" />
              <path d="M 24,57 L 28,57 L 26,61 Z" fill="#d97706" />
              <circle cx="74" cy="55" r="2.5" fill="#f59e0b" stroke="#b45309" strokeWidth="0.5" />
              <path d="M 72,57 L 76,57 L 74,61 Z" fill="#d97706" />

              {/* Bindi (Maroon vermilion) */}
              <circle cx="50" cy="43" r="2.4" fill="#b91c1c" />
              <circle cx="50" cy="43" r="0.8" fill="#fef08a" />

              {/* Eyes with Natural Blinking Animation */}
              <g className={isSpeaking ? "animate-girl-blink" : "animate-girl-blink"}>
                <ellipse cx="41" cy="49" rx="2.6" ry="2.2" fill="#1f140e" />
                <ellipse cx="59" cy="49" rx="2.6" ry="2.2" fill="#1f140e" />
                {/* Eye sparkle reflection */}
                <circle cx="42" cy="48" r="0.9" fill="#ffffff" />
                <circle cx="60" cy="48" r="0.9" fill="#ffffff" />
              </g>

              {/* Eyebrows */}
              <path d="M 36,44 Q 41,41 46,44" stroke="#2d1508" strokeWidth="1.2" fill="none" />
              <path d="M 54,44 Q 59,41 64,44" stroke="#2d1508" strokeWidth="1.2" fill="none" />

              {/* Nose ring / Nath */}
              <circle cx="46" cy="54" r="1.6" stroke="#f59e0b" strokeWidth="0.9" fill="none" />
              <circle cx="45.5" cy="55" r="0.6" fill="#dc2626" />

              {/* Talking Girl Mouth Animation */}
              {isSpeaking ? (
                /* Dynamic moving mouth when talking */
                <g className="animate-girl-talk-mouth">
                  {/* Outer smiling lips */}
                  <ellipse cx="50" cy="61" rx="6.5" ry="3.8" fill="#991b1b" />
                  {/* Inner mouth opening */}
                  <ellipse cx="50" cy="61" rx="4.8" ry="2.4" fill="#450a0a" />
                  {/* Subtle teeth highlight */}
                  <path d="M 47,59.8 Q 50,60.8 53,59.8" stroke="#ffffff" strokeWidth="0.8" fill="none" />
                </g>
              ) : (
                /* Warm friendly smile when idle/listening */
                <path
                  d="M 43,59.5 Q 50,65.5 57,59.5"
                  stroke="#991b1b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
              )}

              {/* Saree Pallu shoulder draped */}
              <path
                d="M 24,75 Q 35,68 50,75 Q 65,82 76,75 L 82,98 L 18,98 Z"
                fill="#c2410c"
              />
              <path
                d="M 30,76 Q 50,82 70,76"
                stroke="#fbbf24"
                strokeWidth="1.8"
                fill="none"
              />
            </svg>
          </div>

          {/* Indicator icon badge */}
          <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-white shadow-md border border-amber-300">
            {isListening ? (
              <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600 animate-bounce" />
            ) : isSpeaking ? (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 animate-pulse" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            )}
          </div>
        </div>
      </div>

      {/* Status indicator pill */}
      {showStatusBadge && (
        <div
          className={`mt-2.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-2xs flex items-center gap-1.5 transition-all ${statusBadgeClass}`}
        >
          <span className="w-2 h-2 rounded-full bg-current animate-ping" />
          <span>{statusText}</span>
        </div>
      )}
    </div>
  );
}

// Export VaniAvatar as alias
export const VaniAvatar = DidiAvatar;
