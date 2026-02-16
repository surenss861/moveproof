"use client";

import { PropsWithChildren, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function GSAPScrollProvider({ children }: PropsWithChildren) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }
    const ctx = gsap.context(() => {}, rootRef);
    return () => ctx.revert();
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
