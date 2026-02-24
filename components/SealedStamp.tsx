"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * A rubber-stamp overlay that springs in on mount, holds briefly, then fades.
 * Drop it inside a `relative overflow-hidden` container.
 */
export function SealedStamp() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          <motion.div
            className="rounded-xl border-[3px] border-emerald-400/75 px-7 py-3 bg-emerald-400/5"
            initial={{ scale: 2.8, rotate: -14, opacity: 0 }}
            animate={{ scale: 1, rotate: -10, opacity: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 16 }}
          >
            <span className="text-emerald-400/85 font-black text-xl tracking-[0.4em] uppercase select-none">
              Sealed
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
