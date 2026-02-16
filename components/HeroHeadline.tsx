"use client";

import { motion } from "framer-motion";

const words = "Don't let your landlord keep your money.".split(" ");
const STAGGER = 0.06;
const DURATION = 0.4;
const EASE = [0.25, 0.1, 0.25, 1];

export function HeroHeadline() {
  return (
    <h1 className="text-4xl sm:text-5xl font-bold text-white leading-[1.15] tracking-tight mb-5">
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: DURATION,
            delay: i * STAGGER,
            ease: EASE,
          }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}
