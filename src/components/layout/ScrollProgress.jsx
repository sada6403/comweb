import { motion, useScroll, useSpring } from "framer-motion";

/* Thin accent bar pinned to the top of the viewport that tracks reading
   progress. Spring-smoothed so it glides rather than jumps. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{
        scaleX,
        transformOrigin: "0%",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: "var(--accent)",
        zIndex: 100,
      }}
    />
  );
}
