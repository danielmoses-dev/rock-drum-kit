import React, { useEffect, useRef, useState } from "react";
import { soundEngine } from "../audio/AudioEngine";
import type { DrumKey } from "./ThreeDrumKit";
import drumCutoutImg from "../assets/image__29778-removebg-preview.png";

interface DrumZone {
  id: DrumKey;
  name: string;
  key: string;
  // Normalized percentage coordinates (0 to 100%) on the 1000x1000 image
  x: number;
  y: number;
  width: number;
  height: number;
  shape: "ellipse" | "circle";
  accentColor: string;
}

const DRUM_ZONES: DrumZone[] = [
  {
    id: "hihat",
    name: "14\" Studio Hi-Hats",
    key: "H",
    x: 13.5,
    y: 30,
    width: 22,
    height: 12,
    shape: "ellipse",
    accentColor: "#ffd166",
  },
  {
    id: "crash",
    name: "18\" Heavy Crash Cymbal",
    key: "C",
    x: 35,
    y: 13.5,
    width: 22,
    height: 10,
    shape: "ellipse",
    accentColor: "#ffe066",
  },
  {
    id: "ride",
    name: "22\" Hammered Ride (Bell)",
    key: "R",
    x: 72,
    y: 16.5,
    width: 24,
    height: 11,
    shape: "ellipse",
    accentColor: "#ffaa00",
  },
  {
    id: "snare",
    name: "14\" Mapex Coated Snare",
    key: "S",
    x: 32,
    y: 44,
    width: 23,
    height: 13,
    shape: "ellipse",
    accentColor: "#00f0ff",
  },
  {
    id: "tom1",
    name: "10\" High Rack Tom",
    key: "T",
    x: 48.5,
    y: 32,
    width: 15,
    height: 12,
    shape: "ellipse",
    accentColor: "#ff2a5f",
  },
  {
    id: "tom2",
    name: "12\" Mid Rack Tom",
    key: "G",
    x: 66,
    y: 32,
    width: 17,
    height: 13,
    shape: "ellipse",
    accentColor: "#ff2a5f",
  },
  {
    id: "bass",
    name: "22\" Kick / Bass Drum",
    key: "B",
    x: 56.5,
    y: 59,
    width: 30,
    height: 32,
    shape: "circle",
    accentColor: "#ff0055",
  },
  {
    id: "floorTom",
    name: "16\" Deep Floor Tom",
    key: "F",
    x: 85,
    y: 55,
    width: 25,
    height: 28,
    shape: "ellipse",
    accentColor: "#00ff88",
  },
];

interface Shockwave {
  id: number;
  x: number;
  y: number;
  color: string;
  progress: number;
}

interface Spark {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
}

interface RealDrumKitProps {
  onTrigger?: (id: DrumKey) => void;
  activeTrigger?: DrumKey | null;
}

