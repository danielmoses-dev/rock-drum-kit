import React, { useEffect, useState } from "react";

interface SectionItem {
  id: string;
  num: string;
  label: string;
}

const SECTIONS: SectionItem[] = [
  { id: "hero", num: "01", label: "HERO KIT" },
  { id: "anatomy", num: "02", label: "ANATOMY" },
  { id: "masterclass", num: "03", label: "CINEMA" },
  { id: "beat-machine", num: "04", label: "STUDIO" },
];

export const ScrollNavigationRail: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight * 0.35;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "fixed",
        right: "24px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 90,
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        padding: "14px 10px",
        backgroundColor: isHovered ? "rgba(16, 18, 22, 0.85)" : "rgba(16, 18, 22, 0.45)",
        backdropFilter: "blur(12px)",
        borderRadius: "30px",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.45)",
        transition: "all 0.25s ease-out",
      }}
    >
      {SECTIONS.map((sec) => {
        const isActive = activeSection === sec.id;

        return (
          <button
            key={sec.id}
            onClick={() => scrollTo(sec.id)}
            style={{
              position: "relative",
              background: "none",
              border: "none",
              padding: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title={sec.label}
          >
            {/* Pill or Circle Indicator */}
            <div
              style={{
                width: isActive ? "8px" : "6px",
                height: isActive ? "22px" : "6px",
                borderRadius: "10px",
                backgroundColor: isActive ? "#00f0ff" : "rgba(222, 216, 206, 0.35)",
                boxShadow: isActive ? "0 0 12px #00f0ff" : "none",
                transition: "all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
            />

            {/* Expanded Label on Hover */}
            {isHovered && (
              <span
                style={{
                  position: "absolute",
                  right: "26px",
                  backgroundColor: "rgba(18, 20, 24, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: isActive ? "#00f0ff" : "#ded8ce",
                  fontSize: "10px",
                  fontWeight: 800,
                  letterSpacing: "1.5px",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {sec.num} • {sec.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
