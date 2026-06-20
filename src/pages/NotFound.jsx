import { Link } from "react-router-dom";
import Icon from "../components/ui/Icon";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container container--narrow" style={{ textAlign: "center" }}>
        <span className="eyebrow eyebrow--rule">404</span>
        <h1 className="display" style={{ margin: "0 auto" }}>
          Page <strong>not found</strong>
        </h1>
        <p className="section-lead" style={{ margin: "var(--space-4) auto var(--space-6)" }}>
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link to="/" className="btn btn--primary">
          Back home <Icon name="arrow" size={16} />
        </Link>
      </div>
    </section>
  );
}
