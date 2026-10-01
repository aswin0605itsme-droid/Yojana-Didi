"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Volume2, Sparkles, MessageCircle } from "lucide-react";
import { ChatMessage } from "../types";

interface InterviewChatProps {
  messages: ChatMessage[];
  turnCount: number;
  isLoading: boolean;
  isListening: boolean;
  interimText: string;
  onSendMessage: (text: string) => void;
  onStartListening: () => void;
  onStopListening: () => void;
  onSpeakText: (text: string) => void;
}

export function InterviewChat({
  messages,
  turnCount,
  isLoading,
  isListening,
  interimText,
  onSendMessage,
  onStartListening,
  onStopListening,
  onSpeakText
}: InterviewChatProps) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interimText, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleQuickOption = (option: string) => {
    if (isLoading) return;
    // Clean emoji from quick option text if any
    const cleanText = option.replace(/^[^\w\s\u0900-\u097F]+/, "").trim();
    onSendMessage(cleanText || option);
  };

  // Determine dynamic quick reply suggestions based on the stage
  const getQuickReplies = (): string[] => {
    if (turnCount === 1) {
      return [
        "✂️ Silai / Tailoring",
        "🐄 Dairy / Gai-Bhains",
        "🛒 Chhoti Dukan / Thela",
        "🌾 Kheti / Sabzi"
      ];
    }
    if (turnCount === 2) {
      return [
        "👥 Haan, Bachat Gat / Samooh mein hoon",
        "🙋‍♀️ Nahi, akele kaam shuru karungi",
        "💳 Haan, mera bank khata hai"
      ];
    }
    if (turnCount === 3) {
      return [
        "💰 ₹50,000 ke andar",
        "💵 ₹1 Lakh tak",
        "🌟 Jitni sahayata mil sake"
      ];
    }
    return ["Haan / Yes", "Nahi / No", "Aage bataiye"];
  };

  const quickReplies = getQuickReplies();

  return (
    <div className="flex flex-col flex-1 max-w-xl w-full mx-auto space-y-3">
      {/* Progress Stepper */}
      <div className="bg-amber-100/60 border border-amber-200/80 rounded-2xl p-2.5 px-3.5 shadow-2xs">
        <div className="flex items-center justify-between text-xs font-bold text-amber-950 mb-1.5">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            {turnCount <= 3 ? `Sawal ${turnCount} / 3: Bas thodi si jaankari` : "Aapki Parchi Tayyar!"}
          </span>
          <span className="text-[11px] font-semibold text-amber-800">
            {turnCount === 1 && "Aapka Kaam"}
            {turnCount === 2 && "Bachat Samooh"}
            {turnCount === 3 && "Zaroorat"}
            {turnCount > 3 && "Yojana Parchi"}
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-amber-200/70 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, (turnCount / 4) * 100)}%` }}
          />
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto space-y-3 p-1 min-h-[220px] max-h-[46vh]">
        {messages.map((msg) => {
          const isDidi = msg.role === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                isDidi ? "justify-start" : "justify-end"
              } animate-in fade-in duration-300`}
            >
              {isDidi && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs mb-1">
                  य
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-3xl p-3.5 text-sm sm:text-base leading-relaxed shadow-sm transition-all ${
                  isDidi
                    ? "bg-white text-amber-950 border border-amber-200/90 rounded-bl-xs"
                    : "bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-br-xs font-medium"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {isDidi && (
                  <div className="mt-2 pt-1 border-t border-amber-100 flex items-center justify-between">
                    <span className="text-[10px] text-amber-700/70 font-medium">Yojana Didi</span>
                    <button
                      type="button"
                      onClick={() => onSpeakText(msg.text)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200 transition-all"
                    >
                      <Volume2 className="w-3 h-3 text-orange-600" />
                      <span>Suno</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Interim Speech Transcription bubble */}
        {isListening && interimText && (
          <div className="flex justify-end animate-in fade-in">
            <div className="max-w-[85%] rounded-3xl rounded-br-xs p-3 text-sm bg-orange-100 border border-orange-300 text-orange-950 italic">
              <span className="text-[11px] font-bold text-orange-700 block mb-0.5">
                Aap bol rahi hain...
              </span>
              &ldquo;{interimText}&rdquo;
            </div>
          </div>
        )}

        {/* Loading / Thinking bubble */}
        {isLoading && (
          <div className="flex items-center gap-2 justify-start">
            <div className="w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
              य
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl rounded-bl-xs px-4 py-3 flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-amber-800 font-medium ml-1">
                दीदी जवाब तैयार कर रही हैं...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Option Pills for low-literacy / easy tap */}
      {!isLoading && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-amber-900 font-semibold px-1">
            <MessageCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Ek touch mein chuney (Quick Answer):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickOption(reply)}
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white border border-amber-300 hover:border-amber-500 hover:bg-amber-100/60 text-amber-950 shadow-2xs transition-all active:scale-95 text-left"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Audio & Text Input Bar */}
      <div className="bg-white/95 backdrop-blur-xs border-2 border-amber-300/80 rounded-3xl p-2 sm:p-2.5 shadow-lg flex flex-col gap-2">
        {/* Big accessible microphone button */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={isListening ? onStopListening : onStartListening}
            className={`w-full py-3 px-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-98 ${
              isListening
                ? "bg-rose-600 text-white animate-pulse hover:bg-rose-700"
                : "bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-white hover:opacity-95"
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5 animate-bounce" />
                <span>Bolna Band Karein (Listening...)</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 text-amber-100" />
                <span>🎤 Didi Se Bolkar Baat Karein (Tap to Speak)</span>
              </>
            )}
          </button>
        </div>

        {/* Text fallback input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1 border-t border-amber-100">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ya yahan likhein (e.g. Silai machine leni hai)..."
            disabled={isLoading || isListening}
            className="flex-1 bg-amber-50/50 border border-amber-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            aria-label="Send message"
            className="p-2 sm:p-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl disabled:opacity-40 transition-all shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
