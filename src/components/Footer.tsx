import React, { useState } from "react";
import { Keyboard, ArrowUp, Music2 } from "lucide-react";

export const Footer: React.FC = () => {
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="footer-container"
      style={{
        backgroundColor: "#090a0e",
        color: "#94a3b8",
        padding: "60px 48px 36px",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <div
        className="footer-content"
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "24px",
        }}
      >
        {/* Brand & Tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Music2 size={20} color="#ded8ce" />
            <span
              style={{
                fontSize: "18px",
                fontWeight: 900,
                letterSpacing: "3px",
                color: "#ded8ce",
                textTransform: "uppercase",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              DRUM•CORPS STUDIO
            </span>
          </div>
          <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
            Crafted with Three.js, Web Audio API, and Remotion Motion Design.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Keyboard Shortcuts Trigger Button */}
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#ded8ce",
              borderRadius: "20px",
              padding: "10px 18px",
              fontSize: "12px",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "background-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.12)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)")}
          >
            <Keyboard size={16} />
            <span>KEYBOARD CHEAT SHEET</span>
          </button>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              backgroundColor: "#161922",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#ffffff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Back to Top"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div
          onClick={() => setShowShortcuts(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#161922",
              border: "1px solid rgba(222, 216, 206, 0.3)",
              borderRadius: "24px",
              padding: "36px",
              maxWidth: "680px",
              width: "100%",
              color: "#ffffff",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ margin: 0, fontSize: "22px", fontWeight: 900, color: "#ded8ce", textTransform: "uppercase" }}>
                Keyboard Shortcuts Reference
              </h3>
              <button
                onClick={() => setShowShortcuts(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <div className="footer-modal-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              {/* 3D Classic Kit */}
              <div>
                <div style={{ fontSize: "12px", fontWeight: 800, color: "#ffd700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
                  3D Classic Rock Kit
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Bass Drum</span><kbd style={{ background: "#262b37", padding: "2px 8px", borderRadius: "4px" }}>B / Space</kbd></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Snare Drum</span><kbd style={{ background: "#262b37", padding: "2px 8px", borderRadius: "4px" }}>S</kbd></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Hi-Hat</span><kbd style={{ background: "#262b37", padding: "2px 8px", borderRadius: "4px" }}>H</kbd></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Rack Tom 1</span><kbd style={{ background: "#262b37", padding: "2px 8px", borderRadius: "4px" }}>T</kbd></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Rack Tom 2</span><kbd style={{ background: "#262b37", padding: "2px 8px", borderRadius: "4px" }}>G</kbd></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Floor Tom</span><kbd style={{ background: "#262b37", padding: "2px 8px", borderRadius: "4px" }}>F</kbd></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>18" Crash Cymbal</span><kbd style={{ background: "#262b37", padding: "2px 8px", borderRadius: "4px" }}>C</kbd></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>22" Ride Cymbal</span><kbd style={{ background: "#262b37", padding: "2px 8px", borderRadius: "4px" }}>R</kbd></div>
                </div>
              </div>

              {/* Beat Machine */}
              <div>
                <div style={{ fontSize: "12px", fontWeight: 800, color: "#38bdf8", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
                  Studio Beat Machine
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>MPC Drum Pads</span><kbd style={{ background: "#262b37", padding: "2px 8px", borderRadius: "4px" }}>1 - 6</kbd></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>C4, D4, E4, G4</span><kbd style={{ background: "#262b37", padding: "2px 8px", borderRadius: "4px" }}>Q, W, E, R</kbd></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>A4, C5, D5, E5</span><kbd style={{ background: "#262b37", padding: "2px 8px", borderRadius: "4px" }}>T, Y, U, I</kbd></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
