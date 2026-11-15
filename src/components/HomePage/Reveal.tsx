import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Seconds to wait before starting, to stagger neighbours. */
  delay?: number;
  /** Where it comes from: a short slide up (default), from the right, or none. */
  from?: "below" | "right" | "none";
  /** Animate as soon as the page loads (above the fold) instead of on scroll. */
  onLoad?: boolean;
}

const OFFSET = { below: { y: 24 }, right: { x: 32 }, none: {} } as const;

/**
 * Gentle fade-in as a section scrolls into view. Plays once (no fading back
 * out when scrolling past) and is skipped for people who prefer reduced motion.
 */
const Reveal = ({ children, className, delay = 0, from = "below", onLoad }: RevealProps) => {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;

  const hidden = { opacity: 0, ...OFFSET[from] };
  const shown = { opacity: 1, x: 0, y: 0 };
  const transition = { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] };

  return (
    <motion.div
      className={className}
      initial={hidden}
      {...(onLoad
        ? { animate: shown }
        : { whileInView: shown, viewport: { once: true, amount: 0.2 } })}
      transition={transition}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
