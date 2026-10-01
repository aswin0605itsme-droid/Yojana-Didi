"use client";

import React, { useState } from "react";
import { Sparkles, Play, Volume2 } from "lucide-react";
import { DidiAvatar } from "./DidiAvatar";
import { playAudioBeep } from "../lib/audioCue";

interface WelcomeLandingProps {
  isListening?: boolean;
  isSpeaking?: boolean;
  isLoadingSpeech?: boolean;
  onStartConsultation: () => void;
}

export function WelcomeLanding({
  isListening = false,
  isSpeaking = false,
  isLoadingSpeech = false,
  onStartConsultation
}: WelcomeLandingProps) {
  const [isRippling, setIsRippling] = useState(false);

  const handleStart = () => {
    playAudioBeep("chime");
    setIsRippling(true);
    setTimeout(() => setIsRippling(false), 2000);
    onStartConsultation();
  };

  return (
    <div
      onClick={handleStart}
      className="relative flex-1 flex flex-col items-center justify-between max-w-xl w-full mx-auto px-4 py-6 text-center select-none overflow-hidden cursor-pointer"
    >
      {/* Expanding Ripple Waves */}
      {isRippling && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0 overflow-hidden">
          <div className="w-56 h-56 rounded-full border-4 border-orange-500/50 animate-full-ripple" />
          <div className="w-56 h-56 rounded-full border-4 border-amber-400/40 animate-full-ripple [animation-delay:0.3s]" />
          <div className="w-56 h-56 rounded-full border-4 border-rose-400/30 animate-full-ripple [animation-delay:0.6s]" />
        </div>
      )}

      {/* Top Visual Badge: Sparkles & Flag */}
      <div className="relative z-10 flex items-center justify-center gap-2 pt-2">
        <div className="p-2.5 rounded-full bg-amber-100 border border-amber-300 shadow-xs flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-600 animate-spin [animation-duration:8s]" />
          <span className="text-xl">🇮🇳</span>
          <Sparkles className="w-5 h-5 text-amber-600 animate-pulse" />
        </div>
      </div>

      {/* Centerpiece: Animated Talking Avatar with Radiant Ambient Rings */}
      <div className="relative z-10 flex flex-col items-center my-auto space-y-6">
        <div className="relative">
          {/* Ambient Glow */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-orange-500/30 via-amber-400/20 to-rose-500/30 blur-2xl animate-pulse pointer-events-none" />

          {/* Didi Avatar */}
          <DidiAvatar
            isSpeaking={isSpeaking || isLoadingSpeech}
            isListening={isListening}
            size="lg"
            showStatusBadge={false}
          />
        </div>

        {/* GIANT GLOWING VISUAL ACTION BUTTON (NO TEXT, PURE VISUALS) */}
        <div className="relative flex flex-col items-center">
          {/* Pulsating Ripple Rings */}
          <div className="absolute w-36 h-36 rounded-full bg-orange-400/20 animate-ping pointer-events-none" />
          <div className="absolute w-44 h-44 rounded-full bg-amber-400/20 animate-pulse pointer-events-none" />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleStart();
            }}
            className="relative z-20 w-28 h-28 sm:w-32 sm:h-32 rounded-full shadow-2xl flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 border-4 border-yellow-200 bg-gradient-to-tr from-amber-500 via-orange-600 to-rose-600 text-white animate-intense-glow hover:scale-105"
            aria-label="Start"
          >
            <Play className="w-12 h-12 fill-white text-white translate-x-1" />
          </button>
        </div>
      </div>

      {/* Bottom Pictogram Journey (Visual Story: Skill -> Work -> Capital -> AI) */}
      <div className="relative z-10 w-full pt-4 pb-2">
        <div className="max-w-xs mx-auto py-3 px-4 rounded-3xl bg-white/90 border-2 border-amber-300 shadow-sm flex items-center justify-around text-2xl">
          <span title="Skill">✂️</span>
          <span className="text-amber-400 text-sm">➔</span>
          <span title="Group or Self">👥</span>
          <span className="text-amber-400 text-sm">➔</span>
          <span title="Capital">🪙</span>
          <span className="text-amber-400 text-sm">➔</span>
          <span title="AI Guide">✨</span>
        </div>
      </div>
    </div>
  );
}
