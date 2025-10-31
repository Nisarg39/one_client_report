"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface StarsBackgroundProps {
  starDensity?: number;
  allStarsTwinkle?: boolean;
  twinkleProbability?: number;
  minTwinkleSpeed?: number;
  maxTwinkleSpeed?: number;
  className?: string;
}

export const StarsBackground: React.FC<StarsBackgroundProps> = ({
  starDensity = 0.00015,
  allStarsTwinkle = true,
  twinkleProbability = 0.7,
  minTwinkleSpeed = 0.5,
  maxTwinkleSpeed = 1,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Calculate number of stars
    const numStars = Math.floor(canvas.width * canvas.height * starDensity);

    // Star class
    class Star {
      x: number;
      y: number;
      radius: number;
      opacity: number;
      twinkleSpeed: number | null;
      twinkleDirection: number;

      constructor() {
        this.x = Math.random() * (canvas?.width || window.innerWidth);
        this.y = Math.random() * (canvas?.height || window.innerHeight);
        this.radius = Math.random() * 1.5;
        this.opacity = Math.random();

        // Determine if this star should twinkle
        const shouldTwinkle = allStarsTwinkle || Math.random() < twinkleProbability;
        this.twinkleSpeed = shouldTwinkle
          ? Math.random() * (maxTwinkleSpeed - minTwinkleSpeed) + minTwinkleSpeed
          : null;
        this.twinkleDirection = Math.random() < 0.5 ? -1 : 1;
      }

      draw() {
        if (!ctx) return;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }

      update(deltaTime: number) {
        if (this.twinkleSpeed !== null) {
          // Update opacity for twinkling effect
          this.opacity += this.twinkleDirection * this.twinkleSpeed * deltaTime;

          // Reverse direction if limits are reached
          if (this.opacity <= 0) {
            this.opacity = 0;
            this.twinkleDirection = 1;
          } else if (this.opacity >= 1) {
            this.opacity = 1;
            this.twinkleDirection = -1;
          }
        }
      }
    }

    // Create stars
    const stars: Star[] = [];
    for (let i = 0; i < numStars; i++) {
      stars.push(new Star());
    }

    // Animation loop
    let lastTime = performance.now();
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.update(deltaTime);
        star.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [starDensity, allStarsTwinkle, twinkleProbability, minTwinkleSpeed, maxTwinkleSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 h-full w-full", className)}
      style={{ pointerEvents: "none" }}
    />
  );
};
