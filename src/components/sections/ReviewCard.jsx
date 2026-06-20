import { avatarFor } from "../../lib/images";
import Icon from "../ui/Icon";
import StarRating from "../ui/StarRating";
import styles from "./ReviewCard.module.css";

export default function ReviewCard({ review }) {
  return (
    <article className={`card card--interactive ${styles.card}`}>
      <span className={styles.quote}>
        <Icon name="quote" size={26} />
      </span>
      <StarRating rating={review.rating} />
      <p className={styles.text}>{review.text}</p>

      <div className={styles.person}>
        <img
          className={styles.avatar}
          src={avatarFor(review.id)}
          alt={review.name}
          loading="lazy"
        />
        <div>
          <div className={styles.name}>{review.name}</div>
          <div className={styles.role}>{review.role}</div>
        </div>
      </div>

      {review.service && (
        <span className={`badge badge--neutral ${styles.service}`}>
          {review.service}
        </span>
      )}
    </article>
  );
}
