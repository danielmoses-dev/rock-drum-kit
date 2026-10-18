import React from "react";

interface SectionTransitionProps {
  topColor: string;
  bottomColor: string;
  accentColor?: string;
  label?: string;
  nextSectionId?: string;
}

export const SectionTransition: React.FC<SectionTransitionProps> = ({
  topColor,
  bottomColor,
  accentColor = "rgba(222, 216, 206, 0.3)",
  label,
  nextSectionId,
}) => {
  const handleScrollNext = () => {
    if (!nextSectionId) return;
    const el = document.getElementById(nextSectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="section-transition-container"
      style={{
        position: "relative",
        width: "100%",
        height: "100px",
        background: `linear-gradient(to bottom, ${topColor} 0%, ${bottomColor} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 20,
        overflow: "hidden",
        pointerEvents: nextSectionId ? "auto" : "none",
        marginTop: "-1px",
        marginBottom: "-1px",
      }}
    >
      {/* Delicate horizontal acoustic frequency rule */}
      <div
        style={{
          position: "absolute",
          left: "5%",
          right: "5%",
          height: "1px",
          background: `linear-gradient(90deg, transparent 0%, ${accentColor} 50%, transparent 100%)`,
          opacity: 0.6,
        }}
      />

      {/* Acoustic wave SVG pulse line */}
      <svg
        width="240"
        height="32"
        viewBox="0 0 240 32"
        fill="none"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          opacity: 0.35,
        }}
      >
        <path
          d="M0 16 H60 Q75 16 85 8 T105 24 T120 4 T135 28 T155 8 Q165 16 180 16 H240"
          stroke={accentColor}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>

      {/* Central Interactive Pill Badge */}
      {label && (
        <button
          className="section-transition-badge"
          onClick={handleScrollNext}
          style={{
            position: "relative",
            backgroundColor: "rgba(18, 20, 24, 0.75)",
            backdropFilter: "blur(10px)",
            border: `1px solid ${accentColor}`,
            borderRadius: "20px",
            padding: "5px 16px",
            color: "#ded8ce",
            fontSize: "10px",
            fontWeight: 800,
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            cursor: nextSectionId ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
            transition: "all 0.2s ease-out",
            zIndex: 2,
          }}
          onMouseEnter={(e) => {
            if (nextSectionId) {
              e.currentTarget.style.backgroundColor = "rgba(30, 34, 42, 0.95)";
              e.currentTarget.style.transform = "translateY(1px) scale(1.04)";
              e.currentTarget.style.borderColor = "#ffffff";
            }
          }}
          onMouseLeave={(e) => {
            if (nextSectionId) {
              e.currentTarget.style.backgroundColor = "rgba(18, 20, 24, 0.75)";
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.borderColor = accentColor;
            }
          }}
        >
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accentColor }} />
          <span>{label}</span>
          <span style={{ fontSize: "11px", opacity: 0.7 }}>↓</span>
        </button>
      )}
    </div>
  );
};
