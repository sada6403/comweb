/* Shared constants: navigation, icon catalogue, and the per-service
   "what's included" checklist (keyed by the service's icon). */

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/reviews", label: "Reviews" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const ICON_OPTIONS = [
  { value: "code", label: "Code" },
  { value: "layout", label: "Layout / UI" },
  { value: "device-mobile", label: "Mobile" },
  { value: "database", label: "Database" },
  { value: "palette", label: "Design" },
];

export const SERVICE_INCLUDES = {
  code: [
    "Requirements walkthrough",
    "Responsive build",
    "One round of revisions",
    "Source code handover",
  ],
  layout: [
    "Wireframes & mockups",
    "Design-system basics",
    "Mobile + desktop views",
    "Editable source files",
  ],
  "device-mobile": [
    "UI design + build",
    "Android / cross-platform",
    "Basic backend hookup",
    "Play Store guidance",
  ],
  database: [
    "Schema design",
    "Data entry / migration",
    "Basic reporting view",
    "Staff training notes",
  ],
  palette: [
    "Concept exploration",
    "Two revision rounds",
    "Print + web formats",
    "Source files included",
  ],
};

export const DEFAULT_INCLUDES = [
  "Initial consultation",
  "Drafts for review",
  "Revisions included",
  "Final files delivered",
];

export function includesFor(icon) {
  return SERVICE_INCLUDES[icon] || DEFAULT_INCLUDES;
}
