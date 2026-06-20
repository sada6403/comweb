import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppFab from "./WhatsAppFab";
import ScrollProgress from "./ScrollProgress";

/* Public site shell: fixed nav, footer, scroll bar, WhatsApp FAB around an
   animated page outlet. The nav overlays the home hero, so only non-home pages
   need a spacer beneath the fixed bar. */
export default function Layout() {
  const location = useLocation();
  const reduced = useReducedMotion();
  const isHome = location.pathname === "/";

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main">
        {!isHome && <div style={{ height: "var(--nav-h)" }} aria-hidden="true" />}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
