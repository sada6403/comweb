import Icon from "./Icon";

/* Five-star rating. Filled stars use the warm `--star` token; empty stars fall
   back to the border colour. */
export default function StarRating({ rating = 0, size = 15 }) {
  return (
    <div
      style={{ display: "inline-flex", gap: 2 }}
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          style={{ color: n <= rating ? "var(--star)" : "var(--border-strong)" }}
        >
          <Icon name="star" size={size} />
        </span>
      ))}
    </div>
  );
}
