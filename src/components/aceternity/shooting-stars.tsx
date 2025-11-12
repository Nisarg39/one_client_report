"use client";

import React, { useEffect, useId, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShootingStarsProps {
  minSpeed?: number;
  maxSpeed?: number;
  minDelay?: number;
  maxDelay?: number;
  starColor?: string;
  trailColor?: string;
  starHeight?: number;
  className?: string;
}

interface Star {
  id: string;
  x: number;
  y: number;
  angle: number;
  scale: number;
  speed: number;
  distance: number;
}

export const ShootingStars: React.FC<ShootingStarsProps> = ({
  minSpeed = 10,
  maxSpeed = 30,
  minDelay = 1200,
  maxDelay = 4200,
  starColor = "#9E00FF",
  trailColor = "#2EB9DF",
  starHeight = 1,
  className,
}) => {
  const [star, setStar] = useState<Star | null>(null);
  const svgId = useId();

  useEffect(() => {
    const createStar = () => {
      const yPos = Math.random() * 100;
      const xPos = Math.random() * 100;
      const speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
      const distance = Math.random() * 30 + 20; // Distance the star travels (20-50%)
      const scale = Math.random() * 0.5 + 0.5; // Random scale between 0.5 and 1

      setStar({
        id: `${svgId}-${Date.now()}`,
        x: xPos,
        y: yPos,
        angle: -45, // Diagonal angle from top-left to bottom-right
        scale,
        speed,
        distance,
      });

      const animationDuration = distance / speed;

      setTimeout(() => {
        setStar(null);
      }, animationDuration * 1000);
    };

    const scheduleNextStar = () => {
      const delay = Math.random() * (maxDelay - minDelay) + minDelay;
      setTimeout(() => {
        createStar();
        scheduleNextStar();
      }, delay);
    };

    scheduleNextStar();

    return () => {
      setStar(null);
    };
  }, [minDelay, maxDelay, minSpeed, maxSpeed, svgId]);

  if (!star) return null;

  return (
    <svg
      className={cn("absolute inset-0 h-full w-full", className)}
      style={{ pointerEvents: "none" }}
    >
      <defs>
        <linearGradient id={`gradient-${star.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={trailColor} stopOpacity="0" />
          <stop offset="100%" stopColor={starColor} stopOpacity="1" />
        </linearGradient>
      </defs>
      <motion.line
        key={star.id}
        x1={`${star.x}%`}
        y1={`${star.y}%`}
        x2={`${star.x}%`}
        y2={`${star.y}%`}
        stroke={`url(#gradient-${star.id})`}
        strokeWidth={starHeight}
        strokeLinecap="round"
        initial={{
          x2: `${star.x}%`,
          y2: `${star.y}%`,
          opacity: 1,
        }}
        animate={{
          x2: `${star.x + star.distance}%`,
          y2: `${star.y + star.distance}%`,
          opacity: [1, 1, 0],
        }}
        transition={{
          duration: star.distance / star.speed,
          ease: "easeOut",
        }}
      />
    </svg>
  );
};
