import React from "react";
import { HeroSection } from "./components/HeroSection";
import { AnatomySection } from "./components/AnatomySection";
import { MasterclassSection } from "./components/MasterclassSection";
import { BeatMachineSection } from "./components/BeatMachineSection";
import { Footer } from "./components/Footer";
import { SectionTransition } from "./components/SectionTransition";
import { ScrollNavigationRail } from "./components/ScrollNavigationRail";
import "./App.css";

export const App: React.FC = () => {
  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div style={{ width: "100%", overflowX: "hidden", minHeight: "100vh", backgroundColor: "#424447" }}>
      {/* Floating Section Scroll Navigation Rail */}
      <ScrollNavigationRail />

      {/* 1. Hero Section (Classic Rock Kit + Monumental DRUM + Lessons Dock) */}
      <HeroSection onNavigate={handleNavigate} />

      {/* Transition: Hero -> Anatomy */}
      <SectionTransition
        topColor="#383a3c"
        bottomColor="#2c2e30"
        accentColor="rgba(222, 216, 206, 0.45)"
        label="02 • ACOUSTIC PHYSICS"
        nextSectionId="anatomy"
      />

      {/* 2. Sound Physics & Anatomy Inspector */}
      <AnatomySection />

      {/* Transition: Anatomy -> Masterclass Cinema */}
      <SectionTransition
        topColor="#2c2e30"
        bottomColor="#1c1e22"
        accentColor="rgba(0, 240, 255, 0.45)"
        label="03 • CINEMATIC MASTERCLASS"
        nextSectionId="masterclass"
      />

      {/* 3. The 5 Rudiments Masterclass Cinema */}
      <MasterclassSection />

      {/* Transition: Masterclass -> FreeMusic Studio Beat Machine */}
      <SectionTransition
        topColor="#1c1e22"
        bottomColor="#0d0f15"
        accentColor="rgba(56, 189, 248, 0.55)"
        label="04 • FREEMUSIC STUDIO"
        nextSectionId="beat-machine"
      />

      {/* 4. The Studio Beat Machine (MPC Pads + Synth + 16-Step Sequencer) */}
      <BeatMachineSection />

      {/* Transition: Beat Machine -> Footer */}
      <SectionTransition
        topColor="#0d0f15"
        bottomColor="#090a0e"
        accentColor="rgba(255, 255, 255, 0.15)"
      />

      {/* 5. Studio Footer & Shortcuts */}
      <Footer />
    </div>
  );
};

export default App;
