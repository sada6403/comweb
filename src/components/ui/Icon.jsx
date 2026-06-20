/* Single inline-SVG icon set. All icons inherit `currentColor` so they take the
   surrounding text colour. Stroke icons share a 1.7 weight for consistency. */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const PATHS = {
  code: <path d="M9 18l-5-6 5-6M15 6l5 6-5 6" {...stroke} />,
  layout: (
    <g {...stroke}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 9v12" />
    </g>
  ),
  "device-mobile": (
    <g {...stroke}>
      <rect x="6" y="2" width="12" height="20" rx="2.5" />
      <path d="M11 18h2" />
    </g>
  ),
  database: (
    <g {...stroke}>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </g>
  ),
  palette: (
    <g>
      <path d="M12 2a10 10 0 1 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4c2.3 0 4.1-1.8 4.1-4.1C21.5 6 17.2 2 12 2z" {...stroke} />
      <circle cx="7.5" cy="10.5" r="1.1" fill="currentColor" />
      <circle cx="11" cy="7" r="1.1" fill="currentColor" />
      <circle cx="16" cy="8.5" r="1.1" fill="currentColor" />
    </g>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" {...stroke} />,
  "arrow-up-right": <path d="M7 17L17 7M8 7h9v9" {...stroke} />,
  whatsapp: (
    <path
      fill="currentColor"
      d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.62 1.45 5.14L2 22l5.1-1.55a9.85 9.85 0 0 0 4.93 1.32h.01c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.78 14.06c-.25.7-1.43 1.34-1.97 1.42-.5.08-1.13.11-1.83-.12-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.16-4.93-4.35-.14-.19-1.18-1.57-1.18-3 0-1.42.74-2.12 1-2.41.26-.29.57-.36.76-.36.19 0 .38 0 .54.01.17.01.41-.07.64.49.25.6.83 2.07.9 2.22.07.15.12.33.02.52-.09.19-.14.31-.28.48-.14.17-.29.38-.42.51-.14.14-.28.29-.12.57.16.28.74 1.22 1.59 1.97 1.1.98 2.02 1.28 2.31 1.42.29.14.46.12.63-.05.17-.17.71-.83.9-1.11.19-.28.38-.24.64-.14.26.1 1.63.77 1.91.91.28.14.46.21.53.33.07.12.07.69-.18 1.39z"
    />
  ),
  check: <path d="M5 13l4 4L19 7" {...stroke} strokeWidth="2" />,
  star: (
    <path
      fill="currentColor"
      d="M12 2.5l3.09 6.26 6.91 1-5 4.87 1.18 6.88L12 17.77l-6.18 3.74L7 14.63l-5-4.87 6.91-1L12 2.5z"
    />
  ),
  quote: (
    <path
      fill="currentColor"
      d="M7.17 6A5.17 5.17 0 0 0 2 11.17V18h6.83v-6.83H4.5c.1-2 1.7-3.5 3.67-3.5V6zm9.66 0A5.17 5.17 0 0 0 11.66 11.17V18h6.83v-6.83h-4.33c.1-2 1.7-3.5 3.67-3.5V6z"
    />
  ),
  lock: (
    <g {...stroke}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </g>
  ),
  plus: <path d="M12 5v14M5 12h14" {...stroke} />,
  trash: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" {...stroke} />,
  edit: <path d="M4 20h4l10-10-4-4L4 16v4zM13.5 6.5l4 4" {...stroke} />,
  logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" {...stroke} />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" {...stroke} />,
  close: <path d="M6 6l12 12M18 6L6 18" {...stroke} />,
  mail: (
    <g {...stroke}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </g>
  ),
  pin: (
    <g {...stroke}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </g>
  ),
  spark: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" {...stroke} />,
};

export default function Icon({ name, size = 20, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
      style={{ display: "block", flexShrink: 0 }}
    >
      {PATHS[name] || PATHS.code}
    </svg>
  );
}
