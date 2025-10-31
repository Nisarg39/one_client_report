"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  CheckCircle,
  Zap,
  TrendingUp,
  Star,
  FileCheck,
  Clock,
  Rocket,
  Award,
  Download,
  Mail,
  BarChart3,
  Target,
} from "lucide-react";

interface IconItemProps {
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  size: string;
  color: string;
  scale: number;
  animation: {
    x: string[];
    y: string[];
    duration: number;
    delay: number;
  };
}

function IconItem({ Icon, size, color, scale, animation }: IconItemProps) {
  return (
    <motion.div
      className="absolute pointer-events-none top-0 left-0"
      initial={{
        x: animation.x[0],
        y: animation.y[0],
        opacity: 0,
        scale: 0,
      }}
      animate={{
        x: animation.x,
        y: animation.y,
        opacity: 1,
        scale: [scale, scale * 1.08, scale * 0.95, scale * 1.05, scale],
        rotate: [0, 8, -5, 10, -7, 3, 0],
      }}
      transition={{
        opacity: {
          duration: 0.8,
          delay: animation.delay,
          ease: "easeOut",
        },
        scale: {
          duration: 0.8,
          delay: animation.delay,
          ease: "easeOut",
        },
        x: {
          duration: animation.duration,
          delay: animation.delay + 0.8,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        },
        y: {
          duration: animation.duration,
          delay: animation.delay + 0.8,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        },
        rotate: {
          duration: animation.duration,
          delay: animation.delay + 0.8,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        },
      }}
      aria-hidden="true"
    >
      <div style={{ color }} className="flex items-center justify-center opacity-20">
        <Icon className={`${size} antialiased`} strokeWidth={1.5} />
      </div>
    </motion.div>
  );
}

