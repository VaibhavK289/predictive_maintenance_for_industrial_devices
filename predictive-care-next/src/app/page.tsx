"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Shield,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  CheckCircle2,
  Brain,
  Cpu,
  Gauge,
  LineChart,
  AlertTriangle,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ParticleField } from "@/components/effects/ParticleField";
import { GlowOrb, GridBackground, GradientBorder } from "@/components/effects/Backgrounds";
import { AnimatedCounter, FadeIn, StaggerContainer, StaggerItem, GlowingText, PulseRing } from "@/components/effects/Animations";

const features = [
  {
    icon: Activity,
    title: "Real-time Monitoring",
    description: "Track machine performance and health metrics in real-time with precision sensors.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Brain,
    title: "AI Predictions",
    description: "Ensemble ML models predict failures 72+ hours before they occur.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Shield,
    title: "Failure Prevention",
    description: "Prevent costly breakdowns and extend equipment lifespan significantly.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Clock,
    title: "24/7 Alerts",
    description: "Instant notifications for critical maintenance needs via multiple channels.",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    icon: Cpu,
    title: "Edge Computing",
    description: "Process sensor data at the edge for ultra-low latency responses.",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: LineChart,
    title: "Advanced Analytics",
    description: "Deep insights with trend analysis, anomaly detection, and pattern recognition.",
    gradient: "from-pink-500 to-rose-500",
  },
];

const stats = [
  { value: 99.9, suffix: "%", label: "Uptime Guarantee" },
  { value: 70, suffix: "%", label: "Downtime Reduction" },
  { value: 98, suffix: "%", label: "Prediction Accuracy" },
  { value: 72, suffix: "h", label: "Early Warning" },
];

