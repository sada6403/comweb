import { Link } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { NAV_LINKS } from "../../lib/constants";
import Logo from "../ui/Logo";
import Icon from "../ui/Icon";
import styles from "./Footer.module.css";

export default function Footer() {
  const { company } = useData();
  const year = new Date().getFullYear();

  const socials = [
    ["facebook", "Facebook", company.facebook],
    ["instagram", "Instagram", company.instagram],
    ["linkedin", "LinkedIn", company.linkedin],
  ].filter(([, , href]) => href);

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brandCol}>
            <div className={styles.brand}>
              <Logo company={company} />
              <span>{company.name}</span>
            </div>
            <p className={styles.blurb}>{company.tagline}</p>
          </div>

          <div>
            <div className={styles.colTitle}>Explore</div>
            <div className={styles.list}>
              {NAV_LINKS.map((item) => (
                <Link key={item.to} to={item.to} className={styles.item}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className={styles.colTitle}>Get in touch</div>
            <div className={styles.list}>
              <a href={`mailto:${company.email}`} className={styles.item}>
                <Icon name="mail" size={15} /> {company.email}
              </a>
              <span className={styles.item}>
                <Icon name="whatsapp" size={15} /> +{company.whatsapp}
              </span>
              <span className={styles.item}>
                <Icon name="pin" size={15} /> {company.location}
              </span>
              {socials.map(([key, label, href]) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.item}
                >
                  <Icon name="arrow-up-right" size={15} /> {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {year} {company.name}. All rights reserved.</span>
          <span>Built with care in {company.location}.</span>
        </div>
      </div>
    </footer>
  );
}
