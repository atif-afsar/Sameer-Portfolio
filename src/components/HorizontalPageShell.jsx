import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import ExpertiseSection from "./ExpertiseSection";
import Home from "../pages/Home";
import ReelsSection from "../pages/ReelsSection";
import PerformanceSection from "../pages/PerformanceSection";
import ExperienceSection from "../pages/ExperienceSection";
import Anime from "../pages/Anime";
import { expertiseSections } from "../data/expertiseData";

const PERFORMANCE_PANEL_INDEX = 2;
const EXPERTISE_START_INDEX = 3;
const EXPERIENCE_PANEL_INDEX = EXPERTISE_START_INDEX + expertiseSections.length;
const ANIME_PANEL_INDEX = EXPERIENCE_PANEL_INDEX + 1;
const PANEL_COUNT = ANIME_PANEL_INDEX + 1;
const PANEL_TRANSITION_MS = 560;

export default function HorizontalPageShell() {
  const [activePanel, setActivePanel] = useState(0);
  const activePanelRef = useRef(0);
  const panelLockRef = useRef(false);

  const panelOffset = useSpring(0, { stiffness: 82, damping: 28, mass: 0.9 });
  const trackX = useTransform(panelOffset, (value) => `${value}vw`);

  useEffect(() => {
    activePanelRef.current = activePanel;
  }, [activePanel]);

  const goToPanel = useCallback((index) => {
    if (panelLockRef.current) return;
    if (index < 0 || index >= PANEL_COUNT || index === activePanelRef.current) return;

    panelLockRef.current = true;
    activePanelRef.current = index;
    setActivePanel(index);

    window.setTimeout(() => {
      panelLockRef.current = false;
    }, PANEL_TRANSITION_MS);
  }, []);

  useEffect(() => {
    panelOffset.set(activePanel * -100);
  }, [activePanel, panelOffset]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("horizontal-shell-active");

    return () => {
      root.classList.remove("horizontal-shell-active");
    };
  }, []);

  const expertiseStartIndex = EXPERTISE_START_INDEX;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#f7f5ef]">
      <motion.div
        className="flex h-full will-change-transform"
        style={{ width: `${PANEL_COUNT * 100}vw`, x: trackX }}
      >
        <div className="h-full w-screen shrink-0">
          <Home
            isActive={activePanel === 0}
            onReachEnd={() => goToPanel(1)}
          />
        </div>

        <div className="h-full w-screen shrink-0">
          <ReelsSection
            isActive={activePanel === 1}
            onReachStart={() => goToPanel(0)}
            onReachEnd={() => goToPanel(PERFORMANCE_PANEL_INDEX)}
          />
        </div>

        <div className="h-full w-screen shrink-0">
          <PerformanceSection
            isActive={activePanel === PERFORMANCE_PANEL_INDEX}
            onReachStart={() => goToPanel(1)}
            onReachEnd={() => goToPanel(EXPERTISE_START_INDEX)}
          />
        </div>

        {expertiseSections.map((section, index) => {
          const panelIndex = expertiseStartIndex + index;

          return (
            <div key={section.id} className="h-full w-screen shrink-0">
              <ExpertiseSection
                {...section}
                isActive={activePanel === panelIndex}
                onReachStart={() => goToPanel(panelIndex - 1)}
                onReachEnd={() => goToPanel(panelIndex + 1)}
              />
            </div>
          );
        })}

        <div className="h-full w-screen shrink-0">
          <ExperienceSection
            isActive={activePanel === EXPERIENCE_PANEL_INDEX}
            onReachStart={() => goToPanel(EXPERIENCE_PANEL_INDEX - 1)}
            onReachEnd={() => goToPanel(ANIME_PANEL_INDEX)}
          />
        </div>

        <div className="h-full w-screen shrink-0">
          <Anime
            isActive={activePanel === ANIME_PANEL_INDEX}
            onReachStart={() => goToPanel(EXPERIENCE_PANEL_INDEX)}
            onBackToTop={() => goToPanel(0)}
          />
        </div>
      </motion.div>
    </div>
  );
}
