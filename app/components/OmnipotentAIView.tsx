"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  MapPin,
  Globe,
  FileText,
  Navigation,
  ExternalLink,
  Volume2,
  Mic,
  MicOff,
  Send,
  Loader2,
  CheckCircle2,
  PhoneCall,
  Train,
  Bus,
  Activity,
  Calendar,
  AlertCircle
} from "lucide-react";
import { parseOmniIntent, OmniQueryResult } from "../lib/omniHandler";
import { detectLanguageFromText } from "../lib/languages";
import { playAudioBeep } from "../lib/audioCue";

interface UserCondition {
  work: string;
  setup: string;
  capital: string;
}

interface OmnipotentAIViewProps {
  userCondition: UserCondition;
  scheme: any;
  lang: string;
  isSpeaking: boolean;
  isListening?: boolean;
  interimText?: string;
  lastSpokenQuery?: string;
  onSpeakText: (text: string) => void;
  onStartListening?: () => void;
  onStopListening?: () => void;
}

export function OmnipotentAIView({
  userCondition,
  scheme,
  lang,
  isSpeaking,
  isListening = false,
  interimText = "",
  lastSpokenQuery = "",
  onSpeakText,
  onStartListening,
  onStopListening
}: OmnipotentAIViewProps) {
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const hasSpokenWelcomeRef = useRef(false);

  const [aiResponse, setAiResponse] = useState<OmniQueryResult & {
    documents?: string[];
    isSchemeDetail?: boolean;
    schemeDetails?: {
      name: string;
      tagline: string;
      steps: { title: string; detail: string }[];
    };
  } | null>(null);

  const schemeName = (scheme?.name as any)?.[lang] || scheme?.name?.en || "Government Scheme";
  const schemeTagline = (scheme?.tagline as any)?.[lang] || scheme?.tagline?.en || "";

  // Proactive greeting upon arriving at the Omnipotent AI page
  useEffect(() => {
    if (!hasSpokenWelcomeRef.current) {
      hasSpokenWelcomeRef.current = true;
      const initialGreeting =
        lang === "ta"
          ? `வணக்கம் சகோதரி! அரசு திட்டங்கள், இணையதள முகவரி, அரசு மருத்துவமனை, ரயில் புக்கிங், பேருந்து நேரம் அல்லது ஏதேனும் சந்தேகங்களை கேட்கலாம்.`
          : lang === "hi"
          ? `नमस्ते बहन! सरकारी योजनाएं, वेबसाइट लिंक, अस्पताल, ट्रेन बुकिंग, बस समय या कोई भी सवाल मुझसे पूछ सकते हैं।`
          : `Hello sister! Ask me about government schemes, official website links, hospitals, train booking, bus timings, or any doubts.`;

      setAiResponse({
        type: "general",
        title: lang === "ta" ? "வாணி வழிகாட்டி" : "VANI Guide",
        spokenText: initialGreeting
      });

      onSpeakText(initialGreeting);
    }
  }, [lang, schemeName, schemeTagline, scheme, onSpeakText]);

  // React to speech input recognized by useVoice
  const lastProcessedSpeechRef = useRef("");
  useEffect(() => {
    if (lastSpokenQuery && lastSpokenQuery.trim() && lastSpokenQuery !== lastProcessedSpeechRef.current) {
      lastProcessedSpeechRef.current = lastSpokenQuery;
      handleQuery(lastSpokenQuery);
    }
  }, [lastSpokenQuery]);

  // Handle any user query (typed, chip-tapped, or spoken)
  const handleQuery = async (query: string) => {
    if (!query.trim()) return;
    playAudioBeep("chime");
    setIsProcessing(true);

    const userLang = detectLanguageFromText(query) || lang;
    const clean = query.toLowerCase();

    // 1. Check for Required Documents request
    if (
      clean.includes("ஆவணங்கள்") ||
      clean.includes("document") ||
      clean.includes("documents") ||
      clean.includes("दस्तावेज")
    ) {
      const respText =
        lang === "ta"
          ? "விண்ணப்பிக்க தேவையான முக்கிய ஆவணங்கள்: 1. ஆதார் அட்டை, 2. வங்கி கணக்கு பாஸ்புக், 3. இரண்டு பாஸ்போர்ட் அளவிலான புகைப்படங்கள்."
          : lang === "hi"
          ? "आवश्यक दस्तावेज: 1. आधार कार्ड, 2. बैंक पासबुक, 3. दो पासपोर्ट साइज फोटो।"
          : "Main documents required: 1. Aadhaar Card, 2. Bank Passbook, 3. Two passport size photographs.";

      setAiResponse({
        type: "general",
        title: lang === "ta" ? "தேவையான ஆவணங்கள்" : "Required Documents",
        spokenText: respText,
        documents: [
          lang === "ta" ? "ஆதார் அட்டை (Aadhaar Card)" : "Aadhaar Card",
          lang === "ta" ? "வங்கி கணக்கு பாஸ்புக் (Bank Passbook)" : "Bank Passbook",
          lang === "ta" ? "2 பாஸ்போர்ட் புகைப்படங்கள் (2 Passport Photos)" : "2 Passport Photos",
          lang === "ta" ? "வருமானச் சான்றிதழ் / ரேஷன் கார்டு" : "Ration Card / Income Certificate"
        ]
      });
      setIsProcessing(false);
      onSpeakText(respText);
      return;
    }

    // 2. Check for Scheme Details / Benefits request
    if (
      clean.includes("scheme") ||
      clean.includes("திட்டம்") ||
      clean.includes("plan") ||
      clean.includes("யோஜனா") ||
      clean.includes("பலன்") ||
      clean.includes("benefit")
    ) {
      const respText =
        lang === "ta"
          ? `உங்கள் நிலைக்கு ஏற்ற சிறந்த திட்டம்: ${schemeName}. ${schemeTagline}. விவரங்கள் கீழே கொடுக்கப்பட்டுள்ளன.`
          : `The best scheme for your condition is: ${schemeName}. ${schemeTagline}. Details are shown below.`;

      setAiResponse({
        type: "website",
        title: schemeName,
        spokenText: respText,
        isSchemeDetail: true,
        schemeDetails: {
          name: schemeName,
          tagline: schemeTagline,
          steps: scheme?.steps?.map((s: any) => ({
            title: (s.title as any)?.[lang] || s.title?.en || "",
            detail: (s.detail as any)?.[lang] || s.detail?.en || ""
          })) || []
        },
        websiteUrl: scheme?.official_website || "https://www.mudra.org.in/",
        websiteLabel: schemeName
      });
      setIsProcessing(false);
      onSpeakText(respText);
      return;
    }

    // 3. Fast Omnipresent Multi-Intent Check (Hospitals, Trains, Buses, Websites, Locations)
    const omni = parseOmniIntent(query, userLang);
    if (
      omni.type === "hospital" ||
      omni.type === "train" ||
      omni.type === "bus" ||
      omni.type === "website" ||
      omni.type === "location"
    ) {
      setAiResponse(omni);
      setIsProcessing(false);
      onSpeakText(omni.spokenText);
      return;
    }

    // 4. Call Live Gemini API with full condition context
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `${query} [User condition context: work=${userCondition.work}, setup=${userCondition.setup}, capital=${userCondition.capital}, recommendedScheme=${schemeName}]`,
          language: userLang,
          turnCount: 4
        })
      });

      if (res.ok) {
        const data = await res.json();
        const spoken = data.spoken_response || data.text || (lang === "ta" ? "விவரங்கள் கீழே கொடுக்கப்பட்டுள்ளன." : "Details are provided below.");
        const respObj: any = {
          type: "general",
          title: lang === "ta" ? "வாணி தகவல்" : "VANI Assistance",
          spokenText: spoken
        };
        if (data.map_query) respObj.mapQuery = data.map_query;
        if (data.website_url) {
          respObj.websiteUrl = data.website_url;
          respObj.websiteLabel = data.website_label || "Official Government Portal";
        }
        setAiResponse(respObj);
        onSpeakText(spoken);
      } else {
        const fallback =
          lang === "ta"
            ? "நீங்கள் அருகில் உள்ள அரசு வங்கி, பொது சேவை மையம் அல்லது அரசு அலுவலகத்தில் நேரில் விண்ணப்பிக்கலாம்."
            : "You can apply directly at the nearest government bank, service center, or office.";
        setAiResponse({ type: "general", title: "Information", spokenText: fallback });
        onSpeakText(fallback);
      }
    } catch (_) {
      const fallback =
        lang === "ta"
          ? "உங்கள் கேள்விக்கு அருகில் உள்ள அரசு அலுவலகம் அல்லது சேவை மையத்தை அணுகலாம்."
          : "Please visit the nearest government office or service center for assistance.";
      setAiResponse({ type: "general", title: "Information", spokenText: fallback });
      onSpeakText(fallback);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const q = inputText.trim();
    setInputText("");
    handleQuery(q);
  };

  return (
    <div className="flex-1 flex flex-col justify-between max-w-xl w-full mx-auto px-2 sm:px-4 py-2 animate-in fade-in duration-500">
      {/* MAIN OMNIPOTENT AI CARD */}
      <div className="w-full bg-emerald-50/40 sm:bg-white border-2 border-emerald-400 rounded-3xl p-4 sm:p-5 shadow-lg space-y-3.5">
        {/* CARD HEADER: Emerald icon + Title + Subtitle + Description */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-yellow-500 flex items-center justify-center text-white shadow-md shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse text-yellow-200" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 leading-tight">
              {lang === "ta"
                ? "வாணி ஜெமினி உதவியாளர்"
                : lang === "hi"
                ? "वाणी जेमिनी सहायक"
                : "VANI Gemini Assistant"}
            </h2>
            <div className="text-sm font-black text-emerald-800 mt-0.5">
              (Omnipresent AI)
            </div>
            <p className="text-xs font-semibold text-stone-600 mt-1 leading-snug">
              {lang === "ta"
                ? "திட்டம், இணையதளம், மருத்துவமனை, ரயில், பேருந்து நேரம், இடங்கள் கேளுங்கள்"
                : lang === "hi"
                ? "योजनाएं, वेबसाइट, अस्पताल, ट्रेन बुकिंग, बस समय या कोई भी सवाल पूछें"
                : "Ask schemes, portals, hospitals, train booking, bus timings, locations"}
            </p>
          </div>
        </div>

        {/* 5 COMPREHENSIVE QUICK ACTION PILLS */}
        <div className="flex flex-wrap gap-2 pt-1">
          {/* 1. Government Hospital & 108 Emergency */}
          <button
            type="button"
            onClick={() => handleQuery("அரசு மருத்துவமனை மற்றும் 108 அவசர உதவி")}
            className="px-3 py-1.5 rounded-full text-[11px] font-black bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-950 active:scale-95 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>
              {lang === "ta"
                ? "மருத்துவமனை & 108"
                : lang === "hi"
                ? "अस्पताल और 108"
                : "Hospital & 108"}
            </span>
          </button>

          {/* 2. Train Booking & Railway Station */}
          <button
            type="button"
            onClick={() => handleQuery("ரயில் புக்கிங் மற்றும் ரயில்வே ஸ்டேஷன்")}
            className="px-3 py-1.5 rounded-full text-[11px] font-black bg-emerald-50 hover:bg-emerald-100 border border-emerald-400 text-emerald-950 active:scale-95 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Train className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>
              {lang === "ta"
                ? "ரயில் புக்கிங் & ஸ்டேஷன்"
                : lang === "hi"
                ? "ट्रेन टिकट और स्टेशन"
                : "Train Booking & Station"}
            </span>
          </button>

          {/* 3. Bus Stops & Timings */}
          <button
            type="button"
            onClick={() => handleQuery("அரசு பேருந்து நிலையம் மற்றும் பேருந்து நேரம்")}
            className="px-3 py-1.5 rounded-full text-[11px] font-black bg-teal-50 hover:bg-teal-100 border border-teal-300 text-teal-950 active:scale-95 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Bus className="w-3.5 h-3.5 text-teal-700 shrink-0" />
            <span>
              {lang === "ta"
                ? "பேருந்து நிலையம் & நேரம்"
                : lang === "hi"
                ? "बस स्टैंड और समय"
                : "Bus Stand & Timings"}
            </span>
          </button>

          {/* 4. Nearest Bank & Locations */}
          <button
            type="button"
            onClick={() => handleQuery("அருகிலுள்ள அரசு வங்கி எங்கே?")}
            className="px-3 py-1.5 rounded-full text-[11px] font-black bg-yellow-50 hover:bg-yellow-100 border border-yellow-400 text-emerald-950 active:scale-95 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-yellow-700 shrink-0" />
            <span>
              {lang === "ta"
                ? "அருகிலுள்ள அரசு வங்கி"
                : lang === "hi"
                ? "नजदीकी बैंक"
                : "Nearest Bank"}
            </span>
          </button>

          {/* 5. Official Website Portal */}
          <button
            type="button"
            onClick={() => handleQuery("அதிகாரப்பூர்வ அரசு இணையதள முகவரி")}
            className="px-3 py-1.5 rounded-full text-[11px] font-black bg-white hover:bg-emerald-50 border border-emerald-400 text-emerald-950 active:scale-95 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>
              {lang === "ta"
                ? "அதிகாரப்பூர்வ தளம்"
                : lang === "hi"
                ? "सरकारी वेबसाइट"
                : "Official Portal"}
            </span>
          </button>
        </div>

        {/* INTERACTIVE RESPONSE BUBBLE & RICH MULTI-INTENT CARDS */}
        {aiResponse && (
          <div className="w-full bg-white border border-emerald-200 rounded-2xl p-4 shadow-sm space-y-3 animate-in fade-in zoom-in-98">
            {/* Spoken Text Bubble */}
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm sm:text-base font-bold text-emerald-950 leading-relaxed flex-1">
                &ldquo;{aiResponse.spokenText}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => onSpeakText(aiResponse.spokenText)}
                className="p-2 rounded-full hover:bg-emerald-50 text-emerald-700 shrink-0 transition-all active:scale-90 cursor-pointer"
                title="Hear again / மீண்டும் கேள்"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* A. HOSPITAL & EMERGENCY HOTLINE CARD */}
            {aiResponse.type === "hospital" && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50 border-2 border-rose-300 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-rose-600 animate-pulse" />
                    <span className="text-xs font-black text-rose-950 uppercase tracking-wide">
                      {lang === "ta" ? "அரசு மருத்துவ அவசர உதவி" : "Government Medical Emergency"}
                    </span>
                  </div>
                  {aiResponse.phoneHotline && (
                    <a
                      href={`tel:${aiResponse.phoneHotline}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-xs active:scale-95 transition-all"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{lang === "ta" ? "108 அழைக்க" : "Call 108"}</span>
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-stone-800">
                  <div className="p-2 rounded-xl bg-white border border-rose-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{lang === "ta" ? "24 மணி நேர இலவச அவசர சிகிச்சை" : "24/7 Free Emergency Treatment"}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-rose-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{lang === "ta" ? "ஆயுஷ்மான் பாரத் இலவச மருத்துவ அட்டை" : "Ayushman Bharat Card Accepted"}</span>
                  </div>
                </div>

                {aiResponse.websiteUrl && (
                  <a
                    href={aiResponse.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white hover:bg-rose-50 border border-rose-300 text-rose-900 font-bold text-xs transition-all shadow-2xs"
                  >
                    <span>{aiResponse.websiteLabel || "Ayushman Bharat National Health Portal"}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-rose-600" />
                  </a>
                )}
              </div>
            )}

            {/* B. TRAIN BOOKING & RAILWAY HELPLINE CARD */}
            {aiResponse.type === "train" && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 border-2 border-sky-300 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Train className="w-5 h-5 text-sky-600" />
                    <span className="text-xs font-black text-sky-950 uppercase tracking-wide">
                      {lang === "ta" ? "அதிகாரப்பூர்வ ரயில்வே சேவை" : "Official Railway Service"}
                    </span>
                  </div>
                  {aiResponse.phoneHotline && (
                    <a
                      href={`tel:${aiResponse.phoneHotline}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black shadow-xs active:scale-95 transition-all"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{lang === "ta" ? "139 அழைக்க" : "Call 139"}</span>
                    </a>
                  )}
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-sky-200 text-xs text-stone-800 space-y-1">
                  <div className="font-black text-sky-950">
                    {lang === "ta" ? "டிக்கெட் முன்பதிவு & PNR விசாரணை:" : "Ticket Booking & PNR Inquiry:"}
                  </div>
                  <div className="text-[11px] text-stone-600">
                    {lang === "ta"
                      ? "IRCTC தளத்தில் அரசு அனுமதியுடன் குறைந்த கட்டணத்தில் ரயில் டிக்கெட் புக் செய்யலாம்."
                      : "Book confirmed railway tickets directly on IRCTC with zero agent commission."}
                  </div>
                </div>

                {aiResponse.websiteUrl && (
                  <a
                    href={aiResponse.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-xs active:scale-98 transition-all"
                  >
                    <span>{lang === "ta" ? "IRCTC-ல் டிக்கெட் புக் செய்ய" : "Book Tickets on IRCTC Portal"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            {/* C. BUS STAND & TIMINGS CARD */}
            {aiResponse.type === "bus" && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 space-y-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <Bus className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                    {lang === "ta" ? "அரசு பேருந்து சேவை & நேரம்" : "Government Bus Transit & Timings"}
                  </span>
                </div>

                {aiResponse.timingInfo && (
                  <div className="p-2.5 rounded-xl bg-white border border-emerald-200 text-xs font-bold text-emerald-950 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{aiResponse.timingInfo}</span>
                  </div>
                )}

                {aiResponse.websiteUrl && (
                  <a
                    href={aiResponse.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs shadow-xs active:scale-98 transition-all"
                  >
                    <span>{lang === "ta" ? "அரசு பேருந்து முன்பதிவு தளம்" : "State Bus Reservation Portal"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            {/* D. OFFICIAL GOVERNMENT WEBSITE PORTAL CARD */}
            {aiResponse.websiteUrl && aiResponse.type !== "hospital" && aiResponse.type !== "train" && aiResponse.type !== "bus" && (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-yellow-50 border border-emerald-400 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Globe className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] font-black uppercase tracking-wider text-emerald-950">
                      Official Government Portal
                    </div>
                    <div className="text-xs font-semibold text-stone-600 truncate max-w-[200px] sm:max-w-xs">
                      {aiResponse.websiteUrl}
                    </div>
                  </div>
                </div>
                <a
                  href={aiResponse.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs shadow-xs active:scale-95 transition-all shrink-0 flex items-center gap-1.5"
                >
                  <span>{lang === "ta" ? "நேரடியாக செல்லவும்" : "Open Portal"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* E. REQUIRED DOCUMENTS CHECKLIST */}
            {aiResponse.documents && (
              <div className="space-y-1.5 pt-2 border-t border-emerald-100">
                <div className="text-xs font-black text-emerald-900 uppercase tracking-wider">
                  {lang === "ta" ? "ஆவணங்களின் பட்டியல்:" : "List of Documents:"}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {aiResponse.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-300 text-xs font-bold text-emerald-950 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* F. SCHEME DETAILS & STEPS */}
            {aiResponse.isSchemeDetail && aiResponse.schemeDetails && (
              <div className="space-y-2 pt-2 border-t border-emerald-100">
                <div className="text-xs font-black text-emerald-900">
                  {aiResponse.schemeDetails.name} — {aiResponse.schemeDetails.tagline}
                </div>
                {aiResponse.schemeDetails.steps.map((st, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-emerald-50/50 border border-emerald-200 text-xs text-emerald-950"
                  >
                    <span className="font-black text-emerald-800">{i + 1}. {st.title}: </span>
                    {st.detail}
                  </div>
                ))}
              </div>
            )}

            {/* G. LIVE GOOGLE MAPS EMBED FOR ANY LOCATION QUERY */}
            {aiResponse.mapQuery && (
              <div className="space-y-2 pt-1">
                <div className="w-full h-44 rounded-xl overflow-hidden border border-emerald-400 shadow-inner bg-emerald-50/20">
                  <iframe
                    title="Live Location Map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      aiResponse.mapQuery
                    )}&output=embed`}
                  />
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    aiResponse.mapQuery
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-yellow-600 hover:opacity-95 text-white font-bold text-xs shadow-xs active:scale-98 transition-all"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>
                    {lang === "ta"
                      ? `கூகிள் மேப்பில் வழியைப் பார்க்க: ${aiResponse.mapQuery}`
                      : `Open in Google Maps: ${aiResponse.mapQuery}`}
                  </span>
                </a>
              </div>
            )}
          </div>
        )}

        {/* BOTTOM INPUT BAR: MIC & OUTLINED TEXT BOX */}
        <div className="pt-2 flex items-center gap-2.5">
          {/* Rounded Emerald & Gold Mic Button */}
          {onStartListening && (
            <button
              type="button"
              onClick={isListening ? onStopListening : onStartListening}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-95 shadow-md shrink-0 cursor-pointer ${
                isListening
                  ? "bg-rose-600 text-white animate-pulse ring-4 ring-rose-300"
                  : "bg-gradient-to-tr from-emerald-600 via-teal-600 to-yellow-500 text-white hover:opacity-95 border-2 border-yellow-300"
              }`}
              title={isListening ? "Listening..." : "Tap to Speak"}
            >
              {isListening ? (
                <MicOff className="w-6 h-6 animate-bounce" />
              ) : (
                <Mic className="w-6 h-6 text-white" />
              )}
            </button>
          )}

          {/* Pill-shaped Text Input Box with Send Button */}
          <form onSubmit={handleFormSubmit} className="flex-1 relative flex items-center min-w-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                lang === "ta"
                  ? "திட்டம், மருத்துவமனை, ரயில், பேருந்து நேரம் கேளுங்கள்..."
                  : lang === "hi"
                  ? "योजना, अस्पताल, ट्रेन, बस समय या सवाल पूछें..."
                  : "Ask schemes, hospital, train, bus timings, doubts..."
              }
              className="w-full py-3 sm:py-3.5 pl-4 sm:pl-5 pr-12 text-xs sm:text-sm text-emerald-950 placeholder:text-stone-400 bg-white border-2 border-emerald-400 focus:border-emerald-600 focus:ring-2 focus:ring-yellow-400 rounded-full focus:outline-hidden font-medium shadow-2xs"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isProcessing}
              className="absolute right-1.5 p-2 rounded-full bg-gradient-to-tr from-emerald-600 to-yellow-500 hover:from-emerald-700 hover:to-yellow-600 text-white disabled:opacity-30 transition-all cursor-pointer shadow-xs"
              aria-label="Send"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </button>
          </form>
        </div>

        {/* Live Speech Feedback Bar */}
        {isListening && interimText && (
          <div className="text-xs font-bold text-emerald-950 bg-yellow-100 border border-yellow-400 rounded-xl px-3 py-1.5 text-center animate-in fade-in">
            &ldquo;{interimText}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
}
