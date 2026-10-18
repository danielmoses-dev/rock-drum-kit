import React, { useEffect, useRef, useState } from "react";
import { soundEngine } from "../audio/AudioEngine";
import type { DrumKey } from "./ThreeDrumKit";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { AnatomyBackground } from "./AnatomyBackground";

interface ComponentDetail {
  id: DrumKey;
  name: string;
  key: string;
  size: string;
  material: string;
  timbre: string;
  tuningAdvice: string;
  description: string;
}

const COMPONENTS: ComponentDetail[] = [
  {
    id: "snare",
    name: "14\" Custom Snare Drum",
    key: "S",
    size: "14\" × 6.5\"",
    material: "10-Ply North American Hard Rock Maple + 20-Strand Steel Wires",
    timbre: "Bright crack with warm, woody undertones and sensitive snare wire sizzle.",
    tuningAdvice: "Crank the bottom resonant head tight (table-top taut) for maximum snare wire response; tune the batter head to taste.",
    description: "The rhythmic anchor of the drum kit. Every backbeat on beats 2 and 4 defines the groove and energy of modern rock and funk music.",
  },
  {
    id: "bass",
    name: "22\" Classic Kick Drum",
    key: "B",
    size: "22\" × 18\"",
    material: "6-Ply Vintage Mahogany Shell with Dual Wood Counter-Hoops",
    timbre: "Chest-thumping sub-bass impact with a sharp beater transient punch.",
    tuningAdvice: "Tune both batter and resonant heads just past the wrinkle stage for deep punch and maximum low-end frequency presence.",
    description: "The sonic pulse that locks with the bass guitar. It moves the most air of any acoustic instrument on stage.",
  },
  {
    id: "hihat",
    name: "14\" Studio Hi-Hats",
    key: "H",
    size: "14\" Top & Bottom Pair",
    material: "B20 Hand-Hammered Bronze Alloy (80% Copper, 20% Tin)",
    timbre: "Crisp, tight 'chick' sound when pedaled; bright, sizzling wash when slightly opened.",
    tuningAdvice: "Tilt the bottom cymbal screw slightly to eliminate air lock and create clean, articulate stick definition.",
    description: "The timekeeper. Allows drummers to control articulation and dynamic density smoothly between closed precision and open roaring grooves.",
  },
  {
    id: "floorTom",
    name: "16\" Resonant Floor Tom",
    key: "F",
    size: "16\" × 16\"",
    material: "8-Ply Scandinavian Birch for Aggressive Attack and Fast Decay",
    timbre: "Deep, boomy, thunderous rumble with controlled overtones.",
    tuningAdvice: "Tune the bottom head slightly lower than the top head for a natural pitch bend dive after each stick strike.",
    description: "Provides monumental low-end fills and driving tribal rhythms that build tension before explosive chorus transitions.",
  },
  {
    id: "ride",
    name: "22\" Heavy Ride (Bell Focus)",
    key: "R",
    size: "22\" Heavy Weight",
    material: "Hand-Hammered B20 Bronze with Raw Lathed Concentric Grooves",
    timbre: "Crystal-clear stick ping with a singing, piercing bell accent and dark smoky undertones.",
    tuningAdvice: "Positioned at a comfortable elbow height so the stick shoulder can effortlessly alternate between bow ping and bell strikes.",
    description: "The sophisticated rhythm carrier of jazz, rock, and progressive metal, offering unmatched acoustic nuance.",
  },
  {
    id: "crash",
    name: "18\" Explosive Thin Crash",
    key: "C",
    size: "18\" Thin Weight",
    material: "Cast B20 Bronze with Wide Hammering Impressions",
    timbre: "Instantaneous explosive burst with full-frequency shimmer and fast decay.",
    tuningAdvice: "Mount on a loose felt washer with a sleeve to allow the cymbal to swing freely and prevent edge cracking.",
    description: "Used to punctuate musical transitions, accent downbeats, and build wall-of-sound energy in rock anthems.",
  },
];

