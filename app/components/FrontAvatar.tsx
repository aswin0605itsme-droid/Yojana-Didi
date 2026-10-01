"use client";

import React from "react";

export type AvatarState = "waving" | "listening" | "thinking" | "speaking" | "idle";

interface FrontAvatarProps {
  state: AvatarState;
  mouthOpenness?: number; // 0 to 1, driven by Web Audio AnalyserNode
  className?: string;
  size?: "md" | "lg" | "xl";
}

export function FrontAvatar({
  state,
  mouthOpenness = 0,
  className = "",
  size = "lg"
}: FrontAvatarProps) {
  // Dimension scale based on size prop
  const sizeClasses = {
    md: "w-24 h-24 sm:w-28 sm:h-28",
    lg: "w-32 h-32 sm:w-36 sm:h-36",
    xl: "w-44 h-44 sm:w-48 sm:h-48"
  }[size];

  // Head tilt for listening or thinking
  const headTransform =
    state === "listening"
      ? "rotate(4deg) translate(2px, 0)"
      : state === "thinking"
      ? "rotate(-3deg) translate(-1px, -1px)"
      : "rotate(0deg)";

  // Compute mouth SVG geometry based on mouthOpenness (0 to 1)
  const clampedOpenness = Math.max(0, Math.min(1, mouthOpenness));
  const mouthHeight = clampedOpenness > 0.05 ? 3 + clampedOpenness * 9 : 2;
  const mouthWidth = 14 + clampedOpenness * 4;

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      aria-label={`VANI Avatar - ${state}`}
    >
      {/* Listening Soundwaves Rings */}
      {state === "listening" && (
        <div className="absolute -inset-4 rounded-full pointer-events-none flex items-center justify-center">
          <div className="w-44 h-44 rounded-full border-2 border-orange-400/40 animate-ping [animation-duration:2.5s]" />
          <div className="w-52 h-52 rounded-full border border-amber-400/30 animate-pulse [animation-duration:1.8s]" />
        </div>
      )}

      {/* SVG Avatar Illustration */}
      <svg
        viewBox="0 0 200 200"
        className={`${sizeClasses} drop-shadow-md transition-all duration-300 overflow-visible motion-reduce:transform-none`}
      >
        <defs>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          <linearGradient id="sareeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>

          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2A1B18" />
            <stop offset="100%" stopColor="#140D0C" />
          </linearGradient>
        </defs>

        {/* --- BODY & CLOTHES (Gentle Breathing Animation) --- */}
        <g className="animate-breathe origin-bottom">
          {/* Shoulders & Kurti / Saree */}
          <path
            d="M 40,165 Q 100,145 160,165 L 175,200 L 25,200 Z"
            fill="url(#sareeGrad)"
          />
          {/* Gold Pallu / Border Accent */}
          <path
            d="M 55,160 Q 95,178 145,160 L 152,176 Q 95,196 48,176 Z"
            fill="#FBBF24"
          />

          {/* Neck */}
          <rect x="88" y="125" width="24" height="28" rx="6" fill="#D97706" />
          <path
            d="M 88,140 Q 100,148 112,140 L 112,152 Q 100,158 88,152 Z"
            fill="#B45309"
            opacity="0.3"
          />
        </g>

        {/* --- HEAD GROUP (Gentle tilt on listen/think) --- */}
        <g
          style={{
            transform: headTransform,
            transformOrigin: "100px 110px",
            transition: "transform 0.4s ease"
          }}
        >
          {/* Back Hair & Bun */}
          <ellipse cx="100" cy="90" rx="60" ry="62" fill="url(#hairGrad)" />
          {/* Hair Bun with Jasmine Garland Accent */}
          <circle cx="152" cy="115" r="20" fill="url(#hairGrad)" />
          <circle cx="152" cy="115" r="23" stroke="#FEF08A" strokeWidth="4" strokeDasharray="6 4" fill="none" />

          {/* Face Base */}
          <ellipse cx="100" cy="100" rx="42" ry="46" fill="url(#skinGrad)" />

          {/* Front Hair Parting */}
          <path
            d="M 58,85 Q 100,60 142,85 Q 120,68 100,68 Q 80,68 58,85 Z"
            fill="#1E1311"
          />
          <path
            d="M 58,85 Q 75,95 82,110 Q 75,92 58,85 Z"
            fill="#1E1311"
          />
          <path
            d="M 142,85 Q 125,95 118,110 Q 125,92 142,85 Z"
            fill="#1E1311"
          />

          {/* Gold Earrings (Jhumkas) */}
          <circle cx="56" cy="108" r="4.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
          <path d="M 53,112 L 59,112 L 56,118 Z" fill="#D97706" />

          <circle cx="144" cy="108" r="4.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
          <path d="M 141,112 L 147,112 L 144,118 Z" fill="#D97706" />

          {/* Eyebrows */}
          <path
            d="M 72,86 Q 84,81 94,86"
            stroke="#2A1B18"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 106,86 Q 116,81 128,86"
            stroke="#2A1B18"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Traditional Red Bindi */}
          <circle cx="100" cy="85" r="4" fill="#991B1B" />
          <circle cx="100" cy="85" r="1.5" fill="#FEF08A" />

          {/* Eyes (With Auto-Blink CSS Animation) */}
          <g className="animate-blink origin-center">
            {/* Left Eye */}
            <ellipse cx="83" cy="98" rx="5.5" ry="4.5" fill="#1C1917" />
            <circle cx="85" cy="96" r="1.8" fill="#FFFFFF" />

            {/* Right Eye */}
            <ellipse cx="117" cy="98" rx="5.5" ry="4.5" fill="#1C1917" />
            <circle cx="119" cy="96" r="1.8" fill="#FFFFFF" />
          </g>

          {/* Gentle Nose & Gold Stud */}
          <path
            d="M 100,94 Q 102,106 97,109 Q 101,111 104,109"
            stroke="#B45309"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
          {/* Mookuthi (Nose pin) */}
          <circle cx="94" cy="108" r="1.4" fill="#FEF08A" stroke="#B45309" strokeWidth="0.5" />

          {/* --- MOUTH (Audio Analyser / State Driven) --- */}
          {state === "speaking" && clampedOpenness > 0.08 ? (
            /* Dynamic Loudness-Driven Open Mouth */
            <g>
              <ellipse
                cx="100"
                cy="123"
                rx={mouthWidth / 2}
                ry={mouthHeight / 2}
                fill="#881337"
                stroke="#991B1B"
                strokeWidth="1.5"
              />
              {/* Upper teeth row */}
              <path
                d={`M ${100 - mouthWidth / 3},${123 - mouthHeight / 4} Q 100,${123} ${100 + mouthWidth / 3},${123 - mouthHeight / 4}`}
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Lower lip shadow */}
              <path
                d={`M ${100 - mouthWidth / 2},126 Q 100,${126 + mouthHeight / 2} ${100 + mouthWidth / 2},126`}
                stroke="#B45309"
                strokeWidth="1.2"
                fill="none"
              />
            </g>
          ) : (
            /* Warm Friendly Smiling Mouth */
            <g>
              <path
                d="M 88,121 Q 100,131 112,121"
                stroke="#991B1B"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 89,122 Q 100,130 111,122"
                stroke="#F43F5E"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Soft Dimple Cheek Highlights */}
              <circle cx="78" cy="112" r="6" fill="#F43F5E" opacity="0.22" />
              <circle cx="122" cy="112" r="6" fill="#F43F5E" opacity="0.22" />
            </g>
          )}

          {/* Thinking State: 3 Bobbing Dots above head */}
          {state === "thinking" && (
            <g className="animate-in fade-in zoom-in-75">
              <rect x="75" y="24" width="50" height="24" rx="12" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" />
              <circle cx="88" cy="36" r="3" fill="#D97706" className="animate-bounce [animation-delay:0ms]" />
              <circle cx="100" cy="36" r="3" fill="#D97706" className="animate-bounce [animation-delay:180ms]" />
              <circle cx="112" cy="36" r="3" fill="#D97706" className="animate-bounce [animation-delay:360ms]" />
              <polygon points="100,48 95,55 105,48" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1" />
            </g>
          )}
        </g>

        {/* --- WAVING HAND (Only rendered on waving state) --- */}
        {state === "waving" && (
          <g className="animate-wave origin-[165px_150px]">
            {/* Forearm */}
            <path
              d="M 155,160 Q 170,135 178,110 L 190,118 Q 175,145 162,170 Z"
              fill="url(#skinGrad)"
            />
            {/* Bangles */}
            <path d="M 172,118 L 186,126" stroke="#DC2626" strokeWidth="3" />
            <path d="M 175,115 L 189,123" stroke="#FBBF24" strokeWidth="2.5" />
            {/* Hand & Palm */}
            <ellipse cx="186" cy="100" rx="9" ry="12" fill="url(#skinGrad)" transform="rotate(-15 186 100)" />
            {/* Fingers waving */}
            <path
              d="M 182,90 Q 186,76 190,88"
              stroke="#D97706"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 186,88 Q 191,74 195,86"
              stroke="#D97706"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 190,90 Q 196,78 199,89"
              stroke="#D97706"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 177,96 Q 173,88 178,98"
              stroke="#D97706"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
