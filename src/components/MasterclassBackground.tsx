import React from "react";

interface MasterclassBackgroundProps {
  isPlaying: boolean;
}

export const MasterclassBackground: React.FC<MasterclassBackgroundProps> = ({ isPlaying }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        backgroundColor: "#1c1e22",
      }}
    >
      <style>{`
        /* Projector Cone Ambient Shimmer */
        @keyframes projectorBeamShimmer {
          0%, 100% { opacity: 0.35; transform: rotate(-1deg) scaleY(1); }
          50% { opacity: 0.55; transform: rotate(1.5deg) scaleY(1.03); }
        }

        /* Ambient Cinema Dust Float */
        @keyframes cinemaMoteFloat {
          0% { transform: translateY(110%) translateX(0px); opacity: 0; }
          30% { opacity: 0.6; }
          70% { opacity: 0.5; }
          100% { transform: translateY(-10%) translateX(25px); opacity: 0; }
        }

        /* Subtle Anamorphic Flare Breathing */
        @keyframes anamorphicPulse {
          0%, 100% { opacity: 0.2; transform: scaleX(0.95); }
          50% { opacity: 0.45; transform: scaleX(1.05); }
        }
      `}</style>

      {/* 1. Anamorphic Horizontal Blue Streak Flare */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "-10%",
          width: "120%",
          height: "2px",
          background: "linear-gradient(90deg, transparent 0%, rgba(0, 240, 255, 0.4) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(0, 240, 255, 0.4) 60%, transparent 100%)",
          filter: "blur(1px)",
          opacity: isPlaying ? 0.45 : 0.2,
          animation: "anamorphicPulse 8s ease-in-out infinite",
          transition: "opacity 0.5s ease-out",
        }}
      />

      {/* 2. Cinema Projector Light Cone SVG */}
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          inset: 0,
          opacity: isPlaying ? 0.55 : 0.32,
          animation: "projectorBeamShimmer 12s ease-in-out infinite",
          transformOrigin: "50% 0%",
          transition: "opacity 0.6s ease-out",
        }}
      >
        <defs>
          <linearGradient id="theaterProjectorCone" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="25%" stopColor="#00f0ff" stopOpacity="0.15" />
            <stop offset="65%" stopColor="#7c3aed" stopOpacity="0.06" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>

          {/* 35mm Film Perforation Pattern */}
          <pattern id="filmPerforationPattern" width="24" height="32" patternUnits="userSpaceOnUse">
            <rect x="4" y="6" width="16" height="20" rx="3" fill="none" stroke="rgba(222, 216, 206, 0.14)" strokeWidth="1.2" />
          </pattern>
        </defs>

        {/* Projector Light Beam descending over cinema theater */}
        <polygon points="460, -80 540, -80 950, 950 50, 950" fill="url(#theaterProjectorCone)" />

        {/* Left Film Strip Perforations */}
        <rect x="18" y="0" width="24" height="100%" fill="url(#filmPerforationPattern)" opacity="0.3" />

        {/* Right Film Strip Perforations */}
        <rect x="calc(100% - 42px)" y="0" width="24" height="100%" fill="url(#filmPerforationPattern)" opacity="0.3" />

        {/* Aspect Ratio Framing Guides */}
        <g stroke="rgba(222, 216, 206, 0.12)" strokeWidth="1" strokeDasharray="6 6">
          <line x1="80" y1="120" x2="80" y2="85%" />
          <line x1="calc(100% - 80px)" y1="120" x2="calc(100% - 80px)" y2="85%" />
        </g>
      </svg>

      {/* 3. Floating Cinema Motes / Dust Particles caught in Projector Light */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {[
          { left: "35%", delay: "0s", dur: "14s", size: "3px" },
          { left: "42%", delay: "3s", dur: "18s", size: "2px" },
          { left: "48%", delay: "6s", dur: "16s", size: "3.5px" },
          { left: "54%", delay: "1s", dur: "19s", size: "2.5px" },
          { left: "62%", delay: "4s", dur: "15s", size: "2px" },
        ].map((mote, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: mote.left,
              bottom: "-20px",
              width: mote.size,
              height: mote.size,
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              boxShadow: "0 0 8px #00f0ff",
              animation: `cinemaMoteFloat ${mote.dur} ease-in-out infinite`,
              animationDelay: mote.delay,
            }}
          />
        ))}
      </div>

      {/* 4. Theater Vignette Mask to Preserve Foreground Contrast */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse at 50% 50%, rgba(28, 30, 34, 0.2) 0%, rgba(20, 22, 26, 0.82) 80%, #121417 100%),
            linear-gradient(to bottom, rgba(28, 30, 34, 0.6) 0%, transparent 20%, transparent 80%, rgba(18, 20, 24, 0.9) 100%)
          `,
        }}
      />
    </div>
  );
};