export function FloatingCTAIcons() {
  // Free-flowing motion for CTA-related icons
  const iconConfigs = [
    {
      scale: 0.8,
      animation: {
        x: ["5vw", "40vw", "75vw", "85vw", "60vw", "20vw", "10vw", "5vw"],
        y: ["10vh", "25vh", "60vh", "80vh", "70vh", "35vh", "15vh", "10vh"],
        duration: 35,
        delay: 0
      }
    },
    {
      scale: 1,
      animation: {
        x: ["85vw", "60vw", "20vw", "5vw", "30vw", "70vw", "90vw", "85vw"],
        y: ["20vh", "50vh", "75vh", "85vh", "60vh", "30vh", "15vh", "20vh"],
        duration: 38,
        delay: 1
      }
    },
    {
      scale: 0.9,
      animation: {
        x: ["10vw", "50vw", "80vw", "90vw", "65vw", "35vw", "15vw", "10vw"],
        y: ["40vh", "70vh", "85vh", "60vh", "25vh", "10vh", "35vh", "40vh"],
        duration: 40,
        delay: 2
      }
    },
    {
      scale: 0.85,
      animation: {
        x: ["75vw", "45vw", "15vw", "5vw", "40vw", "70vw", "85vw", "75vw"],
        y: ["55vh", "20vh", "10vh", "40vh", "75vh", "85vh", "65vh", "55vh"],
        duration: 42,
        delay: 0.5
      }
    },
    {
      scale: 0.95,
      animation: {
        x: ["90vw", "55vw", "20vw", "10vw", "45vw", "75vw", "88vw", "90vw"],
        y: ["30vh", "15vh", "45vh", "70vh", "85vh", "60vh", "25vh", "30vh"],
        duration: 37,
        delay: 1.5
      }
    },
    {
      scale: 1,
      animation: {
        x: ["12vw", "45vw", "70vw", "85vw", "60vw", "25vw", "8vw", "12vw"],
        y: ["65vh", "30vh", "15vh", "40vh", "75vh", "85vh", "70vh", "65vh"],
        duration: 39,
        delay: 3
      }
    },
    {
      scale: 0.9,
      animation: {
        x: ["70vw", "40vw", "10vw", "5vw", "35vw", "65vw", "82vw", "70vw"],
        y: ["18vh", "50vh", "80vh", "85vh", "55vh", "25vh", "12vh", "18vh"],
        duration: 36,
        delay: 2.5
      }
    },
    {
      scale: 0.85,
      animation: {
        x: ["88vw", "60vw", "25vw", "8vw", "40vw", "75vw", "90vw", "88vw"],
        y: ["50vh", "35vh", "70vh", "85vh", "80vh", "45vh", "20vh", "50vh"],
        duration: 43,
        delay: 1
      }
    },
    {
      scale: 0.75,
      animation: {
        x: ["92vw", "65vw", "30vw", "10vw", "45vw", "80vw", "95vw", "92vw"],
        y: ["8vh", "40vh", "75vh", "88vh", "70vh", "35vh", "10vh", "8vh"],
        duration: 41,
        delay: 3.5
      }
    },
    {
      scale: 0.9,
      animation: {
        x: ["3vw", "35vw", "70vw", "88vw", "75vw", "40vw", "5vw", "3vw"],
        y: ["45vh", "75vh", "88vh", "65vh", "30vh", "10vh", "40vh", "45vh"],
        duration: 44,
        delay: 2
      }
    },
    {
      scale: 0.8,
      animation: {
        x: ["80vw", "50vw", "20vw", "5vw", "38vw", "72vw", "85vw", "80vw"],
        y: ["78vh", "35vh", "15vh", "45vh", "80vh", "88vh", "75vh", "78vh"],
        duration: 38,
        delay: 0
      }
    },
    {
      scale: 0.85,
      animation: {
        x: ["93vw", "68vw", "35vw", "12vw", "50vw", "82vw", "95vw", "93vw"],
        y: ["62vh", "85vh", "90vh", "70vh", "40vh", "18vh", "58vh", "62vh"],
        duration: 45,
        delay: 4
      }
    },
    {
      scale: 0.95,
      animation: {
        x: ["87vw", "58vw", "25vw", "8vw", "42vw", "78vw", "90vw", "87vw"],
        y: ["38vh", "15vh", "10vh", "45vh", "78vh", "85vh", "55vh", "38vh"],
        duration: 40,
        delay: 1.5
      }
    },
    {
      scale: 0.8,
      animation: {
        x: ["8vw", "42vw", "78vw", "92vw", "70vw", "38vw", "10vw", "8vw"],
        y: ["28vh", "68vh", "88vh", "65vh", "32vh", "12vh", "25vh", "28vh"],
        duration: 46,
        delay: 3
      }
    },
  ];

  const icons = [
    {
      Icon: Shield,
      size: "w-8 h-8 md:w-10 md:h-10",
      color: "#6CA3A2", // Teal - Security
    },
    {
      Icon: Lock,
      size: "w-8 h-8 md:w-10 md:h-10",
      color: "#6CA3A2", // Teal - Security
    },
    {
      Icon: CheckCircle,
      size: "w-8 h-8 md:w-10 md:h-10",
      color: "#4CAF50", // Green - Success
    },
    {
      Icon: Zap,
      size: "w-8 h-8 md:w-10 md:h-10",
      color: "#FF8C42", // Orange - Speed
    },
    {
      Icon: TrendingUp,
      size: "w-8 h-8 md:w-10 md:h-10",
      color: "#4CAF50", // Green - Growth
    },
    {
      Icon: Star,
      size: "w-8 h-8 md:w-10 md:h-10",
      color: "#FFD700", // Gold - Rating
    },
    {
      Icon: FileCheck,
      size: "w-8 h-8 md:w-10 md:h-10",
      color: "#6CA3A2", // Teal - Reports
    },
    {
      Icon: Clock,
      size: "w-8 h-8 md:w-10 md:h-10",
      color: "#FF8C42", // Orange - Time savings
    },
    {
      Icon: Rocket,
      size: "w-8 h-8 md:w-10 md:h-10",
      color: "#FF8C42", // Orange - Launch/Start
    },
    {
      Icon: Award,
      size: "w-8 h-8 md:w-10 md:h-10",
      color: "#FFD700", // Gold - Achievement
    },
    {
      Icon: Download,
      size: "w-8 h-8 md:w-10 md:h-10",
      color: "#6CA3A2", // Teal - Action
    },
    {
      Icon: Mail,
      size: "w-8 h-8 md:w-10 md:h-10",
      color: "#6CA3A2", // Teal - Communication
    },
    {
      Icon: BarChart3,
      size: "w-8 h-8 md:w-10 md:h-10",
      color: "#4CAF50", // Green - Analytics
    },
    {
      Icon: Target,
      size: "w-8 h-8 md:w-10 md:h-10",
      color: "#FF8C42", // Orange - Goal
    },
  ];

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {icons.map((iconProps, index) => (
        <IconItem
          key={index}
          {...iconProps}
          scale={iconConfigs[index].scale}
          animation={iconConfigs[index].animation}
        />
      ))}
    </div>
  );
}
