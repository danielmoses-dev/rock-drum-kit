import React, { useEffect, useState } from "react";

interface HeroCinematicBackgroundProps {
  lastHitTime?: number;
}

const GALLERY_IMAGES = [
  { src: "/hero-gallery/snare-strike.jpg", alt: "Snare Drum Rimshot Strike", tag: "PRECISION" },
  { src: "/hero-gallery/stage-kit.jpg", alt: "Classic Rock Kit on Stage", tag: "HERITAGE" },
  { src: "/hero-gallery/cymbal-shimmer.jpg", alt: "Hammered Crash Cymbal Shimmer", tag: "ARTICULATION" },
  { src: "/hero-gallery/overhead-drummer.jpg", alt: "Overhead Rehearsal Studio", tag: "INTENSITY" },
];

export const HeroCinematicBackground: React.FC<HeroCinematicBackgroundProps> = ({ lastHitTime = 0 }) => {
  const [pulseActive, setPulseActive] = useState<boolean>(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Trigger brief audio-reactive light flare when drum is hit
  useEffect(() => {
    if (lastHitTime > 0) {
      setPulseActive(true);
      const timer = setTimeout(() => setPulseActive(false), 380);
      return () => clearTimeout(timer);
    }
  }, [lastHitTime]);

  // Subtle mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      setMouseOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Double the image list for seamless infinite marquee loop
  const rowImages = [...GALLERY_IMAGES, ...GALLERY_IMAGES, ...GALLERY_IMAGES];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        backgroundColor: "#36383a",
      }}
    >
      <style>{`
        @keyframes driftLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes driftRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes slowSway {
          0%, 100% { transform: rotate(-3deg) scale(1); }
          50% { transform: rotate(3deg) scale(1.04); }
        }
      `}</style>

      {/* Parallax Container reacting to mouse */}
      <div
        style={{
          position: "absolute",
          inset: "-5%",
          width: "110%",
          height: "110%",
          transform: `translate(${mouseOffset.x * -0.5}px, ${mouseOffset.y * -0.5}px)`,
          transition: "transform 0.15s ease-out",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          opacity: pulseActive ? 0.72 : 0.54,
          transitionProperty: "opacity",
          transitionDuration: pulseActive ? "0.08s" : "0.45s",
        }}
      >
        {/* Top Stream: Drifting Left */}
        <div
          style={{
            display: "flex",
            gap: "28px",
            width: "max-content",
            animation: "driftLeft 62s linear infinite",
          }}
        >
          {rowImages.map((img, idx) => (
            <div
              key={`top-${idx}`}
              style={{
                width: "420px",
                height: "240px",
                borderRadius: "16px",
                overflow: "hidden",
                position: "relative",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                boxShadow: "0 15px 35px rgba(0, 0, 0, 0.5)",
                flexShrink: 0,
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "grayscale(100%) contrast(125%) brightness(1.02)",
                  transform: "scale(1.04)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "12px",
                  left: "14px",
                  backgroundColor: "rgba(0, 0, 0, 0.65)",
                  backdropFilter: "blur(4px)",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontWeight: 900,
                  letterSpacing: "1.5px",
                  color: "#ded8ce",
                }}
              >
                {img.tag}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stream: Drifting Right */}
        <div
          style={{
            display: "flex",
            gap: "28px",
            width: "max-content",
            animation: "driftRight 68s linear infinite",
          }}
        >
          {rowImages.map((img, idx) => (
            <div
              key={`bot-${idx}`}
              style={{
                width: "420px",
                height: "240px",
                borderRadius: "16px",
                overflow: "hidden",
                position: "relative",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                boxShadow: "0 15px 35px rgba(0, 0, 0, 0.5)",
                flexShrink: 0,
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "grayscale(100%) contrast(125%) brightness(1.02)",
                  transform: "scale(1.04)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "12px",
                  left: "14px",
                  backgroundColor: "rgba(0, 0, 0, 0.65)",
                  backdropFilter: "blur(4px)",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontWeight: 900,
                  letterSpacing: "1.5px",
                  color: "#ded8ce",
                }}
              >
                {img.tag}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Atmospheric Concert Stage Lighting (Amber, Cyan, and Deep Violet auras) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          opacity: pulseActive ? 0.95 : 0.65,
          transition: "opacity 0.25s ease-out",
        }}
      >
        {/* Central Hand-Hammered Cymbal Bronze / Vintage Tungsten Stage Glow */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translate(-50%, -30%)",
            width: "min(950px, 95vw)",
            height: "550px",
            background: "radial-gradient(ellipse at center, rgba(245, 158, 11, 0.22) 0%, rgba(217, 119, 6, 0.08) 45%, transparent 75%)",
            filter: "blur(40px)",
          }}
        />

        {/* Left Flank Electric Sonic Cyan Rim Light */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "-5%",
            width: "550px",
            height: "550px",
            background: "radial-gradient(ellipse at center, rgba(6, 182, 212, 0.18) 0%, rgba(14, 165, 233, 0.05) 50%, transparent 75%)",
            filter: "blur(50px)",
          }}
        />

        {/* Right Flank Stage Violet Depth */}
        <div
          style={{
            position: "absolute",
            top: "35%",
            right: "-5%",
            width: "550px",
            height: "550px",
            background: "radial-gradient(ellipse at center, rgba(168, 85, 247, 0.14) 0%, rgba(236, 72, 153, 0.05) 50%, transparent 75%)",
            filter: "blur(50px)",
          }}
        />
      </div>

      {/* Floating Ethereal Stage Dust & Ember Particles */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2,
          overflow: "hidden",
        }}
      >
        <style>{`
          @keyframes particleDriftUp {
            0% { transform: translateY(105vh) translateX(0px); opacity: 0; }
            20% { opacity: 0.6; }
            80% { opacity: 0.5; }
            100% { transform: translateY(-10vh) translateX(30px); opacity: 0; }
          }
        `}</style>
        {[
          { left: "15%", delay: "0s", dur: "14s", size: "3px", color: "#00f0ff" },
          { left: "28%", delay: "3s", dur: "18s", size: "2.5px", color: "#ffd166" },
          { left: "42%", delay: "7s", dur: "16s", size: "3.5px", color: "#ffffff" },
          { left: "55%", delay: "1s", dur: "15s", size: "2px", color: "#ffd166" },
          { left: "68%", delay: "5s", dur: "19s", size: "3px", color: "#00f0ff" },
          { left: "82%", delay: "2s", dur: "17s", size: "2.5px", color: "#ffaa00" },
          { left: "90%", delay: "8s", dur: "21s", size: "2px", color: "#ffffff" },
          { left: "22%", delay: "10s", dur: "15s", size: "2px", color: "#ff2a5f" },
        ].map((pt, idx) => (
          <div
            key={`dust-${idx}`}
            style={{
              position: "absolute",
              left: pt.left,
              bottom: "-20px",
              width: pt.size,
              height: pt.size,
              borderRadius: "50%",
              backgroundColor: pt.color,
              boxShadow: `0 0 8px ${pt.color}`,
              animation: `particleDriftUp ${pt.dur} ease-in-out infinite`,
              animationDelay: pt.delay,
            }}
          />
        ))}
      </div>

      {/* Cinematic Spotlight Sweeps (Slow Ambient Stage Atmosphere) */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: pulseActive ? 0.35 : 0.2,
          transition: "opacity 0.2s ease-out",
          animation: "slowSway 18s ease-in-out infinite",
          transformOrigin: "top center",
          zIndex: 2,
        }}
      >
        <defs>
          <linearGradient id="heroSpot1" x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="40%" stopColor="#00f0ff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="heroSpot2" x1="100%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#ffd166" stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points="300,-100 500,-100 1200,1200 600,1200" fill="url(#heroSpot1)" />
        <polygon points="1600,-100 1400,-100 800,1200 1300,1200" fill="url(#heroSpot2)" />
      </svg>

      {/* Transparent Vignette & Gradient Blend (Reveals Background Images Clearly) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          background: `
            radial-gradient(ellipse at 50% 50%, rgba(66, 68, 71, 0.05) 0%, rgba(54, 56, 58, 0.3) 75%, rgba(44, 46, 48, 0.55) 100%),
            linear-gradient(to bottom, rgba(54, 56, 58, 0.25) 0%, transparent 20%, transparent 80%, rgba(44, 46, 48, 0.45) 100%)
          `,
        }}
      />

      {/* Analog 35mm Film Grain Simulation */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 4,
          opacity: 0.1,
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: "6px 6px",
        }}
      />
    </div>
  );
};
