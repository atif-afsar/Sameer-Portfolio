import { motion, AnimatePresence } from "framer-motion";
import { memo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navLinks, PANEL_NAV_EVENT } from "../data/panelNavigation";

function navigateToPanel(panelId) {
  window.dispatchEvent(
    new CustomEvent(PANEL_NAV_EVENT, { detail: { panelId } })
  );
}

export default memo(function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handlePanelLink = (panelId) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { panelId } });
    } else {
      navigateToPanel(panelId);
    }
    setMobileOpen(false);
  };

  const handleLinkClick = (e, panelId) => {
    e.preventDefault();
    handlePanelLink(panelId);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <motion.div
        initial={{ scaleX: 0.08, opacity: 0, y: -4 }}
        animate={{ scaleX: 1, opacity: 1, y: 0 }}
        transition={{
          scaleX: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.15 },
          opacity: { duration: 0.25, delay: 0.1 },
          y: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 },
        }}
        style={{ transformOrigin: "center top", willChange: "transform, opacity" }}
        className="w-full bg-white/70 backdrop-blur-xl border-b border-black/5"
      >
        <div className="w-full px-4 sm:px-6 md:px-12 py-4 md:py-5 flex items-center justify-between gap-4">
          <motion.a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handlePanelLink("home");
            }}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: "transform, opacity" }}
            className="shrink-0 text-black text-[20px] sm:text-[23px] font-semibold tracking-[-0.025em] leading-none"
          >
            sameer.
          </motion.a>

          <div className="hidden min-w-0 flex-1 items-center justify-end gap-3 overflow-x-auto no-scrollbar md:flex lg:gap-5">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.panelId}
                href={`/#${link.panelId}`}
                onClick={(e) => handleLinkClick(e, link.panelId)}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.85 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="shrink-0 whitespace-nowrap text-black/60 hover:text-black transition-colors duration-200 text-[9px] uppercase tracking-[0.18em] font-medium lg:text-[10px] lg:tracking-[0.2em]"
              >
                {link.label}
              </motion.a>
            ))}
          </div>

          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="shrink-0 md:hidden inline-flex items-center justify-center text-black/80 hover:text-black text-[10px] uppercase tracking-[0.22em] border border-black/20 bg-black/5 hover:bg-black/12 rounded-full px-3 py-1.5 transition-colors duration-150"
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: "transform, opacity" }}
            className="md:hidden w-full bg-white/85 backdrop-blur-xl border-b border-black/5"
          >
            <div className="px-4 sm:px-6 py-4 flex flex-col max-h-[70vh] overflow-y-auto">
              {navLinks.map((link, i) => (
                <a
                  key={link.panelId}
                  href={`/#${link.panelId}`}
                  onClick={(e) => handleLinkClick(e, link.panelId)}
                  className={`text-black/70 hover:text-black transition-colors duration-150 text-[11px] uppercase tracking-[0.22em] font-medium py-3 ${
                    i !== navLinks.length - 1 ? "border-b border-black/5" : ""
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
