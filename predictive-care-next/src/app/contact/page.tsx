"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  CheckCircle,
  Loader2,
  Building,
  Users,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlowOrb, GridBackground, GradientBorder } from "@/components/effects/Backgrounds";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/effects/Animations";
import { cn } from "@/lib/utils";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "contact@predictivecare.ai",
    href: "mailto:contact@predictivecare.ai",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "123 Innovation Drive, San Francisco, CA 94105",
    href: "#",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon-Fri: 9AM - 6PM PST",
    href: "#",
  },
];

const inquiryTypes = [
  { id: "demo", label: "Request a Demo", icon: MessageSquare },
  { id: "sales", label: "Talk to Sales", icon: Building },
  { id: "support", label: "Technical Support", icon: Users },
  { id: "partnership", label: "Partnership", icon: Users },
];

const faqs = [
  {
    q: "How quickly can I get started?",
    a: "Most implementations take less than 24 hours. Our team will guide you through the entire process.",
  },
  {
    q: "Do you offer a free trial?",
    a: "Yes! We offer a 14-day free trial with full access to all features and dedicated support.",
  },
  {
    q: "What industries do you serve?",
    a: "We serve manufacturing, energy, mining, transportation, and any industry with critical equipment.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. We're SOC2 compliant with bank-grade encryption and strict data privacy controls.",
  },
];

export default function Contact() {
  const [selectedType, setSelectedType] = useState("demo");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Background */}
      <GridBackground className="opacity-30 fixed inset-0" />
      <GlowOrb color="cyan" size="xl" className="fixed top-40 -left-40 opacity-20" />
      <GlowOrb color="purple" size="lg" className="fixed bottom-40 -right-40 opacity-20" />

      {/* Hero */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <Badge className="mb-6">
              <MessageSquare className="h-3 w-3 mr-1" />
              Contact Us
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Let&apos;s Start a{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Conversation
              </span>
            </h1>
            <p className="text-xl text-gray-400">
              Ready to transform your maintenance operations? Our team is here to help.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <FadeIn direction="left">
                <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
                <div className="space-y-4">
                  {contactInfo.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                      >
                        <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors">
                          <Icon className="h-5 w-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{item.label}</p>
                          <p className="text-white group-hover:text-cyan-400 transition-colors">
                            {item.value}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </FadeIn>

              {/* FAQ */}
              <FadeIn direction="left" className="pt-8">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {faqs.map((faq, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card variant="default" className="p-4">
                        <p className="text-white font-medium mb-2">{faq.q}</p>
                        <p className="text-gray-400 text-sm">{faq.a}</p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <FadeIn direction="right">
                <GradientBorder className="rounded-2xl">
                  <Card variant="glass" className="p-8 rounded-2xl">
                    {isSubmitted ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12"
                      >
                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                          <CheckCircle className="h-8 w-8 text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          Message Sent!
                        </h3>
                        <p className="text-gray-400 mb-6">
                          Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsSubmitted(false);
                            setFormData({
                              name: "",
                              email: "",
                              company: "",
                              phone: "",
                              message: "",
                            });
                          }}
                        >
                          Send Another Message
                        </Button>
                      </motion.div>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold text-white mb-6">
                          Send us a Message
                        </h2>

                        {/* Inquiry Type */}
                        <div className="mb-6">
                          <label className="text-sm text-gray-400 mb-3 block">
                            What can we help you with?
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {inquiryTypes.map((type) => {
                              const Icon = type.icon;
                              return (
                                <button
                                  key={type.id}
                                  type="button"
                                  onClick={() => setSelectedType(type.id)}
                                  className={cn(
                                    "p-3 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-2",
                                    selectedType === type.id
                                      ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400"
                                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                                  )}
                                >
                                  <Icon className="h-5 w-5" />
                                  <span className="text-xs">{type.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm text-gray-400 mb-2 block">
                                Full Name *
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                                placeholder="John Doe"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-gray-400 mb-2 block">
                                Work Email *
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                                placeholder="john@company.com"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm text-gray-400 mb-2 block">
                                Company
                              </label>
                              <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                                placeholder="Acme Inc."
                              />
                            </div>
                            <div>
                              <label className="text-sm text-gray-400 mb-2 block">
                                Phone Number
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                                placeholder="+1 (555) 000-0000"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-sm text-gray-400 mb-2 block">
                              Message *
                            </label>
                            <textarea
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              required
                              rows={5}
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors resize-none"
                              placeholder="Tell us about your project or question..."
                            />
                          </div>

                          <Button
                            type="submit"
                            variant="glow"
                            size="lg"
                            className="w-full"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="mr-2 h-5 w-5" />
                                Send Message
                              </>
                            )}
                          </Button>

                          <p className="text-xs text-gray-500 text-center">
                            By submitting this form, you agree to our{" "}
                            <a href="/privacy" className="text-cyan-400 hover:underline">
                              Privacy Policy
                            </a>
                            .
                          </p>
                        </form>
                      </>
                    )}
                  </Card>
                </GradientBorder>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section Placeholder */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Card variant="glass" className="p-1 overflow-hidden rounded-2xl">
              <div className="h-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                  <p className="text-white font-medium">San Francisco, California</p>
                  <p className="text-gray-400 text-sm">123 Innovation Drive, Suite 400</p>
                </div>
              </div>
            </Card>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
