import React, { useEffect, useRef, useState } from "react";
import { Play, Square, Volume2, Trash2 } from "lucide-react";
import { soundEngine } from "../audio/AudioEngine";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { BeatMachineBackground } from "./BeatMachineBackground";

interface DrumPad {
  id: string;
  name: string;
  key: string;
  color: string;
  soundFn: () => void;
}

interface SynthPad {
  note: string;
  key: string;
  color: string;
}

export const BeatMachineSection: React.FC = () => {
  const [sectionRef, isVisible] = useScrollReveal<HTMLElement>(0.1);
  // Transport State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(120);
  const [volume, setVolume] = useState<number>(0.85);
  const [synthWave, setSynthWave] = useState<"saw" | "square" | "sine" | "pluck">("saw");
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Active pad flash state for visual animations
  const [activePad, setActivePad] = useState<string | null>(null);

  // 16-Step Grid (Kick, Snare, Hihat, Clap)
  // Rows: 0 = Kick, 1 = Snare, 2 = Hihat, 3 = Clap
  const [grid, setGrid] = useState<boolean[][]>([
    // Kick (Classic 4-on-the-floor rock beat)
    [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
    // Snare (Backbeat on 5 and 13)
    [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
    // Hi-Hat (Straight 8th notes)
    [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
    // Clap
    [false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false],
  ]);

  // Drum Pads Configuration
  const drumPads: DrumPad[] = [
    { id: "kick", name: "KICK", key: "1", color: "#9333ea", soundFn: () => soundEngine.playKick(1.2) },
    { id: "snare", name: "SNARE", key: "2", color: "#e11d48", soundFn: () => soundEngine.playSnare(1.15) },
    { id: "hihat", name: "HI-HAT", key: "3", color: "#06b6d4", soundFn: () => soundEngine.playHiHat(false, 1.0) },
    { id: "clap", name: "CLAP", key: "4", color: "#ea580c", soundFn: () => soundEngine.playClap(1.1) },
    { id: "tom", name: "TOM", key: "5", color: "#2563eb", soundFn: () => soundEngine.playTom(110, 1.1) },
    { id: "cymbal", name: "CYMBAL", key: "6", color: "#d97706", soundFn: () => soundEngine.playCrash(1.1) },
  ];

  // Synth Pads Configuration
  const synthPads: SynthPad[] = [
    { note: "C4", key: "Q", color: "#dc2626" },
    { note: "D4", key: "W", color: "#d97706" },
    { note: "E4", key: "E", color: "#ca8a04" },
    { note: "G4", key: "R", color: "#16a34a" },
    { note: "A4", key: "T", color: "#0d9488" },
    { note: "C5", key: "Y", color: "#2563eb" },
    { note: "D5", key: "U", color: "#4f46e5" },
    { note: "E5", key: "I", color: "#7c3aed" },
  ];

  const triggerDrumPad = (pad: DrumPad) => {
    pad.soundFn();
    setActivePad(pad.id);
    setTimeout(() => setActivePad(null), 120);
  };

  const triggerSynthPad = (pad: SynthPad) => {
    soundEngine.playSynthNote(pad.note, synthWave);
    setActivePad(pad.note);
    setTimeout(() => setActivePad(null), 120);
  };

  // Keyboard controls for 1-6 and Q-I
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const k = e.key.toUpperCase();

      // Drum pad keys 1-6
      const drumMatch = drumPads.find((p) => p.key === k);
      if (drumMatch) {
        e.preventDefault();
        triggerDrumPad(drumMatch);
        return;
      }

      // Synth pad keys Q-I
      const synthMatch = synthPads.find((p) => p.key === k);
      if (synthMatch) {
        e.preventDefault();
        triggerSynthPad(synthMatch);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [synthWave]);

  // Master Volume update
  const handleVolumeChange = (v: number) => {
    setVolume(v);
    soundEngine.setMasterVolume(v);
  };

  // 16-Step Sequencer Playback Loop
  const timerRef = useRef<number | null>(null);
  const stepRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      setCurrentStep(0);
      stepRef.current = 0;
      return;
    }

    // 16th notes: interval in ms = (60,000 / BPM) / 4
    const intervalMs = (60000 / bpm) / 4;

    timerRef.current = window.setInterval(() => {
      const step = stepRef.current;

      // Trigger active tracks on this step
      if (grid[0][step]) soundEngine.playKick(1.1);
      if (grid[1][step]) soundEngine.playSnare(1.1);
      if (grid[2][step]) soundEngine.playHiHat(false, 0.9);
      if (grid[3][step]) soundEngine.playClap(1.0);

      setCurrentStep(step);
      stepRef.current = (step + 1) % 16;
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, bpm, grid]);

  const toggleStep = (rowIdx: number, colIdx: number) => {
    setGrid((prev) => {
      const copy = prev.map((row) => [...row]);
      copy[rowIdx][colIdx] = !copy[rowIdx][colIdx];
      return copy;
    });
  };

  const clearGrid = () => {
    setGrid([
      Array(16).fill(false),
      Array(16).fill(false),
      Array(16).fill(false),
      Array(16).fill(false),
    ]);
  };

  const loadPreset = (type: "rock" | "funk" | "trap") => {
    if (type === "rock") {
      setBpm(124);
      setGrid([
        [true, false, false, false, false, false, true, false, false, false, true, false, false, false, false, false],
        [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
        [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, true],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      ]);
    } else if (type === "funk") {
      setBpm(108);
      setGrid([
        [true, false, false, false, false, false, false, true, false, true, false, false, false, false, false, false],
        [false, false, false, false, true, false, false, false, false, false, false, false, true, false, true, false],
        [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
        [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      ]);
    } else if (type === "trap") {
      setBpm(140);
      setGrid([
        [true, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false],
        [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
        [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
        [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      ]);
    }
  };

  const trackLabels = [
    { name: "Kick", color: "#9333ea" },
    { name: "Snare", color: "#e11d48" },
    { name: "Hihat", color: "#06b6d4" },
    { name: "Clap", color: "#ea580c" },
  ];

  return (
    <section
      id="beat-machine"
      ref={sectionRef}
      className="beat-machine-section-container"
      style={{
        width: "100%",
        backgroundColor: "#0d0f15",
        color: "#ffffff",
        padding: "90px 48px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dynamic LED Rhythm Grid & Bass Pulse Background */}
      <BeatMachineBackground isPlaying={isPlaying} currentStep={currentStep} />

      {/* Container with smooth entrance reveal */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          position: "relative",
          zIndex: 10,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(36px)",
          transition: "opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "opacity, transform",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(34px, 4vw, 54px)",
              fontWeight: 900,
              color: "#38bdf8",
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: "-0.5px",
            }}
          >
            FreeMusic Studio
          </h2>
          <p style={{ margin: "8px 0 0", color: "#94a3b8", fontSize: "16px", fontWeight: 500 }}>
            Create beats, melodies, and make music for free
          </p>
        </div>

        {/* 1. TOP TRANSPORT CONTROL BAR */}
        <div
          className="beat-machine-transport-bar"
          style={{
            backgroundColor: "#161922",
            borderRadius: "20px",
            padding: "16px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "32px",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          {/* Play/Stop Button with pulse ring */}
          <div className="beat-machine-transport-controls" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: isPlaying ? "#e11d48" : "#7c3aed",
                border: "none",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: isPlaying
                  ? "0 0 25px rgba(225, 29, 72, 0.7)"
                  : "0 0 25px rgba(124, 58, 237, 0.6)",
                transition: "all 0.15s ease-out",
              }}
            >
              {isPlaying ? <Square size={22} fill="#ffffff" /> : <Play size={24} fill="#ffffff" style={{ marginLeft: "3px" }} />}
            </button>

            {/* BPM Slider */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "12px", fontWeight: 800, color: "#94a3b8", letterSpacing: "1px" }}>BPM</span>
              <input
                type="range"
                min="60"
                max="200"
                value={bpm}
                onChange={(e) => setBpm(parseInt(e.target.value))}
                style={{ width: "120px", cursor: "pointer", accentColor: "#a855f7" }}
              />
              <span style={{ fontSize: "14px", fontWeight: 800, color: "#a855f7", fontFamily: "monospace", minWidth: "30px" }}>
                {bpm}
              </span>
            </div>
          </div>

          {/* Volume Slider & Synth Selector */}
          <div className="beat-machine-sliders" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            {/* Master Volume */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Volume2 size={18} color="#94a3b8" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                style={{ width: "100px", cursor: "pointer", accentColor: "#06b6d4" }}
              />
            </div>

            {/* Synth Waveform Selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", fontWeight: 800, color: "#94a3b8" }}>Synth</span>
              <select
                value={synthWave}
                onChange={(e) => setSynthWave(e.target.value as unknown as "saw" | "square" | "sine" | "pluck")}
                style={{
                  backgroundColor: "#0d0f15",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#38bdf8",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="saw">Saw</option>
                <option value="square">Square</option>
                <option value="sine">Sine</option>
                <option value="pluck">Pluck</option>
              </select>
            </div>

            {/* Preset Buttons */}
            <div className="beat-machine-actions" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={() => loadPreset("rock")}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#e2e8f0",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Rock 4/4
              </button>
              <button
                onClick={() => loadPreset("funk")}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#e2e8f0",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Funk
              </button>
              <button
                onClick={() => loadPreset("trap")}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#e2e8f0",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Trap
              </button>
              <button
                onClick={clearGrid}
                title="Clear Sequencer"
                style={{
                  background: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#f87171",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* 2. DRUM PADS & SYNTHESIZER 2-COLUMN GRID */}
        <div
          className="beat-machine-panels-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "28px",
            marginBottom: "32px",
          }}
        >
          {/* Left Panel: Drum Pads */}
          <div
            style={{
              backgroundColor: "#161922",
              borderRadius: "20px",
              padding: "24px",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <div style={{ marginBottom: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#e11d48" }} />
                <span style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff" }}>Drum Pads</span>
              </div>
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#94a3b8" }}>
                Press keys 1-6 or click to play
              </p>
            </div>

            {/* 6 Pads in 3 columns x 2 rows */}
            <div className="beat-machine-drum-pads" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
              {drumPads.map((pad) => {
                const isActive = activePad === pad.id;
                return (
                  <button
                    key={pad.id}
                    className="beat-machine-pad-btn"
                    onClick={() => triggerDrumPad(pad)}
                    style={{
                      height: "115px",
                      backgroundColor: pad.color,
                      border: "none",
                      borderRadius: "14px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      color: "#ffffff",
                      boxShadow: isActive
                        ? `0 0 35px ${pad.color}`
                        : "0 8px 20px rgba(0, 0, 0, 0.4)",
                      transform: isActive ? "scale(0.95)" : "scale(1)",
                      transition: "transform 0.08s, box-shadow 0.15s",
                    }}
                  >
                    <span style={{ fontSize: "15px", fontWeight: 900, letterSpacing: "1px" }}>
                      {pad.name}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 800,
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      {pad.key}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Synthesizer */}
          <div
            style={{
              backgroundColor: "#161922",
              borderRadius: "20px",
              padding: "24px",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <div style={{ marginBottom: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#38bdf8" }} />
                <span style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff" }}>Synthesizer</span>
              </div>
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#94a3b8" }}>
                Press keys Q-W-E-R-T-Y-U-I to play
              </p>
            </div>

            {/* 8 Pads in 4 columns x 2 rows */}
            <div className="beat-machine-synth-pads" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
              {synthPads.map((pad) => {
                const isActive = activePad === pad.note;
                return (
                  <button
                    key={pad.note}
                    className="beat-machine-pad-btn"
                    onClick={() => triggerSynthPad(pad)}
                    style={{
                      height: "55px",
                      backgroundColor: pad.color,
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: 800,
                      gap: "6px",
                      boxShadow: isActive
                        ? `0 0 25px ${pad.color}`
                        : "0 4px 12px rgba(0, 0, 0, 0.3)",
                      transform: isActive ? "scale(0.94)" : "scale(1)",
                      transition: "transform 0.08s, box-shadow 0.15s",
                    }}
                  >
                    <span>{pad.note}</span>
                    <span style={{ fontSize: "10px", opacity: 0.8, backgroundColor: "rgba(0,0,0,0.25)", padding: "1px 4px", borderRadius: "3px" }}>
                      {pad.key}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. 16-STEP BEAT SEQUENCER (Exact Reference Grid) */}
        <div
          style={{
            backgroundColor: "#161922",
            borderRadius: "20px",
            padding: "24px 28px",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#e11d48" }} />
              <span style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff" }}>Beat Sequencer</span>
            </div>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#94a3b8" }}>
              Click to toggle steps, then press Play
            </p>
          </div>

          {/* Scrollable Container for Mobile Touch Devices */}
          <div className="sequencer-scroll-container">
            <div className="sequencer-table">
              {/* Column Step Numbers 1 to 16 */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                <div className="sequencer-track-label" style={{ width: "90px" }} />
                <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: "8px" }}>
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        textAlign: "center",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: currentStep === i && isPlaying ? "#ffffff" : "#64748b",
                        fontFamily: "monospace",
                      }}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Multi-Track Step Rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {trackLabels.map((track, rowIdx) => (
                  <div key={track.name} style={{ display: "flex", alignItems: "center" }}>
                    {/* Track Label */}
                    <div
                      className="sequencer-track-label"
                      style={{
                        width: "90px",
                        fontSize: "13px",
                        fontWeight: 800,
                        color: "#cbd5e1",
                      }}
                    >
                      {track.name}
                    </div>

                    {/* 16 Step Buttons */}
                    <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: "8px" }}>
                      {grid[rowIdx].map((isOn, colIdx) => {
                        const isScanningNow = currentStep === colIdx && isPlaying;
                        return (
                          <button
                            key={colIdx}
                            className="sequencer-step-btn"
                            onClick={() => toggleStep(rowIdx, colIdx)}
                            style={{
                              height: "44px",
                              borderRadius: "8px",
                              border: isScanningNow
                                ? "2px solid #ffffff"
                                : isOn
                                ? "none"
                                : "1px solid rgba(255, 255, 255, 0.08)",
                              backgroundColor: isOn ? track.color : "#1e2330",
                              cursor: "pointer",
                              boxShadow: isOn
                                ? `0 0 14px ${track.color}66`
                                : "none",
                              transform: isScanningNow ? "scale(1.06)" : "scale(1)",
                              transition: "all 0.06s ease-out",
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
