"use client";

import { motion, type MotionProps } from "framer-motion";
import { PropsWithChildren } from "react";

type RevealProps = PropsWithChildren<
  {
    className?: string;
    blur?: boolean;
    y?: number;
    delay?: number;
  } & MotionProps
>;

export function Reveal({
  children,
  className,
  blur = false,
  y = 14,
  delay = 0,
  ...rest
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: blur ? "blur(8px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function RevealStagger({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
