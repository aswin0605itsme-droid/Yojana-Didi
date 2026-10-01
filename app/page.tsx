"use client";

import React, { useState, useRef, useCallback } from "react";
import { QuickExitBar } from "./components/QuickExitBar";
import { VaniFrontPage } from "./components/VaniFrontPage";
import { SingleQuestionView } from "./components/SingleQuestionView";
import { OmnipotentAIView } from "./components/OmnipotentAIView";
import { useVoice } from "./hooks/useVoice";
import { playAudioBeep } from "./lib/audioCue";
import { SUPPORTED_LANGUAGES, detectLanguageFromText } from "./lib/languages";
import {
  THREE_PERSONALIZATION_QUESTIONS,
  matchSchemeFromThreeAnswers
} from "./lib/consultationQuestions";

export default function Home() {
  // Always start on the front page when opening website
  const [stage, setStage] = useState<"front" | "questions" | "result">("front");
  const [lang, setLang] = useState<string>("ta"); // Default to Tamil, all 9 languages supported
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [isReadingPage, setIsReadingPage] = useState(false);
  const [highlightedKey, setHighlightedKey] = useState<string | null>(null);
  const [lastSpokenQuery, setLastSpokenQuery] = useState("");

  // Cancellation ref for sequential text-highlight reading
  const readingActiveRef = useRef(false);

  // Confirmation state
  const [isConfirmedPending, setIsConfirmedPending] = useState(false);
  const [pendingOptionId, setPendingOptionId] = useState<string | null>(null);
  const [pendingAnswerText, setPendingAnswerText] = useState("");

  // Silence timer state
  const [silenceMissCount, setSilenceMissCount] = useState(0);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Matched scheme
  const [selectedScheme, setSelectedScheme] = useState<any>(null);

  const currentQuestion = THREE_PERSONALIZATION_QUESTIONS[currentQuestionIndex];
  const totalQuestions = 3;
  const langConfig = SUPPORTED_LANGUAGES[lang] || SUPPORTED_LANGUAGES["ta"] || SUPPORTED_LANGUAGES["en"];
  const speechLangCode = langConfig.speechLang || "ta-IN";

  // Voice controller hook with Web Audio hardware playback
  const voice = useVoice({
    lang: speechLangCode,
    onSpeechResult: (transcript) => {
      handleUserSpokenAnswer(transcript);
    }
  });

  // Clear silence timer
  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  // Start 6-second silence timer
  const startSilenceTimer = useCallback(() => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      handleSilenceTimeout();
    }, 6000);
  }, [clearSilenceTimer]);

  // Repeat gently on silence
  const handleSilenceTimeout = useCallback(() => {
    if (stage !== "questions" || isConfirmedPending || !currentQuestion) return;

    setSilenceMissCount((prev) => {
      const nextMiss = prev + 1;
      const qSpeech = (currentQuestion.speech as any)[lang] || currentQuestion.speech.en || currentQuestion.speech.ta;

      voice.speak(
        qSpeech,
        () => {
          if (nextMiss < 2 && !voice.isMicDenied) {
            voice.startListening();
            startSilenceTimer();
          }
        },
        speechLangCode
      );

      return nextMiss;
    });
  }, [stage, isConfirmedPending, currentQuestion, lang, voice, speechLangCode, startSilenceTimer]);

  // Sequential text-highlight reader: Highlights each element in real-time as it is spoken
  const readSequence = async (items: { key: string; text: string }[]) => {
    readingActiveRef.current = true;
    setIsReadingPage(true);

    for (const item of items) {
      if (!readingActiveRef.current) break;
      setHighlightedKey(item.key);

      await new Promise<void>((resolve) => {
        voice.speak(item.text, () => resolve(), speechLangCode);
      });
    }

    setHighlightedKey(null);
    setIsReadingPage(false);
    readingActiveRef.current = false;
  };

  // Stop reading and clear highlights
  const stopReadingOutLoud = () => {
    readingActiveRef.current = false;
    voice.stopSpeaking();
    setHighlightedKey(null);
    setIsReadingPage(false);
  };

  // Read Page Out Loud with text highlighting
  const handleReadPageOutLoud = () => {
    voice.unlockAudioContext();

    if (voice.isSpeaking || isReadingPage) {
      stopReadingOutLoud();
      return;
    }

    if (stage === "questions" && currentQuestion) {
      const qTitle =
        (currentQuestion.speech as any)[lang] ||
        (currentQuestion.title as any)[lang] ||
        currentQuestion.speech.en ||
        currentQuestion.speech.ta;

      const items: { key: string; text: string }[] = [
        {
          key: "title",
          text: `${lang === "ta" ? "கேள்வி" : lang === "hi" ? "सवाल" : "Question"} ${
            currentQuestionIndex + 1
          }. ${qTitle}`
        }
      ];

      currentQuestion.options.forEach((opt, idx) => {
        const label =
          (opt.label as any)[lang] || opt.label.en || (opt.label as any).ta || "";
        items.push({
          key: `opt-${idx}`,
          text: label
        });
      });

      items.push({
        key: "speak",
        text:
          lang === "ta"
            ? "அல்லது பேசி பதிலளிக்க மைக்ரோஃபோனைத் தொடவும்."
            : lang === "hi"
            ? "या बोलकर उत्तर देने के लिए माइक दबाएँ।"
            : "Or tap the speak button to say your answer."
      });

      readSequence(items);
    } else if (stage === "result") {
      const greet =
        lang === "ta"
          ? "வாணி ஜெமினி உதவியாளர். அரசு திட்டங்கள், மகளிர் கடன் உதவிகள், அதிகாரப்பூர்வ இணையதளம், அரசு மருத்துவமனை 108 அவசர உதவி, ரயில் டிக்கெட் முன்பதிவு மற்றும் பேருந்து நேரங்களை இங்கே அறிந்து கொள்ளலாம்."
          : lang === "hi"
          ? "वाणी जेमिनी सहायक। सरकारी योजनाएं, आधिकारिक वेबसाइट, अस्पताल, ट्रेन बुकिंग और बस समय यहाँ जान सकते हैं।"
          : "VANI Gemini Assistant. Government schemes, official portals, hospital emergency 108, train ticket booking and bus schedules.";

      const items: { key: string; text: string }[] = [{ key: "omni", text: greet }];

      if (selectedScheme) {
        const sName = (selectedScheme.name as any)?.[lang] || selectedScheme.name?.en || "";
        const sTag = (selectedScheme.tagline as any)?.[lang] || selectedScheme.tagline?.en || "";
        if (sName) {
          items.push({
            key: "scheme",
            text: `${lang === "ta" ? "பரிந்துரைக்கப்பட்ட திட்டம்:" : "Recommended Scheme:"} ${sName}. ${sTag}`
          });
        }
      }

      items.push({
        key: "input",
        text:
          lang === "ta"
            ? "உங்கள் கேள்விகளை கீழே உள்ள மைக்கில் பேசவும் அல்லது கட்டத்தில் தட்டச்சு செய்யவும்."
            : lang === "hi"
            ? "अपने सवाल नीचे दिए माइक में बोलें या बॉक्स में लिखें।"
            : "Speak into the microphone below or type your query in the box."
      });

      readSequence(items);
    }
  };

  // Start 3-Question Consultation from Front Page
  const handleStartConsultation = () => {
    stopReadingOutLoud();
    voice.unlockAudioContext();
    playAudioBeep("chime");
    setStage("questions");
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsConfirmedPending(false);

    const q1 = THREE_PERSONALIZATION_QUESTIONS[0];
    const q1Speech = (q1.speech as any)[lang] || q1.speech.en || q1.speech.ta;

    voice.speak(
      q1Speech,
      () => {
        voice.startListening();
        startSilenceTimer();
      },
      speechLangCode
    );
  };

  // Handle user speech across all stages
  const handleUserSpokenAnswer = (transcript: string) => {
    clearSilenceTimer();

    // If on front page, user speaks -> detect language & start
    if (stage === "front") {
      const detected = detectLanguageFromText(transcript);
      if (detected && detected !== lang) {
        setLang(detected);
      }
      handleStartConsultation();
      return;
    }

    // If on result page (Omnipotent AI), route query directly to AI view
    if (stage === "result") {
      setLastSpokenQuery(transcript);
      return;
    }

    // If confirming Yes / No in questions
    if (isConfirmedPending) {
      const isYes = /\b(yes|yeah|ok|aama|aam|sari|haan|हाँ|ஆம்|சரி|అவுను|ಹೌದು)\b/i.test(transcript);
      const isNo = /\b(no|not|illai|ila|nahi|नहीं|இல்லை|లేదు|ಇಲ್ಲ)\b/i.test(transcript);

      if (isYes) {
        playAudioBeep("chime");
        handleConfirmAnswer(true);
        return;
      }
      if (isNo) {
        handleConfirmAnswer(false);
        return;
      }
    }

    if (!currentQuestion) return;

    // Match spoken answer against current question's options (including none_other)
    const cleanSpeech = transcript.toLowerCase();
    const matchedOption = currentQuestion.options.find(
      (opt) =>
        opt.keywords.some((kw) => cleanSpeech.includes(kw.toLowerCase())) ||
        ((opt.label as any)[lang] || "").toLowerCase().includes(cleanSpeech) ||
        (opt.label.en || "").toLowerCase().includes(cleanSpeech)
    );

    if (matchedOption) {
      playAudioBeep("chime");
      const label =
        (matchedOption.label as any)[lang] || matchedOption.label.en || (matchedOption.label as any).ta;
      setPendingOptionId(matchedOption.id);
      setPendingAnswerText(label);
      setIsConfirmedPending(true);

      const confirmSpeech =
        lang === "ta"
          ? `நீங்கள் ${label} தேர்வு செய்துள்ளீர்கள், இது சரியா?`
          : lang === "hi"
          ? `आपने ${label} चुना है, क्या यह सही है?`
          : `You chose ${label}, is that right?`;

      voice.speak(
        confirmSpeech,
        () => {
          voice.startListening();
        },
        speechLangCode
      );
    } else {
      const retrySpeech =
        lang === "ta"
          ? "தயவுசெய்து உங்கள் பதிலை மீண்டும் கூறவும் அல்லது படத்தைத் தொடவும்."
          : lang === "hi"
          ? "कृपया दोबारा बोलें या चित्र पर टच करें।"
          : "Please say your answer again or tap an icon.";

      voice.speak(
        retrySpeech,
        () => {
          voice.startListening();
          startSilenceTimer();
        },
        speechLangCode
      );
    }
  };

  // Select an option directly via pictorial card tap
  const handleSelectOptionDirectly = (optionId: string) => {
    stopReadingOutLoud();
    clearSilenceTimer();
    playAudioBeep("chime");
    voice.unlockAudioContext();
    if (!currentQuestion) return;

    const opt = currentQuestion.options.find((o) => o.id === optionId);
    const label = opt ? ((opt.label as any)[lang] || opt.label.en || (opt.label as any).ta) : optionId;

    setPendingOptionId(optionId);
    setPendingAnswerText(label);
    setIsConfirmedPending(true);

    const confirmSpeech =
      lang === "ta"
        ? `நீங்கள் ${label} தேர்வு செய்துள்ளீர்கள், இது சரியா?`
        : lang === "hi"
        ? `आपने ${label} चुना है, क्या यह सही है?`
        : `You chose ${label}, is that right?`;

    voice.speak(confirmSpeech, undefined, speechLangCode);
  };

  // Confirm or reject selected option
  const handleConfirmAnswer = (confirmed: boolean) => {
    stopReadingOutLoud();
    clearSilenceTimer();
    voice.unlockAudioContext();

    if (!confirmed) {
      setIsConfirmedPending(false);
      setPendingOptionId(null);
      setPendingAnswerText("");
      if (!currentQuestion) return;
      const qSpeech = (currentQuestion.speech as any)[lang] || currentQuestion.speech.en || currentQuestion.speech.ta;
      voice.speak(
        qSpeech,
        () => {
          voice.startListening();
          startSilenceTimer();
        },
        speechLangCode
      );
      return;
    }

    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: pendingOptionId!
    };
    setAnswers(updatedAnswers);
    setIsConfirmedPending(false);
    setPendingOptionId(null);
    setPendingAnswerText("");
    setSilenceMissCount(0);

    const nextIndex = currentQuestionIndex + 1;

    // Check if next personalization question exists (Question 1, 2, 3)
    if (nextIndex < THREE_PERSONALIZATION_QUESTIONS.length) {
      setCurrentQuestionIndex(nextIndex);
      const nextQ = THREE_PERSONALIZATION_QUESTIONS[nextIndex];
      const nextSpeech = (nextQ.speech as any)[lang] || nextQ.speech.en || nextQ.speech.ta;

      voice.speak(
        nextSpeech,
        () => {
          voice.startListening();
          startSilenceTimer();
        },
        speechLangCode
      );
    } else {
      // Step 4: THE LAST PAGE (Strictly ONLY the Omnipotent AI Assistant)
      playAudioBeep("chime");
      const matched = matchSchemeFromThreeAnswers(updatedAnswers);
      setSelectedScheme(matched);
      setStage("result");
    }
  };

  // Repeat current question
  const handleRepeatQuestion = () => {
    stopReadingOutLoud();
    clearSilenceTimer();
    voice.unlockAudioContext();
    if (!currentQuestion) return;
    const qSpeech = (currentQuestion.speech as any)[lang] || currentQuestion.speech.en || currentQuestion.speech.ta;
    voice.speak(
      qSpeech,
      () => {
        voice.startListening();
        startSilenceTimer();
      },
      speechLangCode
    );
  };

  // Start Over: Resets to Front Page
  const handleStartAgain = () => {
    stopReadingOutLoud();
    clearSilenceTimer();
    voice.unlockAudioContext();
    setAnswers({});
    setSelectedScheme(null);
    setCurrentQuestionIndex(0);
    setIsConfirmedPending(false);
    setSilenceMissCount(0);
    setLastSpokenQuery("");
    setStage("front");
  };

  // Select language from all supported languages
  const handleSelectLang = (newLangCode: string) => {
    stopReadingOutLoud();
    clearSilenceTimer();
    voice.unlockAudioContext();
    setLang(newLangCode);
  };

  // Handle interaction from the language-agnostic front page
  const handleFrontPageInteraction = (detectedLang: string, initialQuery?: string) => {
    stopReadingOutLoud();
    voice.unlockAudioContext();
    setLang(detectedLang);

    if (initialQuery && initialQuery.trim()) {
      setLastSpokenQuery(initialQuery);
      setStage("result");
    } else {
      handleStartConsultation();
    }
  };

  if (stage === "front") {
    return (
      <VaniFrontPage
        onLanguageIdentifiedAndQuery={handleFrontPageInteraction}
        onStartConsultation={handleStartConsultation}
        currentLang={lang}
        onSelectLang={handleSelectLang}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-amber-50/30 to-emerald-100/40 text-emerald-950 flex flex-col font-sans selection:bg-yellow-200">
      {/* Top Navigation Bar: shown on questions and result screens */}
      <QuickExitBar
        lang={lang}
        onSelectLang={handleSelectLang}
        onStartAgain={handleStartAgain}
        onReadPageOutLoud={handleReadPageOutLoud}
        isReadingPage={isReadingPage || voice.isSpeaking}
        isLoadingSpeech={voice.isLoadingSpeech}
        showStartOver={true}
      />

      {/* Main Screen Container */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 flex flex-col justify-between">

        {/* 2. THE 3 PERSONALIZATION QUESTIONS */}
        {stage === "questions" && currentQuestion && (
          <SingleQuestionView
            question={currentQuestion}
            questionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            lang={lang}
            isListening={voice.isListening}
            isSpeaking={voice.isSpeaking}
            interimText={voice.interimText}
            isConfirmedPending={isConfirmedPending}
            pendingAnswerText={pendingAnswerText}
            silenceMissCount={silenceMissCount}
            isMicDenied={voice.isMicDenied}
            highlightedKey={highlightedKey}
            onConfirmAnswer={handleConfirmAnswer}
            onSelectOptionDirectly={handleSelectOptionDirectly}
            onRepeatQuestion={handleRepeatQuestion}
            onStartListening={() => {
              stopReadingOutLoud();
              voice.unlockAudioContext();
              voice.startListening();
              startSilenceTimer();
            }}
            onStopListening={() => {
              clearSilenceTimer();
              voice.stopListening();
            }}
          />
        )}

        {/* 3. THE LAST PAGE: Strictly ONLY the Omnipotent AI Assistant (Image 2) */}
        {stage === "result" && (
          <OmnipotentAIView
            userCondition={{
              work: answers["q1_work"] || "tailoring",
              setup: answers["q2_setup"] || "individual",
              capital: answers["q3_capital"] || "under_50k"
            }}
            scheme={selectedScheme}
            lang={lang}
            isSpeaking={voice.isSpeaking}
            isListening={voice.isListening}
            interimText={voice.interimText}
            lastSpokenQuery={lastSpokenQuery}
            onSpeakText={(text, targetLang) => {
              stopReadingOutLoud();
              voice.unlockAudioContext();
              const sCode = targetLang ? (SUPPORTED_LANGUAGES[targetLang]?.speechLang || speechLangCode) : speechLangCode;
              voice.speak(text, undefined, sCode);
            }}
            onStartListening={() => {
              stopReadingOutLoud();
              voice.unlockAudioContext();
              voice.startListening();
            }}
            onStopListening={() => {
              voice.stopListening();
            }}
          />
        )}

        {/* Footer info: Privacy Notice (Only shown after front page) */}
        <footer className="text-center py-2 text-[10px] text-stone-500 print:hidden">
          Privacy Protected • State lives in memory only • No cookies or accounts
        </footer>
      </main>
    </div>
  );
}
