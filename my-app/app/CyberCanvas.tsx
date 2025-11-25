"use client";

import { useEffect, useRef } from "react";

export default function CyberCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize particles
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      color: string;
    }

    let particles: Particle[] = [];
    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedY: Math.random() * 1 + 0.5,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      });
    }

    // Animation loop
    let animationId: number;
    function animate() {
      if (!canvas || !ctx) return;

      ctx.fillStyle = "rgba(13, 13, 13, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = p.color;
        ctx.fill();

        p.y += p.speedY;
        if (p.y > canvas.height) p.y = 0;
      });

      animationId = requestAnimationFrame(animate);
    }
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="cyberCanvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        backgroundColor: "#0d0d0d",
      }}
    />
  );
}
