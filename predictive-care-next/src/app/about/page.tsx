"use client";

import { motion } from "framer-motion";
import {
  Users,
  Target,
  Lightbulb,
  Award,
  Globe,
  Linkedin,
  Twitter,
  Github,
  ArrowRight,
  Heart,
  Zap,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlowOrb, GridBackground } from "@/components/effects/Backgrounds";
import { FadeIn, StaggerContainer, StaggerItem, AnimatedCounter } from "@/components/effects/Animations";

const team = [
  {
    name: "Dr. Sarah Chen",
    role: "CEO & Co-Founder",
    bio: "Former ML Lead at Google with 15+ years in predictive analytics.",
    avatar: "SC",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    name: "Marcus Rodriguez",
    role: "CTO & Co-Founder",
    bio: "Ex-AWS principal engineer specializing in IoT and edge computing.",
    avatar: "MR",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    name: "Dr. Emily Watson",
    role: "Head of AI Research",
    bio: "PhD in Machine Learning from MIT, 50+ published papers.",
    avatar: "EW",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    name: "James Park",
    role: "VP of Engineering",
    bio: "20+ years building scalable industrial systems at scale.",
    avatar: "JP",
    gradient: "from-amber-500 to-orange-500",
  },
];

const values = [
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "We push the boundaries of what's possible with AI and machine learning.",
  },
  {
    icon: Target,
    title: "Customer Obsession",
    description: "Every feature we build starts with solving real customer problems.",
  },
  {
    icon: Users,
    title: "Collaborative Spirit",
    description: "We believe the best solutions come from diverse perspectives.",
  },
  {
    icon: Heart,
    title: "Sustainable Impact",
    description: "We're committed to reducing industrial waste and environmental impact.",
  },
];

const milestones = [
  { year: "2019", event: "Founded in San Francisco" },
  { year: "2020", event: "First enterprise customer" },
  { year: "2021", event: "Series A funding ($12M)" },
  { year: "2022", event: "500+ machines monitored" },
  { year: "2023", event: "Series B funding ($40M)" },
  { year: "2024", event: "Launched AI Assistant" },
  { year: "2025", event: "Global expansion" },
];

const stats = [
  { value: 500, suffix: "+", label: "Enterprise Customers" },
  { value: 10000, suffix: "+", label: "Machines Monitored" },
  { value: 99.9, suffix: "%", label: "Uptime SLA" },
  { value: 50, suffix: "+", label: "Countries Served" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Background */}
      <GridBackground className="opacity-30 fixed inset-0" />
      <GlowOrb color="purple" size="xl" className="fixed top-40 -right-40 opacity-20" />
      <GlowOrb color="cyan" size="lg" className="fixed bottom-40 -left-40 opacity-20" />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6">
              <Globe className="h-3 w-3 mr-1" />
              About Us
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              We&apos;re on a Mission to{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Revolutionize Industry
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed">
              Founded by a team of AI researchers and industrial engineers, PredictiveCare 
              is transforming how the world maintains its critical equipment.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-16 bg-gray-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <motion.div whileHover={{ scale: 1.05 }} className="text-center">
                  <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    <AnimatedCounter from={0} to={stat.value} duration={2} />
                    {stat.suffix}
                  </p>
                  <p className="text-gray-400 mt-2">{stat.label}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <FadeIn direction="left">
              <Card variant="gradient" className="p-8 h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-6">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                <p className="text-gray-400 leading-relaxed">
                  To eliminate unplanned downtime in industrial operations worldwide 
                  through intelligent predictive maintenance, saving companies billions 
                  in lost productivity while reducing environmental impact.
                </p>
              </Card>
            </FadeIn>
            <FadeIn direction="right">
              <Card variant="gradient" className="p-8 h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6">
                  <Lightbulb className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
                <p className="text-gray-400 leading-relaxed">
                  A world where every machine is self-aware, every failure is predicted, 
                  and maintenance is proactive rather than reactive. We envision 
                  industries running at peak efficiency with zero unexpected stops.
                </p>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-20 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <Badge className="mb-4">
              <Heart className="h-3 w-3 mr-1" />
              Our Values
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Drives Us
            </h2>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <StaggerItem key={value.title}>
                  <Card variant="glass" className="p-6 text-center h-full">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                    <p className="text-gray-400 text-sm">{value.description}</p>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Team */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <Badge className="mb-4">
              <Users className="h-3 w-3 mr-1" />
              Leadership
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Industry veterans and AI pioneers working together to solve 
              the most challenging problems in industrial maintenance.
            </p>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <StaggerItem key={member.name}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card variant="glass" className="p-6 text-center group">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.gradient} p-0.5 mx-auto mb-4`}>
                      <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-2xl font-bold text-white">
                        {member.avatar}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-cyan-400 text-sm mb-3">{member.role}</p>
                    <p className="text-gray-400 text-sm">{member.bio}</p>
                    <div className="flex justify-center gap-3 mt-4">
                      <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                        <Linkedin className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                        <Twitter className="h-4 w-4" />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative py-20 bg-gray-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <Badge className="mb-4">
              <Zap className="h-3 w-3 mr-1" />
              Our Journey
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Key Milestones
            </h2>
          </FadeIn>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500" />

            <div className="space-y-8">
              {milestones.map((milestone, i) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-4 md:gap-8 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"} hidden md:block`}>
                    {i % 2 === 0 && (
                      <Card variant="glass" className="p-4 inline-block">
                        <p className="text-white font-medium">{milestone.event}</p>
                      </Card>
                    )}
                  </div>
                  <div className="relative z-10 w-8 h-8 rounded-full bg-gray-900 border-2 border-cyan-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                    <span className="text-cyan-400 font-bold">{milestone.year}</span>
                    <Card variant="glass" className="p-4 mt-2 md:hidden">
                      <p className="text-white font-medium">{milestone.event}</p>
                    </Card>
                    {i % 2 !== 0 && (
                      <Card variant="glass" className="p-4 inline-block hidden md:block">
                        <p className="text-white font-medium">{milestone.event}</p>
                      </Card>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Join Our Journey
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              We&apos;re always looking for talented individuals who share our passion 
              for innovation and making a real impact in the industrial world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button variant="glow" size="lg" className="group">
                  Get in Touch
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/careers">
                <Button variant="outline" size="lg">
                  View Careers
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
