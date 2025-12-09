"use client";

import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Brain, FileText, Sparkles, Users, ArrowRight } from "lucide-react";

export function EducationModeFeatures() {
  const learningJourney = [
    {
      icon: GraduationCap,
      title: "Student Mode",
      description: "Start your learning journey with mock data scenarios. Perfect for learning marketing analytics without real client data. Free forever with 5 practice clients.",
      highlight: "Free forever",
      color: "#FF8C42",
      step: "Start",
    },
    {
      icon: FileText,
      title: "Mock Data Scenarios",
      description: "Practice with realistic case studies. Pre-built scenarios simulate real marketing campaigns without needing actual client data.",
      highlight: "Realistic practice",
      color: "#FF8C42",
      step: "Practice",
    },
    {
      icon: Brain,
      title: "Data Mentor AI",
      description: "Learn with a specialized tutoring agent that guides you through data analysis using the Socratic method. Get hints, not answers.",
      highlight: "Socratic teaching",
      color: "#6CA3A2",
      step: "Learn",
    },
    {
      icon: BookOpen,
      title: "Educational Mode",
      description: "Specialized tutoring agent helps you understand marketing metrics and data analysis concepts. Learn as you go with guided insights.",
      highlight: "Learn as you go",
      color: "#FF8C42",
      step: "Understand",
    },
    {
      icon: Sparkles,
      title: "Quiz Mode",
      description: "Test your knowledge with interactive quizzes. Reinforce learning through practice questions and instant feedback.",
      highlight: "Interactive learning",
      color: "#FF8C42",
      step: "Test",
    },
    {
      icon: Users,
      title: "Instructor Support",
      description: "Connect with instructors who can assign scenarios, track your progress, and provide personalized feedback on your analyses.",
      highlight: "Guided learning",
      color: "#6CA3A2",
      step: "Excel",
    },
  ];

  return (
    <section className="relative bg-[#242424] py-16 sm:py-20 md:py-24">
      {/* Gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-48 sm:h-64 bg-gradient-to-b from-[#242424] via-[#1e1e1e] to-[#1a1a1a] pointer-events-none z-0" />
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 sm:mb-20"
        >
          <div className="inline-block mb-4">
            <span className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-[#FF8C42] to-[#E67A33] text-white shadow-[-4px_-4px_8px_rgba(255,140,66,0.2),4px_4px_8px_rgba(0,0,0,0.6)]">
              Education Mode
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5f5f5] mb-4"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
          >
            Learn Marketing Analytics{" "}
            <span
              className="bg-gradient-to-r from-[#FF8C42] to-[#E67A33] bg-clip-text text-transparent"
              style={{ textShadow: 'none' }}
            >
              Without Risk
            </span>
          </h2>
          <p
            className="text-base sm:text-lg text-[#c0c0c0] max-w-3xl mx-auto"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            Perfect for students, self-learners, and anyone new to marketing analytics. Practice with realistic scenarios and learn from an AI mentor.
          </p>
        </motion.div>

        {/* Learning Journey - Consistent Vertical Flow */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical connecting line (desktop only) */}
          <div className="hidden lg:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#FF8C42] via-[#6CA3A2] to-[#FF8C42] opacity-20" />

          {/* Journey Steps - Consistent Layout */}
          <div className="space-y-12 lg:space-y-16">
            {learningJourney.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-16 lg:pl-20"
              >
                {/* Timeline dot */}
                <div className="hidden lg:block absolute left-0 top-0 w-16 h-16 -ml-8 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-[#242424] border-4 z-10"
                    style={{ 
                      borderColor: item.color,
                      boxShadow: `0 0 16px ${item.color}40`
                    }}
                  />
                </div>

                {/* Step Number Badge (mobile) */}
                <div className="lg:hidden absolute left-0 top-0 w-12 h-12 rounded-full bg-[#242424] border-2 flex items-center justify-center shadow-[-4px_-4px_8px_rgba(60,60,60,0.4),4px_4px_8px_rgba(0,0,0,0.8)]"
                  style={{ borderColor: item.color }}
                >
                  <span className="text-sm font-bold" style={{ color: item.color }}>{index + 1}</span>
                </div>

                {/* Content Container - Consistent Structure */}
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {/* Icon Section - Consistent Size */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-[-8px_-8px_16px_rgba(60,60,60,0.4),8px_8px_16px_rgba(0,0,0,0.8)] border-2 transition-all duration-300 group-hover:shadow-[-8px_-8px_16px_rgba(60,60,60,0.5),8px_8px_16px_rgba(0,0,0,0.9),0_0_24px_rgba(255,140,66,0.2)]"
                      style={{ borderColor: `${item.color}40` }}
                    >
                      <item.icon
                        className="w-10 h-10 sm:w-12 sm:h-12"
                        style={{ color: item.color }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Text Content - Consistent Width */}
                  <div className="flex-1 min-w-0">
                    {/* Step Label */}
                    <div className="mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#151515] inline-block border border-[#2a2a2a]"
                        style={{ color: item.color }}
                      >
                        {item.step}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-xl sm:text-2xl font-bold text-[#f5f5f5] mb-2"
                      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
                    >
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-sm sm:text-base text-[#c0c0c0] leading-relaxed mb-3"
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                    >
                      {item.description}
                    </p>

                    {/* Highlight Badge */}
                    <div className="inline-block">
                      <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#151515] border border-[#2a2a2a]"
                        style={{ color: item.color }}
                      >
                        {item.highlight}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Arrow connector (mobile only) */}
                {index < learningJourney.length - 1 && (
                  <motion.div
                    animate={{
                      y: [0, 6, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.15
                    }}
                    className="lg:hidden absolute left-6 bottom-0 text-[#FF8C42] transform translate-y-full -mb-6"
                  >
                    <ArrowRight className="w-5 h-5 rotate-90" aria-hidden="true" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Key Benefits - Horizontal Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-20"
        >
          <div className="relative rounded-3xl bg-[#151515] shadow-[inset_8px_8px_16px_rgba(0,0,0,0.6),inset_-8px_-8px_16px_rgba(40,40,40,0.3)] p-8 md:p-12 border-t-4 border-[#FF8C42]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-[#2a2a2a]">
              <div className="text-center px-6 md:px-8 py-6 md:py-0">
                <div className="text-4xl sm:text-5xl font-black text-[#FF8C42] mb-2" style={{ textShadow: '0 2px 8px rgba(255,140,66,0.3)' }}>FREE</div>
                <div className="text-sm sm:text-base text-[#c0c0c0] font-medium">Forever for students</div>
              </div>
              <div className="text-center px-6 md:px-8 py-6 md:py-0 border-y md:border-y-0 md:border-x border-[#2a2a2a]">
                <div className="text-4xl sm:text-5xl font-black text-[#FF8C42] mb-2" style={{ textShadow: '0 2px 8px rgba(255,140,66,0.3)' }}>5</div>
                <div className="text-sm sm:text-base text-[#c0c0c0] font-medium">Practice clients</div>
              </div>
              <div className="text-center px-6 md:px-8 py-6 md:py-0">
                <div className="text-4xl sm:text-5xl font-black text-[#FF8C42] mb-2" style={{ textShadow: '0 2px 8px rgba(255,140,66,0.3)' }}>50</div>
                <div className="text-sm sm:text-base text-[#c0c0c0] font-medium">Messages per day</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
