"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseVoiceOptions {
  onSpeechResult?: (transcript: string) => void;
  lang?: string;
}

export function useVoice({ onSpeechResult, lang = "hi-IN" }: UseVoiceOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const [interimText, setInterimText] = useState("");

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize SpeechSynthesis and SpeechRecognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;

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
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }

      if (!window.speechSynthesis) {
        setSpeechSupported(false);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
      if (synthRef.current) {
        try {
          synthRef.current.cancel();
        } catch (_) {}
      }
    };
  }, [lang, onSpeechResult]);

  // Start speech recognition
  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      // Stop current speech output if Didi is speaking
      if (synthRef.current) {
        synthRef.current.cancel();
        setIsSpeaking(false);
      }
      recognitionRef.current.lang = lang;
      recognitionRef.current.start();
    } catch (e) {
      console.warn("[Voice] Failed to start recognition:", e);
    }
  }, [lang]);

  // Stop speech recognition
  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (_) {}
    setIsListening(false);
  }, []);

  // Text-to-speech
  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (!synthRef.current || isMuted || !text) return;

      synthRef.current.cancel();

      // Clean text of JSON artifacts or markdown if present
      const cleanText = text.replace(/[*#_`]/g, "").trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Attempt to pick a gentle Indian voice
      const voices = synthRef.current.getVoices();
      const indianVoice = voices.find(
        (v) =>
          v.lang.startsWith("hi") ||
          v.name.toLowerCase().includes("india") ||
          v.name.toLowerCase().includes("hindi") ||
          v.name.toLowerCase().includes("swara") ||
          v.name.toLowerCase().includes("lekha")
      );

      if (indianVoice) {
        utterance.voice = indianVoice;
      }

      utterance.pitch = 1.05; // Slightly warmer pitch
      utterance.rate = 0.94; // Calm, respectful pace for rural women

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
      };
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    },
    [isMuted]
  );

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next && synthRef.current) {
        synthRef.current.cancel();
        setIsSpeaking(false);
      }
      return next;
    });
  }, []);

  return {
    isListening,
    isSpeaking,
    isMuted,
    interimText,
    speechSupported,
    recognitionSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    toggleMute
  };
}
