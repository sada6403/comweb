import { Link } from "react-router-dom";
import Icon from "./Icon";
import Heading from "./Heading";

/* Centered section heading: ruled cyan eyebrow + split display title + optional
   lead. Pass `bold`/`thin` for the split heading, or `title` for a plain one. */
export default function SectionHeader({
  eyebrow,
  bold,
  thin,
  title,
  lead,
  link,
  align = "center",
}) {
  return (
    <div
      style={{
        textAlign: align,
        maxWidth: align === "center" ? "46rem" : "none",
        marginInline: align === "center" ? "auto" : "0",
        marginBottom: "var(--space-7)",
      }}
    >
      {eyebrow && <div className="eyebrow eyebrow--rule">{eyebrow}</div>}
      {bold ? (
        <Heading bold={bold} thin={thin} />
      ) : (
        <h2 className="display">{title}</h2>
      )}
      {lead && (
        <p
          className="section-lead"
          style={{ marginInline: align === "center" ? "auto" : "0" }}
        >
          {lead}
        </p>
      )}
      {link && (
        <Link to={link.to} className="btn btn--ghost btn--sm" style={{ marginTop: "var(--space-4)" }}>
          {link.label} <Icon name="arrow" size={15} />
        </Link>
      )}
    </div>
  );
}
