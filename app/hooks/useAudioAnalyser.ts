"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function useAudioAnalyser() {
  const [mouthOpenness, setMouthOpenness] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const timerFallbackRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize or unlock AudioContext
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === "closed") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioCtx();
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  // Stop any active audio and animation
  const stopAudio = useCallback(() => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
      } catch (_) {}
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }

    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }

    if (timerFallbackRef.current) {
      clearInterval(timerFallbackRef.current);
      timerFallbackRef.current = null;
    }

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setMouthOpenness(0);
    setIsPlayingAudio(false);
  }, []);

  // Play audio buffer or base64 URL with AnalyserNode driving mouth
  const playAudioWithAnalyser = useCallback(
    async (audioSrc: string, onEnded?: () => void) => {
      stopAudio();
      const ctx = getAudioContext();

      try {
        // Fetch audio bytes
        const response = await fetch(audioSrc);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

        // Setup AnalyserNode
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.7;
        analyserRef.current = analyser;

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        sourceNodeRef.current = source;

        source.connect(analyser);
        analyser.connect(ctx.destination);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        setIsPlayingAudio(true);

        // Frame loop to read loudness
        const checkLoudness = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);

          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;

          // Normalize openness between 0 and 1
          if (avg > 10) {
            const open = Math.min(1, Math.max(0.1, (avg - 10) / 45));
            setMouthOpenness(open);
          } else {
            setMouthOpenness(0);
          }

          animFrameIdRef.current = requestAnimationFrame(checkLoudness);
        };

        animFrameIdRef.current = requestAnimationFrame(checkLoudness);

        source.onended = () => {
          stopAudio();
          if (onEnded) onEnded();
        };

        source.start(0);
      } catch (err) {
        console.warn("[VANI AudioAnalyser] AudioBuffer decoding failed, using synthetic fallback:", err);
        startSyntheticMouthLoop(3000, onEnded);
      }
    },
    [getAudioContext, stopAudio]
  );

  // Fallback: Timer-based mouth loop when using speechSynthesis
  const startSyntheticMouthLoop = useCallback(
    (durationMs: number = 3000, onEnded?: () => void) => {
      stopAudio();
      setIsPlayingAudio(true);

      let step = 0;
      timerFallbackRef.current = setInterval(() => {
        step = (step + 1) % 4;
        const openness = step === 0 ? 0.1 : step === 1 ? 0.7 : step === 2 ? 0.9 : 0.3;
        setMouthOpenness(openness);
      }, 140);

      setTimeout(() => {
        stopAudio();
        if (onEnded) onEnded();
      }, durationMs);
    },
    [stopAudio]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [stopAudio]);

  return {
    mouthOpenness,
    isPlayingAudio,
    getAudioContext,
    playAudioWithAnalyser,
    startSyntheticMouthLoop,
    stopAudio
  };
}
