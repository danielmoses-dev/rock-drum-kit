import React, { useState } from "react";
import { RealDrumKit } from "./RealDrumKit";
import type { DrumKey } from "./ThreeDrumKit";
import { HeroCinematicBackground } from "./HeroCinematicBackground";
import { HeroAnimatedTitle } from "./HeroAnimatedTitle";

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const [activeTrigger, setActiveTrigger] = useState<DrumKey | null>(null);
  const [recentHits, setRecentHits] = useState<string[]>([]);
  const [lastHitTime, setLastHitTime] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const handleManualTrigger = (key: DrumKey, label: string) => {
    setActiveTrigger(key);
    setRecentHits((prev) => [label, ...prev.slice(0, 4)]);
    setLastHitTime(Date.now());
    setTimeout(() => setActiveTrigger(null), 100);
  };

  const keyPills: { id: DrumKey; key: string; label: string; accentColor: string }[] = [
    { id: "bass", key: "B", label: "Kick", accentColor: "#ff0055" },
    { id: "snare", key: "S", label: "Snare", accentColor: "#00f0ff" },
    { id: "hihat", key: "H", label: "Hi-Hat", accentColor: "#ffd166" },
    { id: "tom1", key: "T", label: "Tom 1", accentColor: "#ff2a5f" },
    { id: "tom2", key: "G", label: "Tom 2", accentColor: "#3b82f6" },
    { id: "floorTom", key: "F", label: "Floor", accentColor: "#10b981" },
    { id: "crash", key: "C", label: "Crash", accentColor: "#f59e0b" },
    { id: "ride", key: "R", label: "Ride", accentColor: "#eab308" },
  ];

  return (
    <section
      id="hero"
      className="hero-section"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#383a3c",
        color: "#ded8ce",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "var(--hero-padding)",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Moving Cinematic Film Strip Background with Audio-Reactive Flare */}
      <HeroCinematicBackground lastHitTime={lastHitTime} />
      {/* ============================================================ */}
      {/* 1. TOP EDITORIAL BAR (Brand & Navigation) */}
      {/* ============================================================ */}
      <header
        className="hero-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          zIndex: 40,
          position: "relative",
        }}
      >
        {/* Minimalist Drum Icon Brand Logo with Live Acoustic Indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
          <div style={{ position: "relative" }}>
            <svg width="40" height="36" viewBox="0 0 50 46" fill="none" stroke="#ded8ce" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px rgba(255, 209, 102, 0.35))" }}>
              {/* Bass Drum */}
              <circle cx="25" cy="27" r="14" />
              <circle cx="25" cy="27" r="8" strokeDasharray="3 3" />
              {/* Snare Left */}
              <ellipse cx="10" cy="18" rx="7" ry="3.5" stroke="#00f0ff" strokeWidth="1.8" />
              <line x1="3" y1="18" x2="3" y2="24" />
              <line x1="17" y1="18" x2="17" y2="24" />
              <line x1="10" y1="21.5" x2="10" y2="38" />
              {/* Tom Right */}
              <ellipse cx="40" cy="18" rx="7" ry="3.5" />
              <line x1="33" y1="18" x2="33" y2="24" />
              <line x1="47" y1="18" x2="47" y2="24" />
              <line x1="40" y1="21.5" x2="40" y2="38" />
              {/* Cymbals */}
              <line x1="6" y1="9" x2="20" y2="7" stroke="#ffd166" />
              <line x1="13" y1="8" x2="13" y2="15" />
              <line x1="30" y1="7" x2="44" y2="9" stroke="#ffd166" />
              <line x1="37" y1="8" x2="37" y2="15" />
            </svg>
            <span
              style={{
                position: "absolute",
                top: "-1px",
                right: "-2px",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#00f0ff",
                boxShadow: "0 0 8px #00f0ff",
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "17px",
                fontWeight: 900,
                letterSpacing: "3.5px",
                color: "#ded8ce",
                textTransform: "uppercase",
                fontFamily: "'Space Grotesk', sans-serif",
                lineHeight: 1.1,
              }}
            >
              DRUM•CORPS
            </span>
            <span
              style={{
                fontSize: "9px",
                fontWeight: 800,
                letterSpacing: "1.8px",
                color: "#ffd166",
                textTransform: "uppercase",
                fontFamily: "'Inter', sans-serif",
                marginTop: "1px",
              }}
            >
              MASTER ACOUSTIC
            </span>
          </div>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="hero-nav-mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            display: "none",
            backgroundColor: "rgba(20, 22, 26, 0.7)",
            border: "1px solid rgba(222, 216, 206, 0.3)",
            borderRadius: "8px",
            color: "#ded8ce",
            padding: "8px 14px",
            fontSize: "16px",
            cursor: "pointer",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hero-nav-desktop" style={{ display: "flex", gap: "36px", alignItems: "center" }}>
          {[
            { label: "HOME", target: "hero" },
            { label: "ANATOMY", target: "anatomy" },
            { label: "MASTERCLASS", target: "masterclass" },
            { label: "BEAT MACHINE", target: "beat-machine" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.target)}
              style={{
                background: "none",
                border: "none",
                color: "#ded8ce",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                cursor: "pointer",
                padding: "6px 0",
                transition: "opacity 0.2s, color 0.2s",
                fontFamily: "'Inter', sans-serif",
                opacity: 0.9,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#ded8ce")}
            >
              {item.label}
            </button>
          ))}

          {/* Interactive Live Studio Pill Button */}
          <button
            onClick={() => onNavigate("beat-machine")}
            style={{
              backgroundColor: "#141416",
              color: "#ded8ce",
              border: "1px solid rgba(222, 216, 206, 0.4)",
              borderRadius: "30px",
              padding: "10px 22px",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "transform 0.15s, background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#00f0ff";
              e.currentTarget.style.color = "#000000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#141416";
              e.currentTarget.style.color = "#ded8ce";
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#ff2a5f" }} />
            OPEN STUDIO
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div
            style={{
              position: "absolute",
              top: "56px",
              right: "0",
              left: "0",
              backgroundColor: "rgba(18, 20, 24, 0.96)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(222, 216, 206, 0.2)",
              borderRadius: "16px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              zIndex: 100,
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.8)",
            }}
          >
            {[
              { label: "HOME", target: "hero" },
              { label: "ANATOMY & PHYSICS", target: "anatomy" },
              { label: "CINEMATIC MASTERCLASS", target: "masterclass" },
              { label: "FREEMUSIC STUDIO", target: "beat-machine" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  onNavigate(item.target);
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#ded8ce",
                  fontSize: "13px",
                  fontWeight: 800,
                  letterSpacing: "2px",
                  padding: "12px 8px",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{item.label}</span>
                <span style={{ opacity: 0.5 }}>→</span>
              </button>
            ))}

            <button
              onClick={() => {
                onNavigate("beat-machine");
                setIsMobileMenuOpen(false);
              }}
              style={{
                backgroundColor: "#00f0ff",
                color: "#000000",
                border: "none",
                borderRadius: "12px",
                padding: "12px",
                fontWeight: 900,
                fontSize: "12px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginTop: "6px",
                cursor: "pointer",
              }}
            >
              OPEN STUDIO [BEAT MACHINE]
            </button>
          </div>
        )}
      </header>

      {/* ============================================================ */}
      {/* 2. THREE EDITORIAL SUB-HEADERS (With Color Accent Highlights) */}
      {/* ============================================================ */}
      <div
        className="hero-subheaders-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "32px",
          width: "100%",
          marginTop: "28px",
          zIndex: 30,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            fontWeight: 800,
            letterSpacing: "1.2px",
            lineHeight: "1.4",
            textTransform: "uppercase",
            color: "#ded8ce",
            maxWidth: "310px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          DISCOVER THE POWER OF <span style={{ color: "#ffd166", textShadow: "0 0 10px rgba(255, 209, 102, 0.35)" }}>PRECISION</span> AND THE JOY OF DRUMMING
        </p>

        <p
          style={{
            margin: 0,
            fontSize: "13px",
            fontWeight: 800,
            letterSpacing: "1.2px",
            lineHeight: "1.4",
            textTransform: "uppercase",
            color: "#ded8ce",
            maxWidth: "310px",
            justifySelf: "center",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          A RHYTHMIC EXPEDITION INTO THE WORLD OF <span style={{ color: "#00f0ff", textShadow: "0 0 10px rgba(0, 240, 255, 0.35)" }}>PERCUSSIVE ARTISTRY</span>
        </p>

        <p
          style={{
            margin: 0,
            fontSize: "13px",
            fontWeight: 800,
            letterSpacing: "1.2px",
            lineHeight: "1.4",
            textTransform: "uppercase",
            color: "#ded8ce",
            maxWidth: "310px",
            justifySelf: "end",
            textAlign: "right",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          TRANSFORMING ENTHUSIASTS INTO <span style={{ color: "#ff2a5f", textShadow: "0 0 10px rgba(255, 42, 95, 0.35)" }}>PERCUSSION VIRTUOSOS</span>
        </p>
      </div>

      {/* ============================================================ */}
      {/* 3. MONUMENTAL ANIMATED "DRUM" & 3D INTERACTIVE KIT */}
      {/* ============================================================ */}
      <div
        className="hero-stage-container"
        style={{
          position: "relative",
          width: "100%",
          height: "560px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "10px 0",
        }}
      >
        {/* Animated Headline "DRUM" with Looping Pixel Matrix, Metallic Sheen, and Reactive Recoil */}
        <HeroAnimatedTitle lastHitTime={lastHitTime} />

        {/* Real-Time Interactive 3D Drum Kit */}
        <div
          className="hero-drumkit-wrapper"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
          }}
        >
          <RealDrumKit
            activeTrigger={activeTrigger}
            onTrigger={(key) => {
              const item = keyPills.find((p) => p.id === key);
              if (item) setRecentHits((prev) => [item.label, ...prev.slice(0, 4)]);
              setLastHitTime(Date.now());
            }}
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. LOWER BLACK PILL OVERLAY (Lessons Card & Quick Trigger Dock) */}
      {/* ============================================================ */}
      <div
        className="hero-lower-pill"
        style={{
          backgroundColor: "#141416",
          borderRadius: "28px",
          padding: "24px 38px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          zIndex: 40,
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.45)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxSizing: "border-box",
        }}
      >
        {/* Left: LESSONS Title & Pill Arrow */}
        <div className="hero-pill-left" style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <span
            style={{
              fontSize: "clamp(34px, 4vw, 56px)",
              fontWeight: 900,
              letterSpacing: "1px",
              color: "#ded8ce",
              textTransform: "uppercase",
              fontFamily: "'Anton', 'Oswald', sans-serif",
              lineHeight: 1,
            }}
          >
            LESSONS
          </span>

          {/* Pill Arrow Button */}
          <button
            onClick={() => onNavigate("masterclass")}
            style={{
              width: "60px",
              height: "105px",
              borderRadius: "40px",
              border: "1.5px solid rgba(222, 216, 206, 0.4)",
              backgroundColor: "transparent",
              color: "#ded8ce",
              fontSize: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "transform 0.2s, background-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#ffd166";
              e.currentTarget.style.color = "#141416";
              e.currentTarget.style.borderColor = "#ffd166";
              e.currentTarget.style.boxShadow = "0 0 25px rgba(255, 209, 102, 0.4)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#ded8ce";
              e.currentTarget.style.borderColor = "rgba(222, 216, 206, 0.4)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "scale(1)";
            }}
            title="Explore 5 Rudiments Masterclass"
          >
            ↗
          </button>

          {/* Institute Description */}
          <p
            className="hero-pill-description"
            style={{
              margin: 0,
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.8px",
              lineHeight: "1.6",
              textTransform: "uppercase",
              color: "#ffffff",
              maxWidth: "340px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            LED BY SEASONED MAESTROS, OUR INSTITUTE RESONATES WITH THE ECHOES OF PASSION AND THE RELENTLESS PURSUIT OF RHYTHMIC EXCELLENCE BY OUR TEACHERS.
          </p>
        </div>

        {/* Right: Interactive Keyboard Trigger Dock */}
        <div className="hero-trigger-dock" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "2px", color: "#a8a9ab", textTransform: "uppercase" }}>
              PLAY VIA KEYBOARD OR CLICK:
            </span>
            {recentHits.length > 0 && (
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#00f0ff",
                  backgroundColor: "rgba(0, 240, 255, 0.15)",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontFamily: "monospace",
                  boxShadow: "0 0 10px rgba(0, 240, 255, 0.3)",
                }}
              >
                HIT: {recentHits[0]}
              </span>
            )}
          </div>

          <div className="hero-key-pills-row" style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
            {keyPills.map((p) => (
              <button
                key={p.id}
                className="hero-key-pill-btn"
                onClick={() => handleManualTrigger(p.id, p.label)}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(222, 216, 206, 0.2)",
                  borderRadius: "10px",
                  padding: "8px 14px",
                  color: "#ded8ce",
                  fontSize: "12px",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.12s ease-out",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${p.accentColor}22`;
                  e.currentTarget.style.borderColor = p.accentColor;
                  e.currentTarget.style.boxShadow = `0 0 16px ${p.accentColor}55`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
                  e.currentTarget.style.borderColor = "rgba(222, 216, 206, 0.2)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <kbd
                  style={{
                    backgroundColor: "rgba(18, 20, 24, 0.85)",
                    border: `1px solid ${p.accentColor}`,
                    borderRadius: "4px",
                    padding: "2px 6px",
                    fontSize: "10px",
                    fontWeight: 900,
                    color: p.accentColor,
                    fontFamily: "monospace",
                    boxShadow: `0 0 6px ${p.accentColor}44`,
                  }}
                >
                  {p.key}
                </kbd>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
