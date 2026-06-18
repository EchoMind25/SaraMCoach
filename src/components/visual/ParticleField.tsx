"use client";

import { useEffect, useRef } from "react";
import styles from "./ParticleField.module.css";

type ParticleFieldProps = {
  className?: string;
  /** Pixels of area per particle. Higher = sparser. Default 9000. */
  density?: number;
  /** Hard cap on particle count for large viewports. Default 140. */
  maxParticles?: number;
};

type Particle = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  vx: number;
  vy: number;
  density: number;
};

const REPEL_RADIUS = 120;
const LINK_THRESHOLD = 90;

/**
 * ParticleField — Canvas 2D particle mesh for the hero.
 * Particles drift slowly; lines connect neighbors within 90px; particles
 * within 120px of the pointer repel. Pure Canvas + rAF (no Three.js).
 * Pauses when offscreen or the tab is hidden, and is disabled entirely
 * under prefers-reduced-motion.
 */
export function ParticleField({
  className,
  density = 9000,
  maxParticles = 140,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const host = canvas.parentElement ?? canvas;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: null as number | null, y: null as number | null };

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let running = false;

    const makeParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      density: Math.random() * 10 + 4,
    });

    const seed = () => {
      const count = Math.min(
        Math.floor((width * height) / density),
        maxParticles,
      );
      particles = Array.from({ length: Math.max(count, 0) }, makeParticle);
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < REPEL_RADIUS && d > 0) {
            const force = (REPEL_RADIUS - d) / REPEL_RADIUS;
            p.x -= (dx / d) * force * p.density * 0.35;
            p.y -= (dy / d) * force * p.density * 0.35;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(108, 99, 255, ${p.opacity})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK_THRESHOLD) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(108, 99, 255, ${0.08 * (1 - d / LINK_THRESHOLD)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      if (running) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };
    const handlePointerLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) start();
          else stop();
        }
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(host);

    host.addEventListener("pointermove", handlePointerMove);
    host.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      host.removeEventListener("pointermove", handlePointerMove);
      host.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [density, maxParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={[styles.canvas, className].filter(Boolean).join(" ")}
      aria-hidden="true"
    />
  );
}
