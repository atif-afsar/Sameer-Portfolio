import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, useSpring, useTransform } from "framer-motion";
import ExpertiseSection from "./ExpertiseSection";
import Home from "../pages/Home";
import ReelsSection from "../pages/ReelsSection";
import PerformanceSection from "../pages/PerformanceSection";
import ExperienceSection from "../pages/ExperienceSection";
import Anime from "../pages/Anime";
import { expertiseSections } from "../data/expertiseData";
import {
  ANIME_PANEL_INDEX,
  EXPERTISE_START_INDEX,
  EXPERIENCE_PANEL_INDEX,
  getPanelIndex,
  PANEL_COUNT,
  PANEL_NAV_EVENT,
  PERFORMANCE_PANEL_INDEX,
} from "../data/panelNavigation";

const PANEL_TRANSITION_MS = 560;

const PanelSlot = memo(function PanelSlot({ index, activePanel, children }) {
  const isNear = Math.abs(activePanel - index) <= 1;

  return (
    <div
      className="h-full w-screen shrink-0"
      style={{
        contentVisibility: isNear ? "visible" : "auto",
        containIntrinsicSize: "100vw 100vh",
      }}
    >
      {children}
    </div>
  );
});

export default function HorizontalPageShell() {
  const location = useLocation();
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

  const goToHome = useCallback(() => goToPanel(0), [goToPanel]);
  const goToReels = useCallback(() => goToPanel(1), [goToPanel]);
  const goToPerformance = useCallback(() => goToPanel(PERFORMANCE_PANEL_INDEX), [goToPanel]);
  const goToExperience = useCallback(() => goToPanel(EXPERIENCE_PANEL_INDEX), [goToPanel]);
  const goToAnime = useCallback(() => goToPanel(ANIME_PANEL_INDEX), [goToPanel]);

  const goToExpertiseStart = useCallback(
    () => goToPanel(EXPERTISE_START_INDEX),
    [goToPanel]
  );
  const goToExperiencePrev = useCallback(
    () => goToPanel(EXPERIENCE_PANEL_INDEX - 1),
    [goToPanel]
  );

  const expertiseNavCallbacks = useMemo(
    () =>
      expertiseSections.map((_, index) => {
        const panelIndex = EXPERTISE_START_INDEX + index;
        return {
          onReachStart: () => goToPanel(panelIndex - 1),
          onReachEnd: () => goToPanel(panelIndex + 1),
        };
      }),
    [goToPanel]
  );

  useEffect(() => {
    const panelId = location.state?.panelId;
    if (!panelId) return;

    const panelIndex = getPanelIndex(panelId);
    if (panelIndex !== undefined) {
      goToPanel(panelIndex);
    }
  }, [location.state, goToPanel]);

  useEffect(() => {
    const handlePanelNavigate = (event) => {
      const panelId = event.detail?.panelId;
      if (!panelId) return;

      const panelIndex = getPanelIndex(panelId);
      if (panelIndex !== undefined) {
        goToPanel(panelIndex);
      }
    };

    window.addEventListener(PANEL_NAV_EVENT, handlePanelNavigate);
    return () => window.removeEventListener(PANEL_NAV_EVENT, handlePanelNavigate);
  }, [goToPanel]);

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
        <PanelSlot index={0} activePanel={activePanel}>
          <Home isActive={activePanel === 0} onReachEnd={goToReels} />
        </PanelSlot>

        <PanelSlot index={1} activePanel={activePanel}>
          <ReelsSection
            isActive={activePanel === 1}
            onReachStart={goToHome}
            onReachEnd={goToPerformance}
          />
        </PanelSlot>

        <PanelSlot index={PERFORMANCE_PANEL_INDEX} activePanel={activePanel}>
          <PerformanceSection
            isActive={activePanel === PERFORMANCE_PANEL_INDEX}
            onReachStart={goToReels}
            onReachEnd={goToExpertiseStart}
          />
        </PanelSlot>

        {expertiseSections.map((section, index) => {
          const panelIndex = expertiseStartIndex + index;
          const nav = expertiseNavCallbacks[index];

          return (
            <PanelSlot key={section.id} index={panelIndex} activePanel={activePanel}>
              <ExpertiseSection
                {...section}
                isActive={activePanel === panelIndex}
                onReachStart={nav.onReachStart}
                onReachEnd={nav.onReachEnd}
              />
            </PanelSlot>
          );
        })}

        <PanelSlot index={EXPERIENCE_PANEL_INDEX} activePanel={activePanel}>
          <ExperienceSection
            isActive={activePanel === EXPERIENCE_PANEL_INDEX}
            onReachStart={goToExperiencePrev}
            onReachEnd={goToAnime}
          />
        </PanelSlot>

        <PanelSlot index={ANIME_PANEL_INDEX} activePanel={activePanel}>
          <Anime
            isActive={activePanel === ANIME_PANEL_INDEX}
            onReachStart={goToExperience}
            onBackToTop={goToHome}
          />
        </PanelSlot>
      </motion.div>
    </div>
  );
}
