import { useData } from "../context/DataContext";
import { openWhatsApp } from "../lib/whatsapp";
import ReviewCard from "../components/sections/ReviewCard";
import StarRating from "../components/ui/StarRating";
import Heading from "../components/ui/Heading";
import Reveal, { RevealGroup, RevealItem } from "../components/ui/Reveal";
import Icon from "../components/ui/Icon";

export default function Reviews() {
  const { reviews, company } = useData();
  const avg = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div style={{ marginBottom: "var(--space-7)" }}>
            <div className="eyebrow eyebrow--rule">Reviews</div>
            <Heading bold="What" thin="clients say" />
            <div className="cluster" style={{ marginTop: "var(--space-4)" }}>
              <span style={{ fontSize: "var(--fs-2xl)", fontWeight: 800, color: "var(--accent-strong)" }}>
                {avg}
              </span>
              <StarRating rating={Math.round(Number(avg))} size={18} />
              <span className="text-muted">
                based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </Reveal>

        <RevealGroup className="grid cols-3">
          {reviews.map((r) => (
            <RevealItem key={r.id}>
              <ReviewCard review={r} />
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <div style={{ textAlign: "center", marginTop: "var(--space-8)" }}>
            <p className="text-secondary" style={{ marginBottom: "var(--space-4)" }}>
              Worked with us? We'd love to hear about it.
            </p>
            <button
              className="btn btn--whatsapp"
              onClick={() =>
                openWhatsApp(
                  company.whatsapp,
                  `Hi ${company.name}, I'd like to share feedback about a project.`
                )
              }
            >
              <Icon name="whatsapp" size={18} /> Share your feedback
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
