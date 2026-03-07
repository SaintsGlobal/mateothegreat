// FD-019: Particle constellation background effect

"use client";

import { useCallback, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ParticleBackgroundProps {
  particleCount?: number;
  color?: string[];
  speed?: number;
  connectLines?: boolean;
  className?: string;
}

export function ParticleBackground({
  particleCount = 50,
  color = ["#8b5cf6", "#06b6d4"],
  speed = 1,
  connectLines = true,
  className = "",
}: ParticleBackgroundProps) {
  const [init, setInit] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const count = isMobile ? Math.min(particleCount, 20) : particleCount;

  const options: ISourceOptions = {
    fullScreen: false,
    fpsLimit: 60,
    particles: {
      number: { value: count },
      color: { value: color },
      links: {
        enable: connectLines,
        color: color[0],
        opacity: 0.3,
        distance: 150,
      },
      move: {
        enable: !prefersReducedMotion,
        speed: speed,
        direction: "none",
        outModes: { default: "bounce" },
      },
      size: { value: { min: 1, max: 3 } },
      opacity: { value: { min: 0.3, max: 0.7 } },
    },
    detectRetina: true,
  };

  const particlesLoaded = useCallback(async () => {}, []);

  if (prefersReducedMotion || !init) {
    return null;
  }

  return (
    <Particles
      className={`absolute inset-0 pointer-events-none ${className}`}
      options={options}
      particlesLoaded={particlesLoaded}
    />
  );
}
