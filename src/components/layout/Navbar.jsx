import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { NAV_LINKS } from "../../lib/constants";
import Logo from "../ui/Logo";
import Icon from "../ui/Icon";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { company } = useData();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Transparent only at the top of the home hero; solid everywhere else.
  const solid = scrolled || pathname !== "/" || open;

  return (
    <header className={`${styles.nav} ${solid ? styles.solid : ""}`}>
      <div className="container">
        <div className={styles.inner}>
          <Link to="/" className={styles.brand} aria-label={`${company.name} home`}>
            <Logo company={company} />
            <span>{company.name}</span>
          </Link>

          <nav className={styles.links} aria-label="Primary">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className={styles.actions}>
            <Link to="/contact" className={`btn btn--primary btn--sm ${styles.desktopCta}`}>
              Start a project
            </Link>
            <button
              className={styles.menuBtn}
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <Icon name={open ? "close" : "menu"} size={22} />
            </button>
          </div>
        </div>

        <div className={`${styles.mobile} ${open ? styles.open : ""}`}>
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={closeMenu}
              className={({ isActive }) =>
                `${styles.mobileLink} ${isActive ? styles.active : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/contact"
            onClick={closeMenu}
            className="btn btn--primary btn--block"
            style={{ marginTop: 8 }}
          >
            Start a project
          </Link>
        </div>
      </div>
    </header>
  );
}
