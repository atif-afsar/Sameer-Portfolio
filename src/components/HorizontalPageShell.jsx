import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import Home from "../pages/Home";
import ReelsSection from "../pages/ReelsSection";
import DigitalMarketingSection from "../pages/DigitalMarketingSection";

const PANEL_COUNT = 3;

export default function HorizontalPageShell() {
  const [activePanel, setActivePanel] = useState(0);

  const panelOffset = useSpring(0, { stiffness: 88, damping: 26, mass: 0.85 });
  const trackX = useTransform(panelOffset, (value) => `${value}vw`);

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

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#f7f5ef]">
      <motion.div
        className="flex h-full will-change-transform"
        style={{ width: `${PANEL_COUNT * 100}vw`, x: trackX }}
      >
        <div className="h-full w-screen shrink-0">
          <Home
            isActive={activePanel === 0}
            onReachEnd={() => setActivePanel(1)}
          />
        </div>

        <div className="h-full w-screen shrink-0">
          <ReelsSection
            isActive={activePanel === 1}
            onReachStart={() => setActivePanel(0)}
            onReachEnd={() => setActivePanel(2)}
          />
        </div>

        <div className="h-full w-screen shrink-0">
          <DigitalMarketingSection
            isActive={activePanel === 2}
            onReachStart={() => setActivePanel(1)}
          />
        </div>
      </motion.div>
    </div>
  );
}
