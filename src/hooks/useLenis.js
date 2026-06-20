import { useEffect } from "react";
import Lenis from "lenis";

/* Initialises Lenis smooth scrolling once for the whole app and drives it from
   requestAnimationFrame. Respects prefers-reduced-motion: when the user opts
   out, we skip Lenis entirely and leave native scrolling in place. */
export function useLenis() {
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let frame;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
}
