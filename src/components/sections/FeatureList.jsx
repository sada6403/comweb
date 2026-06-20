import Icon from "../ui/Icon";

/* Vertical list of "why work with us" points, each with a check marker.
   `invert` styles it for dark backgrounds. */
export default function FeatureList({ features, invert = false }) {
  if (!features?.length) return null;
  return (
    <div className="grid" style={{ gap: "var(--space-4)" }}>
      {features.map((f) => (
        <div
          key={f.id}
          style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-start" }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
              borderRadius: "var(--radius-full)",
              background: invert ? "rgba(26,166,207,0.2)" : "var(--accent-soft)",
              color: invert ? "#7fdcf2" : "var(--accent-strong)",
              flexShrink: 0,
            }}
          >
            <Icon name="check" size={16} />
          </span>
          <span
            style={{
              color: invert ? "var(--text-invert-soft)" : "var(--text-secondary)",
              lineHeight: 1.6,
            }}
          >
            {f.text}
          </span>
        </div>
      ))}
    </div>
  );
}
