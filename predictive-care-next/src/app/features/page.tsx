"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Brain,
  Shield,
  Clock,
  Zap,
  LineChart,
  Cpu,
  Bell,
  Database,
  Cloud,
  Lock,
  BarChart3,
  Layers,
  Target,
  Gauge,
  Wifi,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlowOrb, GridBackground } from "@/components/effects/Backgrounds";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/effects/Animations";

const features = [
  {
    icon: Brain,
    title: "Ensemble ML Models",
    description: "Combines Random Forest, XGBoost, Neural Networks, and SVM for maximum accuracy and reliability.",
    gradient: "from-purple-500 to-pink-500",
    stats: "98.5% Accuracy",
  },
  {
    icon: Activity,
    title: "Real-time Monitoring",
    description: "Live sensor data streaming with sub-second latency for immediate insights and responses.",
    gradient: "from-cyan-500 to-blue-500",
    stats: "<100ms Latency",
  },
  {
    icon: Shield,
    title: "Failure Prevention",
    description: "Predict failures up to 72 hours in advance with confidence scoring and risk assessment.",
    gradient: "from-emerald-500 to-teal-500",
    stats: "72h Advance Warning",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Intelligent notification system with severity levels and configurable thresholds.",
    gradient: "from-amber-500 to-orange-500",
    stats: "24/7 Monitoring",
  },
  {
    icon: Database,
    title: "RAG Knowledge Base",
    description: "Retrieval Augmented Generation for context-aware maintenance recommendations.",
    gradient: "from-blue-500 to-indigo-500",
    stats: "1000+ Documents",
  },
  {
    icon: Cloud,
    title: "Edge Computing",
    description: "Process data at the edge for ultra-low latency responses and offline capability.",
    gradient: "from-pink-500 to-rose-500",
    stats: "50% Less Latency",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Deep insights with trend analysis, anomaly detection, and pattern recognition.",
    gradient: "from-violet-500 to-purple-500",
    stats: "100+ Metrics",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "Bank-grade encryption, role-based access control, and audit logging.",
    gradient: "from-gray-500 to-zinc-500",
    stats: "SOC2 Compliant",
  },
  {
    icon: Layers,
    title: "Multi-machine Support",
    description: "Monitor unlimited machines with individual profiles and fleet-wide analytics.",
    gradient: "from-teal-500 to-cyan-500",
    stats: "Unlimited Machines",
  },
];

const techStack = [
  { name: "Python", icon: "🐍" },
  { name: "FastAPI", icon: "⚡" },
  { name: "TensorFlow", icon: "🧠" },
  { name: "XGBoost", icon: "🚀" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "Redis", icon: "⚡" },
  { name: "Next.js", icon: "▲" },
  { name: "Docker", icon: "🐳" },
];

const comparison = [
  { feature: "Prediction Accuracy", us: "98.5%", others: "75-85%" },
  { feature: "Advance Warning", us: "72 hours", others: "24 hours" },
  { feature: "False Positive Rate", us: "<2%", others: "15-20%" },
  { feature: "Setup Time", us: "< 1 day", others: "1-2 weeks" },
  { feature: "ML Models", us: "Ensemble (4+)", others: "Single model" },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Background */}
      <GridBackground className="opacity-30 fixed inset-0" />
      <GlowOrb color="cyan" size="xl" className="fixed top-40 -left-40 opacity-20" />
      <GlowOrb color="purple" size="lg" className="fixed bottom-40 -right-40 opacity-20" />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6">
              <Zap className="h-3 w-3 mr-1" />
              Enterprise Features
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Powerful Features for{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Industrial Excellence
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed">
              Our platform combines cutting-edge AI with practical industrial solutions
              to deliver the most comprehensive predictive maintenance system available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button variant="glow" size="lg">
                  <Brain className="mr-2 h-5 w-5" />
                  Try Live Demo
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <StaggerItem key={feature.title}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="h-full"
                  >
                    <Card variant="glass" className="p-8 h-full group cursor-pointer">
                      <div className="flex items-start justify-between mb-6">
                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} p-0.5`}
                        >
                          <div className="w-full h-full rounded-2xl bg-gray-900 flex items-center justify-center group-hover:bg-transparent transition-colors">
                            <Icon className="h-7 w-7 text-white" />
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {feature.stats}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </Card>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="relative py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Built with Modern Technology
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our platform leverages the latest technologies for maximum performance and reliability.
            </p>
          </FadeIn>
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
              >
                <Card variant="default" className="px-6 py-4 flex items-center gap-3">
                  <span className="text-2xl">{tech.icon}</span>
                  <span className="text-white font-medium">{tech.name}</span>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <Badge className="mb-4">
              <Target className="h-3 w-3 mr-1" />
              Comparison
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why We&apos;re Different
            </h2>
            <p className="text-gray-400">
              See how PredictiveCare compares to traditional solutions.
            </p>
          </FadeIn>

          <Card variant="glass" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-gray-400 font-medium">Feature</th>
                    <th className="text-center p-4 text-cyan-400 font-medium">PredictiveCare</th>
                    <th className="text-center p-4 text-gray-500 font-medium">Others</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, i) => (
                    <motion.tr
                      key={row.feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="border-b border-white/5"
                    >
                      <td className="p-4 text-white">{row.feature}</td>
                      <td className="p-4 text-center">
                        <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium">
                          {row.us}
                        </span>
                      </td>
                      <td className="p-4 text-center text-gray-500">{row.others}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Experience the Difference?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Start your free trial today and see how our AI-powered platform
              can transform your maintenance operations.
            </p>
            <Link href="/contact">
              <Button variant="glow" size="lg" className="group">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
