import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useData } from "../../context/DataContext";
import { HERO_IMG } from "../../lib/images";
import Heading from "../ui/Heading";
import Counter from "../ui/Counter";
import Icon from "../ui/Icon";
import styles from "./Hero.module.css";

/* Splits the tagline into a bold opener + thin remainder for the display heading. */
function splitTagline(tagline = "") {
  const clean = tagline.replace(/[.]+$/, "");
  const words = clean.split(" ");
  return { bold: words.slice(0, 2).join(" "), thin: words.slice(2).join(" ") };
}

export default function Hero() {
  const { company, stats } = useData();
  const reduced = useReducedMotion();
  const { bold, thin } = splitTagline(company.tagline);

  // Subtle parallax: the background drifts slower than the page.
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  const scale = useTransform(scrollY, [0, 600], [1, 1.12]);

  return (
    <section className={styles.hero}>
      <motion.div
        className={styles.bg}
        style={{
          backgroundImage: `url(${HERO_IMG})`,
          y: reduced ? 0 : y,
          scale: reduced ? 1 : scale,
        }}
        initial={reduced ? false : { scale: 1.15, opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
      <div className={styles.overlay} />

      <div className={`container ${styles.inner}`}>
        <motion.div
          className={styles.copy}
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={`eyebrow eyebrow--rule ${styles.eyebrow}`}>
            {company.name} — Software studio
          </div>

          <Heading as="h1" xl bold={bold} thin={thin} className={styles.title} />

          <p className={styles.lead}>{company.about}</p>

          <div className={styles.ctas}>
            <Link to="/contact" className="btn btn--primary">
              Start a project
              <span className="btn__chip"><Icon name="arrow" size={14} /></span>
            </Link>
            <Link to="/services" className="btn btn--ghost-invert">
              Explore services
            </Link>
          </div>

          {stats.length > 0 && (
            <div className={styles.trust}>
              {stats.slice(0, 3).map((stat, i) => (
                <div key={stat.id} style={{ display: "flex", gap: "var(--space-6)" }}>
                  {i > 0 && <span className={styles.trustDivider} />}
                  <div className={styles.trustItem}>
                    <span className={styles.trustNum}>
                      <Counter to={stat.number} suffix={stat.suffix} />
                    </span>
                    <span className={styles.trustLabel}>{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <div className={styles.scrollHint}>
        <span>Scroll</span>
        <span style={{ transform: "rotate(90deg)", display: "inline-flex" }}>
          <Icon name="arrow" size={14} />
        </span>
      </div>
    </section>
  );
}
