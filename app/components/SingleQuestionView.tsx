"use client";

import React from "react";
import {
  Mic,
  MicOff,
  Check,
  X,
  Volume2,
  Sparkles
} from "lucide-react";

interface OptionItem {
  id: string;
  label: { [lang: string]: string };
  icon: string;
}

interface QuestionData {
  id: string;
  title?: { [lang: string]: string };
  speech: { [lang: string]: string };
  options: OptionItem[];
}

interface SingleQuestionViewProps {
  question: QuestionData;
  questionIndex: number;
  totalQuestions: number;
  lang: string;
  isListening: boolean;
  isSpeaking: boolean;
  interimText: string;
  isConfirmedPending: boolean;
  pendingAnswerText: string;
  silenceMissCount: number;
  isMicDenied: boolean;
  highlightedKey?: string | null;
  onConfirmAnswer: (confirmed: boolean) => void;
  onSelectOptionDirectly: (optionId: string) => void;
  onRepeatQuestion: () => void;
  onStartListening: () => void;
  onStopListening: () => void;
}

export function SingleQuestionView({
  question,
  questionIndex,
  totalQuestions,
  lang,
  isListening,
  isSpeaking,
  interimText,
  isConfirmedPending,
  pendingAnswerText,
  silenceMissCount,
  isMicDenied,
  highlightedKey = null,
  onConfirmAnswer,
  onSelectOptionDirectly,
  onRepeatQuestion,
  onStartListening,
  onStopListening
}: SingleQuestionViewProps) {
  const questionSpeech =
    (question.speech as any)[lang] ||
    (question.title as any)?.[lang] ||
    question.speech.en ||
    question.speech.ta;

  // Helper to get matching icon component with prominent, vivid graphics
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "scissors":
        return <span className="text-4xl sm:text-5xl">✂️</span>;
      case "cow":
        return <span className="text-4xl sm:text-5xl">🐄</span>;
      case "paw":
        return <span className="text-4xl sm:text-5xl">🐐</span>;
      case "cart":
        return <span className="text-4xl sm:text-5xl">🛒</span>;
      case "store":
        return <span className="text-4xl sm:text-5xl">🏪</span>;
      case "home":
        return <span className="text-4xl sm:text-5xl">🏠</span>;
      case "users":
        return <span className="text-4xl sm:text-5xl">👥</span>;
      case "user":
        return <span className="text-4xl sm:text-5xl">🙋‍♀️</span>;
      case "coins":
        return <span className="text-4xl sm:text-5xl">🪙</span>;
      case "banknote":
        return <span className="text-4xl sm:text-5xl">💵</span>;
      case "bank":
        return <span className="text-4xl sm:text-5xl">🏦</span>;
      case "sparkles":
        return <span className="text-4xl sm:text-5xl">✨</span>;
      default:
        return <span className="text-4xl sm:text-5xl">❓</span>;
    }
  };

  const getSpeakButtonText = () => {
    switch (lang) {
      case "ta":
        return "🎙️ பேசி பதிலளிக்க இங்கே தொடவும்";
      case "hi":
        return "🎙️ बोलकर उत्तर देने के लिए यहाँ दबाएँ";
      case "te":
        return "🎙️ మాట్లాడి సమాధానం చెప్పడానికి ఇక్కడ నొక్కండి";
      case "kn":
        return "🎙️ ಮಾತನಾಡಲು ಇಲ್ಲಿ ಸ್ಪರ್ಶಿಸಿ";
      case "ml":
        return "🎙️ സംസാരിക്കാൻ ഇവിടെ അമർത്തുക";
      case "bn":
        return "🎙️ মুখে উত্তর দিতে এখানে চাপুন";
      case "mr":
        return "🎙️ बोलून उत्तर देण्यासाठी येथे दाबा";
      case "gu":
        return "🎙️ બોલીને જવાબ આપવા માટે અહીં ટચ કરો";
      default:
        return "🎙️ Tap Here to Speak Your Answer";
    }
  };

  const isTitleHighlighted = highlightedKey === "title";

  return (
    <div className="flex-1 flex flex-col items-center justify-between max-w-xl w-full mx-auto px-4 py-3 text-center space-y-4 animate-in fade-in duration-300">
      {/* Step Tracker (1 of 3 Personalized Questions) */}
      <div className="w-full flex items-center justify-between text-xs font-black text-emerald-950 px-1">
        <span className="bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300 shadow-2xs">
          {lang === "ta"
            ? `கேள்வி ${questionIndex + 1} / ${totalQuestions}`
            : lang === "hi"
            ? `सवाल ${questionIndex + 1} / ${totalQuestions}`
            : `Question ${questionIndex + 1} of ${totalQuestions}`}
        </span>
        <button
          onClick={onRepeatQuestion}
          className="flex items-center gap-1.5 text-emerald-900 bg-white border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold hover:bg-emerald-50 active:scale-95 shadow-2xs transition-all cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-emerald-700" />
          <span>
            {lang === "ta"
              ? "🔊 மீண்டும் கேள்"
              : lang === "hi"
              ? "🔊 फिर से सुनें"
              : "🔊 Hear Question"}
          </span>
        </button>
      </div>

      {/* The Guide Question with karaoke-style highlighting */}
      <div
        className={`w-full rounded-3xl p-5 border-3 transition-all duration-300 shadow-md ${
          isTitleHighlighted
            ? "bg-yellow-100 border-emerald-600 ring-4 ring-yellow-400 scale-[1.02] shadow-xl"
            : "bg-white border-2 border-emerald-500"
        }`}
      >
        <p className="text-xl sm:text-2xl font-black text-emerald-950 leading-tight">
          &ldquo;{questionSpeech}&rdquo;
        </p>
      </div>

      {/* CONFIRMATION STATE: Guide read back answer and shows Big YES / NO buttons */}
      {isConfirmedPending ? (
        <div className="w-full bg-emerald-50 border-3 border-emerald-400 rounded-3xl p-5 shadow-lg space-y-4 animate-in zoom-in-95">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
              {lang === "ta"
                ? "உங்கள் தேர்வு:"
                : lang === "hi"
                ? "आपका चयन:"
                : "Your Choice:"}
            </span>
            <p className="text-2xl font-black text-emerald-950">
              &ldquo;{pendingAnswerText}&rdquo;
            </p>
            <p className="text-sm font-semibold text-emerald-900 pt-1">
              {lang === "ta"
                ? "இது சரியா? ஆம் அல்லது இல்லை என்று தொடவும்."
                : lang === "hi"
                ? "क्या यह सही है? हाँ या नहीं चुनें।"
                : "Is this correct? Tap Yes or No."}
            </p>
          </div>

          {/* Big YES / NO Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            {/* Big YES Button */}
            <button
              onClick={() => onConfirmAnswer(true)}
              className="py-6 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xl shadow-lg flex flex-col items-center justify-center gap-2 transition-all border-3 border-emerald-400 cursor-pointer"
            >
              <Check className="w-12 h-12 stroke-[3]" />
              <span>
                {lang === "ta" ? "ஆம் (YES)" : lang === "hi" ? "हाँ (YES)" : "YES"}
              </span>
            </button>

            {/* Big NO Button */}
            <button
              onClick={() => onConfirmAnswer(false)}
              className="py-6 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-xl shadow-lg flex flex-col items-center justify-center gap-2 transition-all border-3 border-rose-400 cursor-pointer"
            >
              <X className="w-12 h-12 stroke-[3]" />
              <span>
                {lang === "ta" ? "இல்லை (NO)" : lang === "hi" ? "नहीं (NO)" : "NO"}
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* OPTION AREA: Big Pictorial Cards + Highly Noticeable Speak Button */
        <div className="w-full space-y-4">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider text-center">
            {lang === "ta"
              ? "படத்தைத் தொடவும் அல்லது பேசி பதிலளிக்கவும்:"
              : lang === "hi"
              ? "चित्र पर टच करें या बोलकर बताएं:"
              : "Tap an icon card or speak your answer:"}
          </div>

          {/* Big Pictorial Cards Grid */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {question.options.map((opt, idx) => {
              const label =
                (opt.label as any)[lang] ||
                opt.label.en ||
                (opt.label as any).ta ||
                "";
              const isOptionHighlighted = highlightedKey === `opt-${idx}`;
              const isNoneOption = opt.id === "none_other";

              return (
                <button
                  key={opt.id}
                  onClick={() => onSelectOptionDirectly(opt.id)}
                  className={`border-3 rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col items-center justify-center gap-2.5 active:scale-95 transition-all text-center min-h-[135px] group cursor-pointer ${
                    isOptionHighlighted
                      ? "bg-yellow-100 border-emerald-600 ring-4 ring-yellow-400 scale-[1.04] shadow-2xl z-10"
                      : isNoneOption
                      ? "bg-emerald-50/50 border-emerald-300 hover:border-emerald-500 col-span-2 sm:col-span-2 py-3.5 min-h-[90px]"
                      : "bg-white border-emerald-400 hover:border-emerald-600 hover:bg-emerald-50/60"
                  }`}
                >
                  <div className="transform group-hover:scale-110 transition-transform">
                    {getIcon(opt.icon)}
                  </div>
                  <span
                    className={`leading-tight font-black ${
                      isNoneOption
                        ? "text-xs sm:text-sm text-emerald-800"
                        : "text-sm sm:text-base text-emerald-950"
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* HIGHLY NOTICEABLE SPEAK BUTTON IN THE OPTION AREA */}
          <div className="pt-2 w-full">
            <button
              type="button"
              onClick={isListening ? onStopListening : onStartListening}
              className={`w-full py-4 px-5 rounded-3xl shadow-xl flex items-center justify-center gap-3 transition-all duration-300 active:scale-98 border-3 cursor-pointer ${
                isListening
                  ? "bg-rose-600 border-white text-white animate-pulse ring-4 ring-rose-300"
                  : highlightedKey === "speak"
                  ? "bg-yellow-100 border-emerald-600 ring-4 ring-yellow-400 scale-[1.03]"
                  : "bg-gradient-to-r from-emerald-600 via-teal-600 to-yellow-500 hover:from-emerald-700 hover:to-yellow-600 border-yellow-300 text-white hover:scale-[1.01]"
              }`}
            >
              <div className="p-2 rounded-2xl bg-white/20 backdrop-blur-xs">
                {isListening ? (
                  <MicOff className="w-6 h-6 animate-bounce text-white" />
                ) : (
                  <Mic className="w-6 h-6 text-white animate-pulse" />
                )}
              </div>

              <div className="text-left">
                <div className="text-sm sm:text-base font-black tracking-tight leading-tight">
                  {isListening
                    ? lang === "ta"
                      ? "கேட்கிறது... (நிறுத்த தொடவும்)"
                      : "Listening... (Tap to Stop)"
                    : getSpeakButtonText()}
                </div>
                <div className="text-[11px] font-semibold text-yellow-100">
                  {isListening
                    ? "Speak now clearly into your microphone"
                    : "No typing needed • Just speak in your mother tongue"}
                </div>
              </div>
            </button>

            {/* Interim live speech transcript */}
            {isListening && interimText && (
              <div className="mt-2 bg-yellow-100 border-2 border-yellow-400 rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold text-emerald-950 animate-in fade-in max-w-md mx-auto shadow-sm">
                &ldquo;{interimText}&rdquo;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
