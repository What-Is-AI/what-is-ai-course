"use client";

import { NeuroNoise } from "@paper-design/shaders-react";
import { useEffect, useState } from "react";

export function AboutConstellation() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <div className="about-constellation" aria-hidden>
      <NeuroNoise
        colorFront="#ffffff"
        colorMid="#47a6ff"
        colorBack="#000000"
        brightness={0.01}
        contrast={0.3}
        speed={reduceMotion ? 0 : 0.48}
        scale={0.24}
        rotation={0}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
