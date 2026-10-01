"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
import { DidiAvatar } from "./components/DidiAvatar";
import { InterviewChat } from "./components/InterviewChat";
import { ActionCard } from "./components/ActionCard";
import { useVoice } from "./hooks/useVoice";
import { ChatMessage, YojanaDidiResponse, ActionCardDetails } from "./types";

const INITIAL_GREETING =
  "Namaste Behen! Main aapki Yojana Didi hoon. Aapko sarkari sahayata paane mein bilkul pareshan nahi hona padega. Mujhe bas itna bataiye, kya aap apna koi naya kaam shuru karna chahti hain jaise silai ya dairy, ya fir aapko kheti ke kaam mein sahayata chahiye?";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [turnCount, setTurnCount] = useState<number>(1);
  const [uiMode, setUiMode] = useState<"interview" | "action_card">("interview");
  const [actionCardDetails, setActionCardDetails] = useState<ActionCardDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  // Send message handler
  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        text: text.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      const nextTurn = turnCount + 1;
      setTurnCount(nextTurn);

      try {
        // Build history for backend
        const history = messages.map((m) => ({
          role: m.role,
          content: m.text
        }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            history,
            turnCount: nextTurn
          })
        });

        const data: YojanaDidiResponse = await res.json();

        const assistantMsg: ChatMessage = {
          id: `didi-${Date.now()}`,
          role: "assistant",
          text: data.spoken_response,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          actionCard: data.ui_mode === "action_card" ? data.action_card_details : null
        };

        setMessages((prev) => [...prev, assistantMsg]);

        // If action card is ready
        if (data.ui_mode === "action_card" && data.action_card_details?.scheme_name) {
          setUiMode("action_card");
          setActionCardDetails(data.action_card_details);
        }

        // Speak Didi's response aloud
        voice.speak(data.spoken_response);
      } catch (err) {
        console.error("Chat error:", err);
        const errorMsg: ChatMessage = {
          id: `didi-${Date.now()}`,
          role: "assistant",
          text: "Maaf kijiye behen, main theek se sun nahi paayi. Kya aap dobara bol sakti hain?",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [messages, turnCount, isLoading]
  );

  // Initialize Voice hook with callback
  const voice = useVoice({
    onSpeechResult: (transcript) => {
      if (transcript.trim()) {
        handleSendMessage(transcript.trim());
      }
    }
  });

  // Mount initial greeting
  useEffect(() => {
    if (!hasStarted) {
      setHasStarted(true);
      const initialMsg: ChatMessage = {
        id: "initial-didi-msg",
        role: "assistant",
        text: INITIAL_GREETING,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages([initialMsg]);
    }
  }, [hasStarted]);

  // Reset conversation
  const handleReset = () => {
    voice.stopSpeaking();
    voice.stopListening();
    setUiMode("interview");
    setActionCardDetails(null);
    setTurnCount(1);
    const initialMsg: ChatMessage = {
      id: `initial-didi-${Date.now()}`,
      role: "assistant",
      text: INITIAL_GREETING,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setMessages([initialMsg]);
    voice.speak(INITIAL_GREETING);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50/40 to-amber-100/50 text-stone-900 flex flex-col font-sans selection:bg-amber-200">
      {/* Top Header */}
      <Header
        isMuted={voice.isMuted}
        onToggleMute={voice.toggleMute}
        onReset={handleReset}
        turnCount={turnCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-3 flex flex-col justify-between">
        {/* Animated Yojana Didi Avatar & Companion status */}
        <section aria-label="Yojana Didi Companion" className="print:hidden">
          <DidiAvatar
            isSpeaking={voice.isSpeaking}
            isListening={voice.isListening}
            isLoading={isLoading}
          />
        </section>

        {/* Dynamic Display: Interview Mode OR Action Card Mode */}
        {uiMode === "action_card" && actionCardDetails ? (
          <ActionCard
            details={actionCardDetails}
            onSpeak={(text) => voice.speak(text)}
            onReset={handleReset}
          />
        ) : (
          <InterviewChat
            messages={messages}
            turnCount={turnCount}
            isLoading={isLoading}
            isListening={voice.isListening}
            interimText={voice.interimText}
            onSendMessage={handleSendMessage}
            onStartListening={voice.startListening}
            onStopListening={voice.stopListening}
            onSpeakText={(text) => voice.speak(text)}
          />
        )}

        {/* Footer info note */}
        <footer className="text-center py-2 text-[11px] text-amber-900/60 print:hidden">
          Yojana Didi • AI Assistant for Rural Women • Built with Google Gemini
        </footer>
      </main>
    </div>
  );
}
