import { useState } from "react";

/* Company logo: uses an uploaded/linked image when present and it loads,
   otherwise falls back to a clean "NF" monogram tile. */
export default function Logo({ company, size = 34 }) {
  const [failed, setFailed] = useState(false);

  if (company.logo_url && !failed) {
    return (
      <img
        src={company.logo_url}
        alt={company.name}
        onError={() => setFailed(true)}
        style={{ height: size, width: "auto", maxWidth: size * 1.6, objectFit: "contain" }}
      />
    );
  }

  // Monogram from the first two letters of the name (e.g. "NF").
  const initials = (company.name || "NF").replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase();

  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 9,
        background: "var(--accent-grad)",
        color: "#fff",
        fontWeight: 800,
        letterSpacing: "-0.02em",
        fontSize: size * 0.42,
        boxShadow: "var(--shadow-accent)",
      }}
    >
      {initials || "NF"}
    </span>
  );
}
