"use client";

import React from "react";
import { Mic, CheckCircle2, ShieldCheck, ArrowDown } from "lucide-react";

interface PermissionPromptProps {
  lang: "ta" | "en";
  hasUnlockedAudio: boolean;
  onUnlockAudio: () => void;
  onRequestMic: () => void;
}

export function PermissionPrompt({
  lang,
  hasUnlockedAudio,
  onUnlockAudio,
  onRequestMic
}: PermissionPromptProps) {
  // Strict <= 12 words per sentence
  const sentence1 =
    lang === "ta"
      ? "வணக்கம் சகோதரி, அரசு உதவி பெற நான் வழிகாட்டுகிறேன்." // 6 words
      : "Hello sister, I will help you find government support."; // 9 words

  const sentence2 =
    lang === "ta"
      ? "ஒரு பெட்டி தோன்றும், அதில் Allow பொத்தானைத் தட்டவும்." // 7 words
      : "A box will appear. Please tap the Allow button."; // 9 words

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full mx-auto px-4 py-8 text-center space-y-6 animate-in fade-in duration-500">
      {/* Step 1: Initial State Before Audio Unlock */}
      {!hasUnlockedAudio ? (
        <div className="space-y-6 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 via-orange-500 to-rose-500 flex items-center justify-center text-white font-black text-2xl shadow-xl">
            V
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-amber-950">
              {lang === "ta" ? "அரசு உதவி வழிகாட்டி" : "Government Scheme Guide"}
            </h1>
            <p className="text-sm text-stone-600 font-medium">
              {lang === "ta" ? "தொடங்குவதற்கு கீழே உள்ள பொத்தானைத் தொடவும்." : "Tap the microphone below to begin."}
            </p>
          </div>

          {/* Big Tap to Unlock Button */}
          <button
            onClick={onUnlockAudio}
            className="w-32 h-32 rounded-full bg-gradient-to-tr from-amber-600 via-orange-500 to-rose-500 text-white shadow-2xl flex flex-col items-center justify-center gap-2 border-4 border-amber-200 hover:scale-105 active:scale-95 transition-all animate-pulse"
            aria-label="Tap to unlock audio"
          >
            <Mic className="w-12 h-12" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {lang === "ta" ? "தொடங்கவும்" : "Tap Here"}
            </span>
          </button>
        </div>
      ) : (
        /* Step 2: The guide speaks sentence 1 & sentence 2, and shows permission illustration */
        <div className="space-y-6 w-full flex flex-col items-center animate-in fade-in">
          {/* Spoken Sentences displayed crisp and large */}
          <div className="bg-amber-100/70 border-2 border-amber-300 rounded-3xl p-5 shadow-sm space-y-2 w-full">
            <p className="text-base sm:text-lg font-bold text-amber-950 leading-snug">
              &ldquo;{sentence1}&rdquo;
            </p>
            <p className="text-sm sm:text-base font-semibold text-amber-900 leading-snug">
              &ldquo;{sentence2}&rdquo;
            </p>
          </div>

          {/* Illustrated Browser Permission Box */}
          <div className="w-full bg-white border-2 border-stone-300 rounded-2xl p-4 shadow-xl space-y-3 relative text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-700 border-b pb-2">
              <Mic className="w-4 h-4 text-orange-600 animate-pulse" />
              <span>{lang === "ta" ? "மைக் அனுமதி தேவை" : "Microphone Permission"}</span>
            </div>

            <p className="text-xs text-stone-600">
              {lang === "ta"
                ? "பேசி பதிலளிக்க உங்கள் மைக்கை இயக்க அனுமதிக்கவும்:"
                : "Allow this page to use your microphone to answer:"}
            </p>

            {/* Simulated browser popup buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <span className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-500 bg-stone-100">
                Block
              </span>
              <div className="relative">
                <span className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 flex items-center gap-1 shadow-md ring-4 ring-blue-300 animate-pulse">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Allow
                </span>
                <span className="absolute -top-6 -right-1 text-[11px] font-black text-rose-600 bg-amber-100 px-1.5 py-0.5 rounded-md border border-rose-300 animate-bounce">
                  Tap here 👆
                </span>
              </div>
            </div>
          </div>

          {/* Action to trigger real browser prompt */}
          <button
            onClick={onRequestMic}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-black text-base shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{lang === "ta" ? "Allow தட்ட தயாராக உள்ளேன்" : "I am Ready, Ask Now"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
