import { Link } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { openWhatsApp } from "../../lib/whatsapp";
import { CONTACT_IMG } from "../../lib/images";
import Reveal from "../ui/Reveal";
import Heading from "../ui/Heading";
import Icon from "../ui/Icon";
import styles from "./CTASection.module.css";

/* Full-bleed corporate photo band with a navy overlay and a clear CTA, echoing
   the reference "Contact us today" section. */
export default function CTASection({
  bold = "Contact us",
  thin = "today!",
  text = "Tell us what you need and we'll reply with a clear plan and a fixed quote — usually within a day.",
}) {
  const { company } = useData();

  return (
    <section className={styles.band}>
      <div className={styles.bg} style={{ backgroundImage: `url(${CONTACT_IMG})` }} />
      <div className={styles.overlay} />
      <div className="container">
        <div className={styles.inner}>
          <Reveal>
            <div className={styles.content}>
              <div className={`eyebrow eyebrow--rule ${styles.eyebrow}`}>
                Get in touch
              </div>
              <Heading bold={bold} thin={thin} className={styles.title} />
              <p className={styles.lead}>{text}</p>
              <div className={styles.ctas}>
                <button
                  className="btn btn--primary"
                  onClick={() =>
                    openWhatsApp(
                      company.whatsapp,
                      `Hi ${company.name}, I'd like to ask about a project.`
                    )
                  }
                >
                  Contact us now
                  <span className="btn__chip"><Icon name="arrow" size={14} /></span>
                </button>
                <Link to="/contact" className="btn btn--ghost-invert">
                  Use the form
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
