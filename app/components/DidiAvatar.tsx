"use client";

import React from "react";
import { Mic, Volume2, Sparkles } from "lucide-react";

interface DidiAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  isLoading: boolean;
}

export function DidiAvatar({ isSpeaking, isListening, isLoading }: DidiAvatarProps) {
  let statusText = "दीदी आपके साथ हैं";
  let statusBadgeClass = "bg-amber-100/90 text-amber-900 border-amber-300";

  if (isListening) {
    statusText = "दीदी सुन रही हैं... बोलिए behen";
    statusBadgeClass = "bg-rose-100 text-rose-800 border-rose-300 animate-pulse";
  } else if (isSpeaking) {
    statusText = "दीदी बता रही हैं...";
    statusBadgeClass = "bg-orange-100 text-orange-900 border-orange-300 animate-pulse";
  } else if (isLoading) {
    statusText = "दीदी सबसे अच्छी योजना सोच रही हैं...";
    statusBadgeClass = "bg-amber-200 text-amber-950 border-amber-400 animate-pulse";
  }

  return (
    <div className="flex flex-col items-center justify-center py-2 transition-all">
      <div className="relative flex items-center justify-center">
        {/* Animated outer glow rings */}
        {isListening && (
          <div className="absolute w-28 h-28 rounded-full bg-rose-400/30 animate-ping" />
        )}
        {isSpeaking && (
          <div className="absolute w-28 h-28 rounded-full bg-amber-400/30 animate-pulse" />
        )}

        {/* Avatar container */}
        <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-600 via-orange-400 to-rose-400 shadow-lg border-2 border-amber-200">
          <div className="w-full h-full rounded-full bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center overflow-hidden">
            {/* Hand-crafted warm Indian sister SVG avatar */}
            <svg
              viewBox="0 0 100 100"
              className="w-20 h-20 drop-shadow-sm transition-transform duration-300 transform hover:scale-105"
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
              
              {/* Bindi */}
              <circle cx="50" cy="43" r="2.2" fill="#dc2626" />

              {/* Eyes */}
              <circle cx="41" cy="49" r="2.4" fill="#1f140e" />
              <circle cx="59" cy="49" r="2.4" fill="#1f140e" />
              {/* Eye sparkle */}
              <circle cx="42" cy="48" r="0.8" fill="#ffffff" />
              <circle cx="60" cy="48" r="0.8" fill="#ffffff" />

              {/* Eyebrows */}
              <path d="M 36,44 Q 41,41 46,44" stroke="#2d1508" strokeWidth="1.2" fill="none" />
              <path d="M 54,44 Q 59,41 64,44" stroke="#2d1508" strokeWidth="1.2" fill="none" />

              {/* Nose ring / Nath */}
              <circle cx="46" cy="54" r="1.5" stroke="#f59e0b" strokeWidth="0.8" fill="none" />

              {/* Gentle smile */}
              <path
                d="M 43,59 Q 50,65 57,59"
                stroke="#991b1b"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />

              {/* Yellow/Orange Saree Pallu shoulder draped */}
              <path
                d="M 24,75 Q 35,68 50,75 Q 65,82 76,75 L 82,98 L 18,98 Z"
                fill="#c2410c"
              />
              <path
                d="M 30,76 Q 50,82 70,76"
                stroke="#fbbf24"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>

          {/* Indicator icons */}
          <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-white shadow-md border border-amber-300">
            {isListening ? (
              <Mic className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
            ) : isSpeaking ? (
              <Volume2 className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            )}
          </div>
        </div>
      </div>

      {/* Status indicator pill */}
      <div
        className={`mt-2.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-2xs flex items-center gap-1.5 transition-all ${statusBadgeClass}`}
      >
        <span className="w-2 h-2 rounded-full bg-current animate-ping" />
        <span>{statusText}</span>
      </div>
    </div>
  );
}
