"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseVoiceOptions {
  onSpeechResult?: (transcript: string) => void;
  lang?: string;
}

export function useVoice({ onSpeechResult, lang = "en-IN" }: UseVoiceOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingSpeech, setIsLoadingSpeech] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const [isMicDenied, setIsMicDenied] = useState(false);
  const [interimText, setInterimText] = useState("");

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioCacheRef = useRef<Map<string, string>>(new Map());
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Synchronously unlock and wake up the browser's audio hardware
  const unlockAudioContext = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current && AudioCtx) {
        audioContextRef.current = new AudioCtx();
      }
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }
    } catch (_) {}
  }, []);

  // Initialize SpeechSynthesis and SpeechRecognition + Global User Gesture Listener
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;

      // Load available voices
      const loadVoices = () => {
        if (window.speechSynthesis) {
          const v = window.speechSynthesis.getVoices();
          if (v && v.length > 0) {
            voicesRef.current = v;
          }
        }
      };

      loadVoices();
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }

      // Automatically unlock audio hardware on ANY user click, touch, or tap
      const handleUserGesture = () => {
        unlockAudioContext();
      };

      window.addEventListener("click", handleUserGesture, { passive: true });
      window.addEventListener("touchstart", handleUserGesture, { passive: true });
      window.addEventListener("keydown", handleUserGesture, { passive: true });

      // Initialize Web Speech Recognition
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setRecognitionSupported(false);
      } else {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = lang;

        recognition.onstart = () => {
          setIsListening(true);
          setInterimText("");
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          setInterimText(currentTranscript);

          if (event.results[0].isFinal) {
            setIsListening(false);
            if (onSpeechResult) {
              onSpeechResult(currentTranscript);
            }
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("[Voice] Recognition error:", event.error);
          setIsListening(false);
          if (event.error === "not-allowed" || event.error === "permission-denied") {
            setIsMicDenied(true);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }

      if (!window.speechSynthesis) {
        setSpeechSupported(false);
      }

      return () => {
        window.removeEventListener("click", handleUserGesture);
        window.removeEventListener("touchstart", handleUserGesture);
        window.removeEventListener("keydown", handleUserGesture);

        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort();
          } catch (_) {}
        }
        if (activeSourceNodeRef.current) {
          try {
            activeSourceNodeRef.current.stop();
          } catch (_) {}
        }
        if (currentAudioRef.current) {
          try {
            currentAudioRef.current.pause();
          } catch (_) {}
        }
        if (synthRef.current) {
          try {
            synthRef.current.cancel();
          } catch (_) {}
        }
      };
    }
  }, [lang, onSpeechResult, unlockAudioContext]);

  // Update recognition language when lang prop changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang;
    }
  }, [lang]);

  // Stop any active audio playback
  const stopSpeaking = useCallback(() => {
    if (activeSourceNodeRef.current) {
      try {
        activeSourceNodeRef.current.stop();
        activeSourceNodeRef.current = null;
      } catch (_) {}
    }
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
        currentAudioRef.current = null;
      } catch (_) {}
    }
    if (synthRef.current) {
      try {
        synthRef.current.cancel();
      } catch (_) {}
    }
    activeUtteranceRef.current = null;
    setIsSpeaking(false);
    setIsLoadingSpeech(false);
  }, []);

  // Web Audio Hardware Audio Player (100% immune to browser autoplay policy blocks)
  const playAudioHardware = useCallback(
    async (audioDataUrl: string, onEnd?: () => void) => {
      stopSpeaking();
      setIsSpeaking(true);
      setIsLoadingSpeech(false);

      try {
        unlockAudioContext();
        const ctx = audioContextRef.current;

        // Decode base64 to binary buffer
        const base64 = audioDataUrl.includes(",") ? audioDataUrl.split(",")[1] : audioDataUrl;
        const binary = window.atob(base64);
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binary.charCodeAt(i);
        }

        if (ctx) {
          if (ctx.state === "suspended") {
            await ctx.resume();
          }

          // Hardware native decoding for MP3 and WAV
          const audioBuffer = await ctx.decodeAudioData(bytes.buffer.slice(0));
          const source = ctx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(ctx.destination);
          activeSourceNodeRef.current = source;

          source.onended = () => {
            setIsSpeaking(false);
            setIsLoadingSpeech(false);
            activeSourceNodeRef.current = null;
            if (onEnd) onEnd();
          };

          source.start(0);
          return;
        }
      } catch (err) {
        console.warn("[Voice] Web Audio decode failed, falling back to HTML5 Audio:", err);
      }

      // Secondary fallback: HTML5 Audio element
      try {
        const audio = new Audio(audioDataUrl);
        currentAudioRef.current = audio;
        audio.onended = () => {
          setIsSpeaking(false);
          setIsLoadingSpeech(false);
          currentAudioRef.current = null;
          if (onEnd) onEnd();
        };
        audio.onerror = () => {
          setIsSpeaking(false);
          setIsLoadingSpeech(false);
          currentAudioRef.current = null;
          if (onEnd) onEnd();
        };
        await audio.play();
      } catch (_) {
        setIsSpeaking(false);
        setIsLoadingSpeech(false);
        if (onEnd) onEnd();
      }
    },
    [stopSpeaking, unlockAudioContext]
  );

  // Web Speech fallback for offline
  const speakWithWebSpeech = useCallback(
    (cleanText: string, onEnd?: () => void, targetLang?: string) => {
      if (!synthRef.current) {
        setIsSpeaking(false);
        if (onEnd) onEnd();
        return;
      }

      try {
        synthRef.current.cancel();
        if (synthRef.current.paused) {
          synthRef.current.resume();
        }

        const utterance = new SpeechSynthesisUtterance(cleanText);
        activeUtteranceRef.current = utterance;

        const chosenLang = targetLang || lang || "ta-IN";
        const langPrefix = chosenLang.split("-")[0].toLowerCase();
        const availableVoices =
          voicesRef.current.length > 0 ? voicesRef.current : synthRef.current.getVoices();

        const langKeywords: Record<string, string[]> = {
          ta: ["tamil", "ta-in", "ta_in", "ta"],
          hi: ["hindi", "hi-in", "hi_in", "hi"],
          te: ["telugu", "te-in", "te_in", "te"],
          kn: ["kannada", "kn-in", "kn_in", "kn"],
          ml: ["malayalam", "ml-in", "ml_in", "ml"],
          bn: ["bengali", "bangla", "bn-in", "bn"],
          mr: ["marathi", "mr-in", "mr"],
          gu: ["gujarati", "gu-in", "gu"],
          en: ["en-in", "india", "en-us", "en-gb"]
        };

        const targetKeywords = langKeywords[langPrefix] || [langPrefix];
        let matchedVoice = availableVoices.find((v) => {
          const vLang = v.lang.toLowerCase();
          const vName = v.name.toLowerCase();
          return targetKeywords.some((kw) => vLang.includes(kw) || vName.includes(kw));
        });

        if (!matchedVoice) {
          matchedVoice = availableVoices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));
        }

        if (!matchedVoice) {
          matchedVoice =
            availableVoices.find(
              (v) =>
                v.lang.toLowerCase().includes("in") ||
                v.name.toLowerCase().includes("india") ||
                v.lang.toLowerCase().startsWith("en")
            ) || availableVoices[0];
        }

        if (matchedVoice) {
          utterance.voice = matchedVoice;
          utterance.lang = matchedVoice.lang || "ta-IN";
        }

        utterance.pitch = 1.05;
        utterance.rate = 0.95;

        utterance.onstart = () => {
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          activeUtteranceRef.current = null;
          if (onEnd) onEnd();
        };

        utterance.onerror = () => {
          setIsSpeaking(false);
          activeUtteranceRef.current = null;
          if (onEnd) onEnd();
        };

        synthRef.current.speak(utterance);
      } catch (_) {
        setIsSpeaking(false);
        if (onEnd) onEnd();
      }
    },
    [lang]
  );

  // Primary Speech: Fast Dual-Engine Audio with Hardware Web Audio Playback
  const speak = useCallback(
    async (text: string, onEnd?: () => void, targetLang?: string) => {
      if (!text) return;
      unlockAudioContext();

      const cleanText = text.replace(/[*#_`]/g, "").trim();
      if (!cleanText) return;

      const effectiveLang = (targetLang || lang || "ta").split("-")[0].toLowerCase();
      const cacheKey = `${effectiveLang}:${cleanText}`;

      // 1. Check in-memory cache for instant 0ms playback
      const cached = audioCacheRef.current.get(cacheKey);
      if (cached) {
        playAudioHardware(cached, onEnd);
        return;
      }

      // 2. Fetch speech audio from /api/tts
      stopSpeaking();
      setIsLoadingSpeech(true);
      setIsSpeaking(true);

      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: cleanText,
            lang: effectiveLang
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.audioUrl) {
            audioCacheRef.current.set(cacheKey, data.audioUrl);
            await playAudioHardware(data.audioUrl, onEnd);
            return;
          }
        }
      } catch (err) {
        console.warn("[Voice] TTS route failed, attempting Web Speech fallback:", err);
      }

      // 3. Fallback to Web Speech API
      setIsLoadingSpeech(false);
      speakWithWebSpeech(cleanText, onEnd, targetLang || effectiveLang);
    },
    [unlockAudioContext, stopSpeaking, playAudioHardware, speakWithWebSpeech, lang]
  );

  // Dedicated "Read Page Out Loud"
  const readPageOutLoud = useCallback(
    (textToRead: string, targetLang?: string, onEnd?: () => void) => {
      speak(textToRead, onEnd, targetLang);
    },
    [speak]
  );

  // Speech recognition controls
  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      unlockAudioContext();
      stopSpeaking();
      recognitionRef.current.lang = lang;
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      console.warn("[Voice] Failed to start recognition:", e);
    }
  }, [lang, unlockAudioContext, stopSpeaking]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (_) {}
    setIsListening(false);
  }, []);

  return {
    isListening,
    isSpeaking,
    isLoadingSpeech,
    isMicDenied,
    interimText,
    speechSupported,
    recognitionSupported,
    unlockAudioContext,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    readPageOutLoud
  };
}
