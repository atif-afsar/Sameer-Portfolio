import { expertiseSections } from "./expertiseData";

export const PERFORMANCE_PANEL_INDEX = 2;
export const EXPERTISE_START_INDEX = 3;
export const EXPERIENCE_PANEL_INDEX = EXPERTISE_START_INDEX + expertiseSections.length;
export const ANIME_PANEL_INDEX = EXPERIENCE_PANEL_INDEX + 1;
export const PANEL_COUNT = ANIME_PANEL_INDEX + 1;

export const PANEL_BY_ID = {
  home: 0,
  reels: 1,
  performance: 2,
  ...Object.fromEntries(
    expertiseSections.map((section, index) => [section.id, EXPERTISE_START_INDEX + index])
  ),
  experience: EXPERIENCE_PANEL_INDEX,
  anime: ANIME_PANEL_INDEX,
  footer: ANIME_PANEL_INDEX,
};

export function getPanelIndex(panelId) {
  return PANEL_BY_ID[panelId];
}

export const PANEL_NAV_EVENT = "portfolio-navigate-panel";

const EXPERTISE_NAV_LABELS = {
  digital: "Digital",
  growth: "Growth",
  copywriter: "Copy",
};

export const navLinks = [
  { label: "Home", panelId: "home" },
  { label: "Reels", panelId: "reels" },
  { label: "Metrics", panelId: "performance" },
  ...expertiseSections.map((section) => ({
    label: EXPERTISE_NAV_LABELS[section.id] ?? section.titleLine1,
    panelId: section.id,
  })),
  { label: "Career", panelId: "experience" },
];