export const RealDrumKit: React.FC<RealDrumKitProps> = ({ onTrigger, activeTrigger }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredZone, setHoveredZone] = useState<DrumZone | null>(null);
  const [recentHitZone, setRecentHitZone] = useState<DrumZone | null>(null);
  const [shockwaves, setShockwaves] = useState<Shockwave[]>([]);
  const [sparks, setSparks] = useState<Spark[]>([]);

  // 3D Tilt, Parallax & Recoil Physics
  const targetPosRef = useRef({ x: 0, y: 0 });
  const tiltRef = useRef({
    rotX: 0,
    rotY: 0,
    recoilX: 0,
    recoilY: 0,
    recoilZ: 0,
    scale: 1,
  });
  const [tiltState, setTiltState] = useState({
    rotX: 0,
    rotY: 0,
    recoilX: 0,
    recoilY: 0,
    recoilZ: 0,
    scale: 1,
    idleY: 0,
    idleRotZ: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width - 0.5) * 2));
    const ny = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height - 0.5) * 2));
    targetPosRef.current = { x: nx, y: ny };
  };

  const handleMouseLeave = () => {
    targetPosRef.current = { x: 0, y: 0 };
  };

  // Main Strike Execution
  const executeStrike = (zone: DrumZone) => {
    // 1. Play zero-latency sound
    switch (zone.id) {
      case "bass":
        soundEngine.playKick(1.25);
        break;
      case "snare":
        soundEngine.playSnare(1.2);
        break;
      case "hihat":
        soundEngine.playHiHat(false, 1.05);
        break;
      case "tom1":
        soundEngine.playTom(150, 1.05);
        break;
      case "tom2":
        soundEngine.playTom(120, 1.05);
        break;
      case "floorTom":
        soundEngine.playTom(85, 1.15);
        break;
      case "crash":
        soundEngine.playCrash(1.25);
        break;
      case "ride":
        soundEngine.playRide(true, 1.15);
        break;
    }

    setRecentHitZone(zone);
    setTimeout(() => setRecentHitZone(null), 180);

    // 2. Add Directional Impulse Recoil to the 3D Kit
    const dx = (zone.x - 50) / 50; // -1 (left) to +1 (right)
    const dy = (zone.y - 50) / 50; // -1 (top) to +1 (bottom)

    tiltRef.current.recoilX = -dy * 5.0; // tilt away from impact
    tiltRef.current.recoilY = dx * 5.5;  // tilt sideways from impact
    tiltRef.current.recoilZ = -14;       // punch back into depth
    tiltRef.current.scale = 0.982;      // compression

    // 3. Spawn multi-ring shockwave at zone center
    const swId = Date.now() + Math.random();
    setShockwaves((prev) => [
      ...prev.slice(-8),
      { id: swId, x: zone.x, y: zone.y, color: zone.accentColor, progress: 0 },
    ]);

    // 4. Spawn kinetic sparks bursting from impact
    const newSparks: Spark[] = Array.from({ length: 14 }).map((_, i) => {
      const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.4;
      const speed = 4 + Math.random() * 5;
      return {
        id: Math.random(),
        x: zone.x,
        y: zone.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.6,
        color: i % 2 === 0 ? "#ffffff" : zone.accentColor,
        alpha: 1.0,
        size: 3 + Math.random() * 3,
      };
    });
    setSparks((prev) => [...prev.slice(-30), ...newSparks]);

    if (onTrigger) onTrigger(zone.id);
  };

  // Main 60fps Animation Loop (Tilt lerp, Recoil spring dampening, Sparks & Shockwaves)
  useEffect(() => {
    let animId: number;
    const updatePhysics = () => {
      animId = requestAnimationFrame(updatePhysics);

      // Smoothly interpolate mouse parallax tilt (clean, not harsh)
      const targetRotX = -targetPosRef.current.y * 6.5; // -6.5 to +6.5 deg
      const targetRotY = targetPosRef.current.x * 8.5;  // -8.5 to +8.5 deg
      tiltRef.current.rotX += (targetRotX - tiltRef.current.rotX) * 0.085;
      tiltRef.current.rotY += (targetRotY - tiltRef.current.rotY) * 0.085;

      // Smoothly damp recoil back to zero
      tiltRef.current.recoilX *= 0.88;
      tiltRef.current.recoilY *= 0.88;
      tiltRef.current.recoilZ *= 0.84;
      tiltRef.current.scale += (1 - tiltRef.current.scale) * 0.14;

      // Subtle organic idle breathing
      const now = performance.now();
      const idleY = Math.sin(now * 0.0018) * 3.5;
      const idleRotZ = Math.sin(now * 0.0012) * 0.6;

      setTiltState({
        rotX: tiltRef.current.rotX,
        rotY: tiltRef.current.rotY,
        recoilX: tiltRef.current.recoilX,
        recoilY: tiltRef.current.recoilY,
        recoilZ: tiltRef.current.recoilZ,
        scale: tiltRef.current.scale,
        idleY,
        idleRotZ,
      });

      // Advance shockwaves
      setShockwaves((prev) =>
        prev
          .map((sw) => ({ ...sw, progress: sw.progress + 0.06 }))
          .filter((sw) => sw.progress <= 1.0)
      );

      // Advance sparks
      setSparks((prev) =>
        prev
          .map((s) => ({
            ...s,
            x: s.x + s.vx * 0.12,
            y: s.y + s.vy * 0.12 + 0.15, // gravity
            alpha: s.alpha - 0.045,
          }))
          .filter((s) => s.alpha > 0)
      );
    };

    updatePhysics();
    return () => cancelAnimationFrame(animId);
  }, []);

  // Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key.toUpperCase();
      let matchedZone: DrumZone | undefined;

      if (key === "B" || e.code === "Space") matchedZone = DRUM_ZONES.find((z) => z.id === "bass");
      else if (key === "S") matchedZone = DRUM_ZONES.find((z) => z.id === "snare");
      else if (key === "H") matchedZone = DRUM_ZONES.find((z) => z.id === "hihat");
      else if (key === "T") matchedZone = DRUM_ZONES.find((z) => z.id === "tom1");
      else if (key === "G") matchedZone = DRUM_ZONES.find((z) => z.id === "tom2");
      else if (key === "F") matchedZone = DRUM_ZONES.find((z) => z.id === "floorTom");
      else if (key === "C") matchedZone = DRUM_ZONES.find((z) => z.id === "crash");
      else if (key === "R") matchedZone = DRUM_ZONES.find((z) => z.id === "ride");

      if (matchedZone) {
        e.preventDefault();
        executeStrike(matchedZone);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle external trigger prop
  useEffect(() => {
    if (activeTrigger) {
      const zone = DRUM_ZONES.find((z) => z.id === activeTrigger);
      if (zone) executeStrike(zone);
    }
  }, [activeTrigger]);

  const totalRotX = tiltState.rotX + tiltState.recoilX;
  const totalRotY = tiltState.rotY + tiltState.recoilY;
  const totalRotZ = tiltState.idleRotZ;
  const totalTransY = tiltState.idleY + tiltState.recoilZ * -0.15;
  const totalTransZ = tiltState.recoilZ;
  const totalScale = tiltState.scale;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        perspective: "1100px",
      }}
    >
      {/* Drum Stage Wrapper with Buttery 3D Perspective Tilt & Strike Recoil */}
      <div
        style={{
          position: "relative",
          width: "min(640px, 92vw)",
          aspectRatio: "1 / 1",
          transform: `
            rotateX(${totalRotX}deg)
            rotateY(${totalRotY}deg)
            rotateZ(${totalRotZ}deg)
            translateY(${totalTransY}px)
            translateZ(${totalTransZ}px)
            scale(${totalScale})
          `,
          transformStyle: "preserve-3d",
          transition: "transform 0.04s ease-out",
          filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.65))",
          willChange: "transform",
        }}
      >
        {/* Real Drum Set High-Resolution Cutout (Direct ESM Import to bypass cache) */}
        <img
          src={drumCutoutImg}
          alt="Real Classic Rock Drum Kit"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
            pointerEvents: "none",
            transform: "translateZ(8px)",
          }}
        />

        {/* Ambient Floor Shadow Ellipse that dynamically shifts opposite to tilt */}
        <div
          style={{
            position: "absolute",
            bottom: "3%",
            left: "8%",
            width: "84%",
            height: "18%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.65) 0%, transparent 70%)",
            transform: `translate(${-totalRotY * 2.2}px, ${totalRotX * 1.4}px) scale(${1 + totalTransZ * 0.005})`,
            transition: "transform 0.08s ease-out",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* Specular Light Sheen Overlay shifting with tilt */}
        <div
          style={{
            position: "absolute",
            inset: "5%",
            borderRadius: "50%",
            background: `radial-gradient(circle at ${50 + totalRotY * 3}% ${50 - totalRotX * 3}%, rgba(255, 255, 255, 0.1) 0%, transparent 65%)`,
            pointerEvents: "none",
            mixBlendMode: "overlay",
            zIndex: 6,
          }}
        />

        {/* SVG Interactive Hit Detection Overlay & Shockwaves */}
        <svg
          viewBox="0 0 100 100"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            overflow: "visible",
            zIndex: 10,
          }}
        >
          <defs>
            <filter id="strikeBloom">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Interactive Clickable Drum Zones */}
          {DRUM_ZONES.map((zone) => {
            const isHovered = hoveredZone?.id === zone.id;
            const isHit = recentHitZone?.id === zone.id;

            return (
              <g
                key={zone.id}
                onClick={() => executeStrike(zone)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  executeStrike(zone);
                }}
                onMouseEnter={() => setHoveredZone(zone)}
                onMouseLeave={() => setHoveredZone(null)}
                style={{ cursor: "pointer", touchAction: "manipulation" }}
              >
                {/* Visual Hitbox Target with subtle breathing glow */}
                <ellipse
                  cx={zone.x}
                  cy={zone.y}
                  rx={zone.width / 2}
                  ry={zone.height / 2}
                  fill={isHit ? zone.accentColor : isHovered ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.01)"}
                  fillOpacity={isHit ? 0.35 : isHovered ? 0.25 : 0.01}
                  stroke={isHit ? "#ffffff" : isHovered ? zone.accentColor : "transparent"}
                  strokeWidth={isHit ? 0.8 : isHovered ? 0.5 : 0}
                  strokeDasharray={isHovered ? "2 2" : "none"}
                  filter={isHit || isHovered ? "url(#strikeBloom)" : "none"}
                  style={{
                    transition: "fill 0.08s, stroke 0.08s",
                  }}
                />

                {/* Key Shortcut Badge floating inside zone */}
                <g transform={`translate(${zone.x}, ${zone.y})`}>
                  <rect
                    x="-3.5"
                    y="-3"
                    width="7"
                    height="6"
                    rx="1.5"
                    fill={isHit ? zone.accentColor : isHovered ? "#ffffff" : "rgba(20, 24, 30, 0.75)"}
                    stroke={isHit || isHovered ? "#ffffff" : "rgba(255,255,255,0.3)"}
                    strokeWidth="0.3"
                  />
                  <text
                    x="0"
                    y="1.5"
                    textAnchor="middle"
                    fill={isHit ? "#000000" : isHovered ? "#000000" : "#ffffff"}
                    fontSize="3.2"
                    fontWeight="900"
                    fontFamily="monospace"
                  >
                    {zone.key}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Kinetic Expanding Shockwaves */}
          {shockwaves.map((sw) => {
            const rOuter = sw.progress * 18;
            const rInner = sw.progress * 10;
            const opacity = Math.max(0, 1 - sw.progress);

            return (
              <g key={sw.id} style={{ pointerEvents: "none" }}>
                <ellipse
                  cx={sw.x}
                  cy={sw.y}
                  rx={rOuter}
                  ry={rOuter * 0.45}
                  fill="none"
                  stroke={sw.color}
                  strokeWidth={Math.max(0.2, 1.2 * (1 - sw.progress))}
                  opacity={opacity}
                  filter="url(#strikeBloom)"
                />
                <ellipse
                  cx={sw.x}
                  cy={sw.y}
                  rx={rInner}
                  ry={rInner * 0.45}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={Math.max(0.1, 0.6 * (1 - sw.progress))}
                  opacity={opacity * 0.85}
                />
                {/* Central Flare on impact moment */}
                {sw.progress < 0.25 && (
                  <ellipse
                    cx={sw.x}
                    cy={sw.y}
                    rx={5}
                    ry={2}
                    fill="#ffffff"
                    opacity={1 - sw.progress * 4}
                    filter="blur(1px)"
                  />
                )}
              </g>
            );
          })}

          {/* Bursting Kinetic Sparks */}
          {sparks.map((sp) => (
            <circle
              key={sp.id}
              cx={sp.x}
              cy={sp.y}
              r={sp.size * 0.25}
              fill={sp.color}
              opacity={sp.alpha}
              style={{ pointerEvents: "none" }}
              filter="drop-shadow(0 0 1px #fff)"
            />
          ))}


        </svg>

        {/* Hover Tooltip Pill */}
        {hoveredZone && (
          <div
            style={{
              position: "absolute",
              top: "-42px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(18, 20, 24, 0.92)",
              backdropFilter: "blur(8px)",
              border: `1.5px solid ${hoveredZone.accentColor}`,
              padding: "6px 18px",
              borderRadius: "20px",
              color: "#ded8ce",
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "1px",
              boxShadow: `0 8px 25px rgba(0, 0, 0, 0.6), 0 0 15px ${hoveredZone.accentColor}44`,
              pointerEvents: "none",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              zIndex: 30,
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: hoveredZone.accentColor,
                boxShadow: `0 0 8px ${hoveredZone.accentColor}`,
              }}
            />
            <span>{hoveredZone.name}</span>
            <kbd
              style={{
                backgroundColor: "#2a2c30",
                padding: "2px 6px",
                borderRadius: "4px",
                color: "#ffffff",
                fontSize: "11px",
                fontFamily: "monospace",
              }}
            >
              Key {hoveredZone.key}
            </kbd>
          </div>
        )}
      </div>
    </div>
  );
};