const benefits = [
  "Reduce unplanned downtime by up to 70%",
  "Extend equipment lifespan significantly",
  "Lower maintenance costs by 25-30%",
  "Improve operational efficiency",
  "Data-driven decision making",
  "Real-time visibility across all assets",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background Effects */}
        <ParticleField className="opacity-50" />
        <GridBackground />
        <GlowOrb color="cyan" size="xl" className="top-20 -left-40" />
        <GlowOrb color="purple" size="lg" className="bottom-20 -right-20" />
        <GlowOrb color="pink" size="md" className="top-1/2 right-1/4" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8"
              >
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span className="text-cyan-400 text-sm font-medium">
                  AI-Powered Predictive Maintenance
                </span>
              </motion.div>

              {/* Heading */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
                <span className="text-white">Smart</span>
                <br />
                <GlowingText className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Industrial
                </GlowingText>
                <br />
                <span className="text-white">Maintenance</span>
              </h1>

              <p className="text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
                Predict and prevent equipment failures before they happen. 
                Reduce downtime, cut costs, and maximize operational efficiency 
                with our AI-powered platform.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button variant="glow" size="lg" className="w-full sm:w-auto group">
                    <Brain className="mr-2 h-5 w-5" />
                    Launch Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/features">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Explore Features
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-gray-900 flex items-center justify-center"
                    >
                      <span className="text-xs text-gray-400">{String.fromCharCode(65 + i)}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-white font-semibold">500+ Companies</p>
                  <p className="text-gray-500 text-sm">Trust PredictiveCare</p>
                </div>
              </div>
            </motion.div>

            {/* Hero Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <GradientBorder className="rounded-3xl">
                <Card variant="glass" className="p-6 rounded-3xl">
                  {/* Dashboard Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                      <span className="text-gray-400 text-sm">Live Dashboard</span>
                    </div>
                    <Badge variant="success" pulse>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        Online
                      </span>
                    </Badge>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <Card variant="default" className="p-4">
                      <p className="text-sm text-gray-400 mb-1">System Uptime</p>
                      <p className="text-2xl font-bold text-white">
                        <AnimatedCounter from={0} to={99.8} decimals={1} />%
                      </p>
                    </Card>
                    <Card variant="default" className="p-4">
                      <p className="text-sm text-gray-400 mb-1">Active Sensors</p>
                      <p className="text-2xl font-bold text-cyan-400">
                        <AnimatedCounter from={0} to={24} />
                      </p>
                    </Card>
                    <Card variant="default" className="p-4">
                      <p className="text-sm text-gray-400 mb-1">Warnings</p>
                      <p className="text-2xl font-bold text-amber-400">
                        <AnimatedCounter from={0} to={3} />
                      </p>
                    </Card>
                    <Card variant="default" className="p-4">
                      <p className="text-sm text-gray-400 mb-1">Next Maintenance</p>
                      <p className="text-2xl font-bold text-purple-400">12h</p>
                    </Card>
                  </div>

                  {/* Mini Chart */}
                  <Card variant="default" className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-300">Performance</span>
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="h-20 flex items-end justify-between gap-1">
                      {[40, 60, 45, 75, 55, 80, 65, 90, 70, 85, 75, 95].map((height, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                          className="flex-1 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t"
                        />
                      ))}
                    </div>
                  </Card>
                </Card>
              </GradientBorder>

              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6"
              >
                <Card variant="glow" className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <PulseRing className="absolute inset-0" />
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                        <Zap className="h-5 w-5 text-emerald-400" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">All Systems</p>
                      <p className="text-xs text-emerald-400">Operational</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4"
              >
                <Card variant="gradient" className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                      <Brain className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">ML Prediction</p>
                      <p className="text-xs text-cyan-400">98.5% accuracy</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 bg-gray-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <StaggerItem key={stat.label}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <p className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                    <AnimatedCounter from={0} to={stat.value} duration={2 + index * 0.2} />
                    {stat.suffix}
                  </p>
                  <p className="text-gray-400 mt-3 font-medium">{stat.label}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32">
        <GlowOrb color="cyan" size="lg" className="top-1/4 -left-20" />
        <GlowOrb color="purple" size="md" className="bottom-1/4 -right-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-20">
            <Badge className="mb-6">
              <Sparkles className="h-3 w-3 mr-1" />
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                PredictiveCare
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with practical solutions 
              to deliver a complete predictive maintenance ecosystem.
            </p>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <StaggerItem key={feature.title}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card variant="glass" className="p-8 h-full group cursor-pointer">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <div className="w-full h-full rounded-2xl bg-gray-900 flex items-center justify-center">
                          <Icon className="h-7 w-7 text-white" />
                        </div>
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

      {/* Benefits Section */}
      <section className="relative py-32 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="left">
              <Badge className="mb-6">
                <Wrench className="h-3 w-3 mr-1" />
                Benefits
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Transform Your{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Maintenance Operations
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                Move from reactive to proactive maintenance with our intelligent 
                platform that learns and adapts to your equipment&apos;s unique patterns.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors">
                      {benefit}
                    </span>
                  </motion.div>
                ))}
              </div>
            </FadeIn>

            <FadeIn direction="right">
              <GradientBorder className="rounded-3xl">
                <Card variant="glass" className="p-8 rounded-3xl">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-semibold text-white">ROI Calculator</h3>
                    <Badge variant="secondary">Annual Savings</Badge>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Downtime Reduction</span>
                        <span className="font-semibold text-emerald-400">$120,000</span>
                      </div>
                      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "80%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Maintenance Savings</span>
                        <span className="font-semibold text-cyan-400">$80,000</span>
                      </div>
                      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "60%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.4 }}
                          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Equipment Lifespan</span>
                        <span className="font-semibold text-purple-400">$50,000</span>
                      </div>
                      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "40%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.6 }}
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-medium">Total Annual Savings</span>
                      <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                        $250K
                      </span>
                    </div>
                  </div>
                </Card>
              </GradientBorder>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10" />
        <GridBackground className="opacity-30" />
        <GlowOrb color="cyan" size="xl" className="top-1/2 left-1/4 -translate-y-1/2" />
        <GlowOrb color="purple" size="xl" className="top-1/2 right-1/4 -translate-y-1/2" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              Ready to Transform Your{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Operations
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Join hundreds of companies that have revolutionized their maintenance 
              strategy with our AI-powered predictive analytics platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button variant="glow" size="lg" className="group">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  View Live Demo
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
