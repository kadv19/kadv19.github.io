export const NAV_ITEMS = [
  { id: "hero", label: "Overview", short: "00" },
  { id: "about", label: "Philosophy", short: "01" },
  { id: "work", label: "Selected Work", short: "02" },
  { id: "systems", label: "Technical Identity", short: "03" },
  { id: "journey", label: "Journey", short: "04" },
  { id: "exploration", label: "Current Exploration", short: "05" },
  { id: "quantum", label: "Future Compute", short: "06" },
  { id: "contact", label: "Contact", short: "07" },
] as const;

export type NavId = (typeof NAV_ITEMS)[number]["id"];
