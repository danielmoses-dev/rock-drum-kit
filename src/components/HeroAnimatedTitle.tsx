import React, { useEffect, useState } from "react";

interface HeroAnimatedTitleProps {
  lastHitTime?: number;
}

export const HeroAnimatedTitle: React.FC<HeroAnimatedTitleProps> = ({ lastHitTime = 0 }) => {
  const [isHit, setIsHit] = useState<boolean>(false);

  // Trigger smooth acoustic recoil on strike
  useEffect(() => {
    if (lastHitTime > 0) {
      setIsHit(true);
      const timer = setTimeout(() => setIsHit(false), 380);
      return () => clearTimeout(timer);
    }
  }, [lastHitTime]);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -52%)",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 1,
      }}
    >
      <style>{`
        /* Smooth continuous floating levitation */
        @keyframes smoothDrumFloat {
          0%, 100% {
            transform: translateY(0px) scale(1);
            filter: drop-shadow(0 20px 45px rgba(0, 0, 0, 0.65)) drop-shadow(0 0 25px rgba(255, 255, 255, 0.12));
          }
          50% {
            transform: translateY(-11px) scale(1.014);
            filter: drop-shadow(0 30px 60px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.28));
          }
        }

        /* Smooth looping light sheen transition across the solid white letters */
        @keyframes smoothSheenSweep {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>

      {/* Monumental Headline "DRUM" - Exact original font, solid white with smooth looping motion & light transition */}
      <h1
        className="hero-drum-title"
        style={{
          margin: 0,
          fontSize: "clamp(180px, 29vw, 420px)",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          lineHeight: "0.8",
          textTransform: "uppercase",
          fontFamily: "'Anton', 'Oswald', sans-serif",
          userSelect: "none",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          // Solid white with silky smooth light reflection transition
          background: "linear-gradient(115deg, #ded8ce 0%, #ded8ce 30%, #ffffff 48%, #ffffff 54%, #ded8ce 70%, #ded8ce 100%)",
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          // Smooth floating movement & looping light transition
          animation: `smoothDrumFloat 6.5s ease-in-out infinite, smoothSheenSweep 5.5s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
          // Smooth reactive flex on strike
          transform: isHit ? "scale(1.032)" : undefined,
          transition: isHit ? "transform 0.08s cubic-bezier(0.1, 0.9, 0.2, 1)" : "transform 0.45s ease-out",
          opacity: 0.98,
        }}
      >
        DRUM
      </h1>
    </div>
  );
};
