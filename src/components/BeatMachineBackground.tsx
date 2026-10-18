import React from "react";

interface BeatMachineBackgroundProps {
  isPlaying: boolean;
  currentStep: number;
}

export const BeatMachineBackground: React.FC<BeatMachineBackgroundProps> = ({
  isPlaying,
  currentStep,
}) => {
  // Check if current step is an active quarter-note downbeat (0, 4, 8, 12 in 0-indexed)
  const isDownbeat = isPlaying && currentStep % 4 === 0;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        backgroundColor: "#0d0f15",
      }}
    >
      <style>{`
        @keyframes matrixPulse {
          0%, 100% { opacity: 0.22; }
          50% { opacity: 0.38; }
        }

        @keyframes cyberScanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>

      {/* Reactive Studio Ambient Aura (Pulses on downbeats) */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -20%)",
          width: "min(1100px, 95vw)",
          height: "600px",
          background: isDownbeat
            ? "radial-gradient(ellipse at center, rgba(225, 29, 72, 0.22) 0%, rgba(124, 58, 237, 0.16) 40%, rgba(6, 182, 212, 0.08) 65%, transparent 80%)"
            : "radial-gradient(ellipse at center, rgba(124, 58, 237, 0.12) 0%, rgba(6, 182, 212, 0.07) 50%, transparent 75%)",
          filter: "blur(60px)",
          opacity: isPlaying ? 0.95 : 0.6,
          transition: "background 0.08s ease-out, opacity 0.3s ease-out",
        }}
      />

      {/* High-Tech Studio Cyber Matrix SVG */}
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.32,
          animation: "matrixPulse 6s ease-in-out infinite",
        }}
      >
        <defs>
          {/* LED Step Matrix Grid Pattern */}
          <pattern id="beatLedMatrix" width="40" height="40" patternUnits="userSpaceOnUse">
            {/* Dark grid frame */}
            <rect width="40" height="40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.8" />
            {/* Center LED node */}
            <circle cx="20" cy="20" r="1.5" fill="rgba(56, 189, 248, 0.45)" />
            {/* Sub-node micro dot */}
            <circle cx="20" cy="20" r="0.6" fill="#ffffff" />
          </pattern>

          {/* Linear Equalizer Rail Gradient */}
          <linearGradient id="eqRailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#e11d48" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* LED Grid Matrix */}
        <rect width="100%" height="100%" fill="url(#beatLedMatrix)" />

        {/* Horizontal Rhythm Rails */}
        <line x1="0" y1="180" x2="100%" y2="180" stroke="url(#eqRailGrad)" strokeWidth="1" strokeDasharray="6 4" opacity="0.35" />
        <line x1="0" y1="520" x2="100%" y2="520" stroke="url(#eqRailGrad)" strokeWidth="1" strokeDasharray="6 4" opacity="0.25" />

        {/* Subtle Decorative Studio Telemetry Indicators */}
        <g fill="rgba(148, 163, 184, 0.3)" fontSize="10" fontFamily="monospace" letterSpacing="1.5">
          <text x="60" y="60">DIGITAL BEAT MACHINE // BUFFER: 128 SAMPLES</text>
          <text x="60" y="80">ACTIVE TRACKS: 4-CH SEQUENCER + 6 MPC PADS</text>

          <text x="calc(100% - 60px)" y="60" textAnchor="end">
            STATUS: {isPlaying ? `RUNNING [STEP ${currentStep + 1}/16]` : "STANDBY"}
          </text>
        </g>
      </svg>

      {/* Vignette Shield to keep transport bar and sequencer crystal clear */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse at 50% 50%, rgba(13, 15, 21, 0.25) 0%, rgba(13, 15, 21, 0.8) 80%, #080a0f 100%),
            linear-gradient(to bottom, rgba(13, 15, 21, 0.5) 0%, transparent 20%, transparent 80%, rgba(10, 11, 16, 0.85) 100%)
          `,
        }}
      />
    </div>
  );
};
