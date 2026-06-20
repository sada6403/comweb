import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* Resets scroll position to the top on every route change (SPA navigation
   otherwise preserves the previous page's scroll offset). */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}
