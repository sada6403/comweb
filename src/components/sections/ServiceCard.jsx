import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useData } from "../../context/DataContext";
import { includesFor } from "../../lib/constants";
import { serviceImage } from "../../lib/images";
import { openWhatsApp } from "../../lib/whatsapp";
import Icon from "../ui/Icon";
import styles from "./ServiceCard.module.css";

export default function ServiceCard({ service }) {
  const { company } = useData();
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const includes = includesFor(service.icon);

  const enquire = () =>
    openWhatsApp(
      company.whatsapp,
      `Hi ${company.name}, I'm interested in your "${service.title}" service. Could you share more details and a quote?`
    );

  return (
    <article className={`card card--interactive ${styles.card}`}>
      <div className={styles.media}>
        <img
          className={styles.img}
          src={serviceImage(service.icon)}
          alt={service.title}
          loading="lazy"
        />
        <div className={styles.mediaShade} />
        {service.price_label && (
          <span className={`badge ${styles.priceTag}`}>{service.price_label}</span>
        )}
        <span className={styles.iconTile}>
          <Icon name={service.icon} size={26} />
        </span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{service.title}</h3>
        <p className={styles.summary}>{service.summary}</p>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              className={styles.includes}
              initial={reduced ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduced ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              {includes.map((item) => (
                <span key={item} className={styles.includeRow}>
                  <Icon name="check" size={15} /> {item}
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.actions}>
          <button
            className={styles.disclosure}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            {open ? "Hide details" : "What's included"}
          </button>
          <button
            className={styles.waBtn}
            onClick={enquire}
            aria-label={`Enquire about ${service.title} on WhatsApp`}
          >
            <Icon name="whatsapp" size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
