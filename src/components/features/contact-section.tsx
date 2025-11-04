"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Mail, MessageSquare, Send, MapPin, Phone, CheckCircle, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { submitContactForm } from "@/backend/server_actions/guestActions";

export function ContactSection() {
  const shouldReduceMotion = useReducedMotion();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "hello@onereport.com",
      href: "mailto:hello@onereport.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 8888215802",
      href: "tel:+918888215802",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Pune, India",
      href: null,
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset previous errors and status
    setFieldErrors({});
    setSubmitStatus({ type: null, message: "" });
    setIsSubmitting(true);

    try {
      // Create FormData from the form
      const form = e.currentTarget;
      const formDataToSubmit = new FormData(form);

      // Call server action
      const result = await submitContactForm(formDataToSubmit);

      if (result.success) {
        // Success - show success message and reset form
        setSubmitStatus({
          type: "success",
          message: result.message,
        });
        setFormData({ name: "", email: "", message: "" });

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus({ type: null, message: "" });
        }, 5000);
      } else {
        // Error - show error message and field-specific errors
        setSubmitStatus({
          type: "error",
          message: result.message,
        });

        if (result.errors) {
          setFieldErrors(result.errors);
        }
      }
    } catch (error) {
      // Unexpected error
      console.error("Form submission error:", error);
      setSubmitStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <motion.section
      initial={{ opacity: 1 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative bg-[#1a1a1a] pt-0 pb-16 sm:pb-20 md:pb-24 overflow-hidden"
      aria-labelledby="contact-heading"
    >
      {/* Seamless gradient transition from Final CTA section */}
      <div className="absolute top-0 left-0 right-0 h-32 sm:h-48 bg-gradient-to-b from-transparent to-transparent pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto px-4 pt-16 sm:pt-20 md:pt-24 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2
            id="contact-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5f5f5] mb-4"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}
          >
            Get in Touch
          </h2>
          <p
            className="text-base sm:text-lg md:text-xl text-[#c0c0c0] max-w-2xl mx-auto"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
          >
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.5,
              delay: shouldReduceMotion ? 0 : 0.2,
            }}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl sm:rounded-3xl bg-[#151515] p-6 sm:p-8 md:p-10 shadow-[-12px_-12px_24px_rgba(40,40,40,0.3),12px_12px_24px_rgba(0,0,0,0.6)]">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-[-6px_-6px_12px_rgba(50,50,50,0.4),6px_6px_12px_rgba(0,0,0,0.7)]">
                  <MessageSquare
                    className="w-6 h-6 text-[#6CA3A2]"
                    aria-hidden="true"
                  />
                </div>
                <h3
                  className="text-xl sm:text-2xl font-bold text-[#f5f5f5]"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                >
                  Send us a Message
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Success/Error Alert */}
                {submitStatus.type && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl flex items-start gap-3 ${
                      submitStatus.type === "success"
                        ? "bg-green-900/20 border border-green-800/30"
                        : "bg-red-900/20 border border-red-800/30"
                    }`}
                  >
                    {submitStatus.type === "success" ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <p
                      className={`text-sm ${
                        submitStatus.type === "success"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {submitStatus.message}
                    </p>
                  </motion.div>
                )}

                {/* Name Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm sm:text-base text-[#c0c0c0] font-medium"
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                  >
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`h-12 rounded-xl bg-[#1a1a1a] border-[#2a2a2a] text-[#f5f5f5] placeholder:text-[#666] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(40,40,40,0.2)] focus-visible:ring-2 focus-visible:ring-[#6CA3A2] focus-visible:border-[#6CA3A2] transition-all ${
                      fieldErrors.name ? "border-red-500/50" : ""
                    }`}
                  />
                  {fieldErrors.name && (
                    <p className="text-sm text-red-400 flex items-center gap-1 mt-1">
                      <XCircle className="w-4 h-4" />
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm sm:text-base text-[#c0c0c0] font-medium"
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`h-12 rounded-xl bg-[#1a1a1a] border-[#2a2a2a] text-[#f5f5f5] placeholder:text-[#666] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(40,40,40,0.2)] focus-visible:ring-2 focus-visible:ring-[#6CA3A2] focus-visible:border-[#6CA3A2] transition-all ${
                      fieldErrors.email ? "border-red-500/50" : ""
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="text-sm text-red-400 flex items-center gap-1 mt-1">
                      <XCircle className="w-4 h-4" />
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="text-sm sm:text-base text-[#c0c0c0] font-medium"
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                  >
                    Your Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us what's on your mind..."
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className={`rounded-xl bg-[#1a1a1a] border-[#2a2a2a] text-[#f5f5f5] placeholder:text-[#666] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(40,40,40,0.2)] focus-visible:ring-2 focus-visible:ring-[#6CA3A2] focus-visible:border-[#6CA3A2] transition-all ${
                      fieldErrors.message ? "border-red-500/50" : ""
                    }`}
                  />
                  {fieldErrors.message && (
                    <p className="text-sm text-red-400 flex items-center gap-1 mt-1">
                      <XCircle className="w-4 h-4" />
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto relative overflow-hidden text-base px-8 md:px-10 h-12 sm:h-14 rounded-3xl font-semibold group bg-gradient-to-br from-[#FF8C42] to-[#E67A33] text-white shadow-[-10px_-10px_24px_rgba(70,70,70,0.5),10px_10px_24px_rgba(0,0,0,0.9),inset_-2px_-2px_6px_rgba(0,0,0,0.3),inset_2px_2px_6px_rgba(255,140,66,0.3)] hover:shadow-[-8px_-8px_20px_rgba(70,70,70,0.5),8px_8px_20px_rgba(0,0,0,0.9),inset_-2px_-2px_6px_rgba(0,0,0,0.3),inset_2px_2px_6px_rgba(255,140,66,0.4)] active:shadow-[inset_8px_8px_16px_rgba(179,87,28,0.7),inset_-8px_-8px_16px_rgba(255,140,66,0.2)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 focus:ring-2 focus:ring-[#FF8C42] focus:ring-offset-2 focus:ring-offset-[#151515] focus:outline-none"
                  aria-label={isSubmitting ? "Sending message..." : "Send message"}
                  style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
                >
                  <span className="relative flex items-center justify-center">
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send
                          className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.5,
              delay: shouldReduceMotion ? 0 : 0.3,
            }}
            className="space-y-6"
          >
            {/* Contact Info Cards */}
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              const content = (
                <div className="p-6 rounded-2xl bg-[#151515] shadow-[-8px_-8px_16px_rgba(40,40,40,0.3),8px_8px_16px_rgba(0,0,0,0.6)] hover:shadow-[-6px_-6px_12px_rgba(40,40,40,0.3),6px_6px_12px_rgba(0,0,0,0.6)] transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 shadow-[-6px_-6px_12px_rgba(50,50,50,0.4),6px_6px_12px_rgba(0,0,0,0.7)]">
                      <Icon
                        className="w-5 h-5 text-[#6CA3A2]"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1">
                      <h4
                        className="text-sm font-semibold text-[#c0c0c0] mb-1"
                        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                      >
                        {info.label}
                      </h4>
                      <p
                        className="text-base sm:text-lg text-[#f5f5f5] font-medium"
                        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                      >
                        {info.value}
                      </p>
                    </div>
                  </div>
                </div>
              );

              return info.href ? (
                <a
                  key={index}
                  href={info.href}
                  className="block"
                  aria-label={`${info.label}: ${info.value}`}
                >
                  {content}
                </a>
              ) : (
                <div key={index}>{content}</div>
              );
            })}

            {/* Response Time & Support */}
            <div className="p-6 rounded-2xl bg-[#151515] shadow-[-8px_-8px_16px_rgba(40,40,40,0.3),8px_8px_16px_rgba(0,0,0,0.6)]">
              <h4
                className="text-lg font-bold text-[#f5f5f5] mb-4"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
              >
                Quick Response Guarantee
              </h4>
              <div className="space-y-3 text-sm text-[#c0c0c0]">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6CA3A2] mt-1.5 flex-shrink-0" />
                  <p style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
                    <span className="text-[#f5f5f5] font-semibold">24-hour response</span> to all inquiries
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6CA3A2] mt-1.5 flex-shrink-0" />
                  <p style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
                    <span className="text-[#f5f5f5] font-semibold">Free consultation</span> call available
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6CA3A2] mt-1.5 flex-shrink-0" />
                  <p style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
                    <span className="text-[#f5f5f5] font-semibold">WhatsApp support</span> for instant updates
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
                <p
                  className="text-xs text-[#999]"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                >
                  Available 7 days a week. We're here to help you succeed!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