export const AnatomySection: React.FC = () => {
  const [selectedId, setSelectedId] = useState<DrumKey>("snare");
  const [lastStrikeTime, setLastStrikeTime] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sectionRef, isVisible] = useScrollReveal<HTMLElement>(0.12);

  const selected = COMPONENTS.find((c) => c.id === selectedId) || COMPONENTS[0];

  const handleTestSound = (id: DrumKey) => {
    setLastStrikeTime(Date.now());
    switch (id) {
      case "bass":
        soundEngine.playKick(1.3);
        break;
      case "snare":
        soundEngine.playSnare(1.2);
        break;
      case "hihat":
        soundEngine.playHiHat(false, 1.1);
        break;
      case "floorTom":
        soundEngine.playTom(85, 1.2);
        break;
      case "ride":
        soundEngine.playRide(true, 1.2);
        break;
      case "crash":
        soundEngine.playCrash(1.25);
        break;
    }
  };

  // Real-time FFT Frequency Visualizer Canvas
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const renderSpectrum = () => {
      animId = requestAnimationFrame(renderSpectrum);
      const data = soundEngine.getByteFrequencyData();
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Draw subtle grid lines
      ctx.strokeStyle = "rgba(222, 216, 206, 0.1)";
      ctx.lineWidth = 1;
      for (let y = 0; y < h; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const barCount = 32;
      const barWidth = (w - (barCount - 1) * 3) / barCount;

      for (let i = 0; i < barCount; i++) {
        const value = data[i] || 0;
        const barHeight = Math.max(4, (value / 255) * (h - 10));
        const x = i * (barWidth + 3);
        const y = h - barHeight;

        // Gradient color from Cyan to Amber to Coral
        const hue = 190 + (i / barCount) * 120;
        ctx.fillStyle = `hsl(${hue}, 95%, ${Math.min(70, 45 + value * 0.1)}%)`;
        ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
        ctx.shadowBlur = value > 40 ? 8 : 0;

        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }
    };

    renderSpectrum();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section
      id="anatomy"
      ref={sectionRef}
      className="anatomy-section-container"
      style={{
        width: "100%",
        backgroundColor: "#2c2e30",
        color: "#ded8ce",
        padding: "90px 48px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dynamic Acoustic Blueprint & Resonance Background */}
      <AnatomyBackground selectedId={selectedId} lastStrikeTime={lastStrikeTime} />

      {/* Section Header with smooth entrance transition */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto 48px",
          position: "relative",
          zIndex: 10,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "opacity, transform",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#ffd700" }} />
          <span style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", color: "#ffd700" }}>
            SECTION 02 • ACOUSTIC PHYSICS & ENGINEERING
          </span>
        </div>

        <h2
          style={{
            margin: 0,
            fontSize: "clamp(36px, 4.5vw, 60px)",
            fontWeight: 900,
            letterSpacing: "1px",
            textTransform: "uppercase",
            fontFamily: "'Anton', 'Oswald', sans-serif",
            color: "#ffffff",
          }}
        >
          ANATOMY OF THE <span style={{ color: "#ded8ce" }}>ROCK KIT</span>
        </h2>
        <p style={{ margin: "12px 0 0", color: "#a8a9ab", fontSize: "16px", maxWidth: "620px", lineHeight: "1.6" }}>
          Inspect the acoustic craftsmanship, shell physics, and frequency response of each component in a classic rock kit. Strike any piece to view the live FFT acoustic transient response.
        </p>
      </div>

      {/* Main Grid: Component Selector + Details Card + FFT Visualizer (Staggered transition) */}
      <div
        className="anatomy-main-grid"
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          position: "relative",
          zIndex: 10,
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: "36px",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
          willChange: "opacity, transform",
        }}
      >
        {/* Left: Component Selector Tabs */}
        <div className="anatomy-component-selector" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {COMPONENTS.map((comp) => {
            const isSelected = comp.id === selectedId;
            return (
              <button
                key={comp.id}
                className="anatomy-selector-btn"
                onClick={() => {
                  setSelectedId(comp.id);
                  handleTestSound(comp.id);
                }}
                style={{
                  backgroundColor: isSelected ? "#141416" : "rgba(255, 255, 255, 0.04)",
                  border: isSelected ? "1.5px solid #ded8ce" : "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "14px",
                  padding: "16px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  color: isSelected ? "#ffffff" : "#ded8ce",
                  transition: "all 0.15s ease-out",
                  textAlign: "left",
                }}
              >
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 800, letterSpacing: "1px" }}>{comp.name}</div>
                  <div style={{ fontSize: "12px", color: isSelected ? "#ffd700" : "#a8a9ab", marginTop: "3px" }}>
                    {comp.size}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <kbd
                    style={{
                      backgroundColor: "#2a2c30",
                      border: "1px solid #4a4d55",
                      borderRadius: "4px",
                      padding: "2px 7px",
                      fontSize: "11px",
                      fontWeight: 900,
                      color: "#ffffff",
                    }}
                  >
                    {comp.key}
                  </kbd>
                  <span style={{ fontSize: "14px", opacity: isSelected ? 1 : 0.4 }}>▶</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Detailed Specification & Live Spectrum Card */}
        <div
          className="anatomy-spec-card"
          style={{
            backgroundColor: "#141416",
            borderRadius: "24px",
            border: "1px solid rgba(222, 216, 206, 0.2)",
            padding: "36px",
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)",
          }}
        >
          {/* Top Info Bar */}
          <div className="anatomy-top-info" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span
                style={{
                  backgroundColor: "rgba(222, 216, 206, 0.15)",
                  color: "#ded8ce",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "2px",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  textTransform: "uppercase",
                }}
              >
                SPECIFICATION SHEET
              </span>
              <h3
                style={{
                  margin: "10px 0 0",
                  fontSize: "32px",
                  fontWeight: 900,
                  color: "#ffffff",
                  fontFamily: "'Anton', 'Oswald', sans-serif",
                  letterSpacing: "1px",
                }}
              >
                {selected.name}
              </h3>
            </div>

            {/* Test Strike Button */}
            <button
              className="anatomy-strike-btn"
              onClick={() => handleTestSound(selected.id)}
              style={{
                backgroundColor: "#00f0ff",
                color: "#000000",
                border: "none",
                borderRadius: "30px",
                padding: "10px 22px",
                fontSize: "13px",
                fontWeight: 900,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 0 20px rgba(0, 240, 255, 0.4)",
                transition: "transform 0.1s, box-shadow 0.2s",
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <span>⚡</span>
              <span>STRIKE PIECE [KEY {selected.key}]</span>
            </button>
          </div>

          {/* Description */}
          <p style={{ margin: 0, color: "#d8dadc", fontSize: "15px", lineHeight: "1.7" }}>
            {selected.description}
          </p>

          {/* Technical Specs Grid */}
          <div className="anatomy-specs-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "16px 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#a8a9ab", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                SHELL & HARDWARE MATERIAL
              </div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff", marginTop: "6px" }}>
                {selected.material}
              </div>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "16px 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#a8a9ab", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                ACOUSTIC TIMBRE
              </div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffd700", marginTop: "6px" }}>
                {selected.timbre}
              </div>
            </div>

            <div style={{ gridColumn: "1 / -1", background: "rgba(255, 255, 255, 0.03)", padding: "16px 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#a8a9ab", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                MAESTRO TUNING ADVICE
              </div>
              <div style={{ fontSize: "14px", fontWeight: 500, color: "#ded8ce", marginTop: "6px", lineHeight: "1.5" }}>
                {selected.tuningAdvice}
              </div>
            </div>
          </div>

          {/* Real-Time Acoustic FFT Spectrum Canvas */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "2px", color: "#a8a9ab", textTransform: "uppercase" }}>
                LIVE FFT TRANSIENT FREQUENCY SPECTRUM
              </span>
              <span style={{ fontSize: "10px", color: "#00f0ff", fontFamily: "monospace" }}>
                REAL-TIME WEB AUDIO ANALYSER
              </span>
            </div>

            <canvas
              ref={canvasRef}
              width={700}
              height={100}
              style={{
                width: "100%",
                height: "100px",
                backgroundColor: "#0d0e11",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
