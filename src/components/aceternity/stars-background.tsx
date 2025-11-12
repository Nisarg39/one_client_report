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

    type Star = {
      x: number;
      y: number;
      radius: number;
      opacity: number;
      twinkleSpeed: number | null;
      twinkleDirection: number;
      draw: () => void;
      update: (deltaTime: number) => void;
    };

    const createStar = (): Star => {
      const initialX = Math.random() * (canvas?.width || window.innerWidth);
      const initialY = Math.random() * (canvas?.height || window.innerHeight);
      const initialOpacity = Math.random();
      const shouldTwinkle = allStarsTwinkle || Math.random() < twinkleProbability;
      const twinkleSpeedValue = shouldTwinkle
        ? Math.random() * (maxTwinkleSpeed - minTwinkleSpeed) + minTwinkleSpeed
        : null;
      const twinkleDirectionValue = Math.random() < 0.5 ? -1 : 1;
      const radius = Math.random() * 1.5;

      const star: Star = {
        x: initialX,
        y: initialY,
        radius,
        opacity: initialOpacity,
        twinkleSpeed: twinkleSpeedValue,
        twinkleDirection: twinkleDirectionValue,
        draw: () => {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
          ctx.fill();
        },
        update: (deltaTime: number) => {
          if (star.twinkleSpeed !== null) {
            star.opacity += star.twinkleDirection * star.twinkleSpeed * deltaTime;

            if (star.opacity <= 0) {
              star.opacity = 0;
              star.twinkleDirection = 1;
            } else if (star.opacity >= 1) {
              star.opacity = 1;
              star.twinkleDirection = -1;
            }
          }
        },
      };

      return star;
    };

    // Create stars
    const stars: Star[] = Array.from({ length: numStars }, createStar);

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
