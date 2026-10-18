import React, { useEffect, useState } from "react";
import type { DrumKey } from "./ThreeDrumKit";

interface AnatomyBackgroundProps {
  selectedId: DrumKey;
  lastStrikeTime: number;
}

export const AnatomyBackground: React.FC<AnatomyBackgroundProps> = ({
  selectedId,
  lastStrikeTime,
}) => {
  const [pulseActive, setPulseActive] = useState<boolean>(false);

  useEffect(() => {
    if (lastStrikeTime > 0) {
      setPulseActive(true);
      const timer = setTimeout(() => setPulseActive(false), 500);
      return () => clearTimeout(timer);
    }
  }, [lastStrikeTime]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        backgroundColor: "#2c2e30",
      }}
    >
      <style>{`
        @keyframes blueprintRingPulse {
          0% { transform: scale(0.85); opacity: 0.15; }
          50% { transform: scale(1.05); opacity: 0.35; }
          100% { transform: scale(0.85); opacity: 0.15; }
        }

        @keyframes schematicCrosshairRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes gridScanLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>

      {/* SVG Technical Blueprint Layer */}
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.28,
        }}
      >
        <defs>
          {/* Technical Blueprint Grid Pattern */}
          <pattern id="anatomyBlueprintGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="rgba(222, 216, 206, 0.12)"
              strokeWidth="0.8"
            />
            {/* Small subdivisions */}
            <path
              d="M 15 0 L 15 60 M 30 0 L 30 60 M 45 0 L 45 60 M 0 15 L 60 15 M 0 30 L 60 30 M 0 45 L 60 45"
              fill="none"
              stroke="rgba(222, 216, 206, 0.04)"
              strokeWidth="0.5"
            />
            {/* Corner alignment cross */}
            <path
              d="M 0 3 L 0 -3 M -3 0 L 3 0"
              stroke="rgba(255, 215, 0, 0.3)"
              strokeWidth="0.8"
            />
          </pattern>

          {/* Radial Gradient for Acoustic Propagation */}
          <radialGradient id="acousticResonanceGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd700" stopOpacity={pulseActive ? "0.35" : "0.15"} />
            <stop offset="45%" stopColor="#00f0ff" stopOpacity={pulseActive ? "0.2" : "0.08"} />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Isometric Blueprint Base Grid */}
        <rect width="100%" height="100%" fill="url(#anatomyBlueprintGrid)" />

        {/* Concentric Acoustic Propagation Rings */}
        <g
          transform="translate(400, 320)"
          style={{
            animation: "blueprintRingPulse 7s ease-in-out infinite",
            transformOrigin: "400px 320px",
          }}
        >
          <circle cx="0" cy="0" r="140" fill="none" stroke="rgba(222, 216, 206, 0.18)" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="0" cy="0" r="220" fill="none" stroke="rgba(222, 216, 206, 0.14)" strokeWidth="1" />
          <circle cx="0" cy="0" r="300" fill="none" stroke="rgba(222, 216, 206, 0.1)" strokeWidth="1.2" strokeDasharray="6 6" />
          <circle cx="0" cy="0" r="380" fill="none" stroke="rgba(222, 216, 206, 0.06)" strokeWidth="1" />

          {/* Rotating Caliper Angle Arc */}
          <circle
            cx="0"
            cy="0"
            r="180"
            fill="none"
            stroke="#ffd700"
            strokeWidth="1.5"
            strokeDasharray="25 150"
            style={{
              animation: "schematicCrosshairRotate 24s linear infinite",
              transformOrigin: "0 0",
              opacity: 0.6,
            }}
          />
        </g>

        {/* Right Flank Acoustic Reflection Arcs */}
        <g transform="translate(1050, 420)">
          <path
            d="M -200 -200 Q 0 0 -200 200"
            fill="none"
            stroke="rgba(0, 240, 255, 0.2)"
            strokeWidth="1.2"
            strokeDasharray="8 6"
          />
          <path
            d="M -140 -160 Q 30 0 -140 160"
            fill="none"
            stroke="rgba(255, 215, 0, 0.25)"
            strokeWidth="1.2"
          />
          <path
            d="M -80 -120 Q 60 0 -80 120"
            fill="none"
            stroke="rgba(222, 216, 206, 0.15)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        </g>

        {/* Technical Schematic Overlay Annotations */}
        <g fill="rgba(222, 216, 206, 0.4)" fontSize="10" fontFamily="monospace" letterSpacing="1.5">
          <text x="60" y="80">CAD // ACOUSTIC CAVITY MODEL: [{selectedId.toUpperCase()}]</text>
          <text x="60" y="100">IMPEDANCE MATCH: 44.1 kHz • HARMONIC PEAK +4.2 dB</text>
          <text x="60" y="120">RESONANT MEMBRANE DISPLACEMENT: ACTIVE</text>

          <text x="88%" y="80" textAnchor="end">SYSTEM SPECS: HARD ROCK MAPLE</text>
          <text x="88%" y="100" textAnchor="end">DIAMETER CALIPER: 355.6 mm</text>
        </g>
      </svg>

      {/* Reactive Strike Acoustic Energy Aura */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "40%",
          transform: "translate(-50%, -50%)",
          width: "750px",
          height: "750px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 215, 0, 0.14) 0%, rgba(0, 240, 255, 0.08) 45%, transparent 70%)",
          opacity: pulseActive ? 1 : 0.45,
          transformOrigin: "center center",
          transition: "opacity 0.25s ease-out, transform 0.25s ease-out",
          filter: "blur(50px)",
        }}
      />

      {/* Soft Vignette Overlay (Guarantees Foreground 100% Readability) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse at 50% 50%, rgba(44, 46, 48, 0.15) 0%, rgba(44, 46, 48, 0.75) 80%, #252729 100%),
            linear-gradient(to bottom, rgba(44, 46, 48, 0.6) 0%, transparent 25%, transparent 75%, rgba(35, 37, 39, 0.8) 100%)
          `,
        }}
      />
    </div>
  );
};
