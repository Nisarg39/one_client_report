"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Mail, MessageSquare, Send, Phone, CheckCircle, XCircle, Clock, FileText, Check, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Link from "next/link";
import { submitContactForm } from "@/backend/server_actions/guestActions";

export function ContactSection() {
  const shouldReduceMotion = useReducedMotion();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
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
      value: "shah.nisarg39@gmail.com",
      href: "mailto:shah.nisarg39@gmail.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 8888215802",
      href: "tel:+918888215802",
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset previous errors and status
    setFieldErrors({});
    setSubmitStatus({ type: null, message: "" });

    // Validate agreement checkbox
    if (!agreedToTerms) {
      setFieldErrors({ terms: "You must agree to the Privacy Policy and Terms & Conditions to submit the form." });
      setIsSubmitting(false);
      return;
    }

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
        setAgreedToTerms(false);

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
      id="get-in-touch"
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#151515] border border-white/5 shadow-neu-inset mb-6">
            <Mail className="w-3 h-3 text-[#6CA3A2]" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#666]">COMM_LINK_v1.0</span>
          </div>
          <h2
            id="contact-heading"
            className="text-4xl sm:text-5xl md:text-7xl font-black text-[#f5f5f5] mb-4 uppercase tracking-tighter"
          >
            Get in <span className="text-[#6CA3A2] italic">Touch</span>
          </h2>
          <p
            className="text-xs sm:text-sm text-[#555] max-w-xl mx-auto font-black uppercase tracking-[0.2em] leading-relaxed"
          >
            Have questions? We&apos;d love to hear from you. Send us a message and
            we&apos;ll respond as soon as possible.
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
            className="lg:col-span-2 h-full"
          >
            <div className="rounded-2xl sm:rounded-3xl bg-[#151515] p-6 sm:p-8 md:p-10 shadow-neu-raised border border-white/5 relative overflow-hidden group h-full flex flex-col">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-100 transition-opacity">
                <FileText className="w-4 h-4 text-[#444]" />
              </div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] flex items-center justify-center shadow-neu-inset border border-white/5">
                  <MessageSquare
                    className="w-5 h-5 text-[#6CA3A2]"
                    aria-hidden="true"
                  />
                </div>
                <h3
                  className="text-xl sm:text-2xl font-black text-[#f5f5f5] uppercase tracking-tighter"
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
                    className={`p-4 rounded-xl flex items-start gap-3 ${submitStatus.type === "success"
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
                      className={`text-sm ${submitStatus.type === "success"
                        ? "text-green-400"
                        : "text-red-400"
                        }`}
                    >
                      {submitStatus.message}
                    </p>
                  </motion.div>
                )}

                {/* Name Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="name"
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-[#555]"
                  >
                    Your Name_
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`h-12 rounded-xl bg-[#1a1a1a] border-white/5 text-[#f5f5f5] placeholder:text-[#333] shadow-neu-inset font-black uppercase tracking-widest text-xs focus-visible:ring-1 focus-visible:ring-[#6CA3A2]/30 transition-all ${fieldErrors.name ? "border-red-900/50" : ""
                      }`}
                  />
                  {fieldErrors.name && (
                    <p className="text-[9px] font-black uppercase tracking-widest text-red-500/80 flex items-center gap-1.5 mt-1 border-l-2 border-red-500/30 pl-3">
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-[#555]"
                  >
                    Email Address_
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`h-12 rounded-xl bg-[#1a1a1a] border-white/5 text-[#f5f5f5] placeholder:text-[#333] shadow-neu-inset font-black uppercase tracking-widest text-xs focus-visible:ring-1 focus-visible:ring-[#6CA3A2]/30 transition-all ${fieldErrors.email ? "border-red-900/50" : ""
                      }`}
                  />
                  {fieldErrors.email && (
                    <p className="text-[9px] font-black uppercase tracking-widest text-red-500/80 flex items-center gap-1.5 mt-1 border-l-2 border-red-500/30 pl-3">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="message"
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-[#555]"
                  >
                    Your Message_
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us what's on your mind..."
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className={`rounded-xl bg-[#1a1a1a] border-white/5 text-[#f5f5f5] placeholder:text-[#333] shadow-neu-inset font-black uppercase tracking-widest text-xs focus-visible:ring-1 focus-visible:ring-[#6CA3A2]/30 transition-all ${fieldErrors.message ? "border-red-900/50" : ""
                      }`}
                  />
                  {fieldErrors.message && (
                    <p className="text-[9px] font-black uppercase tracking-widest text-red-500/80 flex items-center gap-1.5 mt-1 border-l-2 border-red-500/30 pl-3">
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                {/* Terms & Conditions Agreement */}
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setAgreedToTerms(!agreedToTerms);
                        if (fieldErrors.terms) {
                          setFieldErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.terms;
                            return newErrors;
                          });
                        }
                      }}
                      className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 cursor-pointer ${agreedToTerms
                        ? "bg-[#6CA3A2] shadow-neu-inset border-[#6CA3A2]"
                        : "bg-[#1a1a1a] border border-[#6CA3A2]/40 shadow-neu-raised hover:border-[#6CA3A2]/60"
                        }`}
                      aria-label={agreedToTerms ? "Uncheck agreement" : "Check agreement"}
                      aria-pressed={agreedToTerms}
                    >
                      {agreedToTerms && (
                        <Check
                          className="w-3.5 h-3.5 text-white"
                          strokeWidth={4}
                          aria-hidden="true"
                        />
                      )}
                    </button>
                    <input
                      type="checkbox"
                      id="terms-agreement"
                      name="terms-agreement"
                      checked={agreedToTerms}
                      onChange={(e) => {
                        setAgreedToTerms(e.target.checked);
                        if (fieldErrors.terms) {
                          setFieldErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.terms;
                            return newErrors;
                          });
                        }
                      }}
                      className="sr-only"
                      required
                    />
                    <Label
                      htmlFor="terms-agreement"
                      className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#666] leading-relaxed cursor-pointer flex-1"
                    >
                      I agree to the{" "}
                      <Link
                        href="/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#6CA3A2] hover:text-[#7db3b2] underline transition-colors italic"
                      >
                        Privacy Policy
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#6CA3A2] hover:text-[#7db3b2] underline transition-colors italic"
                      >
                        Terms & Conditions
                      </Link>
                    </Label>
                  </div>
                  {fieldErrors.terms && (
                    <p className="text-sm text-red-400 flex items-center gap-1 mt-1 ml-8">
                      <XCircle className="w-4 h-4" />
                      {fieldErrors.terms}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !agreedToTerms}
                  className="w-full sm:w-auto relative overflow-hidden text-[11px] px-10 h-14 rounded-2xl font-black uppercase tracking-[0.2em] group bg-gradient-to-br from-[#FF8C42] to-[#E67A33] text-white shadow-neu-raised transition-all duration-300 hover:shadow-neu-raised-sm active:scale-95 disabled:opacity-40 disabled:grayscale disabled:scale-100 flex items-center justify-center"
                  aria-label={isSubmitting ? "Sending message..." : "Send message"}
                >
                  <span className="relative flex items-center justify-center gap-3">
                    {isSubmitting ? (
                      <>
                        <Activity className="animate-pulse w-5 h-5" />
                        Transmitting...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send
                          className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
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
            className="lg:col-span-1 h-full"
          >
            <div className="rounded-2xl sm:rounded-3xl bg-[#151515] p-6 sm:p-8 shadow-neu-raised border border-white/5 relative overflow-hidden flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] flex items-center justify-center shadow-neu-inset border border-white/5">
                  <Activity className="w-5 h-5 text-[#6CA3A2]" />
                </div>
                <h3 className="text-xl font-black text-[#f5f5f5] uppercase tracking-tighter">
                  Contact Hub
                </h3>
              </div>

              {/* Contact Information */}
              <div className="space-y-8 mb-10">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 shadow-neu-inset border border-white/5 group-hover:shadow-neu-raised transition-all">
                        <Icon className="w-4 h-4 text-[#6CA3A2]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[9px] font-black text-[#444] mb-1 tracking-widest uppercase">
                          {info.label}_
                        </h4>
                        {info.href ? (
                          <a href={info.href} className="text-sm text-[#6CA3A2] font-black italic tracking-tighter hover:text-[#7db3b2] transition-colors">
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-sm text-white font-black tracking-tighter">
                            {info.value}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Protocol Section Divider */}
              <div className="flex items-center gap-4 mb-8">
                <div className="text-[10px] font-black text-[#333] uppercase tracking-[0.4em] whitespace-nowrap">Service Protocols</div>
                <div className="h-px bg-white/5 flex-grow" />
              </div>

              {/* Response Protocols */}
              <div className="grid grid-cols-1 gap-4 mb-10">
                {[
                  { label: "24-Hour Response", desc: "all inquiries synced", icon: Clock },
                  { label: "Free Consultation", desc: "expert sync available", icon: MessageSquare },
                  { label: "WhatsApp Support", desc: "instant node updates", icon: Send }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-[#1a1a1a]/50 border border-white/5 shadow-neu-inset">
                    <item.icon className="w-4 h-4 text-[#6CA3A2] opacity-50" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">{item.label}</span>
                      <span className="text-[8px] font-bold text-[#444] uppercase tracking-[0.2em] mt-1">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Legal Info Divider */}
              <div className="flex items-center gap-4 mb-6">
                <div className="text-[10px] font-black text-[#333] uppercase tracking-[0.4em] whitespace-nowrap">Identity & Nexus</div>
                <div className="h-px bg-white/5 flex-grow" />
              </div>

              {/* Legal Information */}
              <div className="mt-auto">
                <div className="p-4 rounded-xl bg-black/20 border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-[0.03]">
                    <FileText className="w-12 h-12" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-[#555] uppercase tracking-widest leading-relaxed">
                      Operated by Nisarg Manojkumar Shah
                    </span>
                    <span className="text-[9px] font-bold text-[#333] uppercase tracking-[0.1em] mt-2 leading-relaxed">
                      314/25, Netaji Nagar, Wanowrie, Pune - 411040, Maharashtra, India
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
