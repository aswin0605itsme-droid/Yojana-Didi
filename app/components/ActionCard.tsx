"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  MapPin,
  FileText,
  MessageCircle,
  Printer,
  Share2,
  Volume2,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Building2,
  Square
} from "lucide-react";
import { ActionCardDetails } from "../types";
import { LanguageConfig } from "../lib/languages";

interface ActionCardProps {
  details: ActionCardDetails;
  currentLanguage: LanguageConfig;
  onSpeak: (text: string) => void;
  onReset: () => void;
}

export function ActionCard({ details, currentLanguage, onSpeak, onReset }: ActionCardProps) {
  const [checkedDocs, setCheckedDocs] = useState<{ [key: string]: boolean }>({});
  const [hasPracticed, setHasPracticed] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (_) {}
  }, []);

  const toggleDoc = (doc: string) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [doc]: !prev[doc]
    }));
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleWhatsAppShare = () => {
    const text = `*Yojana Didi - ${currentLanguage.ui.actionCardReady}*\n\n` +
      `📋 *${currentLanguage.ui.sarkariSupport}:* ${details.scheme_name || "Sarkari Sahayata"}\n` +
      `📍 *${currentLanguage.ui.whereToGo}:* ${details.where_to_go}\n` +
      `📄 *${currentLanguage.ui.documentsNeeded}:*\n${details.documents_needed.map((d) => `• ${d}`).join("\n")}\n\n` +
      `🗣️ *${currentLanguage.ui.whatToSay}:*\n"${details.what_to_say}"\n\n` +
      `_${currentLanguage.ui.tagline}_`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handlePracticeVoice = () => {
    onSpeak(details.what_to_say);
    setHasPracticed(true);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 my-2 animate-in fade-in duration-500">
      {/* Celebration Header */}
      <div className="text-center space-y-1">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" /> {currentLanguage.ui.actionCardReady}
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-amber-950">
          {details.scheme_name || "Sarkari Sahayata Parchi"}
        </h2>
        <p className="text-xs text-amber-900/80 font-medium">
          {currentLanguage.ui.noCollateral}
        </p>
      </div>

      {/* Official-looking Printable Card */}
      <div
        id="action-card-print"
        className="relative bg-gradient-to-b from-amber-50/70 via-white to-orange-50/50 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5 print:border-black print:shadow-none"
      >
        {/* Card Header & Stamp */}
        <div className="flex items-start justify-between border-b border-amber-200/80 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-sm border border-amber-200">
              {currentLanguage.ui.sarkariSupport}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-amber-950 flex items-center gap-2">
              {details.scheme_name || "Pradhan Mantri Sahayata Yojana"}
            </h3>
            <p className="text-xs font-medium text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {currentLanguage.ui.noCollateral}
            </p>
          </div>

          {/* Seal / Badge graphic */}
          <div className="shrink-0 w-12 h-12 rounded-full border-2 border-dashed border-amber-500/60 bg-amber-100/50 flex flex-col items-center justify-center text-amber-800">
            <Building2 className="w-5 h-5" />
            <span className="text-[8px] font-bold uppercase mt-0.5">Sarkari</span>
          </div>
        </div>

        {/* 1. Kahan Jana Hai (Where to go) */}
        <div className="bg-amber-100/40 border border-amber-200/80 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
            <div className="p-1.5 bg-amber-500 text-white rounded-lg shadow-2xs">
              <MapPin className="w-4 h-4" />
            </div>
            <span>{currentLanguage.ui.whereToGo}</span>
          </div>
          <p className="text-sm font-semibold text-amber-900 pl-7 leading-relaxed">
            {details.where_to_go || "Nearest SBI ya Gramin Bank Branch"}
          </p>
          <p className="text-xs text-amber-800/80 pl-7">
            💡 <em>{currentLanguage.ui.whereToGoTip}</em>
          </p>
        </div>

        {/* 2. Documents Checklist */}
        <div className="bg-orange-50/50 border border-orange-200/80 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
              <div className="p-1.5 bg-orange-500 text-white rounded-lg shadow-2xs">
                <FileText className="w-4 h-4" />
              </div>
              <span>{currentLanguage.ui.documentsNeeded}</span>
            </div>
            <span className="text-[11px] text-amber-800 font-medium">
              {currentLanguage.ui.documentsTip}
            </span>
          </div>

          <div className="space-y-2 pl-1">
            {details.documents_needed && details.documents_needed.length > 0 ? (
              details.documents_needed.map((doc, idx) => {
                const isChecked = !!checkedDocs[doc];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleDoc(doc)}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs sm:text-sm font-medium transition-all ${
                      isChecked
                        ? "bg-emerald-100/70 text-emerald-950 border border-emerald-300 line-through opacity-80"
                        : "bg-white text-stone-800 border border-amber-200/80 hover:bg-amber-50"
                    }`}
                  >
                    {isChecked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <span>{doc}</span>
                  </button>
                );
              })
            ) : (
              <p className="text-xs text-amber-800">Aadhaar Card, Bank Passbook, aur 2 Passport Photos.</p>
            )}
          </div>
        </div>

        {/* 3. Golden Script (What to say) & Rehearsal */}
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border-2 border-amber-300 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
              <div className="p-1.5 bg-rose-500 text-white rounded-lg shadow-2xs">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span>{currentLanguage.ui.whatToSay}</span>
            </div>
          </div>

          <div className="bg-white/90 border border-amber-200 rounded-xl p-3.5 shadow-2xs">
            <p className="text-sm sm:text-base font-bold text-amber-950 leading-relaxed italic">
              &ldquo;{details.what_to_say || "Namaste Sahab, mujhe yojana ka form lene aana tha."}&rdquo;
            </p>
          </div>

          {/* Voice rehearsal button */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            <button
              onClick={handlePracticeVoice}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white shadow-md active:scale-98 transition-all"
            >
              <Volume2 className="w-4 h-4" />
              <span>{currentLanguage.ui.listenRehearsal}</span>
            </button>
            {hasPracticed && (
              <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {currentLanguage.ui.practicedBadge}
              </span>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center pt-1 text-[11px] text-amber-800/70 border-t border-amber-200/50">
          {currentLanguage.ui.tagline}
        </div>
      </div>

      {/* Card Actions (Print / WhatsApp / Restart) */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-white text-amber-950 border border-amber-300 hover:bg-amber-50 shadow-sm transition-all"
        >
          <Printer className="w-4 h-4 text-amber-700" />
          <span>{currentLanguage.ui.printButton}</span>
        </button>

        <button
          onClick={handleWhatsAppShare}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
        >
          <Share2 className="w-4 h-4" />
          <span>{currentLanguage.ui.whatsappButton}</span>
        </button>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 shadow-sm transition-all"
        >
          <RotateCcw className="w-4 h-4 text-amber-800" />
          <span>{currentLanguage.ui.newConsultation}</span>
        </button>
      </div>
    </div>
  );
}
