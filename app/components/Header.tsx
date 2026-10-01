"use client";

import React from "react";
import { Volume2, VolumeX, RotateCcw, Sparkles } from "lucide-react";

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onReset: () => void;
  turnCount: number;
}

export function Header({ isMuted, onToggleMute, onReset, turnCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-amber-50/90 backdrop-blur-md border-b border-amber-200/80 px-4 py-3 shadow-xs">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 via-orange-500 to-rose-500 flex items-center justify-center text-white font-bold text-xl shadow-md border-2 border-white">
            य
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-amber-950 text-lg leading-tight tracking-tight">
                Yojana Didi
              </h1>
              <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Sarkari Sahayata
              </span>
            </div>
            <p className="text-xs text-amber-800/80 font-medium">
              गांव की बहनों की सच्ची साथी • कोई कठिन कागज़ी भाषा नहीं
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? "Unmute Didi's voice" : "Mute Didi's voice"}
            className={`p-2 rounded-full border transition-all ${
              isMuted
                ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                : "bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200"
            }`}
            title={isMuted ? "Awaaz chalu karein" : "Awaaz band karein"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Reset / New Consultation */}
          <button
            onClick={onReset}
            aria-label="Start over"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium text-amber-900 bg-white border border-amber-200 hover:bg-amber-100/70 transition-all shadow-xs"
            title="Nayi baat shuru karein"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nayi Baat</span>
          </button>
        </div>
      </div>
    </header>
  );
}
