import React, { useRef, useState } from "react";
import { Maximize2, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { MasterclassBackground } from "./MasterclassBackground";

interface Chapter {
  timeSec: number;
  id: string;
  name: string;
  pattern: string;
  desc: string;
  badgeColor: string;
}

const CHAPTERS: Chapter[] = [
  { timeSec: 0, id: "00", name: "The Intro Blast", pattern: "Count-In & Slam", desc: "Crossed sticks countdown into explosive rimshot shockwave.", badgeColor: "#00f0ff" },
  { timeSec: 6, id: "01", name: "The Single Stroke Roll", pattern: "R L R L", desc: "Equal velocity & limb balance. The fundamental bedrock of drumming.", badgeColor: "#00f0ff" },
  { timeSec: 13, id: "02", name: "The Double Stroke Roll", pattern: "R R L L", desc: "Physics of the Moeller rebound and finger snap for effortless speed.", badgeColor: "#b800ff" },
  { timeSec: 20, id: "03", name: "The Paradiddle", pattern: "R L R R  L R L L", desc: "Combines singles & doubles to switch lead hands smoothly across the kit.", badgeColor: "#ffd700" },
  { timeSec: 27, id: "04", name: "The Flam", pattern: "lR   rL", desc: "Acoustic thickness: 2\" low grace note vs 10\" primary accent crack.", badgeColor: "#ff2a5f" },
  { timeSec: 34, id: "05", name: "The Drag (Ruff)", pattern: "llR   rrL", desc: "Two tight closed-bounce buzzes leading into a heavy downbeat.", badgeColor: "#00ff88" },
  { timeSec: 41, id: "06", name: "Grand Finale", pattern: "Full Kit Breakdown", desc: "3D holographic drum kit overview with practice routine guidance.", badgeColor: "#ffd700" },
];

export const MasterclassSection: React.FC = () => {
  const [sectionRef, isVisible] = useScrollReveal<HTMLElement>(0.12);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(46);
  const [volume, setVolume] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeChapter, setActiveChapter] = useState<number>(0);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    setCurrentTime(cur);

    // Update active chapter based on current time
    for (let i = CHAPTERS.length - 1; i >= 0; i--) {
      if (cur >= CHAPTERS[i].timeSec - 0.5) {
        setActiveChapter(i);
        break;
      }
    }
  };

  const seekTo = (sec: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = sec;
    videoRef.current.play();
    setIsPlaying(true);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <section
      id="masterclass"
      ref={sectionRef}
      className="masterclass-section-container"
      style={{
        width: "100%",
        backgroundColor: "#1c1e22",
        color: "#ded8ce",
        padding: "90px 48px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Cinematic Theater & Anamorphic Projection Background */}
      <MasterclassBackground isPlaying={isPlaying} />

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
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#00f0ff" }} />
          <span style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", color: "#00f0ff" }}>
            SECTION 03 • CINEMATIC MASTERCLASS & INFOGRAPHIC
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
          THE ANATOMY OF <span style={{ color: "#00f0ff" }}>RHYTHM</span>
        </h2>
        <p style={{ margin: "12px 0 0", color: "#a8a9ab", fontSize: "16px", maxWidth: "680px", lineHeight: "1.6" }}>
          Watch our motion graphic video breakdown explaining the 5 foundational drum rudiments. Every stick hit triggers physical membrane deformation, kinetic shockwaves, and rhythm HUD analytics.
        </p>
      </div>

      {/* Main Theater & Chapter Grid (Staggered entrance) */}
      <div
        className="masterclass-main-grid"
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          position: "relative",
          zIndex: 10,
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: "36px",
          alignItems: "start",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
          willChange: "opacity, transform",
        }}
      >
        {/* Left: Video Cinema Player Frame */}
        <div
          style={{
            backgroundColor: "#0d0e12",
            borderRadius: "24px",
            overflow: "hidden",
            border: "1px solid rgba(0, 240, 255, 0.25)",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.7)",
            position: "relative",
          }}
        >
          {/* Video Element */}
          <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", backgroundColor: "#07080d" }}>
            <video
              ref={videoRef}
              src="/drum-rudiments-infographic.mp4"
              poster="/out-frame140.png"
              playsInline
              preload="metadata"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => {
                if (videoRef.current) setDuration(videoRef.current.duration || 46);
              }}
              onEnded={() => setIsPlaying(false)}
              onClick={togglePlay}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                cursor: "pointer",
              }}
            />

            {/* Welcome to Play Overlay (Visible when paused) */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(7, 8, 13, 0.45)",
                  backdropFilter: "blur(4px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
              >
                {/* Big Glowing Play Disc */}
                <div
                  style={{
                    width: "88px",
                    height: "88px",
                    borderRadius: "50%",
                    backgroundColor: "#00f0ff",
                    color: "#07080d",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 45px rgba(0, 240, 255, 0.7)",
                    transform: "scale(1)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.boxShadow = "0 0 65px rgba(0, 240, 255, 0.9)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 0 45px rgba(0, 240, 255, 0.7)";
                  }}
                >
                  <Play size={40} fill="#07080d" style={{ marginLeft: "4px" }} />
                </div>

                <div
                  style={{
                    marginTop: "20px",
                    color: "#ffffff",
                    fontSize: "18px",
                    fontWeight: 800,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                  }}
                >
                  CLICK TO START MASTERCLASS
                </div>
                <div style={{ color: "#a0aec0", fontSize: "13px", marginTop: "4px" }}>
                  46 Seconds • 1080p Full HD • Complete Audio Synthesis
                </div>
              </div>
            )}
          </div>

          {/* Custom Media Controls Bar */}
          <div
            className="masterclass-video-controls"
            style={{
              backgroundColor: "#14161c",
              padding: "16px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            {/* Timeline Progress Scrubber */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                seekTo(pos * duration);
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(currentTime / duration) * 100}%`,
                  backgroundColor: "#00f0ff",
                  borderRadius: "4px",
                  boxShadow: "0 0 10px #00f0ff",
                  position: "relative",
                }}
              />

              {/* Chapter Pips along timeline */}
              {CHAPTERS.map((ch, idx) => {
                const leftPercent = (ch.timeSec / duration) * 100;
                return (
                  <div
                    key={idx}
                    title={`${ch.name} (${formatTime(ch.timeSec)})`}
                    style={{
                      position: "absolute",
                      left: `${leftPercent}%`,
                      top: "-2px",
                      width: "3px",
                      height: "12px",
                      backgroundColor: ch.badgeColor,
                      borderRadius: "1px",
                      pointerEvents: "none",
                    }}
                  />
                );
              })}
            </div>

            {/* Controls Row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {/* Play/Pause Button */}
                <button
                  onClick={togglePlay}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#ffffff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4px",
                  }}
                >
                  {isPlaying ? <Pause size={22} fill="#ffffff" /> : <Play size={22} fill="#ffffff" />}
                </button>

                {/* Reset to Start */}
                <button
                  onClick={() => seekTo(0)}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#a0aec0",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    padding: "4px",
                  }}
                  title="Rewind to start"
                >
                  <RotateCcw size={18} />
                </button>

                {/* Time Display */}
                <div style={{ fontSize: "13px", fontWeight: 700, fontFamily: "monospace", color: "#ded8ce" }}>
                  <span>{formatTime(currentTime)}</span>
                  <span style={{ color: "#718096" }}> / {formatTime(duration)}</span>
                </div>
              </div>

              {/* Volume & Fullscreen */}
              <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                {/* Volume Button & Slider */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    onClick={toggleMute}
                    style={{
                      background: "none",
                      border: "none",
                      color: isMuted ? "#ff2a5f" : "#a0aec0",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    style={{ width: "80px", cursor: "pointer", accentColor: "#00f0ff" }}
                  />
                </div>

                {/* Fullscreen Button */}
                <button
                  onClick={toggleFullscreen}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#a0aec0",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  title="Fullscreen"
                >
                  <Maximize2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Chapter Jump Navigation Cards */}
        <div className="masterclass-chapters-column" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "2px", color: "#a8a9ab", textTransform: "uppercase", marginBottom: "4px" }}>
            SELECT CHAPTER TO JUMP:
          </div>

          {CHAPTERS.map((ch, idx) => {
            const isActive = activeChapter === idx;
            return (
              <button
                key={ch.id}
                className="masterclass-chapter-card"
                onClick={() => seekTo(ch.timeSec)}
                style={{
                  backgroundColor: isActive ? "#252830" : "rgba(255, 255, 255, 0.04)",
                  border: isActive ? `1.5px solid ${ch.badgeColor}` : "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "14px",
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s ease-out",
                  boxShadow: isActive ? `0 0 20px ${ch.badgeColor}33` : "none",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 900,
                        color: ch.badgeColor,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      {formatTime(ch.timeSec)}
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: 800, color: isActive ? "#ffffff" : "#ded8ce" }}>
                      {ch.name}
                    </span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#8a8f98", fontFamily: "monospace" }}>
                    {ch.pattern}
                  </span>
                </div>

                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: isActive ? ch.badgeColor : "rgba(255, 255, 255, 0.08)",
                    color: isActive ? "#000" : "#a8a9ab",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 900,
                  }}
                >
                  ▶
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
